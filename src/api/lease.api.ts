import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface LeaseItem {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: "ACTIVE" | "TERMINATED" | "EXPIRED";
  terms?: string;
  room?: {
    id: string;
    roomNumber: string;
    property?: {
      id: string;
      title: string;
      address: string;
      area: string;
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

export const leaseApi = {
  getMyLeasesAsTenant: async (): Promise<ApiResponse<LeaseItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<LeaseItem[]>>("/lease/my-leases");
    return res;
  },

  getMyLeasesAsOwner: async (): Promise<ApiResponse<LeaseItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<LeaseItem[]>>("/lease/owner-leases");
    return res;
  },

  getLeaseById: async (id: string): Promise<ApiResponse<LeaseItem>> => {
    const res = await apiClient.get<unknown, ApiResponse<LeaseItem>>(`/lease/${id}`);
    return res;
  },

  terminateLease: async (id: string, reason?: string): Promise<ApiResponse<LeaseItem>> => {
    const res = await apiClient.patch<unknown, ApiResponse<LeaseItem>>(`/lease/${id}/terminate`, { reason });
    return res;
  },

  getAllLeases: async (): Promise<ApiResponse<LeaseItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<LeaseItem[]>>("/lease");
    return res;
  },
};
