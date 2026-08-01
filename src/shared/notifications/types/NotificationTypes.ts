export interface NotificationAction {
  label: string;
  actionType: "link" | "api" | "approve" | "reject";
  route?: string;
  apiEndpoint?: string;
}

export interface Notification {
  id: string;
  college_id: string;
  title: string;
  message: string;
  template: string; // template code/id
  type: "Information" | "Success" | "Warning" | "Error" | "Reminder" | "Approval" | "Announcement" | "Emergency";
  priority: "Critical" | "High" | "Medium" | "Low" | "Info";
  module: string;
  target_role: string; // target recipient role
  target_user?: string; // target user ID (optional)
  entity?: string; // e.g. "Student", "LeaveRequest"
  entity_id?: string;
  route?: string;
  status: "unread" | "read" | "archived" | "deleted";
  delivery_status: Record<string, boolean>; // e.g. { dashboard: true, email: false }
  channels: ("dashboard" | "email" | "sms" | "push")[];
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  schema_version: string;
}

export interface NotificationTemplate {
  code: string;
  title: string;
  messageTemplate: string;
  type: Notification["type"];
  priority: Notification["priority"];
  module: string;
  category: string;
  routeTemplate?: string;
  defaultActions?: NotificationAction[];
}

export interface NotificationRuleRecipient {
  role: string;
  channels: Notification["channels"];
  overridePriority?: Notification["priority"];
}

export interface NotificationRule {
  triggerCode: string;
  recipients: NotificationRuleRecipient[];
}

export interface NotificationAuditLog {
  id: string;
  notification_id: string;
  user_id: string;
  action: "Created" | "Delivered" | "Viewed" | "Read" | "Clicked" | "Approved" | "Rejected" | "Archived" | "Deleted";
  created_at: string;
  metadata?: Record<string, any>;
}
