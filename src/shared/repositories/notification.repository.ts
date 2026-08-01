import type { ApiResponse } from "../types/api.types";
import type { Notification } from "../types/notification.types";

import superAdminNotifs from "../mock-data/notifications/super_admin.json";
import adminNotifs from "../mock-data/notifications/admin.json";
import studentNotifs from "../mock-data/notifications/student.json";
import facultyNotifs from "../mock-data/notifications/faculty.json";
import hodNotifs from "../mock-data/notifications/hod.json";
import parentNotifs from "../mock-data/notifications/parent.json";
import librarianNotifs from "../mock-data/notifications/librarian.json";
import placementNotifs from "../mock-data/notifications/placement.json";
import examCellNotifs from "../mock-data/notifications/exam_cell.json";
import accountsNotifs from "../mock-data/notifications/accounts.json";
import wardenNotifs from "../mock-data/notifications/warden.json";
import transportNotifs from "../mock-data/notifications/transport.json";

export interface INotificationRepository {
  getNotifications(role: string): Promise<ApiResponse<Notification[]>>;
  markAsRead(id: string): Promise<ApiResponse<boolean>>;
  createNotification(
    notification: Omit<Notification, "id" | "created_at" | "is_read">
  ): Promise<ApiResponse<Notification>>;
}

// In-memory state storage for mock changes (so read/unread toggle works in active session)
const dbState: Record<string, Notification[]> = {
  "super-admin": superAdminNotifs as any[],
  "super_admin": superAdminNotifs as any[],
  admin: adminNotifs as any[],
  student: studentNotifs as any[],
  faculty: facultyNotifs as any[],
  hod: hodNotifs as any[],
  parent: parentNotifs as any[],
  librarian: librarianNotifs as any[],
  placement: placementNotifs as any[],
  exam_cell: examCellNotifs as any[],
  accounts: accountsNotifs as any[],
  warden: wardenNotifs as any[],
  transport: transportNotifs as any[],
};

export class MockNotificationRepository implements INotificationRepository {
  async getNotifications(role: string): Promise<ApiResponse<Notification[]>> {
    const normRole = role.replace(/_/g, "-");
    let list = dbState[role] || dbState[normRole] || [];
    return { success: true, data: list };
  }

  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    let found = false;
    for (const role of Object.keys(dbState)) {
      const items = dbState[role] || [];
      const match = items.find((x) => x.id === id);
      if (match) {
        match.is_read = true;
        found = true;
      }
    }
    return { success: found, data: found };
  }

  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "is_read">
  ): Promise<ApiResponse<Notification>> {
    const newNotif: Notification = {
      ...notification,
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    
    // Insert into role array
    const roleKey = notification.target_role;
    if (!dbState[roleKey]) {
      dbState[roleKey] = [];
    }
    dbState[roleKey].unshift(newNotif);

    return { success: true, data: newNotif };
  }
}

export class SupabaseNotificationRepository implements INotificationRepository {
  async getNotifications(role: string): Promise<ApiResponse<Notification[]>> {
    return { success: true, data: [] };
  }
  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "is_read">
  ): Promise<ApiResponse<Notification>> {
    return {
      success: true,
      data: {
        ...notification,
        id: "NOTIF-DB",
        is_read: false,
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
