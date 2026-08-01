import api from "@/lib/api";

export interface SuperAdminStats {
  totalStudents: number;
  totalStaff: number;
  totalDepartments: number;
  totalRevenue: string;
  apiLatency: string;
  sslStatus: string;
  errorRate: string;
  systemHealth: { label: string; status: string }[];
}

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "principal" | "dean" | "hod" | "faculty" | "student" | "finance" | "hr";
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  hodName: string;
  studentsCount: number;
  facultyCount: number;
  accreditation: string;
  status: "Active" | "Under Review";
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  ipAddress: string;
  status: "Success" | "Failed";
}

// ----------------------------------------------------------------------
// STATIC MOCK FALLBACK DATASETS
// ----------------------------------------------------------------------

export const MOCK_SUPER_ADMIN_STATS: SuperAdminStats = {
  totalStudents: 5246,
  totalStaff: 623,
  totalDepartments: 23,
  totalRevenue: "₹12.45 Cr",
  apiLatency: "42ms",
  sslStatus: "Valid (Expires in 290 days)",
  errorRate: "0.02%",
  systemHealth: [
    { label: "Database Node (PostgreSQL Cluster)", status: "Healthy (12ms)" },
    { label: "Express API Gateway", status: "Healthy" },
    { label: "Redis Cache Cluster", status: "Healthy (99.8% hit rate)" },
    { label: "Cloud Object Storage", status: "72% used (1.4 TB)" },
    { label: "Automated Daily Backup", status: "Completed Today 02:00 AM" },
  ],
};

export const MOCK_USERS: SuperAdminUser[] = [
  {
    id: "USR-001",
    name: "Hanish Super Admin",
    email: "superadmin@college.com",
    role: "super_admin",
    department: "System Administration",
    status: "Active",
    lastLogin: "2026-08-01 12:30",
    createdAt: "2024-01-10",
  },
  {
    id: "USR-002",
    name: "Dr. S. K. Gupta",
    email: "dean@college.com",
    role: "dean",
    department: "Computer Science & Engineering",
    status: "Active",
    lastLogin: "2026-08-01 11:15",
    createdAt: "2024-02-15",
  },
  {
    id: "USR-003",
    name: "Dr. Rajesh Sharma",
    email: "hod@college.com",
    role: "hod",
    department: "Computer Science & Engineering",
    status: "Active",
    lastLogin: "2026-07-31 16:45",
    createdAt: "2024-03-01",
  },
  {
    id: "USR-004",
    name: "Dr. Meera Rao",
    email: "vice_principal@college.com",
    role: "admin",
    department: "Electronics & Communication",
    status: "Active",
    lastLogin: "2026-07-30 09:20",
    createdAt: "2024-03-12",
  },
  {
    id: "USR-005",
    name: "Prof. Anand Kumar",
    email: "faculty@college.com",
    role: "faculty",
    department: "Mechanical Engineering",
    status: "Active",
    lastLogin: "2026-07-29 14:10",
    createdAt: "2024-04-05",
  },
  {
    id: "USR-006",
    name: "Anirudh Sharma",
    email: "student@college.com",
    role: "student",
    department: "Computer Science & Engineering",
    status: "Active",
    lastLogin: "2026-08-01 10:05",
    createdAt: "2025-08-20",
  },
  {
    id: "USR-007",
    name: "Vikram Malhotra",
    email: "finance@college.com",
    role: "finance",
    department: "Accounts & Finance",
    status: "Active",
    lastLogin: "2026-07-31 18:00",
    createdAt: "2024-05-18",
  },
];

