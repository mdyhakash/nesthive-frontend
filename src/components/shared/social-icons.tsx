import type { SVGProps } from "react";

/** lucide-react no longer ships brand marks, so these are minimal inline glyphs. */
type P = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

export function FacebookIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-.9.4-1.7 1.8-1.7h1.5V3.4S15.5 3.2 14.3 3.2c-2.6 0-4.1 1.5-4.1 4.3v2.3H7.5V13h2.7v8z" />
    </svg>
  );
}

export function InstagramIcon(props: P) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M5.1 8.7h3V20h-3zM6.6 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 8.7h2.9v1.5h.1c.4-.8 1.4-1.7 3-1.7 3.1 0 3.7 2 3.7 4.7V20h-3v-6.1c0-1.4 0-3.3-2-3.3s-2.3 1.600-2.300 3.200V20H10z" />
    </svg>
  );
}

export function YoutubeIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800zM10 15V9l5.200 3z" />
    </svg>
  );
}
