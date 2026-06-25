import { cn } from "../../lib/utils"
import logoLockup from "./lia-logo.png"

// v4 brand logo. The `lockup` variant is the hand-done mark (smiley + "Lia"),
// bundled as a PNG and imported so it travels with the package (Next processes
// the import via transpilePackages — no per-consumer asset copy needed). The
// `icon` variant keeps the geometric mark for now; a hand-done icon-only asset
// can replace it later.

type LogoVariant = "lockup" | "icon"

interface LogoProps {
  variant?: LogoVariant
  /** Accessible label. Set to "" to mark decorative. */
  label?: string
  className?: string
}

const ICON_PATH =
  "M120 0C157.713 0 176.568 0 188.285 11.7158C200 23.4315 200 42.2878 200 80V120C200 157.713 200 176.568 211.715 188.285C223.432 200 242.287 200 280 200H290C327.713 200 346.568 200 358.285 211.715C370 223.432 370 242.287 370 280V320C370 357.713 370 376.568 358.285 388.285C346.568 400 327.713 400 290 400H208.125C187.233 400 170.268 383.197 170.003 362.367L169.997 361.383C169.732 340.553 152.767 323.75 131.875 323.75H80C42.2878 323.75 23.4315 323.75 11.7158 312.035C0 300.318 0 281.463 0 243.75V80C0 42.2878 0 23.4315 11.7158 11.7158C23.4315 0 42.2878 0 80 0H120ZM270 220C225.818 220 190 255.818 190 300C190 344.182 225.818 380 270 380C314.182 380 350 344.182 350 300C350 255.818 314.182 220 270 220ZM100 20C55.8172 20 20 55.8172 20 100V223.75C20 267.932 55.8172 303.75 100 303.75C144.183 303.75 180 267.932 180 223.75V100C180 55.8172 144.183 20 100 20Z"

function Logo({ variant = "lockup", label = "Lia", className }: LogoProps) {
  if (variant === "icon") {
    const a11y = label
      ? { role: "img" as const, "aria-label": label }
      : { "aria-hidden": true as const }
    return (
      <svg
        data-slot="logo"
        data-variant="icon"
        viewBox="0 0 370 400"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-8 text-foreground", className)}
        {...a11y}
      >
        <path d={ICON_PATH} />
      </svg>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="logo"
      data-variant="lockup"
      src={typeof logoLockup === "string" ? logoLockup : logoLockup.src}
      alt={label}
      className={cn("h-8 w-auto", className)}
    />
  )
}

export { Logo }