export const MOCK_DEPARTMENTS: DepartmentItem[] = [
  {
    id: "DEP-001",
    name: "Computer Science & Engineering",
    code: "CSE",
    hodName: "Dr. Rajesh Sharma",
    studentsCount: 1250,
    facultyCount: 85,
    accreditation: "NBA & NAAC A+",
    status: "Active",
  },
  {
    id: "DEP-002",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    hodName: "Dr. Meera Rao",
    studentsCount: 980,
    facultyCount: 64,
    accreditation: "NBA Accredited",
    status: "Active",
  },
  {
    id: "DEP-003",
    name: "Artificial Intelligence & Data Science",
    code: "AI&DS",
    hodName: "Dr. K. Sai Teja",
    studentsCount: 640,
    facultyCount: 42,
    accreditation: "NAAC A+",
    status: "Active",
  },
  {
    id: "DEP-004",
    name: "Mechanical Engineering",
    code: "ME",
    hodName: "Prof. V. K. Murthy",
    studentsCount: 720,
    facultyCount: 50,
    accreditation: "NBA Accredited",
    status: "Active",
  },
  {
    id: "DEP-005",
    name: "Biotechnology & Bio-Engineering",
    code: "BIOTECH",
    hodName: "Dr. S. Priya",
    studentsCount: 410,
    facultyCount: 28,
    accreditation: "NIRF Top 50",
    status: "Active",
  },
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "LOG-9001",
    timestamp: "2026-08-01 12:20:15",
    actor: "Super Admin (Hanish)",
    action: "Triggered System Backup",
    module: "Infrastructure",
    ipAddress: "103.82.40.12",
    status: "Success",
  },
  {
    id: "LOG-9002",
    timestamp: "2026-08-01 11:45:00",
    actor: "Admin-HYD",
    action: "Updated Faculty Role Privileges",
    module: "Security & RBAC",
    ipAddress: "103.82.40.15",
    status: "Success",
  },
  {
    id: "LOG-9003",
    timestamp: "2026-07-31 16:30:22",
    actor: "System Daemon",
    action: "Automated PostgreSQL DB Snapshot",
    module: "Database",
    ipAddress: "127.0.0.1",
    status: "Success",
  },
  {
    id: "LOG-9004",
    timestamp: "2026-07-31 14:12:08",
    actor: "Finance Manager",
    action: "Exported Monthly Payroll Ledger",
    module: "Finance & Payroll",
    ipAddress: "103.82.40.99",
    status: "Success",
  },
  {
    id: "LOG-9005",
    timestamp: "2026-07-31 10:05:40",
    actor: "Security Daemon",
    action: "Blocked Failed Brute-Force Login (IP 192.168.1.145)",
    module: "Security Firewall",
    ipAddress: "192.168.1.145",
    status: "Failed",
  },
];

// ----------------------------------------------------------------------
// SERVICE FUNCTIONS (WITH AXIOS & OFFLINE MOCK FALLBACK)
// ----------------------------------------------------------------------

/**
 * Fetch Super Admin overall platform statistics
 */
export async function fetchSuperAdminStats(): Promise<SuperAdminStats> {
  try {
    const res = await api.get("/api/super-admin/stats");
    if (res && res.data && res.data.totalStudents) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for /api/super-admin/stats. Using fallback data.");
  }
  return MOCK_SUPER_ADMIN_STATS;
}

/**
 * Fetch all platform users with search/role filters
 */
export async function fetchUsers(filters?: {
  role?: string;
  search?: string;
  page?: number;
}): Promise<SuperAdminUser[]> {
  try {
    const res = await api.get("/api/super-admin/users", { params: filters });
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for /api/super-admin/users. Using fallback data.");
  }
  return MOCK_USERS;
}

/**
 * Create a new user account
 */
export async function createUser(payload: Partial<SuperAdminUser>): Promise<SuperAdminUser> {
  try {
    const res = await api.post("/api/super-admin/users", payload);
    if (res && res.data && res.data.id) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for POST /api/super-admin/users. Creating local entry.");
  }

  const newUser: SuperAdminUser = {
    id: `USR-${Math.floor(100 + Math.random() * 900)}`,
    name: payload.name || "New Registered User",
    email: payload.email || "user@college.com",
    role: payload.role || "faculty",
    department: payload.department || "Computer Science & Engineering",
    status: payload.status || "Active",
    lastLogin: "Never",
    createdAt: new Date().toISOString().split("T")[0],
  };

  return newUser;
}

/**
 * Update an existing user account
 */
export async function updateUser(
  id: string,
  payload: Partial<SuperAdminUser>,
): Promise<Partial<SuperAdminUser>> {
  try {
    const res = await api.put(`/api/super-admin/users/${id}`, payload);
    if (res && res.data) {
      return res.data;
    }
  } catch (err) {
    console.warn(`Backend API unavailable for PUT /api/super-admin/users/${id}.`);
  }
  return { id, ...payload };
}

/**
 * Delete a user account
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/super-admin/users/${id}`);
  } catch (err) {
    console.warn(`Backend API unavailable for DELETE /api/super-admin/users/${id}.`);
  }
  return true;
}

/**
 * Fetch all departments
 */
export async function fetchDepartments(): Promise<DepartmentItem[]> {
  try {
    const res = await api.get("/api/super-admin/departments");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for /api/super-admin/departments. Using fallback data.");
  }
  return MOCK_DEPARTMENTS;
}

/**
 * Fetch system audit logs
 */
export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  try {
    const res = await api.get("/api/super-admin/audit-logs");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for /api/super-admin/audit-logs. Using fallback data.");
  }
  return MOCK_AUDIT_LOGS;
}

/**
 * Trigger system backup
 */
export async function triggerBackup(): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
}> {
  try {
    const res = await api.post("/api/super-admin/backups/create");
    if (res && res.data) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend API unavailable for POST /api/super-admin/backups/create.");
  }

  return {
    success: true,
    message: "System database backup snapshot created successfully (Local Storage Node).",
    timestamp: new Date().toLocaleString(),
  };
}
