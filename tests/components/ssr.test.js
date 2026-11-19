import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import registry from "../../registry.json";
import { entries } from "../../lib/catalog";

const entrypoints = new Map(registry.items.map(item => [item.name, item.files[0].path]));
const message = { id: "m1", author: "Sam", initials: "S", time: "10:00", text: "Hello" };
// Render the actual public export, bypassing catalog previews and their lazy fallbacks.
for (const { slug, symbol } of entries) {
  test(slug + " renders on the server and forwards the consumer's className", async () => {
    const componentModule = await import("../../" + entrypoints.get(slug));
    const props = { className: "consumer-theme", ...(slug === "chat-post" && { post: message }) };
    const html = renderToString(createElement(componentModule[symbol], props));
    expect(html).toMatch(/class="[^"]*\bconsumer-theme\b[^"]*"/);
    expect(html).not.toContain('="NaN"');
    expect(html).not.toContain("[object Object]");
  });
}
