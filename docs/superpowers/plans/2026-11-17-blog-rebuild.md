# Blog Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, markdown-driven personal blog at `~/perso/blog`, styled like claude.dev/blog, deployed to GitHub Pages from `Fabious/blog` on every push to `main`.

**Architecture:** Eleventy 3 reads `posts/*.md` from the repo root and renders two kinds of pages, the home list and the post page, through two Nunjucks layouts. Pure helpers (reading time, date format, slug) live in `lib/` and are unit-tested with `node:test`; a build test runs Eleventy programmatically on a fixture site to check the rendered HTML. A GitHub Actions workflow builds and deploys `_site/`.

**Tech Stack:** Node 26 locally (Node 24 in CI), `@11ty/eleventy` 3.1.8, Nunjucks templates, `node:test`, GitHub Pages via `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-11-17-blog-design.md`

## Global Constraints

- Only runtime dependency: `@11ty/eleventy@3.1.8`. No other npm packages, no webfonts, no client-side JavaScript.
- Repo root is the Eleventy input directory. Output is `_site/`, gitignored.
- Posts: `posts/YYYY-MM-DD-slug.md`. Frontmatter keys: `title`, `date`, `lang` (`fr`|`en`), `draft` (optional), `description` (optional).
- Post URL: `/posts/<slug>/` with the date prefix stripped from the file name.
- `draft: true` removes the post from the build entirely.
- Site chrome copy is English. Dates render as `Nov 09, 2026`. Reading time renders as `N min`, never below 1. Language mark renders as `FR` or `EN`.
- Path prefix is read from `PATH_PREFIX` (default `/`); CI sets `/blog/`.
- Git identity for this repo: `user.name Fabious`, `user.email fabien@les-tilleuls.coop` (set locally, nothing is set globally on this machine).
- No tags, no RSS, no search, no featured post, no table of contents, no share buttons.
- Commit after every task. Conventional-commit style messages.

## Review Focus

1. A title containing `'`, `&` or `<` must render escaped on both the home list and the post page, never as raw HTML. Test in Task 2 (fixture post titled `L'IA & <moi>`).
2. `npm run new "Écrire, c'est relire !"` must produce an ASCII slug (`ecrire-c-est-relire`) and must refuse to overwrite an existing file. Tests in Task 4.
3. A post dated `2026-11-09` must display `Nov 09, 2026` regardless of the machine's timezone; formatting must use UTC. Test in Task 1.
4. A post of fewer than 100 words must show `1 min`, never `0 min`. Test in Task 1.
5. When built with path prefix `/blog/`, the stylesheet link and the home link must carry the prefix, otherwise GitHub Pages serves an unstyled site. Test in Task 2.

---

### Task 1: Repository, package, and pure helpers

**Files:**
- Create: `package.json`, `.gitignore`, `lib/filters.js`
- Test: `test/filters.test.js`

**Interfaces:**
- Produces: `readingTime(html: string): number` (minutes, `Math.max(1, Math.round(words / 200))`, words counted after stripping `<...>` tags and splitting on whitespace); `formatDate(date: Date): string` (`en-US`, `{ month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }`); `langMark(lang: string): string` (upper-cased).

- [ ] **Step 1: Initialise the repo**

```bash
cd ~/perso/blog
git init -b main
git config user.name Fabious
git config user.email fabien@les-tilleuls.coop
```

- [ ] **Step 2: Write `package.json` and `.gitignore`**

`package.json`: `"name": "blog"`, `"private": true`, `"type": "module"`, scripts `"build": "eleventy"`, `"dev": "eleventy --serve"`, `"test": "node --test"`, `"new": "node lib/new-post.js"`. Dependency `"@11ty/eleventy": "3.1.8"` (exact). Run `npm install` so `package-lock.json` exists.

`.gitignore`: `node_modules/`, `_site/`.

- [ ] **Step 3: Write the failing tests**

```js
// test/filters.test.js
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
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, cannot find module `lib/filters.js`.

- [ ] **Step 5: Implement `lib/filters.js`**

Export the three functions from the Interfaces block. `formatDate` uses `Intl.DateTimeFormat`.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: 5 passing.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .gitignore lib/filters.js test/filters.test.js docs/
git commit -m "chore: init Eleventy blog with tested helpers"
```

---

### Task 2: Eleventy config, layouts, styles, and build test

