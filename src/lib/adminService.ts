export interface AdminKpiConfig {
  id: string;
  label: string;
  value: string;
  iconName: string;
  tone?: "primary" | "info" | "warning" | "success";
  delta?: string;
}

export interface AdminModuleTile {
  id: string;
  title: string;
  description: string;
  iconName: string;
  route: string;
}

export interface AdminOperationTask {
  id: string;
  title: string;
  module: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low" | "Urgent";
  status: "Pending" | "In Progress" | "Completed" | "Under Review";
  lastUpdated: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  dateJoined: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  code: string;
  hodName: string;
  facultyCount: number;
  studentCount: number;
  status: "Active" | "Under Review";
}

export interface AdminAuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminReportConfig {
  id: string;
  title: string;
  category: "Academic" | "Financial" | "Compliance" | "Operations";
  format: "PDF" | "XLSX" | "CSV";
  lastGenerated: string;
}

export interface AdminSettingsConfig {
  moduleToggles: Record<string, boolean>;
  securityPolicies: {
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordExpirationDays: number;
  };
  notificationRules: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// MOCK DATASETS
export const MOCK_ADMIN_KPI_CONFIGS: AdminKpiConfig[] = [
  { id: "kpi-1", label: "Student Roster", value: "5,246 Active", iconName: "Users", tone: "primary", delta: "+3.2%" },
  { id: "kpi-2", label: "Faculty Roster", value: "623 Staff", iconName: "UserCog", tone: "info", delta: "+1.5%" },
  { id: "kpi-3", label: "Admissions Pending", value: "142 Applicants", iconName: "GraduationCap", tone: "warning", delta: "-4.1%" },
  { id: "kpi-4", label: "Fee Collections Today", value: "₹18.4 Lakhs", iconName: "Wallet", tone: "success", delta: "+12.8%" },
];

export const MOCK_ASSIGNED_MODULES: AdminModuleTile[] = [
  {
    id: "admission",
    title: "Admission Desk",
    description: "Pre-admissions & document verification",
    iconName: "GraduationCap",
    route: "/admission",
  },
  {
    id: "attendance",
    title: "Timetable & Attendance",
    description: "Clash-free schedule builder & loggers",
    iconName: "CalendarCheck",
    route: "/attendance",
  },
  {
    id: "examination",
    title: "Exam Analytics",
    description: "Valuation, hall tickets & gradebooks",
    iconName: "FileSpreadsheet",
    route: "/examinations",
  },
  {
    id: "inventory",
    title: "Inventory & Events",
    description: "Asset counts, POs & campus events",
    iconName: "Package",
    route: "/inventory",
  },
];

export const MOCK_ADMIN_TASKS: AdminOperationTask[] = [
  {
    id: "TASK-101",
    title: "Verify B.Tech CSE Applicants Documents",
    module: "Admissions",
    assignedTo: "Rajesh Sharma",
    priority: "Urgent",
    status: "Pending",
    lastUpdated: "10 mins ago",
  },
  {
    id: "TASK-102",
    title: "Publish Sem-4 Mid-Term Timetable",
    module: "Attendance",
    assignedTo: "Dr. S. K. Gupta",
    priority: "High",
    status: "In Progress",
    lastUpdated: "25 mins ago",
  },
  {
    id: "TASK-103",
    title: "Reconcile Daily Fee Receipts & Invoices",
    module: "Finance",
    assignedTo: "Ramesh Agarwal",
    priority: "Medium",
    status: "Completed",
    lastUpdated: "1 hour ago",
  },
  {
    id: "TASK-104",
    title: "Audit Computer Lab 3 Asset Inventory",
    module: "Inventory",
    assignedTo: "Rajesh Sharma",
    priority: "Low",
    status: "Pending",
    lastUpdated: "2 hours ago",
  },
  {
    id: "TASK-105",
    title: "Approve Hall Tickets Release for ECE Dept",
    module: "Examinations",
    assignedTo: "Dr. P. V. Ramana",
    priority: "High",
    status: "Under Review",
    lastUpdated: "3 hours ago",
  },
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "USR-001", name: "Dr. S. K. Gupta", email: "hod.cse@college.com", role: "hod", department: "Computer Science", status: "Active", dateJoined: "2022-01-15" },
  { id: "USR-002", name: "Dr. P. V. Ramana", email: "exam@college.com", role: "staff", department: "Exam Cell", status: "Active", dateJoined: "2021-08-10" },
  { id: "USR-003", name: "Ramesh Agarwal", email: "accounts@college.com", role: "staff", department: "Finance", status: "Active", dateJoined: "2023-03-01" },
  { id: "USR-004", name: "Rajesh Sharma", email: "admin@college.com", role: "admin", department: "Operations", status: "Active", dateJoined: "2020-05-20" },
  { id: "USR-005", name: "K. Sai Teja", email: "student@college.com", role: "student", department: "Computer Science", status: "Active", dateJoined: "2024-08-01" },
  { id: "USR-006", name: "Priya Sharma", email: "priya.faculty@college.com", role: "staff", department: "Computer Science", status: "Inactive", dateJoined: "2024-02-14" },
  { id: "USR-007", name: "David Miller", email: "david.recruiter@google.com", role: "external-user", department: "Placements", status: "Active", dateJoined: "2025-11-05" },
];

