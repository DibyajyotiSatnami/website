/**
 * ============================================================================
 * BRILLIANT HOMESTAY — CENTRAL CONTENT CONFIGURATION
 * ============================================================================
 * Every editable fact on the website lives in this one file: property text,
 * contact details, location, rooms, amenities, gallery photographs, reviews,
 * FAQs and policy links. The rest of the site (index.html, js/script.js)
 * reads from SITE_CONFIG and renders itself automatically.
 *
 * HOW TO USE THIS FILE
 * ---------------------------------------------------------------------------
 * 1. Only enter information you (the property owner) have confirmed, or that
 *    is visible on the property's own Google Maps listing. Do not guess.
 * 2. Leave a field as `null` or an empty array `[]` when you are not sure —
 *    the site automatically hides anything that is incomplete, so the public
 *    page never shows a guess as if it were a fact.
 * 3. Contact buttons (WhatsApp, Call) and the mobile sticky bar switch on
 *    automatically the moment you fill in `contact.whatsapp` / `contact.phone`
 *    below. Nothing else needs to change.
 * 4. To add a real photograph, drop the image file into /images/gallery/ (or
 *    /images/hero/) and set the matching `image: "images/gallery/your-file.jpg"`
 *    path. Until then, an elegant labeled placeholder is shown instead.
 * ============================================================================
 */

