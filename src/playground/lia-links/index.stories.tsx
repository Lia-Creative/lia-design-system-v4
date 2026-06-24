import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  ArrowRightIcon,
  FolderTreeIcon,
  Layers3Icon,
  MoonIcon,
  PaletteIcon,
  RotateCcwIcon,
  ShuffleIcon,
  SparklesIcon,
  SunIcon,
  type LucideIcon,
} from 'lucide-react'
import { useState, type CSSProperties } from 'react'

import './tokens.css'

import { VersionTabs } from '../_shared/version-tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'

type Bet = {
  slug: string
  title: string
  blurb: string
  href: string
  icon: LucideIcon
  tone: 'primary' | 'accent' | 'secondary'
}

const bets: Bet[] = [
  {
    slug: 'file-runner',
    title: 'File Runner',
    blurb:
      'A clean home for the files a song collects. Stems, lyrics, artwork, splits.',
    href: '#file-runner',
    icon: FolderTreeIcon,
    tone: 'primary',
  },
  {
    slug: 'life-balance',
    title: 'Life Balance',
    blurb:
      'Foundation, practice, build. Three layers, one honest read of where things are.',
    href: '#life-balance',
    icon: Layers3Icon,
    tone: 'accent',
  },
  {
    slug: 'lia-assist',
    title: 'Lia Assist',
    blurb:
      'A second brain for creatives. Quiet help staying on track to what matters.',
    href: '#lia-assist',
    icon: SparklesIcon,
    tone: 'secondary',
  },
]

const toneClasses: Record<Bet['tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
}

// Random tilt range. ±0.5° reads as "precisely placed, just slightly off
// horizontal" — paper that's been put down with intent.
const TILT_RANGE = 0.5
// Minimum magnitude — anything below reads as "not tilted at all", so the
// random generator avoids the zero-neighbourhood.
const TILT_MIN = 0.15

function singleTilt(): number {
  // Magnitude in [TILT_MIN, TILT_RANGE], sign random.
  const sign = Math.random() < 0.5 ? -1 : 1
  const magnitude = TILT_MIN + Math.random() * (TILT_RANGE - TILT_MIN)
  return sign * magnitude
}

// Build a hand-cut-looking border-radius. Each corner gets its own
// horizontal AND vertical radius (slash syntax), so corners are
// ellipses rather than circles. With independent random values it
// reads as paper cut with scissors — no two corners alike.
function jaggedRadius(min: number, max: number): string {
  const r = () => (min + Math.random() * (max - min)).toFixed(1)
  return `${r()}px ${r()}px ${r()}px ${r()}px / ${r()}px ${r()}px ${r()}px ${r()}px`
}

function mixedTilts(count: number): string[] {
  // Generate `count` tilts and guarantee a mix of signs — otherwise three
  // independent samples can easily all land positive (or negative) by
  // chance, which reads as "they're all tilting the same way".
  const out: number[] = [singleTilt()]
  // Force the second entry to be opposite-sign so we always have a mix.
  const firstSign = Math.sign(out[0])
  const magnitude = TILT_MIN + Math.random() * (TILT_RANGE - TILT_MIN)
  out.push(-firstSign * magnitude)
  // Any remaining entries are free random.
  for (let i = 2; i < count; i++) out.push(singleTilt())
  // Shuffle so the guaranteed-opposite isn't always in slot 2.
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out.map((v) => v.toFixed(2))
}

// v7 introduces a tri-state mode toggle (light / dark / colour) that's
// independent of the system .dark theme. Other versions keep using the
// system ThemeToggle (light / dark only).
type V7Mode = 'light' | 'dark' | 'colour'
const V7_MODES: V7Mode[] = ['light', 'dark', 'colour']
const V7_MODE_ICONS: Record<V7Mode, LucideIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  colour: PaletteIcon,
}

// Paper palettes for colour mode. Each "paper" carries its own card
// colour + the texture-handling overrides it needs (light papers use
// multiply blend, the off-black paper uses screen blend with the
// inverted texture filter so the grain shows). Slot 0 is the desk;
// slots 1-3 are the cards. Remix shuffles the slot assignment.
type Paper = {
  name: string
  bg: string
  foreground: string
  mutedForeground: string
  paperBlend: 'multiply' | 'screen' | 'overlay'
  paperOpacity: number
  paperFilter: string
}

