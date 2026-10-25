import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface PlatformOverview {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  pendingKycCount: number;
  totalProperties: number;
  publishedProperties: number;
  totalRooms: number;
  activeLeases: number;
}

export interface PendingKycOwner {
  id: string;
  userId: string;
  businessName?: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    status: "ACTIVE" | "BLOCKED";
  };
  documents: {
    id: string;
    type: "NID_FRONT" | "NID_BACK" | "OWNERSHIP_PROOF";
    url: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details?: any;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const adminApi = {
  getPlatformOverview: async (): Promise<ApiResponse<PlatformOverview>> => {
    const res = await apiClient.get<ApiResponse<PlatformOverview>>("/admin/overview");
    return res.data;
  },

  getPendingKycOwners: async (): Promise<ApiResponse<PendingKycOwner[]>> => {
    const res = await apiClient.get<ApiResponse<PendingKycOwner[]>>("/admin/kyc/pending");
    return res.data;
  },

  updateOwnerKycStatus: async (
    ownerId: string,
    data: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/kyc/${ownerId}`, data);
    return res.data;
  },

  updateUserStatus: async (
    userId: string,
    data: { status: "ACTIVE" | "BLOCKED" },
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/user/${userId}/status`, data);
    return res.data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number }): Promise<ApiResponse<AuditLogItem[]>> => {
    const res = await apiClient.get<ApiResponse<AuditLogItem[]>>("/admin/audit-logs", { params });
    return res.data;
  },
};
