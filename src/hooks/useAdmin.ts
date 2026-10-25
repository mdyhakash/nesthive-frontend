import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export const ADMIN_KEYS = {
  all: ["admin"] as const,
  overview: () => [...ADMIN_KEYS.all, "overview"] as const,
  kycPending: () => [...ADMIN_KEYS.all, "kyc-pending"] as const,
  auditLogs: (page?: number) => [...ADMIN_KEYS.all, "audit-logs", page] as const,
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
