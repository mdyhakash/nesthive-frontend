import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface CreateMaintenancePayload {
  roomId: string;
  category: "PLUMBING" | "ELECTRICAL" | "CARPENTRY" | "CLEANING" | "OTHER";
  title: string;
  description: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  imageUrl?: string;
}

export interface MaintenanceItem {
  id: string;
  roomId: string;
  tenantId: string;
  category: "PLUMBING" | "ELECTRICAL" | "CARPENTRY" | "CLEANING" | "OTHER";
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  imageUrl?: string;
  room?: {
    id: string;
    roomNumber: string;
    property?: {
      id: string;
      title: string;
      address: string;
      ownerId: string;
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

export const maintenanceApi = {
  createRequest: async (data: CreateMaintenancePayload): Promise<ApiResponse<MaintenanceItem>> => {
    const res = await apiClient.post<ApiResponse<MaintenanceItem>>("/maintenance", data);
    return res.data;
  },

  getMyRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<ApiResponse<MaintenanceItem[]>>("/maintenance/my-requests");
    return res.data;
  },

  getOwnerRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<ApiResponse<MaintenanceItem[]>>("/maintenance/owner-requests");
    return res.data;
  },

  getAllRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<ApiResponse<MaintenanceItem[]>>("/maintenance");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<MaintenanceItem>> => {
    const res = await apiClient.get<ApiResponse<MaintenanceItem>>(`/maintenance/${id}`);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED",
  ): Promise<ApiResponse<MaintenanceItem>> => {
    const res = await apiClient.patch<ApiResponse<MaintenanceItem>>(`/maintenance/${id}/status`, { status });
    return res.data;
  },
};
