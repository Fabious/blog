import { test } from "node:test";
import assert from "node:assert/strict";
import { readingTime, formatDate, langMark } from "../lib/filters.js";

test("readingTime rounds to minutes at 200 wpm", () => {
  assert.equal(readingTime("word ".repeat(1069)), 5);
});

test("readingTime never drops below 1", () => {
  assert.equal(readingTime(""), 1);
  assert.equal(readingTime("<p>twenty words only</p>"), 1);
});

test("readingTime ignores HTML tags", () => {
  assert.equal(readingTime("<p>" + "w ".repeat(400) + "</p><ul><li>x</li></ul>"), 2);
});

test("formatDate renders claude.dev style in UTC", () => {
  assert.equal(formatDate(new Date("2026-11-09T00:00:00Z")), "Nov 09, 2026");
  assert.equal(formatDate(new Date("2026-11-09T23:30:00Z")), "Nov 09, 2026");
});

test("langMark upper-cases", () => {
  assert.equal(langMark("fr"), "FR");
  assert.equal(langMark("en"), "EN");
});
