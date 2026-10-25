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
    const res = await apiClient.post<unknown, ApiResponse<MaintenanceItem>>("/maintenance", data);
    return res;
  },

  getMyRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<MaintenanceItem[]>>("/maintenance/my-requests");
    return res;
  },

  getOwnerRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<MaintenanceItem[]>>("/maintenance/owner-requests");
    return res;
  },

  getAllRequests: async (): Promise<ApiResponse<MaintenanceItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<MaintenanceItem[]>>("/maintenance");
    return res;
  },

  getById: async (id: string): Promise<ApiResponse<MaintenanceItem>> => {
    const res = await apiClient.get<unknown, ApiResponse<MaintenanceItem>>(`/maintenance/${id}`);
    return res;
  },

  updateStatus: async (
    id: string,
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED",
  ): Promise<ApiResponse<MaintenanceItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<MaintenanceItem>>(`/maintenance/${id}/status`, { status });
    return res;
  },
};
