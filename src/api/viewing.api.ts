import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface CreateViewingRequestPayload {
  preferredDate: string;
  preferredSlot: string; // e.g. "MORNING_10_12" | "AFTERNOON_2_4" | "EVENING_4_6"
  message?: string;
}

export interface ViewingRequestItem {
  id: string;
  roomId: string;
  tenantId: string;
  preferredDate: string;
  preferredSlot: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  message?: string;
  room?: {
    id: string;
    roomNumber: string;
    rentAmount: number;
    property?: {
      id: string;
      title: string;
      address: string;
      area: string;
    };
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const viewingApi = {
  createViewingRequest: async (roomId: string, data: CreateViewingRequestPayload): Promise<ApiResponse<ViewingRequestItem>> => {
    const res = await apiClient.post<ApiResponse<ViewingRequestItem>>(`/viewing-request/room/${roomId}`, data);
    return res.data;
  },

  getMyViewingRequests: async (): Promise<ApiResponse<ViewingRequestItem[]>> => {
    const res = await apiClient.get<ApiResponse<ViewingRequestItem[]>>("/viewing-request/my-requests");
    return res.data;
  },

  getViewingRequestsForRoom: async (roomId: string): Promise<ApiResponse<ViewingRequestItem[]>> => {
    const res = await apiClient.get<ApiResponse<ViewingRequestItem[]>>(`/viewing-request/room/${roomId}`);
    return res.data;
  },

  getViewingRequestById: async (id: string): Promise<ApiResponse<ViewingRequestItem>> => {
    const res = await apiClient.get<ApiResponse<ViewingRequestItem>>(`/viewing-request/${id}`);
    return res.data;
  },

  updateViewingRequestStatus: async (id: string, status: "CONFIRMED" | "DECLINED" | "COMPLETED"): Promise<ApiResponse<ViewingRequestItem>> => {
    const res = await apiClient.patch<ApiResponse<ViewingRequestItem>>(`/viewing-request/${id}/status`, { status });
    return res.data;
  },

  cancelViewingRequest: async (id: string): Promise<ApiResponse<ViewingRequestItem>> => {
    const res = await apiClient.patch<ApiResponse<ViewingRequestItem>>(`/viewing-request/${id}/cancel`);
    return res.data;
  },
};
