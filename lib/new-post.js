import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function slugify(title) {
  return String(title)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function localDay(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function createPost({ title, lang = "fr", date = new Date(), dir = "posts" }) {
  const day = localDay(date);
  const file = path.join(dir, `${day}-${slugify(title)}.md`);
  if (fs.existsSync(file)) {
    throw new Error(`already exists: ${file}`);
  }
  const quotedTitle = `"${String(title).replace(/"/g, '\\"')}"`;
  const frontmatter = [
    "---",
    `title: ${quotedTitle}`,
    `date: ${day}`,
    `lang: ${lang}`,
    "draft: true",
    "---",
    "",
    "",
  ].join("\n");
  fs.writeFileSync(file, frontmatter);
  return file;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let lang = "fr";
  const words = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lang") {
      lang = args[++i];
    } else {
      words.push(args[i]);
    }
  }
  const title = words.join(" ").trim();
  if (!title) {
    console.error('usage: npm run new -- "Title of the post" [--lang en]');
    process.exit(1);
  }
  try {
    console.log(createPost({ title, lang }));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
