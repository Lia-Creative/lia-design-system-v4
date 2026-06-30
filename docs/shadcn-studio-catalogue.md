# shadcn/studio Pro catalogue (base-nova)

The full set of Pro items available to install into the DS. **986 items** under
the `base-nova` (Base UI) style, served by all three `@ss-*` registry aliases.

> **Don't guess slugs.** The slugs are `<type>-NN` (e.g. `navigation-menu-09`,
> `button-12`) and only show on each item's "Copy CLI" button on the site.
> Enumerate them instead:
>
> ```bash
> set -a; . ./.env; set +a            # EMAIL + LICENSE_KEY for the registry params
> pnpm dlx shadcn@latest search @ss-components            # lists all 986
> pnpm dlx shadcn@latest search @ss-components --limit 100 --offset 200
> # filter:  ... | grep -i navigation
> ```
>
> Install:  `pnpm dlx shadcn@latest add @ss-components/<slug> -y`

## Registry config (corrected)

shadcn studio moved to **style-in-path** URLs (`/r/<style>/{name}.json`). The old
`/r/blocks|components|themes/{name}.json` form is rejected ("invalid style") — that
silently broke every Pro install/search before 2026-06-30. `components.json` now uses:

```
"@ss-components" | "@ss-blocks" | "@ss-themes":
  url: "https://shadcnstudio.com/r/base-nova/{name}.json"
```

All three resolve the same `base-nova` catalogue; the item *name* carries the type.

## What's available, by type (variant count)

**Already shipped in our DS:** accordion, alert, avatar, badge, button, card,
checkbox, dialog, input, label, radio-group, select, separator, slider, sonner,
switch, table, tabs, textarea, tooltip (+ chart, logo, theme-toggle, bar-chart-figure).

**Primitives / components available to add:**
navigation-menu (9) · dropdown-menu (16) · popover (15) · sheet (7) · drawer (15) ·
command (14) · combobox (14) · data-table (13) · calendar (25) · date-picker (13) ·
pagination (15) · breadcrumb (8) · skeleton (12) · progress (23) · toggle (14) ·
toggle-group (16) · collapsible (10) · scroll-area (6) · context-menu (9) ·
menubar (8) · form (10) · autocomplete (10) · input-otp (10) · phone-input (9) ·
input-mask (6) · button-group (16) · stepper (12) · spinner (10) · rating (8) ·
kbd (8) · code-block (7) · aspect-ratio (7) · resizable (9) · carousel (12) ·
list (10) · sortable (5) · kanban (4) · typography (15)

**Sections / page blocks:**
hero-section · cta-section · features-section · pricing-component · faq-component ·
testimonials-component · statistics-component · social-proof · logo-cloud ·
team-section · blog-component · gallery-component · footer-component ·
navbar-component · timeline-component · file-upload · empty-state · waitlist ·
widget-component · compare · product-list

**App shells / dashboard:**
application-shell · dashboard-shell · dashboard-sidebar · dashboard-header ·
dashboard-footer · dashboard-dialog · dashboard-dropdown · account-settings ·
onboarding-feed

**Auth / full pages:**
login-page · register · forgot-password · reset-password · verify-email ·
two-factor-authentication · contact-us-page · about-us-page

**Themes (`@ss-themes`, design-language presets):**
modern-minimal · clean-slate · elegant-luxury · corporate · neo-brutalism ·
material-design · art-deco · midnight-bloom · sunset-horizon · pastel-dreams ·
marshmallow · nature · summer · caffeine · ghibli-studio · claude · spotify ·
slack · perplexity · valorant · marvel · vs-code

_Regenerate this list anytime with the `search` commands above. Counts captured 2026-06-30._
