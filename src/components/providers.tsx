"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster />
      </MotionConfig>
    </ThemeProvider>
  );
}
