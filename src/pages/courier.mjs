import { COURIER_EXPECTATIONS } from "../content.mjs";
import { esc, pageHero, sectionHeading, renderForm } from "../layout.mjs";

export const page = {
  path: "/become-a-courier/",
  title: "Become a Courier",
  description: "Apply to drive with AE Logistics. We are looking for professional, reliable couriers in Detroit and Metro Detroit.",
  body: () => `
${pageHero({
  eyebrow: "Become a courier",
  title: "Drive with AE Logistics.",
  text: "We are looking for professional, reliable couriers who take pride in getting every delivery right."
})}
    <section class="section" aria-labelledby="expectations-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "What we expect", title: "The standard every AE courier meets.", id: "expectations-title" })}
        <ul class="values-grid">
          ${COURIER_EXPECTATIONS.map((item) => `<li><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
    <section class="section tinted" aria-labelledby="apply-title">
      <div class="container form-layout">
        <div class="form-aside">
          <p class="eyebrow">Apply</p>
          <h2 id="apply-title">Courier application</h2>
          <p>Every application is reviewed by our team. Submitting an application does not guarantee an offer of employment or a contractor agreement.</p>
          <p>If there is a fit, we will contact you about next steps, which may include verification of your driver's license, vehicle, insurance, and other requirements.</p>
        </div>
${renderForm("courierApplication", { intro: "Do not include your Social Security number, driver's license number, or other sensitive identification in this form." })}
      </div>
    </section>`
};
