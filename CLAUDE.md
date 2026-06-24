# Lia Design System v3 — AI Development Rules

Stack: Next.js 16 · Tailwind v4 · shadcn/ui (base-nova) · Base UI primitives · next-themes · Storybook 10 · Figtree / DM Mono / Libre Baskerville.

These rules are adapted from the v2 system's hard-won learnings. Where v3 diverges from v2 by design (shadcn conventions), that's flagged inline. Read first; ask second; write third.

---

## Golden Rule

**Never invent tokens or hard-code design values.** Use Tailwind theme variables (`bg-primary`, `text-foreground`, `rounded-lg`) and the semantic colour names defined in `src/app/globals.css`. If a token doesn't exist for what you need, **flag it — don't bypass the system**.

---

## Source of Truth

`src/app/globals.css` is the **only** place design tokens are authored. It defines **three layers**, and the layering is mandatory (see Aliasing Hierarchy):

1. **Primitives** — named colour ramps (`--olive-50…950`, `--lia-blue-500/600`, `--lia-sky-200/300`, `--lia-yellow-200`, `--lia-red-500/600`) in `:root`. **This is the only place a raw `oklch()` colour literal may appear.** Mirrors the Figma `colors/*` ramps (olive = `colors/olive/*`, brand = `colors/lia-*`).
2. **Semantic CSS vars** — `--background`, `--primary`, `--muted`, `--ring`, etc. — in `:root` (light) and `.dark` (dark). **Each MUST be `var(--<primitive>)`, never an inline literal.** These are the names components consume.
3. **Tailwind theme mapping** — the `@theme inline { ... }` block exposes the semantics to utility classes (`bg-primary` resolves to `var(--primary)`).

