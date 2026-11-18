// Extract working files from a Copy code bundle. Nothing from the bundle is executed.
import ts from "typescript";
import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

function htmlFiles(source) {
  const files = new Map();
  const urls = new Set();
  const blocks = { style: 0, script: 0 };
  let current;
  const parser = new HTMLRewriter().on("[src], [href]", {
    element(node) {
      const url = node.getAttribute("src") ?? node.getAttribute("href");
      if (url && /^(?:https?:\/\/|\/[^/])/.test(url)) urls.add(url);
    },
  });
  for (const tag of ["style", "script"]) {
    parser.on(tag, {
      element(node) {
        current = null;
        if (
          node.hasAttribute("src") ||
          (tag === "script" &&
            ![
              "",
              "text/javascript",
              "application/javascript",
              "module",
            ].includes(node.getAttribute("type") ?? ""))
        )
          return;
        const n = ++blocks[tag];
        const name =
          tag === "style"
            ? "styles" + (n === 1 ? "" : "-" + n) + ".css"
            : "script-" + n + ".js";
        current = name;
        files.set(name, "");
        node.onEndTag(() => {
          current = null;
        });
      },
      text(chunk) {
        if (current) files.set(current, files.get(current) + chunk.text);
      },
    });
  }
  parser.transform(source);
  const css = [...files]
    .filter(([name]) => name.endsWith(".css"))
    .map(([, text]) => text)
    .join("\n");
  for (const match of css.matchAll(
    /url\(\s*['"]?(https?:\/\/[^'")\s]+)['"]?\s*\)/g,
  ))
    urls.add(match[1]);
  const js = [...files]
    .filter(([name]) => name.endsWith(".js"))
    .map(([, text]) => text)
    .join("\n");
  const tokens = new Map(
    [...css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
  const motionTokens = {};
  for (const [, name] of js.matchAll(
    /(?:spring|num)\(\s*['"](--[\w-]+)['"]/g,
  )) {
    if (tokens.has(name)) motionTokens[name] = tokens.get(name);
  }
  files.set("index.html", source);
  return { files, assets: [...urls], motionTokens };
}

function reactFiles(id, source) {
  const files = new Map();
  let name = id + ".tsx",
    start = 0;
  for (const match of source.matchAll(/^\/\/ ---- (\.\/[\w./-]+) ----\s*$/gm)) {
    files.set(name, source.slice(start, match.index));
    name = match[1].slice(2);
    if (
      !/^(?:[\w-]+\/)*[\w.-]+\.(?:tsx?|jsx?|css)$/.test(name) ||
      files.has(name)
    )
      throw new Error("Unexpected companion path in " + id + ": " + name);
    start = match.index + match[0].length;
  }
  files.set(name, source.slice(start));
  const imports = new Set();
  for (const [path, text] of files) {
    if (!/\.[jt]sx?$/.test(path)) continue;
    for (const ref of ts.preProcessFile(text, true, true).importedFiles)
      imports.add(ref.fileName);
  }
  return { files, imports: [...imports].sort() };
}

// Use versioned input directories so preparing a changed upstream bundle cannot
// overwrite hand-edited application components or leave stale companion files.
export async function preparePort(archive, item, { verifyOnly = false } = {}) {
  const folder = join(archive, item.directory);
  const source = await readFile(join(folder, "source.txt"), "utf8");
  const { files, ...details } =
    item.format === "html" ? htmlFiles(source) : reactFiles(item.id, source);
  if (
    item.format === "html" &&
    ![...files].some(([name]) => name.endsWith(".js"))
  )
    throw new Error("No JS extracted: " + item.id);
  for (const [name, content] of files) {
    const file = join(folder, "files", name);
    if (verifyOnly) {
      if ((await readFile(file, "utf8")) !== content)
        throw new Error(
          "Prepared file differs from source: " + item.id + "/" + name,
        );
      continue;
    }
    await mkdir(dirname(file), { recursive: true });
    const tmp = file + "." + randomUUID() + ".tmp";
    await writeFile(tmp, content);
    await rename(tmp, file);
  }
  return {
    ...item,
    entryFile: item.format === "html" ? "index.html" : item.id + ".tsx",
    ...details,
  };
}
