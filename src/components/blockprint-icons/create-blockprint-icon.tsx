import * as React from "react"

// Factory for the Lia block-print expressive icon layer. Each generated icon
// module binds its mask markup here. Kept free of "use client"/hooks so the
// icons render as zero-JS server components (ideal for RSC/MDX). The mask id is
// name-scoped, so it's globally unique per icon and repeated use of the same
// icon renders correctly (the duplicated masks are identical). If you ever need
// strictly-unique DOM ids on one page, pass `idSuffix`.

export interface BlockprintIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "color"> {
  /** Accessible label. Omit for decorative icons (renders aria-hidden). */
  title?: string
  /** Disambiguates the internal mask id when strictly-unique DOM ids matter. */
  idSuffix?: string
}

export function createBlockprintIcon(maskInner: string, name: string) {
  function BlockprintIcon({
    title,
    idSuffix,
    role,
    "aria-label": ariaLabel,
    ...props
  }: BlockprintIconProps) {
    const label = title ?? ariaLabel
    const maskId = `bp-${name}${idSuffix ? `-${idSuffix}` : ""}`
    return (
      <svg
        viewBox="0 0 800 800"
        width="1em"
        height="1em"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        role={label ? "img" : role}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          dangerouslySetInnerHTML={{ __html: maskInner }}
        />
        <rect width="800" height="800" fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
    )
  }
  BlockprintIcon.displayName = `Blockprint${name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")}Icon`
  return BlockprintIcon
}
