// ============================================================
// Result Management & Analytics — Mock Data
// Replace these exports with API responses for backend integration
// GET /results | GET /results/:id | GET /backlogs | GET /merit-list
// ============================================================

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxMarks: number;
  credits: number;
  grade: string;
  result: "Pass" | "Fail";
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  department: string;
  program: string;
  semester: string;
  section: string;
  academicYear: string;
  examType: string;
  subjects: SubjectMark[];
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  cgpa: number;
  percentage: number;
  backlogs: number;
  result: "Pass" | "Fail" | "Distinction" | "First Class" | "Second Class";
  status: "Draft" | "Pending Review" | "Approved" | "Published";
  rank?: number;
}

export interface BacklogStudent {
  studentId: string;
  studentName: string;
  department: string;
  semester: string;
  subjectsFailed: string[];
  backlogCount: number;
  supplementaryEligible: boolean;
  status: "Active" | "Cleared" | "Debarred";
}

export interface MeritEntry {
  rank: number;
  studentId: string;
  studentName: string;
  department: string;
  cgpa: number;
  percentage: number;
  achievements: string[];
}

export interface SubjectPerformance {
  subjectCode: string;
  subjectName: string;
  department: string;
  faculty: string;
  passPercent: number;
  failPercent: number;
  highestMarks: number;
  lowestMarks: number;
  averageMarks: number;
}

export interface ResultNotification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
}

// ── Student Results ──────────────────────────────────────────
export const MOCK_STUDENT_RESULTS: StudentResult[] = [
  {
    studentId: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester VI",
    section: "CSE-A",
    academicYear: "2025-2026",
    examType: "End Semester Examination",
    subjects: [
      { subjectCode: "CS501", subjectName: "Computer Networks", internalMarks: 48, externalMarks: 72, totalMarks: 120, maxMarks: 150, credits: 4, grade: "O", result: "Pass" },
      { subjectCode: "CS502", subjectName: "Web Technologies", internalMarks: 45, externalMarks: 68, totalMarks: 113, maxMarks: 150, credits: 3, grade: "A+", result: "Pass" },
      { subjectCode: "CS503", subjectName: "Compiler Design", internalMarks: 50, externalMarks: 75, totalMarks: 125, maxMarks: 150, credits: 4, grade: "O", result: "Pass" },
    ],
    totalCredits: 22,
    earnedCredits: 22,
    sgpa: 9.45,
    cgpa: 9.38,
    percentage: 92.4,
    backlogs: 0,
    result: "Distinction",
    status: "Published",
    rank: 1,
  },
  {
    studentId: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    program: "B.Tech",
    semester: "Semester VI",
    section: "ECE-B",
    academicYear: "2025-2026",
    examType: "End Semester Examination",
    subjects: [
      { subjectCode: "EC304", subjectName: "VLSI System Design", internalMarks: 44, externalMarks: 70, totalMarks: 114, maxMarks: 150, credits: 4, grade: "O", result: "Pass" },
      { subjectCode: "EC305", subjectName: "Digital Signal Processing", internalMarks: 42, externalMarks: 65, totalMarks: 107, maxMarks: 150, credits: 4, grade: "A+", result: "Pass" },
    ],
    totalCredits: 20,
    earnedCredits: 20,
    sgpa: 9.20,
    cgpa: 9.12,
    percentage: 88.5,
    backlogs: 0,
    result: "Distinction",
    status: "Published",
    rank: 2,
  },
  {
    studentId: "23ME014",
    studentName: "Vikram Aditya",
    department: "ME",
    program: "B.Tech",
    semester: "Semester IV",
    section: "ME-A",
    academicYear: "2025-2026",
    examType: "End Semester Examination",
    subjects: [
      { subjectCode: "ME308", subjectName: "Computer Aided Design", internalMarks: 35, externalMarks: 52, totalMarks: 87, maxMarks: 150, credits: 3, grade: "B+", result: "Pass" },
      { subjectCode: "ME309", subjectName: "Thermodynamics II", internalMarks: 30, externalMarks: 44, totalMarks: 74, maxMarks: 150, credits: 4, grade: "B", result: "Pass" },
    ],
    totalCredits: 18,
    earnedCredits: 18,
    sgpa: 7.20,
    cgpa: 7.15,
    percentage: 68.2,
    backlogs: 0,
    result: "First Class",
    status: "Approved",
  },
  {
    studentId: "23CSE077",
    studentName: "Priya Nair",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester IV",
    section: "CSE-B",
    academicYear: "2025-2026",
    examType: "Mid Examination",
    subjects: [
      { subjectCode: "CS301", subjectName: "Database Management", internalMarks: 18, externalMarks: 28, totalMarks: 46, maxMarks: 100, credits: 4, grade: "C", result: "Pass" },
      { subjectCode: "CS302", subjectName: "OOP through Java", internalMarks: 12, externalMarks: 20, totalMarks: 32, maxMarks: 100, credits: 3, grade: "F", result: "Fail" },
    ],
    totalCredits: 20,
    earnedCredits: 17,
    sgpa: 5.80,
    cgpa: 6.10,
    percentage: 52.3,
    backlogs: 1,
    result: "Second Class",
    status: "Pending Review",
  },
  {
    studentId: "22AIDS011",
    studentName: "Rohan Varma",
    department: "AI&DS",
    program: "B.Tech",
    semester: "Semester VI",
    section: "AIDS-A",
    academicYear: "2025-2026",
    examType: "End Semester Examination",
    subjects: [
      { subjectCode: "AI401", subjectName: "Deep Learning", internalMarks: 46, externalMarks: 71, totalMarks: 117, maxMarks: 150, credits: 4, grade: "O", result: "Pass" },
      { subjectCode: "AI402", subjectName: "NLP Foundations", internalMarks: 40, externalMarks: 62, totalMarks: 102, maxMarks: 150, credits: 3, grade: "A", result: "Pass" },
    ],
    totalCredits: 20,
    earnedCredits: 20,
    sgpa: 8.90,
    cgpa: 8.82,
    percentage: 84.6,
    backlogs: 0,
    result: "Distinction",
    status: "Draft",
  },
];

