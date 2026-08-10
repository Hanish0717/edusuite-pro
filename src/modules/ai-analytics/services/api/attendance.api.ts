import { api } from "../api";
import type { AttendancePrediction } from "../../types";
import type { DepartmentCode } from "@/config/roles";

export class AttendanceApi {
  static getPredictions(department?: DepartmentCode): Promise<AttendancePrediction[]> {
    return api.get<AttendancePrediction[]>("/attendance/predictions", { department });
  }

  static sendAlert(studentId: string, recipient: string): Promise<boolean> {
    return api.post<{ success: boolean }>("/attendance/alert", { studentId, recipient }).then((res) => res.success);
  }
}
export default AttendanceApi;
