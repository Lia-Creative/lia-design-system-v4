"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "../../lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart"

// A content-friendly bar chart built on the shadcn Chart primitives + Recharts.
// Authors pass plain data rows and a series list — no Recharts JSX. Supports
// vertical columns (optionally grouped/multi-series) and horizontal bars
// (single series, optional per-row colour), with value labels per bar.

export type BarSeries = {
  /** Numeric data key on each row. */
  key: string
  /** Legend / tooltip label. */
  label: string
  /** A token CSS var, e.g. "var(--primary)". Falls back to the chart ramp. */
  color?: string
}

export type BarRow = Record<string, string | number>

interface BarChartFigureProps {
  data: BarRow[]
  series: BarSeries[]
  /** "columns" = vertical bars (default); "bars" = horizontal bars. */
  orientation?: "columns" | "bars"
  /** Upper bound for the value axis (e.g. 10 for a 0–10 score). */
  max?: number
  /** Figure height in px (give horizontal charts with many rows more room). */
  height?: number
  /** Y-axis category-label column width (horizontal only). */
  labelWidth?: number
  caption?: string
  className?: string
}

const RAMP = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function BarChartFigure({
  data,
  series,
  orientation = "columns",
  max,
  height = 300,
  labelWidth = 150,
  caption,
  className,
}: BarChartFigureProps) {
  const horizontal = orientation === "bars"

  // Recharts 3 isn't SSR-safe, so render it only after mount; reserve the
  // height server-side to avoid layout shift.
  const [mounted, setMounted] = React.useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate for SSR-unsafe Recharts
  React.useEffect(() => setMounted(true), [])

  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      { label: s.label, color: s.color ?? RAMP[i % RAMP.length] },
    ]),
  )

  const valueDomain = max ? ([0, max] as const) : undefined

  return (
    <figure className={cn("my-8", className)}>
      {!mounted ? (
        <div style={{ height }} aria-hidden />
      ) : (
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={{ height }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 18, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            {...(horizontal ? { horizontal: false } : { vertical: false })}
            stroke="var(--border)"
          />
          {horizontal ? (
            <>
              <XAxis type="number" domain={valueDomain} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={labelWidth}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis type="number" domain={valueDomain} hide />
            </>
          )}
          {series.length > 1 && (
            <ChartLegend content={<ChartLegendContent />} />
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              radius={4}
              fillOpacity={0.9}
            >
              {series.length === 1 &&
                data.map((row, i) => (
                  <Cell
                    key={i}
                    fill={(row.color as string) ?? `var(--color-${s.key})`}
                  />
                ))}
              <LabelList
                dataKey={`${s.key}Label`}
                position={horizontal ? "right" : "top"}
                offset={8}
                fill="var(--foreground)"
                fontSize={11}
                fontFamily="var(--font-mono)"
              />
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
      )}
      {caption && (
        <figcaption className="mt-3 font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export { BarChartFigure }
