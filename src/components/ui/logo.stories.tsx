import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Logo } from "./logo"

const meta = {
  title: "Lia Primitives/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["lockup", "icon"],
    },
    label: { control: "text" },
  },
  args: {
    variant: "lockup",
    label: "Lia",
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: "Default" }

export const StoryIcon: Story = {
  name: "Icon",
  args: { variant: "icon" },
}

export const StorySizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo className="h-4 w-auto" />
      <Logo className="h-6 w-auto" />
      <Logo className="h-8 w-auto" />
      <Logo className="h-12 w-auto" />
      <Logo className="h-16 w-auto" />
    </div>
  ),
}

export const StoryColours: Story = {
  name: "Colours",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo className="h-10 w-auto text-foreground" />
      <Logo className="h-10 w-auto text-primary" />
      <Logo className="h-10 w-auto text-muted-foreground" />
      <Logo className="h-10 w-auto text-destructive" />
    </div>
  ),
}

export const StoryIconSizes: Story = {
  name: "Icon Sizes",
  render: () => (
    <div className="flex items-end gap-4">
      <Logo variant="icon" className="size-4" />
      <Logo variant="icon" className="size-6" />
      <Logo variant="icon" className="size-8" />
      <Logo variant="icon" className="size-12" />
      <Logo variant="icon" className="size-16" />
    </div>
  ),
}

export const StoryInverseOnPrimary: Story = {
  name: "Inverse (on primary surface)",
  render: () => (
    <div className="flex items-center justify-center rounded-lg bg-primary p-12">
      <Logo className="h-12 w-auto text-primary-foreground" />
    </div>
  ),
}
