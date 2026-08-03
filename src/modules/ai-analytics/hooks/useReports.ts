import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories";
import type { AnalyticsReport } from "../types";

export function useReports() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportsRepository = useMemo(() => RepositoryFactory.getReports(), []);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportsRepository.getReports();
      if (res.success) {
        setReports(res.data);
      } else {
        setError(res.error || "Failed to retrieve reports list.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to retrieve reports list.");
    } finally {
      setLoading(false);
    }
  }, [reportsRepository]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportReport = async (reportId: string, format: "PDF" | "Excel" | "CSV") => {
    const report = reports.find((r) => r.id === reportId);
    const title = report ? report.title : "Report";
    const promise = reportsRepository.exportReport(reportId, format);

    toast.promise(promise, {
      loading: `Compiling ${format} dataset for "${title}"...`,
      success: (res) => {
        if (res.success) {
          return `"${title}.${format.toLowerCase()}" successfully saved to downloads.`;
        }
        throw new Error(res.error);
      },
      error: `Failed to compile ${format} report.`,
    });

    try {
      const res = await promise;
      return res.success;
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
export default useReports;
