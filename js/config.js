/**
 * ============================================================================
 * BRILLIANT HOMESTAY — CENTRAL CONTENT CONFIGURATION
 * ============================================================================
 * Every editable fact and setting on the website lives in THIS ONE FILE.
 * The rest of the site (index.html, js/script.js) reads from SITE_CONFIG and
 * renders itself automatically. You never need to touch the HTML or JS to
 * change the phone number, add a photo, or update the address.
 *
 * QUICK START (see SETUP.md for the full guide)
 * ---------------------------------------------------------------------------
 * 1. ADD YOUR WHATSAPP NUMBER  →  contact.whatsapp  (see just below)
 *    Until you do, every WhatsApp button shows a friendly "not yet set up"
 *    state instead of linking to a fake number.
 * 2. ADD PHOTOS  →  drop files in /images/gallery/ and point to them in the
 *    `gallery` / `accommodation` / `hero` sections below.
 * 3. CONFIRM DETAILS  →  fill in address, amenities, policies, reviews only
 *    once you have verified them. Anything left `null` or empty is hidden
 *    automatically, so the public page never shows a guess as a fact.
 * ============================================================================
 */

const SITE_CONFIG = {

  // ==========================================================================
  // 1. CONTACT  —  THE MOST IMPORTANT SETTING ON THE WHOLE SITE.
  //    The admin WhatsApp number lives here and NOWHERE ELSE.
  //    Format: international digits only. No "+", no spaces, no hyphens.
  //    Example for India: "919876543210"  (91 = country code)
  //    Leave as null and every WhatsApp button shows a "coming soon" notice
  //    rather than a broken/fake link.
  // ==========================================================================
  contact: {
    whatsapp: null,          // e.g. "919876543210"   ← ADD THIS FIRST
    phone: null,             // display + dial, e.g. "+91 98765 43210"
    email: null,             // e.g. "stay@brillianthomestay.in"
  },

  // ==========================================================================
  // 2. PROPERTY IDENTITY — verified basics only.
  // ==========================================================================
  property: {
    name: "Brilliant Homestay",
    shortName: "Brilliant Homestay",
    city: "Guwahati",
    state: "Assam",
    country: "India",
    locationLabel: "Guwahati, Assam",

    tagline: "A welcoming stay in Guwahati.",

    // Honest, general introduction. Rewrite freely once the host confirms the
    // full story (year opened, number of rooms, what makes the stay special).
    introduction:
      "Brilliant Homestay is a warm, comfortable place to stay in Guwahati, Assam. " +
      "Our rooms are thoughtfully kept and freshly styled for every guest — whether " +
      "you're visiting for work, travelling through, or marking a special occasion. " +
      "Reach out directly and we'll be glad to help you plan your visit, share what's " +
      "available for your dates, and confirm the details.",

    // Show only highlights you can stand behind. These appear as small chips
    // in the About section. The "Celebration setups" one reflects the styled
    // decoration visible in the property's own photographs.
    highlights: [
      "Freshly styled rooms",
      "Direct, friendly hosting",
      "Celebration & occasion setups on request",
      "Central Guwahati location",
    ],

    metaDescription:
      "Brilliant Homestay in Guwahati, Assam — a warm, boutique homestay with freshly " +
      "styled rooms and celebration setups on request. Enquire directly by WhatsApp to " +
      "check availability and plan your stay.",
  },

  // ==========================================================================
  // 3. LOCATION — verified from the property's Google Maps listing.
  //    The full street address is intentionally blank until confirmed, so an
  //    approximate address never sends a guest astray.
  // ==========================================================================
  location: {
    coordinates: { lat: 26.1384413, lng: 91.7995684 },
    placeId: "ChIJMQYLY6NZWi0Rs0CCYihtmQQ",
    mapsViewUrl: "https://www.google.com/maps/place/Brilliant+Homestay/@26.1384413,91.7995684,17z/data=!3m1!4b1!4m6!3m5!1s0x375a59a3630b0631:0x499edc8628240b3!8m2!3d26.1384413!4d91.7995684!16s%2Fg%2F11xmy2sgzw",
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=26.1384413%2C91.7995684&destination_place_id=ChIJMQYLY6NZWi0Rs0CCYihtmQQ",
    mapsEmbedSrc:
      "https://www.google.com/maps?q=26.1384413,91.7995684&z=16&output=embed",

    // TODO (owner): add the full, verified postal address exactly as on your
    // Google listing. Stays hidden from the page until filled in.
    fullAddress: null,

    // TODO (owner): only add landmarks with a distance/time you have personally
    // confirmed. Do NOT estimate travel times.
    // Example: { label: "Guwahati Railway Station", note: null }
    landmarks: [],
  },

  // ==========================================================================
  // 4. ACCOMMODATION
  //    We do NOT have your confirmed room categories or prices yet, so the site
  //    shows a single, honest "our rooms" section using your real photographs
  //    instead of inventing room names or rates.
  //
  //    WHEN YOU HAVE CONFIRMED ROOM TYPES: add one object per room to `rooms`
  //    below. Each becomes its own card with an "Enquire about this room"
  //    button, and appears as a selectable option in the booking form. Fields
  //    left unset are simply skipped; leave `price` null to show
  //    "Contact us for rates" instead of a guessed figure.
  // ==========================================================================
  accommodation: {
    // Intro line for the general section (used when `rooms` is empty).
    generalIntro:
      "Comfortable, freshly styled rooms for couples, solo travellers and " +
      "families. Room categories and rates are shared on enquiry so we can " +
      "match you to the right space for your dates.",

    // Real photographs of the rooms (shown in the general accommodation strip).
    generalImages: [
      { image: "images/gallery/room-brown-suite.jpg", label: "Styled double room" },
      { image: "images/gallery/room-cream-bed.jpg",   label: "Double room" },
      { image: "images/gallery/room-wood-panel.jpg",  label: "Wood-panelled room" },
      { image: "images/gallery/room-charcoal.jpg",    label: "Cosy room" },
    ],
  },

  // Confirmed room categories go here (leave empty until verified):
  rooms: [
    // {
    //   id: "deluxe-double",
    //   name: "Deluxe Double Room",
    //   occupancy: "2 Guests",
    //   beds: "1 King Bed",
    //   amenities: ["Attached Bathroom", "Air Conditioning", "Free WiFi"],
    //   price: null,                                   // e.g. 2500 (₹ / night)
    //   image: "images/gallery/room-brown-suite.jpg",
    // },
  ],

  // ==========================================================================
  // 5. AMENITIES — list only what you (or your Google listing) can confirm.
  //    `icon` refers to a key in js/script.js's icon set:
  //    wifi, parking, ac, tv, kitchen, hotWater, breakfast, pets, security,
  //    familyFriendly, housekeeping, workspace, celebration.
  //    The whole section stays hidden until at least one is added.
  // ==========================================================================
  amenities: [
    // Uncomment / edit only the ones that are actually true for your property:
    // { label: "Free WiFi", icon: "wifi" },
    // { label: "Air Conditioning", icon: "ac" },
    // { label: "Hot Water", icon: "hotWater" },
    // { label: "Housekeeping", icon: "housekeeping" },
    // { label: "Parking", icon: "parking" },
    // { label: "Family Friendly", icon: "familyFriendly" },
    // { label: "Celebration Setups", icon: "celebration" },
    // { label: "24/7 Access", icon: "security" },
  ],

  // ==========================================================================
  // 6. GALLERY — your real photographs first, with tasteful placeholders
  //    reserving the categories you haven't photographed yet. Replace a
  //    placeholder by setting its `image` to a real file path, or add more
  //    objects. Never add stock or AI photos of other properties.
  // ==========================================================================
  gallery: [
    { id: "room-1", category: "Rooms",       label: "Styled double room",       image: "images/gallery/room-brown-suite.jpg" },
    { id: "room-2", category: "Rooms",       label: "Double room",              image: "images/gallery/room-cream-bed.jpg" },
    { id: "room-3", category: "Rooms",       label: "Wood-panelled room",       image: "images/gallery/room-wood-panel.jpg" },
    { id: "room-4", category: "Rooms",       label: "Cosy room with plant",     image: "images/gallery/room-charcoal.jpg" },
    { id: "celeb-1", category: "Celebrations", label: "Birthday decoration setup", image: "images/gallery/celebration-birthday.jpg" },

    // Placeholders reserving future categories (set `image` when photographed):
    { id: "ext-1",    category: "Exterior",       label: "Homestay Exterior",       image: null },
    { id: "common-1", category: "Common Areas",   label: "Living / Common Area",    image: null },
    { id: "bath-1",   category: "Bathrooms",      label: "Bathroom",                image: null },
    { id: "area-1",   category: "Surrounding Area", label: "Surrounding Area",      image: null },
  ],

  // Hero background photograph (a strong, wide-friendly room shot).
  heroImage: "images/gallery/room-brown-suite.jpg",

  // Small feature image beside the About text.
  aboutImage: "images/gallery/celebration-birthday.jpg",

  // ==========================================================================
  // 7. GUEST REVIEWS — this section stays hidden until you paste genuine,
  //    attributed reviews. Never invent names, quotes or ratings. When empty,
  //    the site shows a "Read our reviews on Google" link instead.
  // ==========================================================================
  reviews: [
    // {
    //   name: "Guest Name",
    //   text: "Their actual review text, unedited.",
    //   rating: 5,
    //   source: "Google Reviews",
    //   date: "March 2026",
    // },
  ],

  // ==========================================================================
  // 8. FAQs & POLICIES — add the answer only once confirmed. Unanswered
  //    questions stay hidden. These feed both the FAQ section and honesty of
  //    your booking terms.
  // ==========================================================================
  faqs: [
    { id: "check-in-out", question: "What are the check-in and check-out times?", answer: null },
    { id: "booking",      question: "How do I confirm a booking?",               answer: "Send us a booking request through this website (or WhatsApp us directly). We'll reply to confirm availability, share the total price, and tell you how to secure the dates. Your stay is confirmed only once we confirm it back to you." },
    { id: "celebrations", question: "Can you arrange celebration or occasion setups?", answer: "Yes — decoration setups (such as birthday arrangements) can be arranged on request. Mention it in your enquiry and we'll share the options and any charges." },
    { id: "parking",      question: "Is parking available?",                     answer: null },
    { id: "meals",        question: "Are meals included or available?",          answer: null },
    { id: "pets",         question: "Are pets allowed?",                         answer: null },
    { id: "cancellation", question: "What is the cancellation policy?",          answer: null },
  ],

  // ==========================================================================
  // 9. POLICY LINKS — footer links appear only once a URL is provided.
  // ==========================================================================
  policies: {
    privacyUrl: null,
    bookingPolicyUrl: null,
  },

  // ==========================================================================
  // 10. WHATSAPP MESSAGE TEMPLATES — the exact wording sent to your WhatsApp.
  //     Placeholders in {curly braces} are filled in automatically. You can
  //     reword these, but keep the {placeholders} intact.
  // ==========================================================================
  messages: {
    // General "Enquire on WhatsApp" buttons across the site.
    general:
      "Hello Brilliant Homestay! I found your website and would like to know more " +
      "about your accommodation, availability and rates.",

    // Accommodation-specific enquiry ({room} is the selected room name).
    accommodation:
      "Hello Brilliant Homestay! I found your website and would like to know more " +
      "about the {room} — including availability and rates.",
  },
};
