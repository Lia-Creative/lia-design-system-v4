import * as React from "react"

// Whether the window has scrolled past `threshold` (px from the top).
//
// For scroll-aware chrome — e.g. a sticky `.paper-panel` header that's flat at
// the very top and lifts with a shadow once you scroll. SSR-safe: starts
// `false` (matching a server render at scroll 0), then syncs on mount and on
// every scroll. Listener is passive and cleaned up.
export function useScrolled(threshold = 0): boolean {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}
