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

import { ACADEMIC_DEAN_NAVIGATION } from "@/config/navigation/academic-dean";
import { STUDENT_DEAN_NAVIGATION } from "@/config/navigation/student-dean";
import { IQAC_NAVIGATION } from "@/config/navigation/iqac";
import { IMA_NAVIGATION } from "@/config/navigation/ima";
import { RESEARCH_NAVIGATION } from "@/config/navigation/research";
import { FINANCE_NAVIGATION } from "@/config/navigation/finance";
import { EXAMINATION_NAVIGATION } from "@/config/navigation/examination";
import { PLACEMENT_NAVIGATION } from "@/config/navigation/placement";

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
      { title: "AI & Analytics", url: "/ai-analytics", icon: BarChart3, roles: ["super_admin", "staff", "student", "parent"] },
      { title: "Emergency Broadcast", url: "/emergency", icon: Siren, roles: ["super_admin", "staff"], badge: "Instant" },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Pre-Admission Portal", url: "/pre-admission", icon: School, moduleId: "pre-admission" },
      { title: "Admission Office", url: "/admission", icon: GraduationCap, moduleId: "admission" },
      { title: "Academics", url: "/academics", icon: GraduationCap, moduleId: "academics" },
      { title: "Students", url: "/students", icon: Users, moduleId: "student-info", roles: ["super_admin", "staff"] },
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
        roles: ["super_admin", "staff"],
        children: [
          { title: "Dashboard", url: "/examinations", moduleId: "examination" },
          { title: "Exam Schedule", url: "/examinations/schedule", moduleId: "examination" },
          { title: "Hall Tickets", url: "/examinations/hall-tickets", moduleId: "examination" },
          { title: "Internal Marks", url: "/examinations/internal-marks", moduleId: "examination" },
          { title: "Revaluation", url: "/examinations/revaluation", moduleId: "examination" },
          { title: "Exam Analytics", url: "/examinations/analytics", moduleId: "examination" },
          { title: "Reports", url: "/examinations/reports", moduleId: "examination" },
          { title: "Notifications", url: "/examinations/notifications", moduleId: "examination" },
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
          { title: "Alumni Directory", url: "/alumni?tab=directory" },
          { title: "Placement Portal", url: "/alumni?tab=placement-collaboration" },
          { title: "Career Services", url: "/alumni?tab=career" },
          { title: "Mentorship Hub", url: "/alumni?tab=mentorship" },
          { title: "Guest Lectures", url: "/alumni?tab=guest-lectures" },
          { title: "Student Networking", url: "/alumni?tab=student-networking" },
          { title: "Events & Reunions", url: "/alumni?tab=events" },
          { title: "News & Articles", url: "/alumni?tab=news-announcements" },
          { title: "Invitations Hub", url: "/alumni?tab=invitations" },
          { title: "Verification Queue", url: "/alumni?tab=verification-queue" },
          { title: "Donations & Giving", url: "/alumni?tab=donations" },
          { title: "Analytics", url: "/alumni?tab=analytics" },
        ],
      },
    ],
  },
];

function resolveUrlForUser(url: string, user: UserPermissionContext, title?: string): string {
  // Preserve standalone module URLs without rewriting
  if (
    url.startsWith("/staff") ||
    url.startsWith("/alumni") ||
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
      "/emergency",
      "/super-admin/emergency",
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
      if (url === "/dashboard") return "/staff";
      if (url === "/settings") return "/faculty/profile";
      if (url === "/attendance") return "/attendance";
      if (url === "/timetable") return "/timetable";
      if (url === "/examinations") return "/examinations";
      if (url === "/results") return "/results";
      if (url === "/faculty") return "/faculty";
      if (url === "/students") return "/students";
      if (url === "/academics") return "/academics";
      if (url === "/subject-allocation" || title === "Subject Allocation" || title === "Workload") return "/dean/subject-allocation";
      return url;
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
      { title: "Drive Applications", url: "/external-user/dashboard?module=drive-applications", icon: FileText },
      { title: "Company Profile", url: "/external-user/dashboard?module=company-profile", icon: Building2 },
      { title: "Placement Drives", url: "/external-user/dashboard?module=placement-drives", icon: Briefcase },
      { title: "Assessments", url: "/external-user/dashboard?module=assessments", icon: FileCheck2 },
      { title: "Question Bank", url: "/external-user/dashboard?module=question-bank", icon: Database },
      { title: "Interview Management", url: "/external-user/dashboard?module=interviews", icon: Video },
      { title: "Offer Management", url: "/external-user/dashboard?module=offers", icon: Award },
      { title: "Reports", url: "/external-user/dashboard?module=reports", icon: BarChart3 },
      { title: "Notifications", url: "/external-user/dashboard?module=notifications", icon: Bell },
      { title: "Support", url: "/external-user/dashboard?module=support", icon: HelpCircle },
      { title: "Profile & Security", url: "/external-user/dashboard?module=profile-security", icon: ShieldCheck },
    ],
  },
];

