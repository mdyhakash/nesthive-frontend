import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface InitiatePaymentPayload {
  amount: number;
  paymentMethod?: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CARD";
  roomId?: string;
  leaseId?: string;
  utilitySplitId?: string;
}

export interface ConfirmPaymentPayload {
  paymentId: string;
  transactionId: string;
  paymentMethod: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CARD";
}

export interface PaymentItem {
  id: string;
  tenantId: string;
  type: "DEPOSIT" | "RENT" | "UTILITY";
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CARD";
  transactionId?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export const paymentApi = {
  initiateDeposit: async (data: InitiatePaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/initiate-deposit", data);
    return res;
  },

  confirmDeposit: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/confirm-deposit", data);
    return res;
  },

  initiateRent: async (data: InitiatePaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/initiate-rent", data);
    return res;
  },

  confirmRent: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/confirm-rent", data);
    return res;
  },

  initiateUtility: async (data: InitiatePaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/initiate-utility", data);
    return res;
  },

  confirmUtility: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<unknown, ApiResponse<PaymentItem>>("/payment/confirm-utility", data);
    return res;
  },

  executeBkash: async (data: { paymentId: string; amount: number; callbackUrl?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<unknown, ApiResponse<any>>("/payment/bkash/execute", data);
    return res;
  },

  getMyPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<PaymentItem[]>>("/payment/my-payments");
    return res;
  },

  getOwnerPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<PaymentItem[]>>("/payment/owner-payments");
    return res;
  },

  getAllPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<unknown, ApiResponse<PaymentItem[]>>("/payment");
    return res;
  },
};
