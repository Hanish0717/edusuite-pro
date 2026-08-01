import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { riskRepository } from "../repositories/risk.repository";
import type { StudentRisk } from "../types";
import type { DepartmentCode } from "@/config/roles";

export function useRiskAnalysis(initialDept?: DepartmentCode) {
  const [risks, setRisks] = useState<StudentRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<DepartmentCode | undefined>(initialDept);

  const fetchRisks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riskRepository.getRisks(department);
      setRisks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load risk analysis records.");
    } finally {
      setLoading(false);
    }
  }, [department]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const updateRecommendation = async (studentId: string, notes: string) => {
    try {
      setLoading(true);
      const success = await riskRepository.updateRecommendation(studentId, notes);
      if (success) {
        setRisks((prev) =>
          prev.map((r) => (r.studentId === studentId ? { ...r, recommendation: notes } : r))
        );
        toast.success("Academic recommendation updated.");
      } else {
        toast.error("Failed to update recommendation.");
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
