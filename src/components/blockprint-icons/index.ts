// Lia block-print expressive icon layer.
//
// Direct named imports are the supported API and are tree-shakeable — only the
// icons you import are bundled:
//
//   import { BlockprintHouseIcon } from "@lia/design-system/blockprint-icons"
//
// This is the EXPRESSIVE set (empty states, onboarding, feature cards, brand
// moments). Keep crisp Phosphor/Lucide icons for dense controls, nav, tables,
// and forms. Deliberately not re-exported from the main package barrel to keep
// it light — import from this subpath.

export * from "./generated"
export { createBlockprintIcon } from "./create-blockprint-icon"
export type { BlockprintIconProps } from "./create-blockprint-icon"
export { blockprintIconNames } from "./blockprint-icon-names"
export type { BlockprintIconName } from "./blockprint-icon-names"
