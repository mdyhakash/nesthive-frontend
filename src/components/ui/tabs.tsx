"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

/** Tabs with an animated active indicator (shared layout via layoutId). */
const TabsContext = React.createContext<{ value: string; id: string }>({ value: "", id: "" });

function Tabs({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const id = React.useId();
  return (
    <TabsContext.Provider value={{ value, id }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={value}
        onValueChange={(v) => {
          setInner(v);
          onValueChange?.(v);
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "scrollbar-hide inline-flex h-12 max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, children, value, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex h-10 min-w-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    >
      {active && (
        <motion.span
          layoutId={`tab-indicator-${ctx.id}`}
          className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm"
          transition={transition.layout}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
