"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { DemoProvider } from "@/components/demo-provider";
import { DataProvider } from "@/components/data-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <DemoProvider>
              <DataProvider>
                {children}
                <Toaster />
              </DataProvider>
            </DemoProvider>
          </AuthProvider>
        </MotionConfig>
      </ThemeProvider>
    </QueryProvider>
  );
}

export * from "./query-provider";
export * from "./theme-provider";
