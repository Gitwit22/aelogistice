import { INDUSTRIES } from "../content.mjs";
import { esc, button, pageHero, ctaBand } from "../layout.mjs";

export const page = {
  path: "/industries/",
  title: "Industries",
  description: "AE Logistics supports healthcare organizations, laboratories, medical and dental offices, pharmacies, and professional businesses across Metro Detroit with dependable courier service.",
  body: () => `
${pageHero({
  eyebrow: "Industries",
  title: "Courier support for the organizations Detroit depends on.",
  text: "We work with healthcare and business teams to build delivery workflows around their operations and requirements."
})}
    <section class="section" aria-label="Industries we serve">
      <div class="container">
        <div class="industry-grid">
          ${INDUSTRIES.map((industry) => `
          <article id="${industry.slug}" class="industry-card">
            <h2>${esc(industry.name)}</h2>
            <p>${esc(industry.description)}</p>
          </article>`).join("")}
        </div>
      </div>
    </section>
    <section class="section tinted" aria-labelledby="requirements-title">
      <div class="container narrow">
        <h2 id="requirements-title">Have specific requirements?</h2>
        <p>If your organization has handling, documentation, temperature, or regulatory requirements, include them in your service request. We will review them with you before service begins so expectations are clear on both sides.</p>
        <div class="button-row">${button("/request-service/", "Request Service", "dark")}</div>
      </div>
    </section>
${ctaBand()}`
};
