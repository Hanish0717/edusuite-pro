import type { NotificationTemplate } from "../types/NotificationTypes";

export const notificationTemplates: Record<string, NotificationTemplate> = {
  ATTENDANCE_LOW: {
    code: "ATTENDANCE_LOW",
    title: "Attendance Alert: Low Percentage",
    messageTemplate: "{studentName}'s attendance is {percentage}%, which is below the 75% threshold.",
    type: "Warning",
    priority: "High",
    module: "Attendance",
    category: "Academic",
    routeTemplate: "/attendance/student/{studentId}",
    defaultActions: [
      { label: "View Student", actionType: "link", route: "/attendance/student/{studentId}" }
    ]
  },
  FEE_DUE: {
    code: "FEE_DUE",
    title: "Semester Tuition Fee Due",
    messageTemplate: "Your tuition fee of {amount} is outstanding. Please clear by {dueDate}.",
    type: "Reminder",
    priority: "High",
    module: "Finance",
    category: "Finance",
    routeTemplate: "/finance/invoices",
    defaultActions: [
      { label: "Pay Now", actionType: "link", route: "/finance/pay" }
    ]
  },
  LEAVE_APPROVAL: {
    code: "LEAVE_APPROVAL",
    title: "Faculty Leave Approval Required",
    messageTemplate: "{facultyName} has requested causal leave for {date}.",
    type: "Approval",
    priority: "Medium",
    module: "Administration",
    category: "Administration",
    routeTemplate: "/admin/leaves",
    defaultActions: [
      { label: "Approve", actionType: "approve", apiEndpoint: "/api/v1/leaves/approve/{entityId}" },
      { label: "Reject", actionType: "reject", apiEndpoint: "/api/v1/leaves/reject/{entityId}" }
    ]
  },
  CAMPUS_DRIVE: {
    code: "CAMPUS_DRIVE",
    title: "New Placement Campus Drive",
    messageTemplate: "{companyName} campus recruitment drive is scheduled for {date}. Registration is open.",
    type: "Announcement",
    priority: "High",
    module: "Placement",
    category: "Placement",
    routeTemplate: "/placement/drives",
    defaultActions: [
      { label: "View Details", actionType: "link", route: "/placement/drives" }
    ]
  },
  BOOK_OVERDUE: {
    code: "BOOK_OVERDUE",
    title: "Library Book Overdue Alert",
    messageTemplate: "The book '{bookTitle}' issued on {issueDate} is overdue. Please return immediately.",
    type: "Warning",
    priority: "Medium",
    module: "Library",
    category: "Library",
    routeTemplate: "/library/books",
    defaultActions: [
      { label: "Renew Book", actionType: "link", route: "/library/books" }
    ]
  },
  AI_RISK_ALERT: {
    code: "AI_RISK_ALERT",
    title: "AI Risk Engine Flagged Student",
    messageTemplate: "AI analysis flagged {studentName} as high academic risk due to attendance and scores.",
    type: "Warning",
    priority: "High",
    module: "AI & Analytics",
    category: "AI",
    routeTemplate: "/ai-analytics/student-risk",
    defaultActions: [
      { label: "View Analysis", actionType: "link", route: "/ai-analytics/student-risk" }
    ]
  },
  BACKUP_FAILED: {
    code: "BACKUP_FAILED",
    title: "System Error: Backup Failed",
    messageTemplate: "Database backup failed at {time} on server node {nodeName}.",
    type: "Error",
    priority: "Critical",
    module: "System",
    category: "Emergency",
    routeTemplate: "/system/logs",
    defaultActions: [
      { label: "Retry Backup", actionType: "api", apiEndpoint: "/api/v1/system/backup/retry" }
    ]
  },
  SECURITY_ALERT: {
    code: "SECURITY_ALERT",
    title: "Security Alert: Malicious Login Attempts",
    messageTemplate: "Multiple failed login attempts detected on IP {ip} targeting {roleName} accounts.",
    type: "Emergency",
    priority: "Critical",
    module: "Security",
    category: "Emergency",
    routeTemplate: "/security/audit",
    defaultActions: [
      { label: "Block IP", actionType: "api", apiEndpoint: "/api/v1/security/block-ip" }
    ]
  }
};

export default notificationTemplates;
