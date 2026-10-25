import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types";

export const userApi = {
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const res = await apiClient.patch<unknown, ApiResponse<{ profileImage: string }>>(
      "/user/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res;
  },

  getTenantProfile: async () => {
    const res = await apiClient.get<unknown, ApiResponse<User>>("/tenant/me");
    return res;
  },

  updateTenantProfile: async (payload: Partial<User>) => {
    const res = await apiClient.patch<unknown, ApiResponse<User>>("/tenant/me", payload);
    return res;
  },

  getOwnerProfile: async () => {
    const res = await apiClient.get<unknown, ApiResponse<User>>("/owner/me");
    return res;
  },
};
