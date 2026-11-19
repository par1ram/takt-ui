import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, posix, resolve } from "node:path";
import { promisify } from "node:util";
import ts from "typescript";
import { chromium } from "playwright";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3000").origin;
async function fetchJson(path) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  return response.json();
}
// A full collection can mask a dependency missing from a single-component install.
function checkItemImports(item) {
  const paths = new Set(item.files.map(file => file.path));
  const packages = new Set(["react", "react-dom", "next", ...(item.dependencies ?? [])]);
  for (const file of item.files.filter(file => /\.tsx?$/.test(file.path))) {
    for (const { fileName: specifier } of ts.preProcessFile(file.content, true, true).importedFiles) {
      const missing = item.name + " → " + file.path + " → " + specifier;
      if (specifier === "@/lib/utils") continue; // Provided by shadcn init.
      if (specifier.startsWith("@/components/ui/")) {
        assert.ok(item.registryDependencies?.includes(specifier.slice("@/components/ui/".length)), missing);
      } else if (specifier.startsWith(".") || specifier.startsWith("@/")) {
        const path = specifier.startsWith(".") ? posix.join(posix.dirname(file.path), specifier) : specifier.slice(2);
        assert.ok([path, path + ".tsx", path + ".ts", path + "/index.tsx", path + "/index.ts"].some(candidate => paths.has(candidate)), missing);
      } else {
        const name = specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");
        assert.ok(packages.has(name), missing);
      }
    }
  }
}

const index = await fetchJson("/agents/search.json");
const matches = index.components.filter(item => /send a message/i.test(item.task) && /draft/i.test(item.task));
assert.deepEqual(matches.map(item => item.name), ["chat-composer"]);
const composer = await fetchJson(matches[0].guide);
assert.ok(composer.related.some(path => path.endsWith("/message-thread.json")));

