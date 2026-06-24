# Welcome — change ledger

Sandbox scope class: `.playground-welcome`
Started: 2026-05-18

## Ledger

| When | Bucket | Change | Status |
|------|--------|--------|--------|
| 2026-05-18 | structure | Prototype created from initial showcase | live |
| 2026-05-20 | structure | Retrofitted onto shared `<PrototypeShell>` — now has light/dark/colour modes + remix by default. Value cards spread `cardPaperStyle(i)` in colour mode. | live |
| 2026-05-20 | token-tweak | `tokens.css`: added scope `::before` desk-grain + `--v1-dark` paper-var override (shell pattern, not a Welcome-specific design choice). | live |

## Buckets

- **token-tweak** — scoped override in `./tokens.css`. Stays local until backport.
- **primitive-fork** — copied a primitive from `src/components/ui/` into `./components/`. Stays local until backport.
- **primitive-new** — new component file in `./components/`. Stays local until promotion.
- **structure** — story/layout/copy changes to `index.stories.tsx`. Inherently prototype-only.

## Next /design-review

Pending. No backports proposed yet.
