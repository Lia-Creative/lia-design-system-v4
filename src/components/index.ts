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

// v4 primitives — full public surface so consumers compose from real
// design-system components instead of hand-rolling them.
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion"
export { Alert, AlertTitle, AlertDescription, AlertAction } from "./ui/alert"
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "./ui/avatar"
export { Badge, badgeVariants } from "./ui/badge"
export { Checkbox } from "./ui/checkbox"
export { RadioGroup, RadioGroupItem } from "./ui/radio-group"
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
export { Separator } from "./ui/separator"
export { Slider } from "./ui/slider"
export { Switch } from "./ui/switch"
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./ui/table"
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "./ui/tabs"
export { Textarea } from "./ui/textarea"