// ── Backlog Students ─────────────────────────────────────────
export const MOCK_BACKLOG_STUDENTS: BacklogStudent[] = [
  {
    studentId: "23CSE077",
    studentName: "Priya Nair",
    department: "CSE",
    semester: "Semester IV",
    subjectsFailed: ["CS302 - OOP through Java"],
    backlogCount: 1,
    supplementaryEligible: true,
    status: "Active",
  },
  {
    studentId: "22ME033",
    studentName: "Deepak Rajan",
    department: "ME",
    semester: "Semester V",
    subjectsFailed: ["ME410 - Fluid Mechanics", "ME411 - Heat Transfer"],
    backlogCount: 2,
    supplementaryEligible: true,
    status: "Active",
  },
];

// ── Merit List ───────────────────────────────────────────────
export const MOCK_MERIT_LIST: MeritEntry[] = [
  { rank: 1, studentId: "22CSE001", studentName: "Aarav Sharma", department: "CSE", cgpa: 9.38, percentage: 92.4, achievements: ["Gold Medalist", "University Topper"] },
  { rank: 2, studentId: "22ECE042", studentName: "Ananya Iyer", department: "ECE", cgpa: 9.12, percentage: 88.5, achievements: ["Silver Medalist", "ECE Dept. Topper"] },
  { rank: 3, studentId: "22AIDS011", studentName: "Rohan Varma", department: "AI&DS", cgpa: 8.82, percentage: 84.6, achievements: ["AI&DS Dept. Topper"] },
  { rank: 4, studentId: "22CSE019", studentName: "Kavitha Reddy", department: "CSE", cgpa: 8.75, percentage: 83.1, achievements: ["First Class with Distinction"] },
  { rank: 5, studentId: "22ECE055", studentName: "Surya Teja", department: "ECE", cgpa: 8.60, percentage: 81.4, achievements: ["First Class with Distinction"] },
];

// ── Subject Performance ──────────────────────────────────────
export const MOCK_SUBJECT_PERFORMANCE: SubjectPerformance[] = [
  { subjectCode: "CS501", subjectName: "Computer Networks", department: "CSE", faculty: "Dr. K. Sai Teja", passPercent: 94, failPercent: 6, highestMarks: 125, lowestMarks: 42, averageMarks: 98 },
  { subjectCode: "EC304", subjectName: "VLSI System Design", department: "ECE", faculty: "Dr. Meera Rao", passPercent: 88, failPercent: 12, highestMarks: 118, lowestMarks: 38, averageMarks: 91 },
  { subjectCode: "ME309", subjectName: "Thermodynamics II", department: "ME", faculty: "Dr. S. Rajan", passPercent: 72, failPercent: 28, highestMarks: 105, lowestMarks: 28, averageMarks: 76 },
  { subjectCode: "CS302", subjectName: "OOP through Java", department: "CSE", faculty: "Ms. Ananya Verma", passPercent: 79, failPercent: 21, highestMarks: 112, lowestMarks: 32, averageMarks: 83 },
  { subjectCode: "AI401", subjectName: "Deep Learning", department: "AI&DS", faculty: "Dr. S. K. Gupta", passPercent: 91, failPercent: 9, highestMarks: 122, lowestMarks: 45, averageMarks: 95 },
];

// ── Analytics Chart Data ─────────────────────────────────────
export const DEPT_PASS_RATE_DATA = [
  { name: "CSE", PassRate: 94 },
  { name: "ECE", PassRate: 88 },
  { name: "ME", PassRate: 76 },
  { name: "AI&DS", PassRate: 91 },
  { name: "CIVIL", PassRate: 82 },
];

export const SEM_PASS_RATE_DATA = [
  { name: "Sem I", PassRate: 89 },
  { name: "Sem II", PassRate: 85 },
  { name: "Sem III", PassRate: 82 },
  { name: "Sem IV", PassRate: 80 },
  { name: "Sem V", PassRate: 87 },
  { name: "Sem VI", PassRate: 91 },
];

export const GRADE_DISTRIBUTION_DATA = [
  { name: "O (Outstanding)", value: 18 },
  { name: "A+ (Excellent)", value: 32 },
  { name: "A (Very Good)", value: 25 },
  { name: "B+ (Good)", value: 14 },
  { name: "B (Average)", value: 7 },
  { name: "F (Fail)", value: 4 },
];

export const CGPA_DISTRIBUTION_DATA = [
  { name: "9.0 - 10.0", value: 8 },
  { name: "8.0 - 8.99", value: 22 },
  { name: "7.0 - 7.99", value: 31 },
  { name: "6.0 - 6.99", value: 24 },
  { name: "Below 6.0", value: 15 },
];

// ── Notifications ────────────────────────────────────────────
export const MOCK_RESULT_NOTIFICATIONS: ResultNotification[] = [
  { id: "n1", message: "CSE Semester VI results are awaiting Academic Manager approval.", type: "warning", time: "10 mins ago" },
  { id: "n2", message: "ECE Semester VI results published successfully to student portals.", type: "success", time: "2 hours ago" },
  { id: "n3", message: "2 students identified with backlogs in Semester IV batch.", type: "warning", time: "4 hours ago" },
  { id: "n4", message: "ME Department result submission completed by faculty.", type: "info", time: "Yesterday" },
  { id: "n5", message: "Result revision request received for CS302 from Dr. Ananya.", type: "info", time: "Yesterday" },
];
