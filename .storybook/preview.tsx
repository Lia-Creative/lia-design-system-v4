import type { Preview } from '@storybook/nextjs-vite'
import { ThemeProvider, useTheme } from 'next-themes'
import React from 'react'

import '../src/app/globals.css'
import liaTheme from './theme'

/**
 * Syncs the Storybook toolbar globalType `theme` with next-themes' ThemeProvider.
 * Only fires when the toolbar value actually changes, so the in-page ThemeToggle
 * isn't fought back to the toolbar value on every render.
 */
function ThemeSync({ theme }: { theme: string }) {
  const { setTheme } = useTheme()
  const lastApplied = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (lastApplied.current === theme) return
    lastApplied.current = theme
    setTheme(theme)
  }, [theme, setTheme])
  return null
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: liaTheme,
    },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
  },
  globalTypes: {
    theme: {
      description: 'Lia theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'light'
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeSync theme={theme} />
          <div className="antialiased">
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],
}

export default preview
