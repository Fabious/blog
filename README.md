# Blog

Personal blog, one markdown file per post, built with [Eleventy](https://www.11ty.dev/)
and published at https://fabious.github.io/blog/.

## Write

```bash
npm run new -- "Title of the post"
```

This creates `posts/<today>-<slug>.md` with the frontmatter prefilled and
`draft: true`. Write in markdown below the frontmatter. When it is ready,
remove the `draft` line (or set it to `false`). For an English post, pass
`--lang en` or set `lang: en` in the frontmatter.

Optional `description:` becomes the page's meta description.

Images go in `img/` and are referenced with an absolute path:
`![alt text](/img/name.png)`.

## Preview

```bash
npm run dev
```

Serves the site at http://localhost:8080/ with live reload.

## Publish

Push to `main`. A GitHub Actions workflow builds the site and deploys it to
GitHub Pages. Drafts are never built.

## Test

```bash
npm test
```
