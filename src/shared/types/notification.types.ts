export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Information" | "Success" | "Warning" | "Error" | "Reminder" | "Approval" | "Announcement" | "Emergency";
  priority: "Low" | "Medium" | "High";
  target_role: string;
  target_user?: string;
  module: string;
  is_read: boolean;
  created_at: string;
  created_by: string;
}
export default Notification;
