import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface CreateApplicationPayload {
  roomId: string;
  proposedStartDate: string;
  durationMonths: number;
  monthlyIncome?: number;
  occupation?: string;
  institutionOrCompany?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  message?: string;
}

export interface ApplicationItem {
  id: string;
  roomId: string;
  tenantId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";
  proposedStartDate: string;
  durationMonths: number;
  monthlyIncome?: number;
  occupation?: string;
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

export const applicationApi = {
  createApplication: async (data: CreateApplicationPayload): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.post<ApiResponse<ApplicationItem>>("/application", data);
    return res.data;
  },

  getMyApplications: async (): Promise<ApiResponse<ApplicationItem[]>> => {
    const res = await apiClient.get<ApiResponse<ApplicationItem[]>>("/application/my-applications");
    return res.data;
  },

  getApplicationsForRoom: async (roomId: string): Promise<ApiResponse<ApplicationItem[]>> => {
    const res = await apiClient.get<ApiResponse<ApplicationItem[]>>(`/application/room/${roomId}`);
    return res.data;
  },

  getApplicationById: async (id: string): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.get<ApiResponse<ApplicationItem>>(`/application/${id}`);
    return res.data;
  },

  updateApplicationStatus: async (id: string, status: "APPROVED" | "REJECTED"): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.patch<ApiResponse<ApplicationItem>>(`/application/${id}/status`, { status });
    return res.data;
  },

  withdrawApplication: async (id: string): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.patch<ApiResponse<ApplicationItem>>(`/application/${id}/withdraw`);
    return res.data;
  },
};
