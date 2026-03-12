# Architecture

## Component injection

The nav and footer are shared HTML fragments in `/components`. `site.js` fetches them at page load and inserts them into placeholder `<div>` elements:

```
fetch("components/header.html") → #site-nav-placeholder
fetch("components/footer.html") → #site-footer-placeholder
```

Because `fetch()` requires HTTP, the site must be served locally for development — opening HTML files via `file://` will fail. Use any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## CSS architecture

### shared.css owns the global system

- **Design tokens** — all custom properties in `:root`: color palette, typography scale, spacing scale, border radii, layout variables
- **Reset and base** — box model, typography defaults
- **Navigation and footer** — `.site-nav`, `.site-footer`, all sub-elements
- **Buttons** — `.btn`, `.btn-primary`, `.text-link`
- **CTA section** — `.cta-section`, `.cta-heading`, `.cta-sub`, `.cta-actions`
- **Section typography** — `.section-heading`, `.section-body`, `.section-body-wrap`
- **Eyebrow label** — `.label`
- **Partner block** — `.partner-block` (used on enrollment and programs)
- **Split layout utility** — `.split-layout` (see below)
- **Page header** — `.page-header`, `.page-heading`, `.page-sub`
- **Responsive overrides** for all of the above

### Page CSS files are strictly additive

Each page CSS file contains only layout and components unique to that page. If a pattern appears on more than one page, it belongs in `shared.css`.

| File             | Owns                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `index.css`      | Hero, cooperative model, programs teaser, space, outdoor, testimonials sections |
| `about.css`      | Split-layout sections for story, philosophy, coop, teachers, SomerPromise       |
| `programs.css`   | Classroom cards, schedule tabs, day-at-Bigelow section, HipKids callout         |
| `enrollment.css` | Enrollment steps, tuition tables, financial assistance, FAQ accordion           |
| `tour.css`       | Tour form, form validation states, success state, info sidebar                  |

---

## Design tokens

All tokens live in `:root` in `shared.css`.

**Colors**

- `--charcoal`, `--charcoal-mid`, `--charcoal-light` — text hierarchy
- `--terracotta`, `--terracotta-wash` — brand accent
- `--cream`, `--cream-dark` — warm backgrounds
- `--white` — card/section backgrounds

**Typography**

- `--font-display` — heading font (Fraunces)
- `--font-body` — body font (DM Sans)

**Spacing scale**

- `--sp-xs` through `--sp-2xl` — used for section padding and layout gaps
- `--sp-xl` and `--sp-2xl` reduce at 860px via `:root` override in the responsive block

**Layout**

- `--container-max` — max content width
- `--container-pad` — horizontal padding (reduces at 860px)
- `--nav-height` — used for sticky positioning offsets

---

## Split layout utility

`.split-layout` provides a shared two-column grid base:

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
```

Used alongside a page-specific class that provides the gap:

```html
<div class="split-layout coop-inner">
  <div class="split-layout about-split">
    <div class="split-layout day-inner"></div>
  </div>
</div>
```

Each responsive block in the page CSS handles the single-column collapse at 860px (`grid-template-columns: 1fr`).

---

## Breakpoints

| Breakpoint | Intent                                                                            |
| ---------- | --------------------------------------------------------------------------------- |
| `1024px`   | Wide layout collapse — multi-column grids narrow or adjust                        |
| `860px`    | Tablet — most grids go single-column, nav hamburger active, spacing tokens reduce |
| `600px`    | Mobile — form fields stack, font/padding reductions                               |
