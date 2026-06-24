'use client'

import { useState, type ReactNode } from 'react'

export type PrototypeVersion = {
  id: string
  label: string
  note?: string
  render: () => ReactNode
}

type VersionTabsProps = {
  versions: PrototypeVersion[]
  defaultId?: string
}

/**
 * VersionTabs — the playground pattern for keeping iterations side-by-side.
 *
 * Each prototype renders its content inside <VersionTabs versions={[…]} />.
 * A neutral version selector sits above the canvas. As the version count
 * grew past a handful the previous horizontal tab strip needed sideways
 * scrolling; now it's a native <select> dropdown so every version is
 * reachable in one click without overflow.
 *
 * (Name kept as VersionTabs for backward-compat with import sites — the
 * mental model is still "switch between versions"; the UI just changed.)
 *
 * Convention:
 *   - v1 is always the baseline (untouched after first ship).
 *   - New iterations get added as v2, v3, … with a short `note` explaining
 *     the delta (e.g. "Figtree + paper shadow", "denser layout").
 *   - Default selection is the latest version.
 */
export function VersionTabs({ versions, defaultId }: VersionTabsProps) {
  const latestId = versions[versions.length - 1]?.id
  const [activeId, setActiveId] = useState(defaultId ?? latestId)
  const active = versions.find((v) => v.id === activeId) ?? versions[0]

  if (!active) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-md items-center gap-2 px-4 py-2">
          <label
            htmlFor="version-select"
            className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Version
          </label>
          <select
            id="version-select"
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm font-medium text-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
                {v.note ? ` — ${v.note}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1">{active.render()}</div>
    </div>
  )
}
