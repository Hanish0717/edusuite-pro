import type { NotificationAuditLog } from "../types/NotificationTypes";

let auditDb: NotificationAuditLog[] = [];

export class NotificationAudit {
  static log(
    notificationId: string,
    userId: string,
    action: NotificationAuditLog["action"],
    metadata?: Record<string, any>
  ): void {
    const entry: NotificationAuditLog = {
      id: `AUDIT-${Math.floor(10000 + Math.random() * 90000)}`,
      notification_id: notificationId,
      user_id: userId,
      action,
      created_at: new Date().toISOString(),
    };
    if (metadata !== undefined) {
      entry.metadata = metadata;
    }
    auditDb.push(entry);
    console.log(`[NotificationAudit] [${action}] for Notif ${notificationId} by ${userId}`);
  }

  static getHistory(notificationId: string): NotificationAuditLog[] {
    return auditDb.filter((log) => log.notification_id === notificationId);
  }

  static getLogs(): NotificationAuditLog[] {
    return auditDb;
  }
}

export default NotificationAudit;
