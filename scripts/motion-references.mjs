// Run with Bun. The application and the shadcn registry never import this script.
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { preparePort } from "./prepare-motion-port.mjs";
import { entries } from "../lib/catalog.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const archive = join(root, "references", "motion");
const origin = "https://designbookmark.com";
const catalog = origin + "/motion";
const options = new Set(process.argv.slice(2));
for (const arg of options) {
  if (!["--refresh", "--verify"].includes(arg))
    throw new Error("Unknown option " + arg);
}
const local = new Map(
  entries.flatMap((entry) =>
    entry.references.map((ref) => [ref.id, entry.slug]),
  ),
);
const digest = (text) => createHash("sha256").update(text).digest("hex");
const json = (value) => JSON.stringify(value, null, 2) + "\n";
async function atomic(path, text) {
  await mkdir(dirname(path), { recursive: true });
  const temp = path + "." + randomUUID() + ".tmp";
  await writeFile(temp, text);
  await rename(temp, path);
}
function checkId(id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
    throw new Error("Unrecognized component id: " + id);
}
async function verify(item) {
  checkId(item.id);
  const { directory, checksums } = item;
  if (
    !directory.startsWith("sources/" + item.id + "/") ||
    !/^[a-f0-9]{64}$/.test(directory.split("/")[2]) ||
    directory.split("/").length !== 3 ||
    directory.split("/")[2] !== digest(json(checksums))
  )
    throw new Error("Invalid archive path");
  for (const name of ["source.txt", "claude.txt", "codex.txt"]) {
    const data = await readFile(join(archive, directory, name), "utf8");
    if (
      !data.trim() ||
      digest(data) !== checksums[name] ||
      (name !== "source.txt" && !data.includes(catalog + "#" + item.id))
    )
      throw new Error("Invalid copy: " + item.id + "/" + name);
  }
  return { ...item, target: local.get(item.id) ?? null };
}
async function verifyAll(items) {
  if (!items.length || new Set(items.map((x) => x.id)).size !== items.length)
    throw new Error("Empty or duplicate inventory");
  const present = new Set(items.map((x) => x.id));
  const missing = [...local.keys()].filter((id) => !present.has(id));
  if (missing.length)
    console.warn(
      "Existing references absent from remote catalog:",
      missing.join(", "),
    );
  const registry = JSON.parse(
    await readFile(join(root, "registry.json"), "utf8"),
  );
  for (const item of items) {
    const checked = await verify(item);
    if (checked.target !== item.target)
      throw new Error("Outdated mapping: " + item.id);
    if (item.target) {
      const path = "components/motion/" + item.target + ".tsx";
      if (
        !registry.items
          .find((r) => r.name === item.target)
          ?.files.some((f) => f.path === path)
      )
        throw new Error("Missing registry mapping: " + item.id);
      await readFile(join(root, path));
    }
    await preparePort(archive, item, { verifyOnly: true });
  }
  console.log(
    items.length +
      " source bundles verified, " +
      new Set(items.map((i) => i.target).filter(Boolean)).size +
      " local components, " +
      items.filter((i) => !i.target).length +
      " unassigned.",
  );
}

