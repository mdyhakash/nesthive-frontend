"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, type LoginPayload, type RegisterPayload, type VerifyEmailPayload, type ForgotPasswordPayload, type ResetPasswordPayload } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { getDefaultDashboard } from "@/routes";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const res = await authApi.login(credentials);
      const token = res.data.accessToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("nesthive.token", token);
      }
      // Fetch fresh profile
      const meRes = await authApi.getMe();
      return { token, user: meRes.data };
    },
    onSuccess: ({ token, user }) => {
      setAuth(user, token);
      queryClient.setQueryData(["auth", "me"], user);
      toast.success(`Welcome back, ${user.name}!`);
      const target = getDefaultDashboard(user.role);
      router.push(target);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      return await authApi.register(payload);
    },
    onSuccess: (_, variables) => {
      toast.success("Verification OTP sent!", {
        description: "Please check your email for the 6-digit code.",
      });
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useVerifyEmailMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: VerifyEmailPayload) => {
      const res = await authApi.verifyEmail(payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.user && data?.accessToken) {
        setAuth(data.user, data.accessToken);
        toast.success("Email verified successfully!");
        router.push(getDefaultDashboard(data.user.role));
      } else {
        toast.success("Email verified! Please log in.");
        router.push("/login");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid or expired OTP");
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // ignore network error on logout
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      toast.info("You have been signed out");
      router.push("/login");
    },
  });
}

export function useForgotPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      return await authApi.forgotPassword(payload);
    },
    onSuccess: (_, variables) => {
      toast.success("Reset code sent", {
        description: `Check your inbox at ${variables.email}`,
      });
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset code");
    },
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      return await authApi.resetPassword(payload);
    },
    onSuccess: () => {
      toast.success("Password updated!", {
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
}
