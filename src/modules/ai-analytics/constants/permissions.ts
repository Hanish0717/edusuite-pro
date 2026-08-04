export const AI_PERMISSIONS = {
  VIEW_DASHBOARD: ["super-admin", "staff", "student", "parent"],
  VIEW_PREDICTIONS: ["super-admin", "staff", "student", "parent"],
  TRIGGER_ALERTS: ["super-admin", "staff"],
  UPDATE_RECOMMENDATIONS: ["super-admin", "staff"],
  VIEW_CHATBOT: ["super-admin", "staff", "student", "parent"],
  EXPORT_REPORTS: ["super-admin", "staff"],
  MANAGE_SETTINGS: ["super-admin"],
} as const;

export type AIPermissionKey = keyof typeof AI_PERMISSIONS;

export function hasAIPermission(role: string, permission: AIPermissionKey): boolean {
  const allowedRoles = AI_PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(role);
}
