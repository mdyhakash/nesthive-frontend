import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-input bg-card px-3.5 py-3 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-danger aria-invalid:ring-danger/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
