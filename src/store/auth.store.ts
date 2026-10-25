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
        }
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        });
      },
      updateUser: (updatedUser: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
          role: updatedUser.role ?? state.role,
        })),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("nesthive.token");
          localStorage.removeItem("nesthive.role");
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
