---
description: Triage sandboxed prototype changes — backport to system, keep local, or revert
---

# /design-review — Triage Playground sandbox changes

You are reviewing a vibe-coding session in the Lia Design System v3 repo. The Playground (`src/playground/<name>/`) is a **true sandbox** — token overrides, primitive forks, and new components live there scoped to one prototype. Your job is to walk every change and ask: backport to the system, keep sandboxed, or revert.

Read [CLAUDE.md](../../CLAUDE.md) and [src/playground/README.md](../../src/playground/README.md) first. The propagation matrix, the sandbox architecture, and the "ask before creating components" rule define the rules of the game.

## Impeccable lens

Before triage, run an Impeccable critique-then-audit pass on the prototype. **Load these reference files**:

- `.claude/skills/impeccable/reference/critique.md` — UX critique framework (hierarchy, clarity, emotional resonance)
- `.claude/skills/impeccable/reference/audit.md` — technical quality (a11y, performance, responsive)
- `.claude/skills/impeccable/reference/polish.md` — design-system alignment + shipping readiness
- `.claude/skills/impeccable/reference/heuristics-scoring.md` — the rubric for scoring

The critique + audit pass happens **before** the triage decisions. Findings inform what should backport vs. stay sandboxed:

- A scoped token override that's better than the global default (per critique) → strong backport candidate
- A forked primitive that has accessibility wins (per audit) → strong backport candidate
- A scoped token override that's interesting but situational → keep sandboxed
- Anti-pattern violations (Impeccable's 27 deterministic rules) → fix in the prototype OR backport the fix to the system if it's a systemic issue

Report Impeccable findings as a separate section at the top of the review, before the per-change triage.

## What to do

1. **Survey the changes** since the last clean state. Default to comparing against `origin/main`. If the user gives you a different base ref, use that.

   ```bash
   git fetch origin
   git diff origin/main...HEAD --stat
   git status --short
   ```

2. **Identify the prototype** being reviewed. If the user named one, use it. If not, infer from `git diff` paths (`src/playground/<name>/`). If multiple prototypes have changes, ask which one to review first.

3. **For each change in `src/playground/<name>/`, classify it:**

   | Where the change is | Bucket | Default disposition |
   | --- | --- | --- |
   | `index.stories.tsx` (story/layout/copy) | **structure** | Stays in the prototype. No decision needed. |
   | `tokens.css` (additions/edits) | **scoped-token** | Ask: backport to globals.css · keep sandboxed · revert |
   | `components/<existing-primitive-name>.tsx` (forks of `src/components/ui/<same>.tsx`) | **forked-primitive** | Diff against the canonical primitive. Ask: backport diff · keep sandboxed · revert |
   | `components/<new-name>.tsx` (no canonical equivalent) | **new-primitive** | Ask: promote to `src/components/ui/` · keep sandboxed · revert |
   | `CHANGES.md` | **ledger** | Append the review outcome. Don't ask. |

4. **For each bucket that needs a decision, present a triage proposal:**

   - **scoped-token** → Show each `--var` overridden. For each, ask: "Push this into `globals.css` (becomes the new system default)? Or keep it scoped to `.playground-<name>`?" On backport: update both `:root` and `.dark` blocks in `globals.css` to match, then delete the override line from `tokens.css`, then run `pnpm tokens:sync` so the JSON mirror + Figma round-trip catch up.

   - **forked-primitive** → Diff the fork against `src/components/ui/<name>.tsx`. Show the user the meaningful changes (additions, removals). Ask: "Apply this diff to the canonical primitive (and delete the fork), or keep the fork?" On backport: apply diff to canonical, delete the fork from `./components/`, update the import in `index.stories.tsx` back to `@/components/ui/<name>`. Then surface the Figma follow-up — the canonical Figma component needs the matching variant/state update; offer to scaffold a Code Connect mapping note.

   - **new-primitive** → Show the new component. Ask the CLAUDE.md gate questions: "Is this generally useful or one-off? If generally useful, what's the matching Figma component, and do we have a Code Connect mapping?" On promote: move the file from `./components/` to `src/components/ui/`, add a `.stories.tsx` if missing, propose a `src/figma/<name>.figma.tsx` mapping + a `figma.config.json` entry. Update the prototype's import path.

5. **For changes outside `src/playground/<name>/`** (someone touched `src/app/globals.css`, `src/components/ui/`, config, etc. directly instead of via the sandbox), flag them prominently. The sandbox discipline only works if changes go through the playground. Ask: "These bypass the sandbox — was that intentional?" If accidental, offer to move them in.

6. **Update the prototype's CHANGES.md** at the end of the review:
   - Append a "Review YYYY-MM-DD" section
   - List each decision: backported · kept · reverted
   - Note any Figma follow-ups owed to the designer

7. **For Figma-side work** that the triage surfaces, default to *describing* what needs to happen rather than executing. Figma MCP component writes are unreliable per the April 24 learnings. For variable writes that DO work via MCP, offer to do them.

8. **Session summary** at the end (under 300 words):
   - Backported to the design system: …
   - Kept sandboxed in `<prototype>`: …
   - Reverted: …
   - Needs Figma follow-up: …

   Offer to write this summary into `_meta/inbox/session-YYYY-MM-DD-design-review.md` in the user's personal vault (per their global CLAUDE.md convention).

## Anti-patterns to refuse

- **Promoting one-offs to the system.** If a scoped token or fork is being suggested for backport, push back: "this looks specific to the prototype's context — what's the general case it serves?"
- **Adding primitives without asking.** Never auto-create files in `src/components/ui/`. Always confirm with the user first per CLAUDE.md.
- **Pushing component-level changes to Figma via MCP.** Variables work; layouts and variants don't. Surface those as "designer needs to update Figma manually" — don't pretend the MCP will do it.
- **Letting changes outside the playground slip through unreviewed.** Direct edits to `src/components/ui/` or `globals.css` bypass the sandbox. Always flag.

## When you're done

End with a concise next-actions list:

- [ ] Commits made during this review (with SHAs)
- [ ] What the user needs to do in Figma
- [ ] What's intentionally staying sandboxed in `<prototype>`
