import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaseApi, type LeaseItem } from "@/api/lease.api";
import { viewingApi, type ViewingRequestItem } from "@/api/viewing.api";
import { applicationApi, type ApplicationItem } from "@/api/application.api";
import { useAuthStore } from "@/store/auth.store";
import { extractData } from "@/lib/api-helper";
import { toast } from "sonner";

export const TENANT_PORTAL_KEYS = {
  all: ["tenant-portal"] as const,
  leases: () => [...TENANT_PORTAL_KEYS.all, "leases"] as const,
  viewings: () => [...TENANT_PORTAL_KEYS.all, "viewings"] as const,
  applications: () => [...TENANT_PORTAL_KEYS.all, "applications"] as const,
};

export function useTenantPortal() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const isTenant = isAuthenticated && (user?.role === "TENANT" || !user?.role);

  // Queries
  const leasesQuery = useQuery({
    queryKey: TENANT_PORTAL_KEYS.leases(),
    queryFn: () => leaseApi.getMyLeasesAsTenant(),
    enabled: isTenant,
    retry: 1,
  });

  const viewingsQuery = useQuery({
    queryKey: TENANT_PORTAL_KEYS.viewings(),
    queryFn: () => viewingApi.getMyViewingRequests(),
    enabled: isTenant,
    retry: 1,
  });

  const applicationsQuery = useQuery({
    queryKey: TENANT_PORTAL_KEYS.applications(),
    queryFn: () => applicationApi.getMyApplications(),
    enabled: isTenant,
    retry: 1,
  });

  // Cancel Viewing Request Mutation
  const cancelViewingMutation = useMutation({
    mutationFn: (id: string) => viewingApi.cancelViewingRequest(id),
    onSuccess: () => {
      toast.success("Viewing request cancelled");
      queryClient.invalidateQueries({ queryKey: TENANT_PORTAL_KEYS.viewings() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to cancel viewing request");
    },
  });

  // Withdraw Application Mutation
  const withdrawApplicationMutation = useMutation({
    mutationFn: (id: string) => applicationApi.withdrawApplication(id),
    onSuccess: () => {
      toast.success("Application withdrawn");
      queryClient.invalidateQueries({ queryKey: TENANT_PORTAL_KEYS.applications() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to withdraw application");
    },
  });

  // Terminate Lease Mutation
  const terminateLeaseMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => leaseApi.terminateLease(id, reason),
    onSuccess: () => {
      toast.success("Lease termination notice submitted");
      queryClient.invalidateQueries({ queryKey: TENANT_PORTAL_KEYS.leases() });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to terminate lease");
    },
  });

  // Live active and past leases
  const rawLeases = extractData<LeaseItem[]>(leasesQuery.data);
  const liveLeases = Array.isArray(rawLeases) ? rawLeases : [];
  const activeLease = liveLeases.find((l) => l.status === "ACTIVE") || null;
  const pastLeases = liveLeases.filter((l) => l.status === "TERMINATED");

  // Live viewing requests with normalized UI fields
  const rawViewings = extractData<ViewingRequestItem[]>(viewingsQuery.data);
  const liveViewings = Array.isArray(rawViewings) ? rawViewings : [];
  const viewings = liveViewings.map((v) => ({
    id: v.id,
    roomId: v.roomId,
    propertyId: v.room?.property?.id || "",
    tenantId: v.tenantId,
    tenantName: v.tenant?.name || user?.name || "Tenant",
    date: v.preferredDate,
    timeSlot: v.preferredSlot,
    status: v.status as any,
    message: v.message || "",
    createdAt: v.createdAt,
  }));

  // Live applications with normalized UI fields
  const rawApps = extractData<ApplicationItem[]>(applicationsQuery.data);
  const liveApplications = Array.isArray(rawApps) ? rawApps : [];
  const applications = liveApplications.map((a) => ({
    id: a.id,
    roomId: a.roomId,
    propertyId: a.room?.property?.id || "",
    tenantId: a.tenantId,
    tenantName: a.tenant?.name || user?.name || "Tenant",
    status: a.status as any,
    moveInDate: a.proposedStartDate,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  return {
    id: user?.id || "",
    user,
    lease: activeLease as any,
    activeLease,
    pastLeases,
    viewings,
    applications,
    payments: [],
    dues: [],
    tickets: [],
    splits: [],
    unpaidSplits: [],
    notifications: [],
    isLoading: leasesQuery.isLoading || viewingsQuery.isLoading || applicationsQuery.isLoading,
    cancelViewing: cancelViewingMutation.mutate,
    isCancellingViewing: cancelViewingMutation.isPending,
    withdrawApplication: withdrawApplicationMutation.mutate,
    isWithdrawingApplication: withdrawApplicationMutation.isPending,
    terminateLease: terminateLeaseMutation.mutate,
    isTerminatingLease: terminateLeaseMutation.isPending,
  };
}

