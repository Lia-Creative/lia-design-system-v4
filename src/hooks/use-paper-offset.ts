import * as React from "react"

// Deterministic, SSR-stable paper-grain offset.
//
// The paper surfaces (Card, and any `.paper-panel` wrapper) shift the grain's
// background-position per instance so it doesn't tile identically. That offset
// used to come from `Math.random()` at render time, which produced different
// values on the server and client → a React hydration mismatch on every paper
// surface (LIAB-395).
//
// This seeds the offset from React's `useId()` — stable across server and
// client, unique per instance — hashed with FNV-1a to a deterministic 0..1 and
// mapped into the existing range. So: identical on server + client (no mismatch,
// final texture in the first paint), distinct between adjacent instances, and
// identical for a given instance across reloads.

// FNV-1a → uint32.
function fnv1a(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// Deterministic 0..1 from a string.
function hashUnit(input: string): number {
  return fnv1a(input) / 0x100000000
}

/**
 * Returns a `background-position` string (`"<x>px <y>px"`) for the paper grain,
 * seeded deterministically so server and client agree.
 *
 * @param range  Upper bound (exclusive) for each px axis. Defaults to 2000,
 *               matching the prior random offset's shape.
 * @param seed   Optional explicit seed; defaults to a `useId()` for this
 *               instance. Pass a stable key if you need a specific, repeatable
 *               offset.
 */
export function usePaperOffset(range = 2000, seed?: string): string {
  const id = React.useId()
  const base = seed ?? id
  // Prefix the axis salt so the one-char difference avalanches through the whole
  // FNV-1a mix — a suffix salt barely changes the result, leaving x ≈ y.
  const x = Math.floor(hashUnit(`x:${base}`) * range)
  const y = Math.floor(hashUnit(`y:${base}`) * range)
  return `${x}px ${y}px`
}
