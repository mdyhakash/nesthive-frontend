import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface CreateUtilityBillPayload {
  roomId: string;
  type: "ELECTRICITY" | "GAS" | "WATER" | "INTERNET" | "SERVICE_CHARGE";
  billingMonth: string; // "2026-10"
  totalAmount: number;
  dueDate: string;
  splits: {
    tenantId: string;
    amount: number;
  }[];
}

export interface UtilityBillItem {
  id: string;
  roomId: string;
  type: "ELECTRICITY" | "GAS" | "WATER" | "INTERNET" | "SERVICE_CHARGE";
  billingMonth: string;
  totalAmount: number;
  dueDate: string;
  isSettled: boolean;
  splits?: {
    id: string;
    tenantId: string;
    amount: number;
    isPaid: boolean;
    tenant?: {
      id: string;
      name: string;
    };
  }[];
  createdAt: string;
}

export const utilityApi = {
  createUtilityBill: async (data: CreateUtilityBillPayload): Promise<ApiResponse<UtilityBillItem>> => {
    const res = await apiClient.post<ApiResponse<UtilityBillItem>>("/utility-bill", data);
    return res.data;
  },

  getMyTenantSplits: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>("/utility-bill/my-splits");
    return res.data;
  },

  getRoomUtilityBills: async (roomId: string): Promise<ApiResponse<UtilityBillItem[]>> => {
    const res = await apiClient.get<ApiResponse<UtilityBillItem[]>>(`/utility-bill/room/${roomId}`);
    return res.data;
  },

  getUtilityBillById: async (id: string): Promise<ApiResponse<UtilityBillItem>> => {
    const res = await apiClient.get<ApiResponse<UtilityBillItem>>(`/utility-bill/${id}`);
    return res.data;
  },
};
