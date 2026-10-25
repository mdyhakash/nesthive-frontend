import {
  Bell,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  HeartHandshake,
  History,
  Home,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match only the exact path (used for dashboards). */
  exact?: boolean;
}

export const NAV: Record<Role, NavItem[]> = {
  TENANT: [
    { label: "Dashboard", href: "/tenant", icon: LayoutDashboard, exact: true },
    { label: "Payments", href: "/tenant/payments", icon: CreditCard },
    { label: "Roommates", href: "/tenant/roommates", icon: HeartHandshake },
    { label: "Maintenance", href: "/tenant/maintenance", icon: Wrench },
    { label: "Viewings", href: "/tenant/viewings", icon: CalendarClock },
    { label: "Applications", href: "/tenant/applications", icon: ClipboardList },
    { label: "My lease", href: "/tenant/lease", icon: FileText },
    { label: "Utility splits", href: "/tenant/utilities", icon: ReceiptText },
    { label: "Notifications", href: "/tenant/notifications", icon: Bell },
    { label: "Profile", href: "/tenant/profile", icon: UserRound },
  ],
  OWNER: [
    { label: "Dashboard", href: "/owner", icon: LayoutDashboard, exact: true },
    { label: "Properties", href: "/owner/properties", icon: Building2 },
    { label: "Applications", href: "/owner/applications", icon: ClipboardList },
    { label: "Payments", href: "/owner/payments", icon: CreditCard },
    { label: "Verification", href: "/owner/kyc", icon: ShieldCheck },
    { label: "Viewings", href: "/owner/viewings", icon: CalendarClock },
    { label: "Leases", href: "/owner/leases", icon: FileText },
    { label: "Utility bills", href: "/owner/utilities", icon: ReceiptText },
    { label: "Maintenance", href: "/owner/maintenance", icon: Wrench },
    { label: "Managers", href: "/owner/managers", icon: UserCog },
    { label: "Notifications", href: "/owner/notifications", icon: Bell },
    { label: "Profile", href: "/owner/profile", icon: UserRound },
  ],
  MANAGER: [
    { label: "Dashboard", href: "/manager", icon: LayoutDashboard, exact: true },
    { label: "Properties", href: "/manager/properties", icon: Building2 },
    { label: "Maintenance", href: "/manager/maintenance", icon: Wrench },
    { label: "Leases", href: "/manager/leases", icon: FileText },
    { label: "Notifications", href: "/manager/notifications", icon: Bell },
    { label: "Profile", href: "/manager/profile", icon: UserRound },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: Gauge, exact: true },
    { label: "KYC queue", href: "/admin/kyc", icon: ShieldCheck },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Leases", href: "/admin/leases", icon: FileText },
    { label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    { label: "Audit logs", href: "/admin/audit", icon: History },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Profile", href: "/admin/profile", icon: UserRound },
  ],
};

/** How many items sit directly in the mobile bottom bar (the rest go under "More"). */
export const BOTTOM_BAR: Record<Role, number> = { TENANT: 4, OWNER: 4, MANAGER: 5, ADMIN: 4 };

export const ROLE_ICON: Record<Role, LucideIcon> = {
  TENANT: Home,
  OWNER: Building2,
  MANAGER: UserCog,
  ADMIN: ScrollText,
};

export function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function titleFor(role: Role, pathname: string): string {
  const match = NAV[role].filter((i) => isActive(pathname, i)).sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "NestHive";
}
