import { api } from "../services/api";
import type { AnalyticsReport } from "../types";

export interface IReportsRepository {
  getReports(): Promise<AnalyticsReport[]>;
  exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<boolean>;
}

export class MockReportsRepository implements IReportsRepository {
  getReports(): Promise<AnalyticsReport[]> {
    return api.get<AnalyticsReport[]>("/reports/list");
  }

  exportReport(reportId: string, format: "PDF" | "Excel" | "CSV"): Promise<boolean> {
    return api.post<{ success: boolean }>("/reports/export", { reportId, format }).then((res) => res.success);
  }
}

const ACTIVE_IMPL = "mock";

export const reportsRepository: IReportsRepository =
  ACTIVE_IMPL === "mock" ? new MockReportsRepository() : new MockReportsRepository();

export default reportsRepository;
