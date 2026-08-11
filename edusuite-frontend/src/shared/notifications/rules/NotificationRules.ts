import type { NotificationRule } from "../types/NotificationTypes";

export const notificationRules: Record<string, NotificationRule> = {
  ATTENDANCE_LOW: {
    triggerCode: "ATTENDANCE_LOW",
    recipients: [
      { role: "student", channels: ["dashboard", "email"] },
      { role: "parent", channels: ["dashboard", "sms"] },
      { role: "faculty", channels: ["dashboard", "push"] },
      { role: "hod", channels: ["dashboard"] }
    ]
  },
  FEE_DUE: {
    triggerCode: "FEE_DUE",
    recipients: [
      { role: "student", channels: ["dashboard", "email"] },
      { role: "parent", channels: ["dashboard", "email", "sms"] },
      { role: "accounts", channels: ["dashboard"] }
    ]
  },
  LEAVE_APPROVAL: {
    triggerCode: "LEAVE_APPROVAL",
    recipients: [
      { role: "hod", channels: ["dashboard", "push"] }
    ]
  },
  CAMPUS_DRIVE: {
    triggerCode: "CAMPUS_DRIVE",
    recipients: [
      { role: "student", channels: ["dashboard", "email"] },
      { role: "placement", channels: ["dashboard"] }
    ]
  },
  BOOK_OVERDUE: {
    triggerCode: "BOOK_OVERDUE",
    recipients: [
      { role: "student", channels: ["dashboard", "sms"] },
      { role: "librarian", channels: ["dashboard"] }
    ]
  },
  AI_RISK_ALERT: {
    triggerCode: "AI_RISK_ALERT",
    recipients: [
      { role: "faculty", channels: ["dashboard", "push"] },
      { role: "hod", channels: ["dashboard"] }
    ]
  },
  BACKUP_FAILED: {
    triggerCode: "BACKUP_FAILED",
    recipients: [
      { role: "super-admin", channels: ["dashboard", "email", "push"] }
    ]
  },
  SECURITY_ALERT: {
    triggerCode: "SECURITY_ALERT",
    recipients: [
      { role: "admin", channels: ["dashboard", "email", "sms", "push"] }
    ]
  }
};

export default notificationRules;
