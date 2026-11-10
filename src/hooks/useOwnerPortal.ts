import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import { viewingApi } from "@/api/viewing.api";
import { leaseApi, type LeaseItem } from "@/api/lease.api";
import { useAuthStore } from "@/store/auth.store";
import { useMyProperties, useCreatePropertyMutation, useUpdatePropertyMutation, usePublishPropertyMutation, useDeletePropertyMutation } from "./useProperties";
import { extractData } from "@/lib/api-helper";
import type { PropertyItem } from "@/api/property.api";
import { toast } from "sonner";

export const OWNER_PORTAL_KEYS = {
  all: ["owner-portal"] as const,
  leases: () => [...OWNER_PORTAL_KEYS.all, "leases"] as const,
  applications: (roomId?: string) => [...OWNER_PORTAL_KEYS.all, "applications", roomId] as const,
  viewings: (roomId?: string) => [...OWNER_PORTAL_KEYS.all, "viewings", roomId] as const,
};

export function useOwnerPortal() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const isOwner = isAuthenticated && (user?.role === "OWNER" || !user?.role);

  // Live queries
  const propertiesQuery = useMyProperties(undefined, { enabled: isOwner });
  const leasesQuery = useQuery({
    queryKey: OWNER_PORTAL_KEYS.leases(),
    queryFn: () => leaseApi.getMyLeasesAsOwner(),
    enabled: isOwner,
    retry: 1,
  });

  // Property mutations
  const createProperty = useCreatePropertyMutation();
  const updateProperty = useUpdatePropertyMutation();
  const publishProperty = usePublishPropertyMutation();
  const deleteProperty = useDeletePropertyMutation();

  // Application status mutation
  const updateAppStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      applicationApi.updateApplicationStatus(id, status),
    onSuccess: () => {
      toast.success("Application status updated");
      queryClient.invalidateQueries({ queryKey: OWNER_PORTAL_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update application status");
    },
  });

  // Viewing status mutation
  const updateViewingStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "CONFIRMED" | "DECLINED" | "COMPLETED" }) =>
      viewingApi.updateViewingRequestStatus(id, status),
    onSuccess: () => {
      toast.success("Viewing status updated");
      queryClient.invalidateQueries({ queryKey: OWNER_PORTAL_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update viewing status");
    },
  });

  // Live data mappings
  const rawProps = extractData<PropertyItem[]>(propertiesQuery.data);
  const liveProperties = Array.isArray(rawProps) ? rawProps : [];

  const properties = liveProperties.map((p) => ({
    id: p.id,
    ownerId: p.ownerId,
    managerId: p.managerId || undefined,
    title: p.title,
    description: p.description || "",
    type: "Apartment" as const,
    city: p.city,
    area: p.area,
    address: p.address,
    rent: p.rooms?.[0]?.rentAmount ? Number(p.rooms[0].rentAmount) : 0,
    status: (p.isPublished || (p as any).status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as any,
    isAvailable: true,
    isDeleted: false,
    images: p.images || [],
    amenities: p.amenities || [],
    bedrooms: p.rooms?.length || 1,
    bathrooms: 1,
    sizeSqft: 650,
    rating: 5.0,
    reviewCount: 0,
    verified: true,
    createdAt: p.createdAt,
  }));

  const rawLeases = extractData<LeaseItem[]>(leasesQuery.data);
  const liveLeases = Array.isArray(rawLeases) ? rawLeases : [];
  const leases = liveLeases;

  return {
    id: user?.id || "",
    user,
    owner: {
      id: user?.id || "",
      userId: user?.id || "",
      name: user?.name || "Owner",
      email: user?.email || "",
      phone: user?.phone || "",
      kycStatus: "APPROVED" as const,
      documents: [],
      propertyCount: properties.length,
    },
    properties,
    allProperties: properties,
    rooms: [],
    viewings: [],
    applications: [],
    leases,
    payments: [],
    bills: [],
    tickets: [],
    managers: [],
    notifications: [],
    isLoading: propertiesQuery.isLoading || leasesQuery.isLoading,

    // Mutation triggers
    createPropertyMutation: createProperty,
    updatePropertyMutation: updateProperty,
    publishPropertyMutation: publishProperty,
    deletePropertyMutation: deleteProperty,
    updateApplicationStatus: updateAppStatusMutation.mutate,
    isUpdatingApplicationStatus: updateAppStatusMutation.isPending,
    updateViewingStatus: updateViewingStatusMutation.mutate,
    isUpdatingViewingStatus: updateViewingStatusMutation.isPending,
  };
}
