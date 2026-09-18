/**
 * Brilliant Homestay — site behaviour.
 * Reads SITE_CONFIG (js/config.js) and renders every data-driven section,
 * hiding anything that isn't confirmed yet. Also handles navigation,
 * the gallery lightbox, and the contact / enquiry forms.
 */

(function () {
  "use strict";

  const cfg = SITE_CONFIG;

  /* -------------------------------------------------------------------- */
  /* Helpers                                                               */
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
    const text = compact ? "Photo coming soon" : label + " photograph coming soon";
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
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M20 12a8 8 0 1 1-3.9-6.9M13 8.5c.3 1.5 1.5 2.7 3 3M8.5 9.5c.2 3.5 3 6.3 6.5 6.5"/><path d="M3 21l1.5-4A8 8 0 1 1 8 20.5L3 21z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-2-6 2-1 2 1z"/>',
  };

  function iconEl(key) {
    return svgIcon(ICONS[key] || "");
  }

  /* -------------------------------------------------------------------- */
  /* Contact channel resolution                                           */
  /* -------------------------------------------------------------------- */
  function digitsOnly(str) {
    return (str || "").replace(/[^\d]/g, "");
  }

  function buildWhatsAppLink(message) {
    const number = digitsOnly(cfg.contact.whatsapp);
    if (!number) return null;
    return "https://wa.me/" + number + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  function buildTelLink() {
    if (!cfg.contact.phone) return null;
    return "tel:" + digitsOnly(cfg.contact.phone).replace(/^/, "+");
  }

  function buildMailtoLink(subject, body) {
    if (!cfg.contact.email) return null;
    return "mailto:" + cfg.contact.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function defaultEnquiryMessage() {
    return "Hello Brilliant Homestay, I'd like to enquire about a stay.";
  }

  /**
   * The single "primary contact action" used across the site: WhatsApp if
   * configured, otherwise a phone call, otherwise scrolling to the enquiry
   * form. Every data-cta="primary" element is wired to this.
   */
  function primaryAction(message) {
    const wa = buildWhatsAppLink(message || defaultEnquiryMessage());
    if (wa) return { type: "whatsapp", href: wa, target: "_blank" };
    const tel = buildTelLink();
    if (tel) return { type: "call", href: tel, target: null };
    return { type: "form", href: "#contact", target: null };
  }

  function applyPrimaryCtas() {
    const action = primaryAction();
    qsa('[data-cta="primary"]').forEach((node) => {
      node.href = action.href;
      if (action.target) node.setAttribute("target", action.target);
      else node.removeAttribute("target");

      if (node.dataset.ctaSlot === "hero") {
        node.textContent = action.type === "whatsapp" ? "Enquire on WhatsApp" : "Enquire About Your Stay";
      }
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

  /* -------------------------------------------------------------------- */
  /* Rooms                                                                 */
  /* -------------------------------------------------------------------- */
  function renderRooms() {
    const grid = qs("#rooms-grid");
    const roomSelect = qs("#cf-room");

    cfg.rooms.forEach((room) => {
      const media = el("div", { class: "room-card-media" }, [mediaNode(room.image, "Bedrooms", room.name)]);

      const metaBits = [];
      if (room.occupancy) metaBits.push(el("span", { text: room.occupancy }));
      if (room.beds) metaBits.push(el("span", { text: room.beds }));
      const meta = metaBits.length ? el("div", { class: "room-meta" }, metaBits) : null;

      let amenitiesEl = null;
      if (room.amenities && room.amenities.length) {
        amenitiesEl = el(
          "ul",
          { class: "room-amenities" },
          room.amenities.map((a) => el("li", { text: a }))
        );
      }

      const price = room.price
        ? el("p", { class: "room-price" }, [document.createTextNode("₹" + room.price), el("span", { class: "price-unit", text: " / night" })])
        : el("p", { class: "room-price", text: "Price on enquiry" });

      const enquireBtn = el("a", { href: "#contact", class: "btn btn-outline", text: "Enquire About This Room" });
      enquireBtn.addEventListener("click", (e) => {
        e.preventDefault();
        goToEnquiry(room.id, room.name);
      });

      const body = el("div", { class: "room-card-body" }, [
        el("h3", { text: room.name }),
        meta,
        amenitiesEl,
        price,
        enquireBtn,
      ]);

      grid.appendChild(el("article", { class: "room-card" }, [media, body]));

      if (roomSelect) {
        roomSelect.appendChild(el("option", { value: room.id, text: room.name }));
      }
    });
  }

  function goToEnquiry(roomId, roomName) {
    const select = qs("#cf-room");
    if (select && roomId) select.value = roomId;
    const target = qs("#contact");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    const nameField = qs("#cf-name");
    if (nameField) window.setTimeout(() => nameField.focus(), 350);
  }

  /* -------------------------------------------------------------------- */
  /* Amenities                                                             */
  /* -------------------------------------------------------------------- */
  function renderAmenities() {
    if (!cfg.amenities.length) return;
    const section = qs("#amenities");
    const list = qs("#amenities-list");
    cfg.amenities.forEach((item) => {
      list.appendChild(
        el("li", { class: "amenity-item" }, [iconEl(item.icon), el("span", { text: item.label })])
      );
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
    galleryItems = cfg.gallery;

    const categories = ["All"].concat(Array.from(new Set(galleryItems.map((g) => g.category))));

    categories.forEach((cat, i) => {
      const btn = el("button", {
        type: "button",
        role: "tab",
        "aria-selected": i === 0 ? "true" : "false",
        text: cat,
        onclick: () => filterGallery(cat, btn),
      });
      filtersWrap.appendChild(btn);
    });

    galleryItems.forEach((item, index) => {
      const button = el(
        "button",
        {
          type: "button",
          class: "gallery-item",
          "data-category": item.category,
          "aria-label": "View photo: " + item.label,
          onclick: (e) => openLightbox(index, e.currentTarget),
        },
        [mediaNode(item.image, item.category, item.label, true), el("span", { class: "gallery-item-tag", text: item.category })]
      );
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
    qs("#lightbox-caption").textContent = item.label + " — " + item.category;
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
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxStep(-1);
      if (e.key === "ArrowRight") lightboxStep(1);
    });

    let touchStartX = null;
    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) lightboxStep(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* -------------------------------------------------------------------- */
  /* Location                                                              */
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
  /* Reviews                                                               */
  /* -------------------------------------------------------------------- */
  function renderReviews() {
    if (!cfg.reviews.length) return;
    const section = qs("#reviews");
    const grid = qs("#reviews-grid");
    cfg.reviews.forEach((r) => {
      const stars = r.rating ? el("p", { class: "review-stars", text: "★".repeat(r.rating) + "☆".repeat(5 - r.rating) }) : null;
      grid.appendChild(
        el("article", { class: "review-card" }, [
          stars,
          el("p", { class: "review-text", text: '"' + r.text + '"' }),
          el("p", { class: "review-meta", text: r.name + (r.source ? " · " + r.source : "") + (r.date ? " · " + r.date : "") }),
        ])
      );
    });
    section.hidden = false;
  }

  /* -------------------------------------------------------------------- */
  /* FAQ                                                                   */
  /* -------------------------------------------------------------------- */
  function renderFaq() {
    const answered = cfg.faqs.filter((f) => f.answer);
    if (!answered.length) return;
    const section = qs("#faq");
    const list = qs("#faq-list");

    answered.forEach((faq, i) => {
      const answerId = "faq-answer-" + faq.id;
      const btn = el("button", {
        class: "faq-question",
        type: "button",
        "aria-expanded": "false",
        "aria-controls": answerId,
        id: "faq-q-" + faq.id,
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
  /* Contact methods (contact section + footer)                           */
  /* -------------------------------------------------------------------- */
  function renderContactMethods() {
    const methodsWrap = qs("#contact-methods");
    const footerWrap = qs("#footer-contact");

    const wa = buildWhatsAppLink();
    if (wa) {
      methodsWrap.appendChild(el("a", { class: "contact-method", href: wa, target: "_blank", rel: "noopener" }, [iconEl("whatsapp"), el("span", { text: "Chat on WhatsApp" })]));
      footerWrap.appendChild(el("a", { href: wa, target: "_blank", rel: "noopener", text: "WhatsApp" }));
    }
    const tel = buildTelLink();
    if (tel) {
      methodsWrap.appendChild(el("a", { class: "contact-method", href: tel }, [iconEl("phone"), el("span", { text: cfg.contact.phone })]));
      footerWrap.appendChild(el("a", { href: tel, text: cfg.contact.phone }));
    }
    if (cfg.contact.email) {
      const mailto = "mailto:" + cfg.contact.email;
      methodsWrap.appendChild(el("a", { class: "contact-method", href: mailto }, [iconEl("mail"), el("span", { text: cfg.contact.email })]));
      footerWrap.appendChild(el("a", { href: mailto, text: cfg.contact.email }));
    }
    footerWrap.appendChild(el("a", { href: cfg.location.mapsViewUrl, target: "_blank", rel: "noopener", text: "View on Google Maps" }));

    // Policies (footer) — hide the column entirely when no policy links are configured.
    const policiesWrap = qs("#footer-policies");
    if (cfg.policies.privacyUrl) policiesWrap.appendChild(el("a", { href: cfg.policies.privacyUrl, text: "Privacy Policy" }));
    if (cfg.policies.bookingPolicyUrl) policiesWrap.appendChild(el("a", { href: cfg.policies.bookingPolicyUrl, text: "Booking Policy" }));
    if (!policiesWrap.children.length) policiesWrap.hidden = true;
  }

  /* -------------------------------------------------------------------- */
  /* Sticky mobile bar                                                     */
  /* -------------------------------------------------------------------- */
  function renderStickyBar() {
    const bar = qs("#sticky-bar");
    const wa = buildWhatsAppLink();
    const tel = buildTelLink();

    if (tel) {
      bar.appendChild(el("a", { class: "sticky-call", href: tel }, [iconEl("phone"), document.createTextNode("Call")]));
    }
    if (wa) {
      bar.appendChild(el("a", { class: "sticky-whatsapp", href: wa, target: "_blank", rel: "noopener" }, [iconEl("whatsapp"), document.createTextNode("WhatsApp")]));
    }
    bar.appendChild(
      el("a", { class: "sticky-directions", href: cfg.location.mapsDirectionsUrl, target: "_blank", rel: "noopener" }, [iconEl("compass"), document.createTextNode("Directions")])
    );

    bar.hidden = false;
    document.body.classList.add("has-sticky-bar");
  }

  /* -------------------------------------------------------------------- */
  /* Forms                                                                 */
  /* -------------------------------------------------------------------- */
  function todayISO() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  function setFieldError(input, message) {
    const errorNode = document.querySelector('[data-error-for="' + input.id + '"]') || document.getElementById(input.id + "-error");
    if (errorNode) errorNode.textContent = message || "";
  }

  function validPhone(value) {
    const digits = digitsOnly(value);
    return digits.length >= 7 && digits.length <= 15;
  }

  function initHeroForm() {
    const form = qs("#hero-enquiry-form");
    const checkin = qs("#hero-checkin");
    const checkout = qs("#hero-checkout");
    const guests = qs("#hero-guests");
    const errorBox = qs("#hero-enquiry-error");
    checkin.min = todayISO();

    checkin.addEventListener("change", () => {
      checkout.min = checkin.value;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorBox.hidden = true;
      errorBox.textContent = "";

      if (!checkin.value || !checkout.value) {
        errorBox.textContent = "Please choose your check-in and check-out dates.";
        errorBox.hidden = false;
        return;
      }
      if (checkout.value <= checkin.value) {
        errorBox.textContent = "Check-out date must be after the check-in date.";
        errorBox.hidden = false;
        return;
      }
      if (!guests.value || Number(guests.value) < 1) {
        errorBox.textContent = "Please enter the number of guests.";
        errorBox.hidden = false;
        return;
      }

      // Carry values into the main contact form.
      const cfCheckin = qs("#cf-checkin");
      const cfCheckout = qs("#cf-checkout");
      const cfGuests = qs("#cf-guests");
      if (cfCheckin) cfCheckin.value = checkin.value;
      if (cfCheckout) cfCheckout.value = checkout.value;
      if (cfGuests) cfGuests.value = guests.value;

      const message =
        "Hello Brilliant Homestay, I'd like to enquire about availability.\n" +
        "Check-in: " + checkin.value + "\n" +
        "Check-out: " + checkout.value + "\n" +
        "Guests: " + guests.value;

      const wa = buildWhatsAppLink(message);
      if (wa) {
        window.open(wa, "_blank", "noopener");
      } else {
        qs("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
        const nameField = qs("#cf-name");
        if (nameField) window.setTimeout(() => nameField.focus(), 350);
      }
    });
  }

  function initContactForm() {
    const form = qs("#contact-form");
    const submitBtn = qs("#contact-submit");
    const status = qs("#contact-form-status");
    const disabledNote = qs("#contact-form-disabled-note");

    const name = qs("#cf-name");
    const phone = qs("#cf-phone");
    const checkin = qs("#cf-checkin");
    const checkout = qs("#cf-checkout");
    const guests = qs("#cf-guests");
    const roomSelect = qs("#cf-room");
    const message = qs("#cf-message");

    checkin.min = todayISO();
    checkin.addEventListener("change", () => {
      checkout.min = checkin.value;
    });

    const hasChannel = Boolean(cfg.contact.whatsapp || cfg.contact.phone || cfg.contact.email);
    if (!hasChannel) {
      submitBtn.disabled = true;
      disabledNote.hidden = false;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      let valid = true;

      if (!name.value.trim()) {
        setFieldError(name, "Please enter your name.");
        valid = false;
      } else {
        setFieldError(name, "");
      }

      if (!phone.value.trim() || !validPhone(phone.value)) {
        setFieldError(phone, "Please enter a valid phone number.");
        valid = false;
      } else {
        setFieldError(phone, "");
      }

      if (!checkin.value) {
        setFieldError(checkin, "Check-in date is required.");
        valid = false;
      } else {
        setFieldError(checkin, "");
      }

      if (!checkout.value) {
        setFieldError(checkout, "Check-out date is required.");
        valid = false;
      } else if (checkin.value && checkout.value <= checkin.value) {
        setFieldError(checkout, "Check-out must be after check-in.");
        valid = false;
      } else {
        setFieldError(checkout, "");
      }

      if (!guests.value || Number(guests.value) < 1) {
        setFieldError(guests, "Please enter the number of guests.");
        valid = false;
      } else {
        setFieldError(guests, "");
      }

      if (!valid) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.classList.add("is-error");
        return;
      }

      const roomLabel = roomSelect && roomSelect.value ? roomSelect.selectedOptions[0].textContent : null;

      const lines = [
        "Hello Brilliant Homestay, I'd like to enquire about a stay.",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Check-in: " + checkin.value,
        "Check-out: " + checkout.value,
        "Guests: " + guests.value,
      ];
      if (roomLabel) lines.push("Room: " + roomLabel);
      if (message.value.trim()) lines.push("Message: " + message.value.trim());
      const enquiryText = lines.join("\n");

      const wa = buildWhatsAppLink(enquiryText);
      if (wa) {
        window.open(wa, "_blank", "noopener");
        status.textContent = "WhatsApp has opened with your enquiry filled in — please tap Send there to deliver it to Brilliant Homestay.";
        status.classList.add("is-success");
        return;
      }

      const mailto = buildMailtoLink("Stay enquiry — Brilliant Homestay", enquiryText);
      if (mailto) {
        window.location.href = mailto;
        status.textContent = "Your email app has opened with your enquiry filled in — please send it from there.";
        status.classList.add("is-success");
        return;
      }

      if (cfg.contact.phone) {
        status.textContent = "Please call us at " + cfg.contact.phone + " to complete your enquiry.";
        return;
      }

      status.textContent = "Online enquiries aren't connected yet. Please check back soon.";
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

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* -------------------------------------------------------------------- */
  /* Misc                                                                  */
  /* -------------------------------------------------------------------- */
  function initIntroAndMeta() {
    qs("#intro-body").textContent = cfg.property.introduction;
    const metaDesc = qs('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cfg.property.metaDescription);
    qs("#footer-year").textContent = String(new Date().getFullYear());
    document.title = cfg.property.name + " | Boutique Homestay in " + cfg.property.locationLabel;
  }

  function initHeaderShadow() {
    const header = qs("#site-header");
    let lastScrolled = false;
    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.scrollY > 8;
        if (scrolled !== lastScrolled) {
          header.style.boxShadow = scrolled ? "0 4px 18px rgba(22,40,31,0.08)" : "none";
          lastScrolled = scrolled;
        }
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------------------- */
  /* Boot                                                                  */
  /* -------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initIntroAndMeta();
    initNav();
    initHeaderShadow();
    renderRooms();
    renderAmenities();
    renderGallery();
    initLightboxControls();
    renderLocation();
    renderReviews();
    renderFaq();
    renderContactMethods();
    renderStickyBar();
    applyPrimaryCtas();
    initHeroForm();
    initContactForm();
    injectStructuredData();
  });
})();
