import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex-1 container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Lia Design System</h1>
        <p className="text-muted-foreground mt-2">
          v3 — shadcn / Radix / Tailwind. Modular tools for independent musicians.
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Theme preview</CardTitle>
          <CardDescription>
            Primary, secondary, muted, and destructive surfaces on the Lia palette.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>
    </main>
  )
}
