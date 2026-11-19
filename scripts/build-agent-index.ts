import ts from "typescript";
import { mkdir, writeFile } from "node:fs/promises";
import { entries, taskFor } from "../lib/catalog";
import { guideFor, usageExample } from "../lib/component-guides";
import { english } from "./localize";
import registry from "../registry.json";

const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const items = new Map(registry.items.map(item => [item.name, item]));
const program = ts.createProgram(registry.items.map(item => item.files[0].path), options);
const checker = program.getTypeChecker();

function componentApi(item: typeof registry.items[number], name: string) {
  const source = program.getSourceFile(item.files[0].path)!;
  const moduleSymbol = checker.getSymbolAtLocation(source)!;
  const symbol = checker.getExportsOfModule(moduleSymbol).find(s => s.name === name);
  if (!symbol) throw new Error("Missing component export " + name);
  const type = checker.getTypeOfSymbolAtLocation(symbol, source);
  const param = type.getCallSignatures()[0]?.parameters[0];
  const props = param && checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(param, source));
  const variants = props ? (props.isUnion() ? props.types : [props]) : [];
  const definitions = new Map<string, string>();
  for (const file of item.files) {
    for (const node of program.getSourceFile(file.path)?.statements ?? []) {
      if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        const definition = ts.isTypeAliasDeclaration(node) && (ts.isIndexedAccessTypeNode(node.type) || ts.isTypeOperatorNode(node.type))
          ? "type " + node.name.text + " = " + checker.typeToString(checker.getTypeAtLocation(node), node, ts.TypeFormatFlags.InTypeAlias) + ";"
          : node.getText().replace(/^export /, "");
        definitions.set(node.name.text, definition);
      }
    }
  }

  // Follow the named data types used by this API, including nested message and issue models.
  const models: Record<string, string> = {};
  function includeModels(typeText: string) {
    for (const word of typeText.match(/[A-Za-z_$][\w$]*/g) ?? []) {
      const definition = definitions.get(word);
      if (definition && !Object.hasOwn(models, word)) {
        models[word] = definition;
        includeModels(definition);
      }
    }
  }

  const propVariants = variants.map(variant => Object.fromEntries(
    checker.getPropertiesOfType(variant).map(property => {
      const location = property.valueDeclaration ?? source;
      const propType = checker.getTypeOfSymbolAtLocation(property, location);
      const typeText = checker.typeToString(propType, location, ts.TypeFormatFlags.NoTruncation);
      if (typeText.includes(process.cwd())) throw new Error("Non-portable prop type: " + name + "." + property.name);
      includeModels(typeText);
      return [property.name, { type: typeText, required: !(property.flags & ts.SymbolFlags.Optional) }];
    }),
  ));
  return { props: propVariants, models };
}

const json = (path: string, value: unknown) => writeFile("public" + path, JSON.stringify(value, null, 2) + "\n");
const catalog = entries.map(entry => {
  const item = items.get(entry.slug);
  if (!item) throw new Error("Registry entry missing for " + entry.slug);
  return { entry, item, api: componentApi(item, entry.symbol) };
});
await mkdir("docs", { recursive: true });
for (const locale of ["en", "ru"] as const) {
  const translate = locale === "en" ? english : (value: string) => value;
  const root = locale === "en" ? "/agents" : "/agents/ru";
  const packages = locale === "en" ? "/r" : "/r/ru";
  const pages = locale === "en" ? "/components" : "/ru/components";
  await mkdir("public" + root + "/components", { recursive: true });
  const handbook = new Map<string, string[]>();
  const search = [];
  const components = [];
  for (const { entry, item, api } of catalog) {
    const guide = guideFor(entry.slug);
    const summary = {
      name: entry.slug, title: entry.title, category: translate(entry.category),
      task: translate(taskFor(entry)), useCases: entry.useCases.map(translate),
      guide: root + "/components/" + entry.slug + ".json",
    };
    search.push(summary);
    const section = handbook.get(summary.category) ?? [];
    section.push("### [" + entry.title + "](../" + item.files[0].path + ")", "", ...summary.useCases.map(scenario => "- " + scenario), "");
    handbook.set(summary.category, section);
    const usage = translate(entry.usage);
    const component = {
      name: entry.slug, title: entry.title, category: summary.category, description: translate(entry.description),
      export: entry.symbol, usage, useCases: summary.useCases, registryItem: packages + "/" + entry.slug + ".json",
      dependencies: item.dependencies ?? [], registryDependencies: item.registryDependencies ?? [], props: api.props,
    };
    components.push(component);
    const parts = catalog.filter(other => other.item !== item && item.files.some(file => file.path === other.item.files[0].path));
    await json(summary.guide, {
      ...component, locale, task: summary.task, page: pages + "/" + entry.slug,
      example: usageExample({ ...entry, usage }), models: api.models,
      behavior: translate(guide.behavior),
      ...(guide.example && { registryExample: packages + "/" + entry.slug + "-demo.json" }),
      parts: parts.map(part => part.entry.slug),
      related: (guide.related ?? []).map(slug => root + "/components/" + slug + ".json"),
      files: item.files.map(file => file.path),
    });
  }
  const heading = locale === "ru" ? "Сценарии использования компонентов Takt" : "Takt component use cases";
  const sections = Array.from(handbook, ([category, items]) => ["## " + category, "", ...items].join("\n"));
  await writeFile("docs/use-cases." + locale + ".md", ["# " + heading, "", ...sections].join("\n"));
  await json(root + "/search.json", { version: 1, locale, components: search });
  if (locale === "en") {
    await json(root + "/components.json", { version: 1, locale, registry: "/r/registry.json", fullLibrary: "/r/takt.json", components });
  }
}
console.log("Generated agent guides and search indexes for " + catalog.length + " components in both languages.");
