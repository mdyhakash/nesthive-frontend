import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-7 text-[10px]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
} as const;

/** Soft palette drawn from the brand + semantic tokens; both themes stay readable. */
const TINTS = [
  "bg-amber-soft text-warning-strong",
  "bg-teal-soft text-secondary",
  "bg-info-soft text-info-strong",
  "bg-success-soft text-success-strong",
  "bg-danger-soft text-danger-strong",
  "bg-neutral-soft text-foreground",
];

function hash(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function UserAvatar({ name, src, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar className={cn(SIZES[size], "ring-2 ring-card", className)}>
      {src && <AvatarImage src={src} alt="" />}
      <AvatarFallback className={cn("font-semibold", TINTS[hash(name) % TINTS.length])} aria-label={name}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Overlapping avatars with a "+N" overflow chip. */
export function AvatarStack({ names, max = 4, size = "sm", className }: AvatarStackProps) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className={cn("flex items-center -space-x-2", className)} role="img" aria-label={`${names.length} occupants: ${names.join(", ")}`}>
      {shown.map((n) => (
        <UserAvatar key={n} name={n} size={size} />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "z-10 inline-flex items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-2 ring-card",
            SIZES[size],
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
