"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FOOTER_COLUMNS } from "@/data/marketing";

const SOCIALS = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "LinkedIn", icon: LinkedinIcon },
  { label: "YouTube", icon: YoutubeIcon },
] as const;

export function Footer() {
  const [email, setEmail] = React.useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're subscribed", { description: "We'll send new listings and tips to " + email });
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Verified rooms, compatible roommates and rent that is easy to pay. Made for renters and owners across Dhaka.
            </p>
            <form onSubmit={subscribe} className="mt-6" noValidate>
              <label htmlFor="footer-email" className="mb-2 block text-sm font-medium">
                Get new listings by email
              </label>
              <div className="flex gap-2">
                <Input
                  id="footer-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                  Subscribe
                </Button>
              </div>
            </form>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-heading text-sm font-bold">{col.title}</h2>
                <ul className="mt-4 grid gap-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-11 items-center text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NestHive. All rights reserved.</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
