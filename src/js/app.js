(() => {
  "use strict";

  const CONFIG = window.SITE_CONFIG || {};
  const CONTENT = window.SITE_CONTENT || {};
  const reducedMotion =
    CONFIG.behavior?.respectReducedMotion !== false &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));
  }

  function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function link(href, label, cls = "") {
    if (!hasText(href) || !hasText(label)) return "";
    return `<a class="${esc(cls)}" href="${esc(href)}">${esc(label)}</a>`;
  }

  function enabled(name) {
    return CONFIG.layout?.[name] !== false;
  }

  function whatsappUrl(value) {
    if (!hasText(value)) return "";
    const raw = value.trim();
    if (/^https:\/\/wa\.me\/[0-9]+(?:\?.*)?$/i.test(raw)) return raw;
    const digits = raw.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }

  function dentalIcon(name) {
    const icons = {
      aesthetics: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 7.2c0-1.9 1.5-3.4 3.4-3.4 1.2 0 2 .6 3.4.6s2.2-.6 3.4-.6c1.9 0 3.4 1.5 3.4 3.4 0 1.4-.7 2.2-1.3 3.1-.8 1.1-1.1 2.5-1.4 4.3-.4 2.5-.9 5-2.3 5-.9 0-1.4-1.1-1.8-2.2-.4-1.1-.7-2.1-1.5-2.1s-1.1 1-1.5 2.1c-.4 1.1-.9 2.2-1.8 2.2-1.4 0-1.9-2.5-2.3-5-.3-1.8-.6-3.2-1.4-4.3-.6-.9-1.3-1.7-1.3-3.1Z" fill="currentColor" opacity=".18"/><path d="M8.5 8.2h7M10 11.1h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
      implant: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 4.2h5.6l-1 4.1H10.2l-1-4.1Z" fill="currentColor" opacity=".16"/><path d="M9.6 4.2h4.8M10.4 8.3l-.8 11.5M13.6 8.3l.8 11.5M9.6 11.2h4.8M9.4 14.2h5.2M9.2 17.2h5.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      orthodontics: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.4c3.4-2 12.6-2 16 0M5.2 10.1c3 1.5 10.6 1.5 13.6 0M6.1 15.2c3.2 1 8.6 1 11.8 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="10.6" r="1.3" fill="currentColor"/><circle cx="12" cy="11.1" r="1.3" fill="currentColor"/><circle cx="16" cy="10.6" r="1.3" fill="currentColor"/></svg>`,
      prevention: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="currentColor" opacity=".12"/><path d="M7.8 12.2 10.4 15l5.9-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      pediatric: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 10.3c0-3.1 2.9-5.3 6.9-5.3s6.9 2.2 6.9 5.3c0 3.5-2.9 7.7-6.9 7.7s-6.9-4.2-6.9-7.7Z" fill="currentColor" opacity=".12"/><circle cx="9.3" cy="11" r=".9" fill="currentColor"/><circle cx="14.7" cy="11" r=".9" fill="currentColor"/><path d="M9.7 14.2c1.5 1 3.1 1 4.6 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      smile: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9.8c1.8 5 4.1 7.5 7 7.5s5.2-2.5 7-7.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 8.5c1.5 1 3.1 1.5 5 1.5s3.5-.5 5-1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`
    };
    return icons[name] || icons.smile;
  }

  function updateSocialMeta() {
    const meta = CONFIG.meta || {};
    const title = meta.title || CONTENT.brand?.name || "";
    const description = meta.description || "";
    const image = meta.ogImage || "assets/og-image.png";
    const siteUrl = meta.siteUrl || "";
    const absoluteImage = siteUrl && !/^https?:\/\//i.test(image)
      ? new URL(image, siteUrl.endsWith("/") ? siteUrl : siteUrl + "/").href
      : image;
    document.title = title;

    const set = (selector, value) => {
      const el = $(selector);
      if (el && hasText(value)) el.setAttribute("content", value);
    };
    set('meta[name="description"]', description);
    set('meta[name="theme-color"]', meta.themeColor || "#0b0c10");
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', description);
    set('meta[property="og:image"]', absoluteImage);
    set('meta[property="og:image:alt"]', title);
    set('meta[property="og:url"]', siteUrl);
    set('meta[name="twitter:title"]', title);
    set('meta[name="twitter:description"]', description);
    set('meta[name="twitter:image"]', image);
  }

  document.documentElement.classList.toggle("smooth-scroll", !!CONFIG.features?.smoothScroll && !reducedMotion);
  document.body.classList.toggle("has-grid", !!CONFIG.features?.backgroundGrid);
  document.body.classList.toggle("has-bg-glow", !!CONFIG.features?.backgroundGlow);
  document.body.classList.toggle("has-noise", !!CONFIG.features?.noise);
  document.body.classList.toggle("has-header-blur", !!CONFIG.features?.headerBlur);
  document.body.classList.toggle("has-marquee", !!CONFIG.features?.marquee && !reducedMotion);

  function renderHeader() {
    $$("[data-brand]").forEach(el => {
      el.textContent = CONTENT.brand?.shortName || CONTENT.brand?.name || "MARCA";
    });

    const nav = $(".nav");
    if (!nav || CONFIG.layout?.header === false) return;

    const items = (CONTENT.nav || []).filter(item => hasText(item?.href) && hasText(item?.label));
    const wa = whatsappUrl(CONFIG.contact?.whatsapp);
    nav.innerHTML = items.map(item => link(item.href, item.label)).join("") +
      (wa ? `<a class="button button--small" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">Falar conosco</a>` : "");
  }

  function section(id, html, classes = "") {
    if (!hasText(html)) return "";
    return `<section id="${esc(id)}" class="section ${esc(classes)}">${html}</section>`;
  }

  const renderers = {
    hero() {
      const h = CONTENT.hero || {};
      if (!hasText(h.title) && !hasText(h.description)) return "";
      const title = esc(h.title || "");
      const highlight = esc(h.highlight || "");
      const renderedTitle = highlight && title.includes(highlight)
        ? title.replace(highlight, `<span class="gradient-text">${highlight}</span>`)
        : title;
      const trust = (CONTENT.stats || []).filter(Boolean).slice(0, 3);

      return section("inicio", `
        <div class="container hero-grid">
          <div class="reveal">
            ${hasText(h.eyebrow) ? `<p class="eyebrow">${esc(h.eyebrow)}</p>` : ""}
            ${title ? `<h1>${renderedTitle}</h1>` : ""}
            ${hasText(h.description) ? `<p class="hero-description">${esc(h.description)}</p>` : ""}
            <div class="hero-actions">
              ${h.primaryCta ? link(h.primaryCta.href, h.primaryCta.label, "button magnetic") : ""}
              ${h.secondaryCta ? link(h.secondaryCta.href, h.secondaryCta.label, "button button--ghost") : ""}
            </div>
            ${trust.length ? `<div class="hero-trust">${trust.map(s => `
              <div class="trust-item">
                <strong>${esc(s.value)}${esc(s.suffix || "")}</strong>
                <span>${esc(s.label)}</span>
              </div>`).join("")}</div>` : ""}
          </div>
          <div class="hero-visual reveal">
            <figure class="dental-stage" data-tilt>
              <img class="hero-photo" src="assets/hero-dental.jpg" alt="Paciente sorrindo durante um atendimento odontológico">
            </figure>
          </div>
        </div>`, "hero");
    },

    logoStrip() {
      const items = (CONTENT.logoStrip?.items || []).filter(hasText);
      if (!CONFIG.features?.marquee || !items.length) return "";
      const repeated = [...items, ...items];
      return `<div class="marquee"><div class="marquee-track">${repeated.map((x, i) =>
        `<span>${esc(x)}</span>${i < repeated.length - 1 ? "<i>✦</i>" : ""}`).join("")}</div></div>`;
    },

    about() {
      const a = CONTENT.about || {};
      const paragraphs = (a.paragraphs || []).filter(hasText);
      if (!hasText(a.title) && !paragraphs.length) return "";
      return section("sobre", `
        <div class="container split">
          <div class="reveal">${hasText(a.eyebrow) ? `<p class="eyebrow">${esc(a.eyebrow)}</p>` : ""}<h2>${esc(a.title || "")}</h2></div>
          <div class="split-copy reveal">${paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        </div>`);
    },

    services() {
      const s = CONTENT.services || {};
      const items = (s.items || []).filter(item => hasText(item?.title) || hasText(item?.text));
      if (!items.length) return "";
      return section("servicos", `
        <div class="container">
          <div class="section-heading reveal">${hasText(s.eyebrow) ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ""}<h2>${esc(s.title || "")}</h2></div>
          <div class="cards">${items.map((item, i) => `
            <article class="card reveal" data-tilt>
              ${hasText(item.icon) ? `<div class="card-icon">${dentalIcon(item.icon)}</div>` : ""}
              <h3>${esc(item.title || "")}</h3>
              <p>${esc(item.text || "")}</p>
              ${hasText(item.href) ? link(item.href, item.linkLabel || "Saiba mais →", "card-link") : ""}
            </article>`).join("")}</div>
        </div>`, "section--surface");
    },

    benefits() {
      const b = CONTENT.benefits || {};
      const items = (b.items || []).filter(hasText);
      if (!items.length) return "";
      return section("diferenciais", `
        <div class="container benefits-grid">
          <div class="reveal">${hasText(b.eyebrow) ? `<p class="eyebrow">${esc(b.eyebrow)}</p>` : ""}<h2>${esc(b.title || "")}</h2></div>
          <ul class="check-list reveal">${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>`);
    },

    process() {
      const p = CONTENT.process || {};
      const items = (p.items || []).filter(item => hasText(item?.title) || hasText(item?.text));
      if (!items.length) return "";
      return section("processo", `
        <div class="container">
          <div class="section-heading reveal">${hasText(p.eyebrow) ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : ""}<h2>${esc(p.title || "")}</h2></div>
          <div class="steps">${items.map((item, i) =>
            `<article class="step reveal"><h3>${esc(item.title || "")}</h3><p>${esc(item.text || "")}</p></article>`).join("")}</div>
        </div>`, "section--surface");
    },

    stats() {
      const items = (CONTENT.stats || []).filter(item => item && (item.value !== "" && item.value !== null && item.value !== undefined) && hasText(item.label));
      if (!items.length) return "";
      return section("numeros", `
        <div class="container stats">${items.map(item => {
          const numeric = Number(item.value);
          const isNumeric = Number.isFinite(numeric);
          return `<div class="stat reveal">
            <strong class="stat-value${isNumeric ? " counter" : ""}"${isNumeric ? ` data-target="${numeric}"` : ""} data-suffix="${esc(item.suffix || "")}">${isNumeric ? "0" : esc(item.value)}</strong>
            <span class="stat-label">${esc(item.label)}</span>
          </div>`;
        }).join("")}</div>`);
    },

    testimonials() {
      const t = (CONTENT.testimonials || []).find(item => hasText(item?.quote) && hasText(item?.author));
      if (!t) return "";
      return section("depoimentos", `
        <div class="container quote reveal">
          <span class="quote-mark">“</span>
          <blockquote>${esc(t.quote)}</blockquote>
          <cite>${esc(t.author)}${hasText(t.company) ? " • " + esc(t.company) : ""}</cite>
        </div>`, "quote-section");
    },

    faq() {
      const f = (CONTENT.faq || []).filter(item => hasText(item?.question) && hasText(item?.answer));
      if (!f.length) return "";
      return section("faq", `
        <div class="container faq-grid">
          <div class="reveal">${hasText(CONTENT.faqTitle?.eyebrow) ? `<p class="eyebrow">${esc(CONTENT.faqTitle.eyebrow)}</p>` : ""}<h2>${esc(CONTENT.faqTitle?.title || "Perguntas frequentes.")}</h2></div>
          <div class="faq reveal">${f.map(x => `<details><summary>${esc(x.question)}</summary><p>${esc(x.answer)}</p></details>`).join("")}</div>
        </div>`);
    },

    cta() {
      const c = CONTENT.cta || {};
      const wa = whatsappUrl(CONFIG.contact?.whatsapp);
      const phone = CONFIG.contact?.phone;
      const email = CONFIG.contact?.email;
      const address = CONFIG.contact?.address;
      if (!hasText(c.title) && !wa && !phone && !email && !address) return "";

      return section("contato", `
        <div class="container cta-grid">
          <div class="reveal">
            ${hasText(c.eyebrow) ? `<p class="eyebrow">${esc(c.eyebrow)}</p>` : ""}
            <h2>${esc(c.title || "")}</h2>
            ${hasText(c.description) ? `<p>${esc(c.description)}</p>` : ""}
            ${hasText(address) ? `<address class="contact-address">${esc(address)}</address>` : ""}
          </div>
          <div class="contact-actions reveal">
            ${wa ? `<a class="button magnetic" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${esc(c.label || "Entrar em contato")} ↗</a>` : ""}
            ${hasText(phone) ? `<a class="button button--ghost" href="tel:${esc(phone)}">Ligar</a>` : ""}
            ${hasText(email) ? `<a class="text-link" href="mailto:${esc(email)}">${esc(email)}</a>` : ""}
          </div>
        </div>`, "cta");
    }
  };

  function renderMain() {
    const defaultOrder = ["hero","logoStrip","about","services","benefits","process","stats","testimonials","faq","cta"];
    const order = Array.isArray(CONFIG.layout?.order) && CONFIG.layout.order.length
      ? CONFIG.layout.order
      : defaultOrder;

    const parts = order
      .filter(name => renderers[name] && (name === "hero" || enabled(name)))
      .map(name => renderers[name]())
      .filter(Boolean);

    $("#main").innerHTML = parts.join("");
  }

  function renderFooter() {
    const description = $("[data-footer-description]");
    const address = $("[data-footer-address]");
    const copyright = $("[data-copyright]");
    const footerNav = $("[data-footer-nav]");
    if (description) description.textContent = CONTENT.footer?.description || "";
    if (address) {
      address.textContent = CONFIG.contact?.address || "";
      address.hidden = !hasText(CONFIG.contact?.address);
    }
    if (copyright) copyright.textContent = `© ${new Date().getFullYear()} ${CONTENT.brand?.name || "Marca"}. Todos os direitos reservados.`;
    if (footerNav) footerNav.innerHTML = (CONTENT.nav || []).filter(x => hasText(x?.href) && hasText(x?.label)).map(x => link(x.href, x.label)).join("");
  }

  function setupMenu() {
    const button = $(".menu-button");
    const nav = $(".nav");
    if (!button || !nav) return;
    button.hidden = CONFIG.layout?.header === false;

    button.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    if (CONFIG.behavior?.closeMobileMenuOnNavigation !== false) {
      nav.addEventListener("click", e => {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  function setupReveal() {
    const items = $$(".reveal");
    if (!CONFIG.features?.reveal || reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(x => x.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    items.forEach(x => io.observe(x));
  }

  function setupCounters() {
    const items = $$(".counter");
    const finish = el => {
      el.textContent = Number(el.dataset.target || 0).toLocaleString("pt-BR") + (el.dataset.suffix || "");
    };
    if (!CONFIG.features?.counters || reducedMotion) {
      items.forEach(finish);
      return;
    }
    const animate = el => {
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const duration = 1400;
      const frame = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased).toLocaleString("pt-BR") + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    if (!("IntersectionObserver" in window)) {
      items.forEach(finish);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    items.forEach(x => io.observe(x));
  }

  function setupTilt() {
    if (!CONFIG.features?.tiltCards || reducedMotion || !matchMedia("(pointer:fine)").matches) return;
    $$(".card[data-tilt], .dental-stage[data-tilt]").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-3px)`;
      });
      el.addEventListener("pointerleave", () => el.style.transform = "");
    });
  }

  function setupMagnetic() {
    if (!CONFIG.features?.magneticButtons || reducedMotion || !matchMedia("(pointer:fine)").matches) return;
    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x*.16}px,${y*.16}px)`;
      });
      el.addEventListener("pointerleave", () => el.style.transform = "");
    });
  }

  function setupCursor() {
    if (!CONFIG.features?.cursorGlow || reducedMotion || !matchMedia("(pointer:fine)").matches) return;
    const el = document.createElement("div");
    el.className = "cursor-glow";
    document.body.appendChild(el);
    window.addEventListener("pointermove", e => {
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    }, { passive: true });
  }

  function setupActiveNav() {
    if (!CONFIG.features?.activeNav || !("IntersectionObserver" in window)) return;
    const links = $$(".nav a[href^='#']");
    const sections = links.map(x => $(x.getAttribute("href"))).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(x => x.classList.toggle("is-active", x.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(x => io.observe(x));
  }

  updateSocialMeta();
  renderHeader();
  renderMain();
  renderFooter();
  setupMenu();
  setupReveal();
  setupCounters();
  setupTilt();
  setupMagnetic();
  setupCursor();
  setupActiveNav();
})();