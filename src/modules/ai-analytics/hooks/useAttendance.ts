import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { attendanceRepository } from "../repositories/attendance.repository";
import type { AttendancePrediction } from "../types";
import type { DepartmentCode } from "@/config/roles";

export function useAttendance(initialDept?: DepartmentCode) {
  const [predictions, setPredictions] = useState<AttendancePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<DepartmentCode | undefined>(initialDept);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceRepository.getPredictions(department);
      setPredictions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance predictions.");
    } finally {
      setLoading(false);
    }
  }, [department]);

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
        success: `Alert successfully dispatched to ${recipient}!`,
        error: "Failed to deliver notification.",
      });
      
      await promise;
      return true;
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
