import * as React from "react"

// True only after the first client render.
//
// Gate client-only UI behind this — browser APIs, SSR-unsafe libraries (e.g.
// Recharts), or post-hydration theme state — so the server render and the
// client's first render match and React logs no hydration mismatch. The
// one-time mount gate (and its lint exception) lives here once, instead of being
// hand-rolled in every component that needs it.
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount gate
  React.useEffect(() => setMounted(true), [])
  return mounted
}
