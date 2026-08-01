import { toast } from "sonner";

export interface LoggedNotification {
  id: string;
  studentId: string;
  studentName: string;
  triggerType: string;
  channel: "Email" | "SMS" | "In-App" | "All";
  recipient: "Student" | "Parent" | "Faculty" | "HOD" | "All";
  message: string;
  timestamp: string;
  status: "Sent" | "Failed" | "Pending";
}

class NotificationService {
  private logs: LoggedNotification[] = [];

  dispatch(payload: Omit<LoggedNotification, "id" | "timestamp" | "status">): Promise<LoggedNotification> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLog: LoggedNotification = {
          ...payload,
          id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toLocaleString(),
          status: "Sent",
        };
        this.logs.unshift(newLog);
        toast.success(`Notification sent via ${payload.channel} to ${payload.recipient}.`);
        resolve(newLog);
      }, 500);
    });
  }

  getLogs(): LoggedNotification[] {
    return this.logs;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
