# AE Logistics — Public Website

Public website for **AE Logistics, LLC** (All Encompass Logistics), a Detroit / Metro Detroit medical courier and business delivery company. Hosted on Cloudflare Pages at **https://aelogistics.us**.

Plain HTML, CSS, and vanilla JavaScript with **zero dependencies**. Pages are generated from shared content and layout by a small Node script, and the generated HTML is **committed**, so Cloudflare Pages still deploys the repository root with no build command.

> The secure employee / operations portal is intentionally not built yet. The public site has no login link.

## Structure

| Path | Purpose |
| --- | --- |
| `src/content.mjs` | **Edit here.** Business details, form webhook URLs, nav, services, industries, owners, testimonials, courier expectations. |
| `src/seo.mjs` | **SEO config.** Titles, social image, verification tokens, and JSON-LD structured data builders. |
| `src/layout.mjs` | Shared head, header, footer, CTA band, and form renderer. |
| `src/pages/*.mjs` | One file per page (home, services, industries, about, safety-compliance, become-a-courier, request-service, contact, 404). |
| `assets/js/forms.js` | Form schemas + validation + payload builder. Single source of truth used by the build, the browser, and tests. |
| `assets/js/main.js` | Browser behavior: mobile nav, logo fallbacks, form submission. |
| `assets/css/styles.css` | Mobile-first styles using the brand palette. |
| `assets/img/` | Brand assets cropped from the supplied artwork (logos, badge, icons, van photo, OG image, favicon). |
| `scripts/build.mjs` | Generator. Writes `index.html`, `*/index.html`, `404.html`, `sitemap.xml`, `robots.txt`. |
| `tests/` | `node:test` suites for form validation and generated pages. |
| `_headers` | Cloudflare Pages security headers (CSP). |

Do not hand-edit generated HTML — edit `src/` and rebuild.

## Commands (Node 22+)

```sh
npm run build   # regenerate HTML after editing src/ or assets/js/forms.js
npm run check   # fail if committed HTML is stale
npm test        # validation + page tests (includes the staleness check)
npm run serve   # preview at http://localhost:8080 (Python)
```

Always run `npm run build && npm test` and commit the generated files together with source changes.

## Business configuration

In `src/content.mjs`:

- `BUSINESS` — name, legal name, phone, email, service area, `hours` (empty = hidden), taglines.
- `OWNERS` — only approved bios. `photo` and `linkedin` stay hidden while empty.
- `TESTIMONIALS` — only real, approved quotes. The home-page section is hidden while empty.
- Do not add certifications, licenses, insurance levels, HIPAA/regulatory compliance claims, pricing, or physical addresses without explicit approval.

## Forms and webhooks

Three forms post to public HTTPS webhooks (e.g. n8n) configured in `FORM_ENDPOINTS`:

| Form | Page | Config key | Encoding |
| --- | --- | --- | --- |
| Service request | `/request-service/` | `serviceRequest` | `application/json` |
| Contact / business inquiry | `/contact/` | `contact` | `application/json` |
| Courier application | `/become-a-courier/` | `courierApplication` | `multipart/form-data` (optional `resume` file part) |

**While an endpoint is empty, that form does not submit.** It shows an error with the phone/email fallback instead of a false success message. The webhook URLs are visible to visitors — never embed credentials. Add each webhook's exact origin to `connect-src` in `_headers` (no wildcards).

### Payload contract

Every payload contains `formType` and `sourcePage`, plus **every** field from the form's schema in `assets/js/forms.js`, always as a string (`""` when empty; checkbox groups joined with `", "`). The honeypot field is never sent; honeypot submissions are silently discarded in the browser.

Service request example:

```json
{
  "formType": "serviceRequest",
  "sourcePage": "/request-service/",
  "companyName": "", "contactName": "", "email": "", "phone": "",
  "pickupAddress": "", "deliveryAddress": "",
  "serviceType": "Medical Courier Services",
  "deliveryType": "STAT",
  "estimatedDeliveries": "", "requestedStartDate": "YYYY-MM-DD",
  "notes": "", "preferredContactMethod": "Email"
}
```

