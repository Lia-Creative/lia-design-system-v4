// Public component surface for @lia/design-system.
//
// Consumers (e.g. internal.lia.build) import from "@lia/design-system".
// Internal imports here are RELATIVE so the package is self-contained and
// portable — it does NOT rely on the consumer mirroring the design system's
// "@/" path alias. Adding a new shared component = add a re-export below.

export { Button, buttonVariants } from "./ui/button"
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./ui/card"
export { Input } from "./ui/input"
export { Label } from "./ui/label"
export { Logo } from "./ui/logo"
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip"
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
export { Toaster } from "./ui/sonner"
export { ThemeToggle } from "./ui/theme-toggle"
export { ThemeProvider } from "./theme-provider"
