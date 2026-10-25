import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-danger aria-invalid:ring-danger/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
