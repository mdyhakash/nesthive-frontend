"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { dropdownVariants } from "@/lib/motion";

const OpenContext = React.createContext(false);

function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
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
      <DropdownMenuPrimitive.Root open={open} onOpenChange={handleChange} {...props} />
    </OpenContext.Provider>
  );
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "end",
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const open = React.useContext(OpenContext);
  return (
    <AnimatePresence>
      {open && (
        <DropdownMenuPrimitive.Portal forceMount>
          <DropdownMenuPrimitive.Content forceMount asChild sideOffset={sideOffset} align={align} {...props}>
            <motion.div
              data-slot="dropdown-menu-content"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)" }}
              className={cn(
                "z-50 min-w-52 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none",
                className,
              )}
            >
              {children}
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function DropdownMenuItem({
  className,
  destructive,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { destructive?: boolean }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none select-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        destructive && "text-danger-strong focus:bg-danger-soft [&_svg]:text-danger-strong",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};
