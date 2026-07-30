type IconProps = React.SVGProps<SVGSVGElement>;

/** Shared stroke setup — every icon below is a 24×24 line glyph. */
function Line({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H3z" />
      <path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H21z" />
    </Line>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.3" />
      <path d="M12 17h.01" />
    </Line>
  );
}

export function CoachIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.1" />
      <path d="M18 14.4A6 6 0 0 1 21.5 20" />
    </Line>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Line>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.5" />
    </Line>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2" />
    </Line>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Line>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Line>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Line>
  );
}

export function SlidesIcon(props: IconProps) {
  return (
    <Line {...props}>
      <rect x="3" y="4.5" width="18" height="11.5" rx="1.6" />
      <path d="M12 16v4M8.5 20h7" />
    </Line>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </Line>
  );
}

/**
 * The VinUni mark: a red triangle beside the navy V.
 *
 * The viewBox is cropped to the artwork's bounds (the source file pads it
 * inside a 613×613 square) so the mark fills whatever box it is given. Its two
 * brand colours are fixed rather than `currentColor`; the navy is lightened in
 * dark mode, where #134d8b all but disappears against the background.
 */
export function VinUniMark(props: IconProps) {
  return (
    <svg viewBox="126 113 360 363" aria-hidden="true" {...props}>
      <polygon className="fill-[#c72127]" points="126,115 213.5,202.5 126,290" />
      <polygon
        className="fill-[#134d8b] dark:fill-[#5a94cf]"
        points="486,113 486,296 306,476 133.5,303.5 225,212 306,293 387,212"
      />
    </svg>
  );
}
