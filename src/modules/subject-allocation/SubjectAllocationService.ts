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
}

export interface GetAllocationsParams {
  department: string;
  semester?: string;
  section?: string;
  search?: string;
  type?: string;
  status?: string;
}

// ─── Static Mock Faculty Registry (by dept) ─────────────────────────────────

export const MOCK_FACULTY_BY_DEPT: Record<string, AllocationFaculty[]> = {
  CSE: [
    { id: "FAC-1001", empId: "EMP-FAC-012", fullName: "Dr. K. Sai Teja", designation: "Professor", department: "CSE", specialization: "AI & Neural Networks", weeklyCapacity: 20 },
    { id: "FAC-1003", empId: "EMP-FAC-038", fullName: "Ms. Ananya Verma", designation: "Assistant Professor", department: "CSE", specialization: "Computer Vision", weeklyCapacity: 18 },
    { id: "FAC-1006", empId: "EMP-FAC-082", fullName: "Dr. Ravi Kumar", designation: "Associate Professor", department: "CSE", specialization: "Cloud Computing", weeklyCapacity: 20 },
    { id: "FAC-1007", empId: "EMP-FAC-090", fullName: "Mr. Suresh Babu", designation: "Lecturer", department: "CSE", specialization: "Data Structures & Java", weeklyCapacity: 18 },
    { id: "FAC-1008", empId: "EMP-FAC-099", fullName: "Prof. Alan Turing", designation: "Visiting Faculty", department: "CSE", specialization: "Quantum Computing", weeklyCapacity: 10 },
  ],
  ECE: [
    { id: "FAC-2001", empId: "EMP-FAC-024", fullName: "Dr. Meera Rao", designation: "Professor", department: "ECE", specialization: "VLSI Architecture", weeklyCapacity: 20 },
    { id: "FAC-2002", empId: "EMP-FAC-041", fullName: "Dr. Amit Verma", designation: "Associate Professor", department: "ECE", specialization: "Signal Processing", weeklyCapacity: 18 },
    { id: "FAC-2003", empId: "EMP-FAC-057", fullName: "Mr. Rajesh G.", designation: "Assistant Professor", department: "ECE", specialization: "Embedded Systems", weeklyCapacity: 16 },
  ],
  EEE: [
    { id: "FAC-3001", empId: "EMP-FAC-031", fullName: "Dr. S. N. Singh", designation: "Professor", department: "EEE", specialization: "Power Systems", weeklyCapacity: 20 },
    { id: "FAC-3002", empId: "EMP-FAC-048", fullName: "Dr. Meenakshi Reddy", designation: "Associate Professor", department: "EEE", specialization: "Control Systems", weeklyCapacity: 18 },
  ],
  ME: [
    { id: "FAC-4001", empId: "EMP-FAC-055", fullName: "Prof. V. K. Murthy", designation: "Professor", department: "ME", specialization: "Fluid Mechanics", weeklyCapacity: 20 },
    { id: "FAC-4002", empId: "EMP-FAC-068", fullName: "Dr. H. P. Sharma", designation: "Associate Professor", department: "ME", specialization: "Thermodynamics", weeklyCapacity: 18 },
    { id: "FAC-4003", empId: "EMP-FAC-071", fullName: "Mr. Venugopal K.", designation: "Assistant Professor", department: "ME", specialization: "Manufacturing Processes", weeklyCapacity: 16 },
  ],
  Civil: [
    { id: "FAC-5001", empId: "EMP-FAC-062", fullName: "Dr. R. K. Mittal", designation: "Associate Professor", department: "Civil", specialization: "Structural Design", weeklyCapacity: 18 },
    { id: "FAC-5002", empId: "EMP-FAC-073", fullName: "Ms. Priya Nair", designation: "Assistant Professor", department: "Civil", specialization: "Geotechnical Engineering", weeklyCapacity: 16 },
  ],
  MBA: [
    { id: "FAC-6001", empId: "EMP-FAC-085", fullName: "Dr. Neha Kapoor", designation: "Professor", department: "MBA", specialization: "Marketing Management", weeklyCapacity: 20 },
    { id: "FAC-6002", empId: "EMP-FAC-091", fullName: "Mr. Aravind Patel", designation: "Associate Professor", department: "MBA", specialization: "Organizational Behavior", weeklyCapacity: 18 },
  ],
};

// ─── Static Mock Subjects Registry (by dept) ────────────────────────────────

