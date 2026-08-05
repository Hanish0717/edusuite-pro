// ============================================================
// Notifications & Communication Center — Mock Data
// ============================================================

export type NotificationCategory =
  | "Academic Announcement"
  | "Attendance Alert"
  | "Low Attendance Warning"
  | "Examination Notification"
  | "Result Publication"
  | "Timetable Update"
  | "Holiday Notice"
  | "Workshop"
  | "Seminar"
  | "Guest Lecture"
  | "Placement Notification"
  | "Project Review"
  | "Assignment Reminder"
  | "Fee Reminder"
  | "System Maintenance"
  | "Emergency Alert"
  | "General Circular";

export type TargetAudience =
  | "Entire Institution"
  | "Department"
  | "Program"
  | "Semester"
  | "Section"
  | "Students"
  | "Faculty"
  | "Non-Teaching Staff"
  | "HODs"
  | "Parents"
  | "Selected Users";

export type NotificationPriority = "Low" | "Normal" | "High" | "Urgent" | "Emergency";
export type NotificationStatus = "Draft" | "Scheduled" | "Sending" | "Delivered" | "Failed" | "Archived";
export type DeliveryMethod = "In-App Notification" | "Email" | "SMS" | "Push Notification" | "WhatsApp" | "Multiple Channels";

export interface AcademicNotification {
  id: string;
  title: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  targetAudience: TargetAudience;
  department: string;
  program: string;
  semester: string;
  message: string;
  deliveryMethod: DeliveryMethod;
  createdBy: string;
  createdAt: string;
  scheduledAt: string | null;
  status: NotificationStatus;
  deliveryStatus: string;
  readCount: number;
  failedCount: number;
  totalRecipients: number;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  title: string;
  message: string;
  lastUsed: string;
}

export interface ScheduledItem {
  id: string;
  title: string;
  category: NotificationCategory;
  targetAudience: TargetAudience;
  scheduledTime: string;
  channel: DeliveryMethod;
  status: "Scheduled" | "Queued" | "Sending";
}

export interface ActivityLog {
  id: string;
  action: string;
  time: string;
  type: "info" | "success" | "warning" | "alert";
}

// ── 1. MASTER NOTIFICATIONS DIRECTORY ────────────────────────
export const MOCK_NOTIFICATIONS: AcademicNotification[] = [
  {
    id: "NOTIF-901",
    title: "Mid-Semester Examination Schedule — Autumn 2026",
    category: "Examination Notification",
    priority: "High",
    targetAudience: "Entire Institution",
    department: "All Depts",
    program: "B.Tech & M.Tech",
    semester: "All Semesters",
    message: "The official timetable for Mid-Semester Examinations Autumn 2026 has been published. All hall tickets are available for download.",
    deliveryMethod: "Multiple Channels",
    createdBy: "Dr. S. R. Krishnan (Academic Manager)",
    createdAt: "2026-08-04 09:30 AM",
    scheduledAt: null,
    status: "Delivered",
    deliveryStatus: "99.2% Success (2,430 / 2,450)",
    readCount: 2180,
    failedCount: 20,
    totalRecipients: 2450,
  },
  {
    id: "NOTIF-902",
    title: "Critical Low Attendance Alert — Semester VI Defaulters",
    category: "Low Attendance Warning",
    priority: "Urgent",
    targetAudience: "Students",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester VI",
    message: "Warning: Your cumulative attendance is below 75%. Please meet your faculty advisor immediately to avoid examination debarment.",
    deliveryMethod: "Email",
    createdBy: "Academic Manager Office",
    createdAt: "2026-08-03 04:15 PM",
    scheduledAt: null,
    status: "Delivered",
    deliveryStatus: "100% Success (42 / 42)",
    readCount: 39,
    failedCount: 0,
    totalRecipients: 42,
  },
  {
    id: "NOTIF-903",
    title: "Independence Day Campus Holiday Notice",
    category: "Holiday Notice",
    priority: "Normal",
    targetAudience: "Entire Institution",
    department: "All Depts",
    program: "All Programs",
    semester: "All Semesters",
    message: "The institution will remain closed on 15th August 2026 on account of Independence Day. Flag hoisting ceremony commences at 08:30 AM.",
    deliveryMethod: "In-App Notification",
    createdBy: "Registrar Office",
    createdAt: "2026-08-04 11:00 AM",
    scheduledAt: "2026-08-14 08:00 AM",
    status: "Scheduled",
    deliveryStatus: "Queued for Aug 14",
    readCount: 0,
    failedCount: 0,
    totalRecipients: 3200,
  },
  {
    id: "NOTIF-904",
    title: "TCS & Wipro Campus Placement Drive Registration",
    category: "Placement Notification",
    priority: "High",
    targetAudience: "Students",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester VII",
    message: "Mandatory registration for TCS & Wipro joint placement drive closes on Friday at 05:00 PM. Update your academic resumes.",
    deliveryMethod: "WhatsApp",
    createdBy: "Placement Cell Manager",
    createdAt: "2026-08-02 02:00 PM",
    scheduledAt: null,
    status: "Delivered",
    deliveryStatus: "98.5% Success (480 / 487)",
    readCount: 462,
    failedCount: 7,
    totalRecipients: 487,
  },
  {
    id: "NOTIF-905",
    title: "ERP Server Maintenance & Downtime Advisory",
    category: "System Maintenance",
    priority: "Low",
    targetAudience: "Entire Institution",
    department: "All Depts",
    program: "All Programs",
    semester: "All Semesters",
    message: "The ERP portal will undergo scheduled maintenance tonight from 11:00 PM to 03:00 AM. Services will be briefly unavailable.",
    deliveryMethod: "Push Notification",
    createdBy: "IT Systems Admin",
    createdAt: "2026-08-04 03:00 PM",
    scheduledAt: null,
    status: "Delivered",
    deliveryStatus: "99.8% Success",
    readCount: 1540,
    failedCount: 5,
    totalRecipients: 3100,
  },
];

