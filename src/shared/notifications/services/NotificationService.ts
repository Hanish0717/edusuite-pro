import { toast } from "sonner";
import { notificationRepository } from "../repository/NotificationRepository";
import { NotificationEngine } from "../engine/NotificationEngine";
import { NotificationAudit } from "../engine/NotificationAudit";
import type { Notification } from "../types/NotificationTypes";
import { eventBus } from "@/shared/services/eventBus";

class NotificationService {
  constructor() {
    eventBus.on("notification:create", async (payload: any) => {
      try {
        await this.notify(payload);
      } catch (err) {
        console.error("[NotificationService] Event subscription dispatch failed:", err);
      }
    });
  }

  async getNotificationsForRole(role: string, collegeId: string = "GMR"): Promise<Notification[]> {
    const res = await notificationRepository.getNotifications(role, collegeId);
    return res.success ? res.data : [];
  }

  async markNotificationAsRead(id: string, userId: string = "system"): Promise<boolean> {
    const res = await notificationRepository.updateStatus(id, "read");
    if (res.success) {
      NotificationAudit.log(id, userId, "Read");
      return true;
    }
    return false;
  }

  async archiveNotification(id: string, userId: string = "system"): Promise<boolean> {
    const res = await notificationRepository.updateStatus(id, "archived");
    if (res.success) {
      NotificationAudit.log(id, userId, "Archived");
      return true;
    }
    return false;
  }

  async deleteNotification(id: string, userId: string = "system"): Promise<boolean> {
    const res = await notificationRepository.updateStatus(id, "deleted");
    if (res.success) {
      NotificationAudit.log(id, userId, "Deleted");
      return true;
    }
    return false;
  }

  async trackClick(id: string, userId: string = "system"): Promise<void> {
    NotificationAudit.log(id, userId, "Clicked");
  }

  async notify(params: {
    eventCode: string;
    collegeId: string;
    variables: Record<string, string>;
    entityId?: string;
    created_by?: string;
    expiresInDays?: number;
    metadata?: Record<string, any>;
  }): Promise<Notification[]> {
    const targetPayloads = NotificationEngine.evaluate(params);
    const createdNotifications: Notification[] = [];

    for (const payload of targetPayloads) {
      const res = await notificationRepository.createNotification(payload);
      if (res.success && res.data) {
        const notif = res.data;
        createdNotifications.push(notif);
        
        NotificationAudit.log(notif.id, params.created_by || "system", "Created");

        if (payload.channels.includes("dashboard")) {
          eventBus.emit("notification:new_added", notif);
        }
      }
    }

    const first = createdNotifications[0];
    if (first) {
      toast.success(`[Alert: ${first.title}]`, {
        description: first.message,
      });
    }

    return createdNotifications;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
