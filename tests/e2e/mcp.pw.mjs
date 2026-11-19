import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { expect, test } from "playwright/test";

test("an agent discovers a component by task and reads a working example through shadcn MCP", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "takt-mcp-"));
  const client = new Client({ name: "takt-registry-test", version: "1.0.0" });
  try {
    const origin = process.env.TAKT_TEST_ORIGIN;
    const config = JSON.parse(await readFile("components.json", "utf8"));
    config.registries = { "@takt": origin + "/r/{name}.json", "@takt-ru": origin + "/r/ru/{name}.json" };
    await writeFile(join(cwd, "components.json"), JSON.stringify(config));
    await writeFile(join(cwd, "package.json"), JSON.stringify({ name: "takt-consumer", private: true }));
    await writeFile(join(cwd, "tsconfig.json"), JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }));
    await client.connect(new StdioClientTransport({ cwd, command: resolve("node_modules/.bin/shadcn"), args: ["mcp"] }));
    for (const [registry, query] of [["@takt", "draft"], ["@takt-ru", "черновик"]]) {
      const registries = [registry];
      const results = await client.callTool({ name: "search_items_in_registries", arguments: { registries, query, types: ["registry:ui"] } });
      expect(results.isError).toBeFalsy();
      expect(results.content.map(item => item.text).join("\n")).toContain("chat-composer");
      const example = await client.callTool({ name: "get_item_examples_from_registries", arguments: { registries, query: "chat-composer-demo" } });
      expect(example.isError).toBeFalsy();
      const source = example.content.map(item => item.text).join("\n");
      expect(source).toContain("/api/messages");
      expect(source).toContain("onSend={send}");
    }
  } finally {
    await client.close();
    await rm(cwd, { recursive: true, force: true });
  }
});