// ── 2. COMMUNICATION TEMPLATES ──────────────────────────────
export const MOCK_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "TMPL-01",
    name: "Attendance Shortage Debarment Warning",
    category: "Low Attendance Warning",
    title: "Official Notice: Attendance Shortage Debarment Risk",
    message: "Dear Student, your attendance in [Subject Name] stands at [Attendance %], which is below the mandatory 75% requirement. Contact HOD immediately.",
    lastUsed: "2026-08-03",
  },
  {
    id: "TMPL-02",
    name: "Examination Schedule Announcement",
    category: "Examination Notification",
    title: "Schedule Released: [Exam Name] [Academic Term]",
    message: "The detailed date sheet for [Exam Name] has been uploaded. Check room allocations and seating plans on the student portal.",
    lastUsed: "2026-08-04",
  },
  {
    id: "TMPL-03",
    name: "End-Semester Result Publication Notice",
    category: "Result Publication",
    title: "Results Published: [Program Name] [Semester]",
    message: "Results for [Semester] examinations held in [Month Year] are now published. Access your digital SGPA memo on the portal.",
    lastUsed: "2026-07-28",
  },
  {
    id: "TMPL-04",
    name: "Campus Emergency & Weather Advisory",
    category: "Emergency Alert",
    title: "URGENT: Campus Closure & Online Classes Advisory",
    message: "Due to heavy rainfall alerts, all physical classes for tomorrow stand suspended. Online sessions will proceed as per timetable.",
    lastUsed: "2026-07-15",
  },
];

// ── 3. SCHEDULED NOTIFICATIONS ──────────────────────────────
export const MOCK_SCHEDULED_ITEMS: ScheduledItem[] = [
  {
    id: "SCH-101",
    title: "Independence Day Campus Flag Hoisting Circular",
    category: "Holiday Notice",
    targetAudience: "Entire Institution",
    scheduledTime: "2026-08-14 08:00 AM",
    channel: "Multiple Channels",
    status: "Scheduled",
  },
  {
    id: "SCH-102",
    title: "AI Workshop Online Registration Reminder",
    category: "Workshop",
    targetAudience: "Students",
    scheduledTime: "2026-08-12 10:00 AM",
    channel: "Email",
    status: "Queued",
  },
  {
    id: "SCH-103",
    title: "Faculty Academic Review Committee Meeting Notice",
    category: "Academic Announcement",
    targetAudience: "Faculty",
    scheduledTime: "2026-08-08 09:00 AM",
    channel: "In-App Notification",
    status: "Scheduled",
  },
];

// ── 4. RECENT ACTIVITY LOGS ──────────────────────────────────
export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: "act-1", action: "Attendance warning circular dispatched to 42 defaulter students.", time: "10 mins ago", type: "warning" },
  { id: "act-2", action: "Mid-Semester exam timetable notification delivered to 2,430 portal feeds.", time: "1 hour ago", type: "success" },
  { id: "act-3", action: "Placement drive alert scheduled for Aug 12, 10:00 AM.", time: "3 hours ago", type: "info" },
  { id: "act-4", action: "Emergency alert sent for CSE Lab power outage.", time: "Yesterday", type: "alert" },
];

// ── 5. ANALYTICS DATASETS ─────────────────────────────────────
export const CATEGORY_DISTRIBUTION_CHART = [
  { name: "Academic", value: 38 },
  { name: "Attendance", value: 24 },
  { name: "Exams", value: 18 },
  { name: "Placements", value: 12 },
  { name: "System/Holiday", value: 8 },
];

export const DEPARTMENT_NOTIFICATIONS_CHART = [
  { name: "CSE", Notifications: 145 },
  { name: "ECE", Notifications: 110 },
  { name: "ME", Notifications: 85 },
  { name: "AI&DS", Notifications: 130 },
];
