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

        <div className="flex flex-col md:flex-row gap-6">
          {/* Dynamic configuration-driven sidebar */}
          <aside className="w-full md:w-64 shrink-0 bg-card rounded-2xl border border-border/50 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1">
            <div className="px-3 pb-3 mb-2 border-b border-border/40">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                Navigation Directory
              </h3>
            </div>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                    activeProps={{
                      className: "bg-primary text-white shadow-[0_3px_12px_rgba(29,78,216,0.15)]",
                    }}
                    inactiveProps={{
                      className: "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    }}
                  >
                    <IconComponent className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content viewport */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ModuleLayout;
