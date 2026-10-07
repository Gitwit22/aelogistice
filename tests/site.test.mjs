import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildOutputs, loadPages, outputPath } from "../scripts/build.mjs";
import { FORMS } from "../assets/js/forms.js";
import { NAV, SERVICES, FORM_ENDPOINTS } from "../src/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputs = await buildOutputs();
const pages = await loadPages();
const htmlOutputs = [...outputs].filter(([file]) => file.endsWith(".html"));

test("every navigation link points to a generated page", () => {
  const paths = new Set(pages.map((page) => page.path));
  for (const item of NAV) assert.ok(paths.has(item.href), item.href);
  assert.ok(paths.has("/request-service/"));
});

test("each page has exactly one h1, a title, and a description", () => {
  for (const [file, html] of htmlOutputs) {
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, file);
    assert.match(html, /<title>[^<]+<\/title>/, file);
    assert.match(html, /<meta name="description" content="[^"]+">/, file);
  }
});

test("internal links and assets resolve to files in the repository", () => {
  for (const [file, html] of htmlOutputs) {
    for (const [, attr] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = attr.endsWith("/") ? join(root, attr, "index.html") : join(root, attr);
      const generated = outputs.has(attr === "/" ? "index.html" : attr.replace(/^\//, "").replace(/\/$/, "/index.html"));
      assert.ok(generated || existsSync(target), `${file} → ${attr}`);
    }
  }
});

test("in-page service anchors exist on the services page", () => {
  const servicesHtml = outputs.get("services/index.html");
  for (const service of SERVICES) assert.ok(servicesHtml.includes(`id="${service.slug}"`), service.slug);
});

test("pages are compatible with the CSP: no inline scripts, handlers, or styles", () => {
  for (const [file, html] of htmlOutputs) {
    const scripts = [...html.matchAll(/<script([^>]*)>/g)].map((match) => match[1]);
    for (const attrs of scripts) assert.ok(/src="\/assets\/js\//.test(attrs) || /type="application\/ld\+json"/.test(attrs), `${file}: inline script`);
    assert.doesNotMatch(html, /\son[a-z]+="/i, `${file}: inline handler`);
    assert.doesNotMatch(html, /\sstyle="/i, `${file}: inline style`);
  }
});

test("each form renders every schema field with an error slot", () => {
  const formPages = { serviceRequest: "request-service/index.html", contact: "contact/index.html", courierApplication: "become-a-courier/index.html" };
  for (const [type, file] of Object.entries(formPages)) {
    const html = outputs.get(file);
    assert.ok(html.includes(`data-form="${type}"`), type);
    for (const field of FORMS[type].fields) {
      assert.ok(html.includes(`name="${field.name}"`), `${type}.${field.name}`);
      assert.ok(html.includes(`id="${type}-${field.name}-error"`), `${type}.${field.name} error`);
    }
  }
});

test("employee portal is not exposed on the public site yet", () => {
  for (const [file, html] of htmlOutputs) {
    assert.doesNotMatch(html, /employee login|\/portal/i, file);
  }
});

test("configured form endpoints are HTTPS without credentials", () => {
  for (const [type, url] of Object.entries(FORM_ENDPOINTS)) {
    if (!url) continue;
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:", type);
    assert.equal(parsed.username + parsed.password, "", type);
  }
});

test("committed output matches a fresh build", async () => {
  const { readFile } = await import("node:fs/promises");
  for (const [file, content] of outputs) {
    assert.equal(await readFile(join(root, file), "utf8"), content, `${file} is stale — run npm run build`);
  }
});

test("output paths are stable", () => {
  assert.equal(outputPath({ path: "/" }), "index.html");
  assert.equal(outputPath({ path: "/services/" }), "services/index.html");
});
