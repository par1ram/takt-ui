import { test, expect } from "playwright/test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { reviewEnglish } from "../../scripts/review-english.mjs";
const execute = promisify(execFile);

test("the production sitemap, alternates, previews and missing pages resolve", async () => {
  await execute("node", ["scripts/check-seo.mjs", process.env.TAKT_TEST_ORIGIN]);
});

test("every registered component responds to its documented interactions in both themes", async () => {
  test.setTimeout(10 * 60_000);
  const result = await execute("bun", ["scripts/review-motion.mjs", "--catalog-only"], {
    env: { ...process.env, MOTION_REVIEW_URL: process.env.TAKT_TEST_ORIGIN },
  });
  console.log(result.stdout.trim());
});

test("English previews, gallery controls and the install dialog match the published registry", async ({ browser, request }) => {
  test.setTimeout(4 * 60_000);
  const origin = process.env.TAKT_TEST_ORIGIN;
  const registry = await (await request.get(origin + "/r/registry.json")).json();
  await reviewEnglish(browser, origin, registry.items);
});

test("agent instructions and typed guides resolve against the requesting domain", async ({ request }) => {
  const response = await request.get(process.env.TAKT_TEST_ORIGIN + "/llms.txt", { headers: { Host: "preview.example.org", "X-Forwarded-Proto": "https" } });
  expect(await response.text()).toContain("https://preview.example.org/agents/ru/search.json");
  for (const prefix of ["", "/ru"]) {
    const origin = process.env.TAKT_TEST_ORIGIN;
    const index = await (await request.get(origin + "/agents" + prefix + "/search.json")).json();
    const card = await (await request.get(origin + index.components.find(item => item.name === "chat-composer").guide)).json();
    const page = await request.get(origin + card.page);
    expect(await page.text()).toContain(card.registryItem);
    expect((await request.get(origin + card.registryExample)).status()).toBe(200);
  }
});

test("a clean Next.js consumer installs editable components and type-checks both locales", async () => {
  test.setTimeout(8 * 60_000);
  const result = await execute("bun", ["run", "registry:check", process.env.TAKT_TEST_ORIGIN], { maxBuffer: 8 * 1024 * 1024 });
  console.log(result.stdout.trim());
});

for (const [locale, query] of [["en", "packing station"], ["ru", "упаковочном столе"]]) {
  test(locale + " readers can find a component by use case and read its scenarios", async ({ page, request }) => {
    const ru = locale === "ru";
    const origin = process.env.TAKT_TEST_ORIGIN;
    const guide = await (await request.get(origin + (ru ? "/agents/ru" : "/agents") + "/components/slide-to-confirm.json")).json();
    await page.goto(origin + (ru ? "/ru" : "/"));
    await page.getByRole("textbox", { name: ru ? "Поиск компонентов" : "Search components" }).fill(query);
    await expect(page.locator("article.specimen")).toHaveCount(1);
    await page.getByRole("link", { name: guide.title, exact: true }).click();
    const section = page.getByRole("region", { name: ru ? "Сценарии использования" : "Use cases" });
    await expect(section.getByRole("listitem")).toHaveText(guide.useCases);
  });
}
