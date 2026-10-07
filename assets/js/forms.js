// FORM DEFINITIONS — single source of truth for every public form.
// The build script renders fields from these schemas, the browser validates with
// them, and the README documents the resulting webhook payloads. Keep this module
// free of DOM access so it can be imported by Node (build + tests) and the browser.

export const DELIVERY_TYPES = ["Scheduled", "Recurring", "Same-Day", "STAT"];
export const CONTACT_METHODS = ["Email", "Phone", "Either"];

export const RESUME_RULES = Object.freeze({
  maxBytes: 5 * 1024 * 1024,
  extensions: [".pdf", ".doc", ".docx"],
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
});

/*
 * Field options:
 *   type      text | email | tel | date | number | select | textarea | checkboxes | file
 *   required  boolean
 *   max       maximum string length (or max number for type "number")
 *   options   fixed option list; "services" means the select is filled from site content
 *   full      span both grid columns
 */
export const FORMS = Object.freeze({
  serviceRequest: {
    id: "service-request-form",
    submitLabel: "Send service request",
    successMessage: "Thank you. Your service request was received. Our team will follow up to confirm details — your delivery is not booked until we confirm it with you.",
    requireEmailOrPhone: true,
    fields: [
      { name: "companyName", label: "Company name", type: "text", max: 200, autocomplete: "organization" },
      { name: "contactName", label: "Contact name", type: "text", required: true, max: 150, autocomplete: "name" },
      { name: "email", label: "Email", type: "email", max: 254, autocomplete: "email", hint: "Email or phone is required." },
      { name: "phone", label: "Phone", type: "tel", max: 50, autocomplete: "tel" },
      { name: "pickupAddress", label: "Pickup address", type: "text", max: 300, full: true },
      { name: "deliveryAddress", label: "Delivery address", type: "text", max: 300, full: true },
      { name: "serviceType", label: "Service type", type: "select", required: true, options: "services" },
      { name: "deliveryType", label: "Scheduled / recurring / same-day / STAT", type: "select", required: true, options: DELIVERY_TYPES },
      { name: "estimatedDeliveries", label: "Estimated number of deliveries", type: "text", max: 100, hint: "For example: 1, 5 per week, 20 per day." },
      { name: "requestedStartDate", label: "Requested start date", type: "date" },
      { name: "notes", label: "Description / notes", type: "textarea", required: true, max: 3000, full: true, hint: "Timing, handling, or temperature requirements. Do not include patient information." },
      { name: "preferredContactMethod", label: "Preferred contact method", type: "select", options: CONTACT_METHODS }
    ]
  },
  contact: {
    id: "contact-form",
    submitLabel: "Send message",
    successMessage: "Thank you. Your message was received and our team will follow up.",
    requireEmailOrPhone: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 150, autocomplete: "name" },
      { name: "companyName", label: "Company / organization", type: "text", max: 200, autocomplete: "organization" },
      { name: "email", label: "Email", type: "email", max: 254, autocomplete: "email", hint: "Email or phone is required." },
      { name: "phone", label: "Phone", type: "tel", max: 50, autocomplete: "tel" },
      { name: "inquiryType", label: "Inquiry type", type: "select", required: true, options: ["General question", "Business inquiry / partnership", "Existing service", "Other"], full: true },
      { name: "message", label: "Message", type: "textarea", required: true, max: 3000, full: true, hint: "Do not include patient information." }
    ]
  },
  courierApplication: {
    id: "courier-application-form",
    submitLabel: "Submit application",
    successMessage: "Thank you. Your application was received. Our team reviews every application and will contact you if there is a fit.",
    multipart: true,
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, max: 150, autocomplete: "name" },
      { name: "email", label: "Email", type: "email", required: true, max: 254, autocomplete: "email" },
      { name: "phone", label: "Phone", type: "tel", required: true, max: 50, autocomplete: "tel" },
      { name: "city", label: "City", type: "text", required: true, max: 100, autocomplete: "address-level2" },
      { name: "driversLicenseStatus", label: "Driver's license status", type: "select", required: true, options: ["Valid driver's license", "License with restrictions", "No valid driver's license"] },
      { name: "hasVehicle", label: "Do you have a reliable vehicle?", type: "select", required: true, options: ["Yes", "No"] },
      { name: "vehicleYear", label: "Vehicle year", type: "number", min: 1980, max: 2100 },
      { name: "vehicleMakeModel", label: "Vehicle make / model", type: "text", max: 120 },
      { name: "insuranceStatus", label: "Auto insurance status", type: "select", required: true, options: ["Currently insured", "Not currently insured"] },
      { name: "workInterest", label: "Interested in", type: "select", required: true, options: ["Employee", "Independent contractor", "Either"] },
      { name: "availability", label: "Availability", type: "checkboxes", required: true, options: ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends", "On-call / STAT"], full: true },
      { name: "experience", label: "Relevant courier or delivery experience", type: "textarea", max: 3000, full: true },
      { name: "resume", label: "Resume (optional)", type: "file", full: true, hint: "PDF, DOC, or DOCX up to 5 MB." },
      { name: "notes", label: "Additional notes", type: "textarea", max: 3000, full: true }
    ]
  }
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fileExtension = (filename) => {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
};

