# All Encompass Logistics, LLC

A responsive, accessible single-page medical and specialty courier website for Detroit, Michigan, hosted at **https://aelogistics.nxtlvlts.com**. Plain HTML, CSS, and vanilla JavaScript; no npm, frameworks, dependencies, or build step.

## Files and local preview

- `index.html`: semantic page structure, SEO metadata, and form.
- `assets/css/styles.css`: mobile-first styling and reduced-motion support.
- `assets/js/main.js`: business configuration, service/benefit arrays, structured data, navigation, and webhook submission.
- `assets/img/`: supplied brand assets.
- `_headers`: Cloudflare Pages response security headers.

Serve the repository root with any static HTTP server. For example, with Python installed: `python3 -m http.server 8080`, then visit `http://localhost:8080`. There is no existing test or lint infrastructure. Cloudflare's `_headers` rules apply on Pages, not the local Python server.

## Business configuration

Edit the clearly labeled `BUSINESS_CONFIG` object at the very top of `assets/js/main.js`:

```js
const BUSINESS_CONFIG = Object.freeze({
  phone: "",
  email: "",
  serviceArea: "",
  hours: "",
  webhookUrl: ""
});
```

Only enter verified details. All values start empty: empty phone/email/hours are hidden, and an empty service area hides its section and navigation link. For `serviceArea`, enter the verified coverage description (for example, “Detroit, Michigan and surrounding areas”). Hours are free-form display text. Phone should include a country/area code; email should be a valid business address. Contact links, fallback messages, and LocalBusiness JSON-LD use these same values and omit empty details.

Use a public **HTTPS** n8n webhook URL without embedded credentials. This URL is visible to visitors; never put secrets or private API credentials into the site. Add the webhook's exact origin to `connect-src` in `_headers`, at the marked configuration spot. For instance, a URL `https://YOUR-N8N-HOST/webhook/pickup` needs `connect-src 'self' https://YOUR-N8N-HOST;`. Do not enable broad wildcard origins.

Update the `SERVICES` array to add/remove services; cards and the service selector stay synchronized. Update `WHY_CHOOSE_US` for verified differentiators. Do not add certifications, licenses, insurance levels, HIPAA compliance, or other credential claims without verification.

## Logo files

Add the supplied logo files, using these exact case-sensitive paths:

- `assets/img/logo-primary.png`: hero and Open Graph image.
- `assets/img/logo-badge.png`: navigation badge and favicon.
- `assets/img/logo-horizontal.png`: footer.

Use optimized PNGs with transparent backgrounds, preferably with white/light artwork for the navy hero/footer and dark artwork for the white navigation. Missing in-page logos automatically give way to text branding; the favicon and social preview require the actual files. Provide a sufficiently large primary image for social sharing. No stock imagery is required.

## Deploy to Cloudflare Pages

1. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
2. Connect this GitHub repository and select the production branch.
3. Select **None** for framework preset, leave the **build command empty**, and set the **build output directory to `/`** (repository root).
4. Deploy. Verify the generated `pages.dev` URL, security response headers, logo assets, mobile navigation, and a real form submission before launch.
5. Future commits to the production branch publish automatically.

### Custom domain

1. In the Pages project, open **Custom domains → Set up a custom domain** and enter `aelogistics.nxtlvlts.com`. Register it in Pages before creating DNS records.
2. At the DNS provider for `nxtlvlts.com`, add a **CNAME** with name **`aelogistics`** pointing to **the project's `pages.dev` address**, without `https://` or a path.
3. Remove conflicting records for that subdomain, follow Cloudflare's validation instructions, and wait for DNS propagation and TLS issuance.
4. Verify HTTPS at `https://aelogistics.nxtlvlts.com`. The canonical and Open Graph URLs already reference this domain.

## Pickup form / n8n contract

The browser sends `POST` with `Content-Type: application/json`. All nine keys are always present, all values are strings, and optional empty values are `""`:

```json
{
  "name": "<requester's name>",
  "company": "",
  "email": "",
  "phone": "",
  "service": "Lab Specimen Transport",
  "pickupLocation": "",
  "deliveryLocation": "",
  "preferredDateTime": "",
  "message": "<delivery requirements without sensitive health information>"
}
```

`preferredDateTime`, when provided, uses the `datetime-local` value (usually `YYYY-MM-DDTHH:mm`), interpreted in the **pickup location's local time**, not UTC. `service` is the exact service name in `SERVICES`. The honeypot (`website`) is not included in the payload; filled honeypots are silently discarded before any request.

Required: name, at least one of email/phone, service, and message. Supplied email must be valid and phone must contain digits. Maximum lengths: name 150, company 200, email 254, phone 50, locations 300 each, message 3000 characters. Revalidate all input server-side; browser validation and the honeypot are not security boundaries.

Configure n8n to:

- Accept unauthenticated public JSON POST requests at the production webhook URL.
- Handle CORS preflight `OPTIONS` for `Content-Type: application/json`, allowing `POST` and the exact site origin `https://aelogistics.nxtlvlts.com` (and your `pages.dev` preview origin only when needed). Include `Access-Control-Allow-Origin` on actual responses, including errors. No cookies or credentials are sent.
- Return a **2xx response only after accepting the request**. Response body is optional; the browser does not parse it. Return non-2xx on rejection. Avoid redirects.
- Apply server-side validation, rate limiting/spam controls, safe handling of free-text input, and appropriate access controls/retention for collected contact data. Do not collect patient or medical-record data via this form.

The form prevents double submits, times out after 20 seconds, and shows success only for a 2xx response. Failure preserves the entered data and shows configured phone/email fallback links. A timeout can occur after the server accepted the request; confirm receipt before retrying when appropriate. Empty/malformed webhook configuration never reports success. Entries reset only after confirmed success. Form data is never logged to the console or persisted to browser storage.

### Launch checks

- Fill the verified config and install all three logos.
- Update CSP and n8n CORS together; inspect headers on the deployed site.
- Test required-field errors, email-only and phone-only requests, a successful 2xx response, a non-2xx response, a network failure, and an empty webhook URL.
- Confirm mobile menu keyboard operation, visible focus, no horizontal overflow, and service selector/card synchronization.
