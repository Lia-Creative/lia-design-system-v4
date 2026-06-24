import { addons } from 'storybook/manager-api'

import liaTheme from './theme'

// Lia branding for the Storybook chrome (sidebar, toolbar, brand title).
// Carried from v2 — `.storybook/theme.ts` only handles docs page theme;
// the manager UI needs an explicit setConfig call.
addons.setConfig({
  theme: liaTheme,
  sidebar: {
    showRoots: true,
  },
})
