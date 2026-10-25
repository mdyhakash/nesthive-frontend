import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type OwnerItem, type TenantItem } from "@/api/admin.api";
import { leaseApi } from "@/api/lease.api";
import { paymentApi } from "@/api/payment.api";
import { maintenanceApi } from "@/api/maintenance.api";
import { useAuthStore } from "@/store/auth.store";
import { extractData } from "@/lib/api-helper";
import type { User } from "@/types";
import { toast } from "sonner";

export const ADMIN_KEYS = {
  all: ["admin"] as const,
  overview: () => [...ADMIN_KEYS.all, "overview"] as const,
  kycPending: () => [...ADMIN_KEYS.all, "kyc-pending"] as const,
  owners: () => [...ADMIN_KEYS.all, "owners"] as const,
  tenants: () => [...ADMIN_KEYS.all, "tenants"] as const,
  auditLogs: (page?: number) => [...ADMIN_KEYS.all, "audit-logs", page] as const,
  leases: () => [...ADMIN_KEYS.all, "leases"] as const,
  payments: () => [...ADMIN_KEYS.all, "payments"] as const,
  maintenance: () => [...ADMIN_KEYS.all, "maintenance"] as const,
};

export function useAdminOverview(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.overview(),
    queryFn: () => adminApi.getPlatformOverview(),
    enabled: options?.enabled !== false && isAdmin,
    staleTime: 30 * 1000,
  });
}

export function usePendingKycOwners(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.kycPending(),
    queryFn: () => adminApi.getPendingKycOwners(),
    enabled: options?.enabled !== false && isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAllOwners(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.owners(),
    queryFn: () => adminApi.getOwners(),
    enabled: options?.enabled !== false && isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAllTenants(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.tenants(),
    queryFn: () => adminApi.getTenants(),
    enabled: options?.enabled !== false && isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAdminUsers(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  const ownersQuery = useAllOwners(options);
  const tenantsQuery = useAllTenants(options);

  const ownersRaw = extractData<OwnerItem[]>(ownersQuery.data) || [];
  const tenantsRaw = extractData<TenantItem[]>(tenantsQuery.data) || [];

  const users: User[] = React.useMemo(() => {
    const list: User[] = [];

    // Current Admin account
    if (user && user.role === "ADMIN") {
      list.push(user);
    }

    // Add Owners
    if (Array.isArray(ownersRaw)) {
      ownersRaw.forEach((o) => {
        const uId = o.userId || o.id;
        if (!list.some((u) => u.id === uId)) {
          list.push({
            id: uId,
            name: o.name || "Owner",
            email: o.email,
            phone: o.contactNumber || "N/A",
            role: "OWNER",
            status: o.user?.status || "ACTIVE",
            emailVerified: o.user?.emailVerified ?? true,
            createdAt: o.createdAt,
            lastActiveAt: o.updatedAt,
          });
        }
      });
    }

    // Add Tenants
    if (Array.isArray(tenantsRaw)) {
      tenantsRaw.forEach((t) => {
        const uId = t.userId || t.id;
        if (!list.some((u) => u.id === uId)) {
          list.push({
            id: uId,
            name: t.name || "Tenant",
            email: t.email,
            phone: t.contactNumber || "N/A",
            role: "TENANT",
            status: t.user?.status || "ACTIVE",
            emailVerified: t.user?.emailVerified ?? true,
            createdAt: t.createdAt,
            lastActiveAt: t.updatedAt,
          });
        }
      });
    }

    return list;
  }, [ownersRaw, tenantsRaw, user]);

  return {
    users,
    isLoading: ownersQuery.isLoading || tenantsQuery.isLoading,
    isError: ownersQuery.isError || tenantsQuery.isError,
    refetch: () => {
      ownersQuery.refetch();
      tenantsQuery.refetch();
    },
  };
}

export function useUpdateKycStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ownerId,
      status,
      rejectReason,
    }: {
      ownerId: string;
      status: "APPROVED" | "REJECTED";
      rejectReason?: string;
    }) => adminApi.updateOwnerKycStatus(ownerId, { status, rejectReason }),
    onSuccess: (_res, variables) => {
      toast.success(
        variables.status === "APPROVED"
          ? "Owner KYC approved successfully"
          : "Owner KYC rejected",
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.kycPending() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.owners() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.overview() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update KYC status");
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "BLOCKED";
    }) => adminApi.updateUserStatus(userId, { status }),
    onSuccess: (_res, variables) => {
      toast.success(
        variables.status === "BLOCKED"
          ? "User account blocked"
          : "User account unblocked",
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user status");
    },
  });
}

export function useAdminAuditLogs(page: number = 1, options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.auditLogs(page),
    queryFn: () => adminApi.getAuditLogs({ page, limit: 20 }),
    enabled: options?.enabled !== false && isAdmin,
  });
}

export function useAdminLeases(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.leases(),
    queryFn: () => leaseApi.getAllLeases(),
    enabled: options?.enabled !== false && isAdmin,
  });
}

export function useAdminPayments(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.payments(),
    queryFn: () => paymentApi.getAllPayments(),
    enabled: options?.enabled !== false && isAdmin,
  });
}

export function useAdminMaintenance(options?: { enabled?: boolean }) {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return useQuery({
    queryKey: ADMIN_KEYS.maintenance(),
    queryFn: () => maintenanceApi.getAllRequests(),
    enabled: options?.enabled !== false && isAdmin,
  });
}
