import { esc, pageHero, renderForm, contactList, phoneHref } from "../layout.mjs";
import { BUSINESS } from "../content.mjs";

export const page = {
  path: "/request-service/",
  title: "Request Service",
  description: "Request courier service from AE Logistics — medical courier, specimen transportation, STAT, scheduled routes, and same-day business delivery in Metro Detroit.",
  body: () => `
${pageHero({
  eyebrow: "Request service",
  title: "Tell us what needs to move.",
  text: "Send your delivery details and our team will follow up to confirm routing, timing, and handling requirements."
})}
    <section class="section tinted" aria-label="Service request form">
      <div class="container form-layout">
        <div class="form-aside">
          <h2>Before you submit</h2>
          <p>A request is not a confirmed booking. We will contact you to confirm details and availability.</p>
          <p class="notice"><strong>Need a STAT pickup right now?</strong> Call <a href="${phoneHref}">${esc(BUSINESS.phone)}</a> so we can respond immediately.</p>
          ${contactList()}
        </div>
${renderForm("serviceRequest", { intro: "Please do not include patient names, medical records, or other protected health information." })}
      </div>
    </section>`
};