**Files:**
- Create: `eleventy.config.js`, `_data/site.json`, `_includes/base.njk`, `_includes/post.njk`, `index.njk`, `posts/posts.11tydata.js`, `css/style.css`
- Test: `test/build.test.js`, `test/fixtures/posts/2026-01-10-premier.md`, `test/fixtures/posts/2026-02-20-second-one.md`, `test/fixtures/posts/2026-03-01-brouillon.md`

**Interfaces:**
- Consumes: `readingTime`, `formatDate`, `langMark` from Task 1.
- Produces: `eleventy.config.js` default export `config(eleventyConfig)` returning `{ dir: { output: "_site" }, pathPrefix: process.env.PATH_PREFIX ?? "/" }`; collection `post` (newest first); filters `readingTime`, `formatDate`, `langMark` registered under those names; the `_site/` layout every later task relies on.

- [ ] **Step 1: Write the fixture posts**

`test/fixtures/posts/2026-01-10-premier.md`: frontmatter `title: "L'IA & <moi>"`, `lang: fr`, `date: 2026-01-10`; body of 30 French words.
`test/fixtures/posts/2026-02-20-second-one.md`: frontmatter `title: Second one`, `lang: en`, `date: 2026-02-20`, `description: A short English post`; body of 450 words (`word ` repeated).
`test/fixtures/posts/2026-03-01-brouillon.md`: frontmatter `title: Brouillon secret`, `lang: fr`, `draft: true`; one line body.

- [ ] **Step 2: Write the failing build test**

The test assembles a temporary site in `fs.mkdtempSync(path.join(os.tmpdir(), "blog-"))`: copy the project's `_includes/`, `_data/`, `css/`, `index.njk`, `posts/posts.11tydata.js` into it and the three fixture posts into `<tmp>/posts/`. Build with the config function imported from the project:

```js
import Eleventy from "@11ty/eleventy";
import config from "../eleventy.config.js";
const elev = new Eleventy(tmp, path.join(os.tmpdir(), "blog-out-" + Date.now()), { config, pathPrefix: "/blog/", quietMode: true });
const pages = await elev.toJSON();   // [{ url, content, ... }]
const byUrl = Object.fromEntries(pages.map(p => [p.url, p.content]));
```

Assertions:

```js
test("home lists published posts newest first with date, reading time and lang mark", ...)
  // byUrl["/"] contains "Second one" before "L&#39;IA &amp; &lt;moi&gt;"
  // contains "Feb 20, 2026", "Jan 10, 2026", "2 min", "1 min", "EN", "FR"
test("draft posts are absent everywhere", ...)
  // no page url "/posts/brouillon/"; byUrl["/"] does not include "Brouillon"
test("post page carries lang, escaped title, description and prefixed links", ...)
  // byUrl["/posts/premier/"] includes '<html lang="fr">' and "L&#39;IA &amp; &lt;moi&gt;"
  // byUrl["/posts/second-one/"] includes '<html lang="en">' and '<meta name="description" content="A short English post">'
  // both include 'href="/blog/css/style.css"' and 'href="/blog/"'
test("post without lang defaults to fr", ...)
  // add a 4th fixture in the temp dir at runtime: posts/2026-04-01-sans-lang.md with title only
  // byUrl["/posts/sans-lang/"] includes '<html lang="fr">'
```

- [ ] **Step 3: Run the build test to verify it fails**

Run: `npm test`
Expected: FAIL on importing `eleventy.config.js`.

- [ ] **Step 4: Write `eleventy.config.js`**

In order: `addPlugin(HtmlBasePlugin)`; `ignores.add` for `docs/**`, `test/**`, `lib/**`, `README.md`; `addPassthroughCopy("css")`; `addPreprocessor("drafts", "*", (data) => { if (data.draft) return false; })`; `addCollection("post", api => api.getFilteredByGlob("**/posts/*.md").reverse())` (the `**/` is required so the glob also matches the temporary fixture site in tests); `addFilter` for the three helpers; return `{ dir: { output: "_site" }, pathPrefix: process.env.PATH_PREFIX ?? "/" }`.

- [ ] **Step 5: Write `_data/site.json` and `posts/posts.11tydata.js`**

`_data/site.json`: `{ "title": "Fabious", "tagline": "Notes on code, AI tools and ways of working. In French and English.", "author": "Fabien" }`.

`posts/posts.11tydata.js`: default export `{ layout: "post.njk", lang: "fr", permalink: (data) => \`/posts/${data.page.fileSlug}/\` }` (Eleventy strips the date prefix from `fileSlug`; verified).

- [ ] **Step 6: Write the layouts**

