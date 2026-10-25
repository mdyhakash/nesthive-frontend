"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline: "border border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        soft: "bg-amber-soft text-foreground hover:bg-primary/25",
        "soft-teal": "bg-teal-soft text-secondary hover:bg-secondary/20",
        destructive: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
        bkash: "bg-bkash text-white hover:opacity-90",
        link: "h-auto min-h-0 rounded-none p-0 text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-4",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<typeof motion.button> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    // Slot children (e.g. next/link) can't be motion elements, so use a CSS tap squish.
    return (
      <Slot.Root
        data-slot="button"
        className={cn(classes, "active:scale-[0.97] motion-reduce:active:scale-100")}
        {...(props as React.ComponentProps<"button">)}
      />
    );
  }

  return (
    <motion.button
      data-slot="button"
      className={classes}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
