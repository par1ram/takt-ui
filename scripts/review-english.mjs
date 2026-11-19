import assert from "node:assert/strict";

export async function reviewEnglish(browser, origin, items) {
  const page = await browser.newPage({ locale: "en-US", reducedMotion: "reduce" });
  try {
    await page.goto(origin);
    await page.locator(".light-choice[aria-pressed=true]").waitFor();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    const search = page.getByRole("textbox", { name: "Search components" });
    for (const item of items.filter((item) => item.type === "registry:ui")) {
      await search.fill(item.title);
      const stage = page.locator(".stage-" + item.name);
      await stage.scrollIntoViewIfNeeded();
      await stage.locator(":scope > :not(.preview-placeholder,.magnetic-field)").first().waitFor();
      const copy = await stage.evaluate((el) => [
        el.innerText,
        ...Array.from(el.querySelectorAll("[aria-label],[title],[placeholder],[alt]"), (node) =>
          ["aria-label", "title", "placeholder", "alt"].map((key) => node.getAttribute(key)).join(" ")),
      ].join(" "));
      assert.doesNotMatch(copy, /[а-яё]/i, item.name);
    }

    for (const [title, slug] of [["Tab Pill", "tab-pill"], ["Segmented Control", "segmented-control"]]) {
      await search.fill(title);
      const options = page.locator(".stage-" + slug + " button");
      await options.first().waitFor();
      for (const option of await options.all()) {
        await option.click();
        const { left, right, padding } = await option.evaluate((button) => {
          const label = button.querySelector("span:last-child").getBoundingClientRect();
          const pill = button.querySelector('[aria-hidden="true"]').getBoundingClientRect();
          return { left: label.left - pill.left, right: pill.right - label.right,
            padding: parseFloat(getComputedStyle(button).paddingInlineStart) };
        });
        assert.ok(Math.abs(left - padding) < 1 && Math.abs(right - padding) < 1,
          title + " selection follows the label with equal padding");
      }
    }

    await search.fill("Receipt Printer");
    const printer = page.getByRole("region", { name: "Receipt printer" });
    await printer.getByRole("button", { name: /Pay.*24\.00/ }).click();
    await printer.getByText("Order paid").waitFor();
    const materials = () => printer.evaluate((el) => {
      const paper = el.querySelector("p").parentElement;
      const slot = el.firstElementChild.lastElementChild.getBoundingClientRect();
      const sheet = paper.getBoundingClientRect();
      return {
        housing: getComputedStyle(el.firstElementChild).backgroundImage,
        sheet: getComputedStyle(paper).backgroundColor,
        edge: getComputedStyle(paper.lastElementChild).backgroundColor,
        ink: getComputedStyle(paper).color,
        feedOffset: sheet.top - (slot.top + slot.height / 2),
        marginDifference: (sheet.left - slot.left) - (slot.right - sheet.right),
      };
    });
    const light = await materials();
    await page.getByRole("button", { name: "Dark theme" }).click();
    const dark = await materials();
    assert.notEqual(dark.housing, light.housing, "Printer housing changes with the theme");
    for (const material of [light, dark]) {
      assert.equal(material.sheet, "rgb(255, 255, 255)");
      assert.equal(material.edge, material.sheet);
      assert.equal(material.ink, "rgb(34, 39, 32)");
      assert(Math.abs(material.feedOffset) <= 0.5, "Paper meets the feed slot");
      assert(Math.abs(material.marginDifference) <= 0.5, "Paper is centered in the slot");
    }
    await printer.getByRole("button", { name: "Print again" }).click();
    await printer.getByText("Order paid").waitFor();
    assert.deepEqual(await materials(), dark);
    await page.getByRole("button", { name: "Install", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("heading", { name: "Install the full library" }).waitFor();
    await dialog.getByRole("button", { name: "For agents" }).click();
    const fullPrompt = await dialog.locator("code").first().innerText();
    const command = fullPrompt.match(/bunx shadcn@latest add (https:\/\/[^\s]+)/);
    assert.ok(command, "Agent prompt includes a complete installation command");
    const registry = new URL(command[1]);
    assert.equal(registry.pathname, "/r/takt.json");
    assert.ok(fullPrompt.includes(registry.origin + "/llms.txt"));
    assert.ok(fullPrompt.includes(registry.origin + "/agents/search.json"));
    assert.doesNotMatch(await dialog.innerText(), /localhost|127\.0\.0\.1/);
    await page.keyboard.press("Escape");
    await page.locator('a[hreflang="ru"]').click();
    assert.equal(await page.locator("html").getAttribute("lang"), "ru");
  } finally {
    await page.close();
  }
}
