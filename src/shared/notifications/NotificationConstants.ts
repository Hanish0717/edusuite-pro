export const NotificationPriority = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  INFO: "Info",
} as const;

export const NotificationChannel = {
  DASHBOARD: "dashboard",
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
} as const;

export const NotificationType = {
  INFORMATION: "Information",
  SUCCESS: "Success",
  WARNING: "Warning",
  ERROR: "Error",
  REMINDER: "Reminder",
  APPROVAL: "Approval",
  ANNOUNCEMENT: "Announcement",
  EMERGENCY: "Emergency",
} as const;

export const NotificationStatus = {
  UNREAD: "unread",
  READ: "read",
  ARCHIVED: "archived",
  DELETED: "deleted",
} as const;

export const NotificationCategory = {
  ACADEMIC: "Academic",
  FINANCE: "Finance",
  LIBRARY: "Library",
  PLACEMENT: "Placement",
  HOSTEL: "Hostel",
  ADMINISTRATION: "Administration",
  AI: "AI",
  EMERGENCY: "Emergency",
} as const;

export const AuditAction = {
  CREATED: "Created",
  DELIVERED: "Delivered",
  VIEWED: "Viewed",
  READ: "Read",
  CLICKED: "Clicked",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
  DELETED: "Deleted",
} as const;