export const MOCK_SUBJECTS_BY_DEPT: Record<string, AllocationSubject[]> = {
  CSE: [
    { id: "SUB-CS-001", code: "CS101", name: "Introduction to Programming", department: "CSE", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CS-002", code: "CS201", name: "Data Structures & Algorithms", department: "CSE", semester: "Semester 3", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-CS-003", code: "CS201L", name: "Data Structures Lab", department: "CSE", semester: "Semester 3", credits: 2, weeklyHours: 4, type: "Lab" },
    { id: "SUB-CS-004", code: "CS301", name: "Database Management Systems", department: "CSE", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CS-005", code: "CS302", name: "Operating Systems", department: "CSE", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CS-006", code: "CS301L", name: "DBMS Lab", department: "CSE", semester: "Semester 5", credits: 2, weeklyHours: 4, type: "Lab" },
    { id: "SUB-CS-007", code: "CS401", name: "Advanced AI & Deep Learning", department: "CSE", semester: "Semester 7", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-CS-008", code: "CS402", name: "Natural Language Processing", department: "CSE", semester: "Semester 7", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CS-009", code: "CS403", name: "Cloud Computing & DevOps", department: "CSE", semester: "Semester 7", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CS-010", code: "CS499", name: "Major Capstone Project", department: "CSE", semester: "Semester 8", credits: 6, weeklyHours: 6, type: "Lab" },
  ],
  ECE: [
    { id: "SUB-EC-001", code: "EC101", name: "Semiconductor Physics & Devices", department: "ECE", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-EC-002", code: "EC201", name: "Digital Logic Design & Circuits", department: "ECE", semester: "Semester 3", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-EC-003", code: "EC201L", name: "Digital Electronics Lab", department: "ECE", semester: "Semester 3", credits: 2, weeklyHours: 4, type: "Lab" },
    { id: "SUB-EC-004", code: "EC302", name: "Microprocessor & Embedded Systems", department: "ECE", semester: "Semester 5", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-EC-005", code: "EC401", name: "5G Communication Networks", department: "ECE", semester: "Semester 7", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-EC-006", code: "EC301", name: "VLSI Design", department: "ECE", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
  ],
  EEE: [
    { id: "SUB-EE-001", code: "EE101", name: "Basic Electrical Engineering", department: "EEE", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-EE-002", code: "EE201", name: "Circuit Theory & Networks", department: "EEE", semester: "Semester 3", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-EE-003", code: "EE301", name: "Power Systems Analysis", department: "EEE", semester: "Semester 5", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-EE-004", code: "EE302", name: "Control Systems", department: "EEE", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-EE-005", code: "EE201L", name: "Electrical Machines Lab", department: "EEE", semester: "Semester 3", credits: 2, weeklyHours: 4, type: "Lab" },
  ],
  ME: [
    { id: "SUB-ME-001", code: "ME101", name: "Engineering Mechanics", department: "ME", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-ME-002", code: "ME201", name: "Thermodynamics", department: "ME", semester: "Semester 3", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-ME-003", code: "ME301", name: "Heat Transfer", department: "ME", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-ME-004", code: "ME302", name: "CAD/CAM Design", department: "ME", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-ME-005", code: "ME201L", name: "Manufacturing Processes Lab", department: "ME", semester: "Semester 3", credits: 2, weeklyHours: 4, type: "Lab" },
    { id: "SUB-ME-006", code: "ME401", name: "Refrigeration & Air Conditioning", department: "ME", semester: "Semester 7", credits: 3, weeklyHours: 3, type: "Theory" },
  ],
  Civil: [
    { id: "SUB-CE-001", code: "CE101", name: "Engineering Surveying", department: "Civil", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CE-002", code: "CE201", name: "Structural Analysis", department: "Civil", semester: "Semester 3", credits: 4, weeklyHours: 4, type: "Theory" },
    { id: "SUB-CE-003", code: "CE301", name: "Geotechnical Engineering", department: "Civil", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CE-004", code: "CE302", name: "Environmental Engineering", department: "Civil", semester: "Semester 5", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-CE-005", code: "CE201L", name: "Concrete Technology Lab", department: "Civil", semester: "Semester 3", credits: 2, weeklyHours: 4, type: "Lab" },
  ],
  MBA: [
    { id: "SUB-MB-001", code: "MB101", name: "Organizational Behavior", department: "MBA", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-MB-002", code: "MB102", name: "Marketing Management", department: "MBA", semester: "Semester 1", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-MB-003", code: "MB201", name: "Financial Management", department: "MBA", semester: "Semester 2", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-MB-004", code: "MB202", name: "Operations Management", department: "MBA", semester: "Semester 2", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-MB-005", code: "MB301", name: "Strategic Management", department: "MBA", semester: "Semester 3", credits: 3, weeklyHours: 3, type: "Theory" },
    { id: "SUB-MB-006", code: "MB401", name: "Business Research Methods", department: "MBA", semester: "Semester 4", credits: 3, weeklyHours: 3, type: "Theory" },
  ],
};

// ─── In-Memory Allocation Database ──────────────────────────────────────────

let allocationDatabase: SubjectAllocation[] = [
  // CSE initial allocations
  { id: "ALLOC-001", facultyId: "FAC-1001", facultyName: "Dr. K. Sai Teja", empId: "EMP-FAC-012", subjectId: "SUB-CS-007", subjectName: "Advanced AI & Deep Learning", subjectCode: "CS401", department: "CSE", semester: "Semester 7", section: "A", academicYear: "2025-26", credits: 4, weeklyHours: 4, type: "Theory", status: "Active" },
  { id: "ALLOC-002", facultyId: "FAC-1006", facultyName: "Dr. Ravi Kumar", empId: "EMP-FAC-082", subjectId: "SUB-CS-009", subjectName: "Cloud Computing & DevOps", subjectCode: "CS403", department: "CSE", semester: "Semester 7", section: "A", academicYear: "2025-26", credits: 3, weeklyHours: 3, type: "Theory", status: "Active" },
  { id: "ALLOC-003", facultyId: "FAC-1003", facultyName: "Ms. Ananya Verma", empId: "EMP-FAC-038", subjectId: "SUB-CS-004", subjectName: "Database Management Systems", subjectCode: "CS301", department: "CSE", semester: "Semester 5", section: "B", academicYear: "2025-26", credits: 3, weeklyHours: 3, type: "Theory", status: "Active" },
  { id: "ALLOC-004", facultyId: "FAC-1007", facultyName: "Mr. Suresh Babu", empId: "EMP-FAC-090", subjectId: "SUB-CS-002", subjectName: "Data Structures & Algorithms", subjectCode: "CS201", department: "CSE", semester: "Semester 3", section: "A", academicYear: "2025-26", credits: 4, weeklyHours: 4, type: "Theory", status: "Active" },
  { id: "ALLOC-005", facultyId: "FAC-1007", facultyName: "Mr. Suresh Babu", empId: "EMP-FAC-090", subjectId: "SUB-CS-003", subjectName: "Data Structures Lab", subjectCode: "CS201L", department: "CSE", semester: "Semester 3", section: "A", academicYear: "2025-26", credits: 2, weeklyHours: 4, type: "Lab", status: "Active" },
  // ECE initial allocations
  { id: "ALLOC-006", facultyId: "FAC-2001", facultyName: "Dr. Meera Rao", empId: "EMP-FAC-024", subjectId: "SUB-EC-006", subjectName: "VLSI Design", subjectCode: "EC301", department: "ECE", semester: "Semester 5", section: "A", academicYear: "2025-26", credits: 3, weeklyHours: 3, type: "Theory", status: "Active" },
  { id: "ALLOC-007", facultyId: "FAC-2002", facultyName: "Dr. Amit Verma", empId: "EMP-FAC-041", subjectId: "SUB-EC-005", subjectName: "5G Communication Networks", subjectCode: "EC401", department: "ECE", semester: "Semester 7", section: "A", academicYear: "2025-26", credits: 4, weeklyHours: 4, type: "Theory", status: "Active" },
  // ME
  { id: "ALLOC-008", facultyId: "FAC-4001", facultyName: "Prof. V. K. Murthy", empId: "EMP-FAC-055", subjectId: "SUB-ME-003", subjectName: "Heat Transfer", subjectCode: "ME301", department: "ME", semester: "Semester 5", section: "A", academicYear: "2025-26", credits: 3, weeklyHours: 3, type: "Theory", status: "Active" },
  { id: "ALLOC-009", facultyId: "FAC-4002", facultyName: "Dr. H. P. Sharma", empId: "EMP-FAC-068", subjectId: "SUB-ME-002", subjectName: "Thermodynamics", subjectCode: "ME201", department: "ME", semester: "Semester 3", section: "A", academicYear: "2025-26", credits: 4, weeklyHours: 4, type: "Theory", status: "Active" },
];

let nextAllocId = 10;

// ─── Validation Helpers ──────────────────────────────────────────────────────

function validateAllocation(
  incoming: Omit<SubjectAllocation, "id">,
  existing: SubjectAllocation[]
): string | null {
  // Duplicate faculty+subject+semester+section check
  const dupFaculty = existing.find(
    (a) =>
      a.facultyId === incoming.facultyId &&
      a.subjectCode === incoming.subjectCode &&
      a.semester === incoming.semester &&
      a.section === incoming.section &&
      a.academicYear === incoming.academicYear
  );
  if (dupFaculty) {
    return `${incoming.facultyName} is already assigned to ${incoming.subjectCode} in ${incoming.semester} / Section ${incoming.section}.`;
  }

  // Duplicate subject assignment for same semester+section
  const dupSubject = existing.find(
    (a) =>
      a.subjectCode === incoming.subjectCode &&
      a.semester === incoming.semester &&
      a.section === incoming.section &&
      a.academicYear === incoming.academicYear
  );
  if (dupSubject) {
    return `${incoming.subjectCode} already has a faculty assignment in ${incoming.semester} / Section ${incoming.section} (${dupSubject.facultyName}).`;
  }

  return null;
}

// ─── Public Service API ──────────────────────────────────────────────────────

export async function getSubjectAllocations(params: GetAllocationsParams): Promise<SubjectAllocation[]> {
  try {
    const qp = new URLSearchParams({ department: params.department, ...(params.semester ? { semester: params.semester } : {}), ...(params.section ? { section: params.section } : {}) });
    const res = await api.get(`/api/dean/subject-allocations?${qp}`);
    if (res?.data) return res.data;
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      let results = allocationDatabase.filter((a) => a.department === params.department);
      if (params.semester) results = results.filter((a) => a.semester === params.semester);
      if (params.section) results = results.filter((a) => a.section === params.section);
      if (params.search) {
        const q = params.search.toLowerCase();
        results = results.filter((a) =>
          a.facultyName.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q) ||
          a.subjectCode.toLowerCase().includes(q)
        );
      }
      if (params.type) results = results.filter((a) => a.type === params.type);
      if (params.status) results = results.filter((a) => a.status === params.status);
      resolve(results);
    }, 200);
  });
}