const SITE_CONFIG = {

  // ==========================================================================
  // 1. PROPERTY IDENTITY — verified basics only.
  // ==========================================================================
  property: {
    name: "Brilliant Homestay",
    shortName: "Brilliant Homestay",
    city: "Guwahati",
    state: "Assam",
    country: "India",
    locationLabel: "Guwahati, Assam",

    // Keep this introduction general and honest until the owner confirms
    // specific details (year started, host story, what makes the stay
    // unique, number of rooms, etc.). Replace freely — this text renders
    // directly in the "Welcome to Brilliant Homestay" section.
    introduction:
      "Brilliant Homestay offers a comfortable, homely stay in Guwahati, Assam. " +
      "We're putting the finishing touches on our full story — in the meantime, " +
      "reach out directly and we'll be glad to help you plan your visit, answer " +
      "questions about the rooms, and confirm availability for your dates.",

    // TODO (owner): once confirmed, add a one-line description here, e.g.
    // "A family-run homestay just off GS Road, Guwahati." It will appear in
    // the browser tab preview and search-engine results (meta description).
    metaDescription:
      "Brilliant Homestay in Guwahati, Assam — a warm, boutique homestay. Enquire directly by WhatsApp or phone to check availability and plan your stay.",
  },

  // ==========================================================================
  // 2. CONTACT — leave as null until verified. The relevant buttons across
  //    the site (hero CTA, sticky mobile bar, room cards, contact form,
  //    footer, click-to-call) appear automatically once these are filled in.
  // ==========================================================================
  contact: {
    // International format, digits only, no leading "+", e.g. "919812345678"
    whatsapp: null,

    // Display + dial format, e.g. "+91 98123 45678"
    phone: null,

    // e.g. "stay@brillianthomestay.example"
    email: null,
  },

  // ==========================================================================
  // 3. LOCATION — coordinates and Google Maps links are verified from the
  //    property listing supplied by the owner. The full street address is
  //    intentionally left blank until it is confirmed against that listing,
  //    since an approximate or guessed address could send guests astray.
  // ==========================================================================
  location: {
    coordinates: { lat: 26.1384413, lng: 91.7995684 },
    placeId: "ChIJMQYLY6NZWi0Rs0CCYihtmQQ",
    mapsViewUrl: "https://www.google.com/maps/place/?q=place_id:ChIJMQYLY6NZWi0Rs0CCYihtmQQ",
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=26.1384413,91.7995684&destination_place_id=ChIJMQYLY6NZWi0Rs0CCYihtmQQ",
    mapsEmbedSrc:
      "https://www.google.com/maps?q=26.1384413,91.7995684&z=15&output=embed",

    // TODO (owner): add the full, verified postal address. It stays hidden
    // from the page until it is filled in.
    fullAddress: null,

    // TODO (owner): only add landmarks with a distance/time you have
    // personally confirmed, e.g.:
    // { label: "Guwahati Railway Station", note: "Nearby" }
    // Do not estimate travel times — leave the "note" as a simple label
    // rather than a guessed distance unless it is confirmed.
    landmarks: [],
  },

  // ==========================================================================
  // 4. ROOMS / ACCOMMODATION — add one object per verified room type.
  //    Unset fields (occupancy, beds, amenities, price, image) are simply
  //    skipped on the card. Leave `price` as null until confirmed — the card
  //    will show "Price on enquiry" instead of a guessed figure.
  // ==========================================================================
  rooms: [
    // Duplicate this block for each confirmed room type and fill in only
    // what you know to be accurate:
    // {
    //   id: "deluxe-room",
    //   name: "Deluxe Room",
    //   occupancy: "2 Guests",
    //   beds: "1 Queen Bed",
    //   amenities: ["Attached Bathroom", "Free WiFi"],
    //   price: null,          // e.g. 2200 (₹ per night) once confirmed
    //   image: null,          // e.g. "images/gallery/deluxe-room-1.jpg"
    // },
  ],

  // ==========================================================================
  // 5. AMENITIES — list only what the owner or the property's Google Maps
  //    listing confirms. `icon` refers to a key in js/script.js's icon set
  //    (wifi, parking, ac, tv, kitchen, hotWater, breakfast, pets, security,
  //    familyFriendly, housekeeping, workspace) — extend that set if needed.
  // ==========================================================================
  amenities: [
    // { label: "Free WiFi", icon: "wifi" },
  ],

  // ==========================================================================
  // 6. GALLERY — these category placeholders always appear so the gallery
  //    layout looks complete from day one. Replace `image: null` with a real
  //    photo path as soon as one is available; add more objects for more
  //    photos in the same category. Do not add stock or AI-generated photos.
  // ==========================================================================
  gallery: [
    { id: "ext-1", category: "Exterior", label: "Homestay Exterior", image: null },
    { id: "ext-2", category: "Exterior", label: "Entrance & Frontage", image: null },
    { id: "bed-1", category: "Bedrooms", label: "Bedroom", image: null },
    { id: "bed-2", category: "Bedrooms", label: "Bedroom", image: null },
    { id: "bath-1", category: "Bathrooms", label: "Bathroom", image: null },
    { id: "common-1", category: "Common Areas", label: "Living / Common Area", image: null },
    { id: "common-2", category: "Common Areas", label: "Dining Area", image: null },
    { id: "area-1", category: "Surrounding Area", label: "Surrounding Area", image: null },
    { id: "area-2", category: "Surrounding Area", label: "Nearby View", image: null },
  ],

  // ==========================================================================
  // 7. GUEST REVIEWS — the whole section stays hidden until genuine,
  //    attributed reviews are added here. Never invent names, quotes or star
  //    ratings — only paste reviews the guest actually wrote, with correct
  //    attribution and source.
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
  // 8. FAQs — add a question any time, but only fill in `answer` once the
  //    owner has confirmed it. Unanswered questions stay hidden.
  // ==========================================================================
  faqs: [
    { id: "check-in-out", question: "What are the check-in and check-out times?", answer: null },
    { id: "parking", question: "Is parking available on site?", answer: null },
    { id: "meals", question: "Are meals included or available?", answer: null },
    { id: "pets", question: "Are pets allowed?", answer: null },
    { id: "cancellation", question: "What is the cancellation policy?", answer: null },
    { id: "booking", question: "How do I confirm a booking?", answer: null },
  ],

  // ==========================================================================
  // 9. POLICY LINKS — footer links appear only once a URL is provided.
  // ==========================================================================
  policies: {
    privacyUrl: null,
    bookingPolicyUrl: null,
  },
};
