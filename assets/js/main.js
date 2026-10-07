// Site behavior: navigation, logo fallbacks, and form submission.
// Form fields and validation rules live in forms.js; business content lives in src/content.mjs.
import { FORMS, validateForm, buildPayload } from "./forms.js";

const SUBMIT_TIMEOUT_MS = 20000;

/* ---------- Navigation ---------- */
const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
if (menuButton && nav) {
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
}

/* ---------- Logo fallbacks: show text branding if an image fails to load ---------- */
document.querySelectorAll(".optional-logo").forEach((image) => {
  const fallback = image.parentElement.querySelector(".logo-fallback, .brand-text, .footer-brand");
  const update = () => {
    const failed = image.complete && image.naturalWidth === 0;
    image.hidden = failed;
    if (fallback) fallback.hidden = !failed;
  };
  image.addEventListener("load", update);
  image.addEventListener("error", update);
  if (image.complete) update();
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

/* ---------- Forms ---------- */
const readValues = (formElement, schema) => {
  const values = {};
  for (const field of schema.fields) {
    if (field.type === "checkboxes") {
      values[field.name] = [...formElement.querySelectorAll(`input[name="${field.name}"]:checked`)].map((box) => box.value);
    } else if (field.type === "file") {
      values[field.name] = formElement.elements[field.name].files[0] || null;
    } else {
      values[field.name] = formElement.elements[field.name].value.trim();
    }
  }
  return values;
};

const dynamicOptions = (formElement, schema) => {
  const sets = {};
  for (const field of schema.fields) {
    if (field.type === "select" && !Array.isArray(field.options)) {
      sets[field.name] = [...formElement.elements[field.name].options].map((option) => option.value).filter(Boolean);
    }
  }
  return sets;
};

const showErrors = (formElement, formType, schema, errors) => {
  for (const field of schema.fields) {
    const message = errors[field.name] || "";
    const errorElement = document.getElementById(`${formType}-${field.name}-error`);
    if (errorElement) errorElement.textContent = message;
    const control = field.type === "checkboxes" ? document.getElementById(`${formType}-${field.name}`) : formElement.elements[field.name];
    if (message) control.setAttribute("aria-invalid", "true");
    else control.removeAttribute("aria-invalid");
  }
};

const focusFirstError = (formElement, formType, schema, errors) => {
  const first = schema.fields.find((field) => errors[field.name]);
  if (!first) return;
  const target = first.type === "checkboxes" ? formElement.querySelector(`input[name="${first.name}"]`) : formElement.elements[first.name];
  target.focus();
};

const setStatus = (formElement, message, state, includeFallback = false) => {
  const status = formElement.querySelector(".form-status");
  status.textContent = message;
  status.dataset.state = state;
  const { phone, email } = formElement.dataset;
  if (!includeFallback || !(phone || email)) return;
  status.append(document.createTextNode(" Please contact us directly: "));
  const contacts = [];
  if (phone) contacts.push({ label: phone, href: `tel:+1${phone.replace(/\D/g, "")}` });
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

const resolveEndpoint = (raw) => {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
};

const preselectFromQuery = (formElement) => {
  const params = new URLSearchParams(window.location.search);
  const serviceSlug = params.get("service");
  const deliveryType = params.get("type");
  const serviceSelect = formElement.elements.serviceType;
  if (serviceSlug && serviceSelect) {
    const match = [...serviceSelect.options].find((option) => option.dataset.slug === serviceSlug);
    if (match) serviceSelect.value = match.value;
  }
  const typeSelect = formElement.elements.deliveryType;
  if (deliveryType && typeSelect && [...typeSelect.options].some((option) => option.value === deliveryType)) {
    typeSelect.value = deliveryType;
  }
};

document.querySelectorAll("form[data-form]").forEach((formElement) => {
  const formType = formElement.dataset.form;
  const schema = FORMS[formType];
  if (!schema) return;
  const submitButton = formElement.querySelector('button[type="submit"]');
  const idleButtonHTML = submitButton.innerHTML;
  let sending = false;

  if (formType === "serviceRequest") preselectFromQuery(formElement);

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Honeypot filled: silently discard without contacting the server.
    if (sending || formElement.elements.website.value) return;

    const values = readValues(formElement, schema);
    const errors = validateForm(schema, values, dynamicOptions(formElement, schema));
    showErrors(formElement, formType, schema, errors);
    if (Object.keys(errors).length) {
      setStatus(formElement, "Please correct the highlighted fields.", "error");
      focusFirstError(formElement, formType, schema, errors);
      return;
    }

    const endpoint = resolveEndpoint(formElement.dataset.endpoint.trim());
    if (!endpoint) {
      setStatus(formElement, "Online submissions are not available yet. Your information has not been sent.", "error", true);
      return;
    }

    const payload = buildPayload(formType, schema, values, window.location.pathname);
    let body;
    const headers = {};
    if (schema.multipart) {
      body = new FormData();
      Object.entries(payload).forEach(([key, value]) => body.append(key, value));
      const fileField = schema.fields.find((field) => field.type === "file");
      if (fileField && values[fileField.name]) body.append(fileField.name, values[fileField.name], values[fileField.name].name);
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    formElement.setAttribute("aria-busy", "true");
    setStatus(formElement, "Sending…", "pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint.href, {
        method: "POST",
        headers,
        body,
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Request rejected (${response.status})`);
      formElement.reset();
      showErrors(formElement, formType, schema, {});
      setStatus(formElement, schema.successMessage, "success");
    } catch {
      // A timeout can occur after the server accepted the request, so warn before retrying.
      setStatus(formElement, "We could not confirm that your submission was received. Your entries have been kept. You can try again, but for a time-sensitive request check with our team before resubmitting.", "error", true);
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      submitButton.innerHTML = idleButtonHTML;
      formElement.removeAttribute("aria-busy");
    }
  });
});
