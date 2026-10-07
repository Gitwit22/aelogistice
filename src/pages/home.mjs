import { BUSINESS, SERVICES, CAPABILITIES, WHY_CHOOSE_US, INDUSTRIES, HOW_IT_WORKS, TESTIMONIALS } from "../content.mjs";
import { esc, button, callButton, sectionHeading, contactList, ctaBand } from "../layout.mjs";

export const page = {
  path: "/",
  title: "Home",
  description: "Detroit medical courier and delivery service. AE Logistics provides specimen transport, STAT delivery, scheduled clinic-to-lab routes, and same-day business delivery across Metro Detroit, Michigan.",
  body: () => `
    <section id="home" class="hero" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Medical courier &amp; business logistics · Metro Detroit</p>
          <h1 id="hero-title">Reliable delivery <span>when timing matters.</span></h1>
          <p class="hero-description">Professional medical courier, specimen transport, and healthcare logistics for medical offices, laboratories, pharmacies, and local businesses across Detroit and Metro Detroit, Michigan.</p>
          <p class="tagline">${esc(BUSINESS.tagline)}</p>
          <div class="button-row">
            ${button("/request-service/", "Request Service")}
            ${callButton()}
          </div>
          <p class="hero-secondary"><a href="/contact/">Partner with AE Logistics <span aria-hidden="true">→</span></a></p>
        </div>
        <div class="hero-art">
          <div class="logo-panel">
            <img class="hero-logo optional-logo" src="/assets/img/logo-primary.webp" alt="${esc(BUSINESS.brandName)} — Delivering What Matters. Detroit, MI" width="719" height="525" fetchpriority="high">
            <span class="logo-fallback" hidden aria-hidden="true">AE<span>LOGISTICS</span></span>
          </div>
        </div>
      </div>
      <div class="capability-strip">
        <ul class="container capability-list">
          ${CAPABILITIES.map((item) => `<li><img src="${item.icon}" alt="" width="48" height="48" loading="lazy"><span>${esc(item.label)}</span></li>`).join("\n          ")}
        </ul>
      </div>
    </section>

    <section id="services" class="section" aria-labelledby="services-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "What we do", title: "Courier services built around your schedule.", text: "From priority medical runs to recurring business routes, AE Logistics moves what matters across Metro Detroit.", id: "services-title" })}
        <div class="card-grid">
          ${SERVICES.map((service, index) => `
          <article class="service-card">
            <span class="card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <h3>${esc(service.name)}</h3>
            <p>${esc(service.summary)}</p>
            <a class="card-link" href="/services/#${service.slug}">Learn more<span class="visually-hidden"> about ${esc(service.name)}</span> <span aria-hidden="true">→</span></a>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section id="why-us" class="section tinted" aria-labelledby="why-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Why AE Logistics", title: "A dependable connection, not just a delivery.", id: "why-title" })}
        <ul class="values-grid">
          ${WHY_CHOOSE_US.map((item) => `<li><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></li>`).join("\n          ")}
        </ul>
      </div>
    </section>

    <section id="who-we-serve" class="section" aria-labelledby="industries-title">
      <div class="container split">
        ${sectionHeading({ eyebrow: "Industries served", title: "Supporting the teams that keep Detroit moving.", text: "Practical courier support for healthcare operations and everyday business needs.", id: "industries-title" })}
        <ul class="link-list">
          ${INDUSTRIES.map((industry) => `<li><a href="/industries/#${industry.slug}"><strong>${esc(industry.name)}</strong><span>${esc(industry.summary)}</span></a></li>`).join("\n          ")}
        </ul>
      </div>
    </section>

    <section id="how-it-works" class="section tinted" aria-labelledby="how-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "How service works", title: "Simple from request to delivery.", id: "how-title" })}
        <ol class="steps">
          ${HOW_IT_WORKS.map((step) => `<li><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="safety-title">
      <div class="container split">
        ${sectionHeading({ eyebrow: "Safety & accountability", title: "Careful handling at every handoff.", text: "Couriers follow AE Logistics procedures for handling, communication, and documented pickup and delivery. Tell us about your requirements and we will review them with you before service begins.", id: "safety-title" })}
        <div class="button-row">${button("/safety-compliance/", "Our approach to safety", "dark")}</div>
      </div>
    </section>

    <section id="service-area" class="section area-section" aria-labelledby="area-title">
      <div class="container area-grid">
        <div>
          <p class="eyebrow">Local knowledge. Purposeful reach.</p>
          <h2 id="area-title">Serving Detroit and Metro Detroit.</h2>
          <p>AE Logistics is a locally owned company based in Detroit. We serve organizations throughout the Metro Detroit area — contact us about locations and routes outside it.</p>
          <div class="button-row">${button("/request-service/?type=Recurring", "Ask about your route", "outline")}</div>
        </div>
        <img class="area-image" src="/assets/img/van-detroit.jpg" alt="An AE Logistics delivery van driving past the Detroit skyline" width="465" height="175" loading="lazy">
      </div>
    </section>
${TESTIMONIALS.length ? `
    <section class="section" aria-labelledby="testimonials-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "What customers say", title: "Trusted by local organizations.", id: "testimonials-title" })}
        <div class="card-grid">
          ${TESTIMONIALS.map((item) => `<figure class="testimonial"><blockquote>${esc(item.quote)}</blockquote><figcaption>${esc(item.name)}${item.organization ? `, ${esc(item.organization)}` : ""}</figcaption></figure>`).join("")}
        </div>
      </div>
    </section>` : ""}
${ctaBand({ id: "contact", title: "Request service or talk with our team.", text: "Send a request online or contact us directly." })}
    <section class="section" aria-labelledby="home-contact-title">
      <div class="container split">
        ${sectionHeading({ eyebrow: "Contact", title: "Get in touch.", id: "home-contact-title" })}
        ${contactList()}
      </div>
    </section>`
};
