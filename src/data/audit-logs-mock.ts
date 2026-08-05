// ============================================================
// Audit Logs & Activity Tracking — Mock Data
// ============================================================

export type AuditStatus = "Success" | "Failed" | "Warning" | "Pending";
export type AuditPriority = "Low" | "Medium" | "High" | "Critical";

export type AuditModule =
  | "Dashboard"
  | "Department Management"
  | "Faculty Management"
  | "Subject Management"
  | "Course & Curriculum"
  | "Timetable"
  | "Attendance"
  | "Examinations"
  | "Results"
  | "Approval Center"
  | "Academic Calendar"
  | "Reports"
  | "Resource Management"
  | "Notifications"
  | "Settings";

export interface ChangeRecord {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  department: string;
  module: AuditModule;
  activity: string;
  description: string;
  status: AuditStatus;
  priority: AuditPriority;
  affectedRecord: string;
  ipAddress: string;
  device: string;
  browser: string;
  changeHistory: ChangeRecord[] | null;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  user: string;
  ipAddress: string;
  time: string;
  severity: "Critical" | "High" | "Medium";
  details: string;
}

export interface SystemHealthMetric {
  id: string;
  serviceName: string;
  status: "Operational" | "Optimal" | "Degraded";
  uptime: string;
  latency: string;
}

// ── 1. MASTER AUDIT LOGS ────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-8801",
    timestamp: "2026-08-04 11:20:45 AM",
    user: "Dr. S. R. Krishnan",
    role: "Academic Manager",
    department: "Academic Office",
    module: "Results",
    activity: "Publish Result",
    description: "Published Semester VI End-Sem Examination Results for CSE Department.",
    status: "Success",
    priority: "Critical",
    affectedRecord: "RESULT-BATCH-2026-CSE-SEM6",
    ipAddress: "192.168.1.104",
    device: "Windows 11 PC",
    browser: "Chrome 127.0",
    changeHistory: [
      { field: "Status", oldValue: "Approved", newValue: "Published" },
      { field: "Student Visibility", oldValue: "Hidden", newValue: "Public" },
    ],
  },
  {
    id: "LOG-8802",
    timestamp: "2026-08-04 10:45:12 AM",
    user: "Dr. Meera N.",
    role: "HOD CSE",
    department: "CSE",
    module: "Faculty Management",
    activity: "Assign Faculty",
    description: "Assigned Dr. K. Sai Teja to CS501 Computer Networks for Section A.",
    status: "Success",
    priority: "Medium",
    affectedRecord: "FAC-ALLOC-CS501-A",
    ipAddress: "192.168.1.145",
    device: "MacBook Pro M2",
    browser: "Safari 17.4",
    changeHistory: [
      { field: "Assigned Instructor", oldValue: "Unassigned", newValue: "Dr. K. Sai Teja" },
      { field: "Weekly Workload", oldValue: "12 Hours", newValue: "16 Hours" },
    ],
  },
  {
    id: "LOG-8803",
    timestamp: "2026-08-04 09:30:00 AM",
    user: "System Automator",
    role: "System Service",
    department: "IT Operations",
    module: "Notifications",
    activity: "Broadcast Notice",
    description: "Dispatched Mid-Semester Exam Schedule notification to 2,450 student accounts.",
    status: "Success",
    priority: "High",
    affectedRecord: "NOTIF-901",
    ipAddress: "10.0.0.1",
    device: "Server Daemon",
    browser: "Node.js Service Worker",
    changeHistory: null,
  },
  {
    id: "LOG-8804",
    timestamp: "2026-08-04 09:05:22 AM",
    user: "Prof. Rajesh V.",
    role: "Faculty Member",
    department: "ECE",
    module: "Attendance",
    activity: "Update Attendance",
    description: "Attempted backdated attendance correction for EC304 class on July 25.",
    status: "Warning",
    priority: "High",
    affectedRecord: "ATTND-EC304-JUL25",
    ipAddress: "192.168.2.88",
    device: "Windows 10 Laptop",
    browser: "Firefox 128.0",
    changeHistory: [
      { field: "Attendance Count", oldValue: "45 Present / 50", newValue: "48 Present / 50" },
    ],
  },
  {
    id: "LOG-8805",
    timestamp: "2026-08-03 05:15:30 PM",
    user: "Unknown User",
    role: "Guest / Unauthenticated",
    department: "External",
    module: "Settings",
    activity: "Modify Settings",
    description: "Failed administrative login attempt from unrecognized IP address.",
    status: "Failed",
    priority: "Critical",
    affectedRecord: "AUTH-LOGIN-ADMIN",
    ipAddress: "203.0.113.195",
    device: "Linux x86_64",
    browser: "Python Request Client",
    changeHistory: null,
  },
];

// ── 2. SECURITY EVENTS ───────────────────────────────────────
export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  { id: "SEC-101", eventType: "Failed Login Attempt", user: "admin_temp", ipAddress: "203.0.113.195", time: "2026-08-03 05:15 PM", severity: "Critical", details: "3 invalid password attempts for super-admin portal." },
  { id: "SEC-102", eventType: "Permission Denied", user: "fac_user_88", ipAddress: "192.168.2.88", time: "2026-08-04 09:04 AM", severity: "High", details: "Faculty user attempted to publish grade memo without approval." },
  { id: "SEC-103", eventType: "Critical Settings Change", user: "Dr. S. R. Krishnan", ipAddress: "192.168.1.104", time: "2026-08-02 02:30 PM", severity: "Medium", details: "Modified minimum attendance eligibility threshold from 70% to 75%." },
];

// ── 3. SYSTEM HEALTH METRICS ─────────────────────────────────
export const MOCK_SYSTEM_HEALTH: SystemHealthMetric[] = [
  { id: "h1", serviceName: "Core ERP Database", status: "Operational", uptime: "99.98%", latency: "12ms" },
  { id: "h2", serviceName: "Audit Log Streaming Pipeline", status: "Optimal", uptime: "100%", latency: "4ms" },
  { id: "h3", serviceName: "Notification Delivery Gateway", status: "Operational", uptime: "99.95%", latency: "45ms" },
  { id: "h4", serviceName: "Authentication Auth0 / JWT", status: "Optimal", uptime: "99.99%", latency: "18ms" },
];

// ── 4. ANALYTICS DATASETS ─────────────────────────────────────
export const MODULE_USAGE_CHART = [
  { name: "Results", Activity: 340 },
  { name: "Attendance", Activity: 520 },
  { name: "Faculty", Activity: 280 },
  { name: "Timetable", Activity: 410 },
  { name: "Curriculum", Activity: 190 },
];

export const STATUS_BREAKDOWN_CHART = [
  { name: "Success", value: 1450 },
  { name: "Warning", value: 120 },
  { name: "Failed", value: 35 },
  { name: "Pending", value: 45 },
];
