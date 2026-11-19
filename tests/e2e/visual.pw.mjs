import { expect, test } from "playwright/test";

for (const theme of ["light", "dark"]) {
  test("switch geometry and theme colors in both states, " + theme, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto(process.env.TAKT_TEST_ORIGIN);
    await page.getByRole("button", { name: theme === "light" ? "Light theme" : "Dark theme" }).click();
    await page.getByRole("textbox", { name: "Search components" }).fill("Spring Switch");
    const control = page.getByRole("switch", { name: "Notifications" });
    const track = control.locator(":scope > [aria-hidden]");
    await track.scrollIntoViewIfNeeded();
    await track.evaluate(async element => {
      // Keep the image crop independent of fractional offsets from surrounding text.
      await document.fonts.ready;
      const { x, y } = element.getBoundingClientRect();
      element.style.translate = (Math.round(x) - x) + "px " + (Math.round(y) - y) + "px";
    });
    for (const state of ["on", "off"]) {
      await expect(control).toHaveAttribute("aria-checked", String(state === "on"));
      await expect(track).toHaveScreenshot(theme + "-" + state + ".png", { maxDiffPixels: 8 });
      if (state === "on") await control.click();
    }
  });
}
