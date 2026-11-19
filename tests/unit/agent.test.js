import { afterEach, expect, test } from "bun:test";
import { registryOrigin } from "../../lib/registry-origin";
import { installPrompt } from "../../components/catalog/install-prompt";
import { entries, taskFor } from "../../lib/catalog";
import { usageExample } from "../../lib/component-guides";
import { GET } from "../../app/llms.txt/route";

const original = process.env.NEXT_PUBLIC_TAKT_ORIGIN;
afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_TAKT_ORIGIN;
  else process.env.NEXT_PUBLIC_TAKT_ORIGIN = original;
});

test.each(["localhost", "foo.localhost", "127.0.0.1", "0.0.0.0", "[::1]"])("local host %s uses the configured fallback", host => {
  delete process.env.NEXT_PUBLIC_TAKT_ORIGIN;
  expect(registryOrigin("http://" + host + ":3000/components")).toBe("");
  process.env.NEXT_PUBLIC_TAKT_ORIGIN = "https://release.example.org/";
  expect(registryOrigin("http://" + host)).toBe("https://release.example.org");
});

test("preview instructions use the request host, including its port and forwarded protocol", async () => {
  process.env.NEXT_PUBLIC_TAKT_ORIGIN = "https://release.example.org";
  const response = GET(new Request("http://localhost:3000/llms.txt", {
    headers: { host: "preview.example.org:443", "x-forwarded-proto": "https" },
  }));
  expect(response.headers.get("content-type")).toContain("text/plain");
  const guide = await response.text();
  expect(guide).toContain("https://preview.example.org/agents/search.json");
  expect(guide).toContain('https://preview.example.org/r/{name}.json');
  expect(guide).not.toContain("release.example.org");
});

test("component and collection install prompts point to the same locale and host", () => {
  const item = entries.find(entry => entry.slug === "message-thread");
  const origin = "https://preview.example.org";
  const single = installPrompt(item, "/r/ru/", origin);
  expect(single).toContain(origin + "/agents/ru/components/message-thread.json");
  expect(single).toContain("shadcn@latest add " + origin + "/r/ru/message-thread.json");
  expect(single).toContain(item.symbol);
  const collection = installPrompt(null, "/r/", origin);
  expect(collection).toContain(origin + "/agents/search.json");
  expect(collection).toContain("shadcn@latest add " + origin + "/r/takt.json");
});

test("examples put callbacks behind a client boundary and preserve the named export", () => {
  const entry = entries.find(entry => entry.slug === "spring-switch");
  expect(usageExample({ ...entry, usage: "<SpringSwitch />" })).toStartWith('import { SpringSwitch }');
  expect(usageExample({ ...entry, usage: "<SpringSwitch onCheckedChange={report} />" })).toStartWith('"use client";');
  expect(taskFor({ task: "Send a draft", description: "Textbox" })).toBe("Send a draft");
  expect(taskFor({ description: "Textbox" })).toBe("Textbox");
});
