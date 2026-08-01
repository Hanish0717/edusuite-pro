import type { Notification, NotificationAction } from "../types/notification.types";

export class NotificationFactory {
  static createAttendanceAlert(
    studentId: string,
    studentName: string,
    percentage: number,
    role: string = "student",
    collegeId: string = "GMR"
  ): Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status"> {
    return {
      title: "Attendance Alert: Low Percentage",
      message: `${studentName}'s attendance is ${percentage}%, which is below the 75% threshold.`,
      type: "Warning",
      priority: "High",
      target_role: role,
      module: "Attendance",
      entity: "Student",
      entityId: studentId,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      college_id: collegeId,
      category: "Academic",
      route: `/attendance/student/${studentId}`,
      channels: ["dashboard", "email"],
      actions: [
        { label: "View Student", actionType: "link", route: `/attendance/student/${studentId}` }
      ],
      created_by: "AI Prediction Engine",
    };
  }

  static createLeaveRequestAlert(
    facultyId: string,
    facultyName: string,
    date: string,
    role: string = "hod",
    collegeId: string = "GMR"
  ): Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status"> {
    return {
      title: "Faculty Leave Approval Required",
      message: `${facultyName} has requested casual leave for ${date}.`,
      type: "Approval",
      priority: "Medium",
      target_role: role,
      module: "Administration",
      entity: "LeaveRequest",
      entityId: facultyId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      college_id: collegeId,
      category: "Administration",
      route: "/admin/leaves",
      channels: ["dashboard", "push"],
      actions: [
        { label: "Approve", actionType: "approve", apiEndpoint: `/api/v1/leaves/approve/${facultyId}` },
        { label: "Reject", actionType: "reject", apiEndpoint: `/api/v1/leaves/reject/${facultyId}` }
      ],
      created_by: "HR System",
    };
  }

  static create(params: {
    title: string;
    message: string;
    type: Notification["type"];
    priority: Notification["priority"];
    target_role: string;
    module: string;
    entity?: string;
    entityId?: string;
    route?: string;
    actions?: NotificationAction[];
    channels?: Notification["channels"];
    created_by?: string;
    expires_at?: string | null;
    college_id?: string;
    category?: Notification["category"];
    metadata?: Record<string, any>;
  }): Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status"> {
    const result: Omit<Notification, "id" | "created_at" | "status" | "schema_version" | "delivery_status"> = {
      title: params.title,
      message: params.message,
      type: params.type,
      priority: params.priority,
      target_role: params.target_role,
      module: params.module,
      actions: params.actions || [],
      channels: params.channels || ["dashboard"],
      created_by: params.created_by || "System",
      expires_at: params.expires_at || null,
      college_id: params.college_id || "GMR",
      category: params.category || "Administration",
      metadata: params.metadata || {},
    };

    if (params.entity !== undefined) result.entity = params.entity;
    if (params.entityId !== undefined) result.entityId = params.entityId;
    if (params.route !== undefined) result.route = params.route;

    return result;
  }
}

export default NotificationFactory;
