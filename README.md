# Bigelow Cooperative Daycare — Website

Public website for Bigelow Cooperative Daycare, a parent-cooperative childcare center in Somerville, MA serving children ages 3 months to 5 years.

- **Live:** https://bigelowcoop.org

---

## Stack

Static HTML, CSS, and JavaScript. No build step, no framework, no dependencies. Deployed via Netlify on push to `main`.

---

## Repo structure

```text
/
├── index.html                 # Home
├── about.html
├── programs.html
├── enrollment.html
├── schedule-a-tour.html
├── apply.html                 # Online application form
│
├── components/
│   ├── header.html            # Nav + announcement banner (injected via JS)
│   └── footer.html            # Site footer (injected via JS)
│
├── css/
│   ├── shared.css             # Tokens, reset, nav, footer, buttons, shared patterns,
│   │                          #   form styles, and info-block sidebar styles
│   ├── index.css
│   ├── about.css
│   ├── programs.css
│   ├── enrollment.css
│   ├── tour.css               # Layout for schedule-a-tour.html
│   └── application.css        # Layout for apply.html
│
├── js/
│   ├── site.js                # Component injection, nav, carousel, tabs, FAQ
│   ├── tour.js                # Tour form submission
│   └── application.js         # Application form submission
│
├── assets/
│   ├── favicon.ico
│   ├── favicon_32.png
│   ├── apple-touch-icon.png
│   └── images/
│
└── docs/                      # Architecture and design system documentation
```

---

## Component injection

The nav and footer are stored as shared HTML fragments in `/components`.

`site.js` fetches `components/header.html` and `components/footer.html` at runtime and injects them into the page placeholders. Because of this, the site should be developed using a local server — opening files directly via `file://` will not work.

Example:

Run a local server:

npx serve .

or

python3 -m http.server 8000

---

## CSS architecture

`shared.css` owns the global system: design tokens, reset, typography, buttons, nav, footer, CTA styles, section headings, partner blocks, the shared page-header pattern, all form field styles (`.form-group`, `.form-row`, `.checkbox-label`, validation states, success state, etc.), and the info-block sidebar pattern.

Page CSS files are additive and page-specific: they contain layout and components unique to that page, while shared patterns stay in `shared.css`.

Breakpoints:

- 1024px — wide layout collapse
- 860px — tablet
- 600px — mobile

---

## Deployment

Pushes to `main` are automatically deployed to Netlify. No build step or configuration required.
