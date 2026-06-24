import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Lia Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'lia@example.com', type: 'email' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = { name: 'Default' }

export const StoryWithLabel: Story = {
  name: 'With Label',
  render: () => (
    <div className="flex w-[320px] flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="lia@example.com" />
    </div>
  ),
}

export const StoryInvalid: Story = {
  name: 'Invalid',
  render: () => (
    <div className="flex w-[320px] flex-col gap-2">
      <Label htmlFor="email-invalid">Email</Label>
      <Input id="email-invalid" type="email" defaultValue="not-an-email" aria-invalid />
    </div>
  ),
}

export const StoryDisabled: Story = {
  name: 'Disabled',
  args: { disabled: true, defaultValue: 'cannot edit' },
}
