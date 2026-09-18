# Brilliant Homestay — Owner Setup Guide

This file is for **you (the property owner/admin)**. It is not shown anywhere on
the public website. Everything a visitor sees is generated from **one file**:
`js/config.js`. You never need to touch the HTML, CSS, or JavaScript.

---

## 1. Add your WhatsApp number (do this first)

This is the single most important setting. Until it's added, every WhatsApp
button shows a friendly *"Almost ready"* notice instead of linking to a fake
number.

Open **`js/config.js`** and find the `contact` block near the top:

```js
contact: {
  whatsapp: null,   // e.g. "919876543210"
  phone: null,      // e.g. "+91 98765 43210"
  email: null,      // e.g. "stay@brillianthomestay.in"
},
```

Set `whatsapp` to your number in **international format, digits only**:

- Include the country code (India = `91`).
- **No** `+`, **no** spaces, **no** hyphens.
- Example: for `+91 98765 43210`, write `"919876543210"`.

```js
whatsapp: "919876543210",
```

`phone` and `email` are optional. If you add `phone`, a click-to-call button
appears; if you add `email`, an email button appears. The number lives **only
here** — it is not copied anywhere else.

---

## 2. Add / replace photographs

Your 5 uploaded photos are already placed in `images/gallery/` and wired in.

To **add more photos** or replace one:

1. Drop the image file into `images/gallery/` (JPG or PNG).
2. In `js/config.js`, point to it. In the `gallery` list, either replace an
   existing `image: null` placeholder or add a new entry:

   ```js
   { id: "ext-1", category: "Exterior", label: "Front of the homestay",
     image: "images/gallery/exterior-1.jpg" },
   ```

3. The **hero** and **About** images are set by `heroImage` and `aboutImage`
   further down the same file — change those paths to feature different photos.

Any gallery entry left as `image: null` shows an elegant "Photo coming soon"
placeholder, so the layout always looks complete. Categories are grouped
automatically into the gallery filter chips.

> Only use genuine photos of this property. Never use stock or unrelated images.

---

## 3. Confirm details (only add what's true)

Everything below is optional and **hidden until you fill it in**, so the public
page never shows a guess as a fact.

| What | Where in `js/config.js` | Notes |
|------|------------------------|-------|
| Full address | `location.fullAddress` | Copy it exactly from your Google listing. |
| Nearby landmarks | `location.landmarks` | Don't estimate travel times. |
| Room categories & rates | `rooms: [ ... ]` | See the example block. Leave `price: null` to show "Contact us for rates". Adding rooms also adds an "Accommodation preference" dropdown to the booking form. |
| Amenities | `amenities: [ ... ]` | Uncomment only the ones that are true. The whole Amenities section (and its nav link) stays hidden until at least one is added. |
| Guest reviews | `reviews: [ ... ]` | Paste only real, attributed reviews. Until then, the site shows a "Read our reviews on Google" link. |
| FAQ answers | `faqs: [ ... ]` | Fill in `answer:` once confirmed. Unanswered questions stay hidden. |
| Policy links | `policies` | Footer links appear once a URL is added. |

The map, coordinates, and Google Maps links are already set from your listing.

---

## 4. Reword the WhatsApp messages (optional)

The exact text sent to your WhatsApp lives in `messages` at the bottom of
`js/config.js`. You can reword it, but keep the `{room}` placeholder intact in
the accommodation template. The contact-form and booking-request wording is
fixed in the code so it always includes the visitor's details in a tidy format.

---

## 5. How the two forms work

- **Request a Booking** — collects name, phone, dates, adults/children (and room
  preference if you've configured rooms). It calculates the number of nights,
  blocks past dates, and requires check-out after check-in (validated in the
  property's timezone, **Asia/Kolkata**). It opens WhatsApp with a booking
  request. **It is not an instant booking** — the visitor's stay is only
  confirmed after you reply to confirm availability and price.
- **Send a Message** — a general contact form (name, phone, optional email,
  optional subject, message) that opens WhatsApp with the message pre-filled.

Both forms only **open WhatsApp with the message pre-filled** — the visitor must
still tap **Send** inside WhatsApp. The site never claims a message was sent just
because WhatsApp opened. Entered details are remembered if the visitor comes back
from WhatsApp.

---

## 6. Publishing

The site is plain HTML/CSS/JS — no build step. A GitHub Pages workflow is
included (`.github/workflows/deploy.yml`) and deploys on every push to the
project branch. To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 7. Still needed from you (flagged)

These could not be verified automatically and are left blank/configurable:

- [ ] **WhatsApp number** (`contact.whatsapp`) — required for all enquiry buttons.
- [ ] **Phone / email** (optional) — if you want call/email buttons too.
- [ ] **Full postal address** (`location.fullAddress`).
- [ ] **Room categories & prices** — currently shown as a general "Our rooms"
      section using your photos, with no invented room names or rates.
- [ ] **Amenities list** — none shown until you confirm them.
- [ ] **Check-in/check-out times, cancellation & guest policies** — add as FAQ
      answers (`faqs`).
- [ ] **Guest reviews** — only real, attributed reviews; Google link shown until then.
