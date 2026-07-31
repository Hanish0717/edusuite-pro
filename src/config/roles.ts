import {
  Building2,
  GraduationCap,
  ShieldCheck,
  UserCog,
  Users,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type LoginRole = "super-admin" | "staff" | "student" | "parent" | "external-user";

export type ExternalPersona = "applicant" | "alumni" | "recruiter" | "vendor" | "guest-faculty";

export type DepartmentCode = "CSE" | "ECE" | "EEE" | "ME" | "Civil" | "MBA";

export interface RoleProfile {
  id: LoginRole;
  label: string;
  personaName: string;
  personaMeta: string;
  initials: string;
  flags: string[];
  department?: DepartmentCode;
  externalPersona?: ExternalPersona;
}

export const RESPONSIBILITY_FLAGS = [
  // System Privileges
  { id: "isSystemAdmin", label: "System Admin", category: "System Privileges" },
  { id: "isSecurityAdmin", label: "Security Admin", category: "System Privileges" },
  { id: "isAuditAdmin", label: "Audit Admin", category: "System Privileges" },
  { id: "isUserManager", label: "User Manager", category: "System Privileges" },

  // Academic Privileges
  { id: "isPrincipal", label: "Principal", category: "Academic Privileges" },
  { id: "isVicePrincipal", label: "Vice Principal", category: "Academic Privileges" },
  { id: "isDean", label: "Dean", category: "Academic Privileges" },
  { id: "isHod", label: "HOD (Department Head)", category: "Academic Privileges" },
  { id: "isExamController", label: "Exam Controller", category: "Academic Privileges" },
  { id: "isAcademicCoordinator", label: "Academic Coordinator", category: "Academic Privileges" },
  { id: "isClassAdvisor", label: "Class Advisor", category: "Academic Privileges" },
  { id: "isMentor", label: "Mentor", category: "Academic Privileges" },
  { id: "isResearchCoordinator", label: "Research Coordinator", category: "Academic Privileges" },
  { id: "isLabIncharge", label: "Lab Incharge", category: "Academic Privileges" },
  {
    id: "isDisciplinaryCommittee",
    label: "Disciplinary Committee",
    category: "Academic Privileges",
  },

  // Student Services
  { id: "isAdmissionsOfficer", label: "Admissions Officer", category: "Student Services" },
  { id: "isHostelWarden", label: "Hostel Warden", category: "Student Services" },
  { id: "isTransportOfficer", label: "Transport Officer", category: "Student Services" },
  { id: "isPlacementOfficer", label: "Placement Officer", category: "Student Services" },

  // Operations
  { id: "isFinanceOfficer", label: "Finance Officer", category: "Operations" },
  { id: "isHRManager", label: "HR Manager", category: "Operations" },
  { id: "isInventoryManager", label: "Inventory Manager", category: "Operations" },
  { id: "isPurchaseManager", label: "Purchase Manager", category: "Operations" },
  { id: "isLibraryAdmin", label: "Library Admin", category: "Operations" },
  { id: "isTrainingCoordinator", label: "Training Coordinator", category: "Operations" },
  { id: "isNonTeaching", label: "Non-Teaching Staff", category: "Operations" },
  { id: "isIQACCoordinator", label: "IQAC Coordinator", category: "Operations" },
  { id: "isNAACCoordinator", label: "NAAC Coordinator", category: "Operations" },
  { id: "isNBACoordinator", label: "NBA Coordinator", category: "Operations" },
] as const;

export const STAFF_PRIVILEGE_FLAGS = RESPONSIBILITY_FLAGS;

export const EXTERNAL_PERSONAS = [
  { id: "applicant", label: "Applicant", defaultMeta: "B.Tech Admissions Applicant" },
  { id: "alumni", label: "Alumni", defaultMeta: "Alumni - Batch of 2022" },
  { id: "recruiter", label: "Recruiter", defaultMeta: "Campus Recruiter (Google)" },
  { id: "vendor", label: "Vendor", defaultMeta: "Cafeteria Services Vendor" },
  { id: "guest-faculty", label: "Guest Faculty", defaultMeta: "Guest Speaker / Professor" },
] as const;

export const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "ECE", name: "Electronics & Communication Engineering" },
  { code: "EEE", name: "Electrical & Electronics Engineering" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "Civil", name: "Civil Engineering" },
  { code: "MBA", name: "Master of Business Administration" },
] as const;

