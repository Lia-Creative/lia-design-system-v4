import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ThemeToggle } from "./theme-toggle"

const meta = {
  title: "Lia Primitives/Theme Toggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
  args: {
    variant: "ghost",
    size: "icon-sm",
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: "Default" }

export const StoryOutline: Story = {
  name: "Outline",
  args: { variant: "outline", size: "icon-sm" },
}

export const StorySizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex items-center gap-3">
      <ThemeToggle size="icon-xs" />
      <ThemeToggle size="icon-sm" />
      <ThemeToggle size="icon" />
      <ThemeToggle size="icon-lg" />
    </div>
  ),
}

export const StoryInHeader: Story = {
  name: "In a header",
  render: () => (
    <div className="flex w-[480px] items-center justify-between rounded-lg border border-border px-4 py-3">
      <span className="text-sm font-medium">Lia surface</span>
      <ThemeToggle />
    </div>
  ),
}
