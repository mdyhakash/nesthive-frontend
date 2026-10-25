import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomApi, type RoomFilterParams, type CreateRoomPayload } from "@/api/room.api";
import { toast } from "sonner";

export const ROOM_KEYS = {
  all: ["rooms"] as const,
  lists: () => [...ROOM_KEYS.all, "list"] as const,
  list: (params?: RoomFilterParams) => [...ROOM_KEYS.lists(), params] as const,
  byProperty: (propertyId: string) => [...ROOM_KEYS.all, "property", propertyId] as const,
  details: () => [...ROOM_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ROOM_KEYS.details(), id] as const,
  my: (propertyId: string) => [...ROOM_KEYS.all, "my", propertyId] as const,
};

export function useRooms(params?: RoomFilterParams) {
  return useQuery({
    queryKey: ROOM_KEYS.list(params),
    queryFn: () => roomApi.getAllRooms(params),
    staleTime: 60 * 1000,
  });
}

export function useRoomsByProperty(propertyId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ROOM_KEYS.byProperty(propertyId),
    queryFn: () => roomApi.getRoomsByProperty(propertyId),
    enabled: options?.enabled !== false && !!propertyId,
  });
}

export function useRoomDetails(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ROOM_KEYS.detail(id),
    queryFn: () => roomApi.getRoomById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useMyRooms(propertyId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ROOM_KEYS.my(propertyId),
    queryFn: () => roomApi.getMyRooms(propertyId),
    enabled: options?.enabled !== false && !!propertyId,
  });
}

export function useCreateRoomMutation(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomPayload) => roomApi.createRoom(propertyId, data),
    onSuccess: () => {
      toast.success("Room created successfully");
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.byProperty(propertyId) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to create room";
      toast.error(msg);
    },
  });
}

export function useUpdateRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoomPayload> }) =>
      roomApi.updateRoom(id, data),
    onSuccess: (_res, variables) => {
      toast.success("Room updated successfully");
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update room";
      toast.error(msg);
    },
  });
}

export function usePublishRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.publishRoom(id),
    onSuccess: (_res, id) => {
      toast.success("Room publication status updated");
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update room status";
      toast.error(msg);
    },
  });
}

export function useDeleteRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.deleteRoom(id),
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.all });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete room";
      toast.error(msg);
    },
  });
}
