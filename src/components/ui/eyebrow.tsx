import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// The small mono, uppercase, wide-tracked label that sits above headings /
// sections ("COMPANY", "LIA · BRAND"). One tokenised spec so it stops drifting
// into a dozen ad-hoc font-mono/tracking-[…em] variants across consumers.
const eyebrowVariants = cva(
  "font-mono text-xs tracking-widest uppercase",
  {
    variants: {
      tone: {
        muted: "text-muted-foreground",
        accent: "text-primary",
      },
    },
    defaultVariants: { tone: "muted" },
  }
)

function Eyebrow({
  className,
  tone,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof eyebrowVariants>) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ tone }), className)}
      {...props}
    />
  )
}

export { Eyebrow, eyebrowVariants }