const app = await mkdtemp(join(tmpdir(), "takt-consumer-"));
const shadcn = resolve("node_modules/.bin/shadcn");
const execute = promisify(execFile);
async function run(cmd, args) {
  const { stdout } = await execute(cmd, args, { cwd: app, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return stdout;
}
async function put(path, data) {
  await mkdir(join(app, dirname(path)), { recursive: true });
  await writeFile(join(app, path), data);
}
const manifest = JSON.parse(await readFile("package.json", "utf8"));
const versions = { ...manifest.dependencies, ...manifest.devDependencies };
const packages = names => Object.fromEntries(names.map(name => [name, versions[name]]));
const adapt = code => code.replaceAll("@/components/ui/", "@/design/ui/");

let server;
let browser;
try {
  await put("package.json", JSON.stringify({
    name: "takt-consumer", private: true, packageManager: manifest.packageManager,
    dependencies: packages(["next", "react", "react-dom"]),
    devDependencies: { ...packages(["typescript", "@types/react", "@types/node", "@types/react-dom", "tailwindcss"]), "@tailwindcss/postcss": versions.tailwindcss },
  }));
  await put("tsconfig.json", JSON.stringify({
    compilerOptions: { target: "ES2022", jsx: "react-jsx", lib: ["esnext", "dom", "dom.iterable"],
      strict: true, skipLibCheck: true, module: "esnext", moduleResolution: "bundler", noEmit: true,
      esModuleInterop: true, paths: { "@/*": ["./*"] } },
    exclude: ["node_modules"],
  }));
  await put("next.config.mjs", "export default {};");
  await put("postcss.config.mjs", 'export default { plugins: { "@tailwindcss/postcss": {} } };');
  await put("app/globals.css", '@import "tailwindcss";\n@theme { --color-background: #fff; --color-foreground: #151515; }\n.dark { --color-background: #151515; --color-foreground: #fff; }');
  await put("app/layout.tsx", 'import "./globals.css";\nexport default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }');
  await put("app/page.tsx", 'export default function Page() { return <main />; }');
  await run("bun", ["install"]);
  await run(shadcn, ["init", "--base", "radix", "--preset", "nova", "--yes"]);
  const config = JSON.parse(await readFile(join(app, "components.json"), "utf8"));
  await put("components.json", JSON.stringify({
    ...config,
    aliases: { ...config.aliases, ui: "@/design/ui" },
    registries: { "@takt": origin + "/r/{name}.json", "@takt-ru": origin + "/r/ru/{name}.json" },
  }));

  const search = await run(shadcn, ["search", "@takt", "--query", "draft", "--json"]);
  assert.match(search, /chat-composer/);
  assert.match(await run(shadcn, ["view", "@takt/" + composer.name]), /ChatComposer/);
  await run(shadcn, ["add", "@takt/" + composer.name, "@takt/chat-post", "--yes"]);
  const demo = await fetchJson(composer.registryExample);
  assert.equal(demo.files[0].content, composer.example);
  await run(shadcn, ["add", "@takt/" + demo.name, "@takt/message-reactions-demo", "--yes"]);

  await put("app/page.tsx", `import TeamMessage from "@/components/chat-composer-demo";
import Reactions from "@/components/message-reactions-demo";
import { ChatPostBody } from "@/design/ui/chat-post";
export default function Page() {
  return <><ChatPostBody post={{ id: "1", author: "Sam", initials: "S", time: "10:00", text: "Review", resource: { title: "Guide", detail: "v1", href: "/guide" } }}><Reactions /></ChatPostBody><TeamMessage /></>;
}`);
  await run("bun", ["run", "next", "build"]);
  server = spawn(join(app, "node_modules/.bin/next"), ["start", "--hostname", "127.0.0.1", "--port", "0"], { cwd: app, stdio: ["ignore", "pipe", "inherit"] });
  const address = await new Promise((done, fail) => {
    const timeout = setTimeout(() => fail(new Error("Consumer server startup timed out")), 30000);
    server.once("exit", code => { clearTimeout(timeout); fail(new Error("Consumer server exited: " + code)); });
    server.stdout.on("data", chunk => {
      const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (url) { clearTimeout(timeout); done(url[0]); }
    });
  });
  browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ colorScheme: theme, reducedMotion: theme === "dark" ? "reduce" : "no-preference" });
    await page.goto(address);
    await page.evaluate(theme => document.documentElement.className = theme, theme);
    const box = page.getByRole("textbox");
    const button = page.getByRole("button", { name: "Send message" });
    const thumbnail = page.getByRole("link", { name: /Guide/ }).locator('[aria-hidden="true"]').first();
    assert.equal(await thumbnail.evaluate(el => getComputedStyle(el).width), "64px");
    const article = page.getByRole("article");
    await article.getByRole("button", { name: "Bravo, 2" }).click();
    await article.getByRole("button", { name: "Bravo, 3", pressed: true }).click();
    await article.getByRole("button", { name: "Bravo, 2", pressed: false }).waitFor();
    let sends = 0;
    let respond;
    await page.route("**/api/messages", async route => {
      assert.deepEqual(route.request().postDataJSON(), { text: "Review v2" });
      sends++;
      await new Promise(resolve => { respond = resolve; });
      await route.fulfill({ status: sends === 1 ? 503 : 204 });
    });
    await box.fill("Review v2");
    for (const attempt of [1, 2]) {
      const pending = page.waitForRequest("**/api/messages");
      await box.press("Enter");
      await pending;
      await page.waitForFunction(() => document.querySelector("textarea").readOnly);
      assert.ok(await button.isDisabled());
      await box.press("Enter");
      respond();
      await page.getByRole("status").filter({ hasText: attempt === 1 ? /try again/i : /^sent$/i }).waitFor();
      assert.equal(await box.inputValue(), attempt === 1 ? "Review v2" : "");
      assert.equal(sends, attempt);
    }
    await page.close();
  }

  // Type-check each published example against the installed sources of the same locale.
  for (const [locale, namespace, root] of [["en", "@takt", "/agents"], ["ru", "@takt-ru", "/agents/ru"]]) {
    await run(shadcn, ["add", namespace + "/takt", "--yes", "--overwrite"]);
    const { components } = await fetchJson(root + "/search.json");
    assert.deepEqual(components.map(item => item.name).sort(), index.components.map(item => item.name).sort());
    for (const item of components) {
      const guide = await fetchJson(item.guide);
      checkItemImports(await fetchJson(guide.registryItem));
      assert.equal(guide.locale, locale);
      assert.ok(guide.behavior && guide.props.length, item.name);
      await put("examples/" + item.name + ".tsx", adapt(guide.example));
    }
    await run("bun", ["run", "tsc", "--noEmit"]);
    console.log("Type-checked " + components.length + " installed " + locale + " examples.");
  }
  console.log("Verified registry discovery, custom UI alias, scoped CSS and draft retry in a fresh Next.js app.");
} finally {
  await browser?.close();
  if (server && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    server.kill();
    await exited;
  }
  await rm(app, { recursive: true, force: true });
}
