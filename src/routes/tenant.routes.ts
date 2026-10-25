export const TENANT_ROUTES = {
  DASHBOARD: "/tenant",
  APPLICATIONS: "/tenant/applications",
  LEASE: "/tenant/lease",
  PAYMENTS: "/tenant/payments",
  UTILITIES: "/tenant/utilities",
  MAINTENANCE: "/tenant/maintenance",
  MAINTENANCE_NEW: "/tenant/maintenance/new",
  MAINTENANCE_DETAIL: (id: string) => `/tenant/maintenance/${id}`,
  ROOMMATES: "/tenant/roommates",
  VIEWINGS: "/tenant/viewings",
  NOTIFICATIONS: "/tenant/notifications",
  PROFILE: "/tenant/profile",
} as const;
