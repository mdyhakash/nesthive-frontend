import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("nesthive.token", token);
          localStorage.setItem("nesthive.role", user.role);
          document.cookie = `nesthive.token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `nesthive.role=${encodeURIComponent(user.role)}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        });
      },
      updateUser: (updatedUser: Partial<User>) =>
        set((state) => {
          const nextRole = updatedUser.role ?? state.role;
          if (typeof window !== "undefined" && nextRole) {
            document.cookie = `nesthive.role=${encodeURIComponent(nextRole)}; path=/; max-age=604800; SameSite=Lax`;
          }
          return {
            user: state.user ? { ...state.user, ...updatedUser } : null,
            role: nextRole,
          };
        }),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("nesthive.token");
          localStorage.removeItem("nesthive.role");
          document.cookie = "nesthive.token=; path=/; max-age=0";
          document.cookie = "nesthive.role=; path=/; max-age=0";
        }
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "nesthive-auth",
    },
  ),
);
