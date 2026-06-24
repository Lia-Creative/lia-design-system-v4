import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CameraIcon, ZapIcon } from 'lucide-react'
import { toast } from 'sonner'

import './tokens.css'

import { PrototypeShell, usePrototypeShell } from '../_shared/prototype-shell'
import { VersionTabs } from '../_shared/version-tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { Toaster } from '@/components/ui/sonner'
import { Badge } from './components/badge'

/**
 * Content Machine — the machine-home / dashboard surface. The "container of
 * tools" view: the content pipeline shown as seven connected tool cards, each
 * with a one-line job and a status, under a calm "what's the next move" header.
 * Quick Post is surfaced as the live MVP path.
 *
 * Built to the machine's own design principles (ruthlessly simple, get out of
 * the way): it states the single next move, keeps the running state quiet, and
 * never becomes a metrics wall. Source: Lia Vault
 * `Inbox/2026-05-20-content-machine/` + the 2026-05-18 architecture note.
 */

type Status = 'live' | 'building' | 'planned'

const STATUS: Record<Status, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  live: { label: 'Live', variant: 'default' },
  building: { label: 'Building', variant: 'secondary' },
  planned: { label: 'Planned', variant: 'outline' },
}

type Stage = {
  n: string
  name: string
  job: string
  status: Status
  meta: string
  tool?: string
}

const stages: Stage[] = [
  {
    n: '01',
    name: 'Strategy',
    job: 'The angles, cadence and rules the rest of the machine follows.',
    status: 'live',
    meta: '3 angles defined',
  },
  {
    n: '02',
    name: 'Story',
    job: 'Find the thread across everything you capture — in the moment and over time.',
    status: 'building',
    meta: "Finding this month's thread",
  },
  {
    n: '03',
    name: 'Dump',
    job: 'A searchable library of every asset, transcribed on the way in.',
    status: 'live',
    meta: '128 assets · 12 new',
    tool: 'File Runner',
  },
  {
    n: '04',
    name: 'Create',
    job: 'A script, a song and the cuts, put together into an episode.',
    status: 'building',
    meta: '3 scripts drafting',
    tool: 'Script Builder',
  },
  {
    n: '05',
    name: 'Package',
    job: 'Covers, thumbnails and the per-platform assets that make it shareable.',
    status: 'planned',
    meta: 'Deferred for now',
  },
  {
    n: '06',
    name: 'Distribute',
    job: 'Post to every platform, at a consistent time, with minimal friction.',
    status: 'building',
    meta: '2 episodes ready',
    tool: 'Quick Post',
  },
  {
    n: '07',
    name: 'Learn',
    job: 'A brand scan plus comments — what landed, and what to rework next.',
    status: 'planned',
    meta: 'Loops back to Strategy',
  },
]

const eyebrow = 'text-xs font-medium tracking-wide text-muted-foreground uppercase'

function ContentMachineBody() {
  const { cardPaperStyle } = usePrototypeShell()

  return (
    <>
      <Toaster />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 pt-10 pb-16">
        {/* The one thing that matters right now. */}
        <section className="flex flex-col gap-3">
          <p className={eyebrow}>Content Machine</p>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Two episodes are ready to post.
          </h1>
          <p className="text-lg text-muted-foreground">
            Quick Post ships them to TikTok, YouTube and Instagram at your usual
            time. Then it gets out of the way and you get back to creating.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success('Queued for 5:00pm — TikTok, YouTube, Instagram')
              }
            >
              <ZapIcon data-icon="inline-start" />
              Quick Post
            </Button>
            <Button variant="outline">Review in Dump</Button>
          </div>
        </section>

        {/* Quiet running state — present, not loud. */}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>12 captures waiting in the Dump</span>
          <span aria-hidden>·</span>
          <span>3 scripts drafting</span>
          <span aria-hidden>·</span>
          <span>1 episode in Learn</span>
        </p>

        {/* The machine — the pipeline as a numbered set of tools. */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className={eyebrow}>The machine</p>
            <p className="text-xs text-muted-foreground">Seven tools, one workflow</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stages.map((stage, idx) => {
              const status = STATUS[stage.status]
              return (
                <Card key={stage.name} style={cardPaperStyle(idx)}>
                  <CardHeader>
                    <CardTitle className="flex items-baseline gap-2">
                      <span className="text-xs font-normal text-muted-foreground tabular-nums">
                        {stage.n}
                      </span>
                      {stage.name}
                    </CardTitle>
                    <CardDescription>{stage.job}</CardDescription>
                    <CardAction>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-card-foreground">{stage.meta}</span>
                    {stage.tool && (
                      <span className="text-muted-foreground">{stage.tool}</span>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Logo variant="icon" className="size-5" />
            <span>Content Machine</span>
          </div>
          <span className="italic">Get out of the way.</span>
        </footer>
      </div>
    </>
  )
}

function ContentMachine() {
  return (
    <VersionTabs
      versions={[
        {
          id: 'v1',
          label: 'v1',
          note: 'machine home — next-move header + seven tool cards',
          render: () => (
            <PrototypeShell
              slug="content-machine"
              version="v1"
              headerActions={
                <Button size="sm" variant="outline">
                  <CameraIcon data-icon="inline-start" />
                  Capture
                </Button>
              }
            >
              <ContentMachineBody />
            </PrototypeShell>
          ),
        },
      ]}
    />
  )
}

const meta = {
  title: 'Playground/Content Machine',
  component: ContentMachine,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContentMachine>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: 'Default' }