export const MOCK_ADMIN_DEPARTMENTS: AdminDepartment[] = [
  { id: "DEPT-CSE", name: "Computer Science & Engineering", code: "CSE", hodName: "Dr. S. K. Gupta", facultyCount: 28, studentCount: 512, status: "Active" },
  { id: "DEPT-ECE", name: "Electronics & Communication Eng", code: "ECE", hodName: "Dr. M. N. Rao", facultyCount: 22, studentCount: 420, status: "Active" },
  { id: "DEPT-EEE", name: "Electrical & Electronics Eng", code: "EEE", hodName: "Dr. Meenakshi S.", facultyCount: 18, studentCount: 380, status: "Active" },
  { id: "DEPT-ME", name: "Mechanical Engineering", code: "ME", hodName: "Dr. V. K. Murthy", facultyCount: 16, studentCount: 340, status: "Under Review" },
  { id: "DEPT-CIVIL", name: "Civil Engineering", code: "Civil", hodName: "Prof. K. V. Rao", facultyCount: 15, studentCount: 310, status: "Active" },
  { id: "DEPT-MBA", name: "Master of Business Administration", code: "MBA", hodName: "Dr. Ananya Roy", facultyCount: 14, studentCount: 260, status: "Active" },
];

export const MOCK_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  { id: "LOG-901", user: "Rajesh Sharma (Admin)", action: "Updated Role Permissions", module: "RBAC Engine", ipAddress: "192.168.1.45", timestamp: "2026-08-01 02:15 PM" },
  { id: "LOG-902", user: "Dr. S. K. Gupta (HOD)", action: "Approved Attendance Override", module: "Attendance", ipAddress: "192.168.1.88", timestamp: "2026-08-01 01:50 PM" },
  { id: "LOG-903", user: "Ramesh Agarwal (Finance)", action: "Generated Fee Collection Summary", module: "Finance", ipAddress: "192.168.1.102", timestamp: "2026-08-01 11:30 AM" },
  { id: "LOG-904", user: "Dr. P. V. Ramana (Exam)", action: "Published Sem-6 Result Gazette", module: "Examinations", ipAddress: "192.168.1.15", timestamp: "2026-07-31 05:00 PM" },
];

export const MOCK_ADMIN_REPORTS: AdminReportConfig[] = [
  { id: "REP-101", title: "Monthly Student Roster & Attendance Summary", category: "Academic", format: "PDF", lastGenerated: "2026-08-01" },
  { id: "REP-102", title: "Daily Fee Collections & Outstanding Dues", category: "Financial", format: "XLSX", lastGenerated: "2026-08-01" },
  { id: "REP-103", title: "NAAC 7 Criteria Audit Readiness Report", category: "Compliance", format: "PDF", lastGenerated: "2026-07-28" },
  { id: "REP-104", title: "Inventory Asset Count & Maintenance Log", category: "Operations", format: "CSV", lastGenerated: "2026-07-25" },
];

export const MOCK_ADMIN_SETTINGS: AdminSettingsConfig = {
  moduleToggles: {
    admission: true,
    academics: true,
    examination: true,
    finance: true,
    inventory: true,
    library: true,
    hostel: true,
    transport: true,
  },
  securityPolicies: {
    mfaRequired: true,
    sessionTimeoutMinutes: 30,
    passwordExpirationDays: 90,
  },
  notificationRules: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
  },
};

// QUERY FUNCTIONS
export function fetchAdminKpiConfigs(): AdminKpiConfig[] {
  return MOCK_ADMIN_KPI_CONFIGS;
}

export function fetchAssignedModules(): AdminModuleTile[] {
  return MOCK_ASSIGNED_MODULES;
}

export function fetchAdminOperations(
  searchQuery: string = "",
  statusFilter: string = "All Statuses",
  moduleFilter: string = "All Modules",
): AdminOperationTask[] {
  return MOCK_ADMIN_TASKS.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All Statuses" || task.status === statusFilter;
    const matchesModule = moduleFilter === "All Modules" || task.module === moduleFilter;

    return matchesSearch && matchesStatus && matchesModule;
  });
}

export function fetchAdminUsers(
  searchQuery: string = "",
  roleFilter: string = "All Roles",
  deptFilter: string = "All Departments",
  page: number = 1,
  pageSize: number = 5,
  sortKey: keyof AdminUser = "name",
  sortOrder: "asc" | "desc" = "asc",
): PaginatedResult<AdminUser> {
  const filtered = MOCK_ADMIN_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchesDept = deptFilter === "All Departments" || u.department === deptFilter;

    return matchesSearch && matchesRole && matchesDept;
  });

  filtered.sort((a, b) => {
    const valA = String(a[sortKey]).toLowerCase();
    const valB = String(b[sortKey]).toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function fetchAdminDepartments(
  searchQuery: string = "",
  statusFilter: string = "All Statuses",
  page: number = 1,
  pageSize: number = 5,
): PaginatedResult<AdminDepartment> {
  const filtered = MOCK_ADMIN_DEPARTMENTS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All Statuses" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function fetchAdminAuditLogs(
  searchQuery: string = "",
  actionFilter: string = "All Actions",
  page: number = 1,
  pageSize: number = 5,
): PaginatedResult<AdminAuditLog> {
  const filtered = MOCK_ADMIN_AUDIT_LOGS.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "All Actions" || l.action.includes(actionFilter);

    return matchesSearch && matchesAction;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function fetchConfigurableReports(categoryFilter: string = "All Categories"): AdminReportConfig[] {
  return MOCK_ADMIN_REPORTS.filter(
    (r) => categoryFilter === "All Categories" || r.category === categoryFilter,
  );
}

export function fetchAdminSettings(): AdminSettingsConfig {
  return MOCK_ADMIN_SETTINGS;
}
