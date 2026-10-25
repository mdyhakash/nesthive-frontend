import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<unknown, ApiResponse<LoginResponseData>>("/auth/login", payload);
    return res;
  },

  register: async (payload: RegisterPayload) => {
    const res = await apiClient.post<unknown, ApiResponse<null>>("/auth/register", payload);
    return res;
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    const res = await apiClient.post<unknown, ApiResponse<{ accessToken: string; user: User }>>(
      "/auth/verify-email",
      payload,
    );
    return res;
  },

  getMe: async () => {
    const res = await apiClient.get<unknown, ApiResponse<User>>("/auth/me");
    return res;
  },

  logout: async () => {
    const res = await apiClient.post<unknown, ApiResponse<null>>("/auth/logout");
    return res;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await apiClient.post<unknown, ApiResponse<null>>("/auth/forgot-password", payload);
    return res;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await apiClient.post<unknown, ApiResponse<null>>("/auth/reset-password", payload);
    return res;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await apiClient.patch<unknown, ApiResponse<null>>("/auth/change-password", payload);
    return res;
  },
};
