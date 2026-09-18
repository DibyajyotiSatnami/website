/**
 * Brilliant Homestay — site behaviour.
 * Reads SITE_CONFIG (js/config.js) and renders every data-driven section,
 * hiding anything that isn't confirmed yet. Handles navigation, gallery
 * lightbox, scroll reveals, and both WhatsApp flows (contact + booking).
 *
 * The admin WhatsApp number lives ONLY in SITE_CONFIG.contact.whatsapp.
 */

(function () {
  "use strict";

  const cfg = SITE_CONFIG;

  /* -------------------------------------------------------------------- */
  /* DOM helpers                                                           */
  /* -------------------------------------------------------------------- */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        if (key === "class") node.className = attrs[key];
        else if (key === "text") node.textContent = attrs[key];
        else if (key === "html") node.innerHTML = attrs[key];
        else if (key.startsWith("on") && typeof attrs[key] === "function") {
          node.addEventListener(key.slice(2), attrs[key]);
        } else if (attrs[key] !== null && attrs[key] !== undefined) {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    (children || []).forEach((child) => {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function svgIcon(pathD, viewBox) {
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wrapper.setAttribute("viewBox", viewBox || "0 0 24 24");
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = pathD;
    return wrapper;
  }

  function placeholderNode(category, label, compact) {
    const wrap = el("div", {
      class: "img-placeholder",
      "data-placeholder-category": category,
      "data-placeholder-label": label,
    });
    const icon = svgIcon('<path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>');
    icon.setAttribute("class", "placeholder-icon");
    wrap.appendChild(icon);
    const text = compact ? "Photo coming soon" : (label ? label + " — photo coming soon" : "Photo coming soon");
    wrap.appendChild(el("span", { class: "placeholder-text", text: text }));
    return wrap;
  }

  function mediaNode(image, category, label, compact) {
    if (image) {
      return el("img", { src: image, alt: label, loading: "lazy" });
    }
    return placeholderNode(category, label, compact);
  }

  /* -------------------------------------------------------------------- */
  /* Icon set (stroke-based, 24x24)                                       */
  /* -------------------------------------------------------------------- */
  const ICONS = {
    wifi: '<path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a11 11 0 0 1 13 0M9 15.5a6 6 0 0 1 6 0M12 19h.01"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 16V7h3.5a3 3 0 0 1 0 6H9"/>',
    ac: '<rect x="3" y="6" width="18" height="8" rx="2"/><path d="M7 18v-2M12 18v-2M17 18v-2"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    kitchen: '<path d="M4 3v9a4 4 0 0 0 4 4v5M8 3v8M4 7h4M16 3v18M20 3v6a2 2 0 0 1-4 0V3"/>',
    hotWater: '<path d="M12 3c1 3-3 4-3 7a3 3 0 0 0 6 0c0-1-.5-1.5-1-2"/><path d="M6 21h12M6 17h12v4H6z"/>',
    breakfast: '<circle cx="12" cy="13" r="7"/><path d="M9 3h6M10 3v3M14 3v3"/>',
    pets: '<circle cx="6" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 16c0-3 2.5-3.5 3.5-5 .8-1.2 3.2-1.2 4 0 1 1.5 3.5 2 3.5 5a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3z"/>',
    security: '<path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    familyFriendly: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M15 21v-1.5a3.5 3.5 0 0 1 3.5-3.5h0a3.5 3.5 0 0 1 3.5 3.5V21"/>',
    housekeeping: '<path d="M12 3v4M9 21l3-8 3 8M7 8h10l-1 5H8z"/>',
    workspace: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    celebration: '<path d="M3 21l6-14 8 8-14 6zM9 7l1.5-1.5M14 4l1 1M19 6l1-1M18 10l1.5 1.5M12 9l3 3"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M20 12a8 8 0 1 1-3.9-6.9M13 8.5c.3 1.5 1.5 2.7 3 3M8.5 9.5c.2 3.5 3 6.3 6.5 6.5"/><path d="M3 21l1.5-4A8 8 0 1 1 8 20.5L3 21z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-2-6 2-1 2 1z"/>',
  };
  function iconEl(key) { return svgIcon(ICONS[key] || ""); }

  /* -------------------------------------------------------------------- */
  /* WhatsApp / contact helpers  (single source of the number)            */
  /* -------------------------------------------------------------------- */
  function digitsOnly(str) { return (str || "").replace(/[^\d]/g, ""); }

  function adminNumber() {
    // International digits only, no "+". Empty string means "not configured".
    return digitsOnly(cfg.contact.whatsapp);
  }
  function hasWhatsApp() { return adminNumber().length >= 8; }

  /** Shared WhatsApp link builder. Encodes the whole message. */
  function whatsappLink(message) {
    const number = adminNumber();
    if (number.length < 8) return null;
    const base = "https://wa.me/" + number;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  function telLink() {
    if (!cfg.contact.phone) return null;
    return "tel:+" + digitsOnly(cfg.contact.phone);
  }

  /* -------------------------------------------------------------------- */
  /* Config-state helper (when WhatsApp number is missing)                */
  /* -------------------------------------------------------------------- */
  function showConfigNeededNotice(anchorMessage) {
    const note = qs("#contact-config-note");
    if (note) note.hidden = false;
    // Scroll to contact so the visitor sees the explanation + Google fallback.
    const target = qs("#contact");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (anchorMessage) {
      // Surface a small inline hint on the nearest status region if present.
      const status = qs("#booking-status") || qs("#contact-status");
      if (status) {
        status.textContent = anchorMessage;
        status.className = "form-status is-error";
      }
    }
  }

  /**
   * Wire every element with data-cta="whatsapp". Uses the general message.
   * When no number is configured, the click routes to the contact section
   * and reveals the configuration notice instead of a fake link.
   */
  function applyWhatsappCtas() {
    const link = whatsappLink(cfg.messages.general);
    qsa('[data-cta="whatsapp"]').forEach((node) => {
      if (link) {
        node.href = link;
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener");
        node.removeAttribute("data-config-needed");
      } else {
        node.href = "#contact";
        node.removeAttribute("target");
        node.setAttribute("data-config-needed", "true");
        node.addEventListener("click", (e) => {
          e.preventDefault();
          showConfigNeededNotice();
        });
      }
    });

    // Floating WhatsApp button appears whenever a number is configured.
    const fab = qs("#wa-fab");
    if (fab && link) fab.hidden = false;
  }

  /* -------------------------------------------------------------------- */
  /* Smooth-scroll links (data-scroll)                                    */
  /* -------------------------------------------------------------------- */
  function initScrollLinks() {
    qsa('[data-scroll]').forEach((node) => {
      node.addEventListener("click", (e) => {
        const sel = node.getAttribute("data-scroll");
        const target = qs(sel);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* -------------------------------------------------------------------- */
  /* Header / navigation                                                  */
  /* -------------------------------------------------------------------- */
  function initNav() {
    const toggle = qs("#menu-toggle");
    const menu = qs("#mobile-menu");

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }
    toggle.addEventListener("click", () => {
      if (menu.hidden) openMenu();
      else closeMenu();
    });
    qsa("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) closeMenu();
    });

    // Active link highlighting.
    const sections = qsa("main section[id]");
    const navLinks = qsa('.nav-links a, .mobile-nav-links a');
    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
              });
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => observer.observe(s));
    }
  }

  /** Hide any nav link whose target section is hidden (no dead links). */
  function pruneDeadNavLinks() {
    qsa('[data-nav-for]').forEach((link) => {
      const id = link.getAttribute("data-nav-for");
      const section = document.getElementById(id);
      if (!section || section.hidden) {
        const li = link.closest("li");
        if (li) li.hidden = true;
      }
    });
  }

  /* -------------------------------------------------------------------- */
  /* Scroll reveal                                                        */
  /* -------------------------------------------------------------------- */
  function initReveal() {
    const items = qsa(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    items.forEach((i) => observer.observe(i));
  }

  /* -------------------------------------------------------------------- */
  /* Hero + About imagery                                                 */
  /* -------------------------------------------------------------------- */
  function renderFeatureImages() {
    if (cfg.heroImage) {
      const media = qs("#hero-media");
      const ph = qs(".img-placeholder", media);
      const img = el("img", { src: cfg.heroImage, alt: "Brilliant Homestay, Guwahati", class: "hero-img", fetchpriority: "high" });
      if (ph) media.replaceChild(img, ph);
    }
    if (cfg.aboutImage) {
      const wrap = qs("#about-media").parentElement;
      const img = el("img", { src: cfg.aboutImage, alt: "Inside Brilliant Homestay", loading: "lazy", class: "about-img" });
      const old = qs("#about-media");
      wrap.replaceChild(img, old);
    }
  }

  /* -------------------------------------------------------------------- */
  /* Intro / highlights                                                   */
  /* -------------------------------------------------------------------- */
  function renderIntro() {
    qs("#intro-body").textContent = cfg.property.introduction;
    const chips = qs("#highlight-chips");
    if (cfg.property.highlights && cfg.property.highlights.length) {
      cfg.property.highlights.forEach((h) => chips.appendChild(el("li", { text: h })));
      chips.hidden = false;
    }
  }

  /* -------------------------------------------------------------------- */
  /* Accommodation                                                        */
  /* -------------------------------------------------------------------- */
  function renderAccommodation() {
    const grid = qs("#rooms-grid");
    const general = qs("#rooms-general");
    const sub = qs("#stay-sub");
    const roomSelect = qs("#bk-room");
    const roomField = qs("#bk-room-field");
    const roomsCountField = qs("#bk-rooms-field");

    if (cfg.rooms && cfg.rooms.length) {
      // Confirmed room categories → cards + booking dropdown.
      sub.textContent = "Choose the room that suits you, or tell us your dates and we'll recommend one.";
      cfg.rooms.forEach((room) => {
        const media = el("div", { class: "room-card-media" }, [mediaNode(room.image, "Rooms", room.name)]);
        const metaBits = [];
        if (room.occupancy) metaBits.push(el("span", { text: room.occupancy }));
        if (room.beds) metaBits.push(el("span", { text: room.beds }));
        const meta = metaBits.length ? el("div", { class: "room-meta" }, metaBits) : null;

        let amenitiesEl = null;
        if (room.amenities && room.amenities.length) {
          amenitiesEl = el("ul", { class: "room-amenities" }, room.amenities.map((a) => el("li", { text: a })));
        }
        const price = room.price
          ? el("p", { class: "room-price" }, [document.createTextNode("₹" + room.price), el("span", { class: "price-unit", text: " / night" })])
          : el("p", { class: "room-price room-price--enquire", text: "Contact us for rates" });

        const enquireBtn = el("a", { href: "#contact", class: "btn btn-outline btn-block" }, [document.createTextNode("Enquire about this room")]);
        enquireBtn.addEventListener("click", (e) => {
          e.preventDefault();
          openRoomEnquiry(room);
        });

        const body = el("div", { class: "room-card-body" }, [
          el("h3", { text: room.name }), meta, amenitiesEl, price, enquireBtn,
        ]);
        grid.appendChild(el("article", { class: "room-card reveal" }, [media, body]));

        if (roomSelect) roomSelect.appendChild(el("option", { value: room.name, text: room.name }));
      });
      grid.hidden = false;
      general.hidden = true;
      if (roomField) roomField.hidden = false;
      if (roomsCountField) roomsCountField.hidden = false;
    } else {
      // No confirmed categories → honest general strip with real photos.
      sub.textContent = cfg.accommodation.generalIntro;
      const media = qs("#rooms-general-media");
      (cfg.accommodation.generalImages || []).forEach((g) => {
        const fig = el("figure", { class: "rooms-general-figure reveal" }, [
          mediaNode(g.image, "Rooms", g.label, true),
          el("figcaption", { text: g.label }),
        ]);
        media.appendChild(fig);
      });
      grid.hidden = true;
      general.hidden = false;
    }
  }

  function openRoomEnquiry(room) {
    // Preselect in the booking form and take the visitor there.
    activateTab("booking");
    const select = qs("#bk-room");
    if (select) select.value = room.name;
    updateBookingSummary();
    qs("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => { const n = qs("#bk-name"); if (n) n.focus(); }, 350);
  }

  /* -------------------------------------------------------------------- */
  /* Amenities                                                            */
  /* -------------------------------------------------------------------- */
  function renderAmenities() {
    if (!cfg.amenities || !cfg.amenities.length) return;
    const section = qs("#amenities");
    const list = qs("#amenities-list");
    cfg.amenities.forEach((item) => {
      list.appendChild(el("li", { class: "amenity-item reveal" }, [iconEl(item.icon), el("span", { text: item.label })]));
    });
    section.hidden = false;
  }

  /* -------------------------------------------------------------------- */
  /* Gallery + lightbox                                                   */
  /* -------------------------------------------------------------------- */
  let galleryItems = [];
  let visibleIndexes = [];
  let currentLightboxPos = 0;
  let lastFocusedTrigger = null;

  function renderGallery() {
    const filtersWrap = qs("#gallery-filters");
    const grid = qs("#gallery-grid");
    galleryItems = cfg.gallery || [];

    const categories = ["All"].concat(Array.from(new Set(galleryItems.map((g) => g.category))));
    categories.forEach((cat, i) => {
      const btn = el("button", {
        type: "button", role: "tab",
        "aria-selected": i === 0 ? "true" : "false",
        text: cat,
        onclick: () => filterGallery(cat, btn),
      });
      filtersWrap.appendChild(btn);
    });

    galleryItems.forEach((item, index) => {
      const button = el("button", {
        type: "button", class: "gallery-item reveal",
        "data-category": item.category,
        "aria-label": "View photo: " + item.label,
        onclick: (e) => openLightbox(index, e.currentTarget),
      }, [
        mediaNode(item.image, item.category, item.label, true),
        el("span", { class: "gallery-item-tag", text: item.category }),
      ]);
      grid.appendChild(button);
    });
    updateVisibleIndexes("All");
  }

  function filterGallery(category, activeBtn) {
    qsa("#gallery-filters button").forEach((b) => b.setAttribute("aria-selected", b === activeBtn ? "true" : "false"));
    qsa(".gallery-item").forEach((node, i) => {
      const match = category === "All" || galleryItems[i].category === category;
      node.classList.toggle("is-hidden", !match);
    });
    updateVisibleIndexes(category);
  }

  function updateVisibleIndexes(category) {
    visibleIndexes = galleryItems
      .map((item, i) => (category === "All" || item.category === category ? i : -1))
      .filter((i) => i !== -1);
  }

  function openLightbox(index, triggerEl) {
    lastFocusedTrigger = triggerEl || document.activeElement;
    currentLightboxPos = visibleIndexes.indexOf(index);
    if (currentLightboxPos === -1) currentLightboxPos = 0;
    renderLightboxFrame();
    const lightbox = qs("#lightbox");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    qs("#lightbox-close").focus();
  }

  function closeLightbox() {
    qs("#lightbox").hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  function renderLightboxFrame() {
    const item = galleryItems[visibleIndexes[currentLightboxPos]];
    const stage = qs("#lightbox-stage");
    stage.innerHTML = "";
    stage.appendChild(mediaNode(item.image, item.category, item.label));
    qs("#lightbox-caption").textContent = item.label + " — " + item.category
      + "  ·  " + (currentLightboxPos + 1) + " / " + visibleIndexes.length;
  }

  function lightboxStep(delta) {
    currentLightboxPos = (currentLightboxPos + delta + visibleIndexes.length) % visibleIndexes.length;
    renderLightboxFrame();
  }

  function initLightboxControls() {
    qs("#lightbox-close").addEventListener("click", closeLightbox);
    qs("#lightbox-prev").addEventListener("click", () => lightboxStep(-1));
    qs("#lightbox-next").addEventListener("click", () => lightboxStep(1));

    const lightbox = qs("#lightbox");
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxStep(-1);
      if (e.key === "ArrowRight") lightboxStep(1);
    });

    let touchStartX = null;
    lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) lightboxStep(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* -------------------------------------------------------------------- */
  /* Location                                                             */
  /* -------------------------------------------------------------------- */
  function renderLocation() {
    qs("#location-directions").href = cfg.location.mapsDirectionsUrl;
    qs("#location-maps-view").href = cfg.location.mapsViewUrl;
    qs("#location-embed").src = cfg.location.mapsEmbedSrc;

    if (cfg.location.fullAddress) {
      const addr = qs("#location-address");
      addr.textContent = cfg.location.fullAddress;
      addr.hidden = false;
      qs("#location-fallback").hidden = true;
    }
    if (cfg.location.landmarks && cfg.location.landmarks.length) {
      const list = qs("#location-landmarks");
      cfg.location.landmarks.forEach((l) => {
        list.appendChild(el("li", { text: l.note ? l.label + " — " + l.note : l.label }));
      });
      list.hidden = false;
    }
  }

  /* -------------------------------------------------------------------- */
  /* Reviews                                                              */
  /* -------------------------------------------------------------------- */
  function renderReviews() {
    const grid = qs("#reviews-grid");
    const fallback = qs("#reviews-fallback");
    if (cfg.reviews && cfg.reviews.length) {
      cfg.reviews.forEach((r) => {
        const stars = r.rating ? el("p", { class: "review-stars", "aria-label": r.rating + " out of 5 stars", text: "★".repeat(r.rating) + "☆".repeat(5 - r.rating) }) : null;
        grid.appendChild(el("article", { class: "review-card reveal" }, [
          stars,
          el("p", { class: "review-text", text: '"' + r.text + '"' }),
          el("p", { class: "review-meta", text: r.name + (r.source ? " · " + r.source : "") + (r.date ? " · " + r.date : "") }),
        ]));
      });
      fallback.hidden = true;
    } else {
      grid.hidden = true;
      qs("#reviews-google-link").href = cfg.location.mapsViewUrl;
      fallback.hidden = false;
    }
  }

  /* -------------------------------------------------------------------- */
  /* FAQ                                                                  */
  /* -------------------------------------------------------------------- */
  function renderFaq() {
    const answered = (cfg.faqs || []).filter((f) => f.answer);
    if (!answered.length) return;
    const section = qs("#faq");
    const list = qs("#faq-list");

    answered.forEach((faq) => {
      const answerId = "faq-answer-" + faq.id;
      const btn = el("button", {
        class: "faq-question", type: "button",
        "aria-expanded": "false", "aria-controls": answerId, id: "faq-q-" + faq.id,
      }, [el("span", { text: faq.question }), el("span", { class: "icon", text: "+", "aria-hidden": "true" })]);

      const answerWrap = el("div", { class: "faq-answer", id: answerId, role: "region", "aria-labelledby": "faq-q-" + faq.id }, [
        el("p", { text: faq.answer }),
      ]);

      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        answerWrap.style.maxHeight = expanded ? "0px" : answerWrap.scrollHeight + "px";
      });
      list.appendChild(el("div", { class: "faq-item" }, [btn, answerWrap]));
    });
    section.hidden = false;
  }

  /* -------------------------------------------------------------------- */
  /* Contact methods (contact section + footer)                          */
  /* -------------------------------------------------------------------- */
  function renderContactMethods() {
    const methodsWrap = qs("#contact-methods");
    const footerWrap = qs("#footer-contact");

    const wa = whatsappLink(cfg.messages.general);
    if (wa) {
      methodsWrap.appendChild(el("a", { class: "contact-method", href: wa, target: "_blank", rel: "noopener" }, [iconEl("whatsapp"), el("span", { text: "Chat on WhatsApp" })]));
      footerWrap.appendChild(el("a", { href: wa, target: "_blank", rel: "noopener", text: "WhatsApp" }));
    }
    const tel = telLink();
    if (tel) {
      methodsWrap.appendChild(el("a", { class: "contact-method", href: tel }, [iconEl("phone"), el("span", { text: cfg.contact.phone })]));
      footerWrap.appendChild(el("a", { href: tel, text: cfg.contact.phone }));
    }
    if (cfg.contact.email) {
      const mailto = "mailto:" + cfg.contact.email;
      methodsWrap.appendChild(el("a", { class: "contact-method", href: mailto }, [iconEl("mail"), el("span", { text: cfg.contact.email })]));
      footerWrap.appendChild(el("a", { href: mailto, text: cfg.contact.email }));
    }
    // Always offer the Google Maps listing as a reliable contact route.
    methodsWrap.appendChild(el("a", { class: "contact-method", href: cfg.location.mapsViewUrl, target: "_blank", rel: "noopener" }, [iconEl("pin"), el("span", { text: "View on Google Maps" })]));
    footerWrap.appendChild(el("a", { href: cfg.location.mapsViewUrl, target: "_blank", rel: "noopener", text: "Google Maps" }));

    // Show the configuration notice when no WhatsApp number is present.
    if (!hasWhatsApp()) qs("#contact-config-note").hidden = false;

    // Footer policies.
    const policiesWrap = qs("#footer-policies");
    if (cfg.policies.privacyUrl) policiesWrap.appendChild(el("a", { href: cfg.policies.privacyUrl, text: "Privacy Policy" }));
    if (cfg.policies.bookingPolicyUrl) policiesWrap.appendChild(el("a", { href: cfg.policies.bookingPolicyUrl, text: "Booking Policy" }));
    policiesWrap.appendChild(el("a", { href: cfg.location.mapsDirectionsUrl, target: "_blank", rel: "noopener", text: "Get Directions" }));
  }

  /* -------------------------------------------------------------------- */
  /* Mobile bottom bar                                                    */
  /* -------------------------------------------------------------------- */
  function renderMobileBar() {
    // "Plan Your Stay" always works (scrolls to form). WhatsApp action is
    // wired by applyWhatsappCtas. The bar is always shown on mobile.
    qs("#mobile-bar").hidden = false;
    document.body.classList.add("has-mobile-bar");
  }

  /* -------------------------------------------------------------------- */
  /* Dates (Asia/Kolkata) + form utilities                                */
  /* -------------------------------------------------------------------- */
  // Today's date in the property's timezone (Asia/Kolkata), as YYYY-MM-DD.
  function todayKolkataISO() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const map = {};
    parts.forEach((p) => { if (p.type !== "literal") map[p.type] = p.value; });
    return map.year + "-" + map.month + "-" + map.day;
  }

  function parseISODate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function nightsBetween(checkinISO, checkoutISO) {
    const a = parseISODate(checkinISO);
    const b = parseISODate(checkoutISO);
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
  }

  function formatReadableDate(iso) {
    const d = parseISODate(iso);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
    }).format(d);
  }

  function setFieldError(input, message) {
    const errorNode = document.querySelector('[data-error-for="' + input.id + '"]') || document.getElementById(input.id + "-error");
    if (errorNode) errorNode.textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validPhone(value) {
    const digits = digitsOnly(value);
    return digits.length >= 7 && digits.length <= 15;
  }
  function validEmail(value) {
    if (!value) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* -------------------------------------------------------------------- */
  /* Form persistence (retain values across WhatsApp round-trip)          */
  /* -------------------------------------------------------------------- */
  const STORE_KEY = "bh_forms_v1";
  function saveForms() {
    try {
      const data = {};
      qsa("#booking-form input, #booking-form textarea, #booking-form select, #contact-form input, #contact-form textarea")
        .forEach((f) => { if (f.id) data[f.id] = f.value; });
      // Hero panel too.
      ["hero-checkin", "hero-checkout", "hero-guests"].forEach((id) => {
        const n = qs("#" + id); if (n) data[id] = n.value;
      });
      sessionStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) { /* storage unavailable — non-fatal */ }
  }
  function restoreForms() {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.keys(data).forEach((id) => {
        const n = qs("#" + id);
        if (n && data[id] != null && data[id] !== "") n.value = data[id];
      });
    } catch (e) { /* ignore */ }
  }

  /* -------------------------------------------------------------------- */
  /* Tabs                                                                 */
  /* -------------------------------------------------------------------- */
  function activateTab(which) {
    const isBooking = which === "booking";
    qs("#tab-booking").classList.toggle("is-active", isBooking);
    qs("#tab-message").classList.toggle("is-active", !isBooking);
    qs("#tab-booking").setAttribute("aria-selected", String(isBooking));
    qs("#tab-message").setAttribute("aria-selected", String(!isBooking));
    qs("#booking-form").hidden = !isBooking;
    qs("#contact-form").hidden = isBooking;
  }
  function initTabs() {
    qs("#tab-booking").addEventListener("click", () => activateTab("booking"));
    qs("#tab-message").addEventListener("click", () => activateTab("message"));
  }

  /* -------------------------------------------------------------------- */
  /* Hero enquiry panel                                                   */
  /* -------------------------------------------------------------------- */
  function initHeroForm() {
    const form = qs("#hero-enquiry-form");
    const checkin = qs("#hero-checkin");
    const checkout = qs("#hero-checkout");
    const guests = qs("#hero-guests");
    const errorBox = qs("#hero-enquiry-error");
    const today = todayKolkataISO();
    checkin.min = today;
    checkout.min = today;

    checkin.addEventListener("change", () => { checkout.min = checkin.value || today; });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorBox.hidden = true; errorBox.textContent = "";

      if (!checkin.value || !checkout.value) {
        errorBox.textContent = "Please choose your check-in and check-out dates."; errorBox.hidden = false; return;
      }
      if (checkin.value < today) {
        errorBox.textContent = "Check-in cannot be in the past."; errorBox.hidden = false; return;
      }
      if (checkout.value <= checkin.value) {
        errorBox.textContent = "Check-out must be after check-in."; errorBox.hidden = false; return;
      }
      if (!guests.value || Number(guests.value) < 1) {
        errorBox.textContent = "Please enter the number of guests."; errorBox.hidden = false; return;
      }

      // Carry values into the booking form for a smooth follow-through.
      const nights = nightsBetween(checkin.value, checkout.value);
      const bkCheckin = qs("#bk-checkin"), bkCheckout = qs("#bk-checkout"), bkAdults = qs("#bk-adults");
      if (bkCheckin) bkCheckin.value = checkin.value;
      if (bkCheckout) bkCheckout.value = checkout.value;
      if (bkAdults) bkAdults.value = guests.value;
      updateBookingSummary();
      saveForms();

      const message =
        cfg.messages.general + "\n\n" +
        "Check-in: " + formatReadableDate(checkin.value) + "\n" +
        "Check-out: " + formatReadableDate(checkout.value) + "\n" +
        "Number of nights: " + nights + "\n" +
        "Guests: " + guests.value;

      const wa = whatsappLink(message);
      if (wa) {
        window.open(wa, "_blank", "noopener");
      } else {
        showConfigNeededNotice();
      }
    });
  }

  /* -------------------------------------------------------------------- */
  /* Booking form                                                         */
  /* -------------------------------------------------------------------- */
  function collectBooking() {
    return {
      name: qs("#bk-name").value.trim(),
      phone: qs("#bk-phone").value.trim(),
      checkin: qs("#bk-checkin").value,
      checkout: qs("#bk-checkout").value,
      adults: qs("#bk-adults").value,
      children: qs("#bk-children").value,
      room: (!qs("#bk-room-field").hidden && qs("#bk-room").value) ? qs("#bk-room").value : "",
      rooms: (!qs("#bk-rooms-field").hidden && qs("#bk-rooms").value) ? qs("#bk-rooms").value : "",
      requests: qs("#bk-requests").value.trim(),
    };
  }

  function updateBookingSummary() {
    const b = collectBooking();
    const summary = qs("#booking-summary");
    const list = qs("#booking-summary-list");
    if (!b.checkin || !b.checkout || nightsBetween(b.checkin, b.checkout) <= 0) {
      summary.hidden = true; return;
    }
    const nights = nightsBetween(b.checkin, b.checkout);
    list.innerHTML = "";
    const rows = [
      ["Check-in", formatReadableDate(b.checkin)],
      ["Check-out", formatReadableDate(b.checkout)],
      ["Nights", String(nights)],
      ["Guests", b.adults + " adult" + (Number(b.adults) === 1 ? "" : "s") + (Number(b.children) > 0 ? ", " + b.children + " child" + (Number(b.children) === 1 ? "" : "ren") : "")],
    ];
    if (b.room) rows.push(["Room", b.room]);
    if (b.rooms) rows.push(["Rooms", b.rooms]);
    rows.forEach(([k, v]) => {
      list.appendChild(el("div", { class: "summary-row" }, [
        el("dt", { text: k }), el("dd", { text: v }),
      ]));
    });
    summary.hidden = false;
  }

  function initBookingForm() {
    const form = qs("#booking-form");
    const status = qs("#booking-status");
    const name = qs("#bk-name"), phone = qs("#bk-phone");
    const checkin = qs("#bk-checkin"), checkout = qs("#bk-checkout");
    const adults = qs("#bk-adults");
    const today = todayKolkataISO();
    checkin.min = today; checkout.min = today;

    checkin.addEventListener("change", () => { checkout.min = checkin.value || today; updateBookingSummary(); });
    [checkout, adults, qs("#bk-children"), qs("#bk-room"), qs("#bk-rooms")].forEach((n) => {
      if (n) n.addEventListener("change", updateBookingSummary);
    });
    qsa("#booking-form input, #booking-form textarea, #booking-form select").forEach((n) => {
      n.addEventListener("input", saveForms);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = ""; status.className = "form-status";
      let valid = true;

      if (!name.value.trim()) { setFieldError(name, "Please enter your name."); valid = false; } else setFieldError(name, "");
      if (!validPhone(phone.value)) { setFieldError(phone, "Please enter a valid phone number."); valid = false; } else setFieldError(phone, "");

      if (!checkin.value) { setFieldError(checkin, "Check-in date is required."); valid = false; }
      else if (checkin.value < today) { setFieldError(checkin, "Check-in cannot be in the past."); valid = false; }
      else setFieldError(checkin, "");

      if (!checkout.value) { setFieldError(checkout, "Check-out date is required."); valid = false; }
      else if (checkin.value && checkout.value <= checkin.value) { setFieldError(checkout, "Check-out must be after check-in."); valid = false; }
      else setFieldError(checkout, "");

      if (!adults.value || Number(adults.value) < 1) { setFieldError(adults, "At least 1 adult is required."); valid = false; } else setFieldError(adults, "");

      if (!valid) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.classList.add("is-error");
        return;
      }

      const b = collectBooking();
      const nights = nightsBetween(b.checkin, b.checkout);

      const lines = [
        "Hello Brilliant Homestay! I would like to request a booking.",
        "Name: " + b.name,
        "Phone: " + b.phone,
        "Check-in: " + formatReadableDate(b.checkin),
        "Check-out: " + formatReadableDate(b.checkout),
        "Number of nights: " + nights,
        "Adults: " + b.adults,
        "Children: " + (b.children || "0"),
      ];
      if (b.room) lines.push("Accommodation preference: " + b.room);
      if (b.rooms) lines.push("Rooms: " + b.rooms);
      if (b.requests) lines.push("Special requests: " + b.requests);
      lines.push("");
      lines.push("Please confirm availability, the total price and the booking process. Thank you!");
      const message = lines.join("\n");

      saveForms();
      const wa = whatsappLink(message);
      if (wa) {
        window.open(wa, "_blank", "noopener");
        status.textContent = "WhatsApp has opened with your booking request. Tap Send there to deliver it — the property will confirm availability and price.";
        status.classList.add("is-success");
      } else {
        showConfigNeededNotice("WhatsApp isn't connected yet. Please reach us via the Google Maps listing above.");
      }
    });
  }

  /* -------------------------------------------------------------------- */
  /* Contact / message form                                               */
  /* -------------------------------------------------------------------- */
  function initContactForm() {
    const form = qs("#contact-form");
    const status = qs("#contact-status");
    const name = qs("#cf-name"), phone = qs("#cf-phone"),
          email = qs("#cf-email"), subject = qs("#cf-subject"), message = qs("#cf-message");

    qsa("#contact-form input, #contact-form textarea").forEach((n) => n.addEventListener("input", saveForms));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = ""; status.className = "form-status";
      let valid = true;

      if (!name.value.trim()) { setFieldError(name, "Please enter your name."); valid = false; } else setFieldError(name, "");
      if (!validPhone(phone.value)) { setFieldError(phone, "Please enter a valid phone number."); valid = false; } else setFieldError(phone, "");
      if (!validEmail(email.value)) { setFieldError(email, "Please enter a valid email, or leave it blank."); valid = false; } else setFieldError(email, "");
      if (!message.value.trim()) { setFieldError(message, "Please enter your message."); valid = false; } else setFieldError(message, "");

      if (!valid) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.classList.add("is-error");
        return;
      }

      const lines = [
        "Hello Brilliant Homestay! I have an enquiry through your website.",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
      ];
      if (email.value.trim()) lines.push("Email: " + email.value.trim());
      if (subject.value.trim()) lines.push("Subject: " + subject.value.trim());
      lines.push("Message:");
      lines.push(message.value.trim());
      const text = lines.join("\n");

      saveForms();
      const wa = whatsappLink(text);
      if (wa) {
        window.open(wa, "_blank", "noopener");
        status.textContent = "WhatsApp has opened with your message. Tap Send there to share it with our team.";
        status.classList.add("is-success");
      } else {
        showConfigNeededNotice("WhatsApp isn't connected yet. Please reach us via the Google Maps listing above.");
      }
    });
  }

  /* -------------------------------------------------------------------- */
  /* Structured data                                                      */
  /* -------------------------------------------------------------------- */
  function injectStructuredData() {
    const data = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: cfg.property.name,
      description: cfg.property.metaDescription,
      address: {
        "@type": "PostalAddress",
        addressLocality: cfg.property.city,
        addressRegion: cfg.property.state,
        addressCountry: cfg.property.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: cfg.location.coordinates.lat,
        longitude: cfg.location.coordinates.lng,
      },
      hasMap: cfg.location.mapsViewUrl,
      url: window.location.href,
    };
    if (cfg.location.fullAddress) data.address.streetAddress = cfg.location.fullAddress;
    if (cfg.contact.phone) data.telephone = cfg.contact.phone;
    if (cfg.heroImage) data.image = new URL(cfg.heroImage, window.location.href).href;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* -------------------------------------------------------------------- */
  /* Meta + header shadow                                                 */
  /* -------------------------------------------------------------------- */
  function initMeta() {
    const metaDesc = qs('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cfg.property.metaDescription);
    qs("#footer-year").textContent = String(new Date().getFullYear());
    document.title = cfg.property.name + " | Boutique Homestay in " + cfg.property.locationLabel;
  }

  function initHeaderShadow() {
    const header = qs("#site-header");
    let last = false;
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 8;
      if (scrolled !== last) { header.classList.toggle("is-scrolled", scrolled); last = scrolled; }
    }, { passive: true });
  }

  /* -------------------------------------------------------------------- */
  /* Boot                                                                 */
  /* -------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initMeta();
    renderFeatureImages();
    renderIntro();
    initNav();
    initScrollLinks();
    initHeaderShadow();
    renderAccommodation();
    renderAmenities();
    renderGallery();
    initLightboxControls();
    renderLocation();
    renderReviews();
    renderFaq();
    renderContactMethods();
    renderMobileBar();
    initTabs();
    initHeroForm();
    initBookingForm();
    initContactForm();
    restoreForms();
    updateBookingSummary();
    applyWhatsappCtas();
    pruneDeadNavLinks();
    injectStructuredData();
    initReveal();
  });
})();
