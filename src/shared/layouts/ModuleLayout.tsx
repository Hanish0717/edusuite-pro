import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PageHeader } from "@/shared/components";
import { navigationConfig } from "../config/navigation.config";
import { PermissionUtils } from "../permission-engine/PermissionUtils";
import type { LoginRole } from "@/config/roles";
import type { PermissionCode } from "../config/permissions.config";

interface ModuleLayoutProps {
  moduleId: string;
  defaultTitle: string;
  defaultDescription: string;
  headerIcon: any;
  routeTitles: Record<string, { title: string; description: string }>;
  children: React.ReactNode;
}

export function ModuleLayout({
  moduleId,
  defaultTitle,
  defaultDescription,
  headerIcon,
  routeTitles,
  children,
}: ModuleLayoutProps) {
  const { role } = useRole();
  const location = useLocation();

  // 1. Resolve active sub-path header metadata
  const currentPath = location.pathname;
  let activeTitle = defaultTitle;
  let activeDescription = defaultDescription;

  // Search matching sub-path
  for (const [subPath, meta] of Object.entries(routeTitles)) {
    if (currentPath.includes(subPath)) {
      activeTitle = meta.title;
      activeDescription = meta.description;
      break;
    }
  }

  // 2. Fetch and filter navigation items by permission/role
  const navItems = navigationConfig[moduleId] || [];
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permissions) return true;
    return PermissionUtils.hasAnyPermission(role as LoginRole, item.permissions as PermissionCode[]);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={activeTitle}
          description={activeDescription}
          icon={headerIcon}
          scope={role.toUpperCase()}
        />

        {/* Main content viewport */}
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </DashboardLayout>
  );
}

export default ModuleLayout;
