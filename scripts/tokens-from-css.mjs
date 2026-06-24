#!/usr/bin/env node
/**
 * tokens-from-css.mjs
 *
 * Lia design system, v3. One-direction sync: src/app/globals.css → design/lia-tokens.tokens.json.
 *
 * Why: globals.css is the source of truth (shadcn convention). The Tokens Studio JSON is a mirror
 * Figma reads from. Hand-editing the JSON is forbidden — it drifts. This script keeps it honest.
 *
 * Carries the v1/v2 "regenerate, never hand-edit" principle, with the source/destination inverted
 * (v2 ran JSON → CSS, v3 runs CSS → JSON because shadcn keeps the canonical theme in CSS vars).
 *
 * Usage:
 *   pnpm tokens:sync
 *
 * Exit codes:
 *   0 — JSON written or already in sync
 *   1 — parse error, missing files, or gamut-mapping failure
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatHex, formatHex8, oklch as oklchParse } from 'culori'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(here, '..')
const CSS_PATH = resolve(ROOT, 'src/app/globals.css')
const JSON_PATH = resolve(ROOT, 'design/lia-tokens.tokens.json')

const SHARED_RADIUS = {
  'radius/sm': '2px',
  'radius/md': '4px',
  'radius/lg': '6px',
  'radius/xl': '10px',
  'radius/base': '6px',
}

// Mirrors the next/font imports in src/app/layout.tsx + the --font-* vars in
// globals.css. These resolve to Next.js font-loader CSS vars (var(--font-figtree))
// which can't be read from globals.css as literal family names, so they're
// declared here. Keep in sync with layout.tsx if a font changes.
const SHARED_FONT = {
  'font/sans': 'Figtree',
  'font/mono': 'DM Mono',
  'font/serif': 'Libre Baskerville',
}

const SHADOW_VARS = [
  ['shadow-2xs', 'shadow/2xs'],
  ['shadow-xs', 'shadow/xs'],
  ['shadow-sm', 'shadow/sm'],
  ['shadow', 'shadow/base'],
  ['shadow-md', 'shadow/md'],
  ['shadow-lg', 'shadow/lg'],
  ['shadow-xl', 'shadow/xl'],
  ['shadow-2xl', 'shadow/2xl'],
]

const COLOR_VARS = [
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive',
  'border', 'input', 'ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground',
  'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring',
]

/**
 * Pull the body of a CSS selector block (e.g. `:root { ... }` or `.dark { ... }`).
 * Naive — no nested braces in those blocks today.
 */
function extractBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`, 'm')
  const m = css.match(re)
  if (!m) throw new Error(`Could not find selector ${selector} in globals.css`)
  return m[1]
}

/**
 * Read a single CSS var value from a block. Returns the raw value (e.g. "oklch(0.5 0.2 263)").
 */
function readVar(block, varName) {
  const re = new RegExp(`--${varName}\\s*:\\s*([^;]+);`)
  const m = block.match(re)
  if (!m) throw new Error(`Missing --${varName} in block`)
  return m[1].trim()
}

/**
 * Build a name→value map of every custom property declared in a block.
 * Used to resolve the primitive layer (e.g. --olive-50: oklch(...)) so semantic
 * tokens that reference primitives via var() can be resolved to literals.
 */
function buildVarMap(block) {
  const map = {}
  const re = /--([\w-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(block)) !== null) {
    map[m[1]] = m[2].trim()
  }
  return map
}

/**
 * Resolve var(--x) references against a primitive map, following chains.
 * Semantic tokens reference primitives (--primary: var(--lia-blue-600)); this
 * walks back to the literal (oklch(...)). Plain literals pass through untouched.
 */
function resolveValue(value, varMap, depth = 0) {
  if (depth > 10) throw new Error(`var() resolution too deep for: ${value}`)
  const m = value.match(/^var\(\s*--([\w-]+)\s*\)$/)
  if (!m) return value
  const target = varMap[m[1]]
  if (target === undefined) throw new Error(`Unresolved var(--${m[1]})`)
  return resolveValue(target, varMap, depth + 1)
}

/**
 * Convert an oklch() string to a hex sRGB value via culori. Throws on parse failure.
 */
function oklchToHex(value) {
  const color = oklchParse(value)
  if (!color) throw new Error(`Could not parse colour: ${value}`)
  const hex = formatHex({ ...color, mode: 'oklch' })
  if (!hex) throw new Error(`Could not format hex for: ${value}`)
  return hex.toLowerCase()
}

/**
 * Convert an oklch() (with optional / alpha) string to an 8-digit hex (#rrggbbaa).
 */
function oklchToHex8(value) {
  const color = oklchParse(value)
  if (!color) throw new Error(`Could not parse colour: ${value}`)
  const hex = formatHex8({ ...color, mode: 'oklch' })
  if (!hex) throw new Error(`Could not format hex8 for: ${value}`)
  return hex.toLowerCase()
}

/**
 * Split a CSS shadow declaration into individual shadows on top-level commas
 * (commas inside parens like oklch(...) don't count). Then parse each into
 * a Tokens Studio dropShadow entry.
 */
function parseShadow(value) {
  const parts = []
  let depth = 0
  let buf = ''
  for (const ch of value) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(buf.trim())
      buf = ''
    } else {
      buf += ch
    }
  }
  if (buf.trim()) parts.push(buf.trim())

  return parts.map((part) => {
    const colorMatch = part.match(/oklch\([^)]+\)/)
    if (!colorMatch) throw new Error(`Shadow without oklch colour: ${part}`)
    const colorStr = colorMatch[0]
    const rest = part.replace(colorStr, '').trim().split(/\s+/).filter(Boolean)
    const [x, y, blur, spread = '0'] = rest
    return {
      x: x.replace('px', ''),
      y: y.replace('px', ''),
      blur: blur.replace('px', ''),
      spread: spread.replace('px', ''),
      color: oklchToHex8(colorStr),
      type: 'dropShadow',
    }
  })
}

function buildThemeSet(block, varMap) {
  const out = {}
  for (const name of COLOR_VARS) {
    out[`theme/${name}`] = {
      value: oklchToHex(resolveValue(readVar(block, name), varMap)),
      type: 'color',
    }
  }
  for (const [cssName, jsonName] of SHADOW_VARS) {
    out[jsonName] = {
      value: parseShadow(readVar(block, cssName)),
      type: 'boxShadow',
    }
  }
  return out
}

function main() {
  const css = readFileSync(CSS_PATH, 'utf8')
  const rootBlock = extractBlock(css, ':root')
  const darkBlock = extractBlock(css, '.dark')

  // Primitives live in :root. Both light + dark semantics reference them via
  // var(), so resolve everything against the :root var map.
  const varMap = buildVarMap(rootBlock)

  const shared = {}
  for (const [k, v] of Object.entries(SHARED_RADIUS)) {
    shared[k] = { value: v, type: 'borderRadius' }
  }
  for (const [k, v] of Object.entries(SHARED_FONT)) {
    shared[k] = { value: v, type: 'fontFamilies' }
  }

  const next = {
    $metadata: {
      tokenSetOrder: ['lia-shared', 'lia-light', 'lia-dark'],
    },
    $themes: [],
    'lia-shared': shared,
    'lia-light': buildThemeSet(rootBlock, varMap),
    'lia-dark': buildThemeSet(darkBlock, varMap),
  }

  const current = readFileSync(JSON_PATH, 'utf8')
  const nextJson = JSON.stringify(next, null, 2) + '\n'

  if (current === nextJson) {
    console.log('design/lia-tokens.tokens.json already in sync with globals.css')
    return
  }

  writeFileSync(JSON_PATH, nextJson)
  console.log(
    `Wrote ${JSON_PATH.replace(ROOT + '/', '')} ` +
      `(${COLOR_VARS.length} colour + ${SHADOW_VARS.length} shadow tokens × 2 modes)`,
  )
}

try {
  main()
} catch (err) {
  console.error(`tokens-from-css failed: ${err.message}`)
  process.exit(1)
}
