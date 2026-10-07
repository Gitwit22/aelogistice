// BUSINESS CONFIGURATION — edit business details only here. Empty values stay hidden.
const BUSINESS_CONFIG = Object.freeze({
  phone: "",
  email: "",
  serviceArea: "",
  hours: "",
  webhookUrl: ""
});

const SERVICES = [
  { name: "Medical Courier / STAT Delivery", description: "Time-sensitive transport with careful attention to your medical delivery needs." },
  { name: "Lab Specimen Transport", description: "Coordinated specimen pickup and delivery with attention to handling instructions." },
  { name: "Pharmacy & Prescription Delivery", description: "Dependable delivery support connecting pharmacies with the people they serve." },
  { name: "Medical Supply & Equipment Delivery", description: "Move essential supplies and equipment to the teams and locations that need them." },
  { name: "Home Health & Infusion Support Logistics", description: "Delivery coordination that supports care beyond the clinical setting." },
  { name: "B2B / Contract Courier Services", description: "Flexible courier support for recurring routes and business-to-business deliveries." }
];

const WHY_CHOOSE_US = [
  { title: "Reliability", description: "Thoughtful coordination and attention to the delivery details that matter." },
  { title: "Chain-of-custody handling", description: "Careful handoffs and attention to your documented handling requirements." },
  { title: "Professional drivers", description: "Courteous, service-focused drivers who treat your deliveries with care." },
  { title: "Real-time communication", description: "Clear delivery updates that keep your team informed along the way." },
  { title: "Local Detroit team", description: "Local knowledge and a personal connection to the community we serve." }
];

