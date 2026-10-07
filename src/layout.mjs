// Shared layout, components, and HTML helpers used by every page.
import { BUSINESS, NAV, FORM_ENDPOINTS, SERVICES, OTHER_SERVICE_OPTION } from "./content.mjs";
import { FORMS } from "../assets/js/forms.js";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);

export const phoneHref = `tel:+1${BUSINESS.phone.replace(/\D/g, "")}`;
export const emailHref = `mailto:${BUSINESS.email}`;

export const requestServiceHref = (serviceSlug, deliveryType) => {
  const params = new URLSearchParams();
  if (serviceSlug) params.set("service", serviceSlug);
  if (deliveryType) params.set("type", deliveryType);
  const query = params.toString();
  return `/request-service/${query ? `?${esc(query)}` : ""}`;
};

const arrow = '<span aria-hidden="true">→</span>';

export const button = (href, label, variant = "primary", extra = "") =>
  `<a class="button button-${variant}" href="${href}"${extra}>${esc(label)} ${arrow}</a>`;

export const callButton = (variant = "outline") =>
  `<a class="button button-${variant}" href="${phoneHref}">Call ${esc(BUSINESS.phone)}</a>`;

export const sectionHeading = ({ eyebrow, title, text, id }) => `
        <div class="section-heading">
          ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
          <h2${id ? ` id="${id}"` : ""}>${title}</h2>
          ${text ? `<p>${esc(text)}</p>` : ""}
        </div>`;

export const contactList = (className = "contact-list") => `
          <ul class="${className}">
            <li><span class="contact-label">Phone</span><a href="${phoneHref}">${esc(BUSINESS.phone)}</a></li>
            <li><span class="contact-label">Email</span><a href="${emailHref}">${esc(BUSINESS.email)}</a></li>
            <li><span class="contact-label">Service area</span>${esc(BUSINESS.serviceArea)}</li>
            ${BUSINESS.hours ? `<li><span class="contact-label">Hours</span>${esc(BUSINESS.hours)}</li>` : ""}
          </ul>`;

export const ctaBand = ({ title = "Ready to move something that matters?", text = "Tell us what you need delivered and our team will follow up to confirm the details.", id = "" } = {}) => `
    <section class="section cta-band"${id ? ` id="${id}"` : ""} aria-labelledby="cta-title-${id || "main"}">
      <div class="container cta-inner">
        <div>
          <h2 id="cta-title-${id || "main"}">${esc(title)}</h2>
          <p>${esc(text)}</p>
        </div>
        <div class="button-row">
          ${button("/request-service/", "Request Service")}
          ${callButton()}
        </div>
      </div>
    </section>`;

export const pageHero = ({ eyebrow, title, text, actions = "" }) => `
    <section class="page-hero" aria-labelledby="page-title">
      <div class="container">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1 id="page-title">${title}</h1>
        ${text ? `<p class="page-hero-text">${esc(text)}</p>` : ""}
        ${actions ? `<div class="button-row">${actions}</div>` : ""}
      </div>
    </section>`;

/* ---------- Forms ---------- */

// Returns [{ value, slug? }]. Service options carry their slug so links such as
// /request-service/?service=scheduled-routes can preselect them.
const optionList = (field) => {
  if (field.options === "services") return [...SERVICES.map((service) => ({ value: service.name, slug: service.slug })), { value: OTHER_SERVICE_OPTION, slug: "other" }];
  return field.options.map((value) => ({ value }));
};

