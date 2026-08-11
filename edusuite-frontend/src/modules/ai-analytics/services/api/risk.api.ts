import { api } from "../api";
import type { StudentRisk } from "../../types";
import type { DepartmentCode } from "@/config/roles";

export class RiskApi {
  static getRisks(department?: DepartmentCode): Promise<StudentRisk[]> {
    return api.get<StudentRisk[]>("/risk/assessments", { department });
  }

  static updateRecommendation(studentId: string, recommendation: string): Promise<boolean> {
    return api.put<{ success: boolean }>("/risk/recommendation", { studentId, recommendation }).then((res) => res.success);
  }
}
export default RiskApi;
