import api from "@/lib/api";
import type { SubjectAllocation } from "./SubjectAllocationService";
import { MOCK_FACULTY_BY_DEPT } from "./SubjectAllocationService";

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

// ─── Workload Calculation ─────────────────────────────────────────────────────

function computeWorkloadStatus(weeklyHours: number, capacity: number): WorkloadStatus {
  const utilization = weeklyHours / capacity;
  if (utilization < 0.4) return "Underloaded";
  if (utilization < 0.75) return "Normal";
  if (utilization < 1.0) return "Near Capacity";
  return "Overloaded";
}

export function computeFacultyWorkloads(
  department: string,
  allocations: SubjectAllocation[]
): FacultyWorkload[] {
  const deptFaculty = MOCK_FACULTY_BY_DEPT[department] ?? [];
  const deptAllocations = allocations.filter((a) => a.department === department);

  return deptFaculty.map((faculty) => {
    const facultyAllocs = deptAllocations.filter((a) => a.facultyId === faculty.id);

    const weeklyTeachingHours = facultyAllocs.reduce((sum, a) => sum + a.weeklyHours, 0);
    const theorySubjects = facultyAllocs.filter((a) => a.type === "Theory").length;
    const labSubjects = facultyAllocs.filter((a) => a.type === "Lab").length;
    const assignedSemesters = Array.from(new Set(facultyAllocs.map((a) => a.semester)));
    const assignedSections = Array.from(new Set(facultyAllocs.map((a) => a.section)));
    const remainingCapacity = Math.max(0, faculty.weeklyCapacity - weeklyTeachingHours);
    const status = computeWorkloadStatus(weeklyTeachingHours, faculty.weeklyCapacity);

    return {
      facultyId: faculty.id,
      facultyName: faculty.fullName,
      empId: faculty.empId,
      designation: faculty.designation,
      department: faculty.department,
      totalSubjects: facultyAllocs.length,
      theorySubjects,
      labSubjects,
      weeklyTeachingHours,
      weeklyCapacity: faculty.weeklyCapacity,
      remainingCapacity,
      assignedSemesters,
      assignedSections,
      status,
    };
  });
}

// ─── Service Method ───────────────────────────────────────────────────────────

export async function getFacultyWorkload(
  department: string,
  allocations: SubjectAllocation[]
): Promise<FacultyWorkload[]> {
  try {
    const res = await api.get(`/api/dean/faculty-workload?department=${department}`);
    if (res?.data) return res.data;
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(computeFacultyWorkloads(department, allocations));
    }, 150);
  });
}