const renderField = (field, formType) => {
  const id = `${formType}-${field.name}`;
  const required = field.required ? " *" : "";
  const describedBy = [field.hint ? `${id}-hint` : "", `${id}-error`].filter(Boolean).join(" ");
  const hint = field.hint ? `<span class="field-help" id="${id}-hint">${esc(field.hint)}</span>` : "";
  const error = `<span class="field-error" id="${id}-error"></span>`;
  const common = `id="${id}" name="${field.name}" aria-describedby="${describedBy}"${field.required ? " required" : ""}`;
  const wrapperClass = `field${field.full ? " full-width" : ""}`;

  if (field.type === "checkboxes") {
    const boxes = field.options.map((option, index) => `
              <label class="check"><input type="checkbox" name="${field.name}" value="${esc(option)}" id="${id}-${index}"> ${esc(option)}</label>`).join("");
    return `
            <fieldset class="${wrapperClass} checkbox-group" id="${id}" aria-describedby="${describedBy}">
              <legend>${esc(field.label)}${required}</legend>${boxes}
              ${hint}${error}
            </fieldset>`;
  }

  let control;
  if (field.type === "select") {
    const options = optionList(field).map((option) => `<option value="${esc(option.value)}"${option.slug ? ` data-slug="${option.slug}"` : ""}>${esc(option.value)}</option>`).join("");
    control = `<select ${common}><option value="">Select…</option>${options}</select>`;
  } else if (field.type === "textarea") {
    control = `<textarea ${common} rows="5" maxlength="${field.max}"></textarea>`;
  } else if (field.type === "file") {
    control = `<input ${common} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">`;
  } else if (field.type === "number") {
    control = `<input ${common} type="number" inputmode="numeric" min="${field.min}" max="${field.max}" step="1">`;
  } else {
    const auto = field.autocomplete ? ` autocomplete="${field.autocomplete}"` : "";
    const max = field.max ? ` maxlength="${field.max}"` : "";
    control = `<input ${common} type="${field.type}"${auto}${max}>`;
  }
  return `
            <div class="${wrapperClass}">
              <label for="${id}">${esc(field.label)}${required}</label>
              ${control}
              ${hint}${error}
            </div>`;
};

export const renderForm = (formType, { intro = "" } = {}) => {
  const form = FORMS[formType];
  const endpoint = FORM_ENDPOINTS[formType] || "";
  return `
          <form id="${form.id}" class="site-form" data-form="${formType}" data-endpoint="${esc(endpoint)}" data-phone="${esc(BUSINESS.phone)}" data-email="${esc(BUSINESS.email)}" novalidate aria-describedby="${form.id}-intro"${form.multipart ? ' enctype="multipart/form-data"' : ""}>
            <p id="${form.id}-intro" class="form-intro">${intro} <span>Fields marked * are required.</span></p>
            <div class="form-grid">${form.fields.map((field) => renderField(field, formType)).join("")}
            </div>
            <div class="honeypot" aria-hidden="true"><label for="${formType}-website">Leave this field empty</label><input id="${formType}-website" name="website" tabindex="-1" autocomplete="off"></div>
            <button class="button button-dark" type="submit">${esc(form.submitLabel)} ${arrow}</button>
            <p class="form-status" role="status" aria-live="polite" aria-atomic="true"></p>
            <noscript><p class="form-status" data-state="error">This form requires JavaScript. Please call <a href="${phoneHref}">${esc(BUSINESS.phone)}</a> or email <a href="${emailHref}">${esc(BUSINESS.email)}</a>.</p></noscript>
          </form>`;
};

/* ---------- Page shell ---------- */

const structuredData = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS.legalName,
    alternateName: [BUSINESS.name, BUSINESS.brandName],
    url: `${BUSINESS.siteUrl}/`,
    logo: `${BUSINESS.siteUrl}/assets/img/logo-primary.png`,
    image: `${BUSINESS.siteUrl}/assets/img/og-image.jpg`,
    slogan: BUSINESS.tagline,
    telephone: `+1-${BUSINESS.phone}`,
    email: BUSINESS.email,
    areaServed: BUSINESS.serviceArea
  };
  if (BUSINESS.hours) data.description = `Business hours: ${BUSINESS.hours}`;
  // Escape "<" so content can never close the script element.
  return JSON.stringify(data).replace(/</g, "\\u003c");
};

