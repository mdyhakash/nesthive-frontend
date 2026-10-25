"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/data/marketing";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const base = href.split("#")[0];
  return pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href) && !link.href.includes("#");
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="relative rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-muted"
                    transition={transition.layout}
                  />
                )}
                <span className={cn("relative", active && "text-foreground")}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/register">Get started</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-3">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 border-t border-border p-5">
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/login">Log in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/register">Get started</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
