import { BUSINESS, OWNERS, WHY_CHOOSE_US } from "../content.mjs";
import { esc, pageHero, ctaBand, sectionHeading } from "../layout.mjs";
import { personNodes } from "../seo.mjs";

const initials = (name) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const ownerCard = (owner) => `
          <article class="owner-card">
            ${owner.photo
              ? `<img class="owner-photo" src="${esc(owner.photo)}" alt="${esc(owner.name)}" width="160" height="160" loading="lazy">`
              : `<div class="owner-photo owner-placeholder" aria-hidden="true">${esc(initials(owner.name))}</div>`}
            <div>
              <h3>${esc(owner.name)}</h3>
              <p class="owner-title">${esc(owner.title)}</p>
              <p>${esc(owner.bio)}</p>
              <h4>Leadership focus</h4>
              <ul class="tag-list">${owner.focus.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
              ${owner.linkedin ? `<p><a href="${esc(owner.linkedin)}" rel="noopener noreferrer" target="_blank">LinkedIn profile<span class="visually-hidden"> for ${esc(owner.name)} (opens in a new tab)</span></a></p>` : ""}
            </div>
          </article>`;

export const page = {
  path: "/about/",
  title: "About Us",
  seoTitle: "About AE Logistics | Locally Owned Detroit Courier Company",
  schemaType: "AboutPage",
  schema: () => personNodes(),
  description: "AE Logistics is a locally owned and operated Detroit courier company led by co-owners John Steele and Lavarr Hall.",
  body: () => `
${pageHero({
  eyebrow: "About us",
  title: "Locally owned. Detroit operated.",
  text: `${BUSINESS.name} provides professional, dependable, secure, and time-sensitive transportation and courier solutions to healthcare organizations and businesses throughout Metro Detroit.`
})}
    <section class="section" aria-labelledby="story-title">
      <div class="container split">
        <div>
          <h2 id="story-title">Who we are</h2>
          <p class="lead">${esc(BUSINESS.name)} — ${esc(BUSINESS.brandName)} — is a Detroit-based logistics company built to give local organizations a courier partner they can count on.</p>
          <p>We focus on the details that matter to our customers: showing up when expected, handling shipments with care, documenting handoffs, and communicating clearly. As we grow, we are developing our own operational technology for dispatching, barcode tracking, delivery confirmation, and chain-of-custody management.</p>
          <p class="tagline">${esc(BUSINESS.tagline)}</p>
        </div>
        <img class="about-badge" src="/assets/img/logo-badge.webp" alt="${esc(BUSINESS.brandName)} badge — Detroit, MI. Safe, reliable, on time." width="271" height="289" loading="lazy">
      </div>
    </section>
    <section class="section tinted" aria-labelledby="leadership-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Leadership", title: "Meet the owners.", text: "AE Logistics is led by its co-owners, who are directly involved in day-to-day operations and customer relationships.", id: "leadership-title" })}
        <div class="owner-grid">${OWNERS.map(ownerCard).join("")}
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="values-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "What we stand for", title: "How we work.", id: "values-title" })}
        <ul class="values-grid">
          ${WHY_CHOOSE_US.map((item) => `<li><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
${ctaBand()}`
};
