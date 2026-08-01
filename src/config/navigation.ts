import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCog,
  CalendarCheck,
  CalendarRange,
  BookOpen,
  FileSpreadsheet,
  Award,
  Library,
  BedDouble,
  Bus,
  Wallet,
  Briefcase,
  BarChart3,
  MessageSquare,
  Settings,
  GitBranch,
  Package,
  ShieldAlert,
  Globe,
  type LucideIcon,
} from "lucide-react";

import type { LoginRole } from "@/config/roles";
import {
  canAccessModule,
  resolveTargetUrlForUser,
  type UserPermissionContext,
} from "@/lib/permissions";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Roles allowed to see this item. Empty = everyone. */
  roles?: LoginRole[];
  requiredFlags?: string[];
  moduleId?: string;
  requiredPermission?: "read" | "create" | "update" | "delete" | "approve";
  badge?: string;
  children?: { title: string; url: string; search?: Record<string, string>; moduleId?: string }[] | undefined;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Approval Workflows", url: "/approval-workflows", icon: GitBranch, badge: "Diagram" },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Admissions", url: "/admission", icon: GraduationCap, moduleId: "admission" },
      {
        title: "Academics",
        url: "/academics",
        icon: GraduationCap,
        moduleId: "academics",
        children: [
          { title: "Departments", url: "/academics", search: { tab: "departments" }, moduleId: "academics" },
          { title: "Courses", url: "/academics", search: { tab: "courses" }, moduleId: "academics" },
          { title: "Curriculum", url: "/academics", search: { tab: "curriculum" }, moduleId: "academics" },
        ],
      },
      { title: "Students", url: "/students", icon: Users, moduleId: "student-info", roles: ["super-admin", "staff"] },
      { title: "Faculty", url: "/faculty", icon: UserCog, moduleId: "hrms" },
      { title: "Attendance", url: "/attendance", icon: CalendarCheck, moduleId: "attendance" },
      { title: "Timetable", url: "/timetable", icon: CalendarRange, moduleId: "academics" },
      { title: "LMS", url: "/lms", icon: BookOpen, moduleId: "lms" },
    ],
  },
  {
    label: "Examinations",
    items: [
      {
        title: "Examinations",
        url: "/examinations",
        icon: FileSpreadsheet,
        moduleId: "examination",
        roles: ["super-admin", "staff"],
        children: [
          { title: "Exam Schedule", url: "/faculty/examinations", search: { tab: "Exam Schedule" }, moduleId: "examination" },
          { title: "Hall Tickets", url: "/faculty/examinations", search: { tab: "Hall Tickets" }, moduleId: "examination" },
          { title: "Internal Marks", url: "/faculty/examinations", search: { tab: "Internal Marks" }, moduleId: "examination" },
        ],
      },
      { title: "Results", url: "/results", icon: Award, moduleId: "examination" },
    ],
  },
  {
    label: "Campus Services",
    items: [
      { title: "Library", url: "/library", icon: Library, moduleId: "library" },
      { title: "Hostel", url: "/hostel", icon: BedDouble, moduleId: "hostel" },
      { title: "Transport", url: "/transport", icon: Bus, moduleId: "transport" },
      { title: "Placements", url: "/placements", icon: Briefcase, moduleId: "placement" },
      { title: "Inventory", url: "/inventory", icon: Package, moduleId: "inventory" },
      { title: "Procurement", url: "/procurement", icon: Package, moduleId: "procurement" },
      { title: "Campus Events", url: "/campus-events", icon: CalendarRange, moduleId: "events" },
      { title: "Grievances", url: "/grievance", icon: ShieldAlert, moduleId: "grievance" },
      { title: "Alumni Network", url: "/alumni", icon: Globe, moduleId: "alumni" },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Employee Management", url: "/employee-management", icon: UserCog, moduleId: "hrms" },
      { title: "Leave Management", url: "/leave", icon: CalendarCheck, moduleId: "hrms" },
      { title: "Payroll", url: "/payroll", icon: Wallet, moduleId: "finance" },
      { title: "Finance", url: "/finance", icon: Wallet, moduleId: "finance" },
      { title: "HR", url: "/hr", icon: UserCog, moduleId: "hrms" },
      { title: "Accreditation", url: "/accreditation", icon: Award, moduleId: "accreditation" },
      { title: "Reports", url: "/reports", icon: BarChart3, moduleId: "student-info", roles: ["super-admin", "staff"] },
      {
        title: "Communication",
        url: "/communication",
        icon: MessageSquare,
        moduleId: "communication",
        badge: "6",
      },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

function resolveUrlForUser(url: string, user: UserPermissionContext, title?: string): string {
  return resolveTargetUrlForUser(user, url, title);
}

export function navigationForUser(user: UserPermissionContext): NavSection[] {
  return navigation
    .map((section) => {
      const items = section.items
        .filter((item) => {
          // 1. Role level filtering (optional explicit block)
          if (item.roles && !item.roles.includes(user.role)) {
            return false;
          }

          // 2. Privilege flag filtering
          if (item.requiredFlags && !item.requiredFlags.some((flag) => user.flags.includes(flag))) {
            return false;
          }

          // 3. Module permission check via permissions service
          if (item.moduleId) {
            const action = item.requiredPermission || "read";
            return canAccessModule(user, item.moduleId, action);
          }

          return true;
        })
        .map((item) => {
          const newUrl = resolveUrlForUser(item.url, user, item.title);
          const newChildren = item.children?.map((child) => ({
            ...child,
            url: resolveUrlForUser(child.url, user, child.title),
          }));

          return {
            ...item,
            url: newUrl,
            children: newChildren,
          };
        });

      return {
        ...section,
        items,
      };
    })
    .filter((section) => section.items.length > 0);
}
