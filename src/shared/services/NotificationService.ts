import { toast } from "sonner";
import { notificationRepository } from "../repositories/notification.repository";
import type { Notification } from "../types/notification.types";
import { eventBus } from "./eventBus";

class NotificationService {
  constructor() {
    // Decoupled Event-based subscriber
    eventBus.on("notification:create", async (payload: any) => {
      try {
        await this.dispatch(payload);
      } catch (err) {
        console.error("[NotificationService] Event subscription dispatch failed:", err);
      }
    });
  }

  async getNotificationsForRole(role: string, collegeId: string = "GMR"): Promise<Notification[]> {
    const res = await notificationRepository.getNotifications(role, collegeId);
    return res.success ? res.data : [];
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const res = await notificationRepository.markAsRead(id);
    return res.success ? res.data : false;
  }

  async dispatch(
    payload: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status">
  ): Promise<Notification | null> {
    const res = await notificationRepository.createNotification(payload);
    
    if (res.success && res.data) {
      toast.success(`[New Alert] ${payload.title}`, {
        description: payload.message,
      });
      // Inform listeners (like the Topbar) that a new notification is ready
      eventBus.emit("notification:new_added", res.data);
      return res.data;
    }
    return null;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
