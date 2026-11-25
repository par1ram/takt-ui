import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import manifest from "../../references/motion/manifest.json";
import { entries } from "../../lib/catalog";

const notices = readFileSync("THIRD_PARTY_NOTICES.md", "utf8");
const byId = new Map(manifest.items.map(item => [item.id, item]));
const originals = new Set([
  "receipt-printer", "lesson-outline", "code-exercise", "run-console", "test-results",
  "ask-tutor", "lesson-citation", "predict-output", "execution-trace", "hint-ladder",
  "channel-list", "chat-composer", "message-reactions", "chat-post", "message-thread",
  "course-messenger", "latency-chart", "conversion-funnel", "cohort-retention",
  "issue-board", "issue-table", "cycle-planner",
]);
const upstream = new Map(
  entries.map(entry => [entry.slug, entry.references.map(ref => byId.get(ref.id)).filter(Boolean)]),
);

// Split the notice into its level-two sections so each slug can be checked against the
// section that owns it, rather than against the file as a whole.
const sections = notices.split(/^## /m).slice(1).map(text => ({
  heading: text.split("\n")[0],
  slugs: [...text.matchAll(/^- `([^`]+)`/gm)].map(match => match[1]),
}));
const sectionFor = slug => sections.find(section => section.slugs.includes(slug));
const licensed = section => /— MIT$/.test(section.heading);
const unresolved = section => /unresolved/i.test(section.heading);

describe("third-party notices", () => {
  test("attributes every ported component and names Takt's own work", () => {
    for (const [slug, refs] of upstream) {
      expect(sectionFor(slug) !== undefined).toBe(refs.length > 0);
      expect(originals.has(slug)).toBe(refs.length === 0);
    }
    expect(sections.flatMap(section => section.slugs).sort()).toEqual(
      [...upstream].filter(([, refs]) => refs.length).map(([slug]) => slug).sort(),
    );
  });

  test("states an upstream license only where the source does", () => {
    for (const [slug, refs] of upstream) {
      if (!refs.length) continue;
      const grantsLicense = refs.every(ref => ref.author !== "DesignBookmark" || ref.licenseNotice === "MIT");
      if (grantsLicense) expect(licensed(sectionFor(slug))).toBe(true);
      else expect(unresolved(sectionFor(slug))).toBe(true);
    }
    expect(sections.some(licensed)).toBe(true);
    expect(sections.some(unresolved)).toBe(true);
  });

  test("reproduces the copyright line and full text of each granted license", () => {
    for (const section of sections.filter(licensed)) {
      expect(section.heading).toContain("MIT");
      expect(notices).toContain("Copyright (c)");
    }
    expect(notices.match(/Permission is hereby granted, free of charge/g)).toHaveLength(3);
    expect(notices).toContain("Copyright (c) 2025 kokonutUI");
    expect(notices).toContain("Copyright (c) 2024 Eduardo Calvo");
    expect(notices).toContain("Copyright (c) 2026 DesignBookmark");
  });

  test("ships the notice with ported sources that grant one", () => {
    for (const [slug, refs] of upstream) {
      if (!refs.some(ref => ref.author === "Kokonut UI" || ref.author === "SmoothUI")) continue;
      const component = readFileSync("components/motion/" + slug + ".tsx", "utf8");
      const [first, second, third] = component.split("\n");
      expect(first).toMatch(/^\/\/ Ported from (Kokonut UI|SmoothUI) \(https:\/\//);
      expect(second).toContain("Licensed under the MIT License");
      expect(third).toContain("THIRD_PARTY_NOTICES.md");
    }
  });

  test("installed registry files keep the upstream notice", () => {
    for (const [slug, refs] of upstream) {
      if (!refs.some(ref => ref.author === "Kokonut UI" || ref.author === "SmoothUI")) continue;
      for (const locale of ["/r/", "/r/ru/"]) {
        const item = JSON.parse(readFileSync("public" + locale + slug + ".json", "utf8"));
        const file = item.files.find(entry => entry.path === "components/motion/" + slug + ".tsx");
        expect(file.content.split("\n")[0]).toMatch(/^\/\/ Ported from/);
      }
    }
  });
});
