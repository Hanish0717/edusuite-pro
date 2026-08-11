import React, { createContext, useContext, useMemo } from "react";
import { useRole } from "@/context/role-context";
import { PermissionUtils } from "./PermissionUtils";
import type { PermissionCode } from "../config/permissions.config";
import type { LoginRole } from "@/config/roles";

interface PermissionContextType {
  role: LoginRole;
  checkPermission: (permission: PermissionCode) => boolean;
  checkAnyPermission: (permissions: PermissionCode[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { role } = useRole();

  const value = useMemo<PermissionContextType>(() => {
    // Cast context role string literal to LoginRole safely
    const currentRole = role as LoginRole;
    return {
      role: currentRole,
      checkPermission: (perm) => PermissionUtils.hasPermission(currentRole, perm),
      checkAnyPermission: (perms) => PermissionUtils.hasAnyPermission(currentRole, perms),
    };
  }, [role]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}
