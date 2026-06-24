---
description: Scaffold a new Playground prototype with true sandboxing
---

# /prototype — Start a sandboxed prototype

Bootstrap a new prototype in `src/playground/<name>/` with the sandbox architecture wired up. The user's argument names what they want to build.

Read [CLAUDE.md](../../CLAUDE.md) and [src/playground/README.md](../../src/playground/README.md) first — they define the sandbox architecture, scoping rules, and the resolution order for new UI (`@ss-blocks` first, then primitives, then ask).

## Impeccable design fluency

This command runs through Impeccable's design defaults. **Load these reference files in addition to the standard setup**:

- `.claude/skills/impeccable/SKILL.md` — the index and routing logic
- `.claude/skills/impeccable/reference/craft.md` — shape-then-build flow (matches our `/prototype` shape exactly)
- `.claude/skills/impeccable/reference/typography.md`, `color-and-contrast.md`, `spatial-design.md` — the three baseline domain refs every prototype touches
- `.claude/skills/impeccable/reference/product.md` (since prototypes are product surfaces, not brand surfaces)

If the brief implies any of these specifically, additionally load:

| Brief signal | Also load |
| --- | --- |
| "animations", "transitions", "motion", "scroll-driven" | `reference/motion-design.md` |
| "form", "settings", "checkout", "auth flow" | `reference/interaction-design.md` + `reference/harden.md` |
| "mobile", "responsive", "breakpoint" | `reference/responsive-design.md` |
| "empty state", "onboarding", "first-run" | `reference/onboard.md` |
| "copy", "microcopy", "error states", "labels" | `reference/ux-writing.md` + `reference/clarify.md` |

Apply Impeccable's anti-pattern guidance throughout. Specifically refuse to:
- Default to Inter, Arial, or system sans — Lia uses DM Sans (already wired)
- Use pure black or pure white anywhere — always tint (already wired via oklch)
- Nest cards inside cards
- Use gray text on coloured backgrounds
- Use bounce/elastic easing

## What to do

1. **Parse the user's intent** from the slash-command argument:
   - Extract a **slug** (kebab-case, used as the folder name and scope class): e.g. `musician-profile`, `epk-builder`, `tour-dashboard`
   - Extract a **display name** (Title Case, used in the Storybook title): e.g. `Musician Profile`, `EPK Builder`, `Tour Dashboard`
   - Capture the **brief** (what should be on the page) — even if vague, write it down.

2. **Confirm the slug + display name + brief** with the user before creating files. One short message, expecting "yes" or a correction.

3. **Scaffold the folder**:

   ```
   src/playground/<slug>/
   ├── index.stories.tsx     Storybook story. Renders <VersionTabs versions={[v1, …]} />. Imports ./tokens.css.
   ├── tokens.css            Scoped overrides under .playground-<slug>--v<n>
   ├── components/.gitkeep   Forked + new primitives go here
   └── CHANGES.md            Ledger seeded with the prototype's creation row
   ```

   `index.stories.tsx` should:
   - Use Storybook title `Playground/<Display Name>`
   - Use `parameters: { layout: 'fullscreen' }`
   - **Wrap every version's content in `<PrototypeShell slug="<slug>" version="v<n>">`** (imported from `'../_shared/prototype-shell'`). The shell is the default Lia app frame — it gives the prototype the Lia logo top-left and the tri-state mode toggle (light / dark / colour) + colour-mode Remix top-right, automatically. Don't hand-roll a logo or theme toggle; the shell owns them.
   - Put the page body in a separate component (e.g. `<FooBody>`) rendered as the shell's children, so it can call `usePrototypeShell()` to read `cardPaperStyle(i)` and spread it onto Card `style` props (colour mode tints cards; light/dark return `{}`).
   - Pass any extra header buttons via the shell's `headerActions` prop (they render left of the mode controls).
   - Wrap the whole thing in `<VersionTabs versions={[…]} />` (from `'../_shared/version-tabs'`). Seed with a single `v1`. Future iterations add `v2`, `v3`, … alongside — never overwrite `v1`. Each version's `render` returns `<PrototypeShell … version="vN"><FooBody /></PrototypeShell>`.
   - Import `./tokens.css` near the top.
   - Compose existing primitives from `@/components/ui/` — DO NOT scratch-build UI. Paper craft (tilt, scissor corners, grain) is automatic at the Card/Button primitive level — don't re-implement it.
   - If the brief implies a block-level pattern (hero, pricing, dashboard, testimonials, footer, feature grid, etc.), **install from `@ss-blocks` before building**: `pnpm dlx shadcn@latest add @ss-blocks/<block-name>`. Use the installed block as the structural base, then compose/swap primitives as needed.

   `tokens.css` should seed with the scope desk-grain (every shell-based prototype needs this so the desk gets paper texture in colour mode, where the opaque tinted desk covers `body::before`), plus the dark paper-var override:
   ```css
   /* Desk grain owned by the scope (the shell's tinted/opaque desk covers
      body::before). Mirrors the body recipe, reads the scope's own --paper-*
      vars — which the shell sets inline per colour-mode paper. */
   .playground-<slug>::before {
     content: '';
     position: absolute;
     inset: 0;
     background-image: url('/paper-texture.jpg');
     background-size: 600px 600px;
     background-repeat: repeat;
     filter: var(--paper-filter, saturate(0) contrast(1.15));
     mix-blend-mode: var(--paper-blend, multiply);
     opacity: var(--paper-opacity, 0.55);
     pointer-events: none;
     z-index: 0;
   }
   .playground-<slug> > * { position: relative; z-index: 1; }

   /* Dark: invert + screen-blend the grain. The shell adds `dark` to the scope
      div itself, so target the version scope directly (not a `.dark` ancestor). */
   .playground-<slug>--v1-dark {
     --paper-blend: screen;
     --paper-opacity: 0.7;
     --paper-filter: saturate(0) contrast(1.15) invert(1);
   }

   /* Per-version visual deltas go here, scoped under .playground-<slug>--v<n>. */
   .playground-<slug>--v1 { /* baseline, untouched after first ship */ }
   ```

   See `src/playground/welcome/` for a worked reference of this exact shape.