export function validateResume(file) {
  if (!file) return "";
  if (!RESUME_RULES.extensions.includes(fileExtension(file.name || ""))) return "Upload a PDF, DOC, or DOCX file.";
  // Some browsers report an empty MIME type for .doc/.docx; the extension check above still applies.
  if (file.type && !RESUME_RULES.mimeTypes.includes(file.type)) return "Upload a PDF, DOC, or DOCX file.";
  if (file.size > RESUME_RULES.maxBytes) return "Resume must be 5 MB or smaller.";
  if (file.size === 0) return "The selected file is empty.";
  return "";
}

/**
 * Validates submitted values against a form schema.
 * @param {object} form       one of FORMS
 * @param {object} values     field name → trimmed string (checkboxes: string[]; file: File|null)
 * @param {object} optionSets field name → allowed values for selects whose options are dynamic
 * @returns {object} field name → error message (empty object when valid)
 */
export function validateForm(form, values, optionSets = {}) {
  const errors = {};
  for (const field of form.fields) {
    const value = values[field.name];
    if (field.type === "checkboxes") {
      const selected = Array.isArray(value) ? value : [];
      if (field.required && selected.length === 0) errors[field.name] = `Select at least one ${field.label.toLowerCase()} option.`;
      else if (selected.some((item) => !field.options.includes(item))) errors[field.name] = "Select from the listed options.";
      continue;
    }
    if (field.type === "file") {
      const message = validateResume(value || null);
      if (message) errors[field.name] = message;
      continue;
    }
    const text = typeof value === "string" ? value : "";
    if (!text) {
      if (field.required) errors[field.name] = field.type === "select" ? `Select ${field.label.toLowerCase()}.` : `Enter ${field.label.toLowerCase()}.`;
      continue;
    }
    if (field.type === "number") {
      const number = Number(text);
      if (!Number.isInteger(number) || number < field.min || number > field.max) errors[field.name] = `Enter a year between ${field.min} and ${field.max}.`;
      continue;
    }
    if (field.max && text.length > field.max) {
      errors[field.name] = `Use ${field.max} characters or fewer.`;
      continue;
    }
    if (field.type === "email" && !EMAIL_PATTERN.test(text)) errors[field.name] = "Enter a valid email address.";
    if (field.type === "tel" && (text.match(/\d/g) || []).length < 7) errors[field.name] = "Enter a phone number with area code.";
    if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(text)) errors[field.name] = "Enter a valid date.";
    if (field.type === "select") {
      const allowed = Array.isArray(field.options) ? field.options : optionSets[field.name] || [];
      if (!allowed.includes(text)) errors[field.name] = "Select from the listed options.";
    }
  }

  if (form.requireEmailOrPhone && !values.email && !values.phone) {
    errors.email ||= "Provide an email address or phone number.";
    errors.phone ||= "Provide a phone number or email address.";
  }
  if (values.preferredContactMethod === "Email" && !values.email) errors.email ||= "Enter an email address, or choose another contact method.";
  if (values.preferredContactMethod === "Phone" && !values.phone) errors.phone ||= "Enter a phone number, or choose another contact method.";
  return errors;
}

/**
 * Builds the JSON payload sent to the webhook. Every schema field is always present
 * as a string ("" when empty; checkbox groups are joined with ", "). Files are sent
 * separately as multipart parts and are never included here.
 */
export function buildPayload(formType, form, values, pagePath) {
  const payload = { formType, sourcePage: pagePath };
  for (const field of form.fields) {
    if (field.type === "file") continue;
    const value = values[field.name];
    payload[field.name] = Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "";
  }
  return payload;
}
