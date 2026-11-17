# Blog rebuild — design

Date: 2026-11-17
Status: draft, awaiting Fabien's approval

## Intent

A personal blog at `~/perso/blog`, published at the existing GitHub repo
`Fabious/blog`. Two jobs: hold Fabien's articles, and make writing the next one
as frictionless as possible so that writing becomes a habit. Posts are in French
or English, mixed on one site.

## Goals

- One markdown file per post, nothing else to touch to publish.
- Starting a post is one command.
- Pushing to `main` publishes the site.
- Look and feel close to claude.dev/blog: monospaced, spare, text first.

## Non-goals (for now)

- Tags and categories. Keep the door open, do not build it.
- Separate French and English sites.
- Comments, analytics, newsletter.

## Anti-goals (never)

- RSS feed.
- Search.
- A JS framework shipped to the browser. The site is static HTML and CSS.

## Constraints

- Node 26 is installed locally, no Hugo. Go tooling is not an option.
- The current `Fabious/blog` repo is a throwaway 2020 Gatsby template on
  `master` with one commit. Its content is replaced; the repo name and URL stay.
- The first post already exists as a draft in `~/perso/articles`.

## Approaches considered

1. **Eleventy** (chosen). Markdown in, HTML out, a handful of templates and one
   config file. Small dependency, trivial to extend with tags later.
2. **Astro.** Better tooling and content validation, but a larger stack and more
   conventions than a two-page site needs.
3. **Hand-rolled Node script.** No framework, but reading time, dates, drafts
   and templating all have to be written and maintained by hand.

Fabien picked Eleventy on 2026-11-17.

## Decisions

- **Generator:** Eleventy 3.x, with the repo's own `package.json`. Build output
  in `_site/`, ignored by git.
- **Hosting:** GitHub Pages. A GitHub Actions workflow builds on every push to
  `main` and deploys the `_site/` folder. The repo's default branch moves from
  `master` to `main`; the old content is removed.
- **Content layout:** `posts/YYYY-MM-DD-slug.md`. Frontmatter:
  `title`, `date`, `lang` (`fr` or `en`), `draft` (optional, default false),
  `description` (optional, one line, used for the HTML meta description).
- **URLs:** `/posts/slug/` (date not in the URL, so a post can be re-dated).
- **Drafts:** `draft: true` keeps a post out of the build entirely. Drafts
  can still be committed.
- **Languages:** one mixed list on the home page. Each entry shows a small
  `FR` or `EN` mark. The `<html lang>` of each post uses the post's `lang`.
  Site chrome (header, footer, "min read") is in English.
- **Home page:** site name and a one-line tagline on the left, post list on
  the right (or stacked on narrow screens). Each row: date, title, reading
  time, language mark. Newest first. No featured post, no "load more".
- **Post page:** title, date, reading time, language mark, then the article.
  A link back to the home page. No table of contents, no share buttons.
- **Reading time:** computed at build from word count, about 200 words a
  minute, shown as `N min`.
- **Styling:** one hand-written CSS file. Monospace font stack (system
  monospace, no webfont download), off-white background, dark text, one
  accent colour. Narrow readable column (about 65 characters). Responsive
  without media-query heroics: one breakpoint.
- **Habit helper:** `npm run new "Title of the post"` creates
  `posts/<today>-<slug>.md` with frontmatter prefilled (`title`, `date`,
  `lang: fr`, `draft: true`) and opens nothing. `npm run dev` serves the site
  locally with live reload. `npm run build` builds it.
- **First post:** `~/perso/articles/2026-11-09-modern-ai-workflow.md` is
  copied into `posts/` with frontmatter added. The research notes file stays
  in `~/perso/articles`.
- **Repo housekeeping:** `README.md` says how to write a post and deploy, in a
  few lines. `.gitignore` covers `node_modules/` and `_site/`.

## Left to the builder

- Exact Eleventy config shape (layouts in `_includes/`, data in `_data/`).
- Date formatting (`Nov 09, 2026` style like claude.dev, or ISO), as long as it
  is consistent across home and post pages.
- The precise colours, as long as the result reads as "spare and
  monospaced" next to claude.dev.
- Whether the GitHub Pages site serves at `fabious.github.io/blog/` (project
  page, needs a path prefix in the build) or at the root of a custom domain.
  Default to the project page; the path prefix must be configurable in one
  place.
