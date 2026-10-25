import type { Role } from "@/types";

export const ROLES: Role[] = ["TENANT", "OWNER", "MANAGER", "ADMIN"];

export const ROLE_LABEL: Record<Role, string> = {
  TENANT: "Tenant",
  OWNER: "Owner",
  MANAGER: "Manager",
  ADMIN: "Admin",
};

export const ROLE_HOME: Record<Role, string> = {
  TENANT: "/tenant",
  OWNER: "/owner",
  MANAGER: "/manager",
  ADMIN: "/admin",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  TENANT: "Find a room, pay rent, split bills",
  OWNER: "List properties and manage tenants",
  MANAGER: "Handle day-to-day maintenance",
  ADMIN: "Review owners and oversee the platform",
};

export const ROLE_STORAGE_KEY = "nesthive.role";

export function roleFromPath(pathname: string): Role | null {
  if (pathname.startsWith("/tenant")) return "TENANT";
  if (pathname.startsWith("/owner")) return "OWNER";
  if (pathname.startsWith("/manager")) return "MANAGER";
  if (pathname.startsWith("/admin")) return "ADMIN";
  return null;
}
