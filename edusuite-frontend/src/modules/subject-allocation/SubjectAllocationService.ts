import api from "@/lib/api";

// ─── Core Interfaces ──────────────────────────────────────────────────────────

export interface AllocationFaculty {
  id: string;
  empId: string;
  fullName: string;
  designation: string;
  department: string;
  specialization: string;
  weeklyCapacity: number; // max allowed hours/week
}

export interface AllocationSubject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  weeklyHours: number;
  type: "Theory" | "Lab";
}

export interface SubjectAllocation {
  id: string;
  facultyId: string;
  facultyName: string;
  empId: string;
  subjectId: string;
  courseId?: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: string;
  section: string;
  academicYear: string;
  credits: number;
  weeklyHours: number;
  type: "Theory" | "Lab";
  status: "Active" | "Pending" | "Draft";
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllocationsParams {
  department: string;
  semester?: string;
  section?: string;
  search?: string;
  type?: string;
  status?: string;
}

// ─── Public Service API (PostgreSQL / Prisma Backend) ──────────────────────────

export async function getSubjectAllocations(params: GetAllocationsParams): Promise<SubjectAllocation[]> {
  const qp = new URLSearchParams();
  if (params.department && params.department !== "all") qp.append("department", params.department);
  if (params.semester && params.semester !== "all") qp.append("semester", params.semester);
  if (params.section && params.section !== "all") qp.append("section", params.section);
  if (params.search) qp.append("search", params.search);
  if (params.type && params.type !== "all") qp.append("type", params.type);
  if (params.status && params.status !== "all") qp.append("status", params.status);

  const res = await api.get<SubjectAllocation[]>(`/api/dean/subject-allocations?${qp.toString()}`);
  if (res?.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

export async function getFacultyByDept(department: string): Promise<AllocationFaculty[]> {
  const qp = new URLSearchParams();
  if (department && department !== "all") qp.append("department", department);

  const res = await api.get<AllocationFaculty[]>(`/api/dean/faculty?${qp.toString()}`);
  if (res?.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

export async function getSubjectsByDept(department: string, semester?: string): Promise<AllocationSubject[]> {
  const qp = new URLSearchParams();
  if (department && department !== "all") qp.append("department", department);
  if (semester && semester !== "all") qp.append("semester", semester);

  const res = await api.get<AllocationSubject[]>(`/api/dean/subjects?${qp.toString()}`);
  if (res?.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

export interface AssignFacultyPayload {
  facultyId: string;
  subjectId: string;
  department: string;
  semester: string;
  section: string;
  academicYear: string;
  weeklyHours?: number;
  status?: string;
}

export async function assignFacultyToSubject(payload: AssignFacultyPayload): Promise<{ success: boolean; error?: string; allocation?: SubjectAllocation }> {
  try {
    const res = await api.post<{ error?: string } & SubjectAllocation>("/api/dean/subject-allocations", {
      facultyId: payload.facultyId,
      courseId: payload.subjectId,
      subjectId: payload.subjectId,
      department: payload.department,
      semester: payload.semester,
      section: payload.section,
      academicYear: payload.academicYear || "2025-26",
      weeklyHours: payload.weeklyHours,
      status: payload.status || "Active",
    });

    if (res.status === 201 && res.data && !res.data.error) {
      return { success: true, allocation: res.data as SubjectAllocation };
    }

    const errorMessage = res.data?.error || (res.status === 409 ? "Conflict: An allocation already exists for this course, semester, section, and academic year." : "Failed to assign faculty to subject.");
    return { success: false, error: errorMessage };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error while creating allocation." };
  }
}

export async function deleteAllocation(id: string): Promise<boolean> {
  try {
    const res = await api.delete(`/api/dean/subject-allocations/${id}`);
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function updateAllocationStatus(id: string, status: SubjectAllocation["status"]): Promise<boolean> {
  try {
    const res = await api.put(`/api/dean/subject-allocations/${id}`, { status });
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function updateAllocation(id: string, payload: Partial<AssignFacultyPayload>): Promise<{ success: boolean; error?: string; allocation?: SubjectAllocation }> {
  try {
    const res = await api.put<{ error?: string } & SubjectAllocation>(`/api/dean/subject-allocations/${id}`, payload);
    if (res.status === 200 && res.data && !res.data.error) {
      return { success: true, allocation: res.data as SubjectAllocation };
    }
    return { success: false, error: res.data?.error || "Failed to update allocation." };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error while updating allocation." };
  }
}

export function getSemestersByDept(subjects?: AllocationSubject[]): string[] {
  if (subjects && subjects.length > 0) {
    const sems = Array.from(new Set(subjects.map((s) => s.semester))).filter(Boolean);
    if (sems.length > 0) return sems.sort();
  }
  return [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];
}
