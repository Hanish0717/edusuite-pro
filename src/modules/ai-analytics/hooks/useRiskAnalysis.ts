import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories";
import type { StudentRisk } from "../types";
import type { DepartmentCode } from "@/config/roles";

export function useRiskAnalysis(initialDept?: DepartmentCode) {
  const [risks, setRisks] = useState<StudentRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<DepartmentCode | undefined>(initialDept);

  const riskRepository = useMemo(() => RepositoryFactory.getRisk(), []);

  const fetchRisks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await riskRepository.getRisks(department);
      if (res.success) {
        setRisks(res.data);
      } else {
        setError(res.error || "Failed to load risk analysis records.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load risk analysis records.");
    } finally {
      setLoading(false);
    }
  }, [department, riskRepository]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const updateRecommendation = async (studentId: string, notes: string) => {
    try {
      setLoading(true);
      const res = await riskRepository.updateRecommendation(studentId, notes);
      if (res.success && res.data) {
        setRisks((prev) =>
          prev.map((r) => (r.studentId === studentId ? { ...r, recommendation: notes } : r))
        );
        toast.success("Academic recommendation updated.");
      } else {
        toast.error(res.error || "Failed to update recommendation.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return {
    risks,
    loading,
    error,
    department,
    setDepartment,
    updateRecommendation,
    refetch: fetchRisks,
  };
}
export default useRiskAnalysis;
