<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Use the existing shadcn primitive — never hand-roll one that already exists

Before building ANY interactive UI (dropdown, dialog/modal, tooltip, tabs, popover, accordion, select, switch, etc.), check the `ui/` primitives directory for an existing component and use it. If it needs new behaviour, own-and-extend that file — do NOT rebuild the pattern inline with raw `group-hover`/`absolute`/`role="…"` markup "in its style". One canonical implementation per pattern.

Enforced by a PostToolUse hook (`.claude/hooks/shadcn-guard.sh`, wired in `.claude/settings.json`) that flags a component file hand-rolling a pattern an existing `ui/` primitive already covers.
