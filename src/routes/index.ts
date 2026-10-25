import type { Role } from "@/types";
import { PUBLIC_ROUTES } from "./public.routes";
import { AUTH_ROUTES } from "./auth.routes";
import { TENANT_ROUTES } from "./tenant.routes";
import { OWNER_ROUTES } from "./owner.routes";
import { ADMIN_ROUTES } from "./admin.routes";

export * from "./public.routes";
export * from "./auth.routes";
export * from "./tenant.routes";
export * from "./owner.routes";
export * from "./admin.routes";

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  TENANT: TENANT_ROUTES.DASHBOARD,
  OWNER: OWNER_ROUTES.DASHBOARD,
  MANAGER: "/manager",
  ADMIN: ADMIN_ROUTES.DASHBOARD,
};

export function getDefaultDashboard(role: Role | null | undefined): string {
  if (!role) return PUBLIC_ROUTES.HOME;
  return ROLE_DEFAULT_ROUTES[role] || PUBLIC_ROUTES.HOME;
}
