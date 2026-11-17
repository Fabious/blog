const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

export default {
  layout: "post.njk",
  lang: "fr",
  permalink: (data) => `/posts/${data.page.fileSlug.replace(DATE_PREFIX, "")}/`,
};
