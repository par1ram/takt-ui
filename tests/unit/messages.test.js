import { expect, test } from "bun:test";
import { toggleReaction } from "../../components/motion/message-reactions";
import { ownPost } from "../../components/motion/message-thread";

const clap = Object.freeze({ emoji: "👏", label: "Bravo", count: 2, mine: false });
const heart = Object.freeze({ emoji: "❤️", label: "Love", count: 1, mine: true });
const list = Object.freeze([clap, heart]);

test("adding and removing my reaction round trips without mutating another user's counts", () => {
  const added = toggleReaction(list, clap.emoji);
  expect(added[0]).toEqual({ ...clap, count: 3, mine: true });
  expect(added[1]).toBe(heart);
  expect(toggleReaction(added, clap.emoji)).toEqual(list);
});
test("unknown emoji, empty lists and stale zero counts are safe", () => {
  expect(toggleReaction([], clap.emoji)).toEqual([]);
  expect(toggleReaction(list, "✨")).toEqual(list);
  expect(toggleReaction([{ ...heart, count: 0 }], heart.emoji)[0]).toEqual({ ...heart, count: 0, mine: false });
});
test("two sends with identical text retain distinct IDs and preserve message content", () => {
  const first = ownPost("hello\nworld");
  const second = ownPost(first.text);
  expect(first.id).toBeTruthy();
  expect(second.id).not.toBe(first.id);
  expect(second.text).toBe("hello\nworld");
  expect(second.time).toBeTruthy();
});
