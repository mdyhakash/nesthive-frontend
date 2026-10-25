import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface CreateRoomPayload {
  roomNumber: string;
  roomType: "SINGLE" | "SHARED" | "MASTER";
  rentAmount: number;
  capacity: number;
  availableFrom?: string;
  images?: string[];
  depositAmount?: number;
  billsIncluded?: boolean;
}

export interface RoomItem {
  id: string;
  roomNumber: string;
  roomType: "SINGLE" | "SHARED" | "MASTER";
  rentAmount: number;
  capacity: number;
  isAvailable: boolean;
  availableFrom?: string;
  propertyId: string;
  images?: string[];
  property?: {
    id: string;
    title: string;
    address: string;
    city: string;
    area: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilterParams {
  searchTerm?: string;
  roomType?: "SINGLE" | "SHARED" | "MASTER";
  minRent?: number;
  maxRent?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const roomApi = {
  getAllRooms: async (params?: RoomFilterParams): Promise<ApiResponse<RoomItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<RoomItem[]>>("/room", { params });
    return res;
  },

  getRoomsByProperty: async (propertyId: string): Promise<ApiResponse<RoomItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<RoomItem[]>>(`/room/property/${propertyId}`);
    return res;
  },

  getMyRooms: async (propertyId: string): Promise<ApiResponse<RoomItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<RoomItem[]>>(`/room/${propertyId}/my-rooms`);
    return res;
  },

  getRoomById: async (id: string): Promise<ApiResponse<RoomItem>> => {
    const res = await apiClient.get<unknown, ApiResponse<RoomItem>>(`/room/${id}`);
    return res;
  },

  createRoom: async (propertyId: string, data: CreateRoomPayload): Promise<ApiResponse<RoomItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<RoomItem>>(`/room/create-room/${propertyId}`, data);
    return res;
  },

  updateRoom: async (id: string, data: Partial<CreateRoomPayload>): Promise<ApiResponse<RoomItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<RoomItem>>(`/room/${id}`, data);
    return res;
  },

  publishRoom: async (id: string): Promise<ApiResponse<RoomItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<RoomItem>>(`/room/${id}/publish`);
    return res;
  },

  deleteRoom: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const res = await apiClient.delete<unknown, ApiResponse<{ id: string }>>(`/room/${id}`);
    return res;
  },
};
