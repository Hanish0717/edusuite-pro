export type LoginRole = "super-admin" | "staff" | "student" | "parent" | "hod";

export interface RoleProfile {
  id: LoginRole;
  label: string;
  personaName: string;
  personaMeta: string;
  initials: string;
  /** Privilege flags layered on top of the core login role. */
  flags: string[];
}

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
  },
  student: {
    id: "student",
    label: "Student",
    personaName: "K. Sai Teja",
    personaMeta: "B.Tech CSE - Roll No. 22CS101",
    initials: "ST",
    flags: [],
  },
  parent: {
    id: "parent",
    label: "Parent",
    personaName: "S. Anitha",
    personaMeta: "Parent of Sai Teja (22CS101)",
    initials: "SA",
    flags: [],
  },
  hod: {
    id: "hod",
    label: "HOD (Department Head)",
    personaName: "Dr. M. Srinivas",
    personaMeta: "Head of the Department - CSE",
    initials: "MS",
    flags: ["isHod", "isExamController"],
  },
};

export const roleOrder: LoginRole[] = ["super-admin", "staff", "student", "parent", "hod"];
