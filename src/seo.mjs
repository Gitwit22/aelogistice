// SEO CONFIGURATION & HELPERS — single source for page metadata, social tags, and
// JSON-LD structured data. Business facts (name, phone, email, area) come from
// BUSINESS in content.mjs; never fabricate reviews, ratings, addresses, hours,
// certifications, or pricing here.
import { BUSINESS, SERVICES, OWNERS } from "./content.mjs";

export const SEO = Object.freeze({
  locale: "en_US",
  defaultTitle: `${BUSINESS.name} | Medical Courier & Delivery Service in Detroit, MI`,
  socialImage: { path: "/assets/img/og-image.jpg", width: 1200, height: 630, alt: `${BUSINESS.brandName} (${BUSINESS.name}) logo — Detroit, MI` },
  logoPath: "/assets/img/logo-primary.png",
  // Search engine ownership verification. Paste ONLY the token value (the "content"
  // attribute of the meta tag each console gives you). Empty = tag omitted.
  verification: {
    google: "", // Google Search Console → HTML tag method
    bing: "" // Bing Webmaster Tools → HTML meta tag method (msvalidate.01)
  }
});

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);

export const absoluteUrl = (path) => `${BUSINESS.siteUrl}${path}`;

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

const areaServed = [
  { "@type": "City", name: "Detroit", containedInPlace: { "@type": "State", name: "Michigan" } },
  { "@type": "AdministrativeArea", name: "Metro Detroit, Michigan" }
];

const organization = () => {
  const node = {
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: BUSINESS.legalName,
    alternateName: [BUSINESS.name, BUSINESS.brandName],
    url: absoluteUrl("/"),
    logo: absoluteUrl(SEO.logoPath),
    image: absoluteUrl(SEO.socialImage.path),
    description: "Medical courier, specimen transportation, STAT, scheduled route, and same-day business delivery services for healthcare organizations and businesses in Detroit and Metro Detroit, Michigan.",
    slogan: BUSINESS.tagline,
    telephone: `+1-${BUSINESS.phone}`,
    email: BUSINESS.email,
    areaServed,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+1-${BUSINESS.phone}`,
      email: BUSINESS.email,
      areaServed: "US",
      availableLanguage: "English"
    },
    knowsAbout: ["Medical courier services", "Specimen transportation", "Clinic-to-lab transport", "STAT delivery", "Scheduled courier routes", "Chain of custody", "Healthcare logistics", "Same-day business delivery"]
  };
  if (BUSINESS.hours) node.description += ` Business hours: ${BUSINESS.hours}.`;
  return node;
};

const website = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: absoluteUrl("/"),
  name: BUSINESS.name,
  alternateName: BUSINESS.brandName,
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID }
});

const breadcrumb = (page, url) => ({
  "@type": "BreadcrumbList",
  "@id": `${url}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: page.breadcrumb || page.title, item: url }
  ]
});

export const serviceNodes = () => SERVICES.map((service) => ({
  "@type": "Service",
  "@id": absoluteUrl(`/services/#${service.slug}`),
  name: service.name,
  serviceType: service.name,
  description: service.description,
  url: absoluteUrl(`/services/#${service.slug}`),
  provider: { "@id": ORG_ID },
  areaServed
}));

export const personNodes = () => OWNERS.map((owner) => {
  const node = { "@type": "Person", name: owner.name, jobTitle: owner.title, worksFor: { "@id": ORG_ID } };
  if (owner.linkedin) node.sameAs = [owner.linkedin];
  return node;
});

export const faqNode = (faqs, url) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } }))
});

/** Builds the JSON-LD @graph for a page. Pages may add nodes via page.schema(url). */
export const structuredData = (page) => {
  const url = absoluteUrl(page.path);
  const graph = [organization(), website()];
  if (!page.noindex) {
    const webPage = {
      "@type": page.schemaType || "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: pageTitle(page),
      description: page.description,
      inLanguage: "en-US",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(SEO.socialImage.path) }
    };
    if (page.path !== "/") {
      webPage.breadcrumb = { "@id": `${url}#breadcrumb` };
      graph.push(breadcrumb(page, url));
    }
    graph.push(webPage);
    if (page.schema) graph.push(...page.schema(url));
  }
  // Escape "<" so content can never close the script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
};

export const pageTitle = (page) => page.seoTitle || (page.path === "/" ? SEO.defaultTitle : `${page.title} | ${BUSINESS.name}`);

/** Renders all SEO-related <head> tags for a page. */
export const seoHead = (page) => {
  const title = esc(pageTitle(page));
  const description = esc(page.description);
  const url = absoluteUrl(page.path);
  const image = absoluteUrl(SEO.socialImage.path);
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    page.noindex ? "" : `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="${SEO.locale}">`,
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    page.noindex ? "" : `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${SEO.socialImage.width}">`,
    `<meta property="og:image:height" content="${SEO.socialImage.height}">`,
    `<meta property="og:image:alt" content="${esc(SEO.socialImage.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image:alt" content="${esc(SEO.socialImage.alt)}">`,
    SEO.verification.google ? `<meta name="google-site-verification" content="${esc(SEO.verification.google)}">` : "",
    SEO.verification.bing ? `<meta name="msvalidate.01" content="${esc(SEO.verification.bing)}">` : ""
  ];
  return lines.filter(Boolean).map((line) => `  ${line}`).join("\n");
};
