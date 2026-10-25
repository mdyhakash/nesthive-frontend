"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { overlayVariants, sheetVariants } from "@/lib/motion";

/** Side / bottom sheet built on Radix Dialog with spring slide in/out. */
const OpenContext = React.createContext(false);

function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const handleChange = React.useCallback(
    (next: boolean) => {
      setInner(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  return (
    <OpenContext.Provider value={open}>
      <SheetPrimitive.Root open={open} onOpenChange={handleChange} {...props} />
    </OpenContext.Provider>
  );
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

type Side = keyof typeof sheetVariants;

const sideClasses: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-[88%] max-w-sm border-l",
  left: "inset-y-0 left-0 h-full w-[88%] max-w-sm border-r",
  top: "inset-x-0 top-0 max-h-[85dvh] border-b rounded-b-3xl",
  bottom: "inset-x-0 bottom-0 max-h-[88dvh] border-t rounded-t-3xl",
};

function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: Side; showClose?: boolean }) {
  const open = React.useContext(OpenContext);
  return (
    <AnimatePresence>
      {open && (
        <SheetPrimitive.Portal forceMount>
          <SheetPrimitive.Overlay forceMount asChild>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
          </SheetPrimitive.Overlay>
          <SheetPrimitive.Content forceMount asChild {...props}>
            <motion.div
              data-slot="sheet-content"
              variants={sheetVariants[side]}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "fixed z-50 flex flex-col overflow-y-auto border-border bg-card text-card-foreground shadow-xl outline-none",
                sideClasses[side],
                className,
              )}
            >
              {side === "bottom" && (
                <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border" />
              )}
              {children}
              {showClose && (
                <SheetPrimitive.Close
                  aria-label="Close"
                  className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </SheetPrimitive.Close>
              )}
            </motion.div>
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-5 pr-14", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 border-t border-border bg-card p-5", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("font-heading text-lg font-bold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
