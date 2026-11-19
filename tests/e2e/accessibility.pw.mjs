import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test, expect } from "playwright/test";

const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

for (const [locale, theme] of [["en", "light"], ["ru", "dark"], ["ru", "light"], ["en", "dark"]]) {
  test("accessibility of every " + locale + " preview in " + theme + " mode", async ({ page, request }, info) => {
    test.setTimeout(6 * 60_000);
    const origin = process.env.TAKT_TEST_ORIGIN;
    const ru = locale === "ru";
    const response = await request.get(origin + (ru ? "/agents/ru" : "/agents") + "/search.json");
    const { components } = await response.json();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto(origin + (ru ? "/ru" : "/"));
    const themeName = ru ? { light: "Светлая тема", dark: "Тёмная тема" } : { light: "Light theme", dark: "Dark theme" };
    const switchTheme = page.getByRole("button", { name: themeName[theme] });
    await switchTheme.click();
    await expect(switchTheme).toHaveAttribute("aria-pressed", "true");
    await page.addScriptTag({ path: axePath });
    const findings = [];
    for (const item of components) {
      await page.getByRole("textbox", { name: ru ? "Поиск компонентов" : "Search components" }).fill(item.title);
      const stage = page.locator(".stage-" + item.name);
      await stage.scrollIntoViewIfNeeded();
      await stage.locator(":scope > :not(.preview-placeholder,.magnetic-field)").first().waitFor();
      const violations = await stage.evaluate(async element => {
        const result = await window.axe.run(element, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
          resultTypes: ["violations"],
        });
        return result.violations.flatMap(rule => rule.nodes.map(node => ({
          rule: rule.id, impact: rule.impact, target: node.target, reason: node.failureSummary,
        })));
      });
      findings.push(...violations.map(violation => ({ component: item.name, ...violation })));
    }
    const report = info.outputPath("accessibility.json");
    await writeFile(report, JSON.stringify({ locale, theme, scanned: components.length, findings }, null, 2));
    await info.attach("accessibility", { path: report, contentType: "application/json" });
    expect(findings, "Accessibility findings by component, rule and element").toEqual([]);
  });
}