const header = (path) => {
  const links = NAV.map((item) => {
    const current = item.href === path ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${current}>${esc(item.label)}</a>`;
  }).join("\n          ");
  const ctaCurrent = path === "/request-service/" ? ' aria-current="page"' : "";
  return `
  <div class="utility-bar">
    <div class="container utility-inner">
      <span>Serving ${esc(BUSINESS.serviceArea)}</span>
      <span class="utility-links"><a href="${phoneHref}">${esc(BUSINESS.phone)}</a><a href="${emailHref}">${esc(BUSINESS.email)}</a></span>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="${esc(BUSINESS.name)} home">
        <img class="brand-logo optional-logo" src="/assets/img/logo-horizontal-light.webp" alt="" width="211" height="55">
        <span class="brand-text" hidden>AE LOGISTICS<span class="brand-subtitle">DETROIT, MI</span></span>
      </a>
      <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" hidden>Menu <span aria-hidden="true">☰</span></button>
      <nav id="site-nav" aria-label="Main navigation">
          ${links}
          <a class="nav-cta" href="/request-service/"${ctaCurrent}>Request Service</a>
      </nav>
    </div>
  </header>`;
};

const footer = () => {
  const year = new Date().getFullYear();
  const columns = [
    { title: "Company", links: NAV.filter((item) => ["/about/", "/safety-compliance/", "/become-a-courier/", "/contact/"].includes(item.href)) },
    { title: "Services", links: SERVICES.map((service) => ({ label: service.name, href: `/services/#${service.slug}` })) }
  ];
  return `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand-col">
        <img class="footer-logo optional-logo" src="/assets/img/logo-horizontal.webp" alt="${esc(BUSINESS.brandName)} — ${esc(BUSINESS.name)}" width="300" height="91" loading="lazy">
        <p class="footer-brand" hidden>AE LOGISTICS</p>
        <p class="footer-tagline">${esc(BUSINESS.tagline)}</p>
        <p class="footer-local">Locally owned and operated in Detroit, Michigan.</p>
      </div>
      ${columns.map((column) => `
      <div class="footer-col">
        <h2>${esc(column.title)}</h2>
        <ul>${column.links.map((link) => `<li><a href="${link.href}">${esc(link.label)}</a></li>`).join("")}</ul>
      </div>`).join("")}
      <div class="footer-col">
        <h2>Contact</h2>
        <ul>
          <li><a href="${phoneHref}">${esc(BUSINESS.phone)}</a></li>
          <li><a href="${emailHref}">${esc(BUSINESS.email)}</a></li>
          <li>${esc(BUSINESS.serviceArea)}</li>
          ${BUSINESS.hours ? `<li>${esc(BUSINESS.hours)}</li>` : ""}
          <li><a href="/request-service/">Request Service</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom"><p>© <span data-year>${year}</span> ${esc(BUSINESS.legalName)}. Detroit, MI.</p><span>Please do not send patient information through this website.</span></div>
  </footer>`;
};

export const renderPage = ({ path, title, description, body, noindex = false }) => {
  const canonical = `${BUSINESS.siteUrl}${path}`;
  const fullTitle = path === "/" ? `${BUSINESS.name} | Medical Courier & Business Delivery in Detroit` : `${title} | ${BUSINESS.name}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#062A4A">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(BUSINESS.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BUSINESS.siteUrl}/assets/img/og-image.jpg">
  <meta property="og:image:alt" content="${esc(BUSINESS.brandName)} logo">
${noindex ? '  <meta name="robots" content="noindex">\n' : `  <link rel="canonical" href="${canonical}">\n`}  <link rel="icon" type="image/png" href="/assets/img/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="module" src="/assets/js/main.js"></script>
  <script type="application/ld+json">${structuredData()}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>${header(path)}

  <main id="main">${body}
  </main>
${footer()}
</body>
</html>
`;
};
