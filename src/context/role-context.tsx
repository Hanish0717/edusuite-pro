import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { roleProfiles, type LoginRole } from "@/config/roles";

const STORAGE_KEY = "edusuite.demo-role";

interface RoleContextValue {
  role: LoginRole;
  setRole: (role: LoginRole) => void;
  profile: (typeof roleProfiles)[LoginRole];
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<LoginRole>("super-admin");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LoginRole | null;
    if (stored && stored in roleProfiles) setRoleState(stored);
  }, []);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      profile: roleProfiles[role],
      setRole: (next) => {
        setRoleState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
