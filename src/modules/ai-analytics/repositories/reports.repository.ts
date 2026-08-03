import type { AnalyticsReport } from "../types";
import type { ApiResponse } from "@/shared/types/api.types";
import { ReportsApi } from "../services/api/reports.api";

export interface IReportsRepository {
  getReports(): Promise<ApiResponse<AnalyticsReport[]>>;
  exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<ApiResponse<boolean>>;
}

export class MockReportsRepository implements IReportsRepository {
  async getReports(): Promise<ApiResponse<AnalyticsReport[]>> {
    try {
      const data = await ReportsApi.getReports();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: [], error: err.message || "Failed to load reports" };
    }
  }

  async exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<ApiResponse<boolean>> {
    try {
      const success = await ReportsApi.exportReport(reportId, format);
      return { success, data: success };
    } catch (err: any) {
      return { success: false, data: false, error: err.message || "Failed to export report" };
    }
  }
}

export class SupabaseReportsRepository implements IReportsRepository {
  async getReports(): Promise<ApiResponse<AnalyticsReport[]>> {
    return { success: true, data: [] };
  }

  async exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<ApiResponse<boolean>> {
    return { success: true, data: true };
  }
}
