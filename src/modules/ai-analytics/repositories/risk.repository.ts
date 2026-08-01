import { api } from "../services/api";
import type { StudentRisk } from "../types";
import type { DepartmentCode } from "@/config/roles";

export interface IRiskRepository {
  getRisks(department?: DepartmentCode): Promise<StudentRisk[]>;
  updateRecommendation(studentId: string, recommendation: string): Promise<boolean>;
}

export class MockRiskRepository implements IRiskRepository {
  getRisks(department?: DepartmentCode): Promise<StudentRisk[]> {
    return api.get<StudentRisk[]>("/risk/assessments", { department });
  }

  updateRecommendation(studentId: string, recommendation: string): Promise<boolean> {
    return api.put<{ success: boolean }>("/risk/recommendation", { studentId, recommendation }).then((res) => res.success);
  }
}

const ACTIVE_IMPL = "mock";

export const riskRepository: IRiskRepository =
  ACTIVE_IMPL === "mock" ? new MockRiskRepository() : new MockRiskRepository();

export default riskRepository;
