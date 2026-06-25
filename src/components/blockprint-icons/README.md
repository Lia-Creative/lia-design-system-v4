# Block-print icons

The **expressive** Lia icon set — 1,512 block-print icons derived from Phosphor
Fill, rendered as `currentColor`-tintable masked SVGs with transparent stamp
cutouts.

> Use these for expressive moments: empty states, onboarding, feature cards,
> editorial/brand personality, larger hero moments. **Keep crisp Phosphor/Lucide
> icons** for dense controls, nav, tables, form controls and menus — anything
> that needs fast operational scanning. This is not the default control-icon set.

## Usage

Direct named imports (tree-shakeable — only what you import is bundled):

```tsx
import { BlockprintHouseIcon } from "@lia/design-system/blockprint-icons"

export function Empty() {
  return <BlockprintHouseIcon className="size-16 text-foreground" />
}
```

- Colour follows CSS `currentColor` — tint with `text-*` (`text-primary`,
  `style={{ color: "var(--lia-orange)" }}`, etc.).
- Default size is `1em` (scales with font-size); override with `size-*`.
- Decorative by default (`aria-hidden`). Pass `title` (or `aria-label`) to make
  it meaningful: `<BlockprintHeartIcon title="Loved" />`.
- The icon name list is available for pickers: `import { blockprintIconNames }`.

## Notes

- **Server-component safe.** The factory uses no hooks / no `"use client"`, so
  icons render as zero-JS server components (ideal in RSC/MDX). This is a
  deliberate deviation from the handover's `useId` suggestion: each icon's mask
  id is **name-scoped** (`bp-<name>`), so it's globally unique per icon and
  rendering the same icon many times is correct (the duplicated masks are
  identical). If you ever need strictly-unique DOM ids on one page, pass
  `idSuffix`.
- Not re-exported from the main `@lia/design-system` barrel — import from the
  `/blockprint-icons` subpath to keep the main barrel light.

## Regenerating

Components are generated from the cleaned source SVGs:

```bash
# default source: lia-blockprint-icons/output/final/svg-currentcolor
node scripts/generate-blockprint-icons.mjs
# or point at another export:
BLOCKPRINT_SRC=/path/to/svg-currentcolor node scripts/generate-blockprint-icons.mjs
```

This rewrites `generated/` (one module per icon) and `blockprint-icon-names.ts`.
Hand edits to those files are overwritten — change the generator or the source
SVGs instead.
