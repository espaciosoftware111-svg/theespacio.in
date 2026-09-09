// Centralized Shared Data Source for ESPACIO Website

export const SITE_STATS = [
  {
    number: "25+",
    label: "Projects Completed",
    subtext: "Delivered with precision across Hyderabad"
  },
  {
    number: "100+",
    label: "Happy Clients",
    subtext: "Residential & commercial spaces transformed"
  },
  {
    number: "40+",
    label: "Years Legacy",
    subtext: "Rooted in construction & spatial engineering heritage"
  }
];

import { COMPANY_CTA_BG } from './companyAssets.js';

export const DEFAULT_CTA_BG = COMPANY_CTA_BG;

export const PAGE_CTAS = {
  HOME: {
    headline: "Engineering. Elegance.\nExperience.",
    subtext: "From concept to handover, we build luxury spaces with master craftsmanship and transparent pricing.",
    buttonText: "Book Consultation ↗",
    buttonHoverText: "Let's Connect ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  PROJECTS: {
    headline: "Have a Project Like\nThis in Mind?",
    subtext: "Whether you need full turnkey execution or bespoke interior design, let's build your dream space together.",
    buttonText: "Get A Formal Quote ↗",
    buttonHoverText: "Request BOQ ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  SERVICES: {
    headline: "Engineered First, Styled Second.",
    subtext: "Tailored interior solutions built to last generations. Contact our principal design team to discuss your scope.",
    buttonText: "Discuss Your Project ↗",
    buttonHoverText: "Let's Talk ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  SPACES: {
    headline: "Sculpt Your Sanctuary\nWith ESPACIO.",
    subtext: "Explore how our space planning specialists can optimize every square foot of your home or commercial suite.",
    buttonText: "Start Space Planning ↗",
    buttonHoverText: "Book Consultation ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  MATERIALS: {
    headline: "Touch, Feel & Select\nPremium Materials.",
    subtext: "Visit our Aziznagar Experience Studio to explore over 200+ live WPC, polygranite, and acrylic samples.",
    buttonText: "Schedule Studio Visit ↗",
    buttonHoverText: "Explore Samples ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  FAQS: {
    headline: "Still Have Questions\nAbout Your Project?",
    subtext: "Our design engineers are here to provide clear answers and guide your spatial decisions.",
    buttonText: "Ask Our Team ↗",
    buttonHoverText: "Get Answers ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  ABOUT: {
    headline: "Craftsmanship That\nDefies Time.",
    subtext: "Learn how our architectural heritage and precision engineering create spaces that stand out.",
    buttonText: "Talk To Our Directors ↗",
    buttonHoverText: "Meet The Team ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  },
  CONTACT: {
    headline: "Ready to Transform\nYour Space?",
    subtext: "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.",
    buttonText: "Let's Talk ↗",
    buttonHoverText: "Get Free Quote ↗",
    path: "/contact",
    bgImage: DEFAULT_CTA_BG,
    opacity: 80,
    enabled: true
  }
};
