import * as React from "react"

import { cn } from "../../lib/utils"

type LogoVariant = "lockup" | "icon"

interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: LogoVariant
  /** Accessible label. Set to "" to mark decorative. */
  label?: string
}

const ICON_PATH =
  "M120 0C157.713 0 176.568 0 188.285 11.7158C200 23.4315 200 42.2878 200 80V120C200 157.713 200 176.568 211.715 188.285C223.432 200 242.287 200 280 200H290C327.713 200 346.568 200 358.285 211.715C370 223.432 370 242.287 370 280V320C370 357.713 370 376.568 358.285 388.285C346.568 400 327.713 400 290 400H208.125C187.233 400 170.268 383.197 170.003 362.367L169.997 361.383C169.732 340.553 152.767 323.75 131.875 323.75H80C42.2878 323.75 23.4315 323.75 11.7158 312.035C0 300.318 0 281.463 0 243.75V80C0 42.2878 0 23.4315 11.7158 11.7158C23.4315 0 42.2878 0 80 0H120ZM270 220C225.818 220 190 255.818 190 300C190 344.182 225.818 380 270 380C314.182 380 350 344.182 350 300C350 255.818 314.182 220 270 220ZM100 20C55.8172 20 20 55.8172 20 100V223.75C20 267.932 55.8172 303.75 100 303.75C144.183 303.75 180 267.932 180 223.75V100C180 55.8172 144.183 20 100 20Z"

const LOCKUP_L_PATH = "M0 233.87V0H41.6925V197.39H151.787V233.87H0Z"

const LOCKUP_I_PATH =
  "M0 40.0645V0H40.39V40.0645H0ZM39.7375 62.8652V233.87H0.649963V62.8652H39.7375Z"

const LOCKUP_A_PATH =
  "M57.655 177.195C25.0825 177.195 0 157.326 0 126.708C0 94.1355 24.43 79.803 57.33 72.963L104.56 63.1905V60.2605C104.56 43.973 96.0901 33.8755 75.2451 33.8755C56.6776 33.8755 46.905 42.3455 42.345 58.9555L5.53754 50.488C14.0075 22.1505 39.0875 0 76.8725 0C117.915 0 142.67 19.543 142.67 58.9555V132.57C142.67 142.343 146.905 145.273 157.653 143.97V174.263C129.315 177.521 114.33 171.983 108.468 157.978C97.72 170.028 79.805 177.195 57.655 177.195ZM104.56 114.003V93.158L67.7525 100.975C51.14 104.558 38.7625 109.771 38.7625 125.078C38.7625 138.433 48.535 145.926 63.5175 145.926C84.365 145.926 104.56 134.85 104.56 114.003Z"

function Logo({
  variant = "lockup",
  label = "Lia",
  className,
  ...props
}: LogoProps) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const }

  if (variant === "icon") {
    return (
      <svg
        data-slot="logo"
        data-variant="icon"
        viewBox="0 0 370 400"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-8 text-foreground", className)}
        {...a11y}
        {...props}
      >
        <path d={ICON_PATH} />
      </svg>
    )
  }

  return (
    <svg
      data-slot="logo"
      data-variant="lockup"
      viewBox="0 0 937 400"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto text-foreground", className)}
      {...a11y}
      {...props}
    >
      <path d={ICON_PATH} />
      <g transform="translate(470 81.6)">
        <path d={LOCKUP_L_PATH} />
      </g>
      <g transform="translate(630.23 81.6)">
        <path d={LOCKUP_I_PATH} />
      </g>
      <g transform="translate(682.32 141.2)">
        <path d={LOCKUP_A_PATH} />
      </g>
    </svg>
  )
}

export { Logo }
