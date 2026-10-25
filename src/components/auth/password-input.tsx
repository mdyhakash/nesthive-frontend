"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Password field with a show/hide toggle (44px tap target, labelled). */
export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(function PasswordInput(
  props,
  ref,
) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={visible ? "text" : "password"} className="pr-12" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
