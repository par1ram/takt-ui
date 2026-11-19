import { describe, expect, test } from "bun:test";
import ts from "typescript";
import { english, englishSource } from "../../scripts/localize";

describe("standalone English source", () => {
  test("preserves surrounding whitespace and text outside the dictionary", () => {
    expect(english("  Отправлено\n")).toBe("  Sent\n");
    expect(english("POST /api/messages")).toBe("POST /api/messages");
    expect(english("   ")).toBe("   ");
  });

  test("refuses to ship untranslated UI text", () => {
    expect(() => englishSource("card.tsx", 'const title = "Нет такого перевода";')).toThrow("Missing English translation");
  });

  test("translates literals, JSX text and attributes without changing expressions or comments", () => {
    const input = '// Отправлено\nconst hint = "Отправлено";\nconst button = <button title="Отправить сообщение">{id} Отправлено </button>;';
    const result = englishSource("button.tsx", input);
    expect(result).toBe('// Отправлено\nconst hint = "Sent";\nconst button = <button title="Send message">{id} Sent </button>;');
    expect(ts.createSourceFile("button.tsx", result, ts.ScriptTarget.Latest, true).parseDiagnostics).toHaveLength(0);
  });
});
