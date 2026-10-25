import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi, type InitiatePaymentPayload, type ConfirmPaymentPayload } from "@/api/payment.api";
import { toast } from "sonner";

export const PAYMENT_KEYS = {
  all: ["payments"] as const,
  my: () => [...PAYMENT_KEYS.all, "my"] as const,
  owner: () => [...PAYMENT_KEYS.all, "owner"] as const,
};

export function useMyPayments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PAYMENT_KEYS.my(),
    queryFn: () => paymentApi.getMyPayments(),
    enabled: options?.enabled !== false,
  });
}

export function useOwnerPayments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PAYMENT_KEYS.owner(),
    queryFn: () => paymentApi.getOwnerPayments(),
    enabled: options?.enabled !== false,
  });
}

export function useBkashCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { paymentId: string; amount: number; callbackUrl?: string }) =>
      paymentApi.executeBkash(data),
    onSuccess: () => {
      toast.success("Payment completed successfully via bKash");
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "bKash checkout failed");
    },
  });
}

export function useConfirmRentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmPaymentPayload) => paymentApi.confirmRent(data),
    onSuccess: () => {
      toast.success("Rent payment confirmed");
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to confirm rent payment");
    },
  });
}
