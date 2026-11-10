"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth.store";
import { ROLE_STORAGE_KEY, ROLES } from "@/lib/roles";
import type { Role, User } from "@/types";

interface AuthContextValue {
  role: Role | null;
  user: User | null;
  /** False until localStorage has been read on the client. */
  ready: boolean;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readStoredRole(): Role | null {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY) || localStorage.getItem("nesthive.role");
    return stored && (ROLES as readonly string[]).includes(stored) ? (stored as Role) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore();
  const [role, setRole] = React.useState<Role | null>(() => store.role || readStoredRole());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const r = store.role || readStoredRole();
    setRole(r);
    setReady(true);
  }, [store.role]);

  const persist = React.useCallback((next: Role | null) => {
    setRole(next);
    try {
      if (next) {
        localStorage.setItem(ROLE_STORAGE_KEY, next);
        localStorage.setItem("nesthive.role", next);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
        localStorage.removeItem("nesthive.role");
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const logout = React.useCallback(() => {
    persist(null);
    store.clearAuth();
  }, [persist, store]);

  const currentUser = store.user;
  const currentRole = store.role || role || (currentUser ? currentUser.role : null);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      role: currentRole,
      user: currentUser,
      ready,
      login: (r) => persist(r),
      logout,
      switchRole: (r) => persist(r),
    }),
    [currentRole, currentUser, ready, persist, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
