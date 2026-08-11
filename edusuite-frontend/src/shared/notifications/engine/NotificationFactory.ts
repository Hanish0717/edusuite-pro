import type { Notification, NotificationAction } from "../types/NotificationTypes";
import { notificationTemplates } from "../templates/NotificationTemplates";

export class NotificationFactory {
  static createFromTemplate(params: {
    templateCode: string;
    recipientRole: string;
    collegeId: string;
    variables: Record<string, string>;
    channels: ("dashboard" | "email" | "sms" | "push")[];
    created_by?: string;
    entityId?: string;
    expiresInDays?: number;
    metadata?: Record<string, any>;
  }): Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at"> {
    const template = notificationTemplates[params.templateCode];
    if (!template) {
      throw new Error(`Notification template "${params.templateCode}" not found.`);
    }

    let title = template.title;
    let message = template.messageTemplate;
    let route = template.routeTemplate;

    // Substitute tokens in title, message, and routing links
    Object.entries(params.variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      title = title.replace(new RegExp(placeholder, "g"), value);
      message = message.replace(new RegExp(placeholder, "g"), value);
      if (route) {
        route = route.replace(new RegExp(placeholder, "g"), value);
      }
    });

    const actions: NotificationAction[] = (template.defaultActions || []).map((act) => {
      let actRoute = act.route;
      let actApi = act.apiEndpoint;
      
      Object.entries(params.variables).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        if (actRoute) actRoute = actRoute.replace(new RegExp(placeholder, "g"), value);
        if (actApi) actApi = actApi.replace(new RegExp(placeholder, "g"), value);
      });

      const newAct: NotificationAction = {
        label: act.label,
        actionType: act.actionType,
      };
      if (actRoute !== undefined) newAct.route = actRoute;
      if (actApi !== undefined) newAct.apiEndpoint = actApi;
      return newAct;
    });

    const expiresAt = params.expiresInDays 
      ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const payload: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status" | "updated_at"> = {
      college_id: params.collegeId,
      title,
      message,
      template: params.templateCode,
      type: template.type,
      priority: template.priority,
      module: template.module,
      target_role: params.recipientRole,
      channels: params.channels,
      actions,
      expires_at: expiresAt,
      created_by: params.created_by || "System",
      metadata: params.metadata || {},
    };

    if (params.entityId !== undefined) payload.entity_id = params.entityId;
    if (route !== undefined) payload.route = route;

    return payload;
  }
}

export default NotificationFactory;
