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

export interface OwnerItem {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  nidNumber?: string | null;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  kycDocumentUrl?: string | null;
  additionalFiles?: { url: string; publicId?: string }[] | null;
  userId: string;
  user?: {
    status: "ACTIVE" | "BLOCKED";
    emailVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TenantItem {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  gender?: string | null;
  nidNumber?: string | null;
  userId: string;
  user?: {
    status: "ACTIVE" | "BLOCKED";
    emailVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PendingKycOwner {
  id: string;
  userId: string;
  businessName?: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  user?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    status: "ACTIVE" | "BLOCKED";
  };
  documents?: {
    id: string;
    type: "NID_FRONT" | "NID_BACK" | "OWNERSHIP_PROOF";
    url: string;
    createdAt: string;
  }[];
  kycDocumentUrl?: string;
  additionalFiles?: { url: string; publicId?: string }[];
  name?: string;
  email?: string;
  contactNumber?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType?: string;
  entity?: string;
  entityId: string;
  details?: any;
  meta?: any;
  createdAt: string;
  actorId?: string;
  actor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface PaginatedAuditLogs {
  data: AuditLogItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminApi = {
  getPlatformOverview: async (): Promise<ApiResponse<PlatformOverview>> => {
    const res = await apiClient.get<unknown, ApiResponse<PlatformOverview>>("/admin/overview");
    return res;
  },

  getPendingKycOwners: async (): Promise<ApiResponse<PendingKycOwner[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<PendingKycOwner[]>>("/admin/kyc/pending");
    return res;
  },

  getOwners: async (): Promise<ApiResponse<OwnerItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<OwnerItem[]>>("/owner");
    return res;
  },

  getTenants: async (params?: { page?: number; limit?: number; searchTerm?: string }): Promise<ApiResponse<TenantItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<TenantItem[]>>("/tenant", { params });
    return res;
  },

  updateOwnerKycStatus: async (
    ownerId: string,
    data: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.patch<unknown, ApiResponse<any>>(`/admin/kyc/${ownerId}`, data);
    return res;
  },

  updateUserStatus: async (
    userId: string,
    data: { status: "ACTIVE" | "BLOCKED" },
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.patch<unknown, ApiResponse<any>>(`/admin/user/${userId}/status`, data);
    return res;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedAuditLogs | AuditLogItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<PaginatedAuditLogs | AuditLogItem[]>>("/admin/audit-logs", { params });
    return res;
  },
};
