import api from "@/lib/api";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type WorkloadStatus = "Underloaded" | "Normal" | "Near Capacity" | "Overloaded";

export interface FacultyWorkload {
  facultyId: string;
  facultyName: string;
  empId: string;
  designation: string;
  department: string;
  totalSubjects: number;
  theorySubjects: number;
  labSubjects: number;
  weeklyTeachingHours: number;
  weeklyCapacity: number;
  remainingCapacity: number;
  assignedSemesters: string[];
  assignedSections: string[];
  status: WorkloadStatus;
}

// ─── Service Method (PostgreSQL / Prisma Backend) ──────────────────────────────

export async function getFacultyWorkload(
  department: string,
): Promise<FacultyWorkload[]> {
  const qp = new URLSearchParams();
  if (department && department !== "all") qp.append("department", department);

  const res = await api.get<FacultyWorkload[]>(`/api/dean/faculty-workload?${qp.toString()}`);
  if (res?.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}
