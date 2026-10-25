"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface FilterSheetProps {
  title?: string;
  description?: string;
  /** Number of active filters, shown on the trigger. */
  activeCount?: number;
  onReset?: () => void;
  children: React.ReactNode;
  /** Always render as a bottom sheet on mobile; below `lg` is the default breakpoint. */
  triggerClassName?: string;
}

/**
 * Filters on mobile live in a bottom sheet. The same `children` are rendered
 * inline on desktop by the page, so callers pass the controls to both.
 */
export function FilterSheet({
  title = "Filters",
  description = "Narrow the results.",
  activeCount = 0,
  onReset,
  children,
  triggerClassName,
}: FilterSheetProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={cn("relative", triggerClassName)}>
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="num ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-5 pb-4">{children}</div>
        <SheetFooter className="sticky bottom-0 flex-row">
          {onReset && (
            <Button variant="outline" className="flex-1" onClick={onReset}>
              Clear all
            </Button>
          )}
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
