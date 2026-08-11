export type RoleId =
  | "super_admin"
  | "admin"
  | "principal"
  | "vice_principal"
  | "dean"
  | "hod"
  | "faculty"
  | "student"
  | "parent"
  | "exam_cell"
  | "librarian"
  | "placement"
  | "warden"
  | "transport"
  | "accounts"
  | "lms"
  | "alumni_coordinator"
  | "alumni";

const ROLE_NORMALIZATION_MAP: Record<string, RoleId> = {
  // Super Admin
  "super_admin": "super_admin",
  "super-admin": "super_admin",
  "superadmin": "super_admin",
  "SUPER_ADMIN": "super_admin",

  // Admin
  "admin": "admin",
  "operations": "admin",
  "ADMIN": "admin",

  // Principal
  "principal": "principal",
  "PRINCIPAL": "principal",

  // Vice Principal
  "vice_principal": "vice_principal",
  "vice-principal": "vice_principal",
  "viceprincipal": "vice_principal",

  // Dean
  "dean": "dean",
  "DEAN": "dean",
  "academic_dean": "dean",
  "student_dean": "dean",
  "iqac_dean": "dean",
  "ima_dean": "dean",
  "research_dean": "dean",
  "finance_dean": "dean",
  "examination_dean": "dean",
  "placement_dean": "dean",

  // HOD
  "hod": "hod",
  "HOD": "hod",
  "head-of-department": "hod",

  // Faculty
  "faculty": "faculty",
  "teacher": "faculty",
  "FACULTY": "faculty",

  // Student
  "student": "student",
  "STUDENT": "student",

  // Parent
  "parent": "parent",
  "PARENT": "parent",
  "guardian": "parent",

  // Exam Cell
  "exam_cell": "exam_cell",
  "exam-cell": "exam_cell",
  "examcell": "exam_cell",
  "examination": "exam_cell",

  // Librarian
  "librarian": "librarian",
  "library": "librarian",

  // Placement
  "placement": "placement",
  "placement-officer": "placement",
  "tpo": "placement",

  // Warden
  "warden": "warden",
  "hostel-warden": "warden",
  "hostel": "warden",

  // Transport
  "transport": "transport",
  "transport-manager": "transport",

  // Accounts & Finance
  "accounts": "accounts",
  "finance": "accounts",
  "accounts-finance": "accounts",

  // LMS Manager
  "lms": "lms",
  "lms-manager": "lms",

  // Alumni Coordinator
  "alumni_coordinator": "alumni_coordinator",
  "alumni-coordinator": "alumni_coordinator",
  "alumnicoordinator": "alumni_coordinator",

  // Alumni
  "alumni": "alumni",
};

export function normalizeRole(rawRole: string): RoleId {
  if (!rawRole) return "student";
  const cleaned = rawRole.trim().toLowerCase().replace(/[\s-]/g, "_");
  if (cleaned in ROLE_NORMALIZATION_MAP) {
    const matched = ROLE_NORMALIZATION_MAP[cleaned];
    if (matched) return matched;
  }
  const keyMatch = Object.keys(ROLE_NORMALIZATION_MAP).find((k) =>
    cleaned.includes(k) || k.includes(cleaned),
  );
  if (keyMatch) {
    const matched = ROLE_NORMALIZATION_MAP[keyMatch];
    if (matched) return matched;
  }
  return "student";
}

export const DASHBOARD_ROUTE_MAP: Record<RoleId, string> = {
  super_admin: "/dashboard",
  admin: "/dashboard",
  principal: "/dashboard",
  vice_principal: "/dashboard",
  dean: "/dashboard",
  hod: "/dashboard",
  faculty: "/dashboard",
  student: "/dashboard",
  parent: "/dashboard",
  exam_cell: "/dashboard",
  librarian: "/dashboard",
  placement: "/dashboard",
  warden: "/dashboard",
  transport: "/dashboard",
  accounts: "/dashboard",
  lms: "/dashboard",
  alumni_coordinator: "/dashboard",
  alumni: "/dashboard",
};

export function resolveDashboardRoute(role: RoleId | string): string {
  const canonical = normalizeRole(role);
  return DASHBOARD_ROUTE_MAP[canonical] || "/dashboard";
}
