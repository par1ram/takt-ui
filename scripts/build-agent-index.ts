import { english } from "./localize";
import ts from "typescript";
import { mkdir, writeFile } from "node:fs/promises";
import { entries } from "../lib/catalog";
import registry from "../registry.json";

const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  process.cwd(),
);
const items = new Map(registry.items.map((item) => [item.name, item]));
const program = ts.createProgram(
  registry.items.map((item) => item.files[0].path),
  options,
);
const checker = program.getTypeChecker();
const components = entries.map((entry) => {
  const item = items.get(entry.slug);
  if (!item) throw new Error("Registry entry missing for " + entry.slug);
  const source = program.getSourceFile(item.files[0].path)!;
  const moduleSymbol = checker.getSymbolAtLocation(source)!;
  const symbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((s) => s.name === entry.symbol);
  if (!symbol) throw new Error("Missing component export " + entry.symbol);
  const type = checker.getTypeOfSymbolAtLocation(symbol, source);
  const param = checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0]
    ?.parameters[0];
  const props =
    param &&
    checker.getNonNullableType(
      checker.getTypeOfSymbolAtLocation(param, source),
    );
  const variants = props ? (props.isUnion() ? props.types : [props]) : [];
  return {
    name: entry.slug,
    title: entry.title,
    category: english(entry.category),
    description: english(entry.description),
    export: entry.symbol,
    usage: english(entry.usage),
    registryItem: "/r/" + entry.slug + ".json",
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    props: variants.map((variant) =>
      Object.fromEntries(
        checker.getPropertiesOfType(variant).map((property) => {
          const propType = checker.getTypeOfSymbolAtLocation(property, source);
          return [
            property.name,
            {
              type: checker.typeToString(
                propType,
                source,
                ts.TypeFormatFlags.NoTruncation,
              ),
              required: !(property.flags & ts.SymbolFlags.Optional),
            },
          ];
        }),
      ),
    ),
  };
});
await mkdir("public/agents", { recursive: true });
await writeFile(
  "public/agents/components.json",
  JSON.stringify({ version: 1, locale: "en", registry: "/r/registry.json", fullLibrary: "/r/takt.json", components }, null, 2) + "\n",
);
console.log("Indexed " + components.length + " components for agents.");
