import {
  BadgeCheck,
  BellRing,
  CalendarCheck,
  FileSignature,
  FileText,
  KeyRound,
  Receipt,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Marketing data stores icon names as strings; this resolves them. */
export const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  BellRing,
  CalendarCheck,
  FileSignature,
  FileText,
  KeyRound,
  Receipt,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
};

export const iconFor = (name: string): LucideIcon => ICONS[name] ?? BadgeCheck;
