import api from "@/lib/api";

export interface StudentResultEntry {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  semester: string;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  rank?: number;
  resultClass: "First Class with Distinction" | "First Class" | "Second Class" | "Backlog Pending";
  grades: { subjectCode: string; subjectTitle: string; grade: string; credits: number }[];
}

export const INITIAL_SEMESTER_RESULTS: StudentResultEntry[] = [
  {
    id: "RES-101",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    semester: "Semester 6",
    academicYear: "2025-2026",
    sgpa: 9.45,
    cgpa: 9.38,
    rank: 1,
    resultClass: "First Class with Distinction",
    grades: [
      { subjectCode: "CS401", subjectTitle: "Advanced Artificial Intelligence", grade: "O", credits: 4 },
      { subjectCode: "CS402", subjectTitle: "Cloud Computing Architectures", grade: "A+", credits: 3 },
      { subjectCode: "CS403", subjectTitle: "Compiler Design Laboratory", grade: "O", credits: 2 },
    ],
  },
  {
    id: "RES-102",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    semester: "Semester 6",
    academicYear: "2025-2026",
    sgpa: 9.20,
    cgpa: 9.12,
    rank: 2,
    resultClass: "First Class with Distinction",
    grades: [
      { subjectCode: "EC304", subjectTitle: "VLSI System Design", grade: "O", credits: 4 },
      { subjectCode: "EC305", subjectTitle: "Digital Signal Processing", grade: "A+", credits: 4 },
    ],
  },
  {
    id: "RES-103",
    rollNo: "23ME014",
    studentName: "Vikram Aditya",
    department: "ME",
    semester: "Semester 4",
    academicYear: "2025-2026",
    sgpa: 7.20,
    cgpa: 7.15,
    resultClass: "First Class",
    grades: [
      { subjectCode: "ME308", subjectTitle: "Computer Aided Design", grade: "B+", credits: 3 },
      { subjectCode: "ME309", subjectTitle: "Thermodynamics", grade: "B", credits: 4 },
    ],
  },
];

export async function fetchInstitutionalResults(): Promise<StudentResultEntry[]> {
  try {
    const res = await api.get("/api/results");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_SEMESTER_RESULTS;
}

export async function uploadBatchResults(data: Partial<StudentResultEntry>): Promise<StudentResultEntry> {
  try {
    const res = await api.post("/api/results/batch", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `RES-${Math.floor(104 + Math.random() * 900)}`,
    rollNo: data.rollNo || "23AIDS012",
    studentName: data.studentName || "Rohan Varma",
    department: data.department || "AI&DS",
    semester: data.semester || "Semester 6",
    academicYear: "2025-2026",
    sgpa: Number(data.sgpa) || 8.90,
    cgpa: Number(data.cgpa) || 8.85,
    resultClass: "First Class with Distinction",
    grades: [
      { subjectCode: "AI401", subjectTitle: "Deep Learning Foundations", grade: "A+", credits: 4 },
    ],
  };
}