`_includes/base.njk`: `<!doctype html>`, `<html lang="{{ lang or 'en' }}">`, `<meta charset>`, viewport meta, `<title>{{ title }} · {{ site.title }}</title>` (home: just `site.title`), `{% if description %}<meta name="description" content="{{ description }}">{% endif %}`, `<link rel="stylesheet" href="/css/style.css">`, `<header>` with `<a href="/">{{ site.title }}</a>`, `<main>{{ content | safe }}</main>`, `<footer>{{ site.author }}</footer>`. Nunjucks autoescape stays on (Eleventy default) so titles are escaped.

`_includes/post.njk`: frontmatter `layout: base.njk`; `<article>` with `<h1>{{ title }}</h1>`, `<p class="meta"><time datetime="{{ page.date.toISOString() }}">{{ page.date | formatDate }}</time> · {{ content | readingTime }} min · {{ lang | langMark }}</p>`, then `{{ content | safe }}`, then `<p><a href="/">← Home</a></p>`.

`index.njk`: frontmatter `layout: base.njk`, `permalink: /`. Layout: `<div class="home">` with `<aside>` (`<h1>{{ site.title }}</h1><p>{{ site.tagline }}</p>`) and `<ol class="posts">`; each `<li>`: `<time>` with `formatDate`, `<a href="{{ post.url }}">{{ post.data.title }}</a>`, `<span class="meta">{{ post.templateContent | readingTime }} min · {{ post.data.lang | langMark }}</span>`.

- [ ] **Step 7: Write `css/style.css`**

Tokens on `:root`: `--bg: #faf9f5; --fg: #1f1f1f; --muted: #6f6a63; --accent: #c96442; --rule: #e5e1d8`. `body`: monospace stack `ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`, 15px/1.6, `background: var(--bg)`, `color: var(--fg)`, `max-width: 72rem`, `margin: 0 auto`, `padding: 1.5rem 1rem`. Links in `--accent`, underline on hover only. `.home`: single column; at `min-width: 48rem` a two-column grid `14rem 1fr` with `gap: 3rem`. `.posts`: no list style, each `li` a row with `time` (muted, fixed width `8rem`), title, `.meta` (muted, right-aligned), hairline `border-top: 1px solid var(--rule)`, stacked on narrow screens. `article`: `max-width: 65ch`; `pre` and `code` on `#f1efe8`, `pre` scrolls horizontally. Header: small, `site.title` in `--fg`, no underline. Footer: muted, small, top rule.

- [ ] **Step 8: Run the build test to verify it passes**

Run: `npm test`
Expected: all passing (5 from Task 1 plus 4 here).

- [ ] **Step 9: Build and eyeball locally**

Run: `npm run build && ls _site`
Expected: `index.html`, `css/style.css`, no `posts/` yet (no real post). Then `npm run dev`, open `http://localhost:8080/`, confirm the layout reads as spare and monospaced beside claude.dev/blog. Stop the server.

- [ ] **Step 10: Commit**

```bash
git add eleventy.config.js _data _includes index.njk posts/posts.11tydata.js css test/
git commit -m "feat: home and post layouts with build test"
```

---

### Task 3: First post

**Files:**
- Create: `posts/2026-11-09-modern-ai-workflow.md`

**Interfaces:**
- Consumes: `_site/` layout from Task 2.

- [ ] **Step 1: Copy the draft and add frontmatter**

Copy `~/perso/articles/2026-11-09-modern-ai-workflow.md` to `posts/2026-11-09-modern-ai-workflow.md`. Remove the leading `# ...` H1 line (the layout renders the title). Prepend:

```yaml
---
title: "Il y a trop d'outils IA, j'installe quoi ?"
date: 2026-11-09
lang: fr
description: "Comment adapter son environnement de travail quand on lit plus de code qu'on n'en écrit."
---
```

Leave `~/perso/articles` untouched.

- [ ] **Step 2: Build and verify**

Run: `npm run build && grep -c '<html lang="fr">' _site/posts/modern-ai-workflow/index.html && grep -o 'Nov 09, 2026' _site/index.html && grep -o '[0-9]* min' _site/index.html`
Expected: `1`, `Nov 09, 2026`, `5 min`.

- [ ] **Step 3: Commit**

```bash
git add posts/2026-11-09-modern-ai-workflow.md
git commit -m "post: il y a trop d'outils IA, j'installe quoi ?"
```

---

### Task 4: `npm run new` and README

**Files:**
- Create: `lib/new-post.js`, `README.md`
- Test: `test/new-post.test.js`

