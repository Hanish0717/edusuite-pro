import { normalizeRole, type RoleId } from "./roleResolver";

export interface UserCredential {
  canonicalRole: RoleId;
  roleName: string;
  email: string;
  defaultPassword: "password123";
  primaryScope: string;
  personaName: string;
}

export const SYSTEM_TEST_CREDENTIALS: UserCredential[] = [
  {
    canonicalRole: "super_admin",
    roleName: "Super Admin",
    email: "superadmin@college.com",
    defaultPassword: "password123",
    primaryScope: "System Control & Governance",
    personaName: "Super Admin",
  },
  {
    canonicalRole: "admin",
    roleName: "Admin / Operations",
    email: "admin@college.com",
    defaultPassword: "password123",
    primaryScope: "Daily Operations & Workflows",
    personaName: "Rajesh Sharma (Admin)",
  },
  {
    canonicalRole: "principal",
    roleName: "Principal",
    email: "principal@college.com",
    defaultPassword: "password123",
    primaryScope: "Executive Oversight",
    personaName: "Dr. Meera Rao (Principal)",
  },
  {
    canonicalRole: "vice_principal",
    roleName: "Vice Principal",
    email: "vice_principal@college.com",
    defaultPassword: "password123",
    primaryScope: "Operations & Student Conduct",
    personaName: "Prof. V. K. Murthy",
  },
  {
    canonicalRole: "dean",
    roleName: "Academic Dean",
    email: "dean@college.com",
    defaultPassword: "password123",
    primaryScope: "Academic Leadership",
    personaName: "Prof. Anand Kumar (Dean)",
  },
  {
    canonicalRole: "hod",
    roleName: "Head of Department (HOD)",
    email: "hod@college.com",
    defaultPassword: "password123",
    primaryScope: "Department Administration",
    personaName: "Dr. S. K. Gupta (HOD CSE)",
  },
  {
    canonicalRole: "faculty",
    roleName: "Faculty / Teacher",
    email: "faculty@college.com",
    defaultPassword: "password123",
    primaryScope: "Teaching & Evaluation",
    personaName: "Dr. Ravi Kumar",
  },
  {
    canonicalRole: "student",
    roleName: "Student",
    email: "student@college.com",
    defaultPassword: "password123",
    primaryScope: "Learning & Academic Self-Service",
    personaName: "K. Sai Teja (22CS101)",
  },
  {
    canonicalRole: "parent",
    roleName: "Parent / Guardian",
    email: "parent@college.com",
    defaultPassword: "password123",
    primaryScope: "Guardian Monitoring",
    personaName: "S. Anitha (Parent)",
  },
  {
    canonicalRole: "exam_cell",
    roleName: "Exam Controller",
    email: "examcell@college.com",
    defaultPassword: "password123",
    primaryScope: "Examination Management",
    personaName: "Dr. P. V. Ramana (Controller)",
  },
  {
    canonicalRole: "librarian",
    roleName: "Librarian",
    email: "librarian@college.com",
    defaultPassword: "password123",
    primaryScope: "Library System",
    personaName: "M. N. Swamy (Librarian)",
  },
  {
    canonicalRole: "placement",
    roleName: "Placement Officer",
    email: "placement@college.com",
    defaultPassword: "password123",
    primaryScope: "Career & Placements",
    personaName: "Vikram Malhotra (TPO)",
  },
  {
    canonicalRole: "warden",
    roleName: "Hostel Warden",
    email: "warden@college.com",
    defaultPassword: "password123",
    primaryScope: "Hostel Management",
    personaName: "Col. R. S. Rathore (Warden)",
  },
  {
    canonicalRole: "transport",
    roleName: "Transport Manager",
    email: "transport@college.com",
    defaultPassword: "password123",
    primaryScope: "Fleet & Logistics",
    personaName: "Gurpreet Singh (Transport)",
  },
  {
    canonicalRole: "accounts",
    roleName: "Accounts & Finance",
    email: "accounts@college.com",
    defaultPassword: "password123",
    primaryScope: "Financial Operations",
    personaName: "Ramesh Agarwal (Finance)",
  },
  {
    canonicalRole: "lms",
    roleName: "LMS Manager",
    email: "lms@college.com",
    defaultPassword: "password123",
    primaryScope: "E-Learning Management",
    personaName: "Anita Deshmukh (LMS Admin)",
  },
  {
    canonicalRole: "alumni_coordinator",
    roleName: "Alumni Coordinator",
    email: "alumni.coordinator@college.com",
    defaultPassword: "password123",
    primaryScope: "Graduate Engagement",
    personaName: "Priya Nair (Alumni Cell)",
  },
  {
    canonicalRole: "alumni",
    roleName: "Alumni",
    email: "alumni@college.com",
    defaultPassword: "password123",
    primaryScope: "Graduate Network Portal",
    personaName: "Sarah Jenkins (Alumni 2022)",
  },
];

export interface LoginResult {
  success: boolean;
  user?: {
    email: string;
    role: RoleId;
    roleName: string;
    token: string;
    personaName: string;
  };
  message?: string;
}

export function loginWithCredentials(email: string, password: string): LoginResult {
  const match = SYSTEM_TEST_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!match) {
    // Fallback search by role alias matching
    const normRole = normalizeRole(email);
    const roleMatch = SYSTEM_TEST_CREDENTIALS.find((c) => c.canonicalRole === normRole);
    if (roleMatch) {
      return {
        success: true,
        user: {
          email: roleMatch.email,
          role: roleMatch.canonicalRole,
          roleName: roleMatch.roleName,
          token: `jwt-mock-token-${roleMatch.canonicalRole}-${Date.now()}`,
          personaName: roleMatch.personaName,
        },
      };
    }
    return { success: false, message: "Invalid email or role credential." };
  }

  if (password !== "password123" && password !== "demo1234") {
    return { success: false, message: "Invalid password. Use 'password123'." };
  }

  return {
    success: true,
    user: {
      email: match.email,
      role: match.canonicalRole,
      roleName: match.roleName,
      token: `jwt-mock-token-${match.canonicalRole}-${Date.now()}`,
      personaName: match.personaName,
    },
  };
}
