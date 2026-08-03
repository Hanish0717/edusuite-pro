import React from "react";
import { usePermissions } from "./PermissionProvider";
import type { PermissionCode } from "../config/permissions.config";

interface RoleGuardProps {
  permission?: PermissionCode;
  anyPermission?: PermissionCode[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  permission,
  anyPermission,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { checkPermission, checkAnyPermission } = usePermissions();

  if (permission && !checkPermission(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermission && !checkAnyPermission(anyPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RoleGuard;