export const DEAN_NAVIGATION: NavSection[] = [
  {
    label: "Dean Portfolios Hub",
    items: [
      { title: "Dean Selection Hub", url: "/staff", icon: LayoutDashboard },
      {
        title: "Academic Dean",
        url: "/staff/academic-dean",
        icon: GraduationCap,
        children: [
          { title: "Dashboard", url: "/staff/academic-dean" },
          { title: "Departments", url: "/staff/academic-dean/departments" },
          { title: "Programs", url: "/staff/academic-dean/programs" },
          { title: "Curriculum", url: "/staff/academic-dean/curriculum" },
          { title: "Timetable", url: "/staff/academic-dean/timetable" },
          { title: "Faculty Workload", url: "/staff/academic-dean/faculty-workload" },
          { title: "Academic Calendar", url: "/staff/academic-dean/academic-calendar" },
          { title: "Course Allocation", url: "/staff/academic-dean/course-allocation" },
          { title: "Academic Reports", url: "/staff/academic-dean/academic-reports" },
          { title: "Accreditation", url: "/staff/academic-dean/accreditation" },
          { title: "Notifications", url: "/staff/academic-dean/notifications" },
          { title: "Settings", url: "/staff/academic-dean/settings" },
        ],
      },
      {
        title: "Student Dean",
        url: "/staff/student-dean",
        icon: Users,
        children: [
          { title: "Dashboard", url: "/staff/student-dean" },
          { title: "Students", url: "/staff/student-dean/students" },
          { title: "Student Profiles", url: "/staff/student-dean/profiles" },
          { title: "Grievances", url: "/staff/student-dean/grievances" },
          { title: "Scholarships", url: "/staff/student-dean/scholarships" },
          { title: "Discipline", url: "/staff/student-dean/discipline" },
          { title: "Counselling", url: "/staff/student-dean/counselling" },
          { title: "Clubs & Events", url: "/staff/student-dean/clubs-events" },
          { title: "Hostel", url: "/staff/student-dean/hostel" },
          { title: "Attendance Overview", url: "/staff/student-dean/attendance" },
          { title: "Student Reports", url: "/staff/student-dean/reports" },
          { title: "Notifications", url: "/staff/student-dean/notifications" },
          { title: "Settings", url: "/staff/student-dean/settings" },
        ],
      },
      {
        title: "IQAC Quality",
        url: "/staff/iqac",
        icon: BadgeCheck,
        children: [
          { title: "Dashboard", url: "/staff/iqac" },
          { title: "NAAC", url: "/staff/iqac/naac" },
          { title: "AQAR", url: "/staff/iqac/aqar" },
          { title: "Academic Audit", url: "/staff/iqac/audit" },
          { title: "Quality Metrics", url: "/staff/iqac/metrics" },
          { title: "KPI Monitoring", url: "/staff/iqac/kpi" },
          { title: "Feedback", url: "/staff/iqac/feedback" },
          { title: "Compliance", url: "/staff/iqac/compliance" },
          { title: "Documents", url: "/staff/iqac/documents" },
          { title: "Reports", url: "/staff/iqac/reports" },
          { title: "Notifications", url: "/staff/iqac/notifications" },
          { title: "Settings", url: "/staff/iqac/settings" },
        ],
      },
      {
        title: "IMA Governance",
        url: "/staff/ima",
        icon: Building2,
        children: [
          { title: "Dashboard", url: "/staff/ima" },
          { title: "Industry Partners", url: "/staff/ima/partners" },
          { title: "MoUs", url: "/staff/ima/mou" },
          { title: "Guest Lectures", url: "/staff/ima/guest-lectures" },
          { title: "Workshops", url: "/staff/ima/workshops" },
          { title: "Alumni", url: "/staff/ima/alumni" },
          { title: "Internships", url: "/staff/ima/internships" },
          { title: "Skill Programs", url: "/staff/ima/skill-programs" },
          { title: "Reports", url: "/staff/ima/reports" },
          { title: "Notifications", url: "/staff/ima/notifications" },
          { title: "Settings", url: "/staff/ima/settings" },
        ],
      },
      {
        title: "Research & Dev",
        url: "/staff/research-development",
        icon: TrendingUp,
        children: [
          { title: "Dashboard", url: "/staff/research-development" },
          { title: "Research Projects", url: "/staff/research-development/projects" },
          { title: "Publications", url: "/staff/research-development/publications" },
          { title: "Patents", url: "/staff/research-development/patents" },
          { title: "Grants", url: "/staff/research-development/grants" },
          { title: "Research Scholars", url: "/staff/research-development/scholars" },
          { title: "Conferences", url: "/staff/research-development/conferences" },
          { title: "Innovation", url: "/staff/research-development/innovation" },
          { title: "Startups", url: "/staff/research-development/startups" },
          { title: "Reports", url: "/staff/research-development/reports" },
          { title: "Notifications", url: "/staff/research-development/notifications" },
          { title: "Settings", url: "/staff/research-development/settings" },
        ],
      },
      {
        title: "Finance Dean",
        url: "/staff/finance-dean",
        icon: Wallet,
        children: [
          { title: "Dashboard", url: "/staff/finance-dean" },
          { title: "Budget", url: "/staff/finance-dean/budget" },
          { title: "Fee Collection", url: "/staff/finance-dean/fees" },
          { title: "Expenses", url: "/staff/finance-dean/expenses" },
          { title: "Payroll", url: "/staff/finance-dean/payroll" },
          { title: "Purchase Requests", url: "/staff/finance-dean/purchases" },
          { title: "Scholarships", url: "/staff/finance-dean/scholarships" },
          { title: "Financial Reports", url: "/staff/finance-dean/reports" },
          { title: "Audit", url: "/staff/finance-dean/audit" },
          { title: "Notifications", url: "/staff/finance-dean/notifications" },
          { title: "Settings", url: "/staff/finance-dean/settings" },
        ],
      },
      {
        title: "Examination Dean",
        url: "/staff/examination-dean",
        icon: FileSpreadsheet,
        children: [
          { title: "Dashboard", url: "/staff/examination-dean" },
          { title: "Exam Schedule", url: "/staff/examination-dean/schedule" },
          { title: "Hall Tickets", url: "/staff/examination-dean/hall-tickets" },
          { title: "Invigilators", url: "/staff/examination-dean/invigilators" },
          { title: "Results", url: "/staff/examination-dean/results" },
          { title: "Revaluation", url: "/staff/examination-dean/revaluation" },
          { title: "Malpractice", url: "/staff/examination-dean/malpractice" },
          { title: "Question Papers", url: "/staff/examination-dean/question-papers" },
          { title: "Reports", url: "/staff/examination-dean/reports" },
          { title: "Notifications", url: "/staff/examination-dean/notifications" },
          { title: "Settings", url: "/staff/examination-dean/settings" },
        ],
      },
      {
        title: "Placement Dean",
        url: "/staff/placement-dean",
        icon: Briefcase,
        children: [
          { title: "Dashboard", url: "/staff/placement-dean" },
          { title: "Companies", url: "/staff/placement-dean/companies" },
          { title: "Placement Drives", url: "/staff/placement-dean/drives" },
          { title: "Internships", url: "/staff/placement-dean/internships" },
          { title: "Eligible Students", url: "/staff/placement-dean/eligible-students" },
          { title: "Training", url: "/staff/placement-dean/training" },
          { title: "Offers", url: "\/staff/placement-dean/offers" },
          { title: "Package Analytics", url: "/staff/placement-dean/package-analytics" },
          { title: "Reports", url: "/staff/placement-dean/reports" },
          { title: "Notifications", url: "/staff/placement-dean/notifications" },
          { title: "Settings", url: "/staff/placement-dean/settings" },
        ],
      },
    ],
  },
];