export const roleProfiles: Record<LoginRole, RoleProfile> = {
  "super-admin": {
    id: "super-admin",
    label: "Super Admin",
    personaName: "Super Admin",
    personaMeta: "Platform Owner - All Institutions",
    initials: "SA",
    flags: ["isSystemAdmin", "isPrincipal"],
  },
  staff: {
    id: "staff",
    label: "Staff (Faculty)",
    personaName: "Dr. Ravi Kumar",
    personaMeta: "Faculty - Computer Science & Engineering",
    initials: "RK",
    flags: ["isMentor", "isClassAdvisor"],
    department: "CSE",
  },
  student: {
    id: "student",
    label: "Student",
    personaName: "K. Sai Teja",
    personaMeta: "B.Tech CSE - Roll No. 22CS101",
    initials: "ST",
    flags: [],
    department: "CSE",
  },
  parent: {
    id: "parent",
    label: "Parent",
    personaName: "S. Anitha",
    personaMeta: "Parent of Sai Teja (22CS101)",
    initials: "SA",
    flags: [],
  },
  "external-user": {
    id: "external-user",
    label: "External User",
    personaName: "David Miller",
    personaMeta: "Campus Recruiter (Google)",
    initials: "DM",
    flags: [],
    externalPersona: "recruiter",
  },
};

export const roleOrder: LoginRole[] = [
  "super-admin",
  "staff",
  "student",
  "parent",
  "external-user",
];

export interface RoleHighlight {
  id: LoginRole;
  label: string;
  summary: string;
  icon: LucideIcon;
}

export const roleList: RoleHighlight[] = [
  {
    id: "super-admin",
    label: "Super Admin",
    summary: "Institution-wide control, module access matrix and system health.",
    icon: ShieldCheck,
  },
  {
    id: "staff",
    label: "Staff (Faculty)",
    summary:
      "Classes, attendance, internals, notes and customizable privilege flags (HOD, Dean, etc.).",
    icon: UserCog,
  },
  {
    id: "student",
    label: "Student",
    summary: "Timetable, attendance, assignments, results and fees.",
    icon: GraduationCap,
  },
  {
    id: "parent",
    label: "Parent",
    summary: "Ward progress, attendance alerts, fees and transport tracking.",
    icon: Users,
  },
  {
    id: "external-user",
    label: "External User",
    summary: "Applicants, Alumni, Recruiters, Vendors, and Guest Faculty access.",
    icon: Globe,
  },
];

// Modules list as per the official RBAC Access Matrix
export const ERP_MODULES = [
  { id: "admission", name: "Admission Management", icon: GraduationCap },
  { id: "student-info", name: "Student Information (SIS)", icon: Users },
  { id: "academics", name: "Academic Management", icon: Building2 },
  { id: "attendance", name: "Attendance", icon: UserCog },
  { id: "examination", name: "Examination", icon: ShieldCheck },
  { id: "lms", name: "LMS", icon: GraduationCap },
  { id: "placement", name: "Placements", icon: ShieldCheck },
  { id: "hostel", name: "Hostel", icon: Building2 },
  { id: "transport", name: "Transport", icon: Users },
  { id: "library", name: "Library", icon: Building2 },
  { id: "finance", name: "Finance", icon: Users },
  { id: "hrms", name: "HRMS", icon: UserCog },
  { id: "inventory", name: "Inventory", icon: Building2 },
  { id: "accreditation", name: "Accreditation", icon: ShieldCheck },
  { id: "communication", name: "Communication", icon: Users },
  { id: "grievance", name: "Grievance", icon: ShieldCheck },
  { id: "alumni", name: "Alumni", icon: Globe },
] as const;

export function getDefaultRouteForUser(role: LoginRole, flags: string[]): string {
  if (role === "super-admin") return "/super-admin/dashboard";
  if (role === "student") return "/student/dashboard";
  if (role === "parent") return "/parent/dashboard";
  if (role === "external-user") return "/external-user/dashboard";

  if (flags.includes("isHod")) return "/hod/dashboard";
  if (flags.includes("isDean")) return "/dean/dashboard";
  if (flags.includes("isExamController")) return "/examination/dashboard";
  if (flags.includes("isPlacementOfficer")) return "/placement/dashboard";
  if (flags.includes("isLibraryAdmin")) return "/library/dashboard";
  if (flags.includes("isTransportOfficer")) return "/transport/dashboard";
  if (flags.includes("isHostelWarden")) return "/hostel/dashboard";
  if (flags.includes("isHRManager")) return "/hr/dashboard";
  if (flags.includes("isFinanceOfficer")) return "/finance/dashboard";

  return "/faculty/dashboard";
}
