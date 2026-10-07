// Static site generator (zero dependencies). Renders src/pages/* into HTML at the
// repository root so Cloudflare Pages can keep serving the repo root with no build step.
//
//   node scripts/build.mjs          write generated files
//   node scripts/build.mjs --check  exit 1 if committed output is stale
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderPage } from "../src/layout.mjs";
import { BUSINESS } from "../src/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export async function loadPages() {
  const dir = join(root, "src", "pages");
  const files = (await readdir(dir)).filter((file) => file.endsWith(".mjs")).sort();
  const pages = [];
  for (const file of files) {
    const { page } = await import(pathToFileURL(join(dir, file)).href);
    pages.push(page);
  }
  return pages;
}

export const outputPath = (page) => page.output || (page.path === "/" ? "index.html" : `${page.path.replace(/^\/|\/$/g, "")}/index.html`);

export async function buildOutputs() {
  const pages = await loadPages();
  const outputs = new Map();
  for (const page of pages) {
    outputs.set(outputPath(page), renderPage({ ...page, body: page.body() }));
  }
  const urls = pages.filter((page) => !page.noindex).map((page) => `  <url><loc>${BUSINESS.siteUrl}${page.path}</loc></url>`);
  outputs.set("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
  outputs.set("robots.txt", [
    "# Public marketing pages are crawlable. robots.txt is not access control —",
    "# private areas must be protected by authentication.",
    "User-agent: *",
    "Allow: /",
    "# Reserved for the future employee/operations portal.",
    "Disallow: /portal/",
    "",
    `Sitemap: ${BUSINESS.siteUrl}/sitemap.xml`,
    ""
  ].join("\n"));
  return outputs;
}

async function main() {
  const check = process.argv.includes("--check");
  const outputs = await buildOutputs();
  const stale = [];
  for (const [file, content] of outputs) {
    const target = join(root, file);
    if (check) {
      const existing = await readFile(target, "utf8").catch(() => null);
      if (existing !== content) stale.push(file);
    } else {
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
  }
  if (check && stale.length) {
    console.error(`Generated files are out of date. Run \`npm run build\` and commit:\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  console.log(check ? `All ${outputs.size} generated files are up to date.` : `Wrote ${outputs.size} files.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
