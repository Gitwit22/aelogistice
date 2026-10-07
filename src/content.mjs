// SITE CONTENT & BUSINESS CONFIGURATION — edit business details and page content here,
// then run `npm run build`. Only publish verified information: do not add certifications,
// licenses, insurance levels, regulatory compliance claims, pricing, or biographical
// details that the business has not explicitly approved. Empty optional values are hidden.

export const BUSINESS = Object.freeze({
  name: "AE Logistics",
  legalName: "AE Logistics, LLC",
  brandName: "All Encompass Logistics",
  siteUrl: "https://aelogistics.nxtlvlts.com",
  phone: "313-880-9792",
  email: "aelogisticsdet@gmail.com",
  serviceArea: "Detroit and Metro Detroit, Michigan",
  // Free-form display text, e.g. "Monday–Friday, 7 a.m.–6 p.m." Empty = hidden.
  hours: "",
  tagline: "Delivering Solutions. Moving Possibilities.",
  logoTagline: "Delivering What Matters."
});

// Public HTTPS webhook URLs (for example n8n) that receive form submissions.
// These URLs are visible to visitors — never embed credentials. Each origin must also be
// added to connect-src in _headers. An empty URL keeps the form from submitting and shows
// the phone/email fallback instead of a false success message.
export const FORM_ENDPOINTS = Object.freeze({
  serviceRequest: "",
  contact: "",
  courierApplication: ""
});

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Industries", href: "/industries/" },
  { label: "About Us", href: "/about/" },
  { label: "Safety & Compliance", href: "/safety-compliance/" },
  { label: "Become a Courier", href: "/become-a-courier/" },
  { label: "Contact", href: "/contact/" }
];

export const SERVICES = [
  {
    slug: "medical-courier",
    name: "Medical Courier Services",
    summary: "Reliable, time-sensitive movement of medical materials for healthcare organizations.",
    description: "Secure transportation designed for healthcare organizations that need dependable, time-sensitive movement of medical materials between locations.",
    points: ["Medical offices and clinics", "Laboratories and diagnostic facilities", "Dental offices", "Pharmacies", "Healthcare facilities"],
    pointsLabel: "Who we support"
  },
  {
    slug: "specimen-transportation",
    name: "Specimen Transportation",
    summary: "Professional pickup and delivery of specimens between facilities and laboratories.",
    description: "Professional pickup and delivery workflows for specimens traveling between medical facilities and laboratories, handled according to the instructions your team provides.",
    points: ["Clinic-to-lab and facility-to-lab runs", "Documented pickup and delivery handoffs", "Handling and temperature instructions followed as provided", "Scheduled or on-demand pickups"],
    pointsLabel: "What to expect"
  },
  {
    slug: "stat-on-demand",
    name: "STAT / On-Demand Delivery",
    summary: "Priority pickup and direct delivery when a shipment can't wait.",
    description: "Priority courier service for shipments that require rapid pickup and direct delivery — no unnecessary stops along the way.",
    points: ["Rapid dispatch", "Direct transportation", "Priority handling", "Status updates from pickup to delivery", "Delivery confirmation"],
    pointsLabel: "Highlights"
  },
  {
    slug: "scheduled-routes",
    name: "Scheduled Routes",
    summary: "Recurring pickups and deliveries your team can plan around.",
    description: "Recurring transportation for organizations that need predictable pickups and deliveries on a consistent schedule.",
    points: ["Daily routes", "Weekly routes", "Multi-stop routes", "Clinic-to-lab routes", "Dedicated business routes"],
    pointsLabel: "Route options",
    cta: { label: "Request a Route Quote", deliveryType: "Recurring" }
  },
  {
    slug: "same-day-business",
    name: "Same-Day Business Delivery",
    summary: "Dependable point-to-point delivery across Metro Detroit, same day.",
    description: "Local same-day transportation for Metro Detroit businesses that need dependable point-to-point delivery.",
    points: ["Documents", "Supplies", "Business materials", "Small packages", "Time-sensitive items"],
    pointsLabel: "Suitable for",
    cta: { label: "Request Same-Day Delivery", deliveryType: "Same-Day" }
  },
  {
    slug: "dedicated-courier",
    name: "Dedicated Courier Solutions",
    summary: "Courier capacity built around your organization's operations.",
    description: "Custom transportation arrangements for businesses that need recurring or dedicated courier capacity. We develop delivery workflows around your operational requirements — pickup windows, handoff procedures, and communication preferences.",
    points: ["Recurring or dedicated capacity", "Workflows designed around your operations", "A consistent point of contact", "Flexible scheduling as your needs change"],
    pointsLabel: "How it works for you"
  }
];

// Shown in the request form after the services above.
export const OTHER_SERVICE_OPTION = "Other / not sure";

