import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

const meta = {
  title: 'Lia Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = {
  name: 'Default',
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Project: ABG</CardTitle>
        <CardDescription>Chris&apos;s music project. Phase 0 trigger for Lia.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          EP release · 5K monthly listeners · 2+ live shows booked.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="ghost">Snooze</Button>
        <Button>Open in Linear</Button>
      </CardFooter>
    </Card>
  ),
}

export const StoryWithAction: Story = {
  name: 'With Action',
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Tokens out of sync</CardTitle>
        <CardDescription>Figma file has 3 unmapped variables.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Resync
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  ),
}

export const StorySmall: Story = {
  name: 'Small',
  render: () => (
    <Card size="sm" className="w-[280px]">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter padding, smaller gap.</CardDescription>
      </CardHeader>
    </Card>
  ),
}
