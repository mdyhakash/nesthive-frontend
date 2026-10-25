"use client";

import * as React from "react";
import { demoAccounts } from "@/data/users";
import { ROLE_STORAGE_KEY, ROLES } from "@/lib/roles";
import type { Role, User } from "@/types";

/**
 * Mock auth. There is no real session: the chosen role lives in React state and
 * localStorage so the portal can render the right shell. Nothing is sent anywhere.
 */
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
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    return stored && (ROLES as string[]).includes(stored) ? (stored as Role) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setRole(readStoredRole());
    setReady(true);
  }, []);

  const persist = React.useCallback((next: Role | null) => {
    setRole(next);
    try {
      if (next) localStorage.setItem(ROLE_STORAGE_KEY, next);
      else localStorage.removeItem(ROLE_STORAGE_KEY);
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      role,
      user: role ? demoAccounts[role] : null,
      ready,
      login: (r) => persist(r),
      logout: () => persist(null),
      switchRole: (r) => persist(r),
    }),
    [role, ready, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
