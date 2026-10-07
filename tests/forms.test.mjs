import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMS, validateForm, buildPayload, validateResume, RESUME_RULES } from "../assets/js/forms.js";

const SERVICES = ["Medical Courier Services", "Other / not sure"];

const validServiceRequest = () => ({
  companyName: "Example Lab",
  contactName: "Pat Example",
  email: "pat@example.com",
  phone: "",
  pickupAddress: "",
  deliveryAddress: "",
  serviceType: "Medical Courier Services",
  deliveryType: "STAT",
  estimatedDeliveries: "",
  requestedStartDate: "",
  notes: "Need a pickup.",
  preferredContactMethod: ""
});

test("valid service request passes", () => {
  assert.deepEqual(validateForm(FORMS.serviceRequest, validServiceRequest(), { serviceType: SERVICES }), {});
});

test("service request requires email or phone", () => {
  const values = { ...validServiceRequest(), email: "" };
  const errors = validateForm(FORMS.serviceRequest, values, { serviceType: SERVICES });
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.deepEqual(validateForm(FORMS.serviceRequest, { ...values, phone: "313-555-0100" }, { serviceType: SERVICES }), {});
});

test("preferred contact method must have matching contact detail", () => {
  const errors = validateForm(FORMS.serviceRequest, { ...validServiceRequest(), preferredContactMethod: "Phone" }, { serviceType: SERVICES });
  assert.ok(errors.phone);
});

test("required fields, invalid email, short phone, and unknown options are rejected", () => {
  const errors = validateForm(FORMS.serviceRequest, { ...validServiceRequest(), contactName: "", email: "nope", phone: "12", serviceType: "Teleportation", deliveryType: "Yesterday", notes: "" }, { serviceType: SERVICES });
  for (const key of ["contactName", "email", "phone", "serviceType", "deliveryType", "notes"]) assert.ok(errors[key], key);
});

test("dynamic select with no option set rejects any value", () => {
  const errors = validateForm(FORMS.serviceRequest, validServiceRequest());
  assert.ok(errors.serviceType);
});

test("max length is enforced", () => {
  const errors = validateForm(FORMS.serviceRequest, { ...validServiceRequest(), notes: "x".repeat(3001) }, { serviceType: SERVICES });
  assert.match(errors.notes, /3000/);
});

test("courier application requires availability and validates vehicle year", () => {
  const values = {
    name: "Sam Driver", email: "sam@example.com", phone: "313-555-0101", city: "Detroit",
    driversLicenseStatus: "Valid driver's license", hasVehicle: "Yes", vehicleYear: "1850", vehicleMakeModel: "",
    insuranceStatus: "Currently insured", workInterest: "Either", availability: [], experience: "", resume: null, notes: ""
  };
  const errors = validateForm(FORMS.courierApplication, values);
  assert.ok(errors.availability);
  assert.ok(errors.vehicleYear);
  assert.deepEqual(validateForm(FORMS.courierApplication, { ...values, availability: ["Weekends"], vehicleYear: "2019" }), {});
  assert.ok(validateForm(FORMS.courierApplication, { ...values, availability: ["Never"], vehicleYear: "2019" }).availability);
});

test("resume validation checks extension, MIME type, size, and empty files", () => {
  assert.equal(validateResume(null), "");
  assert.equal(validateResume({ name: "cv.pdf", type: "application/pdf", size: 1000 }), "");
  assert.equal(validateResume({ name: "cv.docx", type: "", size: 1000 }), "");
  assert.ok(validateResume({ name: "cv.exe", type: "application/pdf", size: 1000 }));
  assert.ok(validateResume({ name: "cv.pdf", type: "text/html", size: 1000 }));
  assert.ok(validateResume({ name: "cv.pdf", type: "application/pdf", size: RESUME_RULES.maxBytes + 1 }));
  assert.ok(validateResume({ name: "cv.pdf", type: "application/pdf", size: 0 }));
});

test("payload always includes every non-file field as a string", () => {
  const payload = buildPayload("courierApplication", FORMS.courierApplication, { name: "Sam", availability: ["Weekends", "On-call / STAT"], resume: { name: "cv.pdf" } }, "/become-a-courier/");
  assert.equal(payload.formType, "courierApplication");
  assert.equal(payload.sourcePage, "/become-a-courier/");
  assert.equal(payload.availability, "Weekends, On-call / STAT");
  assert.equal("resume" in payload, false);
  for (const field of FORMS.courierApplication.fields.filter((f) => f.type !== "file")) {
    assert.equal(typeof payload[field.name], "string", field.name);
  }
});

test("every form schema has unique field names and no reserved names", () => {
  for (const [type, form] of Object.entries(FORMS)) {
    const names = form.fields.map((field) => field.name);
    assert.equal(new Set(names).size, names.length, type);
    for (const reserved of ["website", "formType", "sourcePage"]) assert.ok(!names.includes(reserved), `${type}: ${reserved}`);
  }
});
