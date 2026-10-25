"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dialogVariants, overlayVariants } from "@/lib/motion";

/**
 * Dialog with spring in/out. Radix handles focus trap, scroll lock and a11y;
 * framer-motion's AnimatePresence handles the exit animation, so the Root
 * mirrors `open` into context and DialogContent force-mounts while animating.
 */
const OpenContext = React.createContext(false);

function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
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
      <DialogPrimitive.Root open={open} onOpenChange={handleChange} {...props} />
    </OpenContext.Provider>
  );
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  const open = React.useContext(OpenContext);
  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay forceMount asChild>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
          </DialogPrimitive.Overlay>
          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <DialogPrimitive.Content forceMount asChild {...props}>
              <motion.div
                data-slot="dialog-content"
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "pointer-events-auto relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 text-card-foreground shadow-xl outline-none sm:rounded-2xl",
                  className,
                )}
              >
                {children}
                {showClose && (
                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("mb-4 flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-xl font-bold leading-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
