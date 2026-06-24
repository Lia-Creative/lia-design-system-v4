'use client'

import {
  MoonIcon,
  PaletteIcon,
  RotateCcwIcon,
  ShuffleIcon,
  SunIcon,
  type LucideIcon,
} from 'lucide-react'
import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

/**
 * PrototypeShell — the default Lia app frame for every playground prototype.
 *
 * Gives you, for free (the same way the Lia logo is always in the corner):
 *   - Lia logo top-left
 *   - a tri-state mode toggle top-right: light / dark / colour
 *   - colour mode: coloured "paper" palette on the desk + cards, with a
 *     Remix (shuffle which colour lands where) + Reset control
 *
 * Paper *craft* (tilt, scissor-cut corners, grain texture) is already automatic
 * at the Card/Button primitive level — the shell doesn't add it. The shell only
 * owns the mode chrome and the colour-mode palette.
 *
 * Dark mode is self-contained: the shell adds a `dark` class to its own scope
 * div, so globals.css `.dark { … }` tokens apply within the subtree without
 * touching next-themes or the Storybook toolbar.
 *
 * Children read `cardPaperStyle(i)` from context and spread it onto their Card
 * `style` — in colour mode it returns the coloured-paper CSS vars; otherwise {}.
 */

export type LiaMode = 'light' | 'dark' | 'colour'

const MODES: LiaMode[] = ['light', 'dark', 'colour']
const MODE_ICONS: Record<LiaMode, LucideIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  colour: PaletteIcon,
}

export type Paper = {
  name: string
  /** Surface fill. Slot 0 → desk (--background); 1..n → cards (--card). */
  bg: string
  foreground: string
  mutedForeground: string
  paperBlend: 'multiply' | 'screen' | 'overlay'
  paperOpacity: number
  paperFilter: string
}

// Light papers: multiply blend preserves the saturated colour; high contrast on
// the greyscaled texture pushes grain spots dark so they read as printed specks.
const LIGHT_PAPER = {
  foreground: 'var(--olive-950)',
  mutedForeground: 'var(--olive-700)',
  paperBlend: 'multiply',
  paperOpacity: 1,
  paperFilter: 'saturate(0) contrast(1.6)',
} as const

/**
 * The canonical Lia colour-mode palette. Purple / Blue / Amber are stock
 * Tailwind ramps (referenced as --color-* per CLAUDE.md — no duplicated
 * literals); off-black uses the Olive primitive. Slot 0 is the desk.
 */
export const LIA_PAPERS: Paper[] = [
  { name: 'Purple', bg: 'var(--color-purple-400)', ...LIGHT_PAPER },
  { name: 'Blue', bg: 'var(--color-blue-200)', ...LIGHT_PAPER },
  { name: 'Amber', bg: 'var(--color-amber-400)', ...LIGHT_PAPER },
  {
    name: 'Off-black',
    bg: 'var(--olive-900)',
    foreground: 'var(--olive-50)',
    mutedForeground: 'var(--olive-300)',
    paperBlend: 'screen',
    paperOpacity: 0.85,
    paperFilter: 'saturate(0) contrast(1.15) invert(1)',
  },
]

function paperVars(paper: Paper, slot: 'desk' | 'card'): CSSProperties {
  // Card text reads --card-foreground; desk/page text reads --foreground. Set
  // the right one for the slot (plus --muted-foreground, shared) so dark papers
  // like off-black flip their text to light and stay legible.
  const fgKey = slot === 'desk' ? '--foreground' : '--card-foreground'
  return {
    [slot === 'desk' ? '--background' : '--card']: paper.bg,
    [fgKey]: paper.foreground,
    '--muted-foreground': paper.mutedForeground,
    '--paper-blend': paper.paperBlend,
    '--paper-opacity': paper.paperOpacity,
    '--paper-filter': paper.paperFilter,
  } as CSSProperties
}

// Fisher-Yates, biased to never return the same order (so Remix always visibly
// changes something).
function shuffle(order: number[]): number[] {
  for (let attempt = 0; attempt < 8; attempt++) {
    const next = [...order]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    if (next.some((v, i) => v !== order[i])) return next
  }
  return [...order]
}

type ShellContextValue = {
  mode: LiaMode
  colourActive: boolean
  /** Inline paper vars for the card at `index` (cycles the card papers),
   *  respecting the current remix order. Returns {} outside colour mode. */
  cardPaperStyle: (index: number) => CSSProperties
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function usePrototypeShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) {
    throw new Error('usePrototypeShell must be used inside <PrototypeShell>')
  }
  return ctx
}

type PrototypeShellProps = {
  /** Prototype slug, e.g. "welcome". Used to build the scope class. */
  slug: string
  /** Version id, e.g. "v1". Used to build the scope class. */
  version: string
  /** Override the colour-mode palette. Defaults to LIA_PAPERS. */
  palette?: Paper[]
  /** Extra header buttons rendered left of the mode controls. */
  headerActions?: ReactNode
  children: ReactNode
}

export function PrototypeShell({
  slug,
  version,
  palette = LIA_PAPERS,
  headerActions,
  children,
}: PrototypeShellProps) {
  const [mode, setMode] = useState<LiaMode>('light')
  const [order, setOrder] = useState<number[]>(() => palette.map((_, i) => i))

  const colourActive = mode === 'colour'
  const cycleMode = () =>
    setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length])
  const remix = () => setOrder((o) => shuffle(o))
  const reset = () => setOrder(palette.map((_, i) => i))

  const ordered = order.map((i) => palette[i])
  const deskPaper = ordered[0]
  const cardPapers = ordered.slice(1)

  const cardPaperStyle = (index: number): CSSProperties =>
    colourActive && cardPapers.length > 0
      ? paperVars(cardPapers[index % cardPapers.length], 'card')
      : {}

  const ModeIcon = MODE_ICONS[mode]

  const scopeClass =
    `playground-${slug} playground-${slug}--${version} playground-${slug}--${version}-${mode}` +
    (mode === 'dark' ? ' dark' : '')

  const deskStyle = colourActive ? paperVars(deskPaper, 'desk') : undefined

  return (
    <ShellContext.Provider value={{ mode, colourActive, cardPaperStyle }}>
      <div
        className={`${scopeClass} relative min-h-svh bg-background text-foreground`}
        style={deskStyle}
      >
        <header className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-6 pt-6">
          <Logo className="h-7 w-auto" />
          <div className="flex items-center gap-1">
            {headerActions}
            {colourActive && (
              <>
                <Button
                  data-slot="theme-toggle"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remix paper colours"
                  onClick={remix}
                >
                  <ShuffleIcon />
                </Button>
                <Button
                  data-slot="theme-toggle"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Reset paper order"
                  onClick={reset}
                >
                  <RotateCcwIcon />
                </Button>
              </>
            )}
            <Button
              data-slot="theme-toggle"
              variant="ghost"
              size="icon-sm"
              aria-label={`Mode: ${mode}. Click to cycle light, dark, colour.`}
              aria-pressed={mode !== 'light'}
              onClick={cycleMode}
            >
              <ModeIcon />
            </Button>
          </div>
        </header>
        {children}
      </div>
    </ShellContext.Provider>
  )
}
