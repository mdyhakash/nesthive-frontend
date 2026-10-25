import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceApi, type CreateMaintenancePayload } from "@/api/maintenance.api";
import { toast } from "sonner";

export const MAINTENANCE_KEYS = {
  all: ["maintenance"] as const,
  my: () => [...MAINTENANCE_KEYS.all, "my"] as const,
  owner: () => [...MAINTENANCE_KEYS.all, "owner"] as const,
  detail: (id: string) => [...MAINTENANCE_KEYS.all, "detail", id] as const,
};

export function useMyMaintenance(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: MAINTENANCE_KEYS.my(),
    queryFn: () => maintenanceApi.getMyRequests(),
    enabled: options?.enabled !== false,
  });
}

export function useOwnerMaintenance(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: MAINTENANCE_KEYS.owner(),
    queryFn: () => maintenanceApi.getOwnerRequests(),
    enabled: options?.enabled !== false,
  });
}

export function useCreateMaintenanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaintenancePayload) => maintenanceApi.createRequest(data),
    onSuccess: () => {
      toast.success("Maintenance ticket submitted successfully");
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit maintenance request");
    },
  });
}

export function useUpdateMaintenanceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED" }) =>
      maintenanceApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Maintenance status updated");
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });
}
