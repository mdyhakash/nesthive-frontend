import type { Manager, Owner, Role, TenantProfile, User } from "@/types";

export const users: User[] = [];

export const getUser = (id: string) => users.find((u) => u.id === id);

/** Fallback demo accounts if ever queried directly */
export const demoAccounts: Record<Role, User> = {
  TENANT: { id: "u-t1", name: "Tenant", email: "tenant@nesthive.com", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-01-01T00:00:00Z" },
  OWNER: { id: "u-o1", name: "Owner", email: "owner@nesthive.com", role: "OWNER", status: "ACTIVE", emailVerified: true, createdAt: "2026-01-01T00:00:00Z" },
  MANAGER: { id: "u-m1", name: "Manager", email: "manager@nesthive.com", role: "MANAGER", status: "ACTIVE", emailVerified: true, createdAt: "2026-01-01T00:00:00Z" },
  ADMIN: { id: "u-a1", name: "Admin", email: "admin@nesthive.com", role: "ADMIN", status: "ACTIVE", emailVerified: true, createdAt: "2026-01-01T00:00:00Z" },
};

export const tenantProfiles: TenantProfile[] = [];

export const owners: Owner[] = [];

export const managers: Manager[] = [];

export const CURRENT_TENANT_ID = "";
export const CURRENT_OWNER_ID = "";
export const CURRENT_MANAGER_ID = "";
