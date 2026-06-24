# Playground

A **true sandbox** for prototyping with the Lia design system. Every change you make in here — token tweaks, primitive edits, brand-new components — is scoped to one prototype. Nothing escapes to the rest of the system until you explicitly approve it at `/design-review`.

## Architecture — folder per prototype

```
src/playground/<name>/
├── index.stories.tsx     The story. Renders <VersionTabs versions={[v1, v2, …]} />
├── tokens.css            Scoped token overrides (.playground-<name>--v<n> { --primary: …; })
├── components/           Forked primitives + new components, prototype-local
└── CHANGES.md            Running ledger of every change
```

Story title: `Playground/<Name>` (e.g. `Playground/Welcome`, `Playground/Musician Profile`).

## Versioning — keep iterations side-by-side

Every prototype is wrapped in [`<VersionTabs>`](_shared/version-tabs.tsx). The sticky tab bar at the top of the canvas lets you flip between v1, v2, v3, … so iterations stay comparable instead of overwriting each other.

**Convention:**

- **v1 is the baseline.** Once shipped, don't edit it. Every later iteration adds a new version alongside.
- **New iterations get added as v2, v3, …** with a short `note` describing the delta ("Figtree + paper shadow", "denser layout", "warmer palette").
- **Default tab is the latest version** unless `defaultId` overrides it.
- **Visual deltas live in `tokens.css`** scoped under `.playground-<slug>--v<n>` whenever possible. The JSX should stay identical across versions so the comparison is purely about the design language.

See [`_shared/README.md`](_shared/README.md) for the pattern detail and an example.

## How sandboxing works

### Token tweaks → scoped via CSS variable cascade

`tokens.css` defines overrides under a scope class:

```css
.playground-musician-profile {
  --primary: oklch(0.7 0.3 30);  /* warmer brand */
  --radius: 0.5rem;
}

.dark .playground-musician-profile {
  --primary: oklch(0.6 0.25 30);
}
```

CSS variables cascade. Inside `.playground-musician-profile`, every Tailwind utility (`bg-primary`, `rounded-lg`, etc.) resolves to the override. Outside it, the defaults from `globals.css` apply. **No other prototype, story, or consumer is affected.**

### Primitive tweaks → fork into `./components/`

To modify a primitive for this prototype:

1. Copy `src/components/ui/<name>.tsx` → `src/playground/<prototype>/components/<name>.tsx`
2. Modify the copy freely.
3. In `index.stories.tsx`, swap the import:
   - `import { Button } from '@/components/ui/button'`
   - → `import { Button } from './components/button'`

The original primitive is untouched. Other prototypes and the production app see no change.

### New components → live in `./components/`

Brand-new components built for one prototype live in `./components/`. They're prototype-local until you promote them at `/design-review`.

## At `/design-review`

When you run `/design-review` from this repo, it walks every file in the prototype folder and asks you per change:

| Change found | You decide |
| --- | --- |
| **Token override in `tokens.css`** | Backport (merge into `globals.css`, delete the override) · Keep sandboxed · Revert |
| **Forked primitive in `./components/`** | Backport (diff against original, apply, delete the fork) · Keep sandboxed · Revert |
| **New component in `./components/`** | Promote to `src/components/ui/` (with Code Connect mapping) · Keep sandboxed · Revert |
| **Story / layout changes in `index.stories.tsx`** | Inherently prototype-only — no decision needed |

Nothing reaches the rest of the system without explicit approval.

## Workflow

1. **Scaffold** — run `/prototype <name>` (or paste the natural-language prompt) to bootstrap the folder.
2. **Vibe-code** — go nuts. Edit tokens, fork primitives, build new components. The sandbox holds. Local Storybook HMR is the live preview during iteration; you don't need a deploy to see what you're doing.
3. **Commit locally as you go, push at checkpoints** — small semantic commits build a useful audit trail, but pushing on every iteration just creates deploy noise. Push when wrapping a coherent iteration, at session end, or when you explicitly want to share the current state via `storybook.lia.build`.
4. **Review** — run `/design-review` when you want to triage what should propagate.
5. **Propagate** — approved changes merge into the system + the CHANGES.md ledger records the outcome.

## Why the sandbox matters

The design system is a shared surface. A token tweak that's perfect for a musician profile prototype might be wrong for a dashboard prototype. Forking a Button to have a `loading` state for one prototype shouldn't ship to everyone immediately. The sandbox lets you explore confidently, then promote deliberately.
