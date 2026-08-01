export interface NotificationAction {
  label: string;
  actionType: "link" | "api" | "approve" | "reject";
  route?: string;
  apiEndpoint?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Information" | "Success" | "Warning" | "Error" | "Reminder" | "Approval" | "Announcement" | "Emergency";
  priority: "Critical" | "High" | "Medium" | "Low" | "Info";
  target_role: string;
  target_user?: string;
  module: string;
  entity?: string;
  entityId?: string;
  status: "unread" | "read" | "archived" | "deleted";
  created_at: string;
  created_by: string;
  expires_at: string | null;
  college_id: string;
  category: "Academic" | "Finance" | "Library" | "Placement" | "Hostel" | "Administration" | "AI" | "Emergency";
  schema_version: string;
  route?: string;
  actions?: NotificationAction[];
  channels: ("dashboard" | "email" | "sms" | "push")[];
  delivery_status: Record<string, boolean>;
  metadata?: Record<string, any>;
}

export default Notification;
