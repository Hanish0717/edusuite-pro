import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories";
import type { AttendancePrediction } from "../types";
import type { DepartmentCode } from "@/config/roles";

export function useAttendance(initialDept?: DepartmentCode) {
  const [predictions, setPredictions] = useState<AttendancePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<DepartmentCode | undefined>(initialDept);

  const attendanceRepository = useMemo(() => RepositoryFactory.getAttendance(), []);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await attendanceRepository.getPredictions(department);
      if (res.success) {
        setPredictions(res.data);
      } else {
        setError(res.error || "Failed to load attendance predictions.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendance predictions.");
    } finally {
      setLoading(false);
    }
  }, [department, attendanceRepository]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const alertUser = async (studentId: string, recipient: string) => {
    try {
      const student = predictions.find((p) => p.studentId === studentId);
      const name = student ? student.name : studentId;
      
      const promise = attendanceRepository.sendAlert(studentId, recipient);
      
      toast.promise(promise, {
        loading: `Sending AI alert to ${recipient} for ${name}...`,
        success: (res) => {
          if (res.success) {
            return `Alert successfully dispatched to ${recipient}!`;
          }
          throw new Error(res.error);
        },
        error: "Failed to deliver notification.",
      });
      
      const res = await promise;
      return res.success;
    } catch {
      return false;
    }
  };

  return {
    predictions,
    loading,
    error,
    department,
    setDepartment,
    alertUser,
    refetch: fetchPredictions,
  };
}
export default useAttendance;
