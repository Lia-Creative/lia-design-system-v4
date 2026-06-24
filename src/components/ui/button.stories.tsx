import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ArrowRightIcon, PlusIcon } from 'lucide-react'

import { Button } from './button'

const meta = {
  title: 'Lia Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: 'Default' }

export const StoryVariants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const StorySizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const StoryWithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const StoryDisabled: Story = {
  name: 'Disabled',
  args: { disabled: true },
}
