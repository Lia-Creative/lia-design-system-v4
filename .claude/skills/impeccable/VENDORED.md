# Impeccable (vendored)

This skill is vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable). License: Apache 2.0 (see `LICENSE`, attribution in `NOTICE.md`).

## What it is

A design-language skill for Claude Code. One skill (`impeccable`) plus 23 commands accessed via `/impeccable <command>` — e.g. `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`. Includes 7 domain references (typography, colour, motion, spatial, interaction, responsive, UX writing) and curated anti-pattern rules.

See the upstream repo or `SKILL.md` in this folder for full docs.

## How to update

This is a snapshot — not a submodule, not auto-syncing. To pull a newer version:

```bash
# in a temp dir
gh repo clone pbakaus/impeccable -- --depth=1
rsync -av --delete impeccable/.claude/skills/impeccable/ \
  ~/Code\ Projects/lia-design-system-v3/.claude/skills/impeccable/
cp impeccable/LICENSE impeccable/NOTICE.md \
  ~/Code\ Projects/lia-design-system-v3/.claude/skills/impeccable/
# preserve this VENDORED.md
```

Pinned at commit: **`642f03d5a10e`** (synced 2026-05-18). Bump the SHA above when you re-sync.

## Why vendored alongside a marketplace install

A copy of this skill is also installed at user level via `/plugin install impeccable@impeccable` (Claude Code marketplace). That covers every other project. The vendored copy here:

- Travels with the design system repo for anyone cloning it
- Is version-pinned, so the Lia design system always has a known good version
- Doesn't depend on Dan's user-level plugin state

If both are present, Claude Code uses the project-level copy by precedence.
