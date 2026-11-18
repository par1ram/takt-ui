import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

export async function reviewHost(browser, origin) {
  const result = await Bun.build({
    entrypoints: [
      fileURLToPath(new URL("./fixtures/motion-host.jsx", import.meta.url)),
    ],
    target: "browser",
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
  });
  if (!result.success)
    throw new AggregateError(result.logs, "Fixture build failed");
  const bundle = await result.outputs[0].text();
  const page = await browser.newPage();
  page.setDefaultTimeout(4000);
  page.on("pageerror", (error) => console.error(error.message));
  try {
    await page.route("**/__motion-test.js", (route) =>
      route.fulfill({ contentType: "application/javascript", body: bundle }),
    );
    await page.route("**/__motion-test", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: '<!doctype html><html lang="ru"><main id="fixture"></main><script type="module" src="/__motion-test.js"></script></html>',
      }),
    );
    await page.goto(new URL("/__motion-test", origin).href);
    await page.waitForFunction(
      () => typeof window.fixture?.render === "function",
    );
    const render = (name, props, callback) =>
      page.evaluate(
        ([n, p, c]) => window.fixture.render(n, p, c),
        [name, props, callback],
      );
    const btn = (name) => page.getByRole("button", { name, exact: true });
    for (const [component, prop] of [
      ["TabPill", "options"],
      ["StepProgress", "steps"],
      ["PageFlip", "pages"],
    ]) {
      await render(component, { [prop]: ["A", "B", "C"] });
      if (component === "TabPill")
        await page.getByRole("tab", { name: "C" }).click();
      else if (component === "StepProgress") await btn("C").click();
      else await btn("Следующая страница").press("ArrowLeft");
      await render(component, { [prop]: ["Один"] });
      if (component === "TabPill")
        assert.equal(
          await page.getByRole("tab", { selected: true }).innerText(),
          "Один",
        );
      else if (component === "StepProgress") {
        assert.equal(await btn("Один").getAttribute("aria-current"), "step");
        assert.match(await page.getByRole("status").textContent(), /01.*01.*Один/s);
      } else assert((await page.locator("main").innerText()).includes("1 / 1"));
      await render(component, { [prop]: [] });
      assert.equal(await page.locator("main button").count(), 0);
    }
    await render("UnlockFaceId", { status: "error" }, "onScan");
    const calls = await page.evaluate(() => window.fixture.calls.length);
    await btn("Повторить сканирование").click();
    assert.equal(
      await page.evaluate(() => window.fixture.calls.length),
      calls + 1,
    );
    await render("UnlockFaceId", { status: "scanning" });
    assert(await btn("Сканирование…").isDisabled());
    await render("UnlockFaceId", { status: "success" });
    assert(await btn("Доступ открыт").isDisabled());
    await render("TaskList", { tasks: ["A", "B"] });
    await btn("B").click();
    await render("TaskList", { tasks: ["A"] });
    assert.equal(await page.locator("output").innerText(), "0/1");
    await render("NotificationStack", { messages: ["старое", "старое"] });
    await btn("Скрыть старое").first().click();
    await render("NotificationStack", {
      messages: ["новое", "старое", "старое"],
    });
    assert.equal(await btn("Скрыть новое").count(), 1);
    assert.equal(await btn("Скрыть старое").count(), 1);
    await render("MorphPopover", {}, "onSubmit");
    await btn("Обратная связь").click();
    const draft = page.getByRole("textbox");
    await draft.fill("  Текст отзыва  ");
    await draft.press("Control+Enter");
    assert(await btn("Отправка…").isDisabled());
    await page.evaluate(() => window.fixture.reject(new Error("offline")));
    await page.getByRole("alert").waitFor();
    assert.equal(await draft.inputValue(), "  Текст отзыва  ");
    await btn("Отправить").click();
    await page.evaluate(() => window.fixture.resolve());
    await page.getByText("Спасибо за отзыв").waitFor();
    assert.deepEqual(await page.evaluate(() => window.fixture.calls.at(-1)), [
      "Текст отзыва",
    ]);
    await render("OtpCode", { length: 6 });
    await page.getByRole("textbox").fill("123456");
    await render("OtpCode", { length: 3 });
    assert.equal(await page.getByRole("textbox").inputValue(), "123");
    await render("LetterLimit", { limit: 2 });
    const field = page.getByRole("textbox");
    await field.fill("e\u0301👩‍🎨x");
    assert.equal(await field.inputValue(), "e\u0301👩‍🎨");
    for (const [component, callback, action, error] of [
      ["LoadingSuccess", "onRun", "Запустить", "Повторить"],
      ["PullRefresh", "onRefresh", "Обновить", "Попробуйте ещё раз"],
      ["InvitePeople", "onInvite", "Пригласить", "Не удалось пригласить"],
      ["PromptBox", "onSend", "Отправить", "Не удалось отправить"],
    ]) {
      await render(component, {}, callback);
      if (component === "InvitePeople")
        await page.getByRole("textbox").fill("a@example.com");
      if (component === "PromptBox")
        await page.getByRole("textbox").fill("Первый запрос");
      const before = await page.evaluate(() => window.fixture.calls.length);
      await btn(action).click();
      assert((await page.locator("button:disabled").count()) > 0);
      await page.evaluate(() => window.fixture.reject(new Error("test")));
      await page.getByText(error, { exact: false }).first().waitFor();
      await btn(component === "LoadingSuccess" ? "Повторить" : action).click();
      await page.evaluate(() => window.fixture.resolve());
      await page.waitForFunction(
        () => !document.querySelector("button[aria-busy=true]"),
      );
      assert.equal(
        await page.evaluate(() => window.fixture.calls.length),
        before + 2,
      );
    }
    await page.evaluate(() =>
      Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
        configurable: true,
        value: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      }),
    );
    const order = {
      id: "checkout-7",
      description: "Шрифт",
      amount: 19,
      currency: "EUR",
    };
    const beforePayment = await page.evaluate(
      () => window.fixture.calls.length,
    );
    await render("ReceiptPrinter", { order, merchant: "Studio" }, "onPay");
    await page.getByRole("button", { name: /^Оплатить/ }).click();
    assert(await btn("Обрабатываем заказ").isDisabled());
    await page.evaluate(() => window.fixture.reject(new Error("declined")));
    await page.getByRole("alert").waitFor();
    assert.equal(await page.getByText("Итого", { exact: true }).count(), 0);
    await btn("Повторить оплату").click();
    await page.evaluate(() => window.fixture.resolve({ orderId: "ST-7" }));
    await btn("Напечатать ещё раз").waitFor();
    await page.getByText("Заказ № ST-7").waitFor();
    await btn("Напечатать ещё раз").click();
    await btn("Напечатать ещё раз").waitFor();
    assert.deepEqual(
      await page.evaluate((n) => window.fixture.calls.slice(n), beforePayment),
      [[order], [order]],
    );
    await render(
      "ReceiptPrinter",
      { order: { ...order, id: "checkout-8" } },
      "onPay",
    );
    assert(await page.getByRole("button", { name: /^Оплатить/ }).isEnabled());

    await render("VoiceInput", {});
    await btn("Записать голос").click();
    await page.getByText("Микрофон недоступен").waitFor();
    assert(await btn("Записать голос").isEnabled());

    await page.goto("http://takt-fixture.test/__motion-test");
    await render("CardField", { mode: "payment" });
    await page.getByText(/откройте страницу по HTTPS/).waitFor();
    assert.equal(await page.locator("input,iframe").count(), 0);

    await page.goto("https://takt-fixture.test/__motion-test");
    await page.evaluate(() => {
      const fixture = window.fixture;
      fixture.paymentEvents = {};
      const elements = {
        create(type) {
          if (type !== "payment")
            throw new Error("Expected a Stripe payment element");
          const frame = document.createElement("iframe");
          frame.title = "Hosted payment fixture";
          return {
            mount: (node) => node.append(frame),
            destroy: () => frame.remove(),
            on: (name, cb) => {
              fixture.paymentEvents[name] = cb;
            },
            off: (name) => {
              delete fixture.paymentEvents[name];
            },
          };
        },
      };
      fixture.stripe = {
        elements: () => elements,
        createToken() {},
        createPaymentMethod() {},
        confirmCardPayment() {},
      };
    });
    await render("HostedCardField", {}, "onCompleteChange");
    await page.locator('iframe[title="Hosted payment fixture"]').waitFor();
    await page.waitForFunction(
      () => typeof window.fixture.paymentEvents.change === "function",
    );
    await page.evaluate(() => {
      window.fixture.paymentEvents.change({
        complete: true,
        value: { type: "card" },
      });
    });
    assert.deepEqual(await page.evaluate(() => window.fixture.calls), [[true]]);
    await page.evaluate(() => window.fixture.paymentEvents.loaderror({}));
    await page.getByRole("alert").waitFor();
    assert.deepEqual(await page.evaluate(() => window.fixture.calls), [
      [true],
      [false],
    ]);
    await btn("Повторить").click();
    await page.locator('iframe[title="Hosted payment fixture"]').waitFor();
  } finally {
    await page.close();
  }
}
