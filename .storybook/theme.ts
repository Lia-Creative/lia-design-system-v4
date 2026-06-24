import { create } from 'storybook/theming/create'

// Lia-branded Storybook chrome — see CLAUDE.md > Storybook.
// Colours align with the Lia palette in src/app/globals.css.
// When light-mode tokens shift, mirror the change here.

export default create({
  base: 'light',

  brandTitle: 'Lia Design System',
  brandUrl: 'https://github.com/Lia-Creative/lia-design-system-v3',
  brandTarget: '_self',

  fontBase: '"DM Sans", system-ui, sans-serif',
  fontCode: '"DM Mono", ui-monospace, monospace',

  colorPrimary: '#1f4cff',
  colorSecondary: '#1f4cff',

  appBg: '#fafaf7',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e9e6df',
  appBorderRadius: 6,

  textColor: '#2b2820',
  textInverseColor: '#ffffff',

  barTextColor: '#7a7468',
  barSelectedColor: '#1f4cff',
  barHoverColor: '#1f4cff',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#e9e6df',
  inputTextColor: '#2b2820',
  inputBorderRadius: 6,
})