Contact fields: `name, companyName, email, phone, inquiryType, message`.
Courier fields: `name, email, phone, city, driversLicenseStatus, hasVehicle, vehicleYear, vehicleMakeModel, insuranceStatus, workInterest, availability, experience, notes` + optional file part `resume` (PDF/DOC/DOCX, ≤ 5 MB).

Browser rules (see `forms.js`): required fields, email-or-phone for service/contact forms, preferred contact method must match a provided detail, option lists, max lengths, vehicle year range, resume type/size. **Browser validation is not a security boundary — revalidate everything server-side.**

### What the webhook workflows must do

The website does not store submissions itself. Until the operations portal exists, each n8n workflow is responsible for:

1. Revalidating input (same rules + limits), rate limiting, and spam control.
2. **Storing** the submission (e.g. n8n Data Table / database) — service requests and courier applications are review queues; applicants are never auto-approved.
3. **Emailing a notification to `aelogisticsdet@gmail.com`** using credentials stored in n8n, never in this repo.
4. For courier applications: validating the resume type/size again and storing the file privately.
5. CORS: answer `OPTIONS` preflight for `POST` + `Content-Type` and include `Access-Control-Allow-Origin` for `https://aelogistics.us` and `https://www.aelogistics.us` on all responses (including errors). No cookies are sent.
6. Returning **2xx only after the submission is stored**; non-2xx otherwise. Avoid redirects.

The browser prevents double submits, times out after 20 s, keeps entries on failure, and resets the form only after a confirmed 2xx. A timeout can occur after the server accepted a request, so the error message tells users to check before resubmitting time-sensitive requests. Form data is never logged or stored in the browser.

Deep links: `/request-service/?service=<service-slug>&type=<Scheduled|Recurring|Same-Day|STAT>` preselects the form.

## SEO

- **Metadata:** `src/seo.mjs` renders the title, description, robots tag, canonical link, Open Graph tags, and Twitter card tags for every page. A page can set `seoTitle` (otherwise `"<title> | AE Logistics"`), `schemaType` (`AboutPage`, `ContactPage`, …), and `schema(url)` for extra structured data.
- **Structured data:** every page has a JSON-LD `@graph` with one shared `LocalBusiness` node and a `WebSite` node, plus `WebPage` + `BreadcrumbList` on inner pages. The Services page adds a `Service` node per service and `FAQPage` data mirroring the visible FAQ (`SERVICE_FAQS` in `content.mjs`). About adds the owners as `Person` nodes. Never add reviews, ratings, addresses, hours, prices, or certifications unless they are real and visible on the site.
- **Sitemap / robots:** `npm run build` writes `sitemap.xml` (indexable pages only; any page with `noindex: true` is excluded) and `robots.txt` (allows the site, disallows the future `/portal/`, references the sitemap). robots.txt is not access control.
- **Indexing protection (`_headers`):** `X-Robots-Tag: noindex` on repo files that Pages serves (`/src/`, `/scripts/`, `/tests/`, `README.md`, `package.json`, `/assets/js/`) and on all `*.pages.dev` hostnames, so only the custom domain is indexed.
- **Search Console / Bing:** paste the verification token (the `content` value only) into `SEO.verification.google` / `SEO.verification.bing` in `src/seo.mjs`, rebuild, and deploy. Then submit `https://aelogistics.us/sitemap.xml` in each console.
- **Analytics:** none is installed. If GA4 (or similar) is added later, load it from `renderPage` in `src/layout.mjs` and add its origins to the CSP `script-src`/`connect-src` in `_headers`.
- `npm test` includes SEO regression tests (unique titles/descriptions, canonical/OG/Twitter tags, valid JSON-LD, sitemap/robots contents, image alt/dimensions).

## Deploy to Cloudflare Pages

Unchanged: framework preset **None**, **empty build command**, output directory **`/`**. Commits to the production branch publish automatically. Custom domain: `aelogistics.us` (canonical; redirect `www.aelogistics.us` to it). Cloudflare serves `404.html` for unknown paths.

### Launch checks

- Configure webhook URLs + `_headers` CSP together; verify response headers on the deployed site.
- Submit each form for real: success (2xx), rejection (non-2xx), and network failure; confirm the record is stored and the email arrives.
- Check mobile navigation, keyboard focus, and no horizontal overflow.
