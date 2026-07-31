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
  type LucideIcon,
} from "lucide-react";

import type { LoginRole } from "@/config/roles";
import { hasPermission, type UserPermissionContext } from "@/lib/permissions";

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
  children?: { title: string; url: string; moduleId?: string }[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Academics",
    items: [
      {
        title: "Academics",
        url: "/academics",
        icon: GraduationCap,
        moduleId: "academics",
        children: [
          { title: "Departments", url: "/academics", moduleId: "academics" },
          { title: "Courses", url: "/academics", moduleId: "academics" },
          { title: "Curriculum", url: "/academics", moduleId: "academics" },
        ],
      },
      { title: "Students", url: "/students", icon: Users, moduleId: "student-info" },
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
        children: [
          { title: "Exam Schedule", url: "/examinations", moduleId: "examination" },
          { title: "Hall Tickets", url: "/examinations", moduleId: "examination" },
          { title: "Internal Marks", url: "/examinations", moduleId: "examination" },
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
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Finance", url: "/finance", icon: Wallet, moduleId: "finance" },
      { title: "HR", url: "/hr", icon: UserCog, moduleId: "hrms" },
      { title: "Reports", url: "/reports", icon: BarChart3, moduleId: "student-info" },
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
  const role = user.role;
  const flags = user.flags;

  if (role === "super-admin") {
    if (url === "/dashboard") return "/super-admin/dashboard";
    if (url === "/students") return "/super-admin/students";
    if (url === "/faculty") return "/super-admin/faculty";
    if (url === "/academics") return "/super-admin/courses";
    if (url === "/settings") return "/super-admin/settings";
  }

  if (role === "student") {
    if (url === "/dashboard") return "/student/dashboard";
    if (url === "/academics") return "/student/courses";
    if (url === "/results") return "/student/results";
    if (url === "/attendance") return "/student/attendance";
    if (url === "/lms") return "/student/lms";
    if (url === "/settings") return "/student/profile";
  }

  if (role === "parent") {
    if (url === "/dashboard") return "/parent/dashboard";
    if (url === "/attendance") return "/parent/attendance";
    if (url === "/finance") return "/parent/fees";
    if (url === "/transport") return "/parent/transport";
    if (url === "/settings") return "/parent/dashboard";
  }

  if (role === "staff") {
    if (flags.includes("isHod")) {
      if (url === "/dashboard") return "/hod/dashboard";
      if (url === "/faculty") return "/hod/faculty";
      if (url === "/attendance") return "/hod/attendance";
      if (url === "/reports") return "/hod/reports";
      if (url === "/settings") return "/faculty/profile";
    }
    if (flags.includes("isDean")) {
      if (url === "/dashboard") return "/dean/dashboard";
      if (url === "/settings") return "/faculty/profile";
    }
    if (flags.includes("isExamController")) {
      if (url === "/dashboard") return "/examination/dashboard";
      if (url === "/settings") return "/faculty/profile";
    }
    if (flags.includes("isPlacementOfficer")) {
      if (url === "/dashboard" || url === "/placements") return "/placement/dashboard";
      if (url === "/students") return "/placement/students";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Companies") return "/placement/companies";
      if (title === "Drives") return "/placement/drives";
      if (title === "Students") return "/placement/students";
    }
    if (flags.includes("isLibraryAdmin")) {
      if (url === "/dashboard" || url === "/library") return "/library/dashboard";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Books" || title === "Search Catalogue" || title === "Catalogue")
        return "/library/books";
      if (title === "Issues" || title === "Circulation") return "/library/issues";
    }
    if (flags.includes("isTransportOfficer")) {
      if (url === "/dashboard" || url === "/transport") return "/transport/dashboard";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Routes") return "/transport/routes";
      if (title === "Buses" || title === "Vehicles") return "/transport/buses";
    }
    if (flags.includes("isHostelWarden")) {
      if (url === "/dashboard" || url === "/hostel") return "/hostel/dashboard";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Rooms" || title === "Allotment") return "/hostel/rooms";
      if (title === "Students") return "/hostel/students";
    }
    if (flags.includes("isHRManager")) {
      if (url === "/dashboard" || url === "/hr") return "/hr/dashboard";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Employees") return "/hr/employees";
      if (title === "Payroll") return "/hr/payroll";
    }
    if (flags.includes("isFinanceOfficer")) {
      if (url === "/dashboard" || url === "/finance") return "/finance/dashboard";
      if (url === "/settings") return "/faculty/profile";
      if (title === "Fees") return "/finance/fees";
      if (title === "Reports") return "/finance/reports";
    }

    if (url === "/dashboard") return "/faculty/dashboard";
    if (url === "/attendance") return "/faculty/attendance";
    if (url === "/lms") return "/faculty/lms";
    if (url === "/examinations") return "/faculty/examinations";
    if (url === "/results") return "/faculty/results";
    if (url === "/settings") return "/faculty/profile";
  }

  if (role === "external-user") {
    if (url === "/dashboard") return "/external-user/dashboard";
    if (url === "/settings") return "/external-user/dashboard";
  }

  return url;
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

          // 3. Module permission check
          if (item.moduleId) {
            const action = item.requiredPermission || "read";
            const perm = hasPermission(user, item.moduleId, action);
            return perm.allowed;
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
