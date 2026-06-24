# Lia Design System v3

The Lia design system. Next.js 16 + Tailwind v4 + shadcn/ui (base-nova) + Base UI primitives.

- **Live:** [storybook.lia.build](https://storybook.lia.build) (production), [lia-design-system-v3.vercel.app](https://lia-design-system-v3.vercel.app) (Vercel alias)
- **Figma:** [Lia Design System (shadcn studio)](https://www.figma.com/design/0b2h7j9vYI2mnW9ARPjour/Lia-Design-System--shadcn-studio-) — file key `0b2h7j9vYI2mnW9ARPjour`
- **Repo:** [Lia-Creative/lia-design-system-v3](https://github.com/Lia-Creative/lia-design-system-v3)
- **Tokens source of truth:** `src/app/globals.css` (oklch CSS vars). Tokens Studio JSON mirror at `design/lia-tokens.tokens.json` for Figma round-trip.

## Develop

```bash
pnpm install
pnpm dev          # Next.js dev server on :3000
pnpm storybook    # Storybook on :6006
```

## Figma ↔ code sync

See [`design/README.md`](design/README.md) for the Tokens Studio round-trip workflow. Single source of truth is `globals.css`; the JSON file is regenerated from it.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 |
| Styling | Tailwind v4 |
| Components | shadcn/ui (base-nova) on Base UI primitives |
| Theming | `next-themes`, `class="dark"` on `<html>` |
| Fonts | DM Sans / DM Mono / Libre Baskerville via `next/font` |
| Icons | Lucide |
| Notifications | Sonner |
| Component workshop | Storybook (Vite builder) |

## shadcn/studio registries

Pro registries (`@ss-components`, `@ss-themes`, `@ss-blocks`) are wired in `components.json`. Add `EMAIL` and `LICENSE_KEY` to `.env` (gitignored) to install from them.
