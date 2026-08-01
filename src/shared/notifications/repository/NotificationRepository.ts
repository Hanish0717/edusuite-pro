import type { ApiResponse } from "@/shared/types/api.types";
import type { Notification } from "../types/NotificationTypes";
import notificationsData from "../data/notifications.json";

export interface INotificationRepository {
  getNotifications(role: string, collegeId?: string): Promise<ApiResponse<Notification[]>>;
  markAsRead(id: string): Promise<ApiResponse<boolean>>;
  updateStatus(id: string, status: Notification["status"]): Promise<ApiResponse<boolean>>;
  createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at">
  ): Promise<ApiResponse<Notification>>;
}

let dbNotifications: Notification[] = [...(notificationsData as any[])];

export class MockNotificationRepository implements INotificationRepository {
  async getNotifications(role: string, collegeId: string = "GMR"): Promise<ApiResponse<Notification[]>> {
    const normRole = role.replace(/_/g, "-");
    const list = dbNotifications.filter(
      (n) =>
        (n.target_role === role || n.target_role === normRole) &&
        n.college_id === collegeId &&
        n.status !== "deleted"
    );
    return { success: true, data: list };
  }

  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    return this.updateStatus(id, "read");
  }

  async updateStatus(id: string, status: Notification["status"]): Promise<ApiResponse<boolean>> {
    const match = dbNotifications.find((x) => x.id === id);
    if (match) {
      match.status = status;
      match.updated_at = new Date().toISOString();
      return { success: true, data: true };
    }
    return { success: false, data: false, error: "Notification not found" };
  }

  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at">
  ): Promise<ApiResponse<Notification>> {
    const delivery: Record<string, boolean> = {};
    notification.channels.forEach((ch) => {
      delivery[ch] = true;
    });

    const now = new Date().toISOString();
    const newNotif: Notification = {
      ...notification,
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "unread",
      schema_version: "1.0",
      delivery_status: delivery,
      created_at: now,
      updated_at: now,
    };

    dbNotifications.unshift(newNotif);
    return { success: true, data: newNotif };
  }
}

export class SupabaseNotificationRepository implements INotificationRepository {
  async getNotifications(role: string, collegeId?: string): Promise<ApiResponse<Notification[]>> {
    return { success: true, data: [] };
  }
  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
  async updateStatus(id: string, status: Notification["status"]): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at">
  ): Promise<ApiResponse<Notification>> {
    const now = new Date().toISOString();
    return {
      success: true,
      data: {
        ...notification,
        id: "NOTIF-DB",
        status: "unread",
        schema_version: "1.0",
        delivery_status: {},
        created_at: now,
        updated_at: now,
      },
    };
  }
}

const ACTIVE_DRIVER: "mock" | "supabase" = "mock";

export const notificationRepository: INotificationRepository =
  ACTIVE_DRIVER === "mock"
    ? new MockNotificationRepository()
    : new SupabaseNotificationRepository();

export default notificationRepository;
