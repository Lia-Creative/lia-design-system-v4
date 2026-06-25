import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  BlockprintAcornIcon,
  BlockprintAddressBookIcon,
  BlockprintAirplaneInFlightIcon,
  BlockprintBookIcon,
  BlockprintCameraIcon,
  BlockprintFileIcon,
  BlockprintFireIcon,
  BlockprintFlaskIcon,
  BlockprintFolderIcon,
  BlockprintGearFineIcon,
  BlockprintGearIcon,
  BlockprintGearSixIcon,
  BlockprintGlobeHemisphereWestIcon,
  BlockprintHeartIcon,
  BlockprintHouseIcon,
  BlockprintImageIcon,
  BlockprintLightningIcon,
  BlockprintMagicWandIcon,
  BlockprintPlantIcon,
  BlockprintRocketIcon,
  BlockprintSmileyIcon,
  BlockprintSparkleIcon,
  BlockprintStarIcon,
  BlockprintUserIcon,
} from "./generated"

const ICONS = [
  { name: "house", Icon: BlockprintHouseIcon },
  { name: "gear", Icon: BlockprintGearIcon },
  { name: "gear-six", Icon: BlockprintGearSixIcon },
  { name: "gear-fine", Icon: BlockprintGearFineIcon },
  { name: "heart", Icon: BlockprintHeartIcon },
  { name: "star", Icon: BlockprintStarIcon },
  { name: "sparkle", Icon: BlockprintSparkleIcon },
  { name: "smiley", Icon: BlockprintSmileyIcon },
  { name: "acorn", Icon: BlockprintAcornIcon },
  { name: "plant", Icon: BlockprintPlantIcon },
  { name: "lightning", Icon: BlockprintLightningIcon },
  { name: "fire", Icon: BlockprintFireIcon },
  { name: "rocket", Icon: BlockprintRocketIcon },
  { name: "magic-wand", Icon: BlockprintMagicWandIcon },
  { name: "camera", Icon: BlockprintCameraIcon },
  { name: "image", Icon: BlockprintImageIcon },
  { name: "folder", Icon: BlockprintFolderIcon },
  { name: "file", Icon: BlockprintFileIcon },
  { name: "book", Icon: BlockprintBookIcon },
  { name: "flask", Icon: BlockprintFlaskIcon },
  { name: "user", Icon: BlockprintUserIcon },
  { name: "address-book", Icon: BlockprintAddressBookIcon },
  { name: "airplane-in-flight", Icon: BlockprintAirplaneInFlightIcon },
  { name: "globe-hemisphere-west", Icon: BlockprintGlobeHemisphereWestIcon },
] as const

const meta = {
  title: "Lia Expressive/Blockprint Icons",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The expressive block-print icon set (1,512 icons, Phosphor-derived). Use for empty states, onboarding, feature cards and brand moments. Keep crisp Phosphor/Lucide icons for dense controls, nav, tables and forms. Icons inherit colour via currentColor; import them directly from `@lia/design-system/blockprint-icons`.",
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StoryGrid: Story = {
  name: "Grid (24 representative)",
  render: () => (
    <div className="grid grid-cols-6 gap-6 text-foreground">
      {ICONS.map(({ name, Icon }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon className="size-12" aria-label={name} />
          <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const StorySizes: Story = {
  name: "Sizes (24 / 32 / 64 / 128)",
  render: () => (
    <div className="flex items-end gap-8 text-foreground">
      {[
        { px: 24, cls: "size-6" },
        { px: 32, cls: "size-8" },
        { px: 64, cls: "size-16" },
        { px: 128, cls: "size-32" },
      ].map(({ px, cls }) => (
        <div key={px} className="flex flex-col items-center gap-2">
          <BlockprintRocketIcon className={cls} aria-label={`rocket ${px}px`} />
          <span className="font-mono text-[10px] text-muted-foreground">{px}px</span>
        </div>
      ))}
    </div>
  ),
}

export const StoryColor: Story = {
  name: "Colour (currentColor)",
  render: () => (
    <div className="flex items-center gap-8">
      <BlockprintHeartIcon className="size-16 text-foreground" aria-label="foreground" />
      <BlockprintHeartIcon className="size-16 text-primary" aria-label="primary" />
      <BlockprintHeartIcon
        className="size-16"
        style={{ color: "var(--lia-orange)" }}
        aria-label="orange"
      />
      <BlockprintHeartIcon
        className="size-16"
        style={{ color: "var(--lia-magenta)" }}
        aria-label="magenta"
      />
    </div>
  ),
}

export const StoryDark: Story = {
  name: "On dark",
  render: () => (
    <div className="dark grid grid-cols-6 gap-6 rounded-xl bg-background p-8 text-foreground">
      {ICONS.slice(0, 12).map(({ name, Icon }) => (
        <Icon key={name} className="size-12" aria-label={name} />
      ))}
    </div>
  ),
}
