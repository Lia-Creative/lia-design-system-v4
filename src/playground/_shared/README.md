# Playground shared

Tools used by playground prototypes. Not part of the production design system.

## What lives here

Anything that helps you iterate inside the sandbox but shouldn't ship to consumers of `@/components/ui/`. Versioning chrome, comparison harnesses, prototype-only utilities.

## VersionTabs

`version-tabs.tsx` keeps every iteration of a prototype side-by-side. Each prototype's `index.stories.tsx` wraps its content in `<VersionTabs versions={[…]} />`. The selector renders as a native `<select>` dropdown in the sticky header — the file name kept `VersionTabs` for backward-compat with import sites, but the UI is a dropdown now (the previous horizontal tab strip overflowed once the version count climbed).

### Convention

- **v1 is the baseline.** Once shipped, don't edit it. Every later version is added alongside it so the baseline stays comparable.
- **New iterations get added as v2, v3, …** with a short `note` describing the delta ("Figtree + paper shadow", "denser layout", "warmer palette").
- **Default tab is the latest version** unless `defaultId` overrides it.

### Where the visual delta lives

Versions can differ in any combination of:

| Layer | Lives in | Best for |
| --- | --- | --- |
| Scoped tokens | `tokens.css` under `.playground-<slug>--v<n>` | Font, colour, radius, shadow — anything driven by CSS vars or descendant selectors |
| JSX | The version's `render` callback returns different markup | Structural or content changes between versions |
| Mixed | Both | Most real iterations |

The cleanest comparison is when **the JSX is identical and only the scoped tokens differ** — the difference is then purely about the design language, not the layout.

### Example

```tsx
import { VersionTabs } from '../_shared/version-tabs'

function Surface({ scopeClass }: { scopeClass: string }) {
  return (
    <div className={`${scopeClass} min-h-svh bg-background`}>
      { /* prototype content */ }
    </div>
  )
}

function Prototype() {
  return (
    <VersionTabs
      versions={[
        {
          id: 'v1',
          label: 'v1',
          note: 'baseline',
          render: () => <Surface scopeClass="playground-thing playground-thing--v1" />,
        },
        {
          id: 'v2',
          label: 'v2',
          note: 'Figtree + paper shadow',
          render: () => <Surface scopeClass="playground-thing playground-thing--v2" />,
        },
      ]}
    />
  )
}
```

With matching scoped overrides in `tokens.css`:

```css
.playground-thing {
  /* Re-resolve inherited properties so the per-version --font-sans
     override actually applies. See "Gotcha" below. */
  font-family: var(--font-sans);
}

.playground-thing--v1 { /* baseline, untouched */ }

.playground-thing--v2 {
  --font-sans: 'Figtree', ui-sans-serif, system-ui, sans-serif;
}

.playground-thing--v2 [data-slot="card"] {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

### Gotcha — inherited properties don't re-resolve from CSS vars

Globals.css applies `font-sans` at `<html>`. The `font-sans` utility resolves to `font-family: var(--font-sans)` at the element where it's declared. That means `<html>`'s `font-family` computes to the resolved DM Sans value, and every descendant inherits the computed value, not the variable reference. A `--font-sans` override on `.playground-<slug>--v2` is **invisible** unless something inside that scope has its own `font-family: var(--font-sans)` declaration to re-trigger the lookup.

The fix, already baked into the `/prototype` scaffold: declare `font-family: var(--font-sans)` on the shared `.playground-<slug>` scope. The same pattern applies to any inherited property whose token you want to scope-override — `color` (text-foreground on body), `background-color` (bg-background on body), etc. Add the equivalent re-declaration if you go to override those tokens.
