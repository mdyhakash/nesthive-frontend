import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "@/api/property.api";
import { roomApi } from "@/api/room.api";
import { applicationApi } from "@/api/application.api";
import { viewingApi } from "@/api/viewing.api";
import { leaseApi } from "@/api/lease.api";
import { useAuthStore } from "@/store/auth.store";
import { useOwner } from "./use-owner";
import { useMyProperties, useCreatePropertyMutation, useUpdatePropertyMutation, usePublishPropertyMutation, useDeletePropertyMutation } from "./useProperties";
import { toast } from "sonner";

export const OWNER_PORTAL_KEYS = {
  all: ["owner-portal"] as const,
  leases: () => [...OWNER_PORTAL_KEYS.all, "leases"] as const,
  applications: (roomId?: string) => [...OWNER_PORTAL_KEYS.all, "applications", roomId] as const,
  viewings: (roomId?: string) => [...OWNER_PORTAL_KEYS.all, "viewings", roomId] as const,
};

export function useOwnerPortal() {
  const { user, isAuthenticated } = useAuthStore();
  const fallback = useOwner();
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
  const liveProperties = propertiesQuery.data?.data;
  const properties = (liveProperties && liveProperties.length > 0)
    ? liveProperties.map((p) => ({
        id: p.id,
        ownerId: p.ownerId,
        managerId: p.managerId || undefined,
        title: p.title,
        description: p.description || "",
        type: "Apartment" as const,
        city: p.city,
        area: p.area,
        address: p.address,
        rent: p.rooms?.[0]?.rentAmount || 15000,
        status: (p.isPublished ? "PUBLISHED" : "DRAFT") as any,
        isAvailable: true,
        isDeleted: false,
        images: p.images || [],
        amenities: p.amenities || [],
        bedrooms: p.rooms?.length || 2,
        bathrooms: 1,
        sizeSqft: 650,
        rating: 4.8,
        reviewCount: 5,
        verified: true,
        createdAt: p.createdAt,
      }))
    : fallback.properties;

  const liveLeases = leasesQuery.data?.data;
  const leases = (liveLeases && liveLeases.length > 0) ? liveLeases : fallback.leases;

  return {
    id: fallback.id,
    user,
    owner: fallback.owner,
    properties,
    allProperties: properties,
    rooms: fallback.rooms,
    viewings: fallback.viewings,
    applications: fallback.applications,
    leases,
    payments: fallback.payments,
    bills: fallback.bills,
    tickets: fallback.tickets,
    managers: fallback.managers,
    notifications: fallback.notifications,
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