async function launch() {
  try {
    return await chromium.launch();
  } catch (error) {
    if (!String(error).includes("Executable doesn't exist")) throw error;
    return chromium.launch({ channel: "chrome" });
  }
}
async function collect() {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    // The buttons are the public interface. Only their clipboard output is observed.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (value) => {
            window.motionClipboard = value;
          },
          write: async (items) => {
            for (const item of items)
              if (item.types.includes("text/plain"))
                window.motionClipboard = await (
                  await item.getType("text/plain")
                ).text();
          },
        },
      });
    });
    await page.route("**/*", (route) => {
      const request = route.request();
      if (
        ["font", "media", "image"].includes(request.resourceType()) ||
        (request.isNavigationRequest() && request.frame().parentFrame())
      )
        return route.abort();
      return route.continue();
    });
    await page.route("**/motion-src/code/**", async (route) => {
      // Some files are served as bare text/plain. Explicit UTF-8 prevents the
      // browser network inspector from converting shortcut symbols to mojibake.
      const response = await route.fetch({ timeout: 20000 });
      try {
        await route.fulfill({
          response,
          contentType: "text/plain; charset=utf-8",
          body: await response.body(),
        });
      } finally {
        await response.dispose();
      }
    });
    await page.goto(catalog, { waitUntil: "load" });
    const cards = await page.locator("li[id]").evaluateAll((nodes) =>
      nodes.flatMap((node) => {
        const code = node.querySelector(
          'button[aria-label^="Copy the code for "]',
        );
        if (!code) return [];
        const link = node.querySelector('a[data-surface="motion"]');
        const title = code
          .getAttribute("aria-label")
          .slice("Copy the code for ".length);
        const author = (
          link ??
          [...node.querySelectorAll("p")].find(
            (p) => p.textContent.trim() === title,
          )
        )?.nextElementSibling?.textContent.trim();
        return [{ id: node.id, title, author, upstream: link?.href ?? null }];
      }),
    );
    const expected = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => {
        return scripts.flatMap((s) => {
          const data = JSON.parse(s.textContent);
          return (
            data.mainEntity?.itemListElement ??
            data.itemListElement ??
            []
          )
            .map((item) => item.url)
            .filter(
              (url) => typeof url === "string" && url.includes("/motion#"),
            )
            .map((url) => new URL(url).hash.slice(1));
        });
      });
    if (
      !cards.length ||
      cards.length !== new Set(cards.map((c) => c.id)).size ||
      !expected.length ||
      expected.length !== cards.length ||
      expected.some((id) => !cards.some((c) => c.id === id))
    )
      throw new Error("Motion listing and Copy code cards disagree");
    const byId = new Map(cards.map((card) => [card.id, card]));
    const filters = page.getByRole("group", { name: "Element", exact: true });
    const names = (await filters.getByRole("button").allTextContents()).map(
      (n) => n.trim(),
    );
    for (const category of names.filter((n) => n !== "All" && n !== "Saved")) {
      const button = filters.getByRole("button", {
        name: category,
        exact: true,
      });
      await button.click();
      await page.waitForFunction(
        (name) =>
          document
            .querySelector('[aria-label="Element"] button[aria-pressed="true"]')
            ?.textContent.trim() === name,
        category,
      );
      for (const id of await page
        .locator("li[id]")
        .evaluateAll((nodes) => nodes.map((n) => n.id))) {
        if (byId.has(id)) byId.get(id).category = category;
      }
    }
    await filters.getByRole("button", { name: "All", exact: true }).click();
    await page.waitForFunction(
      (count) =>
        document.querySelectorAll(
          'li[id] button[aria-label^="Copy the code for "]',
        ).length === count,
      cards.length,
    );
    if (cards.some((card) => !card.category))
      throw new Error("Missing category for one or more cards");
    let lastFetch = 0;
    const items = [];
    for (const card of cards) {
      checkId(card.id);
      if (!card.author) throw new Error("Missing author: " + card.id);
      const directory = join(archive, "sources", card.id);
      const checkpoint = join(directory, "latest.json");
      let item;
      if (!options.has("--refresh")) {
        try {
          const cached = JSON.parse(await readFile(checkpoint, "utf8"));
          if (cached.id !== card.id || cached.encoding !== "utf-8")
            throw new Error("Cache format changed");
          item = { ...(await verify(cached)), ...card };
        } catch (error) {
          if (error.code !== "ENOENT")
            console.warn("Refetching " + card.id + ": " + error.message);
        }
      }
      if (!item) {
        const tile = page.locator("#" + card.id);
        async function copy(button) {
          await page.evaluate(() => {
            window.motionClipboard = null;
          });
          await button.evaluate((el) => el.click());
          const result = await page.waitForFunction(
            () =>
              typeof window.motionClipboard === "string" &&
              window.motionClipboard.length > 0
                ? window.motionClipboard
                : false,
            null,
            { timeout: 10000 },
          );
          return result.jsonValue();
        }
        const claude = await copy(
          tile.getByRole("button", { name: /^Copy a prompt for Claude/ }),
        );
        const codex = await copy(
          tile.getByRole("button", { name: /^Copy a prompt for Codex/ }),
        );
        const installButton = tile.getByRole("button", {
          name: "Copy the install command",
        });
        const install = (await installButton.count())
          ? await copy(installButton)
          : null;
        // Pace the individual source downloads at the origin's published crawl delay.
        await new Promise((resolve) =>
          setTimeout(resolve, Math.max(0, 10000 - (Date.now() - lastFetch))),
        );
        lastFetch = Date.now();
        const responsePromise = page.waitForResponse(
          (response) => {
            const url = new URL(response.url());
            return (
              url.origin === origin &&
              url.pathname.startsWith("/motion-src/code/")
            );
          },
          { timeout: 20000 },
        );
        const [response] = await Promise.all([
          responsePromise,
          tile
            .getByRole("button", { name: /^Copy the code for / })
            .evaluate((el) => el.click()),
        ]);
        if (!response.ok())
          throw new Error(card.id + " HTTP " + response.status());
        const codeUrl = new URL(response.url());
        if (
          codeUrl.origin !== origin ||
          codeUrl.pathname !== "/motion-src/code/" + card.id + ".txt"
        )
          throw new Error("Source/card mismatch: " + card.id);
        const source = new TextDecoder("utf-8", { fatal: true }).decode(
          await response.body(),
        );
        const format =
          /^(?:\s*<!--[\s\S]*?-->)*\s*<!doctype html>/i.test(source) &&
          /<script[\s>]/i.test(source)
            ? "html"
            : /^import\s/m.test(source) && /\bexport\s/m.test(source)
              ? "tsx"
              : null;
        if (!format || /<title>[^<]*(?:404|not found)/i.test(source))
          throw new Error("Unexpected source for " + card.id);
        const files = {
          "source.txt": source,
          "claude.txt": claude,
          "codex.txt": codex,
        };
        const checksums = Object.fromEntries(
          Object.entries(files).map(([name, data]) => [name, digest(data)]),
        );
        const relative = "sources/" + card.id + "/" + digest(json(checksums));
        item = {
          ...card,
          encoding: "utf-8",
          reference: catalog + "#" + card.id,
          sourceUrl: response.url(),
          format,
          licenseNotice: /\bMIT(?: licen[cs]e)?\b/i.test(source.split("\n")[0])
            ? "MIT"
            : null,
          companionFiles: [
            ...source.matchAll(/^\/\/ ---- (\.\/[^\n]+?) ----\s*$/gm),
          ].map((m) => m[1]),
          install,
          target: local.get(card.id) ?? null,
          directory: relative,
          checksums,
        };
        for (const [name, data] of Object.entries(files))
          await atomic(join(archive, relative, name), data);
        await atomic(checkpoint, json(item));
        console.log(items.length + 1 + "/" + cards.length, card.id, format);
      }
      items.push(await preparePort(archive, item));
    }
    await verifyAll(items);
    const lines = [
      "# Карта портирования",
      "",
      "Исходники и промты доступны локально после `bun run motion:sync`. Таблица связывает пример с устанавливаемым компонентом Takt.",
      "",
      "Условия использования исходников и правообладатели перечислены в [уведомлениях о третьих сторонах](../../THIRD_PARTY_NOTICES.md). Поле `licenseNotice` в манифесте повторяет пометку из заголовка исходника; пустое значение означает, что автор её не указал.",
      "",
      "| Референс | Автор | Формат | Takt | Материалы |",
      "| --- | --- | --- | --- | --- |",
    ];
    const escape = (value) => value.replace(/[\[\]\\|]/g, "\\$&");
    for (const item of items) {
      const path = item.directory;
      lines.push(
        "| [" +
          escape(item.title) +
          "](" +
          item.reference +
          ") | " +
          escape(item.author) +
          " | " +
          item.format.toUpperCase() +
          " | " +
          (item.target
            ? "[" +
              item.target +
              "](../../components/motion/" +
              item.target +
              ".tsx)"
            : "—") +
          " | [Код](" +
          path +
          "/files/" +
          item.entryFile +
          ") · [Claude](" +
          path +
          "/claude.txt) · [Codex](" +
          path +
          "/codex.txt) |",
      );
    }
    await atomic(join(archive, "README.md"), lines.join("\n") + "\n");
    await atomic(join(archive, "manifest.json"), json({ catalog, items }));
  } finally {
    await browser.close();
  }
}
if (options.has("--verify")) {
  const manifest = JSON.parse(
    await readFile(join(archive, "manifest.json"), "utf8"),
  );
  await verifyAll(manifest.items);
} else await collect();