`design/lia-tokens.tokens.json` is a **mirror** of `globals.css` in Tokens Studio format. **It is not the source.** Regenerate it with `pnpm tokens:sync` after editing `globals.css`. Never hand-edit the JSON. The sync script (`scripts/tokens-from-css.mjs`) resolves the primitive `var()` chain back to literals when mirroring, so semantics-via-primitives stay sync-safe. (Font families are the one exception it can't read from CSS — `--font-sans: var(--font-figtree)` is a Next.js font-loader var — so `SHARED_FONT` is declared in the script; keep it in step with `layout.tsx`.)

> **v2 inversion noted:** v2 ran *JSON → CSS* (Tokens Studio was the source). v3 runs *CSS → JSON* because shadcn's convention is CSS-vars-first. The principle is the same — single source, one-way sync, no manual JSON edits.

---

## Aliasing Hierarchy — **THE RULE**

**Semantic tokens reference primitive ramps. Always. Everywhere. Code and Figma both.** A semantic token never holds a raw colour; it points at a named primitive. This is a hard invariant — it keeps code and Figma structurally identical and makes theme swaps a one-line change.

```
primitive ramp            →  semantic CSS var  →  Tailwind theme name  →  component utility
  --lia-blue-600             --primary             --color-primary          bg-primary
  (oklch literal lives here) (var(--lia-blue-600)) (var(--primary))         (resolves through)
```

The same chain in Figma:

```
colors/lia-blue/600        →  theme/primary        →  💨 Tailwind          →  component instance
  (raw hex lives here)        (ALIAS to colors/*)     (alias to theme/*)
```

Rules, non-negotiable:
- **Raw colour literals live ONLY in the primitive layer** — `--olive-*` / `--lia-*` in `globals.css`, `colors/*` ramps in Figma. Nowhere else.
- **Every semantic token is an alias.** Code: `--primary: var(--lia-blue-600)`. Figma: `theme/primary` is a `VARIABLE_ALIAS` to `colors/lia-blue/600`. **Never** inline a literal into a semantic token in either place.
- **No semantic-to-semantic chains.** A semantic aliases a *primitive*, not another semantic.
- **Neutrals → `olive` / `colors/olive/*`. Brand → `lia-*` / `colors/lia-*`.** Brand colours are bespoke (not Tailwind); the `colors/lia-*` ramps hold their exact values. The "colourful mode" palette (Purple/Blue/Amber) is stock Tailwind and already available as ramps/utilities — use those directly, don't duplicate.

When changing a colour:
1. Edit the **primitive** value (`--olive-200`, `--lia-blue-600`, …) in `globals.css`. Every semantic referencing it updates automatically. Only touch a semantic line to **re-point** it at a different primitive.
2. `pnpm tokens:sync` (resolves the `var()` chain → JSON mirror).
3. Propagate to Figma: write the new value to the matching `colors/*` ramp variable, then ensure `theme/*` still aliases it (see Figma Integration → MCP push rule).

**Never** hard-code a hex/oklch in a component file. **Never** put a literal in a semantic token.

---

## Component Architecture

### File Layout

```
src/
  app/                  Next.js App Router (layout, page, globals.css)
  components/ui/        shadcn primitives — co-located .tsx and .stories.tsx
  lib/                  utils (cn helper)
  hooks/                custom React hooks (when needed)
```

> **v2 divergence noted:** v2 split `primitives/compositions/layout/utils` under `src/ui/` with path aliases. v3 follows shadcn's flat `@/components/ui/` because that's what the registries (and shadcn/studio Pro) install into. Don't reintroduce the split.

### Reach for shadcn/studio Pro first

The shadcn/studio Pro registries are wired in `components.json` and the licence lives in `.env`. **Before scratch-building UI, check what's already in the catalogue.**

Resolution order when you need new UI:

1. **Block-level need** (hero, pricing, dashboard, feature grid, testimonials, CTA, footer, etc.) → install from `@ss-blocks`:
   ```bash
   pnpm dlx shadcn@latest add @ss-blocks/<name>
   ```
   Catalogue lives at https://shadcnstudio.com/blocks. Naming pattern: `<category>-<index>` (e.g. `hero-1`, `pricing-2`, `feature-3`). Block code installs into `src/components/blocks/` (creates the dir).

2. **Primitive-level need** (a single component not yet in the repo) → install from `@ss-components` first, fall back to free shadcn if missing:
   ```bash
   pnpm dlx shadcn@latest add @ss-components/<name>
   pnpm dlx shadcn@latest add <name>            # fallback if not in Pro
   ```

3. **Compose from existing primitives** if the new thing is mostly layout + a known atom.

4. **Scratch-build a new primitive** only when none of the above fit — and **only after asking** (see next subsection).

`@ss-themes` exists too but we have our own Lia theme — don't install from it without explicit reason.

### Creating or Modifying Components — **ASK FIRST**

Adapted from v2 verbatim, because this is the rule that prevents drift:

**Never create a new component, modify an existing component, or build a one-off version of an existing component without asking first.** This includes:

- Creating a new component in `src/components/ui/`
- Adding new props or variants to an existing component
- Building an inline/one-off version of something that already exists (e.g. a hand-rolled card in a page file instead of `<Card>`)
- Adding new utility helpers in `src/lib/`

**Instead, ask:**
1. "This page needs X behaviour that the existing Y component doesn't support. Should I update the Y component to add this, or is there a different approach you'd prefer?"
2. "I don't see an existing component for X. Should I install it from shadcn (`pnpm dlx shadcn add ...`), pull from the `@ss-components` Pro registry, or compose it from existing primitives?"

**Goal:** zero component drift. Every UI atom lives in `src/components/ui/` and is reusable.

### Component Pattern

Components use **Base UI primitives** (`@base-ui/react/*`) wrapped with `class-variance-authority` (cva) for variants and `cn()` for className composition. Pattern:

```tsx
import { Component as ComponentPrimitive } from "@base-ui/react/component"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base-classes", {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
})

function Component({ className, variant, ...props }: ComponentPrimitive.Props & VariantProps<typeof componentVariants>) {
  return <ComponentPrimitive data-slot="component" className={cn(componentVariants({ variant, className }))} {...props} />
}
```

### Dark Mode

> **v2 divergence noted:** v2 forbade `dark:` in components — dark mode lived only in tokens. v3 uses shadcn's convention: `dark:` Tailwind variants are allowed in components when the semantic token can't carry the difference (e.g. opacity tweaks, ring contrasts).

The `next-themes` `ThemeProvider` toggles `class="dark"` on `<html>`. Stories use a Storybook toolbar that does the same. **Never** use `prefers-color-scheme` directly — it bypasses the toggle.

### Polymorphism

Base UI primitives accept a `render` prop for polymorphism (`<TooltipTrigger render={<Button .../>} />`). Use that instead of building wrapper components. **Never** prop-spread to mimic this.

---

## Storybook

Storybook is the **live component reference**. Source of truth is code; Figma is the design surface that round-trips.

### Story Conventions

Adapted from v2. **Follow them.**

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./button"

const meta = {
  title: "Lia Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: { /* ... */ },
  args: { /* ... */ },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: "Default" }
export const StoryVariants: Story = { name: "Variants", render: () => /* ... */ }
```

Rules:
- **Title hierarchy:** `Lia Primitives/`, `Lia Compositions/`, `Lia Layout/` (mirroring v2's `SDS Primitives/` etc.).
- **Export naming:** `Story{Variant}` (e.g. `StoryDefault`, `StoryVariants`). The visible name comes from `name:`.
- **Always set `parameters: { layout: "centered" }`** on the meta unless the story is intentionally full-bleed.
- **Theme via toolbar** — the Lia light/dark globalType is in `.storybook/preview.tsx`. Don't add per-story theme overrides.

### What Stories Cover

Per component: at minimum `StoryDefault`. Then variant matrices, sizes, disabled/loading/invalid states, and any composition that's load-bearing for a downstream surface.

---

## Playground — the sandbox

`src/playground/` holds prototype surfaces. Each prototype is a folder with **true sandboxing** — token tweaks, primitive forks, and new components live scoped to that one prototype until explicitly backported at `/design-review`. Nothing in the playground reaches the rest of the system without approval.

Full architecture in [src/playground/README.md](src/playground/README.md). Two operational rules apply when working inside a prototype session:

### Rule 1: Never bypass the sandbox

During a `/prototype` session, you (the agent) **must not**:

- Edit `src/app/globals.css` directly — token tweaks go in the prototype's `./tokens.css` under the `.playground-<slug>` scope class.
- Edit any file in `src/components/ui/` directly — primitive tweaks go via a fork at `./components/<name>.tsx`, with the prototype's import path updated.
- Create files in `src/components/ui/` for prototype-driven new components — new primitives live in `./components/` and only graduate to `src/components/ui/` at `/design-review`.

If the user asks you to do any of the above, push back: "this'd bypass the sandbox — want me to scope it to the prototype first via `tokens.css` / a fork?"

### Rule 2: Maintain the CHANGES.md ledger

Every change made during a prototype session gets a row appended to `src/playground/<slug>/CHANGES.md`. Don't ask before updating the ledger — just do it. Use the bucket vocabulary defined in the ledger itself (`structure`, `token-tweak`, `primitive-fork`, `primitive-new`).

### Slash commands

- `/prototype <name> <brief>` — scaffold a new prototype with the sandbox wiring.
- `/design-review` — triage everything in `src/playground/<name>/`: backport to system, keep sandboxed, or revert.

---

## Figma Integration

### Tokens Studio Round-Trip

- **Figma file:** [Lia Design System (shadcn studio)](https://www.figma.com/design/0b2h7j9vYI2mnW9ARPjour/Lia-Design-System--shadcn-studio-) — key `0b2h7j9vYI2mnW9ARPjour`
- **Code → Figma:** Edit `globals.css` → `pnpm tokens:sync` → commit → push → Tokens Studio "Pull from GitHub" in Figma
- **Figma → Code:** Never. Figma reads from code. If you need a new token, edit `globals.css`.

### Code Connect

- Mappings live in `src/figma/` as `*.figma.tsx` (only create these when explicitly hooking a component to Figma).
- Config: `figma.config.json` at repo root, with `documentUrlSubstitutions` mapping component slugs to Figma node URLs.
- File key is currently in the config; **never** hard-code file keys in `.figma.tsx` files — use the substitution placeholders.

### Code → Figma Propagation

There's no single "press a button and Figma updates" path. Match the propagation method to the change:

| Change type | Path | Effort |
| --- | --- | --- |
| **Theme tokens** (colour, radius, shadow, font in `globals.css`) | `pnpm tokens:sync` → commit + push → in Figma, Tokens Studio plugin "Pull from GitHub" → variables update → every component using them re-renders | Mostly automatic |
| **Using a stock shadcn/studio component or block as-is** | Already lives in the shadcn/studio Figma kit — designer drops the matching Figma instance | No propagation needed |
| **Modifying a stock component** (new variant, prop, layout) | Designer mirrors the change in Figma manually. Add/update a Code Connect mapping in `src/figma/<name>.figma.tsx` so Figma Dev Mode shows the updated code snippet. | Manual visual, automatic dev handoff |
| **Brand new component** (not in shadcn/studio) | Build in code → create matching Figma component (manually or scaffold via Figma MCP for simple cases) → add Code Connect mapping in `src/figma/<name>.figma.tsx` + a node URL in `figma.config.json`'s `documentUrlSubstitutions` | Manual with optional MCP assist |

The honest reality: **Code → Figma push is hard.** Figma's data model (auto-layout, variants, instances, modes) doesn't 1:1 map to React. MCP variable writes work; MCP collection mutations silently fail; component-level pushes need babysitting. Bias toward customising **tokens** (which auto-flow) and **using stock components** (which are already paired) over scratch-building structural variants.

If a design surface needs pixel-perfect "show me exactly what the code renders" parity in Figma, consider `story.to.design` as an optional add-on — it renders Storybook stories into Figma frames. Not currently installed; ask before adding.

### MCP push rule — **push aliases, never raw values**

The canonical code→Figma path for theme updates is **direct MCP variable writes** (Tokens Studio "Pull from GitHub" makes a *parallel* collection rather than updating the live alias chain, so it's not the path). When pushing via MCP, mirror the Aliasing Hierarchy exactly:

- **Write raw hex ONLY into the primitive ramps** — `colors/olive/*`, `colors/lia-*`. These are the Figma equivalent of the `--olive-*` / `--lia-*` primitives in `globals.css`.
- **`theme/*` variables must stay aliases** — each `theme/<name>` (and `theme/<name>-dark`) is a `VARIABLE_ALIAS` pointing at a `colors/*` primitive. **Never** write a raw colour into a `theme/*` variable; that breaks the chain and de-syncs from code. If a push left raw hex in `theme/*`, re-alias it to the matching primitive.
- **File structure:** `☀️ Mode` (theme/* light+dark, aliases into Themes) → `🚀 Themes` Default mode (theme/* + theme/*-dark, alias into `colors/*`) → `💨 Tailwind` (`colors/*` primitives hold the raw values). Write targets for a code push are the `colors/*` ramp variables; the `theme/*` aliases above them then resolve automatically.
- **Fonts** live in `🚀 Themes` Default: `font family/font-sans|serif|mono`. Setting a font-family STRING var forces Figma to load every font the bound text uses — `loadFontAsync` the families first or the write throws.

### MCP Write-Path Reliability (carried from April 24 learnings)

When writing variables to Figma via MCP (`setValueForMode`, `createVariable`):
- **Parallel single-write calls in batches of ~5** is the only reliable path.
- **Creating variables** inside an existing collection works; **collection-level mutations** (`addMode`, `renameMode`, `createCollection`) silently fail — do them manually in Figma. `loadAllPagesAsync` is unsupported in the MCP sandbox.
- **`setValueForMode` / `createVariable` commit even when the tool reports timeout or "connection lost"** — always re-read to verify before assuming failure or retrying.
- **`getLocalVariablesAsync` returns local variables only** — imported/linked library variables show in the Variables panel but aren't enumerable locally (resolve individual ones by ID). Don't conclude a variable is "missing" without accounting for imported libraries.
- Back up before bulk writes. See personal-vault `_meta/inbox/figma-mcp-variable-writes-learnings-2026-04-24.md` for diagnostics.

---

## Impeccable (vendored design-language skill)

The repo carries a vendored copy of [Impeccable](https://github.com/pbakaus/impeccable) at `.claude/skills/impeccable/` (Apache 2.0, see `LICENSE` + `NOTICE.md` in that folder). It's a design-language skill that gives Claude better defaults for typography, colour, motion, spatial design, interaction, responsive behaviour, and UX writing — plus 23 commands accessed via `/impeccable <command>`:

`craft`, `teach`, `document`, `extract`, `shape`, `critique`, `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`.

When working in this repo, prefer reaching for these where they fit — e.g. `/impeccable critique` on a Playground prototype, `/impeccable polish` before promoting a primitive at `/design-review`, `/impeccable harden` on edge cases before a prototype ships. Don't override Impeccable's anti-patterns silently — if something contradicts Lia's deliberate choices (e.g. Figtree being a "common" sans-serif), surface the conflict.

Update notes + provenance live in `.claude/skills/impeccable/VENDORED.md`.

---

## Deployment

`vercel.json` enforces `framework: null` + `nodeVersion: 20.x` to prevent the v1→v2 deploy crisis (Vite auto-detection + Node 24 caused silent build failures). **Do not remove these settings** without understanding why they exist.

---

## What NOT to Do

1. **Never use raw colour values** (`#fff`, `rgb()`, `hsl()`, raw `oklch()`) inside components. Use Tailwind utilities backed by semantic tokens.
2. **Never put a raw colour literal in a semantic token** (code or Figma). Literals live only in the primitive layer (`--olive-*`/`--lia-*`, `colors/*`); semantics alias primitives. See Aliasing Hierarchy.
3. **Never edit `design/lia-tokens.tokens.json` by hand** — regenerate via `pnpm tokens:sync`.
4. **Never use `prefers-color-scheme`** — dark mode is class-based via `next-themes`.
5. **Never invent new components** without asking. Use the registries first, the primitives second.
6. **Never hard-code Figma file keys** in `.figma.tsx` mappings — use the substitution placeholders.
7. **Never commit `.env`** — shadcn/studio Pro credentials live there.
8. **Never reintroduce the `primitives/compositions/layout` folder split** — shadcn flat structure is intentional.
9. **Never skip the `data-slot="..."` attribute** when wrapping a Base UI primitive — Storybook autodocs and downstream selector hooks rely on it.

---

## Linked References

- Personal vault: `01 Wiki/clients/lia.md` (project state), `01 Wiki/tools/` for tool pages
- Personal vault: `01 Wiki/sources/session-2026-04-18-lia-v2-handover.md` (v2 architecture decisions still in play)
- Personal vault: `01 Wiki/sources/session-2026-04-24-lia-design-system-v3-build.md` (v3 origin)
- Personal vault: `01 Wiki/sources/session-2026-05-18-lia-ds-v3-storybook-and-org-move.md` (this version's setup)
- Lia Vault: `Products/Design System/Context/design-system-state-2026-05-18.md` (canonical state)
