import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOutputs, loadPages, outputPath } from "../scripts/build.mjs";
import { BUSINESS, SERVICES, SERVICE_FAQS } from "../src/content.mjs";
import { SEO } from "../src/seo.mjs";

const outputs = await buildOutputs();
const pages = await loadPages();
const indexable = pages.filter((page) => !page.noindex);
const htmlFor = (page) => outputs.get(outputPath(page));
const meta = (html, attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)">`))?.[1];
const jsonLd = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test("indexable pages have unique titles and descriptions of sensible length", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of indexable) {
    const html = htmlFor(page);
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = meta(html, "name", "description");
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `duplicate description on ${page.path}`);
    titles.add(title);
    descriptions.add(description);
    assert.ok(title.length <= 75, `${page.path} title is ${title.length} chars`);
    assert.ok(description.length >= 70 && description.length <= 200, `${page.path} description is ${description.length} chars`);
  }
});

test("indexable pages have canonical, robots, Open Graph, and Twitter metadata", () => {
  for (const page of indexable) {
    const html = htmlFor(page);
    const url = `${BUSINESS.siteUrl}${page.path}`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), page.path);
    assert.match(meta(html, "name", "robots"), /^index, follow/, page.path);
    assert.equal(meta(html, "property", "og:url"), url, page.path);
    for (const key of ["og:title", "og:description", "og:image", "og:image:alt", "og:locale"]) assert.ok(meta(html, "property", key), `${page.path} ${key}`);
    for (const key of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) assert.ok(meta(html, "name", key), `${page.path} ${key}`);
    assert.ok(meta(html, "property", "og:image").startsWith("https://"), page.path);
  }
});

test("noindex pages are excluded from the sitemap and have no canonical", () => {
  const sitemap = outputs.get("sitemap.xml");
  for (const page of pages.filter((item) => item.noindex)) {
    const html = htmlFor(page);
    assert.match(meta(html, "name", "robots"), /^noindex/, page.path);
    assert.ok(!html.includes('rel="canonical"'), page.path);
    assert.ok(!sitemap.includes(page.path), page.path);
  }
});

test("sitemap lists exactly the indexable pages with absolute production URLs", () => {
  const locs = [...outputs.get("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
  assert.deepEqual(locs, indexable.map((page) => `${BUSINESS.siteUrl}${page.path}`).sort());
  for (const loc of locs) assert.ok(!/portal|admin|login|dashboard|api/i.test(loc), loc);
});

test("robots.txt allows crawling, blocks the future portal, and references the sitemap", () => {
  const robots = outputs.get("robots.txt");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/portal\/$/m);
  assert.ok(robots.includes(`Sitemap: ${BUSINESS.siteUrl}/sitemap.xml`));
});

test("every page has valid JSON-LD with the shared organization and website nodes", () => {
  for (const page of pages) {
    const data = jsonLd(htmlFor(page));
    assert.equal(data["@context"], "https://schema.org");
    const org = data["@graph"].find((node) => node["@type"] === "LocalBusiness");
    assert.equal(org.telephone, `+1-${BUSINESS.phone}`);
    assert.equal(org.email, BUSINESS.email);
    for (const forbidden of ["aggregateRating", "review", "address", "openingHours", "priceRange", "award"]) assert.ok(!(forbidden in org), forbidden);
    assert.ok(data["@graph"].some((node) => node["@type"] === "WebSite"), page.path);
  }
});

test("inner pages have WebPage + breadcrumb; services page has Service and FAQ data matching visible content", () => {
  for (const page of indexable.filter((item) => item.path !== "/")) {
    const graph = jsonLd(htmlFor(page))["@graph"];
    assert.ok(graph.some((node) => node["@type"] === "BreadcrumbList"), page.path);
    assert.ok(graph.some((node) => node["@id"] === `${BUSINESS.siteUrl}${page.path}#webpage`), page.path);
  }
  const servicesHtml = outputs.get("services/index.html");
  const graph = jsonLd(servicesHtml)["@graph"];
  assert.equal(graph.filter((node) => node["@type"] === "Service").length, SERVICES.length);
  const faq = graph.find((node) => node["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, SERVICE_FAQS.length);
  const escaped = (text) => text.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
  for (const item of SERVICE_FAQS) {
    assert.ok(servicesHtml.includes(escaped(item.question)), `visible FAQ question missing: ${item.question}`);
    assert.ok(servicesHtml.includes(escaped(item.answer)), `visible FAQ answer missing: ${item.question}`);
  }
});

test("search engine verification tags render only when tokens are configured", () => {
  const html = outputs.get("index.html");
  assert.equal(html.includes("google-site-verification"), Boolean(SEO.verification.google));
  assert.equal(html.includes("msvalidate.01"), Boolean(SEO.verification.bing));
});

test("every image has an alt attribute and explicit dimensions", () => {
  for (const [file, html] of outputs) {
    if (!file.endsWith(".html")) continue;
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /\salt="/, `${file}: ${tag}`);
      assert.match(tag, /\swidth="\d+"/, `${file}: ${tag}`);
      assert.match(tag, /\sheight="\d+"/, `${file}: ${tag}`);
    }
  }
});

test("no link uses generic 'click here' or 'read more' text", () => {
  for (const [file, html] of outputs) {
    if (!file.endsWith(".html")) continue;
    assert.doesNotMatch(html, />\s*(click here|read more|here)\s*</i, file);
  }
});
