import { esc, pageHero, ctaBand, sectionHeading, button } from "../layout.mjs";

// Describe practices only. Do not claim certifications, licenses, or regulatory
// compliance (e.g. HIPAA, OSHA, DOT, IATA) unless the business has verified them.
const PRACTICES = [
  { title: "Documented handoffs", description: "Pickups and deliveries are documented so you know when a shipment changed hands and who received it." },
  { title: "Your handling instructions", description: "Shipments are transported as packaged and labeled by the sender, following the handling and temperature instructions you provide." },
  { title: "Secure transport", description: "Shipments are secured in the vehicle and stay with the courier from pickup until delivery." },
  { title: "Clear communication", description: "Our team keeps you informed and reaches out promptly if a delay or exception occurs." },
  { title: "Courier standards", description: "Couriers are expected to follow AE Logistics procedures for professionalism, safe driving, handling, and documentation." },
  { title: "Exception reporting", description: "Delays, damage, refusals, and other exceptions are reported to our team and communicated to you." }
];

const TECHNOLOGY = ["Dispatching and job assignment", "Barcode tracking", "Delivery confirmation", "Chain-of-custody records", "Temperature logging for temperature-sensitive shipments"];

export const page = {
  path: "/safety-compliance/",
  title: "Safety & Compliance",
  description: "How AE Logistics approaches careful handling, documented handoffs, communication, and accountability for medical and business deliveries in Metro Detroit.",
  body: () => `
${pageHero({
  eyebrow: "Safety & compliance",
  title: "Accountability from pickup through delivery.",
  text: "Our approach is built on careful handling, documented handoffs, and clear communication."
})}
    <section class="section" aria-labelledby="practices-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Our practices", title: "How we handle your shipments.", id: "practices-title" })}
        <ul class="values-grid">
          ${PRACTICES.map((item) => `<li><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
    <section class="section tinted" aria-labelledby="requirements-title">
      <div class="container split">
        <div>
          <h2 id="requirements-title">Your requirements, reviewed up front.</h2>
          <p class="lead">Healthcare organizations and businesses often have specific handling, documentation, privacy, or regulatory requirements.</p>
          <p>Include them in your service request. We will review them with you before service begins and confirm what we can support, so there are no surprises once shipments are moving.</p>
          <div class="button-row">${button("/request-service/", "Request Service", "dark")}</div>
        </div>
        <div class="detail-points">
          <h3>Technology in development</h3>
          <p>AE Logistics is developing its own operational technology to support:</p>
          <ul class="check-list">${TECHNOLOGY.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="privacy-title">
      <div class="container narrow">
        <h2 id="privacy-title">Privacy on this website</h2>
        <p>Our website forms are for business contact and scheduling information only. Please do not include patient names, medical record numbers, or other protected health information in any form or email sent through this website. Our team will coordinate any shipment-specific details with you directly.</p>
      </div>
    </section>
${ctaBand()}`
};
