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

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Roles allowed to see this item. Empty = everyone. */
  roles?: LoginRole[];
  badge?: string;
  children?: { title: string; url: string }[];
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
        children: [
          { title: "Departments", url: "/academics" },
          { title: "Courses", url: "/academics" },
          { title: "Curriculum", url: "/academics" },
        ],
      },
      { title: "Students", url: "/students", icon: Users, roles: ["super-admin", "staff", "hod"] },
      { title: "Faculty", url: "/faculty", icon: UserCog, roles: ["super-admin", "hod"] },
      { title: "Attendance", url: "/attendance", icon: CalendarCheck },
      { title: "Timetable", url: "/timetable", icon: CalendarRange },
      { title: "LMS", url: "/lms", icon: BookOpen },
    ],
  },
  {
    label: "Examinations",
    items: [
      {
        title: "Examinations",
        url: "/examinations",
        icon: FileSpreadsheet,
        children: [
          { title: "Exam Schedule", url: "/examinations" },
          { title: "Hall Tickets", url: "/examinations" },
          { title: "Internal Marks", url: "/examinations" },
        ],
      },
      { title: "Results", url: "/results", icon: Award },
    ],
  },
  {
    label: "Campus Services",
    items: [
      { title: "Library", url: "/library", icon: Library },
      { title: "Hostel", url: "/hostel", icon: BedDouble },
      { title: "Transport", url: "/transport", icon: Bus },
      { title: "Placements", url: "/placements", icon: Briefcase },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Finance", url: "/finance", icon: Wallet, roles: ["super-admin", "hod", "parent", "student"] },
      { title: "HR", url: "/hr", icon: UserCog, roles: ["super-admin", "hod"] },
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Communication", url: "/communication", icon: MessageSquare, badge: "6" },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function navigationForRole(role: LoginRole): NavSection[] {
  return navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}
