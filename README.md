# Bigelow Cooperative Daycare — Website

Public website for Bigelow Cooperative Daycare, a parent-cooperative childcare center in Somerville, MA serving children ages 3 months to 5 years.

- **Live:** https://bigelowcoop.org

---

## Stack

[Eleventy](https://www.11ty.dev/) (v3) static site generator with Nunjucks templating. Deployed via Netlify on push to `main`.

---

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`. Watches for file changes and reloads automatically.

```bash
npm run build    # Production build → public/
npm run format   # Format all files with Prettier
```

---

## Repo structure

```text
src/
├── _data/
│   ├── client.json            # Site-wide contact info, URLs, social links
│   └── site.json              # Analytics ID, default OG image, default description
│
├── _includes/
│   ├── layouts/
│   │   └── base.html          # Base layout: <head>, GA, meta/OG tags, header, footer
│   └── components/
│       ├── header.html        # Nav + announcement banner
│       └── footer.html        # Site footer
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
│   ├── site.js                # Nav, carousel, tabs, FAQ accordion
│   ├── tour.js                # Tour form submission
│   └── application.js         # Application form submission
│
├── assets/
│   ├── favicon.ico
│   ├── favicon_32.png
│   ├── apple-touch-icon.png
│   └── images/
│
├── sitemap.xml
├── robots.html                # Renders to /robots.txt
│
├── index.html
├── about.html
├── programs.html
├── enrollment.html
├── schedule-a-tour.html
├── apply.html
├── application-confirmed.html
└── 404.html

public/                        # Build output — gitignored
```

---

## Templates

Each page extends the base layout using Nunjucks template inheritance:

```html
---
title: Page Title | Bigelow Cooperative Daycare
description: Page description for SEO.
ogImage: /assets/images/bigelow-building.webp
---

{% extends "layouts/base.html" %} {% block head %}
<link rel="stylesheet" href="/css/page.css" />
{% endblock %} {% block body %}
<!-- page content -->
{% endblock %}
```

Front matter variables available: `title`, `description`, `ogImage`, `noindex`, `mainClass`, `permalink`.

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

Pushes to `main` are automatically deployed to Netlify. The build command is `npm run build` and the publish directory is `public/`. Netlify handles asset cache-busting automatically.
