import { notificationRules } from "../rules/NotificationRules";
import { NotificationFactory } from "./NotificationFactory";
import type { Notification } from "../types/NotificationTypes";

export class NotificationEngine {
  static evaluate(params: {
    eventCode: string;
    collegeId: string;
    variables: Record<string, string>;
    entityId?: string;
    created_by?: string;
    expiresInDays?: number;
    metadata?: Record<string, any>;
  }): Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at">[] {
    const rule = notificationRules[params.eventCode];
    if (!rule) {
      console.warn(`[NotificationEngine] No workflow rule defined for trigger event: "${params.eventCode}"`);
      return [];
    }

    const builtNotifications: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at">[] = [];

    rule.recipients.forEach((recipient) => {
      try {
        const factoryParams: Parameters<typeof NotificationFactory.createFromTemplate>[0] = {
          templateCode: params.eventCode,
          recipientRole: recipient.role,
          collegeId: params.collegeId,
          variables: params.variables,
          channels: recipient.channels,
        };
        if (params.created_by !== undefined) factoryParams.created_by = params.created_by;
        if (params.entityId !== undefined) factoryParams.entityId = params.entityId;
        if (params.expiresInDays !== undefined) factoryParams.expiresInDays = params.expiresInDays;
        if (params.metadata !== undefined) factoryParams.metadata = params.metadata;

        const payload = NotificationFactory.createFromTemplate(factoryParams);

        if (recipient.overridePriority) {
          payload.priority = recipient.overridePriority;
        }

        builtNotifications.push(payload);
      } catch (err) {
        console.error(`[NotificationEngine] Failed to build notification for role "${recipient.role}" under event "${params.eventCode}":`, err);
      }
    });

    return builtNotifications;
  }
}

export default NotificationEngine;
