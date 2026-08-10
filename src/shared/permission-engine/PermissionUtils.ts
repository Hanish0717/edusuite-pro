import type { LoginRole } from "@/config/roles";
import { rolePermissions } from "../config/permissions.config";
import type { PermissionCode } from "../config/permissions.config";

export class PermissionUtils {
  static hasPermission(role: LoginRole, permission: PermissionCode): boolean {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
  }

  static hasAnyPermission(role: LoginRole, permissions: PermissionCode[]): boolean {
    return permissions.some((perm) => this.hasPermission(role, perm));
  }

  static hasAllPermissions(role: LoginRole, permissions: PermissionCode[]): boolean {
    return permissions.every((perm) => this.hasPermission(role, perm));
  }
}
