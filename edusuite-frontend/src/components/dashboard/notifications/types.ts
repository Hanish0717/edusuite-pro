export type NotificationPriority = "High" | "Medium" | "Low";

export type NotificationCategory =
  | "Assignments"
  | "Attendance"
  | "Examinations"
  | "Leave"
  | "Research"
  | "Students"
  | "System"
  | "Announcements"
  | "Timetable"
  | "Payroll"
  | "Reports";

export type ActionType =
  | "view_assignment"
  | "take_attendance"
  | "enter_marks"
  | "view_timetable"
  | "review_leave"
  | "open_research"
  | "view_announcement"
  | "download"
  | "custom";

export interface NotificationAction {
  label: string;
  type: ActionType;
  href?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  isRead: boolean;
  isActionRequired: boolean;
  department?: string;
  subject?: string;
  section?: string;
  studentName?: string;
  action?: NotificationAction;
}

export interface NotificationSummaryStats {
  unreadCount: number;
  highPriorityCount: number;
  todayCount: number;
  actionRequiredCount: number;
}

export interface NotificationSettingsState {
  emailAlerts: boolean;
  pushNotifications: boolean;
  categories: Record<NotificationCategory, boolean>;
}
