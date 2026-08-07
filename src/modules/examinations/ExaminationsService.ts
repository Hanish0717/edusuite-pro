import api from "@/lib/api";

export interface ExamSchedule {
  id: string;
  examCode: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: string;
  examDate: string;
  session: "Forenoon (09:30 AM - 12:30 PM)" | "Afternoon (02:00 PM - 05:00 PM)";
  hallNo: string;
  status: "Scheduled" | "Ongoing" | "Conducted" | "Valuation Complete";
}

export interface StudentResultRecord {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  semester: string;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  resultStatus: "Passed (Distinction)" | "Passed (First Class)" | "Re-appear / Backlog";
  backlogCount: number;
  publishedDate: string;
}

export interface RevaluationRequest {
  id: string;
  requestId: string;
  rollNo: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  originalGrade: string;
  revisedGrade?: string;
  status: "Under Review" | "Grade Upgraded" | "No Change";
  feePaid: number;
}

export const INITIAL_EXAMS: ExamSchedule[] = [
  {
    id: "EXM-101",
    examCode: "REG-APR-2026",
    subjectCode: "CS401",
    subjectName: "Advanced Artificial Intelligence & Deep Learning",
    department: "CSE",
    semester: "Semester 7",
    examDate: "2026-08-10",
    session: "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: "LH-301 & LH-302",
    status: "Scheduled",
  },
  {
    id: "EXM-102",
    examCode: "REG-APR-2026",
    subjectCode: "EC304",
    subjectName: "VLSI System Design & Cadence Synthesis",
    department: "ECE",
    semester: "Semester 6",
    examDate: "2026-08-12",
    session: "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: "LH-204 & LH-205",
    status: "Scheduled",
  },
  {
    id: "EXM-103",
    examCode: "MID-2-2026",
    subjectCode: "ME308",
    subjectName: "Computer Aided Design (CAD)",
    department: "ME",
    semester: "Semester 5",
    examDate: "2026-07-28",
    session: "Afternoon (02:00 PM - 05:00 PM)",
    hallNo: "LH-105",
    status: "Valuation Complete",
  },
];

export const INITIAL_RESULTS: StudentResultRecord[] = [
  {
    id: "RES-501",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    semester: "Semester 6",
    sgpa: 9.42,
    cgpa: 9.28,
    totalCredits: 142,
    resultStatus: "Passed (Distinction)",
    backlogCount: 0,
    publishedDate: "2026-07-15",
  },
  {
    id: "RES-502",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    semester: "Semester 6",
    sgpa: 8.85,
    cgpa: 8.74,
    totalCredits: 140,
    resultStatus: "Passed (First Class)",
    backlogCount: 0,
    publishedDate: "2026-07-15",
  },
  {
    id: "RES-503",
    rollNo: "23ME014",
    studentName: "Vikram Aditya",
    department: "ME",
    semester: "Semester 4",
    sgpa: 6.20,
    cgpa: 6.45,
    totalCredits: 98,
    resultStatus: "Re-appear / Backlog",
    backlogCount: 1,
    publishedDate: "2026-07-16",
  },
];

export const INITIAL_REVALUATIONS: RevaluationRequest[] = [
  {
    id: "REV-801",
    requestId: "REV-2026-042",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    subjectCode: "EC304",
    subjectName: "VLSI System Design",
    originalGrade: "B+",
    revisedGrade: "A",
    status: "Grade Upgraded",
    feePaid: 500,
  },
];

export async function fetchExamSchedules(): Promise<ExamSchedule[]> {
  try {
    const res = await api.get("/api/examinations/schedules");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_EXAMS;
}

export async function fetchStudentResults(): Promise<StudentResultRecord[]> {
  try {
    const res = await api.get("/api/examinations/results");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_RESULTS;
}

export async function fetchRevaluations(): Promise<RevaluationRequest[]> {
  try {
    const res = await api.get("/api/examinations/revaluations");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_REVALUATIONS;
}

export async function createExamSchedule(data: Partial<ExamSchedule>): Promise<ExamSchedule> {
  try {
    const res = await api.post("/api/examinations/schedules", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `EXM-${Math.floor(104 + Math.random() * 900)}`,
    examCode: data.examCode || "REG-APR-2026",
    subjectCode: data.subjectCode || "CS405",
    subjectName: data.subjectName || "Cloud Computing",
    department: data.department || "CSE",
    semester: data.semester || "Semester 7",
    examDate: data.examDate || "2026-08-20",
    session: data.session || "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: data.hallNo || "LH-305",
    status: "Scheduled",
  };
}

export async function publishResultRecord(data: Partial<StudentResultRecord>): Promise<StudentResultRecord> {
  try {
    const res = await api.post("/api/examinations/results", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `RES-${Math.floor(504 + Math.random() * 900)}`,
    rollNo: data.rollNo || "23AIDS012",
    studentName: data.studentName || "Rohan Varma",
    department: data.department || "AI&DS",
    semester: data.semester || "Semester 6",
    sgpa: Number(data.sgpa) || 8.90,
    cgpa: Number(data.cgpa) || 8.82,
    totalCredits: 140,
    resultStatus: "Passed (Distinction)",
    backlogCount: 0,
    publishedDate: new Date().toISOString().split("T")[0],
  };
}
