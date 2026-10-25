"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Search, Star } from "lucide-react";
import { PropertyImage } from "@/components/shared/property-image";
import { ScoreRing } from "@/components/shared/score-ring";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AREAS } from "@/data/properties";
import { TRUST_POINTS } from "@/data/marketing";
import { properties } from "@/data/properties";
import { formatBDT } from "@/lib/format";
import { iconFor } from "@/lib/icons";
import { floatLoop, heroContainer, heroItem } from "@/lib/motion";

const RENT_OPTIONS = [8000, 12000, 16000, 20000, 30000];
const ROOM_TYPES = ["Single", "Shared", "Master bedroom", "Seat"];

const floaters = [properties[0], properties[1]];

export function Hero() {
  const router = useRouter();
  const [area, setArea] = React.useState("any");
  const [maxRent, setMaxRent] = React.useState("any");
  const [roomType, setRoomType] = React.useState("any");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area !== "any") params.set("area", area);
    if (maxRent !== "any") params.set("maxRent", maxRent);
    if (roomType !== "any") params.set("roomType", roomType);
    router.push(`/browse${params.size ? `?${params}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden">
      {/* Amber → orange glow, kept soft and behind everything */}
      <div aria-hidden="true" className="hive-glow pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] max-w-[160%] -translate-x-1/2 opacity-70 dark:opacity-50" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div variants={heroContainer} initial="hidden" animate="visible" className="relative z-10">
          <motion.h1 variants={heroItem} className="text-hero max-w-xl text-balance">
            Find your room. Find your people.
          </motion.h1>
          <motion.p variants={heroItem} className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Verified rooms across Dhaka, roommates who match how you actually live, and rent you can pay with bKash.
          </motion.p>

          <motion.form
            variants={heroItem}
            onSubmit={onSearch}
            aria-label="Search rooms"
            className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 sm:p-5"
          >
            <div className="grid gap-2">
              <Label htmlFor="hero-area">Area</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger id="hero-area">
                  <SelectValue placeholder="Any area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any area in Dhaka</SelectItem>
                  {AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-rent">Max rent</Label>
              <Select value={maxRent} onValueChange={setMaxRent}>
                <SelectTrigger id="hero-rent">
                  <SelectValue placeholder="Any budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any budget</SelectItem>
                  {RENT_OPTIONS.map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      Up to {formatBDT(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="hero-type">Room type</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger id="hero-type">
                  <SelectValue placeholder="Any room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any room type</SelectItem>
                  {ROOM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="sm:col-span-2">
              <Search aria-hidden="true" />
              Search rooms
            </Button>
          </motion.form>

          <motion.ul variants={heroItem} className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {TRUST_POINTS.map((t) => {
              const Icon = iconFor(t.icon);
              return (
                <li key={t.label} className="inline-flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-teal-soft text-secondary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {t.label}
                </li>
              );
            })}
          </motion.ul>
        </motion.div>

        {/* Decorative floating cards (desktop only; the search card is the focus on mobile) */}
        <motion.div
          aria-hidden="true"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="relative hidden h-[520px] lg:block"
        >
          {floaters.map((p, i) => {
            const f = floatLoop(i * 1.2, 10);
            return (
              <motion.div
                key={p.id}
                variants={heroItem}
                className={i === 0 ? "absolute left-0 top-0 w-64" : "absolute bottom-0 right-0 w-64"}
              >
                <motion.div
                  animate={f.animate}
                  transition={f.transition}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
                >
                  <div className="relative aspect-[4/3]">
                    <PropertyImage src={p.images[0]} alt="" sizes="288px" priority={i === 0} />
                  </div>
                  <div className="grid gap-1 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-heading font-bold">{p.title}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold">
                        <Star className="size-3.5 fill-primary text-primary" />
                        <span className="num">{p.rating}</span>
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {p.area}, Dhaka
                    </p>
                    <p className="num mt-1 font-semibold">
                      {formatBDT(p.rent)}
                      <span className="font-sans text-sm font-normal text-muted-foreground"> /month</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          <motion.div variants={heroItem} className="absolute right-0 top-44">
            <motion.div
              animate={floatLoop(0.6, 8).animate}
              transition={floatLoop(0.6, 8).transition}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-xl shadow-black/10"
            >
              <ScoreRing score={92} size={60} strokeWidth={6} />
              <div>
                <p className="text-sm font-bold">92% match</p>
                <p className="text-xs text-muted-foreground">Early bird · Tidy · Quiet</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
