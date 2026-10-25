import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold leading-none [&_svg]:size-3",
  {
    variants: {
      tone: {
        success: "bg-success-soft text-success-strong",
        warning: "bg-warning-soft text-warning-strong",
        danger: "bg-danger-soft text-danger-strong",
        info: "bg-info-soft text-info-strong",
        neutral: "bg-neutral-soft text-neutral-strong",
        amber: "bg-amber-soft text-warning-strong",
        teal: "bg-teal-soft text-secondary",
        outline: "border border-border bg-card text-foreground",
        bkash: "bg-bkash-soft text-bkash",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
