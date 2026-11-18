// Localize static copy before bundling so each installed component stays standalone.
import ts from "typescript";
import dictionary from "../i18n/en.json";

const messages: Record<string, string> = dictionary;
export function english(text: string): string {
  const key = text.trim().replace(/\s+/g, " ");
  if (!Object.hasOwn(messages, key)) {
    if (/[а-яё]/i.test(key)) throw new Error("Missing English translation: " + key);
    return text;
  }
  return text.replace(/\S[\s\S]*\S|\S/, () => messages[key]);
}

export function englishSource(path: string, source: string) {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const edits: { start: number; end: number; value: string }[] = [];
  function visit(node: ts.Node) {
    if (ts.isStringLiteralLike(node) || ts.isJsxText(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const value = english(node.text);
      if (value !== node.text) {
        const start = ts.isJsxText(node) ? node.getFullStart() : node.getStart(file);
        let replacement: string;
        if (ts.isJsxText(node)) replacement = value;
        else if (ts.isJsxAttribute(node.parent)) replacement = '"' + value.replaceAll("&", "&amp;").replaceAll('"', "&quot;") + '"';
        else if (ts.isStringLiteral(node)) replacement = JSON.stringify(value);
        else replacement = source[start] + value.replaceAll("`", "\\`") + (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) ? "${" : "`");
        edits.push({ start, end: node.end, value: replacement });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const { start, end, value } of edits.reverse()) source = source.slice(0, start) + value + source.slice(end);
  return source;
}
