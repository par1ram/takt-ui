import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { registryItemSchema } from "shadcn/schema";
import source from "../../registry.json";
import { entries } from "../../lib/catalog";
import { english } from "../../scripts/localize";
import { guideFor } from "../../lib/component-guides";

const read = path => JSON.parse(readFileSync("public" + path, "utf8"));
const names = entries.map(entry => entry.slug).sort();
const sourceItems = new Map(source.items.map(item => [item.name, item]));

test("every published component has one source item and one catalog entry", () => {
  expect([...sourceItems.keys()].sort()).toEqual(names);
  expect(sourceItems.size).toBe(source.items.length);
});

for (const locale of ["en", "ru"]) {
  describe(locale + " registry", () => {
    const prefix = locale === "ru" ? "/ru" : "";
    const packages = "/r" + prefix;
    const agents = "/agents" + prefix;
    const index = read(agents + "/search.json");
    const registry = read(packages + "/registry.json");
    const bundle = registryItemSchema.parse(read(packages + "/takt.json"));
    const bundledFiles = new Map(bundle.files.map(file => [file.path, file]));
    const cards = new Map(index.components.map(entry => [entry.name, entry]));
    const manifest = new Map(registry.items.map(item => [item.name, item]));

    test("search, manifest and collection contain the complete catalog", () => {
      expect(index.locale).toBe(locale);
      expect(index.components.map(item => item.name).sort()).toEqual(names);
      expect(registry.items.filter(item => item.type === "registry:ui").map(item => item.name).sort()).toEqual(names);
      const files = new Set(source.items.flatMap(item => item.files.map(file => file.path)));
      expect(bundle.files.map(file => file.path).sort()).toEqual([...files].sort());
      expect(new Set(bundle.dependencies)).toEqual(new Set(source.items.flatMap(item => item.dependencies ?? [])));
      expect(new Set(bundle.registryDependencies)).toEqual(new Set(source.items.flatMap(item => item.registryDependencies ?? [])));
    });

    for (const entry of entries) {
      test(entry.slug + " resolves from task to typed guide, source and editable bundle", () => {
        const row = cards.get(entry.slug);
        expect(row.guide).toBe(agents + "/components/" + entry.slug + ".json");
        const card = read(row.guide);
        expect(card).toMatchObject({
          name: entry.slug, export: entry.symbol, locale, task: row.task,
          registryItem: packages + "/" + entry.slug + ".json", page: prefix + "/components/" + entry.slug,
        });
        const cases = locale === "en" ? entry.useCases.map(english) : entry.useCases;
        expect(new Set(cases).size).toBe(cases.length);
        expect(cases.length).toBeGreaterThanOrEqual(2);
        expect(card.useCases).toEqual(cases);
        expect(row.useCases).toEqual(cases);
        expect(card.behavior.length).toBeGreaterThan(0);
        expect(card.example).toContain('from "@/components/ui/' + entry.slug + '"');
        expect(card.props.every(variant => variant.className?.type.includes("string"))).toBe(true);
        expect(card.props.length).toBeGreaterThan(0);
        expect(JSON.stringify(card)).not.toContain(process.cwd());
        for (const path of card.related) expect(read(path).locale).toBe(locale);
        const item = registryItemSchema.parse(read(card.registryItem));
        expect(item.name).toBe(entry.slug);
        expect(item.files.map(file => file.path)).toEqual(card.files);
        expect(manifest.get(item.name).files).toEqual(item.files.map(({ path, type, target }) => ({ path, type, ...(target && { target }) })));
        for (const file of item.files) {
          expect(file.content.length).toBeGreaterThan(0);
          expect(bundledFiles.get(file.path)).toEqual(file);
        }
        expect(card.parts.slice().sort()).toEqual(entries.filter(other => other !== entry && card.files.includes(sourceItems.get(other.slug).files[0].path)).map(other => other.slug).sort());
        if (guideFor(entry.slug).example) {
          const example = registryItemSchema.parse(read(card.registryExample));
          expect(manifest.get(example.name).type).toBe("registry:example");
          expect(example.files[0].content).toBe(card.example);
        }
      });
    }
    test("payment and demo modes retain separate typed APIs", () => {
      const variants = read(cards.get("card-field").guide).props;
      expect(variants).toHaveLength(2);
      const payment = variants.find(variant => variant.mode.type.includes('"payment"'));
      expect(payment.mode.required).toBe(true);
      expect(payment.onCompleteChange.type).toContain("boolean");
      expect(payment.onChange).toBeUndefined();
      expect(variants.find(variant => variant !== payment).onChange.type).toContain("string");
    });
  });
}
