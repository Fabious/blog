import { HtmlBasePlugin } from "@11ty/eleventy";
import { readingTime, formatDate, langMark } from "./lib/filters.js";

export default function config(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  for (const ignored of ["test/**", "lib/**", "README.md"]) {
    eleventyConfig.ignores.add(ignored);
  }

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");

  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft) return false;
  });

  eleventyConfig.addCollection("post", (api) =>
    api
      .getAll()
      .filter((item) => /(^|\/)posts\/[^/]+\.md$/.test(item.inputPath))
      .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addFilter("readingTime", readingTime);
  eleventyConfig.addFilter("formatDate", formatDate);
  eleventyConfig.addFilter("langMark", langMark);

  return {
    dir: { output: "_site" },
    pathPrefix: process.env.PATH_PREFIX ?? "/",
  };
}
