"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Button } from "./button"
import { cn } from "../../lib/utils"

interface ThemeToggleProps
  extends Omit<React.ComponentProps<typeof Button>, "children" | "onClick"> {
  /** Accessible label. Defaults to "Toggle theme". */
  label?: string
}

function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon-sm",
  label = "Toggle theme",
  ...props
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      data-slot="theme-toggle"
      variant={variant}
      size={size}
      aria-label={label}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("relative", className)}
      {...props}
    >
      <SunIcon
        className={cn(
          "absolute rotate-0 scale-100 transition-all",
          "dark:-rotate-90 dark:scale-0"
        )}
      />
      <MoonIcon
        className={cn(
          "absolute rotate-90 scale-0 transition-all",
          "dark:rotate-0 dark:scale-100"
        )}
      />
    </Button>
  )
}

export { ThemeToggle }
