import type { AITriggerNotification } from "../types";
import type { ApiResponse } from "@/shared/types/api.types";
import { NotificationsApi } from "../services/api/notifications.api";

export interface INotificationsRepository {
  getNotifications(): Promise<ApiResponse<AITriggerNotification[]>>;
  triggerManualNotification(
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ): Promise<ApiResponse<AITriggerNotification>>;
}

export class MockNotificationsRepository implements INotificationsRepository {
  async getNotifications(): Promise<ApiResponse<AITriggerNotification[]>> {
    try {
      const data = await NotificationsApi.getNotifications();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: [], error: err.message || "Failed to load notification logs" };
    }
  }

  async triggerManualNotification(
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ): Promise<ApiResponse<AITriggerNotification>> {
    try {
      const data = await NotificationsApi.triggerManualNotification(
        studentId,
        studentName,
        triggerType,
        channel,
        recipient,
        message
      );
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        data: {
          id: `NOTIF-${Date.now()}`,
          studentId,
          studentName,
          triggerType,
          channel,
          recipient,
          message,
          timestamp: new Date().toLocaleTimeString(),
          status: "Failed",
        },
        error: err.message,
      };
    }
  }
}

export class SupabaseNotificationsRepository implements INotificationsRepository {
  async getNotifications(): Promise<ApiResponse<AITriggerNotification[]>> {
    return { success: true, data: [] };
  }

  async triggerManualNotification(
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ): Promise<ApiResponse<AITriggerNotification>> {
    return {
      success: true,
      data: {
        id: "NOTIF-SUB",
        studentId,
        studentName,
        triggerType,
        channel,
        recipient,
        message,
        timestamp: new Date().toLocaleTimeString(),
        status: "Sent",
      },
    };
  }
}