**Interfaces:**
- Produces: `slugify(title: string): string` (NFD, strip diacritics, lower-case, non `[a-z0-9]` runs become `-`, trimmed of leading/trailing `-`); `createPost({ title, lang = "fr", date = new Date(), dir = "posts" }): string` returning the created path and throwing `Error("already exists: <path>")` if the file exists. CLI: `node lib/new-post.js "Title" [--lang en]`, exits 1 with the error message on failure, prints the created path on success.

- [ ] **Step 1: Write the failing tests**

```js
// test/new-post.test.js
import { slugify, createPost } from "../lib/new-post.js";

test("slugify strips accents and punctuation", () => {
  assert.equal(slugify("Écrire, c'est relire !"), "ecrire-c-est-relire");
  assert.equal(slugify("  Hello   World  "), "hello-world");
});
test("createPost writes a dated draft with prefilled frontmatter", () => {
  // dir = fresh mkdtemp; date = new Date("2026-11-17T10:00:00Z")
  // returns "<dir>/2026-11-17-ecrire-c-est-relire.md"
  // file content starts with:
  // ---\ntitle: "Écrire, c'est relire !"\ndate: 2026-11-17\nlang: fr\ndraft: true\n---\n\n
});
test("createPost honours lang", () => { /* lang: "en" -> "lang: en" line */ });
test("createPost refuses to overwrite", () => {
  // call twice with same args -> second throws /already exists/
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, cannot find `lib/new-post.js`.

- [ ] **Step 3: Implement `lib/new-post.js`**

Exports from the Interfaces block plus a CLI guard: `if (process.argv[1] === fileURLToPath(import.meta.url)) { ... }` parsing `argv` (`--lang` value, remaining joined as title). Title is written with double quotes and inner `"` escaped as `\"`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Try the command for real, then remove the file**

Run: `npm run new -- "Test de la commande" && git status --short posts/`
Expected: prints `posts/2026-11-17-test-de-la-commande.md`, shown as untracked. Then `rm posts/2026-11-17-test-de-la-commande.md`.

- [ ] **Step 6: Write `README.md`**

Sections, a few lines each: what this is; **Write** (`npm run new "Title"` then edit, set `draft: false` or delete the line, `lang: en` for English); **Preview** (`npm run dev`); **Publish** (push to `main`, GitHub Actions deploys to `https://fabious.github.io/blog/`); **Test** (`npm test`).

- [ ] **Step 7: Commit**

```bash
git add lib/new-post.js test/new-post.test.js README.md
git commit -m "feat: npm run new creates a dated draft"
```

---

### Task 5: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build`, `PATH_PREFIX` from Task 2.

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
        env: { PATH_PREFIX: /blog/ }
      - uses: actions/upload-pages-artifact@v5
        with: { path: _site }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages on push to main"
```

- [ ] **Step 3: Point the repo at GitHub and push `main`**

```bash
git remote add origin git@github.com:Fabious/blog.git
git push -u origin main
gh repo edit Fabious/blog --default-branch main
```

- [ ] **Step 4: Enable Pages with the Actions source, then trigger the workflow**

```bash
gh api -X POST repos/Fabious/blog/pages -f build_type=workflow
gh workflow run Deploy --repo Fabious/blog
gh run watch --repo Fabious/blog --exit-status
```

Expected: run completes green. (If `POST /pages` returns 409 "already exists", run `gh api -X PUT repos/Fabious/blog/pages -f build_type=workflow` instead.)

- [ ] **Step 5: Remove the old branches**

The 2020 Gatsby template lives on `master` and seven `dependabot/*` branches. Delete them all:

```bash
git push origin --delete master
gh api repos/Fabious/blog/branches --jq '.[].name' | grep '^dependabot/' | while read b; do gh api -X DELETE "repos/Fabious/blog/git/refs/heads/$b"; done
gh api repos/Fabious/blog/branches --jq '.[].name'
```

Expected: only `main` listed.

- [ ] **Step 6: Verify the live site**

```bash
curl -sI https://fabious.github.io/blog/ | head -1
curl -s https://fabious.github.io/blog/ | grep -o 'href="/blog/css/style.css"'
curl -sI https://fabious.github.io/blog/posts/modern-ai-workflow/ | head -1
```

Expected: `HTTP/2 200`, the prefixed stylesheet link, `HTTP/2 200`. Open the URL in a browser and check the page is styled.

- [ ] **Step 7: Describe the repo**

```bash
gh repo edit Fabious/blog --description "Personal blog, built with Eleventy" --homepage https://fabious.github.io/blog/
```
