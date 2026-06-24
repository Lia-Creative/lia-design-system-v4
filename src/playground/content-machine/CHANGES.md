# Content Machine — change ledger

Sandbox scope class: `.playground-content-machine`
Started: 2026-05-21
Brief: The machine-home / dashboard surface — the "container of tools" view. The
content pipeline (Strategy → Story → Dump → Create → Package → Distribute →
Learn) as connected tool cards, each with a one-line job and a status, plus a
calm "what's the next move" header. Quick Post surfaced as the live MVP path.
Source: Lia Vault `Inbox/2026-05-20-content-machine/` + the 2026-05-18
architecture meeting note.

## Ledger

| When | Bucket | Change | Status |
|------|--------|--------|--------|
| 2026-05-21 | structure | Prototype scaffolded (shell + tokens + story) | live |
| 2026-05-21 | primitive-new | Installed shadcn Badge (Pro registry path errored; used free shadcn fallback) and relocated it into `./components/badge.tsx` so it stays sandboxed until /design-review. Used for stage status (live / building / planned). | live |
| 2026-05-21 | token-tweak | `tokens.css`: scope `::before` desk-grain + `--v1-dark` paper-var override (shell pattern, not a Content-Machine-specific design choice). | live |
| 2026-05-21 | structure | v1: calm "next move" header + quiet status strip + seven numbered tool cards (Strategy → Learn) composed from Card/Badge/Button. | live |
| 2026-05-21 | structure | Fix: card metric line used `text-foreground` → invisible (black-on-black) on the off-black colour-mode paper. Switched to `text-card-foreground`. (Colour-mode paper only overrides `--card-foreground`, not `--foreground`.) | live |

## Buckets

- **token-tweak** — scoped override in `./tokens.css`. Stays local until backport.
- **primitive-fork** — copied a primitive from `src/components/ui/` into `./components/`. Stays local until backport.
- **primitive-new** — new component file in `./components/`. Stays local until promotion.
- **structure** — story/layout/copy changes to `index.stories.tsx`. Inherently prototype-only.

## Next /design-review

- **Badge** — promote to `src/components/ui/badge.tsx` (with a `.stories.tsx` and Code Connect mapping) if the system wants a stock Badge primitive, or keep sandboxed. It's the unmodified free-shadcn base-nova Badge; semantic tokens only, no raw colours.
