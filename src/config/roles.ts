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
  department?: DepartmentCode | undefined;
  externalPersona?: ExternalPersona | undefined;
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

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: LoginRole;
  title: string;
  category: "Core Roles" | "Academic Roles" | "Administrative Officers" | "External Personas";
  avatarInitials: string;
  flags: string[];
  department?: DepartmentCode;
  externalPersona?: ExternalPersona;
}

export const DEMO_USERS: DemoUser[] = [
  // Core Roles
  {
    id: "super-admin",
    name: "Super Admin",
    email: "admin@edusuite.edu",
    role: "super-admin",
    title: "Super Admin",
    category: "Core Roles",
    avatarInitials: "SA",
    flags: ["isSystemAdmin", "isPrincipal"],
  },
  {
    id: "staff-default",
    name: "Dr. Ravi Kumar",
    email: "ravi.kumar@edusuite.edu",
    role: "staff",
    title: "Staff / Faculty (Default)",
    category: "Core Roles",
    avatarInitials: "RK",
    flags: ["isMentor", "isClassAdvisor"],
    department: "CSE",
  },
  {
    id: "student",
    name: "K. Sai Teja",
    email: "saiteja.student@edusuite.edu",
    role: "student",
    title: "Student",
    category: "Core Roles",
    avatarInitials: "ST",
    flags: [],
    department: "CSE",
  },
  {
    id: "parent",
    name: "S. Anitha",
    email: "anitha.parent@edusuite.edu",
    role: "parent",
    title: "Parent",
    category: "Core Roles",
    avatarInitials: "SA",
    flags: [],
  },

  // Academic Roles
  {
    id: "hod",
    name: "Dr. Suresh Babu",
    email: "suresh.babu@edusuite.edu",
    role: "staff",
    title: "HOD (Department Head)",
    category: "Academic Roles",
    avatarInitials: "SB",
    flags: ["isHod", "isMentor"],
    department: "CSE",
  },
  {
    id: "dean",
    name: "Dr. Clara Oswald",
    email: "clara.oswald@edusuite.edu",
    role: "staff",
    title: "Dean (Academic Planning)",
    category: "Academic Roles",
    avatarInitials: "CO",
    flags: ["isDean"],
    department: "CSE",
  },
  {
    id: "exam-controller",
    name: "Prof. K. Rama Rao",
    email: "rama.rao@edusuite.edu",
    role: "staff",
    title: "Exam Controller",
    category: "Academic Roles",
    avatarInitials: "RR",
    flags: ["isExamController"],
  },

  // Administrative Officers
  {
    id: "placement-officer",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@edusuite.edu",
    role: "staff",
    title: "Placement Officer",
    category: "Administrative Officers",
    avatarInitials: "AS",
    flags: ["isPlacementOfficer"],
  },
  {
    id: "transport-officer",
    name: "M. Gangadhar",
    email: "gangadhar@edusuite.edu",
    role: "staff",
    title: "Transport Officer",
    category: "Administrative Officers",
    avatarInitials: "MG",
    flags: ["isTransportOfficer"],
  },
  {
    id: "hostel-warden",
    name: "B. Devendra",
    email: "devendra@edusuite.edu",
    role: "staff",
    title: "Hostel Warden",
    category: "Administrative Officers",
    avatarInitials: "BD",
    flags: ["isHostelWarden"],
  },
  {
    id: "finance-officer",
    name: "V. K. Viswanathan",
    email: "viswanathan@edusuite.edu",
    role: "staff",
    title: "Finance Officer",
    category: "Administrative Officers",
    avatarInitials: "VV",
    flags: ["isFinanceOfficer"],
  },
  {
    id: "library-admin",
    name: "Mrs. G. Sujatha",
    email: "sujatha@edusuite.edu",
    role: "staff",
    title: "Library Admin",
    category: "Administrative Officers",
    avatarInitials: "GS",
    flags: ["isLibraryAdmin"],
  },
  {
    id: "hr-manager",
    name: "R. Srinivas",
    email: "srinivas@edusuite.edu",
    role: "staff",
    title: "HR Manager",
    category: "Administrative Officers",
    avatarInitials: "RS",
    flags: ["isHRManager"],
  },

  // External Personas
  {
    id: "external-applicant",
    name: "John Doe",
    email: "john.applicant@gmail.com",
    role: "external-user",
    title: "Applicant (External)",
    category: "External Personas",
    avatarInitials: "JD",
    flags: [],
    externalPersona: "applicant",
  },
  {
    id: "external-recruiter",
    name: "David Miller",
    email: "david.recruiter@google.com",
    role: "external-user",
    title: "Recruiter (External)",
    category: "External Personas",
    avatarInitials: "DM",
    flags: [],
    externalPersona: "recruiter",
  },
  {
    id: "external-alumni",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@alumni.edu",
    role: "external-user",
    title: "Alumni (External)",
    category: "External Personas",
    avatarInitials: "SJ",
    flags: [],
    externalPersona: "alumni",
  },
  {
    id: "external-vendor",
    name: "Robert Chen",
    email: "robert.vendor@catering.com",
    role: "external-user",
    title: "Vendor (External)",
    category: "External Personas",
    avatarInitials: "RC",
    flags: [],
    externalPersona: "vendor",
  }
];
