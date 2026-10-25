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
    const res = await apiClient.post<unknown, ApiResponse<ApplicationItem>>("/application", data);
    return res;
  },

  getMyApplications: async (): Promise<ApiResponse<ApplicationItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<ApplicationItem[]>>("/application/my-applications");
    return res;
  },

  getApplicationsForRoom: async (roomId: string): Promise<ApiResponse<ApplicationItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<ApplicationItem[]>>(`/application/room/${roomId}`);
    return res;
  },

  getApplicationById: async (id: string): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.get<unknown, ApiResponse<ApplicationItem>>(`/application/${id}`);
    return res;
  },

  updateApplicationStatus: async (id: string, status: "APPROVED" | "REJECTED"): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<ApplicationItem>>(`/application/${id}/status`, { status });
    return res;
  },

  withdrawApplication: async (id: string): Promise<ApiResponse<ApplicationItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<ApplicationItem>>(`/application/${id}/withdraw`);
    return res;
  },
};