const OFF_BLACK_PAPER: Paper = {
  name: 'Off-black',
  bg: 'oklch(0.22 0.010 100)',
  foreground: 'oklch(0.97 0.005 100)',
  mutedForeground: 'oklch(0.78 0.005 100)',
  paperBlend: 'screen',
  paperOpacity: 0.85,
  paperFilter: 'saturate(0) contrast(1.15) invert(1)',
}

// Colour-mode light papers (Blue-200, Amber-400, Purple-300/400). Multiply
// preserves the saturated brand colour while higher contrast on the
// greyscaled texture pushes the grain spots much darker — they read as
// printed-paper specks rather than tinted UI. Overlay was tried but
// blew out the highlights and washed the bg toward white.
const LIGHT_PAPER_DEFAULTS = {
  foreground: 'oklch(0.10 0.005 100)',
  mutedForeground: 'oklch(0.22 0.005 100)',
  paperBlend: 'multiply',
  paperFilter: 'saturate(0) contrast(1.6)',
} as const

const PAPER_PALETTES: Record<'v7' | 'v8' | 'v9', Paper[]> = {
  v7: [
    {
      name: 'Purple-400',
      bg: 'oklch(0.714 0.203 305.504)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Blue-200',
      bg: 'oklch(0.882 0.059 254.128)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Amber-400',
      bg: 'oklch(0.828 0.189 84.429)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    OFF_BLACK_PAPER,
  ],
  v8: [
    {
      name: 'Amber-400',
      bg: 'oklch(0.828 0.189 84.429)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Blue-200',
      bg: 'oklch(0.882 0.059 254.128)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Purple-300',
      bg: 'oklch(0.827 0.119 306.383)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    OFF_BLACK_PAPER,
  ],
  // v9 colour palette mirrors v7 (Purple-400 desk). The v9 difference
  // is the light/dark hover swap, not the colour-mode palette.
  v9: [
    {
      name: 'Purple-400',
      bg: 'oklch(0.714 0.203 305.504)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Blue-200',
      bg: 'oklch(0.882 0.059 254.128)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    {
      name: 'Amber-400',
      bg: 'oklch(0.828 0.189 84.429)',
      paperOpacity: 1.0,
      ...LIGHT_PAPER_DEFAULTS,
    },
    OFF_BLACK_PAPER,
  ],
}

function paperStyle(paper: Paper, slot: 'desk' | 'card'): CSSProperties {
  return {
    [slot === 'desk' ? '--background' : '--card']: paper.bg,
    '--foreground': paper.foreground,
    '--muted-foreground': paper.mutedForeground,
    '--paper-blend': paper.paperBlend,
    '--paper-opacity': paper.paperOpacity,
    '--paper-filter': paper.paperFilter,
  } as CSSProperties
}

function ModeToggle({
  mode,
  onCycle,
  style,
}: {
  mode: V7Mode
  onCycle: () => void
  style?: CSSProperties
}) {
  const Icon = V7_MODE_ICONS[mode]
  return (
    <Button
      data-slot="theme-toggle"
      variant="ghost"
      size="icon-sm"
      aria-label={`Mode: ${mode}. Click to cycle through light, dark, colour.`}
      onClick={onCycle}
      style={style}
    >
      <Icon />
    </Button>
  )
}

type LiaLinksSurfaceProps = {
  scopeClass: string
  /** Paper palette applied inline when in colour mode. Slot 0 is the
   *  desk; slots 1-3 are the bet cards in order. */
  colourPalette?: Paper[]
  onRemix?: () => void
  onReset?: () => void
} & (
  | { mode?: undefined; onCycleMode?: undefined }
  | { mode: V7Mode; onCycleMode: () => void }
)

function LiaLinksSurface({
  scopeClass,
  mode,
  onCycleMode,
  colourPalette,
  onRemix,
  onReset,
}: LiaLinksSurfaceProps) {
  // Random tilt per tiltable element, generated once per mount. The
  // CSS variable --surface-tilt is set on every version's cards/buttons,
  // but only the v3 scope reads it (rotate: var(--surface-tilt)). v1
  // and v2 stay flat.
  const [tilts] = useState(() => ({
    // controls[0] = remix, controls[1] = reset, controls[2] = mode toggle
    controls: mixedTilts(3),
    bets: mixedTilts(bets.length),
    icons: mixedTilts(bets.length),
  }))
  // Hand-cut corner radii. Set inline on every card and icon, but only
  // the v5 scope reads them. v3/v4 hardcode `border-radius: 3px` and
  // ignore the inline var. Range chosen so the variation is visible
  // without making any single corner read as "rounded UI".
  const [radii] = useState(() => ({
    cards: bets.map(() => jaggedRadius(2, 10)),
    icons: bets.map(() => jaggedRadius(4, 9)),
  }))
  // Random paper-texture origin per layer (cards + icons in v5). Each
  // physical layer pulls a different section of the source image so its
  // grain looks distinct — three pieces of paper with their own fibres,
  // and three stickers with their own grain, rather than every surface
  // sharing one continuous texture. Range covers the full source image
  // (2048×2048) so layers rarely sample overlapping regions.
  const [paperOffsets] = useState(() => {
    const offset = () =>
      `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px`
    return {
      cards: bets.map(offset),
      icons: bets.map(offset),
    }
  })

  const deskPaper = colourPalette?.[0]
  const surfaceStyle: CSSProperties | undefined = deskPaper
    ? paperStyle(deskPaper, 'desk')
    : undefined

  return (
    <div
      className={`${scopeClass} min-h-svh bg-background text-foreground`}
      style={surfaceStyle}
    >
      <div className="mx-auto flex max-w-lg flex-col gap-12 px-6 pt-10 pb-16">
        <header className="flex items-center justify-between">
          <Logo className="h-10 w-auto" />
          <div className="flex items-center gap-1">
            {onRemix && (
              <Button
                data-slot="theme-toggle"
                variant="ghost"
                size="icon-sm"
                aria-label="Remix paper colours"
                onClick={onRemix}
                style={
                  {
                    '--surface-tilt': `${tilts.controls[0]}deg`,
                  } as CSSProperties
                }
              >
                <ShuffleIcon />
              </Button>
            )}
            {onReset && (
              <Button
                data-slot="theme-toggle"
                variant="ghost"
                size="icon-sm"
                aria-label="Reset paper order"
                onClick={onReset}
                style={
                  {
                    '--surface-tilt': `${tilts.controls[1]}deg`,
                  } as CSSProperties
                }
              >
                <RotateCcwIcon />
              </Button>
            )}
            {mode !== undefined ? (
              <ModeToggle
                mode={mode}
                onCycle={onCycleMode}
                style={
                  {
                    '--surface-tilt': `${tilts.controls[2]}deg`,
                  } as CSSProperties
                }
              />
            ) : (
              <ThemeToggle
                style={
                  {
                    '--surface-tilt': `${tilts.controls[2]}deg`,
                  } as CSSProperties
                }
              />
            )}
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <h1 className="text-6xl leading-[0.95] font-semibold tracking-tighter">
            What if creative work was simpler?
          </h1>
          <p className="text-lg leading-snug text-muted-foreground">
            Solving old problems with new tools.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Prototypes (WIP)
          </p>
          <nav
            aria-label="Lia prototype bets"
            className="flex flex-col gap-3"
          >
            {bets.map((bet, idx) => {
              const Icon = bet.icon
              const cardPaper = colourPalette?.[idx + 1]
              const cardStyle: CSSProperties = {
                '--surface-tilt': `${tilts.bets[idx]}deg`,
                '--card-radius': radii.cards[idx],
                '--paper-offset': paperOffsets.cards[idx],
                ...(cardPaper ? paperStyle(cardPaper, 'card') : {}),
              } as CSSProperties
              return (
                <Card
                  key={bet.slug}
                  size="sm"
                  style={cardStyle}
                  className="group/bet relative transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-md focus-within:ring-2 focus-within:ring-ring/40"
                >
                  <CardContent className="flex items-center gap-4">
                    <span
                      aria-hidden
                      data-slot="bet-icon"
                      style={
                        {
                          '--surface-tilt': `${tilts.icons[idx]}deg`,
                          '--icon-radius': radii.icons[idx],
                          '--paper-offset': paperOffsets.icons[idx],
                        } as CSSProperties
                      }
                      className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[bet.tone]}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="text-lg leading-tight font-medium text-foreground">
                        {bet.title}
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {bet.blurb}
                      </p>
                    </div>
                    <ArrowRightIcon
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/bet:translate-x-0.5 group-hover/bet:text-foreground"
                    />
                  </CardContent>
                  <a
                    href={bet.href}
                    aria-label={bet.title}
                    className="absolute inset-0 rounded-[inherit] focus:outline-none"
                  />
                </Card>
              )
            })}
          </nav>
        </section>

        <footer className="flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
          <a
            href="https://lia.build"
            className="transition-colors hover:text-foreground"
          >
            lia.build
          </a>
          <span className="italic">Create more.</span>
        </footer>
      </div>
    </div>
  )
}

function LiaLinks() {
  return (
    <VersionTabs
      versions={[
        {
          id: 'v1',
          label: 'v1',
          note: 'baseline',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v1" />
          ),
        },
        {
          id: 'v2',
          label: 'v2',
          note: 'Figtree + paper shadow',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v2" />
          ),
        },
        {
          id: 'v3',
          label: 'v3',
          note: 'tinted desk + scattered placement',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v3" />
          ),
        },
        {
          id: 'v4',
          label: 'v4',
          note: 'no tinted desk',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v4" />
          ),
        },
        {
          id: 'v5',
          label: 'v5',
          note: 'scissor-cut corners',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v5" />
          ),
        },
        {
          id: 'v6',
          label: 'v6',
          note: 'Olive-0 paper on Olive-50 desk',
          render: () => (
            <LiaLinksSurface scopeClass="playground-lia-links playground-lia-links--v6" />
          ),
        },
        {
          id: 'v7',
          label: 'v7',
          note: 'colour mode: purple desk',
          render: () => <ColouredSurface version="v7" />,
        },
        {
          id: 'v8',
          label: 'v8',
          note: 'colour mode: yellow desk',
          render: () => <ColouredSurface version="v8" />,
        },
        {
          id: 'v9',
          label: 'v9',
          note: 'card hover swap (three modes)',
          render: () => <ColouredSurface version="v9" />,
        },
      ]}
    />
  )
}

