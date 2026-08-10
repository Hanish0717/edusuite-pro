import { MODULE_PERMISSIONS } from "../constants";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "super-admin": Object.values(MODULE_PERMISSIONS),
  "super_admin": Object.values(MODULE_PERMISSIONS),
  "admin": Object.values(MODULE_PERMISSIONS),
  "staff": [
    MODULE_PERMISSIONS.VIEW_MODULE,
    MODULE_PERMISSIONS.UPDATE_MODULE,
  ],
};

export function useModulePermissions() {
  const getActiveRole = (): string => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("EDUSUITE_USER_ROLE");
      if (stored) return stored;
    }
    return "super-admin";
  };

  const activeRole = getActiveRole();
  const permissions = ROLE_PERMISSIONS[activeRole] || [];

  return {
    can(permission: keyof typeof MODULE_PERMISSIONS): boolean {
      return permissions.includes(MODULE_PERMISSIONS[permission]);
    },
    activeRole,
    permissions,
  };
}
