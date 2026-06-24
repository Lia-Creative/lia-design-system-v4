import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Lia Primitives/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const StoryDefault: Story = {
  name: 'Default',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name. Visible to anyone in your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-6">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" defaultValue="Dan Robson" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Save</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
