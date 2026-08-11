import type { AttendancePrediction } from "../types";
import type { DepartmentCode } from "@/config/roles";
import type { ApiResponse } from "@/shared/types/api.types";
import { AttendanceApi } from "../services/api/attendance.api";

export interface IAttendanceRepository {
  getPredictions(department?: DepartmentCode): Promise<ApiResponse<AttendancePrediction[]>>;
  sendAlert(studentId: string, recipient: string): Promise<ApiResponse<boolean>>;
}

export class MockAttendanceRepository implements IAttendanceRepository {
  async getPredictions(department?: DepartmentCode): Promise<ApiResponse<AttendancePrediction[]>> {
    try {
      const data = await AttendanceApi.getPredictions(department);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: [], error: err.message || "Failed to fetch predictions" };
    }
  }

  async sendAlert(studentId: string, recipient: string): Promise<ApiResponse<boolean>> {
    try {
      const success = await AttendanceApi.sendAlert(studentId, recipient);
      return { success, data: success };
    } catch (err: any) {
      return { success: false, data: false, error: err.message || "Failed to dispatch alert" };
    }
  }
}

export class SupabaseAttendanceRepository implements IAttendanceRepository {
  async getPredictions(department?: DepartmentCode): Promise<ApiResponse<AttendancePrediction[]>> {
    return { success: true, data: [] };
  }

  async sendAlert(studentId: string, recipient: string): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
}
