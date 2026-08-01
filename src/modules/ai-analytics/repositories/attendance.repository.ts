import { api } from "../services/api";
import type { AttendancePrediction } from "../types";
import type { DepartmentCode } from "@/config/roles";

export interface IAttendanceRepository {
  getPredictions(department?: DepartmentCode): Promise<AttendancePrediction[]>;
  sendAlert(studentId: string, recipient: string): Promise<boolean>;
}

export class MockAttendanceRepository implements IAttendanceRepository {
  getPredictions(department?: DepartmentCode): Promise<AttendancePrediction[]> {
    return api.get<AttendancePrediction[]>("/attendance/predictions", { department });
  }

  sendAlert(studentId: string, recipient: string): Promise<boolean> {
    return api.post<{ success: boolean }>("/attendance/alert", { studentId, recipient }).then((res) => res.success);
  }
}

const ACTIVE_IMPL = "mock";

export const attendanceRepository: IAttendanceRepository =
  ACTIVE_IMPL === "mock" ? new MockAttendanceRepository() : new MockAttendanceRepository();

export default attendanceRepository;