4. **Working rules during the session** (state these to the user once, then follow them):

   - **For token tweaks**: edit `./tokens.css` only. Never `src/app/globals.css`. Override under `.playground-<slug>--v<n>` (and `.dark .playground-<slug>--v<n>` for dark mode). The shared `.playground-<slug>` scope is for things that apply across every version; per-version deltas always nest under the version scope.
   - **For new iterations (v2, v3, …)**: never edit v1 after it's shipped. Add a new version entry to the `versions` array in `index.stories.tsx` with a fresh `id`, `label` (`'v2'`), and `note` describing the delta. Add matching scoped rules under `.playground-<slug>--v<n>` in `tokens.css`. Keep the JSX identical across versions unless the iteration genuinely is structural — that way comparison stays about the design language. The latest version becomes the default tab automatically.
   - **For primitive tweaks**: ask the user first ("can I fork Button into this prototype's components/ to add X?"). On approval: copy `src/components/ui/<name>.tsx` → `./components/<name>.tsx`, modify, swap the import in `index.stories.tsx`. Never edit `src/components/ui/` directly.
   - **For new primitives**: ask the user first. On approval: create the new component in `./components/<name>.tsx`. Never create directly in `src/components/ui/`.
   - **For ledger updates**: append a row to `CHANGES.md` every time you make a change. Don't ask first — just do it. Use the bucket vocabulary from CHANGES.md (`structure`, `token-tweak`, `primitive-fork`, `primitive-new`).

5. **Commit + push cadence**:
   - **Commit locally** at small, semantic checkpoints (a meaningful change, a fix, a new version added). Cheap, gives a useful audit trail. Always do this.
   - **Don't push every commit.** Local Storybook HMR is the live preview during a session — the user sees changes instantly without needing the Vercel deploy. Pushing on every iteration just creates deploy noise on `storybook.lia.build`.
   - **Push at logical checkpoints only.** Specifically: when the user explicitly says to push / ship / deploy; when wrapping a coherent iteration ("we're done with the font + shadow exploration, want me to push?"); at session end; or before suggesting `/design-review`.
   - **Confirm before pushing** unless the user has already said push. Even at a natural checkpoint, ask once ("logical stopping point — push now?") rather than pushing reflexively.

6. **At session end** (or when the user says "review"): push any unpushed commits, then suggest running `/design-review` to triage what should backport vs stay sandboxed.

## CHANGES.md seed template

```md
# <Display Name> — change ledger

Sandbox scope class: `.playground-<slug>`
Started: YYYY-MM-DD
Brief: <one-line summary of what the prototype is exploring>

## Ledger

| When | Bucket | Change | Status |
|------|--------|--------|--------|
| YYYY-MM-DD | structure | Prototype scaffolded | live |

## Buckets

- **token-tweak** — scoped override in `./tokens.css`. Stays local until backport.
- **primitive-fork** — copied a primitive from `src/components/ui/` into `./components/`. Stays local until backport.
- **primitive-new** — new component file in `./components/`. Stays local until promotion.
- **structure** — story/layout/copy changes to `index.stories.tsx`. Inherently prototype-only.
```

## Anti-patterns to refuse

- **Editing `globals.css` directly during a prototype session.** It breaks the sandbox. Always go through `./tokens.css`.
- **Editing `src/components/ui/<name>.tsx` directly during a prototype session.** Always fork first.
- **Scratch-building UI when a Pro block exists.** Check shadcnstudio.com/blocks first; install via `@ss-blocks/<name>`.
- **Skipping the ledger.** Every change gets a row. No exceptions.
- **Creating files outside the prototype folder without asking.** The sandbox boundary IS the folder.

## Example invocation

```
/prototype musician-profile A one-page artist site with hero, tour dates, music links, contact form
```

Should produce:
- Slug: `musician-profile`
- Display name: `Musician Profile`
- Title: `Playground/Musician Profile`
- Folder: `src/playground/musician-profile/`
- Scope class: `.playground-musician-profile`
