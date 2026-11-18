import assert from "node:assert/strict";
import { chromium } from "playwright";
import { reviewEnglish } from "./review-english.mjs";
import { reviewHost } from "./review-motion-host.mjs";

// Run against the built catalog. Pass MOTION_REVIEW_URL to use another origin.
const origin = process.env.MOTION_REVIEW_URL ?? "http://127.0.0.1:3000";
const button = (stage, name) =>
  stage.getByRole("button", { name, exact: true });
const buttons = (stage) => stage.getByRole("button");
const first = (stage) => buttons(stage).first();
const textbox = (stage) => stage.getByRole("textbox").first();
const status = (stage) => stage.getByRole("status").first();
async function contains(node, text) {
  await node.filter({ hasText: text }).first().waitFor();
}
async function pressed(node, attribute = "aria-pressed") {
  const original = await node.getAttribute(attribute);
  assert(["true", "false"].includes(original), attribute);
  await node.press("Space");
  assert.notEqual(await node.getAttribute(attribute), original);
  await node.press("Enter");
  assert.equal(await node.getAttribute(attribute), original);
}
async function selections(stage) {
  const all = await stage.locator("button[aria-pressed]").all();
  assert(all.length > 1);
  for (const item of [...all, all[0]]) {
    await item.click();
    assert.equal(await item.getAttribute("aria-pressed"), "true");
    assert.equal(await stage.locator('button[aria-pressed="true"]').count(), 1);
  }
}
async function range(stage) {
  const input = stage.getByRole("slider");
  for (const [key, attr] of [
    ["End", "max"],
    ["Home", "min"],
  ]) {
    await input.press(key);
    assert.equal(
      await input.inputValue(),
      (await input.getAttribute(attr)) ?? (attr === "max" ? "100" : "0"),
    );
  }
  await input.press("ArrowRight");
  assert(
    Number(await input.inputValue()) > Number(await input.getAttribute("min")),
  );
}
async function tabs(stage) {
  const tabs = stage.getByRole("tab");
  for (const [key, index] of [
    ["End", (await tabs.count()) - 1],
    ["Home", 0],
    ["ArrowRight", 1],
    ["ArrowLeft", 0],
  ]) {
    await stage.getByRole("tab", { selected: true }).press(key);
    assert.equal(await tabs.nth(index).getAttribute("aria-selected"), "true");
    assert(await tabs.nth(index).evaluate((n) => n === document.activeElement));
    await stage
      .getByRole("tabpanel", { name: await tabs.nth(index).innerText() })
      .waitFor();
  }
}
async function hold(stage, page) {
  const node = first(stage);
  await node.focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(75);
  await page.keyboard.up("Space");
  assert(
    !/Опубликовано|Подтверждено/.test(
      (await node.getAttribute("aria-label")) ?? (await node.innerText()),
    ),
  );
  await page.keyboard.down("Space");
  try {
    await stage
      .getByRole("button", { name: /Опубликовано|Подтверждено/ })
      .waitFor();
  } finally {
    await page.keyboard.up("Space");
  }
  await stage
    .getByRole("button", { name: /Удерживайте|Удерживать для публикации/ })
    .waitFor();
}
async function drag(node, page, dx, dy) {
  const box = await node.boundingBox();
  const x = box.x + Math.min(20, box.width / 2),
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 6 });
  await page.mouse.up();
}
// Native touch events let Chromium arbitrate horizontal drags against scrolling.
async function swipeRight(node, page) {
  await node.scrollIntoViewIfNeeded();
  const box = await node.boundingBox();
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const y = box.y + box.height / 2;
    for (let step = 0; step <= 10; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: step ? "touchMove" : "touchStart",
        touchPoints: [{ x: box.x + box.width * (0.21 + step * 0.052), y }],
      });
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await session.detach();
  }
}
const scenarios = {
  "magnetic-button": async (s) => {
    const b = first(s);
    await b.hover();
    await b.press("Space");
    assert(await b.evaluate((n) => n === document.activeElement));
  },
  "flip-counter": async (s) => {
    await button(s, "Увеличить").click();
    await contains(status(s), "13");
    await button(s, "Уменьшить").press("ArrowDown");
    await contains(status(s), "12");
  },
  "swipe-deck": async (s) => {
    const b = first(s),
      start = await b.getAttribute("aria-label");
    await b.click();
    await s
      .getByRole("button", { name: start, exact: true })
      .waitFor({ state: "detached" });
    await b.press("ArrowLeft");
    await s.getByRole("button", { name: start, exact: true }).waitFor();
  },
  "spring-dock": selections,
  "rubber-dock": selections,
  "segmented-control": selections,
  "plan-switch": async (s) => {
    await selections(s);
    await contains(s, "1 200");
  },
  "spring-switch": (s) => pressed(s.getByRole("switch"), "aria-checked"),
  "wave-slider": async (s) => {
    const r = s.getByRole("slider");
    const start = await r.inputValue();
    await first(s).click();
    assert.equal(await r.inputValue(), "0");
    await first(s).click();
    assert.equal(await r.inputValue(), start);
    await range(s);
  },
  "hold-button": hold,
  "hold-to-publish": hold,
  "rolling-text": async (s) => {
    const b = first(s);
    const start = await b.getAttribute("aria-label");
    await b.press("ArrowRight");
    await s
      .getByRole("button", { name: start, exact: true })
      .waitFor({ state: "detached" });
    await b.press("ArrowLeft");
    assert.equal(await b.getAttribute("aria-label"), start);
  },
  "bloom-menu": async (s) => {
    const trigger = first(s);
    await trigger.click();
    assert((await buttons(s).count()) > 1);
    await buttons(s).nth(1).click();
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    await trigger.click();
    await trigger.press("Escape");
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
  },
  "invite-people": async (s) => {
    const email = textbox(s);
    await email.fill("invalid");
    await email.press("Enter");
    assert.equal(await email.evaluate((n) => n.validity.valid), false);
    await email.fill("mira@example.com");
    await email.press("Enter");
    await contains(s, "Этот адрес уже есть");
    await email.fill("team@example.org");
    await email.press("Enter");
    await contains(s, "Добавлен team@example.org");
    await button(s, "team").click();
    await contains(s, "team@example.org");
  },
  "focus-mode": (s) => pressed(first(s)),
  "bell-button": (s) => pressed(first(s)),
  "music-toggle": (s) => pressed(first(s)),
  "morph-tooltip": async (s) => {
    for (const b of await buttons(s).all()) {
      await b.focus();
      await pressed(b);
      await b.press("Escape");
      await s.getByRole("tooltip").waitFor({ state: "hidden" });
    }
  },
  "command-button": async (s) => {
    const b = first(s);
    await b.press("Enter");
    await b.press("Control+Enter");
    await contains(status(s), "2");
  },
  "loading-success": async (s) => {
    await first(s).click();
    assert(await first(s).isDisabled());
    await s.getByRole("button", { name: /Готово|Успешно/ }).waitFor();
    await first(s).click();
    assert(await first(s).isDisabled());
  },
  "copy-button": async (s, p) => {
    await p
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"], { origin });
    await first(s).click();
    await contains(s, "Скопировано");
    await button(s, "Скопировать").waitFor();
  },
  "like-burst": (s) => pressed(first(s)),
  "slide-to-confirm": async (s, p) => {
    const r = s.getByRole("slider");
    await drag(r, p, 36, 0);
    assert.equal(await r.inputValue(), "0");
    const track = await r.boundingBox();
    const y = track.y + track.height / 2;
    for (const offset of [43, 11, track.width / 2]) {
      await p.mouse.move(track.x + offset, y);
      await p.mouse.down();
      await p.mouse.move(track.x + track.width - 26, y, { steps: 4 });
      assert(await r.isDisabled());
      await p.mouse.move(track.x + track.width / 2, y + 30);
      await p.mouse.up();
      assert(await r.isDisabled());
      await button(s, "Сбросить подтверждение").click();
    }
    await p.mouse.click(track.x + track.width - 10, y);
    assert.equal(await r.inputValue(), "0");
    await p.mouse.move(track.x + 25, y);
    await p.mouse.down();
    await p.mouse.move(track.x + 100, y);
    await p.keyboard.press("Escape");
    await p.mouse.move(track.x + track.width + 10, y);
    await p.mouse.up();
    assert.equal(await r.inputValue(), "0");
    for (let i = 0; i < 5; i++) await r.press("PageUp");
    const rect = await r.boundingBox();
    const middle =
      rect.x + 27 + ((rect.width - 54) * Number(await r.inputValue())) / 100;
    await p.mouse.move(middle, rect.y + rect.height / 2);
    await p.mouse.down();
    await p.mouse.move(rect.x + rect.width - 26, rect.y + rect.height / 2, {
      steps: 8,
    });
    await p.mouse.up();
    assert(await r.isDisabled());
    await button(s, "Сбросить подтверждение").click();
    assert.equal(await r.inputValue(), "0");
  },
  "cart-button": async (s) => {
    await first(s).click();
    await button(s, "Добавить один").click();
    await button(s, "Убрать один").click();
    await button(s, "Убрать один").click();
    await button(s, "В корзину").waitFor();
  },
  "undo-button": async (s) => {
    await first(s).click();
    await contains(status(s), "удалена");
    await first(s).click();
    await contains(status(s), "Черновик");
  },
  "unlock-face-id": async (s) => {
    await Promise.all([
      s.locator("button:disabled").waitFor(),
      first(s).click(),
    ]);
    await contains(first(s), "Готово");
    await first(s).click();
    await contains(first(s), "Начать сканирование");
    await s.getByText("Закрытый файл").waitFor();
  },
  "spring-dropdown": async (s) => {
    const trigger = s.locator("button[aria-expanded]");
    await trigger.press("Enter");
    await button(s, "Готово").click();
    await contains(trigger, "Готово");
    await trigger.press("Space");
    await button(s, "На проверке").press("Escape");
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    assert(await trigger.evaluate((el) => el === document.activeElement));
    assert.equal(await buttons(s).count(), 1);
  },
  "morph-island": async (s) => {
    for (const label of ["Таймер", "Экспорт", "Звонок"]) {
      await button(s, label).click();
      assert.equal(await button(s, label).getAttribute("aria-pressed"), "true");
      if (label === "Экспорт") await contains(s, "Экспорт готов");
    }
    await button(s, "Отклонить звонок").click();
    assert.equal(await button(s, "Покой").getAttribute("aria-pressed"), "true");
    await button(s, "Звонок").click();
    await button(s, "Принять звонок").click();
    assert.equal(await button(s, "Покой").getAttribute("aria-pressed"), "true");
  },
  "tab-pill": tabs,
  "swipe-tabs": tabs,
  "dynamic-menu": async (s) => {
    await first(s).click();
    await button(s, "Экспорт").click();
    await button(s, "Назад").click();
    await button(s, "Экспорт").click();
    await buttons(s).last().click();
    assert.equal(await first(s).getAttribute("aria-expanded"), "false");
    assert(await first(s).evaluate((n) => n === document.activeElement));
  },
  "sidebar-collapse": async (s) => {
    await buttons(s).last().click();
    await pressed(first(s), "aria-expanded");
    assert.equal(await buttons(s).last().getAttribute("aria-pressed"), "true");
  },
  "pagination-dots": async (s) => {
    await first(s).press("End");
    await contains(status(s), "05");
    await buttons(s).last().press("Home");
    await contains(status(s), "01");
  },
  "command-palette": async (s, p) => {
    await first(s).click();
    const d = p.getByRole("dialog"),
      input = d.getByRole("textbox");
    await input.fill("xxxxx");
    await contains(d, "Ничего не найдено");
    await input.fill("файл");
    await input.press("Enter");
    await d.waitFor({ state: "hidden" });
    await first(s).click();
    await input.press("Escape");
    await d.waitFor({ state: "hidden" });
  },
  "step-progress": async (s) => {
    const current = s.locator('button[aria-current="step"]');
    assert.equal(await current.getAttribute("aria-label"), "Данные");
    await button(s, "Далее").click();
    assert.equal(await current.getAttribute("aria-label"), "Оформление");
    await button(s, "Далее").click();
    assert.equal(await current.getAttribute("aria-label"), "Проверка");
    await button(s, "Сначала").click();
    await contains(status(s), "Данные");
    await button(s, "Проверка").press("Enter");
    await button(s, "Оформление").press("Space");
    assert.equal(await current.getAttribute("aria-label"), "Оформление");
    await contains(status(s), "Оформление");
  },
  toolbar: async (s) => {
    for (const b of await buttons(s).all()) await pressed(b);
  },
  "morph-popover": async (s) => {
    await first(s).click();
    const field = textbox(s);
    assert(await button(s, "Отправить").isDisabled());
    await field.fill("Больше переходов");
    await field.press("Escape");
    await button(s, "Обратная связь").press("Enter");
    assert.equal(await field.inputValue(), "Больше переходов");
    await field.press("Control+Enter");
    await contains(status(s), "Спасибо за отзыв");
    await button(s, "Обратная связь").waitFor();
  },
  "letter-limit": async (s) => {
    const i = textbox(s);
    const value = "👩🏽‍🎨".repeat(80);
    await i.fill(value + "x");
    assert.equal(await i.inputValue(), value);
    await contains(s, "Лимит достигнут");
    await i.fill("");
    await contains(s, "0 / 80");
  },
  "file-drop": async (s) => {
    const file = s.locator("input[type=file]");
    await file.setInputFiles({
      name: "review.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("ok"),
    });
    await contains(s, "review.txt");
    await s.locator("label").evaluate((el) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.setData("text/plain", "other drag");
      el.dispatchEvent(
        new DragEvent("drop", {
          dataTransfer,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    await contains(s, "review.txt");
    await s.getByRole("button", { name: /Убрать/ }).click();
    assert.equal(await s.locator("li").count(), 0);
  },
  "springy-input": async (s) => {
    const input = s.getByRole("searchbox");
    assert(await button(s, "Найти").isDisabled());
    await input.click();
    assert.equal(
      await input.evaluate((el) => getComputedStyle(el).outlineStyle),
      "none",
    );
    await input.fill("Команда");
    await input.press("Enter");
    await contains(status(s), "Запрос принят");
    await button(s, "Очистить").click();
    assert.equal(await input.inputValue(), "");
  },
  "otp-code": async (s) => {
    const i = textbox(s);
    await i.fill("12а345");
    assert.equal(await i.inputValue(), "1234");
    await i.press("Backspace");
    assert.equal(await i.inputValue(), "123");
  },
  "star-rating": selections,
  "tag-input": async (s) => {
    const i = textbox(s);
    await i.fill("Новый");
    await i.press(",");
    await button(s, "Удалить Новый").waitFor();
    await i.fill("Новый");
    await i.press("Enter");
    assert.equal(await button(s, "Удалить Новый").count(), 1);
    await i.press("Backspace");
    await button(s, "Удалить Новый").waitFor({ state: "detached" });
  },
  "password-strength": async (s) => {
    const i = s.locator("input");
    await i.fill("Ébc1234!");
    await contains(s, "Все критерии выполнены");
    await i.fill("123");
    await contains(s, "Заглавная буква");
    await i.fill("");
    assert.equal(await i.inputValue(), "");
  },
  "checkbox-list": async (s) => {
    const list = await s.getByRole("checkbox").all();
    for (const item of list) await item.check();
    await contains(s, "3 / 3");
    for (const item of list) await item.uncheck();
    await contains(s, "0 / 3");
  },
  "jelly-slider": range,
  "detent-dial": range,
  scrubber: range,
  "exposure-slider": async (s) => {
    await range(s);
    await pressed(button(s, "Сравнить с оригиналом"));
    await button(s, "Сбросить экспозицию").click();
    assert(await button(s, "Сбросить экспозицию").isDisabled());
  },
  "wheel-picker": async (s) => {
    await first(s).press("End");
    assert.equal(await buttons(s).last().getAttribute("aria-pressed"), "true");
    await buttons(s).last().press("Home");
    assert.equal(await first(s).getAttribute("aria-pressed"), "true");
  },
  "receipt-printer": async (s) => {
    await s.getByRole("button", { name: /^Оплатить/ }).click();
    await contains(status(s), "Обрабатываем заказ");
    await button(s, "Напечатать ещё раз").waitFor();
    await contains(s, "DEMO-024");
    await button(s, "Напечатать ещё раз").click();
    await button(s, "Напечатать ещё раз").waitFor();
    await contains(status(s), "Заказ оплачен");
  },
  "card-field": async (s) => {
    assert.equal(await s.locator("input,iframe").count(), 0);
    await button(s, "Подставить тестовую карту").press("Enter");
    await contains(status(s), "4242");
    assert(!(await s.innerText()).includes("4242424242424242"));
    await button(s, "Сбросить").click();
    await button(s, "Подставить тестовую карту").waitFor();
  },
  "signature-pad": async (s, p) => {
    const undo = button(s, "Отменить последний штрих");
    assert(await undo.isDisabled());
    await drag(s.locator("canvas"), p, 42, 10);
    await undo.click();
    assert(await undo.isDisabled());
    await drag(s.locator("canvas"), p, 33, 3);
    await button(s, "Очистить").click();
    assert(await button(s, "Сохранить").isDisabled());
  },
  "parallax-ticket": (s) => pressed(first(s)),
  "glass-lens": (s) => pressed(first(s)),
  "pull-refresh": async (s, p) => {
    const b = first(s);
    await b.click();
    await drag(b, p, 0, 24);
    await contains(status(s), "2");
    await drag(s.getByText("Макет студии.fig"), p, 0, 105);
    await contains(status(s), "3");
  },
  "expand-card": async (s) => {
    for (const title of [
      "Коллекция Glass",
      "Коллекция Orbit",
      "Коллекция Fold",
    ]) {
      const row = button(s, title);
      await row.press("Enter");
      assert.equal(await row.getAttribute("aria-expanded"), "true");
      assert.equal(await buttons(s).count(), 1);
      await row.press("Escape");
      assert.equal(await buttons(s).count(), 3);
    }
  },
  "fan-cards": (s) => pressed(first(s), "aria-expanded"),
  "boarding-pass": (s) => pressed(first(s), "aria-expanded"),
  "stat-card": async (s) => {
    const mode = button(s, "Линейный график");
    const point = s.getByRole("button", { name: /^Значение / }).last();
    await mode.click();
    assert.equal(await point.locator("span").count(), 1);
    assert.equal(await s.locator("linearGradient").count(), 0);
    await mode.click();
    const travel = await s.evaluate(async (stage) => {
      const points = stage.querySelectorAll("button[aria-label^='Значение ']");
      const path = stage.querySelector("path[vector-effect]");
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0).x;
      const end = path.getPointAtLength(length).x;
      const nextFrame = () => new Promise(requestAnimationFrame);
      points[0].focus();
      await nextFrame();
      points[points.length - 1].focus();
      let intermediate = false;
      let error = 0;
      let x = start;
      const deadline = performance.now() + 2000;
      while (Math.abs(end - x) > 0.05 && performance.now() < deadline) {
        await nextFrame();
        const marker = stage.querySelector("ellipse");
        x = marker.cx.baseVal.value;
        intermediate ||= x > start + 0.1 && x < end - 0.1;
        let lo = 0, hi = length;
        for (let step = 0; step < 16; step++) {
          const mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).x < x) lo = mid;
          else hi = mid;
        }
        error = Math.max(error, Math.abs(marker.cy.baseVal.value - path.getPointAtLength(hi).y));
      }
      return { intermediate, error, remaining: Math.abs(end - x), reduced: matchMedia("(prefers-reduced-motion: reduce)").matches };
    });
    assert.equal(travel.intermediate, !travel.reduced, "marker motion between focused values");
    assert(travel.error < 0.1 && travel.remaining < 0.05, JSON.stringify(travel));
    await point.hover();
    await s.locator("svg ellipse").waitFor();
    assert.equal(await s.locator("linearGradient stop").count(), 2);
    assert.equal(await point.locator("span").count(), 0);
    await pressed(button(s, "Недельный период"));
    await buttons(s).last().focus();
    await contains(status(s), "21");
  },
  "profile-card": async (s) => {
    const follow = button(s, "Подписаться");
    const width = (await follow.boundingBox()).width;
    await follow.click();
    const subscribed = button(s, "Вы подписаны");
    await s.getByText("12 490", { exact: true }).waitFor({ state: "attached" });
    const message = button(s, "Сообщение");
    await message.click();
    assert((await subscribed.boundingBox()).width < width * 0.65);
    await s.getByLabel("Черновик сообщения").fill("Привет!");
    await subscribed.click();
    assert.equal(await message.count(), 0);
    await pressed(first(s), "aria-expanded");
  },
  "notification-stack": async (s, page) => {
    await first(s).click();
    const front = s.locator('[data-notice="review"]');
    await swipeRight(front, page);
    await front.waitFor({ state: "detached" });
    while (await s.getByRole("button", { name: /Скрыть/ }).count())
      await s
        .getByRole("button", { name: /Скрыть/ })
        .first()
        .click();
    await contains(s, "Новых уведомлений нет");
  },
  "page-flip": async (s) => {
    await first(s).press("ArrowLeft");
    await contains(s, "3 / 3");
    await first(s).click();
    await contains(s, "1 / 3");
  },
  "stack-panel": async (s, page) => {
    await s.getByRole("button", { name: /^Проекты/ }).click();
    await button(s, "Коллекция Glass В работе").click();
    await button(s, "На ревью").click();
    assert.equal(
      await button(s, "На ревью").getAttribute("aria-pressed"),
      "true",
    );
    await button(s, "Назад").press("Escape");
    const project = button(s, "Коллекция Glass На ревью");
    await project.waitFor();
    assert(await project.evaluate((el) => document.activeElement === el));
    await swipeRight(project, page);
    await s.getByRole("button", { name: /^Проекты/ }).waitFor();
  },
  "glass-player": async (s) => {
    await pressed(button(s, "Повторять трек"));
    await pressed(button(s, "Без звука"));
    const seek = s.getByRole("slider");
    await seek.press("ArrowRight");
    assert(Number(await seek.inputValue()) > 0);
    await button(s, "Воспроизвести").click();
    await button(s, "Пауза").click();
    await contains(status(s), "На паузе");
  },
  "weight-wave": async (s) => {
    const b = first(s);
    const before = await b.locator("span").first().getAttribute("style");
    await b.press("ArrowRight");
    assert.notEqual(
      await b.locator("span").first().getAttribute("style"),
      before,
    );
  },
  "goo-morph": async (s) => {
    await first(s).click();
    await contains(s, "Форма");
    await first(s).click();
    await contains(s, "Контур");
  },
  "scramble-text": async (s) => {
    await first(s).press("Enter");
    await contains(s, "SIGNAL");
  },
  "read-along": async (s) => {
    await button(s, "Выделить следующее слово").click();
    await contains(status(s), "2 / 5");
    await button(s, "Воспроизвести чтение").click();
    await button(s, "Приостановить чтение").click();
    await first(s).click();
    await contains(status(s), "1 / 5");
  },
  "roll-links": async (s) => {
    const link = s.getByRole("link");
    await link.focus();
    await link.hover();
    assert.equal(await link.getAttribute("href"), "#top");
  },
  "marker-text": (s) => pressed(first(s)),
  "dynamic-text": async (s) => {
    await first(s).press("Space");
    await contains(s, "связи");
    await first(s).click();
    await contains(s, "движение");
  },
  typewriter: async (s) => {
    await first(s).press("Space");
    await contains(s, "Движение начинается.");
  },
  "prompt-box": async (s) => {
    const i = textbox(s);
    await first(s).click();
    assert((await i.inputValue()).length);
    await i.press("Shift+Enter");
    assert((await i.inputValue()).includes("\n"));
    await i.press("Enter");
    await button(s, "Редактировать прошлый запрос").click();
    assert((await i.inputValue()).length);
  },
  "streaming-reply": async (s, p) => {
    await first(s).click();
    if (
      !(await p.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      ))
    ) {
      await button(s, "Приостановить").click();
      await first(s).click();
    }
    await button(s, "Повторить").waitFor();
    await first(s).click();
  },
  "ghost-suggestion": async (s) => {
    const i = textbox(s);
    await i.fill("Соб");
    await i.press("Escape");
    assert(await first(s).isDisabled());
    await i.fill("Собра");
    await i.press("Tab");
    assert.equal(await i.inputValue(), "Собрать каталог");
  },
  "goo-thinking": async (s, page) => {
    const dots = s.locator("svg circle");
    if (
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      )
    ) {
      assert.equal(await dots.locator("animate").count(), 0);
    } else {
      await page.waitForFunction(() => {
        const ys = [
          ...document.querySelectorAll(".stage-goo-thinking circle"),
        ].map((circle) => circle.cy.animVal.value);
        return Math.max(...ys) - Math.min(...ys) > 4;
      });
    }
    await first(s).click();
    await button(s, "Повторить обработку").waitFor();
    await button(s, "Повторить обработку").click();
    assert.equal(await first(s).getAttribute("aria-expanded"), "false");
  },
  "siri-orb": async (s) => {
    await pressed(first(s));
    for (const label of [
      "Слушаю",
      "Обдумываю",
      "Отвечаю",
      "Готово",
      "Ошибка",
      "В ожидании",
    ]) {
      await button(s, label).click();
      await contains(status(s), label);
      assert.equal(await button(s, label).getAttribute("aria-pressed"), "true");
    }
  },
  "thinking-text": (s) => pressed(first(s)),
  "agent-steps": async (s) => {
    for (let i = 0; i < 3; i++) await first(s).click();
    await button(s, "Заново").click();
    await button(s, "Следующий этап").waitFor();
  },
  "tool-approval": async (s) => {
    for (const [action, result] of [
      ["Отклонить", "Отклонено"],
      ["Разрешить", "Разрешено"],
    ]) {
      await button(s, action).click();
      await contains(s, result);
      await button(s, "Сброс").click();
    }
  },
  "task-list": async (s) => {
    const list = await buttons(s).all();
    for (const b of list) await b.click();
    await contains(status(s), "3/3");
    for (const b of list) await b.click();
    await contains(status(s), "0/3");
  },
  "voice-input": async (s) => {
    await first(s).click();
    await button(s, "Остановить запись").click();
    await s.locator("audio").waitFor({ state: "attached" });
    await button(s, "Прослушать запись").waitFor();
    await button(s, "Записать голос").waitFor();
  },
  "command-search": async (s) => {
    const label = first(s).locator("span");
    assert(await label.evaluate((el) => el.scrollWidth <= el.clientWidth));
    assert.match(await first(s).locator("kbd").innerText(), /^(⌘|Ctrl) K$/);
    await first(s).click();
    const i = textbox(s);
    assert(await button(s, "Искать").isDisabled());
    await i.fill("Каталог");
    await i.press("Enter");
    await contains(first(s), "Каталог");
    await first(s).click();
    await i.press("Escape");
    assert(await first(s).evaluate((n) => n === document.activeElement));
  },
};

