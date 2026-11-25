import assert from "node:assert/strict";

export async function reviewMessenger(browser, origin) {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: mobile ? 360 : 1240, height: 850 },
      reducedMotion: mobile ? "reduce" : "no-preference",
    });
    try {
      const page = await context.newPage();
      page.setDefaultTimeout(4500);
      await page.goto(
        new URL(mobile ? "/ru/messenger" : "/messenger", origin).href,
      );
      // Drafts live in React state, so typing before hydration lets the controlled
      // textarea reset to an empty draft on a slow runner. React marks a hydrated
      // element with an internal fiber key; wait for it before touching the form.
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll("textarea")].some((node) =>
            Object.keys(node).some((key) => key.startsWith("__reactFiber$")),
          ),
        null,
        { timeout: 15000 },
      );
      const btn = (name) => page.getByRole("button", { name, exact: true });
      const text = (en, ru) => (mobile ? ru : en);
      const select = async (name) => {
        if (mobile) await btn("Выбрать диалог").click();
        await btn(name).click();
      };
      if (mobile) await btn("Сменить тему").click();
      const studio = text("design-studio", "дизайн-студия");
      const dm = text("Maya Lee", "Майя Ли");
      const box = (name) => page.getByRole("textbox", { name, exact: true });
      const channelBox = (name) =>
        box(text("Message in ", "Сообщение в ") + name);
      await channelBox(studio).fill("Studio draft");
      await select(dm);
      assert.equal(await channelBox(dm).inputValue(), "");
      await channelBox(dm).fill("Private question");
      await channelBox(dm).press("Enter");
      await page.getByText("Private question", { exact: true }).waitFor();
      await select(studio);
      assert.equal(await channelBox(studio).inputValue(), "Studio draft");
      assert.equal(
        await page.getByText("Private question", { exact: true }).count(),
        0,
      );
      const threadButton = (n) => btn(text("Replies", "Ответы") + " · " + n);
      await threadButton(1).click();
      const threadBox = box(text("Reply in thread", "Ответить в треде"));
      const close = btn(text("Close thread", "Закрыть тред"));
      assert(await close.evaluate((el) => el === document.activeElement));
      await threadBox.fill("Thread draft");
      await threadBox.press("Escape");
      await threadButton(1).waitFor();
      await page.waitForFunction(
        () =>
          document.activeElement?.matches("button") &&
          document.activeElement.textContent.includes("1"),
      );
      await threadButton(1).click();
      assert.equal(await threadBox.inputValue(), "Thread draft");
      await threadBox.press("Enter");
      await page.getByText("Thread draft", { exact: true }).waitFor();
      await close.click();
      await threadButton(2).waitFor();
      assert.equal(await channelBox(studio).inputValue(), "Studio draft");
      await btn(text("Add reaction", "Добавить реакцию")).first().click();
      await btn(text("Applause", "Аплодисменты")).click();
      await btn(text("Applause, 1", "Аплодисменты, 1")).waitFor();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
    } finally {
      await context.close();
    }
  }
}
