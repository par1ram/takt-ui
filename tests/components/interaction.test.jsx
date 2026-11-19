import "@happy-dom/global-registrator/register";
import { afterEach, expect, mock, test } from "bun:test";
const { act, cleanup, fireEvent, render, renderHook, screen } = await import("@testing-library/react/pure");
import { CardField } from "../../components/motion/card-field";
import { CodeExercise } from "../../components/motion/code-exercise";
import { SpringSwitch } from "../../components/motion/spring-switch";
import { ChatComposer } from "../../components/motion/chat-composer";
import { OtpCode } from "../../components/motion/otp-code";
import { TagInput } from "../../components/motion/tag-input";
import { LetterLimit } from "../../components/motion/letter-limit";
import { useTrackerIssues } from "../../components/motion/tracker-issues";

afterEach(cleanup);

test("a controlled switch requests an update and waits for the owner's checked prop", () => {
  const changed = mock();
  const view = render(<SpringSwitch label="Alerts" checked={false} onCheckedChange={changed} />);
  const control = screen.getByRole("switch", { name: "Alerts" });
  fireEvent.click(control);
  expect(changed.mock.calls).toEqual([[true]]);
  expect(control.getAttribute("aria-checked")).toBe("false");
  view.rerender(<SpringSwitch label="Alerts" checked onCheckedChange={changed} />);
  expect(control.getAttribute("aria-checked")).toBe("true");
});

test("a local switch updates its accessible state immediately", () => {
  render(<SpringSwitch label="Alerts" defaultChecked={false} />);
  const control = screen.getByRole("switch", { name: "Alerts" });
  fireEvent.click(control);
  expect(control.getAttribute("aria-checked")).toBe("true");
});

test("a rejected send keeps the exact draft and allows a single successful retry", async () => {
  const first = Promise.withResolvers();
  const send = mock().mockImplementationOnce(() => first.promise).mockResolvedValueOnce(undefined);
  render(<ChatComposer placeholder="Message" onSend={send} />);
  const input = screen.getByRole("textbox", { name: "Message" });
  const submit = screen.getByRole("button");
  expect(submit.disabled).toBe(true);
  fireEvent.change(input, { target: { value: "  hello  " } });
  fireEvent.submit(input.form);
  fireEvent.submit(input.form);
  expect(input.readOnly).toBe(true);
  expect(submit.disabled).toBe(true);
  expect(send.mock.calls).toEqual([["hello"]]);
  await act(async () => { first.reject(new Error("offline")); });
  expect(input.value).toBe("  hello  ");
  expect(screen.getByRole("status").textContent).toContain("Ошибка");
  await act(async () => { fireEvent.submit(input.form); });
  expect(send.mock.calls).toEqual([["hello"], ["hello"]]);
  expect(input.value).toBe("");
});

test("blank, repeated, modified and composing Enter do not send", () => {
  const send = mock();
  const view = render(<ChatComposer value="  " onSend={send} />);
  const input = screen.getByRole("textbox");
  fireEvent.keyDown(input, { key: "Enter" });
  view.rerender(<ChatComposer value="ready" onSend={send} />);
  for (const event of [{ shiftKey: true }, { repeat: true }, { isComposing: true }, { keyCode: 229 }]) {
    fireEvent.keyDown(input, { key: "Enter", ...event });
  }
  expect(send).not.toHaveBeenCalled();
});

test("OTP keeps leading zeroes, filters mixed input and reports a complete code once", () => {
  const complete = mock();
  const view = render(<OtpCode length={4} onComplete={complete} />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "0a01" } });
  expect(input.value).toBe("001");
  expect(complete).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: "00123" } });
  expect(complete.mock.calls).toEqual([["0012"]]);
  view.rerender(<OtpCode length={0} onComplete={complete} />);
  expect(screen.queryByRole("textbox")).toBeNull();
});

test("tag edits trim, deduplicate without changing case and remove by accessible name", () => {
  const change = mock();
  render(<TagInput initial={["UI"]} onChange={change} />);
  const input = screen.getByRole("textbox");
  for (const value of [" ui ", " React "]) {
    fireEvent.change(input, { target: { value } });
    fireEvent.submit(input.form);
  }
  fireEvent.click(screen.getByRole("button", { name: "Удалить UI" }));
  expect(change.mock.calls).toEqual([[["UI", "React"]], [["React"]]]);
});

test("text limits operate on complete graphemes", () => {
  const change = mock();
  render(<LetterLimit limit={2} onChange={change} />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "e\u0301👩‍🎨x" } });
  expect(change.mock.calls).toEqual([["e\u0301👩‍🎨"]]);
  expect(input.value).toBe("e\u0301👩‍🎨");
});

test("controlled tracker patches one issue and adopts the array returned by the host", () => {
  const first = Object.freeze({ id: "one", title: "Sketch", status: "backlog", priority: "low", points: 1 });
  const second = Object.freeze({ ...first, id: "two" });
  const initial = Object.freeze([first, second]);
  const changed = mock();
  const { result, rerender } = renderHook(({ issues }) => useTrackerIssues({ issues, onIssuesChange: changed }), { initialProps: { issues: initial } });
  act(() => result.current.update("one", { status: "done" }));
  const next = changed.mock.calls[0][0];
  expect(next[0]).toEqual({ ...first, status: "done" });
  expect(next[1]).toBe(second);
  expect(result.current.rows).toBe(initial);
  rerender({ issues: next });
  expect(result.current.rows).toBe(next);
});

test("the demo card reports selection and reset using only the fixture digits", () => {
  const change = mock();
  render(<CardField onChange={change} />);
  fireEvent.click(screen.getByRole("button", { name: "Подставить тестовую карту" }));
  expect(screen.getByRole("status").textContent).toEndWith("4242");
  fireEvent.click(screen.getByRole("button", { name: "Сбросить" }));
  expect(change.mock.calls).toEqual([["4242424242424242"], [""]]);
});

test("stopping an exercise aborts the runner and ignores a late completion", async () => {
  const pending = Promise.withResolvers();
  const execute = mock(() => pending.promise);
  render(<CodeExercise onExecute={execute} initialInput="UI-9" />);
  fireEvent.click(screen.getByRole("button", { name: "Запустить" }));
  const [, batch, signal, running] = execute.mock.calls[0];
  expect(batch).toEqual([{ input: "UI-9", expected: true }]);
  act(running);
  fireEvent.click(screen.getByRole("button", { name: "Остановить" }));
  expect(signal.aborted).toBe(true);
  await act(async () => pending.resolve([true]));
  expect(screen.getByText("Остановлено")).toBeTruthy();
  expect(screen.queryByText("true")).toBeNull();
});

test("an incomplete batch from a custom runner exposes the error and restores editing", async () => {
  const cases = [{ input: "ok", expected: true }, { input: "bad", expected: false }];
  render(<CodeExercise onExecute={async () => [true]} tests={cases} />);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Проверить решение" })));
  expect(screen.getByText("Неполный ответ среды выполнения")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "К строке с ошибкой" }));
  expect(screen.getByRole("textbox", { name: "pattern.regex" }).readOnly).toBe(false);
  expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "pattern.regex" }));
});
