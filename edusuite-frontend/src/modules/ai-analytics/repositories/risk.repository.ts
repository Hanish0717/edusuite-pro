import type { StudentRisk } from "../types";
import type { DepartmentCode } from "@/config/roles";
import type { ApiResponse } from "@/shared/types/api.types";
import { RiskApi } from "../services/api/risk.api";

export interface IRiskRepository {
  getRisks(department?: DepartmentCode): Promise<ApiResponse<StudentRisk[]>>;
  updateRecommendation(studentId: string, recommendation: string): Promise<ApiResponse<boolean>>;
}

export class MockRiskRepository implements IRiskRepository {
  async getRisks(department?: DepartmentCode): Promise<ApiResponse<StudentRisk[]>> {
    try {
      const data = await RiskApi.getRisks(department);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: [], error: err.message || "Failed to load risk analysis" };
    }
  }

  async updateRecommendation(studentId: string, recommendation: string): Promise<ApiResponse<boolean>> {
    try {
      const success = await RiskApi.updateRecommendation(studentId, recommendation);
      return { success, data: success };
    } catch (err: any) {
      return { success: false, data: false, error: err.message || "Failed to update recommendation" };
    }
  }
}

export class SupabaseRiskRepository implements IRiskRepository {
  async getRisks(department?: DepartmentCode): Promise<ApiResponse<StudentRisk[]>> {
    return { success: true, data: [] };
  }

  async updateRecommendation(studentId: string, recommendation: string): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
}
