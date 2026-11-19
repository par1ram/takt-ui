import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { guideFor } from "../lib/component-guides";
import { entries } from "../lib/catalog";
import { english, englishSource } from "./localize";
import { registryItemSchema, registrySchema } from "shadcn/schema";

type Item = ReturnType<typeof registryItemSchema.parse>;
const root = "public/r";
const catalog = registrySchema.parse(JSON.parse(await readFile(root + "/registry.json", "utf8")));
const json = (path: string, value: unknown) => writeFile(path, JSON.stringify(value, null, 2) + "\n");
const sources = new Map<string, string>();
for (const directory of ["components/catalog", "components/motion", "lib"]) {
  const files = directory === "lib" ? ["catalog.ts", "component-guides.ts"] : await readdir(directory);
  for (const name of files.filter((file) => /\.tsx?$|\.module\.css$/.test(file))) {
    const path = directory + "/" + name;
    const original = await readFile(path, "utf8");
    const source = name.endsWith(".css") ? original : englishSource(path, original);
    sources.set(path, source);
    const target = "generated/en/" + path;
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, source
      .replaceAll("@/components/motion/", "@/generated/en/components/motion/")
      .replaceAll('"@/lib/component-guides"', '"@/generated/en/lib/component-guides"')
      .replaceAll('"@/lib/catalog"', '"@/generated/en/lib/catalog"')
      .replaceAll('"./catalog.css"', '"@/components/catalog/catalog.css"'));
  }
}

await mkdir(root + "/ru", { recursive: true });
const collections: Record<"ru" | "en", Item[]> = { ru: [], en: [] };
for (const item of catalog.items) {
  const path = item.name + ".json";
  const ru = registryItemSchema.parse(JSON.parse(await readFile(root + "/" + path, "utf8")));
  const entry = entries.find(({ slug }) => slug === item.name);
  if (!entry) throw new Error("Missing catalog metadata for " + item.name);
  if ("task" in entry) ru.description = entry.task;
  const en = { ...ru, description: english(ru.description ?? ""), files: ru.files?.map((f) => ({ ...f, content: sources.get(f.path) ?? f.content })) };
  await json(root + "/ru/" + path, ru);
  await json(root + "/" + path, en);
  collections.ru.push(ru);
  collections.en.push(en);
}

const deploymentHost = process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
const host = process.env.NEXT_PUBLIC_TAKT_ORIGIN || (deploymentHost && "https://" + deploymentHost);
for (const lang of ["ru", "en"] as const) {
  const directory = lang === "en" ? root : root + "/ru";
  const items = collections[lang];
  const files = new Map(items.flatMap((item) => (item.files ?? []).map((f) => [f.path, f] as const)));
  const bundle = registryItemSchema.parse({
    name: "takt", title: "Takt", type: "registry:block",
    description: lang === "en" ? "All Takt motion components and their shared helpers." : "Все компоненты Takt и общие модули.",
    dependencies: [...new Set(items.flatMap((item) => item.dependencies ?? []))],
    registryDependencies: [...new Set(items.flatMap((item) => item.registryDependencies ?? []))],
    files: [...files.values()],
  });
  await json(directory + "/takt.json", bundle);
  // Native shadcn examples can be discovered by the MCP examples tool and installed directly.
  const examples: Item[] = [];
  for (const entry of entries) {
    const guide = guideFor(entry.slug);
    if (!guide.example) continue;
    const component = items.find(item => item.name === entry.slug)!;
    const name = entry.slug + "-demo";
    const example = registryItemSchema.parse({
      ...component, name, type: "registry:example", title: entry.title + " · " + (lang === "en" ? "Integration" : "Интеграция"),
      description: lang === "en" ? english(guide.behavior) : guide.behavior,
      files: [{ type: "registry:component", path: "examples/" + name + ".tsx", content: guide.example }, ...(component.files ?? [])],
    });
    examples.push(example);
    await json(directory + "/" + name + ".json", example);
  }
  await json(directory + "/registry.json", { ...catalog, homepage: host ? new URL(host).origin : "/", items: [...items, bundle, ...examples].map((item) => ({
    ...item, files: item.files?.map((file) => ({ path: file.path, type: file.type, ...(file.target && {target: file.target}) })),
  })) });
}
