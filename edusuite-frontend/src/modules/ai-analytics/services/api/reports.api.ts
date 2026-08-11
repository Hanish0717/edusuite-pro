import { api } from "../api";
import type { AnalyticsReport } from "../../types";

export class ReportsApi {
  static getReports(): Promise<AnalyticsReport[]> {
    return api.get<AnalyticsReport[]>("/reports/list");
  }

  static exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<boolean> {
    return api.post<{ success: boolean }>("/reports/export", { reportId, format }).then((res) => res.success);
  }
}
export default ReportsApi;
