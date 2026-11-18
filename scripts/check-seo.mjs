import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "https://takt-ui.vercel.app");
const canonical = new URL(process.env.NEXT_PUBLIC_TAKT_ORIGIN || "https://takt-ui.vercel.app");
async function read(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  return response;
}

const registry = await (await read("/r/registry.json")).json();
const components = registry.items.filter(item => item.name !== "takt");
assert.ok(components.length > 0);
const sitemap = await (await read("/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const paths = ["", "/messenger", "/metrics", ...components.map(item => "/components/" + item.name)];
const expected = paths.flatMap(path => [path || "/", "/ru" + path]);
assert.deepEqual(urls.sort(), expected.map(path => new URL(path, canonical).href).sort());
assert.ok((await (await read("/robots.txt")).text()).includes("Sitemap: " + new URL("/sitemap.xml", canonical).href));
for (const lang of ["en", "ru"]) {
  const prefix = lang === "ru" ? "/ru" : "";
  const home = await (await read(prefix || "/")).text();
  for (const item of components) assert.ok(home.includes('href="' + prefix + '/components/' + item.name + '"'), item.name);
  for (const path of ["", "/messenger", "/metrics", "/components/receipt-printer"]) {
    const html = path ? await (await read(prefix + path)).text() : home;
    assert.ok(html.includes('<html lang="' + lang + '"'), lang);
    const link = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(link, "Missing canonical for " + (prefix + path || "/"));
    assert.equal(new URL(link).href, new URL(prefix + path || "/", canonical).href);
    assert.ok(html.includes('hrefLang="x-default"') || html.includes('hreflang="x-default"'));
    assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
    assert.ok(html.includes(new URL('/share/' + lang + '.png', canonical).href));
    if (path.startsWith("/components/")) assert.ok(html.includes('application/ld+json') && html.includes('BreadcrumbList'));
  }
  const image = Buffer.from(await (await read("/share/" + lang + ".png")).arrayBuffer());
  assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], [1200, 630]);
  const missing = new URL(prefix + "/components/does-not-exist", base);
  // Next can stream the shell before it resolves an unknown slug.
  const streamed = await fetch(missing);
  assert.ok(streamed.status === 404 || (await streamed.text()).includes('<meta name="robots" content="noindex"'));
  assert.equal((await fetch(missing, { headers: { "User-Agent": "Twitterbot/1.0" } })).status, 404);
}
await read("/llms.txt");
await read("/r/receipt-printer.json");
console.log(`Verified ${urls.length} sitemap entries, both catalogs, component metadata and social previews at ${base.origin}`);
