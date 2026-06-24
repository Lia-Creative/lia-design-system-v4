# Lia Design System — Design Source

Figma file: [Lia Design System (shadcn studio)](https://www.figma.com/design/0b2h7j9vYI2mnW9ARPjour/Lia-Design-System--shadcn-studio-)

File key: `0b2h7j9vYI2mnW9ARPjour`

> Replaces the original `Lia-shadcn-studio` file (`I6XZUsUEu44R1gQSGLNQXx`) from the April 2026 build. Figma↔code sync targets this file only.

## `lia-tokens.tokens.json`

Tokens Studio-compatible export of the Lia theme (light + dark). Use this to apply the theme to the shadcn/ui Figma kit when the shadcn/studio Figma plugin or MCP write path is unavailable.

### Import into Figma (via Tokens Studio plugin)

1. In Figma, open the Lia Design System file
2. Run the **Tokens Studio for Figma** plugin (install from Community if needed)
3. Tools → Load existing tokens → JSON file → select `design/lia-tokens.tokens.json`
4. In the Tokens Studio panel, apply the `Lia Light` theme (then `Lia Dark` for the dark mode)
5. Tools → Sync → Figma Variables → this writes the tokens into the `☀️ Mode` variable collection

### Import into Figma (manual, no plugin)

If Tokens Studio isn't available, you can paste the hex values directly into the `☀️ Mode` collection's Light and Dark mode columns. The JSON keys match the `theme/*` variable names.

### Source of truth

The canonical theme source is `src/app/globals.css` — these JSON files are regenerated from that.
