import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Eyebrow } from "./eyebrow"

const meta = {
  title: "Lia Primitives/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "Company" },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: "Default" }

export const StoryAccent: Story = {
  name: "Accent",
  args: { children: "Lia · Brand", tone: "accent" },
}

export const StoryInContext: Story = {
  name: "Above a heading",
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Eyebrow {...args} />
      <h2 className="font-serif text-3xl tracking-tight">Palette</h2>
    </div>
  ),
}
