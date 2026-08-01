import { api } from "../services/api";
import type { AITriggerNotification } from "../types";

export interface INotificationsRepository {
  getNotifications(): Promise<AITriggerNotification[]>;
  triggerManualNotification(
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ): Promise<AITriggerNotification>;
}

export class MockNotificationsRepository implements INotificationsRepository {
  getNotifications(): Promise<AITriggerNotification[]> {
    return api.get<AITriggerNotification[]>("/notifications/list");
  }

  triggerManualNotification(
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

const ACTIVE_IMPL = "mock";

export const notificationsRepository: INotificationsRepository =
  ACTIVE_IMPL === "mock" ? new MockNotificationsRepository() : new MockNotificationsRepository();

export default notificationsRepository;
