import { SERVICES, SERVICE_FAQS } from "../content.mjs";
import { esc, button, pageHero, requestServiceHref, ctaBand, callButton, sectionHeading } from "../layout.mjs";
import { serviceNodes, faqNode } from "../seo.mjs";

export const page = {
  path: "/services/",
  title: "Services",
  seoTitle: "Medical Courier & Delivery Services in Metro Detroit | AE Logistics",
  breadcrumb: "Services",
  schema: (url) => [...serviceNodes(), faqNode(SERVICE_FAQS, url)],
  description: "Medical courier services, clinic-to-lab specimen transport, STAT delivery, scheduled courier routes, same-day business delivery, and dedicated courier solutions in Detroit and Metro Detroit, MI.",
  body: () => `
${pageHero({
  eyebrow: "Services",
  title: "Courier and logistics services for healthcare and business.",
  text: "Medical courier, specimen transport, and business delivery across Detroit and Metro Detroit — scheduled, recurring, same-day, and STAT options with documented chain-of-custody handoffs. Contact us for a quote tailored to your needs.",
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
    <section class="section" aria-labelledby="faq-title">
      <div class="container narrow">
        ${sectionHeading({ eyebrow: "FAQ", title: "Common questions about our courier services", id: "faq-title" })}
        <dl class="faq-list">
          ${SERVICE_FAQS.map((faq) => `<div class="faq-item"><dt>${esc(faq.question)}</dt><dd>${esc(faq.answer)}</dd></div>`).join("\n          ")}
        </dl>
      </div>
    </section>
${ctaBand()}`
};
