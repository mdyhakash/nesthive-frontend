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
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/initiate-deposit", data);
    return res.data;
  },

  confirmDeposit: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/confirm-deposit", data);
    return res.data;
  },

  initiateRent: async (data: InitiatePaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/initiate-rent", data);
    return res.data;
  },

  confirmRent: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/confirm-rent", data);
    return res.data;
  },

  initiateUtility: async (data: InitiatePaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/initiate-utility", data);
    return res.data;
  },

  confirmUtility: async (data: ConfirmPaymentPayload): Promise<ApiResponse<PaymentItem>> => {
    const res = await apiClient.post<ApiResponse<PaymentItem>>("/payment/confirm-utility", data);
    return res.data;
  },

  executeBkash: async (data: { paymentId: string; amount: number; callbackUrl?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>("/payment/bkash/execute", data);
    return res.data;
  },

  getMyPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<ApiResponse<PaymentItem[]>>("/payment/my-payments");
    return res.data;
  },

  getOwnerPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<ApiResponse<PaymentItem[]>>("/payment/owner-payments");
    return res.data;
  },

  getAllPayments: async (): Promise<ApiResponse<PaymentItem[]>> => {
    const res = await apiClient.get<ApiResponse<PaymentItem[]>>("/payment");
    return res.data;
  },
};
