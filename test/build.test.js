import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Eleventy from "@11ty/eleventy";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let tmp;
let out;
let byUrl;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "blog-"));
  for (const entry of ["_includes", "_data", "css", "index.njk"]) {
    fs.cpSync(path.join(root, entry), path.join(tmp, entry), { recursive: true });
  }
  fs.mkdirSync(path.join(tmp, "posts"));
  fs.copyFileSync(path.join(root, "posts/posts.11tydata.js"), path.join(tmp, "posts/posts.11tydata.js"));
  fs.cpSync(path.join(root, "test/fixtures/posts"), path.join(tmp, "posts"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "posts/2026-04-01-sans-lang.md"), "---\ntitle: Sans lang\n---\nUn billet sans langue déclarée.\n");
  fs.mkdirSync(path.join(tmp, "img"));
  fs.writeFileSync(path.join(tmp, "img/pic.png"), "not really a png");

  // Eleventy resolves directory data files and ignores relative to the
  // working directory, so the fixture site is built as its own project root.
  // The config's dir.output wins over the constructor argument.
  out = path.join(tmp, "_site");
  process.chdir(tmp);
  const elev = new Eleventy(".", out, {
    configPath: path.join(root, "eleventy.config.js"),
    pathPrefix: "/blog/",
    quietMode: true,
  });
  const pages = await elev.toJSON();
  byUrl = Object.fromEntries(pages.map((p) => [p.url, p.content]));
  await elev.write();
});

after(() => {
  process.chdir(root);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("images in img/ are copied to the output", () => {
  assert.ok(fs.existsSync(path.join(out, "img/pic.png")));
});

test("home lists published posts newest first with date, reading time and lang mark", () => {
  const home = byUrl["/"];
  const second = home.indexOf("Second one");
  const first = home.indexOf("L&#39;IA &amp; &lt;moi&gt;");
  assert.ok(second > -1 && first > -1, "both titles present");
  assert.ok(second < first, "newest first");
  for (const s of ["Feb 20, 2026", "Jan 10, 2026", "2 min", "1 min", "EN", "FR"]) {
    assert.ok(home.includes(s), `home includes ${s}`);
  }
});

test("draft posts are absent everywhere", () => {
  assert.equal(byUrl["/posts/brouillon/"], undefined);
  assert.ok(!byUrl["/"].includes("Brouillon"));
});

test("post page carries lang, escaped title, description and prefixed links", () => {
  const premier = byUrl["/posts/premier/"];
  const second = byUrl["/posts/second-one/"];
  assert.ok(premier.includes('<html lang="fr">'));
  assert.ok(premier.includes("L&#39;IA &amp; &lt;moi&gt;"));
  assert.ok(second.includes('<html lang="en">'));
  assert.ok(second.includes('<meta name="description" content="A short English post">'));
  for (const page of [premier, second]) {
    assert.ok(page.includes('href="/blog/css/style.css"'));
    assert.ok(page.includes('href="/blog/"'));
  }
});

test("post without lang defaults to fr", () => {
  assert.ok(byUrl["/posts/sans-lang/"].includes('<html lang="fr">'));
});
