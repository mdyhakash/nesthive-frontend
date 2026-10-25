import Link from "next/link";
import { cn } from "@/lib/utils";

/** Hexagon "hive" mark + wordmark. Inline SVG so it follows the theme tokens. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <path
        d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z"
        fill="var(--primary)"
      />
      <path
        d="M10.5 21v-7.2L16 9.5l5.5 4.3V21h-3.4v-4.4h-4.2V21z"
        fill="var(--primary-foreground)"
      />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="NestHive home"
      className={cn("inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <LogoMark />
      <span className="font-heading text-xl font-extrabold tracking-tight">
        Nest<span className="text-secondary">Hive</span>
      </span>
    </Link>
  );
}
