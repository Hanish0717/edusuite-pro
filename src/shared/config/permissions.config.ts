import type { LoginRole } from "@/config/roles";

export type PermissionCode =
  | "VIEW_DASHBOARD"
  | "VIEW_ACADEMICS"
  | "EDIT_ACADEMICS"
  | "VIEW_FINANCE"
  | "EDIT_FINANCE"
  | "VIEW_AI"
  | "TRIGGER_AI_ALERTS"
  | "ADMIN_SETTINGS";

export const rolePermissions: Partial<Record<LoginRole, PermissionCode[]>> = {
  super_admin: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "EDIT_ACADEMICS",
    "VIEW_FINANCE",
    "EDIT_FINANCE",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
    "ADMIN_SETTINGS",
  ],
  admin: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "EDIT_ACADEMICS",
    "VIEW_FINANCE",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
  ],
  staff: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
  ],
  student: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "VIEW_AI",
  ],
  parent: [
    "VIEW_DASHBOARD",
    "VIEW_AI",
  ],
  hod: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "EDIT_ACADEMICS",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
  ],
  academic_dean: [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
  ],
  "super-admin": [
    "VIEW_DASHBOARD",
    "VIEW_ACADEMICS",
    "EDIT_ACADEMICS",
    "VIEW_FINANCE",
    "EDIT_FINANCE",
    "VIEW_AI",
    "TRIGGER_AI_ALERTS",
    "ADMIN_SETTINGS",
  ],
  "external-user": ["VIEW_DASHBOARD"],
};

export default rolePermissions;
