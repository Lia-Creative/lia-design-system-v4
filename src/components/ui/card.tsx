'use client'

import * as React from 'react'

import { cn } from "../../lib/utils"

// Paper feel for every Card by default. The Card primitive owns the
// randomness (tilt, scissor-cut corners, paper-grain offset) so every
// consumer automatically gets paper without doing anything. Pass
// `data-paper="flat"` to opt out for cases where paper is wrong.
//
// CSS for the paper grain ::before lives in `globals.css` so the
// pseudo-element can be addressed by selector. The Card primitive sets
// the inline CSS variables that the rule reads (--surface-tilt,
// --card-radius, --paper-offset).

const TILT_RANGE = 0.5
const TILT_MIN = 0.15

function singleTilt(): number {
  const sign = Math.random() < 0.5 ? -1 : 1
  const magnitude = TILT_MIN + Math.random() * (TILT_RANGE - TILT_MIN)
  return sign * magnitude
}

function jaggedRadius(min: number, max: number): string {
  const r = () => (min + Math.random() * (max - min)).toFixed(1)
  return `${r()}px ${r()}px ${r()}px ${r()}px / ${r()}px ${r()}px ${r()}px ${r()}px`
}

function randomOffset(): string {
  return `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px`
}

function Card({
  className,
  size = 'default',
  style,
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  // Lazy-init random values per mount. Each Card gets its own tilt,
  // scissor radius, and paper-grain offset.
  const [paper] = React.useState(() => ({
    tilt: singleTilt().toFixed(2),
    radius: jaggedRadius(2, 10),
    offset: randomOffset(),
  }))

  return (
    <div
      data-slot="card"
      data-size={size}
      style={
        {
          '--surface-tilt': `${paper.tilt}deg`,
          '--card-radius': paper.radius,
          '--paper-offset': paper.offset,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'group/card flex flex-col gap-4 overflow-hidden bg-card py-4 text-sm text-card-foreground shadow-sm has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-[inherit] *:[img:last-child]:rounded-b-[inherit]',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-[0.8125rem] text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-4 group-data-[size=sm]/card:px-3', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
