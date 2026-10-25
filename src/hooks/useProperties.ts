import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi, type PropertyFilterParams, type CreatePropertyPayload } from "@/api/property.api";
import { toast } from "sonner";

export const PROPERTY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTY_KEYS.all, "list"] as const,
  list: (params?: PropertyFilterParams) => [...PROPERTY_KEYS.lists(), params] as const,
  details: () => [...PROPERTY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTY_KEYS.details(), id] as const,
  my: (params?: PropertyFilterParams) => [...PROPERTY_KEYS.all, "my", params] as const,
  assigned: () => [...PROPERTY_KEYS.all, "assigned"] as const,
};

export function useProperties(params?: PropertyFilterParams) {
  return useQuery({
    queryKey: PROPERTY_KEYS.list(params),
    queryFn: () => propertyApi.getAllProperties(params),
    staleTime: 60 * 1000,
  });
}

export function usePropertyDetails(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROPERTY_KEYS.detail(id),
    queryFn: () => propertyApi.getPropertyById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useMyProperties(params?: PropertyFilterParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROPERTY_KEYS.my(params),
    queryFn: () => propertyApi.getMyProperties(params),
    enabled: options?.enabled !== false,
  });
}

export function useAssignedProperties(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROPERTY_KEYS.assigned(),
    queryFn: () => propertyApi.getAssignedPropertiesForManager(),
    enabled: options?.enabled !== false,
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyPayload) => propertyApi.createProperty(data),
    onSuccess: () => {
      toast.success("Property created successfully");
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to create property";
      toast.error(msg);
    },
  });
}

export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePropertyPayload> }) =>
      propertyApi.updateProperty(id, data),
    onSuccess: (_res, variables) => {
      toast.success("Property updated successfully");
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update property";
      toast.error(msg);
    },
  });
}

export function usePublishPropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyApi.publishProperty(id),
    onSuccess: (_res, id) => {
      toast.success("Property published status updated");
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to publish property";
      toast.error(msg);
    },
  });
}

export function useDeletePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyApi.deleteProperty(id),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete property";
      toast.error(msg);
    },
  });
}