export async function getFacultyByDept(department: string): Promise<AllocationFaculty[]> {
  try {
    const res = await api.get(`/api/dean/faculty?department=${department}`);
    if (res?.data) return res.data;
  } catch {}
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_FACULTY_BY_DEPT[department] ?? []), 150));
}

export async function getSubjectsByDept(department: string): Promise<AllocationSubject[]> {
  try {
    const res = await api.get(`/api/dean/subjects?department=${department}`);
    if (res?.data) return res.data;
  } catch {}
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUBJECTS_BY_DEPT[department] ?? []), 150));
}

export interface AssignFacultyPayload {
  facultyId: string;
  subjectId: string;
  department: string;
  semester: string;
  section: string;
  academicYear: string;
}

export async function assignFacultyToSubject(payload: AssignFacultyPayload): Promise<{ success: boolean; error?: string; allocation?: SubjectAllocation }> {
  const faculty = (MOCK_FACULTY_BY_DEPT[payload.department] ?? []).find((f) => f.id === payload.facultyId);
  const subject = (MOCK_SUBJECTS_BY_DEPT[payload.department] ?? []).find((s) => s.id === payload.subjectId);

  if (!faculty) return { success: false, error: "Selected faculty not found in this department." };
  if (!subject) return { success: false, error: "Selected subject not found in this department." };

  const incoming: Omit<SubjectAllocation, "id"> = {
    facultyId: faculty.id,
    facultyName: faculty.fullName,
    empId: faculty.empId,
    subjectId: subject.id,
    subjectName: subject.name,
    subjectCode: subject.code,
    department: payload.department,
    semester: payload.semester,
    section: payload.section,
    academicYear: payload.academicYear,
    credits: subject.credits,
    weeklyHours: subject.weeklyHours,
    type: subject.type,
    status: "Active",
  };

  const validationError = validateAllocation(incoming, allocationDatabase);
  if (validationError) return { success: false, error: validationError };

  try {
    const res = await api.post("/api/dean/subject-allocations", incoming);
    if (res?.data) {
      allocationDatabase.push(res.data);
      return { success: true, allocation: res.data };
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const newAlloc: SubjectAllocation = { ...incoming, id: `ALLOC-${String(nextAllocId++).padStart(3, "0")}` };
      allocationDatabase.push(newAlloc);
      resolve({ success: true, allocation: newAlloc });
    }, 300);
  });
}

export async function deleteAllocation(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/dean/subject-allocations/${id}`);
  } catch {}
  allocationDatabase = allocationDatabase.filter((a) => a.id !== id);
  return true;
}

export async function updateAllocationStatus(id: string, status: SubjectAllocation["status"]): Promise<boolean> {
  try {
    await api.put(`/api/dean/subject-allocations/${id}`, { status });
  } catch {}
  const idx = allocationDatabase.findIndex((a) => a.id === id);
  if (idx !== -1) {
    allocationDatabase[idx] = { ...allocationDatabase[idx]!, status };
    return true;
  }
  return false;
}

export function getSemestersByDept(department: string): string[] {
  const subjects = MOCK_SUBJECTS_BY_DEPT[department] ?? [];
  return Array.from(new Set(subjects.map((s) => s.semester))).sort();
}
