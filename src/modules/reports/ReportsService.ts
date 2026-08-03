import api from "@/lib/api";

export interface AnalyticsReport {
  id: string;
  reportName: string;
  category: "Academic" | "Financial" | "Compliance" | "Admissions" | "Placement";
  generatedDate: string;
  format: "PDF" | "CSV" | "XLSX";
  downloads: number;
  status: "Ready" | "Generating";
}

export const INITIAL_REPORTS: AnalyticsReport[] = [
  { id: "R-101", reportName: "NAAC Criteria 1-7 Comprehensive Compliance Dossier", category: "Compliance", generatedDate: "2026-08-01", format: "PDF", downloads: 142, status: "Ready" },
  { id: "R-102", reportName: "Semester Examination Pass Percentage & Revaluation Audit", category: "Academic", generatedDate: "2026-07-28", format: "CSV", downloads: 89, status: "Ready" },
  { id: "R-103", reportName: "Annual Tuition Fee Collection & Defaulter Breakdown", category: "Financial", generatedDate: "2026-07-30", format: "XLSX", downloads: 210, status: "Ready" },
  { id: "R-104", reportName: "Campus Recruitment Offer Letter & Salary Package Digest", category: "Placement", generatedDate: "2026-08-02", format: "PDF", downloads: 175, status: "Ready" },
];

export async function fetchAnalyticsReports(): Promise<AnalyticsReport[]> {
  try {
    const res = await api.get("/api/reports");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_REPORTS;
}
