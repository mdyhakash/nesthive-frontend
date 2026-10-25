"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useUserProfileQuery() {
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await authApi.getMe();
      if (res.data) {
        updateUser(res.data);
      }
      return res.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
