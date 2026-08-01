import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { reportsRepository } from "../repositories/reports.repository";
import type { AnalyticsReport } from "../types";

export function useReports() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsRepository.getReports();
      setReports(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve reports list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportReport = async (reportId: string, format: "PDF" | "Excel" | "CSV") => {
    const report = reports.find((r) => r.id === reportId);
    const title = report ? report.title : "Report";
    const promise = reportsRepository.exportReport(reportId, format);

    toast.promise(promise, {
      loading: `Compiling ${format} dataset for "${title}"...`,
      success: `"${title}.${format.toLowerCase()}" successfully saved to downloads.`,
      error: `Failed to compile ${format} report.`,
    });

    try {
      await promise;
      return true;
    } catch {
      return false;
    }
  };

  return {
    reports,
    loading,
    error,
    exportReport,
    refetch: fetchReports,
  };
}
