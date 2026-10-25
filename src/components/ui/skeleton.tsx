import { cn } from "@/lib/utils";

/** Shimmering placeholder block. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-xl bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
