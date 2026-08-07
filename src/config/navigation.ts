import {
  LayoutDashboard,
  BadgeCheck,
  GraduationCap,
  School,
  Users,
  UserCog,
  CalendarCheck,
  ClipboardCheck,
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
  Siren,
  Globe,
  ClipboardList,
  FileText,
  TrendingUp,
  Bell,
  Building2,
  UserCheck,
  FileCheck2,
  Video,
  Database,
  Send,
  HelpCircle,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Clock,
  Ticket,
  CreditCard,
  MessageCircle,
  LogOut,
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
  children?: { title: string; url: string; moduleId?: string }[] | undefined;
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
      { title: "Learning Management", url: "/student/lms", icon: BookOpen },
      { title: "Timetable", url: "/student/timetable", icon: CalendarRange },
      { title: "Attendance", url: "/student/attendance", icon: ClipboardCheck },
      { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
      { title: "Examinations", url: "/student/examinations", icon: FileText },
      { title: "Hostel", url: "/student/hostel", icon: BedDouble },
      { title: "Discussion Forum", url: "/student/discussion-forum", icon: MessageCircle },
      { title: "Finance", url: "/student/finance", icon: CreditCard },
      { title: "OPAC", url: "/student/library", icon: Library },
      { title: "Updates", url: "/student/updates", icon: Sparkles },
      { title: "Webinars", url: "/student/webinars", icon: Video },
      { title: "Student ID Card", url: "/student/id-card", icon: BadgeCheck },
      { title: "My Profile", url: "/student/profile", icon: User },
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
      { title: "AI & Analytics", url: "/ai-analytics", icon: BarChart3, roles: ["super-admin", "staff", "student", "parent"] },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Pre-Admission Portal", url: "/pre-admission", icon: School, moduleId: "pre-admission" },
      { title: "Admission Office", url: "/admission", icon: GraduationCap, moduleId: "admission" },
      { title: "Academics", url: "/academics", icon: GraduationCap, moduleId: "academics" },
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
      { title: "Inventory", url: "/inventory", icon: Package, moduleId: "inventory" },
      { title: "Procurement", url: "/procurement", icon: Package, moduleId: "procurement" },
      { title: "Campus Events", url: "/campus-events", icon: CalendarRange, moduleId: "events" },
      { title: "Grievances", url: "/grievance", icon: ShieldAlert, moduleId: "grievance" },
      {
        title: "Alumni Network",
        url: "/alumni",
        icon: Globe,
        moduleId: "alumni",
        children: [
          { title: "Dashboard", url: "/alumni?tab=dashboard" },
          { title: "Directory", url: "/alumni?tab=directory" },
          { title: "Analytics", url: "/alumni?tab=analytics" },
        ],
      },
    ],
  },
];

function resolveUrlForUser(url: string, user: UserPermissionContext, title?: string): string {
  // Preserve standalone module URLs without rewriting
  if (
    [
      "/employee-management",
      "/leave",
      "/payroll",
      "/inventory",
      "/procurement",
      "/campus-events",
      "/pre-admission",
      "/admission",
      "/accreditation",
      "/grievance",
      "/alumni",
      "/approval-workflows",
    ].includes(url)
  ) {
    return url;
  }

  const role = user.role;
  const flags = user.flags;

  if (role === "super-admin" || role === "super_admin") {
    return url === "/dashboard" ? "/super-admin/dashboard" : url;
  }

  if (role === "student") {
    if (url === "/dashboard") return "/student/dashboard";
    if (url === "/academics") return "/student/courses";
    if (url === "/examinations") return "/student/examinations";
    if (url === "/results") return "/student/examinations";
    if (url === "/finance") return "/student/finance";
    if (url === "/attendance") return "/student/attendance";
    if (url === "/lms") return "/student/lms";
    if (url === "/settings") return "/student/profile";
    if (url === "/timetable") return "/student/timetable";
    if (url === "/library") return "/student/library";
    if (url === "/grievance" || url === "/feedback") return "/student/feedback";
    if (url === "/discussion-forum") return "/student/discussion-forum";
    if (url === "/id-card") return "/student/id-card";
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
      if (url === "/settings") return "/placement/settings";
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

  // Check if staff has administrative flags
  const isAdminStaff = user.flags.some(flag => 
    ["isHod", "isDean", "isExamController", "isPlacementOfficer", "isLibraryAdmin", 
     "isTransportOfficer", "isHostelWarden", "isHRManager", "isFinanceOfficer"].includes(flag)
  );

  if (user.role === "staff" && !isAdminStaff) {
    return [
      {
        label: "Faculty Workspace",
        items: [
          { title: "Dashboard", url: "/faculty/dashboard", icon: LayoutDashboard },
          { title: "My Profile", url: "/faculty/profile", icon: User },
          { title: "Timetable", url: "/faculty/timetable", icon: CalendarRange },
          { title: "Subjects", url: "/faculty/subjects", icon: BookOpen },
          { title: "Lesson Plans", url: "/faculty/lesson-plan", icon: ClipboardList },
          { title: "Attendance", url: "/faculty/attendance", icon: CalendarCheck },
          { title: "Students", url: "/faculty/students", icon: Users },
          { title: "Assignments", url: "/faculty/assignments", icon: ClipboardList },
          { title: "Study Materials", url: "/faculty/materials", icon: FileText },
          { title: "Assessments", url: "/faculty/assessments", icon: GraduationCap },
          { title: "Examinations", url: "/faculty/examinations", icon: FileSpreadsheet },
          { title: "Research", url: "/faculty/research", icon: TrendingUp },
          { title: "Leave", url: "/faculty/leave", icon: CalendarRange },
          { title: "Payroll", url: "/faculty/payroll", icon: Wallet },
          { title: "Reports", url: "/faculty/reports", icon: BarChart3 },
          { title: "Notifications", url: "/faculty/notifications", icon: Bell, badge: "3" },
          { title: "Settings", url: "/faculty/settings", icon: Settings },
        ],
      }
    ];
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