export function navigationForUser(user: UserPermissionContext, currentPath?: string): NavSection[] {
  // Path-based Dean portfolio navigation matching (guarantees ONLY that dean's sidebar is shown)
  if (currentPath) {
    if (currentPath.startsWith("/staff/academic-dean")) return ACADEMIC_DEAN_NAVIGATION;
    if (currentPath.startsWith("/staff/student-dean")) return STUDENT_DEAN_NAVIGATION;
    if (currentPath.startsWith("/staff/iqac")) return IQAC_NAVIGATION;
    if (currentPath.startsWith("/staff/ima")) return IMA_NAVIGATION;
    if (currentPath.startsWith("/staff/research-development")) return RESEARCH_NAVIGATION;
    if (currentPath.startsWith("/staff/finance-dean")) return FINANCE_NAVIGATION;
    if (currentPath.startsWith("/staff/examination-dean")) return EXAMINATION_NAVIGATION;
    if (currentPath.startsWith("/staff/placement-dean")) return PLACEMENT_NAVIGATION;
  }

  // Student Portal Navigation
  if (user.role === "student") {
    return studentNavigation;
  }

  // Dean specific navigation — each dean sees ONLY their own modules
  const deanNavMap: Record<string, NavSection[]> = {
    academic_dean: ACADEMIC_DEAN_NAVIGATION,
    student_dean: STUDENT_DEAN_NAVIGATION,
    iqac_dean: IQAC_NAVIGATION,
    ima_dean: IMA_NAVIGATION,
    research_dean: RESEARCH_NAVIGATION,
    finance_dean: FINANCE_NAVIGATION,
    examination_dean: EXAMINATION_NAVIGATION,
    placement_dean: PLACEMENT_NAVIGATION,
  };
  if (user.role in deanNavMap) {
    return deanNavMap[user.role] as NavSection[];
  }
  // Legacy generic dean flag fallback (isDean without specific role)
  if ((user.role as any) !== "super-admin" && user.role !== "super_admin" && user.flags.includes("isDean")) {
    return DEAN_NAVIGATION;
  }

  // Placement Officer specific navigation menu
  if ((user.role as any) !== "super-admin" && user.role !== "super_admin" && (user.role === "placement" || user.flags.includes("isPlacementOfficer"))) {
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

