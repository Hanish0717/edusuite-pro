import { toast } from "sonner";
import { notificationRepository } from "../repositories/notification.repository";
import type { Notification } from "../types/notification.types";

class NotificationService {
  async getNotificationsForRole(role: string): Promise<Notification[]> {
    const res = await notificationRepository.getNotifications(role);
    return res.success ? res.data : [];
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const res = await notificationRepository.markAsRead(id);
    return res.success ? res.data : false;
  }

  async dispatch(
    payload: Omit<Notification, "id" | "created_at" | "is_read" | "created_by"> & { created_by?: string }
  ): Promise<Notification | null> {
    const res = await notificationRepository.createNotification({
      ...payload,
      created_by: payload.created_by || "System",
    });
    
    if (res.success) {
      toast.success(`New ${payload.type} alert sent to ${payload.target_role}: "${payload.title}"`);
      return res.data;
    }
    return null;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
