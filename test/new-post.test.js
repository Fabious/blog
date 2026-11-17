import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { slugify, createPost } from "../lib/new-post.js";

// The author writes from France: "today" in a file name is the local day.
process.env.TZ = "Europe/Paris";

const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "new-post-"));
const date = new Date("2026-11-17T10:00:00Z");

test("slugify strips accents and punctuation", () => {
  assert.equal(slugify("Écrire, c'est relire !"), "ecrire-c-est-relire");
  assert.equal(slugify("  Hello   World  "), "hello-world");
});

test("createPost writes a dated draft with prefilled frontmatter", () => {
  const dir = tmpDir();
  const file = createPost({ title: "Écrire, c'est relire !", date, dir });
  assert.equal(file, path.join(dir, "2026-11-17-ecrire-c-est-relire.md"));
  const content = fs.readFileSync(file, "utf8");
  assert.ok(
    content.startsWith('---\ntitle: "Écrire, c\'est relire !"\ndate: 2026-11-17\nlang: fr\ndraft: true\n---\n\n'),
    content,
  );
});

test("createPost uses the local day, not the UTC day", () => {
  const lateEvening = new Date("2026-11-17T23:30:00Z"); // 00:30 on the 18th in Paris
  const file = createPost({ title: "Minuit", date: lateEvening, dir: tmpDir() });
  assert.equal(path.basename(file), "2026-11-18-minuit.md");
  assert.ok(fs.readFileSync(file, "utf8").includes("\ndate: 2026-11-18\n"));
});

test("createPost honours lang", () => {
  const file = createPost({ title: "An English one", lang: "en", date, dir: tmpDir() });
  assert.ok(fs.readFileSync(file, "utf8").includes("\nlang: en\n"));
});

test("createPost refuses to overwrite", () => {
  const dir = tmpDir();
  createPost({ title: "Twice", date, dir });
  assert.throws(() => createPost({ title: "Twice", date, dir }), /already exists/);
});