const DEFAULT_SLOT_ORDER: readonly number[] = [0, 1, 2, 3]

function shuffleOrder(current: readonly number[]): number[] {
  // Fisher-Yates, biased to avoid returning the same order back.
  for (let attempt = 0; attempt < 8; attempt++) {
    const next = [...current]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    if (next.some((v, i) => v !== current[i])) return next
  }
  return [...current]
}

function ColouredSurface({ version }: { version: 'v7' | 'v8' | 'v9' }) {
  const [mode, setMode] = useState<V7Mode>('light')
  const [slotOrder, setSlotOrder] = useState<number[]>([...DEFAULT_SLOT_ORDER])

  const cycleMode = () =>
    setMode(
      (current) => V7_MODES[(V7_MODES.indexOf(current) + 1) % V7_MODES.length],
    )

  const remix = () => setSlotOrder((current) => shuffleOrder(current))
  const reset = () => setSlotOrder([...DEFAULT_SLOT_ORDER])

  const palette = PAPER_PALETTES[version]
  const colourPalette =
    mode === 'colour' ? slotOrder.map((i) => palette[i]) : undefined

  // When the in-page mode toggle is set to 'dark', also apply the `.dark`
  // class so Tailwind's dark variants on ghost buttons fire inside the
  // scope. Without this the scope's CSS vars go dark but the Tailwind
  // hover rules still read light-mode tokens — which is why ghost-button
  // hovers were reading near-white before this fix.
  //
  // NOTE: don't paste literal Tailwind class strings (e.g. dark-prefixed
  // hover utilities) into comments here — Tailwind v4 scans source files
  // for class candidates and will generate the CSS for any literal it
  // finds, even in a JS comment. That regenerated rule then has higher
  // specificity than `hover:bg-muted` and reintroduces the original bug.
  const scopeClass =
    `playground-lia-links playground-lia-links--${version} playground-lia-links--${version}-${mode}` +
    (mode === 'dark' ? ' dark' : '')

  return (
    <LiaLinksSurface
      scopeClass={scopeClass}
      mode={mode}
      onCycleMode={cycleMode}
      colourPalette={colourPalette}
      onRemix={mode === 'colour' ? remix : undefined}
      onReset={mode === 'colour' ? reset : undefined}
    />
  )
}

const meta = {
  title: 'Playground/Lia Links',
  component: LiaLinks,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LiaLinks>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: 'Default' }