(() => {
  "use strict";

  const phone = BUSINESS_CONFIG.phone.trim();
  const email = BUSINESS_CONFIG.email.trim();
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  document.querySelectorAll("[data-phone-link]").forEach((link) => {
    if (!phone) return;
    link.href = phoneHref;
    if (link.hasAttribute("data-phone-text")) link.textContent = phone;
    link.hidden = false;
  });
  document.querySelectorAll("[data-email-link]").forEach((link) => {
    if (!email) return;
    link.href = `mailto:${email}`;
    link.textContent = email;
    link.hidden = false;
  });
  document.querySelectorAll("[data-config]").forEach((element) => {
    const value = BUSINESS_CONFIG[element.dataset.config].trim();
    element.textContent = value;
    element.hidden = !value;
  });
  document.querySelectorAll("[data-contact-details]").forEach((element) => {
    element.hidden = !(phone || email || BUSINESS_CONFIG.hours.trim());
  });
  const hasArea = Boolean(BUSINESS_CONFIG.serviceArea.trim());
  document.getElementById("service-area").hidden = !hasArea;
  document.querySelector("[data-area-link]").hidden = !hasArea;
  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll(".optional-logo").forEach((image) => {
    const fallback = image.parentElement.querySelector(".logo-fallback, .footer-brand");
    const update = () => {
      const loaded = image.complete && image.naturalWidth > 0;
      image.hidden = !loaded;
      if (fallback) fallback.hidden = loaded;
    };
    image.addEventListener("load", update);
    image.addEventListener("error", update);
    if (image.complete) update();
  });

  const serviceSelect = document.getElementById("service");
  SERVICES.forEach((service, index) => {
    const card = document.createElement("article");
    card.className = "service-card";
    const number = document.createElement("span");
    number.className = "card-number";
    number.textContent = String(index + 1).padStart(2, "0");
    number.setAttribute("aria-hidden", "true");
    const title = document.createElement("h3");
    title.textContent = service.name;
    const description = document.createElement("p");
    description.textContent = service.description;
    card.append(number, title, description);
    document.getElementById("services-list").append(card);
    serviceSelect.add(new Option(service.name, service.name));
  });
  WHY_CHOOSE_US.forEach((point) => {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    title.textContent = point.title;
    const description = document.createElement("p");
    description.textContent = point.description;
    item.append(title, description);
    document.getElementById("why-list").append(item);
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "All Encompass Logistics, LLC",
    url: "https://aelogistics.nxtlvlts.com/",
    slogan: "Delivering What Matters."
  };
  if (phone) structuredData.telephone = phone;
  if (email) structuredData.email = email;
  if (hasArea) structuredData.areaServed = BUSINESS_CONFIG.serviceArea.trim();
  if (BUSINESS_CONFIG.hours.trim()) structuredData.description = `Business hours: ${BUSINESS_CONFIG.hours.trim()}`;
  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify(structuredData);
  document.head.append(schema);

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  menuButton.hidden = false;
  nav.dataset.enhanced = "true";
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  const form = document.getElementById("pickup-form");
  const submitButton = document.getElementById("submit-button");
  const status = document.getElementById("form-status");
  const idleButtonText = submitButton.textContent;
  let sending = false;

  const showStatus = (message, state, includeFallback = false) => {
    status.textContent = message;
    status.dataset.state = state;
    if (!includeFallback || !(phone || email)) return;
    status.append(document.createTextNode(" Please contact us directly: "));
    const contacts = [];
    if (phone) contacts.push({ label: phone, href: phoneHref });
    if (email) contacts.push({ label: email, href: `mailto:${email}` });
    contacts.forEach((contact, index) => {
      if (index) status.append(document.createTextNode(" or "));
      const link = document.createElement("a");
      link.textContent = contact.label;
      link.href = contact.href;
      status.append(link);
    });
    status.append(document.createTextNode("."));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || form.elements.website.value) return;
    status.textContent = "";
    const payload = {};
    ["name", "company", "email", "phone", "service", "pickupLocation", "deliveryLocation", "preferredDateTime", "message"].forEach((key) => {
      payload[key] = form.elements[key].value.trim();
    });
    const errors = {};
    if (!payload.name) errors.name = "Enter your name.";
    if (!payload.email && !payload.phone) {
      errors.email = "Provide an email address or phone number.";
      errors.phone = "Provide a phone number or email address.";
    }
    if (payload.email && form.elements.email.validity.typeMismatch) errors.email = "Enter a valid email address.";
    if (payload.phone && !/\d/.test(payload.phone)) errors.phone = "Enter a phone number containing digits.";
    if (!SERVICES.some((service) => service.name === payload.service)) errors.service = "Select a service.";
    if (!payload.message) errors.message = "Tell us about your delivery needs.";
    ["name", "email", "phone", "service", "message"].forEach((key) => {
      document.getElementById(`${key}-error`).textContent = errors[key] || "";
      if (errors[key]) form.elements[key].setAttribute("aria-invalid", "true");
      else form.elements[key].removeAttribute("aria-invalid");
    });
    if (Object.keys(errors).length) {
      showStatus("Please correct the highlighted fields.", "error");
      form.elements[Object.keys(errors)[0]].focus();
      return;
    }
    if (!BUSINESS_CONFIG.webhookUrl.trim()) {
      showStatus("The form is not yet configured. Your request has not been sent.", "error", true);
      return;
    }

    let webhook;
    try {
      webhook = new URL(BUSINESS_CONFIG.webhookUrl.trim());
      if (webhook.protocol !== "https:" || webhook.username || webhook.password) throw new Error("Invalid webhook URL");
    } catch {
      showStatus("The form is not configured correctly. Your request has not been sent.", "error", true);
      return;
    }

    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending request…";
    form.setAttribute("aria-busy", "true");
    showStatus("Sending your request…", "pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(webhook.href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Request rejected");
      form.reset();
      showStatus("Thank you. Your pickup request was received. Our team will follow up to confirm details; your pickup is not yet booked.", "success");
    } catch {
      showStatus("We could not confirm receipt of your request. Your entries have been kept. Please try again or contact our team before retrying a time-sensitive request.", "error", true);
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      submitButton.textContent = idleButtonText;
      form.removeAttribute("aria-busy");
    }
  });
})();
