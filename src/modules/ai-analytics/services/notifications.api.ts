import { api } from "./api";
import type { AITriggerNotification } from "../types";

export class NotificationsApi {
  static getNotifications(): Promise<AITriggerNotification[]> {
    return api.get<AITriggerNotification[]>("/notifications/list");
  }

  static triggerManualNotification(
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ): Promise<AITriggerNotification> {
    return api.post<AITriggerNotification>("/notifications/trigger", {
      studentId,
      studentName,
      triggerType,
      channel,
      recipient,
      message,
    });
  }
}