export const CAPABILITIES = [
  { icon: "/assets/img/icon-lab.png", label: "Lab & specimen courier" },
  { icon: "/assets/img/icon-medical.png", label: "Medical supplies & equipment" },
  { icon: "/assets/img/icon-pharmacy.png", label: "Pharmacy delivery" },
  { icon: "/assets/img/icon-package.png", label: "Local & STAT deliveries" }
];

export const WHY_CHOOSE_US = [
  { title: "Reliable", description: "Accountability from pickup through delivery." },
  { title: "Secure", description: "Careful handling and documented transportation workflows." },
  { title: "Responsive", description: "Direct communication when you need assistance." },
  { title: "Flexible", description: "Scheduled, recurring, same-day, and priority delivery options." },
  { title: "Local", description: "A Detroit-based company serving Metro Detroit." },
  { title: "Technology enabled", description: "We are developing our own operational technology for dispatching, barcode tracking, delivery confirmation, and chain-of-custody management." }
];

export const INDUSTRIES = [
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Dependable transport between care locations.",
    description: "Healthcare organizations depend on materials arriving where they are needed, when they are needed. AE Logistics supports care teams with scheduled and on-demand transportation between facilities, following the handling instructions your organization provides."
  },
  {
    slug: "laboratories",
    name: "Laboratories",
    summary: "Specimen pickups and lab routes on your schedule.",
    description: "We support laboratories with specimen pickups from client locations, recurring clinic-to-lab routes, and priority runs — with documented handoffs at pickup and delivery."
  },
  {
    slug: "medical-dental-offices",
    name: "Medical & Dental Offices",
    summary: "Reliable runs that keep your office on schedule.",
    description: "Medical and dental offices can rely on AE Logistics for specimen runs, supply deliveries, and transfers between locations, so staff can stay focused on patients."
  },
  {
    slug: "pharmacies",
    name: "Pharmacies",
    summary: "Local delivery support for pharmacy operations.",
    description: "We provide local delivery support for pharmacies, including transfers between locations and deliveries to the facilities they serve. Tell us about your handling requirements and we will review them with you before service begins."
  },
  {
    slug: "professional-businesses",
    name: "Professional Businesses",
    summary: "Same-day delivery of documents and business materials.",
    description: "Law firms, offices, and professional services teams use same-day courier service for documents, supplies, and time-sensitive business materials across Metro Detroit."
  },
  {
    slug: "scheduled-transportation",
    name: "Organizations Requiring Scheduled Transportation",
    summary: "Predictable recurring routes, built around you.",
    description: "Any organization that moves items on a regular schedule can benefit from a dedicated or recurring route. We work with you to set pickup windows, stops, and communication that fit your operation."
  }
];

export const HOW_IT_WORKS = [
  { title: "Request service", description: "Submit your delivery information online or call our team." },
  { title: "Dispatch", description: "AE Logistics creates and assigns your delivery." },
  { title: "Pickup", description: "Your courier verifies and accepts the shipment." },
  { title: "Transport", description: "Your shipment moves through the AE Logistics delivery workflow." },
  { title: "Delivery", description: "The recipient accepts the shipment and the delivery is documented." }
];

// Only add owner details the owners have approved. Leave photo/linkedin empty to hide them.
export const OWNERS = [
  {
    name: "John Steele",
    title: "Co-Owner / Managing Member",
    photo: "",
    linkedin: "",
    bio: "John Steele is a co-owner and managing member of AE Logistics. John helps lead the company's operations, with a focus on building the systems and technology that keep AE Logistics organized, accountable, and ready to grow.",
    focus: ["Operations", "Technology & systems", "Business development", "Company growth"]
  },
  {
    name: "Lavarr Hall",
    title: "Co-Owner / Managing Member",
    photo: "",
    linkedin: "",
    bio: "Lavarr Hall is a co-owner and managing member of AE Logistics. Lavarr helps lead day-to-day operations and transportation and works directly with customers to make sure every delivery meets their expectations.",
    focus: ["Operations", "Transportation", "Customer relationships", "Business development"]
  }
];

// Only publish real, approved customer testimonials. The section is hidden while empty.
// Shape: { quote: "", name: "", organization: "" }
export const TESTIMONIALS = [];

export const COURIER_EXPECTATIONS = [
  { title: "Professionalism", description: "Represent AE Logistics with courtesy and a professional appearance at every stop." },
  { title: "Reliability", description: "Show up on time, prepared, and ready to complete assigned routes." },
  { title: "Communication", description: "Keep dispatch informed and respond promptly to updates and changes." },
  { title: "Safe transportation", description: "Drive safely and secure shipments properly while in transit." },
  { title: "Timeliness", description: "Respect pickup windows and delivery deadlines." },
  { title: "Customer service", description: "Treat every customer, facility, and recipient with respect." },
  { title: "Following procedures", description: "Follow AE Logistics handling, handoff, and documentation procedures every time." }
];
