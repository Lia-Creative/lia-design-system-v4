"use client"

import * as React from "react"
import {
  ArrowRight,
  Check,
  Sparkle,
  Lightning,
  ShieldCheck,
  Stack,
  Palette,
  Gauge,
  Star,
  Info,
  Quotes,
  MagnifyingGlass,
  Plus,
  DownloadSimple,
  Bell,
  CreditCard,
  User,
  CaretRight,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import "./theme.css"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// ── data ────────────────────────────────────────────────────────────────────

const NAV = ["Product", "Features", "Pricing", "Docs"]

const FEATURES = [
  {
    icon: Lightning,
    color: "text-orange-500",
    title: "Fast by default",
    body: "Ship in minutes, not weeks. Sensible defaults that get out of your way.",
    tag: "Performance",
  },
  {
    icon: Stack,
    color: "text-[#0044f9]",
    title: "Composable",
    body: "Every primitive is a building block. Stack them, theme them, own them.",
    tag: "Architecture",
  },
  {
    icon: ShieldCheck,
    color: "text-red-700",
    title: "Accessible",
    body: "Keyboard, screen-reader and contrast handled at the primitive level.",
    tag: "A11y",
  },
  {
    icon: Palette,
    color: "text-[#c663d6]",
    title: "Themeable",
    body: "One token layer drives the whole system. Rebrand in a single edit.",
    tag: "Design",
  },
  {
    icon: Gauge,
    color: "text-sky-500",
    title: "Measured",
    body: "Built-in analytics surfaces so you see what your work is doing.",
    tag: "Insight",
  },
  {
    icon: Sparkle,
    color: "text-yellow-500",
    title: "Delightful",
    body: "The small details — texture, motion, weight — that make it feel alive.",
    tag: "Craft",
  },
]

const PRICING = [
  {
    name: "Starter",
    img: "/illustrations/Starter.png",
    monthly: 0,
    annual: 0,
    blurb: "For getting a feel for the system.",
    features: ["Up to 3 projects", "Community support", "Core primitives"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Studio",
    img: "/illustrations/Studio.png",
    monthly: 24,
    annual: 19,
    blurb: "For working creatives and small teams.",
    features: [
      "Unlimited projects",
      "Priority support",
      "All blocks & themes",
      "Figma sync",
    ],
    cta: "Start trial",
    popular: true,
  },
  {
    name: "Scale",
    img: "/illustrations/Scale.png",
    monthly: 79,
    annual: 64,
    blurb: "For organisations rolling out at scale.",
    features: [
      "Everything in Studio",
      "SSO & roles",
      "Audit log",
      "Dedicated success",
    ],
    cta: "Talk to us",
    popular: false,
  },
]

const FAQ = [
  {
    q: "How does theming work?",
    a: "A three-layer token system: primitive ramps feed semantic tokens, which Tailwind exposes as utilities. Change a primitive and the whole system follows.",
  },
  {
    q: "Can I use my own components?",
    a: "Yes. Everything is plain React on Base UI primitives — fork, extend or replace any atom without fighting the framework.",
  },
  {
    q: "Does it sync with Figma?",
    a: "Tokens round-trip to Figma variables, so designers and engineers read from one source of truth.",
  },
  {
    q: "What about dark mode?",
    a: "Class-based dark mode ships out of the box. Every semantic token carries a light and dark value.",
  },
]

const PROJECTS = [
  { name: "Aurora", owner: "Maya Jensen", initials: "MJ", status: "Live", plan: "Studio", usage: 82 },
  { name: "Northwind", owner: "Ravi Shah", initials: "RS", status: "Building", plan: "Scale", usage: 41 },
  { name: "Fieldnotes", owner: "Kit Doyle", initials: "KD", status: "Live", plan: "Starter", usage: 17 },
  { name: "Lantern", owner: "Jo Lim", initials: "JL", status: "Paused", plan: "Studio", usage: 0 },
  { name: "Sundial", owner: "Ada Moore", initials: "AM", status: "Live", plan: "Scale", usage: 64 },
]

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Live: "default",
  Building: "secondary",
  Paused: "outline",
}

// Expanded v4 palette, mapped to Tailwind scales. `on` = which foreground the
// swatch carries (per the reference's black + white dots). Roles TBD.
const BRAND_COLORS = [
  { name: "Orange", tw: "orange-500", cls: "bg-orange-500", hex: "#F97316", on: "both" },
  { name: "Blue", tw: "lia-blue (brand)", cls: "bg-[#0044f9]", hex: "#0044F9", on: "white" },
  { name: "Magenta", tw: "fuchsia (muted)", cls: "bg-[#c663d6]", hex: "#C663D6", on: "white" },
  { name: "Brick", tw: "red-700", cls: "bg-red-700", hex: "#B91C1C", on: "white" },
  { name: "Gold", tw: "yellow-400", cls: "bg-yellow-400", hex: "#FACC15", on: "black" },
  { name: "Pink", tw: "fuchsia-300", cls: "bg-fuchsia-300", hex: "#F0ABFC", on: "black" },
  { name: "Sky", tw: "sky-200", cls: "bg-sky-200", hex: "#BAE6FD", on: "black" },
  { name: "Pale", tw: "yellow-200", cls: "bg-yellow-200", hex: "#FEF08A", on: "black" },
]

// Current-brand colours shown in intended usage ratios (reserved colour
// philosophy). Proportions are a first pass — refine once v4 palette lands.
const RATIO = [
  { label: "Surface", cls: "bg-background", pct: 60, role: "Paper / eggshell — dominant" },
  { label: "Ink", cls: "bg-foreground", pct: 18, role: "Text & fine detail" },
  { label: "Muted", cls: "bg-muted", pct: 10, role: "Dividers, fills" },
  { label: "Primary", cls: "bg-primary", pct: 5, role: "CTA — reserved" },
  { label: "Secondary", cls: "bg-secondary", pct: 4, role: "Support surfaces" },
  { label: "Accent", cls: "bg-accent", pct: 2, role: "Highlight — rare" },
  { label: "Destructive", cls: "bg-destructive", pct: 1, role: "Warnings only" },
]

// Type specimen — level → family mapping + the exact metrics (size / line-
// height / letter-spacing) for each level, rendered with inline styles so the
// numbers shown ARE the numbers rendering. Samples wrap to >1 line so line
// spacing is visible. `em` words demonstrate Martina italic for emphasis.
const MARTINA = "var(--font-martina)"
const SOHNE = "var(--font-sohne)"
const MONO = "var(--font-mono)"
// Fallback stacks per family (mirrors the --font-* declarations in theme.css).
const FALLBACKS: Record<string, string> = {
  "Martina Plantijn": "Libre Baskerville, Georgia, serif",
  "Söhne": "Figtree, system-ui, sans-serif",
  "Söhne Mono": "DM Mono, ui-monospace, monospace",
}
const TYPE_SPECIMEN = [
  { label: "H0 · Display", family: "Martina Plantijn", ff: MARTINA, size: "3.5rem", weight: 400, lh: "1.02", ls: "-0.025em", sample: <>Build a <em>more creative</em> world to live in</> },
  { label: "H1", family: "Martina Plantijn", ff: MARTINA, size: "3rem", weight: 400, lh: "1.05", ls: "-0.02em", sample: "A more creative world, built together" },
  { label: "H2", family: "Martina Plantijn", ff: MARTINA, size: "2.25rem", weight: 400, lh: "1.1", ls: "-0.015em", sample: "Everything you need, nothing you don’t" },
  { label: "H3", family: "Söhne", ff: SOHNE, size: "1.75rem", weight: 500, lh: "1.15", ls: "-0.01em", sample: "Built for makers and the teams behind them" },
  { label: "H4", family: "Martina Plantijn", ff: MARTINA, size: "1.5rem", weight: 400, lh: "1.2", ls: "-0.01em", sample: "Composable by design, themeable by default" },
  { label: "H5", family: "Söhne", ff: SOHNE, size: "1.25rem", weight: 500, lh: "1.3", ls: "-0.005em", sample: "Accessible at the core, for everyone who shows up" },
  { label: "H6", family: "Söhne", ff: SOHNE, size: "1.0625rem", weight: 500, lh: "1.4", ls: "0em", sample: "One source of truth for design and code alike" },
  { label: "Body · large", family: "Söhne", ff: SOHNE, size: "1.125rem", weight: 400, lh: "1.6", ls: "0em", sample: "Large body copy carries the lead paragraph. Söhne stays clean and open at size, holding a comfortable measure across two or three lines without tightening up." },
  { label: "Body · small", family: "Martina Plantijn", ff: MARTINA, size: "0.875rem", weight: 400, lh: "1.55", ls: "0em", sample: "Small body runs in Martina Plantijn — the serif at reading size is the signature, deliberate bet of this system. Watch how it stacks across multiple lines and whether the rhythm holds at length." },
  { label: "UI · lead (15)", family: "Söhne", ff: SOHNE, size: "0.9375rem", weight: 400, lh: "1.4", ls: "0.005em", sample: "Lead UI text — prominent controls and inline labels." },
  { label: "UI · control (13)", family: "Söhne", ff: SOHNE, size: "0.8125rem", weight: 500, lh: "1.4", ls: "0.005em", sample: "Control text — the workhorse for buttons, inputs, tabs and table cells." },
  { label: "UI · caption (12)", family: "Söhne", ff: SOHNE, size: "0.75rem", weight: 400, lh: "1.4", ls: "0.01em", sample: "Caption — secondary metadata and helper text." },
  { label: "UI · micro (11)", family: "Söhne", ff: SOHNE, size: "0.6875rem", weight: 500, lh: "1.4", ls: "0.01em", sample: "Micro — chips, timestamps and fine print." },
  { label: "Mono", family: "Söhne Mono", ff: MONO, size: "0.8125rem", weight: 400, lh: "1.5", ls: "0em", sample: "v4.0.0 · #2563EB · 13px / 1.5 — data, code and metrics." },
]

// ── page ──────────────────────────────────────────────────────────────────

export default function ThemePreview() {
  const [annual, setAnnual] = React.useState(true)

  return (
    <div className="brand-v4 min-h-svh overflow-x-hidden bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/LOGO.png"
              alt="Lia"
              className="brand-logo h-9 w-auto"
            />
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button size="sm">
              Get started
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
          <Badge variant="secondary">
            <Sparkle data-icon="inline-start" />
            Now in v4 — a new variation
          </Badge>
          <h1 className="text-3xl leading-[1.1] font-normal tracking-tight text-balance sm:text-5xl md:text-6xl [&_em]:italic">
            The design system for a <em>more creative</em> world.
          </h1>
          <p className="t-body-lg max-w-xl text-lg text-muted-foreground text-pretty">
            One token layer, every primitive, light and dark. Build products
            that feel like gifts — and rebrand the whole thing in a single edit.
          </p>
          <div className="mt-2 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => toast.success("Welcome aboard")}
            >
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse components
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <AvatarGroup>
              {["AM", "RS", "KD", "JL"].map((i) => (
                <Avatar key={i} className="size-8">
                  <AvatarFallback>{i}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>2k+</AvatarGroupCount>
            </AvatarGroup>
            <span className="text-sm text-muted-foreground">
              trusted by creators everywhere
            </span>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto w-full max-w-4xl px-6 pb-16">
          <div className="flex flex-col items-stretch justify-between gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
            {[
              ["40+", "primitives"],
              ["1", "token source"],
              ["2", "themes built-in"],
              ["100%", "Base UI"],
            ].map(([stat, label], i, arr) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-normal tracking-tight">
                    {stat}
                  </span>
                  <span className="text-xs tracking-wide text-muted-foreground uppercase">
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="hidden h-12 sm:block"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Brand reference — colour ratio + type specimen */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mb-10 flex flex-col gap-2">
            <p className="text-xs font-normal tracking-wide text-muted-foreground uppercase">
              Brand reference · v4 (work in progress)
            </p>
            <h2 className="t-display text-3xl">Colour, in the ratios we use it</h2>
            <p className="t-body-lg max-w-2xl text-muted-foreground">
              The neutrals carry the surface. Brand colour is rationed — it earns
              its place on a call to action. Current ramps shown; we evolve from
              here.
            </p>
          </div>

          {/* Brand palette — expanded, mapped to Tailwind */}
          <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BRAND_COLORS.map((c) => (
              <div key={c.name} className="flex flex-col gap-2">
                <div
                  className={`${c.cls} squircle flex h-24 items-center justify-center gap-3 rounded-2xl border border-black/5`}
                >
                  <span className="size-5 rounded-full bg-black" />
                  <span className="size-5 rounded-full bg-white" />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-normal">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.hex}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {c.tw}
                </span>
              </div>
            ))}
          </div>

          {/* Colour on chips — accent usage (not CTAs) */}
          <h3 className="mb-3 text-lg">Colour on chips</h3>
          <div className="mb-12 flex flex-wrap gap-2">
            <Badge className="bg-blue-600/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">Pro</Badge>
            <Badge className="bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">New</Badge>
            <Badge className="bg-fuchsia-500/15 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">Beta</Badge>
            <Badge className="bg-yellow-400/25 text-yellow-800 dark:bg-yellow-400/20 dark:text-yellow-200">Featured</Badge>
            <Badge className="bg-sky-200/50 text-sky-800 dark:bg-sky-400/20 dark:text-sky-200">Synced</Badge>
            <Badge className="bg-red-700/15 text-red-800 dark:bg-red-500/20 dark:text-red-300">Archived</Badge>
            <Badge className="bg-fuchsia-300/30 text-fuchsia-800 dark:bg-fuchsia-300/15 dark:text-fuchsia-200">Draft</Badge>
          </div>

          <h3 className="mb-3 text-lg">Usage ratios</h3>
          {/* Ratio bar */}
          <div className="squircle mb-4 flex h-14 w-full overflow-hidden rounded-2xl border border-border">
            {RATIO.map((c) => (
              <div
                key={c.label}
                className={c.cls}
                style={{ width: `${c.pct}%` }}
                title={`${c.label} — ${c.pct}%`}
              />
            ))}
          </div>

          {/* Swatch legend */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {RATIO.map((c) => (
              <div key={c.label} className="flex flex-col gap-1.5">
                <div
                  className={`${c.cls} squircle h-12 w-full rounded-xl border border-border`}
                />
                <div className="flex items-baseline justify-between gap-1">
                  <span className="t-body-sm text-sm font-normal">{c.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.pct}%
                  </span>
                </div>
                <span className="text-xs leading-tight text-muted-foreground">
                  {c.role}
                </span>
              </div>
            ))}
          </div>

          {/* Type specimen */}
          <div className="mt-16 mb-8 flex flex-col gap-2">
            <h2 className="t-display text-3xl">The type system</h2>
            <p className="t-body-lg max-w-2xl text-muted-foreground">
              Martina Plantijn (serif) and Söhne (grotesque), alternating by
              level. Shown literally, including the serif-at-small-body choice.
            </p>
          </div>
          <Card>
            <CardContent className="flex flex-col divide-y divide-border px-6">
              {TYPE_SPECIMEN.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8"
                >
                  <div className="flex w-56 shrink-0 flex-col gap-1 pt-1">
                    <span className="font-mono text-xs font-normal text-foreground">
                      {row.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.family}
                    </span>
                    <dl className="mt-1 flex flex-col gap-0.5 font-mono text-[0.7rem] text-muted-foreground">
                      <div className="flex justify-between gap-2">
                        <dt>size</dt>
                        <dd className="text-foreground/80">{row.size}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>weight</dt>
                        <dd className="text-foreground/80">{row.weight}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>line-height</dt>
                        <dd className="text-foreground/80">{row.lh}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>tracking</dt>
                        <dd className="text-foreground/80">{row.ls}</dd>
                      </div>
                      <div className="mt-1 flex flex-col gap-0.5">
                        <dt>fallback</dt>
                        <dd className="text-foreground/70">
                          {FALLBACKS[row.family]}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <p
                    className="max-w-xl flex-1 break-words text-pretty [&_em]:italic"
                    style={{
                      fontFamily: row.ff,
                      fontSize: row.size,
                      fontWeight: row.weight,
                      lineHeight: row.lh,
                      letterSpacing: row.ls,
                    }}
                  >
                    {row.sample}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
            <p className="text-xs font-normal tracking-wide text-muted-foreground uppercase">
              Features
            </p>
            <h2 className="text-3xl font-normal tracking-tight text-balance">
              Everything you need, nothing you don’t
            </h2>
            <p className="text-muted-foreground text-pretty">
              A complete, opinionated kit that stays out of your way.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, color, title, body, tag }) => (
              <Card key={title}>
                <CardHeader>
                  {/* No icon bubbles — brand rule. Icon sits bare on the surface. */}
                  <Icon weight="fill" className={`mb-3 size-7 ${color}`} />
                  <CardTitle className="flex items-center justify-between gap-2">
                    {title}
                    <Badge variant="outline">{tag}</Badge>
                  </CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <section className="mx-auto w-full max-w-4xl px-6 py-16">
          <Tabs defaultValue="creators" className="gap-6">
            <TabsList className="mx-auto">
              <TabsTrigger value="creators">For creators</TabsTrigger>
              <TabsTrigger value="teams">For teams</TabsTrigger>
              <TabsTrigger value="enterprise">For enterprise</TabsTrigger>
            </TabsList>
            {[
              {
                v: "creators",
                t: "Built for makers",
                d: "Spin up a branded surface in minutes and focus on the work, not the wiring.",
              },
              {
                v: "teams",
                t: "Built for teams",
                d: "Shared tokens keep design and engineering reading from the same page.",
              },
              {
                v: "enterprise",
                t: "Built for scale",
                d: "Roles, audit trails and governance for rolling out across an org.",
              },
            ].map(({ v, t, d }) => (
              <TabsContent key={v} value={v}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t}</CardTitle>
                    <CardDescription>{d}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">
                      Learn more
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Pricing */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-normal tracking-tight">
              Simple, honest pricing
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Monthly</span>
              <Switch checked={annual} onCheckedChange={setAnnual} />
              <span className="text-sm font-normal">
                Annual
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>
          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {PRICING.map((tier) => (
              <Card
                key={tier.name}
                data-paper="flat"
                className={`flex h-full flex-col ${
                  tier.popular ? "border-primary ring-1 ring-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="mb-1 flex items-start justify-between">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tier.img}
                      alt=""
                      className="pricing-art size-32 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden"
                      }}
                    />
                    {tier.popular && <Badge>Popular</Badge>}
                  </div>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.blurb}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-normal tracking-tight">
                      ${annual ? tier.annual : tier.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" />
                      {f}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonial + Alert */}
        <section className="mx-auto grid w-full max-w-4xl gap-4 px-6 py-16 md:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex gap-0.5 text-accent-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} weight="fill" className="size-4" />
                ))}
              </div>
              <p className="pullquote text-lg leading-relaxed text-balance">
                &ldquo;We rebranded our entire product in an afternoon. The token
                layer did all the work.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-normal">Maya Jensen</span>
                  <span className="text-xs text-muted-foreground">
                    Head of Design, Northbeam
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col justify-center gap-4">
            <Alert>
              <Info />
              <AlertTitle>One source of truth</AlertTitle>
              <AlertDescription>
                Tokens live in code and sync to Figma — designers and engineers
                never drift apart.
              </AlertDescription>
            </Alert>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="destructive">
                Destructive
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-2xl px-6 py-16">
          <h2 className="mb-6 text-center text-3xl font-normal tracking-tight">
            Questions, answered
          </h2>
          <Accordion multiple={false} defaultValue={["0"]}>
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={String(i)}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-4xl px-6 py-16">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center gap-6 px-6 py-12 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/illustrations/mountain.png"
                alt=""
                className="pricing-art -mb-2 size-48 object-contain sm:size-96"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden"
                }}
              />
              <h2 className="text-3xl font-normal tracking-tight text-balance">
                Start building today
              </h2>
              <p className="max-w-md text-muted-foreground text-pretty">
                Drop your email and we’ll send you the starter kit.
              </p>
              <form
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Check your inbox")
                }}
              >
                <div className="flex flex-1 flex-col gap-1.5 text-left">
                  <Label htmlFor="cta-email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder="you@studio.com"
                    required
                  />
                </div>
                <Select defaultValue="creator">
                  <SelectTrigger className="sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Send it</Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* SEO / editorial content — tests type at reading length */}
        <section className="mx-auto w-full max-w-3xl px-6 py-16">
          <p className="mb-3 text-xs font-normal tracking-wide text-muted-foreground uppercase">
            Guide
          </p>
          <h2 className="mb-4 text-4xl">Designing with a single token layer</h2>
          <p className="t-body-lg mb-8 text-lg text-muted-foreground">
            A design system lives or dies on its tokens. When every colour, size
            and radius traces back to one source, a rebrand stops being a
            migration and becomes a single edit.
          </p>
          <div className="flex flex-col gap-5 leading-relaxed">
            <p>
              The principle is simple: raw values live in exactly one place. A
              colour is authored once, as a named primitive, and everything
              downstream points at it. Nothing in a component file ever holds a
              literal — it reaches through a semantic token, which in turn aliases
              the primitive. Three hops, one source of truth.
            </p>
            <p>
              That discipline is what makes a system feel coherent rather than
              merely consistent. Consistency is a snapshot; coherence is a
              property that survives change. When the brand shifts — a warmer
              neutral, a new accent, a softer radius — the edit happens at the
              root and flows outward on its own.
            </p>
            <h3 className="mt-4 text-2xl">Why primitives come first</h3>
            <p>
              Build the ramp before the role. A neutral scale, a brand scale, the
              functional colours — defined as plain values, named by what they
              are, not what they do. Only then do you map meaning onto them.
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-muted-foreground">
              <li>Primitives hold the raw values — the only place a literal lives.</li>
              <li>Semantic tokens alias primitives and carry meaning (primary, muted, ring).</li>
              <li>Components consume semantics, never the raw value.</li>
            </ul>
            <blockquote className="flex flex-col gap-2 border-l-2 border-primary pl-4 text-muted-foreground italic">
              <Quotes weight="fill" className="size-5 text-primary not-italic" />
              Change a primitive and the whole system follows — that is the entire
              promise of a token layer.
            </blockquote>
            <p>
              It is not glamorous work, but it compounds. For the full breakdown,
              read the{" "}
              <a
                href="#"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                token architecture reference
              </a>
              .
            </p>
          </div>
        </section>

        {/* Data table */}
        <section id="projects" className="surface-ui mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl">Projects</h2>
              <p className="text-muted-foreground">
                Everything running on your account.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search projects"
                  placeholder="Search projects…"
                  className="search-input sm:w-56"
                />
              </div>
              <Button>
                <Plus data-icon="inline-start" />
                New
              </Button>
            </div>
          </div>
          <Card data-paper="flat" className="card-tight overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PROJECTS.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-normal">{p.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback>{p.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{p.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.plan}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.usage}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Settings page */}
        <section id="settings" className="surface-ui mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-3xl">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account and preferences.
            </p>
          </div>
          <Tabs defaultValue="account" className="gap-6">
            <TabsList>
              <TabsTrigger value="account">
                <User data-icon="inline-start" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell data-icon="inline-start" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard data-icon="inline-start" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>How you appear across Lia.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="set-name">Name</Label>
                      <Input id="set-name" defaultValue="Dan Robson" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="set-email">Email</Label>
                      <Input id="set-email" type="email" defaultValue="dan@lia.build" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="set-bio">Bio</Label>
                    <Textarea id="set-bio" defaultValue="Building a more creative world." />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label>Role</Label>
                      <Select defaultValue="founder">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="founder">Founder</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="engineer">Engineer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Theme</Label>
                      <RadioGroup defaultValue="system" className="flex gap-4">
                        {["Light", "Dark", "System"].map((t) => (
                          <Label
                            key={t}
                            className="flex items-center gap-2 font-normal"
                          >
                            <RadioGroupItem value={t.toLowerCase()} />
                            {t}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-4">
                    {[
                      ["Product updates", "New features and releases", true],
                      ["Security alerts", "Sign-ins and account changes", true],
                      ["Weekly digest", "A Monday summary of activity", false],
                    ].map(([t, d, on]) => (
                      <div
                        key={t as string}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-normal">{t as string}</span>
                          <span className="text-sm text-muted-foreground">
                            {d as string}
                          </span>
                        </div>
                        <Switch defaultChecked={on as boolean} />
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Interface density</Label>
                      <span className="text-sm text-muted-foreground">Comfortable</span>
                    </div>
                    <Slider defaultValue={[60]} />
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox id="set-terms" defaultChecked />
                    <Label
                      htmlFor="set-terms"
                      className="font-normal text-muted-foreground"
                    >
                      Email me product updates and the occasional newsletter.
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button onClick={() => toast.success("Settings saved")}>
                    Save changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose what reaches you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Info />
                    <AlertTitle>You’re all caught up</AlertTitle>
                    <AlertDescription>
                      No pending notifications. New activity will appear here.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Studio plan · renews 24 Jul 2026.</CardDescription>
                  <CardAction>
                    <Button variant="outline">
                      <DownloadSimple data-icon="inline-start" />
                      Invoices
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-6 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-normal">•••• 4242</span>
                      <span className="text-sm text-muted-foreground">
                        Expires 09 / 28
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">
                    Manage
                    <CaretRight data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer id="site-footer" className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div className="flex max-w-xs flex-col items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/illustrations/LOGO.png"
                alt="Lia"
                className="brand-logo h-9 w-auto self-start"
              />
              <p className="text-sm text-muted-foreground">
                Build a more creative world.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                ["Product", ["Features", "Pricing", "Changelog", "Docs"]],
                ["Company", ["About", "Blog", "Careers", "Contact"]],
                ["Legal", ["Privacy", "Terms", "Licences"]],
              ].map(([heading, links]) => (
                <div key={heading as string} className="flex flex-col gap-3">
                  <span className="text-xs font-normal tracking-wide text-muted-foreground uppercase">
                    {heading as string}
                  </span>
                  {(links as string[]).map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>© 2026 Lia Creative</span>
            <span className="italic">Life in adventure.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
