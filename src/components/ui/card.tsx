'use client'

import * as React from 'react'

import { cn } from "../../lib/utils"

// Paper-grain feel for every Card. The grain ::before lives in globals.css;
// the Card sets a random --paper-offset so each card's grain reads distinct
// (not a tiled repeat). v4: the tilt + scissor-cut auto-corners were removed —
// the language is soft & still now. The grain stays. Pass `data-paper="flat"`
// to opt out of the grain.

// Derive a stable per-instance paper-grain offset from React's useId. Seeding
// off the SSR-stable id (instead of Math.random at render) keeps server and
// client identical — no hydration mismatch — while still reading distinct per
// card, so the grain never tiles identically.
function offsetFromId(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0
  const x = Math.abs(h) % 2000
  const y = Math.abs(Math.imul(h, 2654435761)) % 2000
  return `${x}px ${y}px`
}

function Card({
  className,
  size = 'default',
  style,
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  const paperOffset = offsetFromId(React.useId())

  return (
    <div
      data-slot="card"
      data-size={size}
      style={{ '--paper-offset': paperOffset, ...style } as React.CSSProperties}
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
