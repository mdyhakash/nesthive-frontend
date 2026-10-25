"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "system"}
      position="top-center"
      offset={{ top: 72 }}
      mobileOffset={{ top: 64 }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-border !bg-card !text-card-foreground !shadow-lg !font-sans",
          description: "!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
