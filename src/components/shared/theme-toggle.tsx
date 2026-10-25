"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Sun/moon toggle with a rotate + fade swap. Both icons are always rendered and
 * switched with the `dark:` variant, so SSR and the first paint are always
 * correct (no flash, no hydration mismatch).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const icon = "absolute size-5 transition-all duration-300 ease-out motion-reduce:transition-none";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label="Toggle colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className={cn(icon, "rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0")} />
      <Moon className={cn(icon, "rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100")} />
    </Button>
  );
}
