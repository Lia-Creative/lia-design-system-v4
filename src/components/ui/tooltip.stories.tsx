import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

const meta = {
  title: 'Lia Primitives/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = {
  name: 'Default',
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Lia tooltip — short, plain, useful.</TooltipContent>
    </Tooltip>
  ),
}

export const StorySides: Story = {
  name: 'Sides',
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline">{side}</Button>} />
          <TooltipContent side={side}>From the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}
