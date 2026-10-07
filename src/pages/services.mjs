import { SERVICES } from "../content.mjs";
import { esc, button, pageHero, requestServiceHref, ctaBand, callButton } from "../layout.mjs";

export const page = {
  path: "/services/",
  title: "Services",
  description: "Medical courier services, specimen transportation, STAT and on-demand delivery, scheduled routes, same-day business delivery, and dedicated courier solutions in Metro Detroit.",
  body: () => `
${pageHero({
  eyebrow: "Services",
  title: "Courier and logistics services for healthcare and business.",
  text: "Scheduled, recurring, same-day, and priority delivery options across Detroit and Metro Detroit. Contact us for a quote tailored to your needs.",
  actions: `${button("/request-service/", "Request Service")}${callButton()}`
})}
    <nav class="section jump-nav" aria-label="Services on this page">
      <div class="container">
        <ul>${SERVICES.map((service) => `<li><a href="#${service.slug}">${esc(service.name)}</a></li>`).join("")}</ul>
      </div>
    </nav>
    <div class="service-details">
      ${SERVICES.map((service, index) => `
      <section id="${service.slug}" class="section service-detail${index % 2 ? " tinted" : ""}" aria-labelledby="${service.slug}-title">
        <div class="container split">
          <div>
            <span class="card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <h2 id="${service.slug}-title">${esc(service.name)}</h2>
            <p class="lead">${esc(service.description)}</p>
            <div class="button-row">${button(requestServiceHref(service.slug, service.cta?.deliveryType), service.cta?.label || "Request this service", "dark")}</div>
          </div>
          <div class="detail-points">
            <h3>${esc(service.pointsLabel)}</h3>
            <ul class="check-list">${service.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
          </div>
        </div>
      </section>`).join("")}
    </div>
    <section class="section" aria-labelledby="pricing-title">
      <div class="container narrow">
        <h2 id="pricing-title">Pricing</h2>
        <p>Every route and delivery is different. Send a service request or call us and we will provide a quote based on your pickup and delivery locations, timing, and volume.</p>
      </div>
    </section>
${ctaBand()}`
};
