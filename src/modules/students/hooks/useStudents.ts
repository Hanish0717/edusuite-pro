import { useState, useEffect, useCallback } from "react";
import { StudentService } from "../services/StudentService";
import type { StudentRecord, StudentFilters } from "../types";
import { toast } from "sonner";

export function useStudents() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    department: "All",
    academicYear: "All",
    feeStatus: "All",
    status: "All",
  });

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StudentService.getAll();
      setStudents(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load student records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const createStudent = async (data: Partial<StudentRecord>) => {
    try {
      const created = await StudentService.create(data);
      setStudents((prev) => [created, ...prev]);
      toast.success(`Student ${created.fullName} successfully registered!`);
      return created;
    } catch (err: any) {
      toast.error(err.message || "Failed to register student");
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<StudentRecord>) => {
    try {
      const updated = await StudentService.update(id, updates);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
      toast.success(`Student ${updated.fullName} updated!`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to update student");
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const success = await StudentService.delete(id);
      if (success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        toast.success("Student record deleted successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student record");
    }
  };

  const promoteStudent = async (id: string, year: string, semester: number) => {
    try {
      const updated = await StudentService.promoteStudent(id, year, semester);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`Student promoted to ${year} (Sem ${semester})`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to promote student");
      throw err;
    }
  };

  const transferStudent = async (id: string, dept: string, section: string) => {
    try {
      const updated = await StudentService.transferStudent(id, dept, section);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(`Student transferred to ${dept}-${section}`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to transfer student");
      throw err;
    }
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDept = filters.department === "All" || s.department === filters.department;
    const matchesYear = filters.academicYear === "All" || s.academicYear === filters.academicYear;
    const matchesFee = filters.feeStatus === "All" || s.feeStatus === filters.feeStatus;
    const matchesStatus = filters.status === "All" || s.status === filters.status;

    return matchesSearch && matchesDept && matchesYear && matchesFee && matchesStatus;
  });

  return {
    students: filteredStudents,
    allStudents: students,
    loading,
    filters,
    setFilters,
    refresh: loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    promoteStudent,
    transferStudent,
  };
}
