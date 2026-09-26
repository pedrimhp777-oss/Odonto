window.SITE_CONFIG = {
  meta: {
    siteUrl: "",
    title: "Nome da Clínica — Odontologia com cuidado, precisão e proximidade",
    description: "Clínica odontológica — cuidado, precisão e proximidade. Apresente tratamentos e facilite o agendamento.",
    themeColor: "#12343b",
    ogImage: "assets/og-image.png"
  },

  theme: {
    preset: "dental"
  },

  layout: {
    header: true,
    order: [
      "hero",
      "services",
      "about",
      "benefits",
      "process",
      "stats",
      "testimonials",
      "faq",
      "cta"
    ],
    hero: true,
    logoStrip: false,
    about: true,
    services: true,
    benefits: true,
    process: true,
    stats: true,
    testimonials: true,
    faq: true,
    cta: true
  },

  features: {
    reveal: true,
    counters: true,
    magneticButtons: false,
    tiltCards: false,
    cursorGlow: false,
    marquee: false,
    headerBlur: true,
    backgroundGrid: false,
    backgroundGlow: true,
    noise: false,
    smoothScroll: true,
    activeNav: true
  },

  behavior: {
    respectReducedMotion: true,
    closeMobileMenuOnNavigation: true
  },

  contact: {
    whatsapp: "",
    phone: "",
    email: "",
    address: ""
  },

  integrations: {
    analytics: false
  }
};
