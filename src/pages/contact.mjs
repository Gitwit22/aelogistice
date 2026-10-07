import { pageHero, renderForm, contactList, button } from "../layout.mjs";

export const page = {
  path: "/contact/",
  title: "Contact",
  seoTitle: "Contact AE Logistics | Detroit Medical Courier | 313-880-9792",
  schemaType: "ContactPage",
  description: "Contact AE Logistics in Detroit, Michigan. Call 313-880-9792 or email aelogisticsdet@gmail.com about courier service or business partnerships.",
  body: () => `
${pageHero({
  eyebrow: "Contact",
  title: "Let's talk about your deliveries.",
  text: "Questions, partnership opportunities, or a route you want to discuss — our team is here to help."
})}
    <section class="section tinted" aria-labelledby="contact-section-title">
      <h2 id="contact-section-title" class="visually-hidden">Contact information and form</h2>
      <div class="container form-layout">
        <div class="form-aside">
          <h2>AE Logistics, LLC</h2>
          ${contactList()}
          <div class="aside-cta">
            <h3>Ready to schedule a delivery?</h3>
            <p>Use our service request form so we have the pickup, delivery, and timing details we need.</p>
            ${button("/request-service/", "Request Service", "dark")}
          </div>
        </div>
${renderForm("contact", { intro: "Business inquiries and general questions. Please do not include patient information." })}
      </div>
    </section>`
};
