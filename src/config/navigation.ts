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
  User,
  GitBranch,
  Package,
  ShieldAlert,
  Globe,
  Building2,
  UserCheck,
  ClipboardList,
  FileCheck2,
  Video,
  Database,
  Send,
  HelpCircle,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Bell,
  Clock,
  Ticket,
  CreditCard,
  MessageCircle,
  LogOut,
  FileText,
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

export const studentNavigation: NavSection[] = [
  {
    label: "Student Workspace",
    items: [
      { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
      { title: "Digital Notice Board", url: "/communication", icon: ClipboardList },
      { title: "My Profile", url: "/student/profile", icon: User },
      { title: "Learning Management", url: "/student/lms", icon: BookOpen },
      { title: "Timetable", url: "/student/timetable", icon: CalendarRange },
      { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
      { title: "Course Registrations", url: "/student/examinations", icon: FileText },
      { title: "Hostel", url: "/student/hostel", icon: BedDouble },
      { title: "Discussion Forum", url: "/student/discussion-forum", icon: MessageCircle },
      { title: "Payments", url: "/student/finance", icon: CreditCard },
      { title: "OPAC", url: "/student/library", icon: Library },
      { title: "Updates", url: "/student/updates", icon: Sparkles },
      { title: "Webinars", url: "/student/lms", icon: Video },
    ],
  },
];

export const PLACEMENT_OFFICER_NAVIGATION: NavSection[] = [
  {
    label: "Placement Officer Portal",
    items: [
      { title: "Dashboard", url: "/placement/dashboard", icon: LayoutDashboard },
      { title: "Companies", url: "/placement/companies", icon: Building2 },
      { title: "Recruiters", url: "/placement/recruiters", icon: UserCheck },
      { title: "Placement Drives", url: "/placement/drives", icon: Briefcase },
      { title: "Eligible Students", url: "/placement/students", icon: GraduationCap },
      { title: "Applications", url: "/placement/applications", icon: ClipboardList },
      { title: "Assessment Management", url: "/placement/assessments", icon: FileCheck2 },
      { title: "Assessment Requests", url: "/placement/assessment-requests", icon: FileCheck2, badge: "Pending" },
      { title: "Interview Management", url: "/placement/interviews", icon: Video },
      { title: "Offers", url: "/placement/offers", icon: Award },
      { title: "Analytics", url: "/placement/analytics", icon: BarChart3 },
      { title: "Reports", url: "/placement/reports", icon: FileSpreadsheet },
      { title: "Notifications", url: "/placement/notifications", icon: Bell },
      { title: "Settings", url: "/placement/settings", icon: Settings },
    ],
  },
];

export const navigation: NavSection[] = [
  {
    label: "Menu",
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

export const RECRUITER_NAVIGATION: NavSection[] = [
  {
    label: "Recruiter Portal",
    items: [
      { title: "Dashboard", url: "/external-user/dashboard?module=dashboard", icon: LayoutDashboard },
      { title: "Company Profile", url: "/external-user/dashboard?module=company-profile", icon: Building2 },
      { title: "Placement Drives", url: "/external-user/dashboard?module=placement-drives", icon: Briefcase },
      { title: "Assessments", url: "/external-user/dashboard?module=assessments", icon: FileCheck2 },
      { title: "Question Bank", url: "/external-user/dashboard?module=question-bank", icon: Database },
      { title: "Assessment Requests", url: "/external-user/dashboard?module=assessment-requests", icon: Send },
      { title: "Interview Management", url: "/external-user/dashboard?module=interviews", icon: Video },
      { title: "Offer Management", url: "/external-user/dashboard?module=offers", icon: Award },
      { title: "Reports", url: "/external-user/dashboard?module=reports", icon: BarChart3 },
      { title: "Notifications", url: "/external-user/dashboard?module=notifications", icon: Bell },
      { title: "Support", url: "/external-user/dashboard?module=support", icon: HelpCircle },
      { title: "Profile & Security", url: "/external-user/dashboard?module=profile-security", icon: ShieldCheck },
    ],
  },
];

export function navigationForUser(user: UserPermissionContext): NavSection[] {
  // Student Portal Navigation
  if (user.role === "student") {
    return studentNavigation;
  }

  // Placement Officer specific navigation menu
  if (user.role !== "super-admin" && (user.role === "placement" || user.flags.includes("isPlacementOfficer"))) {
    return PLACEMENT_OFFICER_NAVIGATION;
  }

  // Corporate Recruiter ATS Navigation
  if (user.role === "external-user" && (user.externalPersona === "recruiter" || !user.externalPersona)) {
    return RECRUITER_NAVIGATION;
  }

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

          let title = item.title;
          let icon = item.icon;
          if (item.title === "Settings") {
            title = "My Profile";
            icon = User;
          }

          return {
            ...item,
            title,
            icon,
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

