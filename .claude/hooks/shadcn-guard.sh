#!/usr/bin/env bash
# shadcn primitive guard (PostToolUse hook, Write|Edit)
# Flags hand-rolled UI that an existing src/components/ui/* primitive already covers,
# so we extend the real shadcn component instead of rebuilding it inline.
#
# Portable: drop this file + the matching .claude/settings.json hook entry into any
# shadcn-style repo (components under <root>/components/ui/ or <root>/src/components/ui/).
# Exit 2 surfaces a message back to Claude; it does not undo the write — it's a reliable
# "you reinvented an existing primitive, reconsider" nudge.
set -uo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | python3 -c 'import sys,json
try: d=json.load(sys.stdin)
except Exception: print(""); sys.exit(0)
print(d.get("tool_input",{}).get("file_path") or d.get("tool_response",{}).get("filePath") or "")' 2>/dev/null)"

# Only guard component source files; skip the primitives themselves, stories, tests.
case "$file" in
  *src/components/*.tsx|*/components/*.tsx) ;;
  *) exit 0 ;;
esac
case "$file" in
  */components/ui/*|*.stories.tsx|*.test.tsx|*.spec.tsx) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# Walk up to find the components/ui primitives dir.
dir="$(cd "$(dirname "$file")" && pwd)"
ui=""
while [ "$dir" != "/" ] && [ -n "$dir" ]; do
  if [ -d "$dir/components/ui" ]; then ui="$dir/components/ui"; break; fi
  if [ -d "$dir/src/components/ui" ]; then ui="$dir/src/components/ui"; break; fi
  dir="$(dirname "$dir")"
done
[ -n "$ui" ] || exit 0

content="$(cat "$file")"
has() { printf '%s' "$content" | grep -qiE "$1"; }
primitive_exists() { [ -f "$ui/$1.tsx" ]; }
imports() { printf '%s' "$content" | grep -qE "components/ui/$1\""; }

flag() {
  # $1 primitive file basename, $2 human description, $3 component name to use
  primitive_exists "$1" || return 0
  imports "$1" && return 0
  {
    echo "shadcn-guard: $(basename "$file") looks like a hand-rolled $2, but"
    echo "src/components/ui/$1.tsx already exists and isn't imported."
    echo "Use the existing <$3> primitive (own-and-extend the ui/ file if it"
    echo "needs new behaviour) instead of rebuilding it inline."
  } >&2
  exit 2
}

# High-signal, low-false-positive signatures -> existing primitive.
# Hover/focus or toggled floating panel = a dropdown/popover.
if { has 'group-(hover|focus-within):' && has '\babsolute\b'; } || has 'role="menu"'; then
  flag dropdown-menu "dropdown menu" "DropdownMenu"
fi
has 'role="dialog"|fixed inset-0' && flag dialog "dialog/modal" "Dialog"
has 'role="tooltip"'             && flag tooltip  "tooltip"      "Tooltip"
has 'role="tablist"'             && flag tabs     "tab set"      "Tabs"

exit 0
