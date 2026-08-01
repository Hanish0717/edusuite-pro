import type { ApiResponse } from "../types/api.types";
import type { Notification } from "../types/notification.types";
import notificationsData from "../mock-data/notifications.json";

export interface INotificationRepository {
  getNotifications(role: string, collegeId?: string): Promise<ApiResponse<Notification[]>>;
  markAsRead(id: string): Promise<ApiResponse<boolean>>;
  createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status">
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
    const match = dbNotifications.find((x) => x.id === id);
    if (match) {
      match.status = "read";
      return { success: true, data: true };
    }
    return { success: false, data: false, error: "Notification not found" };
  }

  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status">
  ): Promise<ApiResponse<Notification>> {
    const delivery: Record<string, boolean> = {};
    notification.channels.forEach((ch) => {
      delivery[ch] = true;
    });

    const newNotif: Notification = {
      ...notification,
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "unread",
      schema_version: "1.0",
      delivery_status: delivery,
      created_at: new Date().toISOString(),
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
  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status">
  ): Promise<ApiResponse<Notification>> {
    return {
      success: true,
      data: {
        ...notification,
        id: "NOTIF-DB",
        status: "unread",
        schema_version: "1.0",
        delivery_status: {},
        created_at: new Date().toISOString(),
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