const index = await (await fetch(new URL("/r/registry.json", origin))).json();
assert.deepEqual(
  Object.keys(scenarios).sort(),
  index.items.filter((i) => i.type === "registry:ui").map((i) => i.name).sort(),
);
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  args: [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const failures = [];
try {
  await Promise.all(
    ["light", "dark"].map(async (theme) => {
      const mobile = theme === "dark";
      const context = await browser.newContext({
        viewport: { width: mobile ? 360 : 1250, height: 850 },
        colorScheme: theme,
        reducedMotion: mobile ? "reduce" : "no-preference",
        permissions: ["microphone"],
      });
      const page = await context.newPage();
      page.setDefaultTimeout(3500);
      let current = "catalog";
      page.on("pageerror", (e) =>
        failures.push(theme + " " + current + ": " + e.message),
      );
      await page.goto(new URL("/ru", origin).href);
      await page
        .getByRole("button", { name: mobile ? "Тёмная тема" : "Светлая тема" })
        .click();
      const activeFilter = page.getByRole("button", { name: "Все", exact: true });
      const accent = () => activeFilter.evaluate((el) => getComputedStyle(el).backgroundColor);
      const originalAccent = await accent();
      await button(page, "Акцентный цвет").click();
      await button(page, "Синий").click();
      await page.keyboard.press("Escape");
      assert.notEqual(await accent(), originalAccent, "Accent must change the rendered color");
      for (const item of index.items.filter((i) => i.type === "registry:ui")) {
        current = item.name;
        try {
          await page
            .getByRole("textbox", { name: "Поиск компонентов" })
            .fill(item.title);
          const stage = page.locator(".stage-" + item.name);
          await stage.scrollIntoViewIfNeeded();
          await stage
            .locator(":scope > :not(.preview-placeholder,.magnetic-field)")
            .first()
            .waitFor();
          await scenarios[item.name](stage, page);
        } catch (error) {
          failures.push(theme + " " + item.name + ": " + error.message);
          await page.keyboard.press("Escape");
        }
      }
      await context.close();
    }),
  );
  try {
    await reviewEnglish(browser, origin, index.items);
    await reviewHost(browser, origin);
  } catch (error) {
    failures.push("English catalog / host: " + error.message);
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    Object.keys(scenarios).length +
      " components passed in light and dark themes, including reduced motion.",
  );
