// ============================================================
// Student Promotion & Graduation Management — Mock Data
// ============================================================

export type PromotionStatus = "Eligible" | "Pending Review" | "Detained" | "Graduated" | "Not Eligible";
export type GraduationStatus = "Eligible" | "Graduated" | "Pending Credits" | "Ineligible";

export interface EligibilityCheckItem {
  item: string;
  passed: boolean;
  details: string;
}

export interface StudentPromotion {
  studentId: string;
  studentName: string;
  department: string;
  program: string;
  semester: string;
  section: string;
  creditsEarned: number;
  totalCredits: number;
  attendance: number;
  cgpa: number;
  sgpaHistory: { sem: string; sgpa: number }[];
  backlogs: number;
  promotionStatus: PromotionStatus;
  graduationStatus: GraduationStatus;
  eligibilityChecklist: EligibilityCheckItem[];
  degreeStatus: string;
  convocationStatus: "Registered" | "Pending" | "Completed";
  certificateStatus: "Generated" | "Pending Approval" | "Issued";
}

export interface BacklogRecord {
  studentId: string;
  studentName: string;
  department: string;
  semester: string;
  subjectsFailed: string[];
  backlogCount: number;
  supplementaryEligible: boolean;
  maxAttempts: number;
  currentStatus: "Active" | "Cleared" | "Debarred";
}

export interface GraduationRecord {
  studentId: string;
  studentName: string;
  program: string;
  department: string;
  creditsEarned: number;
  totalCredits: number;
  cgpa: number;
  degreeStatus: string;
  graduationEligibility: boolean;
  convocationStatus: "Registered" | "Pending" | "Completed";
  certificateStatus: "Generated" | "Pending Approval" | "Issued";
}

export interface TopPerformer {
  rank: number;
  studentId: string;
  studentName: string;
  department: string;
  cgpa: number;
  achievement: string;
  category: "Top CGPA" | "Dept Topper" | "University Rank" | "Gold Medalist";
}

export interface PromotionNotification {
  id: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
}

// ── 1. PROMOTION ROSTER ──────────────────────────────────────
export const MOCK_STUDENT_PROMOTIONS: StudentPromotion[] = [
  {
    studentId: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester VI",
    section: "CSE-A",
    creditsEarned: 132,
    totalCredits: 132,
    attendance: 94.5,
    cgpa: 9.38,
    sgpaHistory: [
      { sem: "Sem I", sgpa: 9.20 },
      { sem: "Sem II", sgpa: 9.35 },
      { sem: "Sem III", sgpa: 9.40 },
      { sem: "Sem IV", sgpa: 9.50 },
      { sem: "Sem V", sgpa: 9.45 },
    ],
    backlogs: 0,
    promotionStatus: "Eligible",
    graduationStatus: "Eligible",
    degreeStatus: "B.Tech Computer Science & Engg",
    convocationStatus: "Registered",
    certificateStatus: "Generated",
    eligibilityChecklist: [
      { item: "Minimum Credits Earned (>= 120)", passed: true, details: "132 / 132 Credits Completed" },
      { item: "Attendance Requirement (>= 75%)", passed: true, details: "94.5% Attendance" },
      { item: "No Active Disciplinary Hold", passed: true, details: "Clear Clearance Status" },
      { item: "Required Core Subjects Completed", passed: true, details: "All Core Passed" },
      { item: "CGPA Requirement (>= 5.0)", passed: true, details: "9.38 CGPA (First Class w/ Distinction)" },
      { item: "No Pending Active Backlogs", passed: true, details: "0 Active Backlogs" },
    ],
  },
  {
    studentId: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    program: "B.Tech",
    semester: "Semester VI",
    section: "ECE-B",
    creditsEarned: 128,
    totalCredits: 130,
    attendance: 92.0,
    cgpa: 9.12,
    sgpaHistory: [
      { sem: "Sem I", sgpa: 9.00 },
      { sem: "Sem II", sgpa: 9.10 },
      { sem: "Sem III", sgpa: 9.15 },
      { sem: "Sem IV", sgpa: 9.20 },
      { sem: "Sem V", sgpa: 9.12 },
    ],
    backlogs: 0,
    promotionStatus: "Eligible",
    graduationStatus: "Eligible",
    degreeStatus: "B.Tech Electronics & Comm Engg",
    convocationStatus: "Registered",
    certificateStatus: "Generated",
    eligibilityChecklist: [
      { item: "Minimum Credits Earned (>= 120)", passed: true, details: "128 / 130 Credits Completed" },
      { item: "Attendance Requirement (>= 75%)", passed: true, details: "92.0% Attendance" },
      { item: "No Active Disciplinary Hold", passed: true, details: "Clear Clearance Status" },
      { item: "Required Core Subjects Completed", passed: true, details: "All Core Passed" },
      { item: "CGPA Requirement (>= 5.0)", passed: true, details: "9.12 CGPA" },
      { item: "No Pending Active Backlogs", passed: true, details: "0 Active Backlogs" },
    ],
  },
  {
    studentId: "23ME014",
    studentName: "Vikram Aditya",
    department: "ME",
    program: "B.Tech",
    semester: "Semester IV",
    section: "ME-A",
    creditsEarned: 84,
    totalCredits: 90,
    attendance: 78.4,
    cgpa: 7.15,
    sgpaHistory: [
      { sem: "Sem I", sgpa: 7.00 },
      { sem: "Sem II", sgpa: 7.10 },
      { sem: "Sem III", sgpa: 7.20 },
    ],
    backlogs: 0,
    promotionStatus: "Pending Review",
    graduationStatus: "Pending Credits",
    degreeStatus: "B.Tech Mechanical Engg",
    convocationStatus: "Pending",
    certificateStatus: "Pending Approval",
    eligibilityChecklist: [
      { item: "Minimum Credits Earned (>= 80)", passed: true, details: "84 / 90 Credits Completed" },
      { item: "Attendance Requirement (>= 75%)", passed: true, details: "78.4% Attendance" },
      { item: "No Active Disciplinary Hold", passed: true, details: "Clear Clearance Status" },
      { item: "Required Core Subjects Completed", passed: true, details: "All Core Passed" },
      { item: "CGPA Requirement (>= 5.0)", passed: true, details: "7.15 CGPA" },
      { item: "No Pending Active Backlogs", passed: true, details: "0 Active Backlogs" },
    ],
  },
  {
    studentId: "23CSE077",
    studentName: "Priya Nair",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester IV",
    section: "CSE-B",
    creditsEarned: 68,
    totalCredits: 90,
    attendance: 71.0,
    cgpa: 6.10,
    sgpaHistory: [
      { sem: "Sem I", sgpa: 6.50 },
      { sem: "Sem II", sgpa: 6.00 },
      { sem: "Sem III", sgpa: 5.80 },
    ],
    backlogs: 2,
    promotionStatus: "Not Eligible",
    graduationStatus: "Ineligible",
    degreeStatus: "B.Tech Computer Science & Engg",
    convocationStatus: "Pending",
    certificateStatus: "Pending Approval",
    eligibilityChecklist: [
      { item: "Minimum Credits Earned (>= 80)", passed: false, details: "68 / 90 Credits Completed (Shortfall)" },
      { item: "Attendance Requirement (>= 75%)", passed: false, details: "71.0% Attendance (Shortage)" },
      { item: "No Active Disciplinary Hold", passed: true, details: "Clear Clearance Status" },
      { item: "Required Core Subjects Completed", passed: false, details: "CS302 OOP Java Failed" },
      { item: "CGPA Requirement (>= 5.0)", passed: true, details: "6.10 CGPA" },
      { item: "No Pending Active Backlogs", passed: false, details: "2 Active Backlogs" },
    ],
  },
  {
    studentId: "22ME033",
    studentName: "Deepak Rajan",
    department: "ME",
    program: "B.Tech",
    semester: "Semester V",
    section: "ME-B",
    creditsEarned: 92,
    totalCredits: 110,
    attendance: 64.2,
    cgpa: 5.40,
    sgpaHistory: [
      { sem: "Sem I", sgpa: 5.80 },
      { sem: "Sem II", sgpa: 5.50 },
      { sem: "Sem III", sgpa: 5.20 },
      { sem: "Sem IV", sgpa: 5.10 },
    ],
    backlogs: 3,
    promotionStatus: "Detained",
    graduationStatus: "Ineligible",
    degreeStatus: "B.Tech Mechanical Engg",
    convocationStatus: "Pending",
    certificateStatus: "Pending Approval",
    eligibilityChecklist: [
      { item: "Minimum Credits Earned (>= 100)", passed: false, details: "92 / 110 Credits Completed" },
      { item: "Attendance Requirement (>= 75%)", passed: false, details: "64.2% Attendance (Detained)" },
      { item: "No Active Disciplinary Hold", passed: true, details: "Clear Clearance Status" },
      { item: "Required Core Subjects Completed", passed: false, details: "ME410 & ME411 Failed" },
      { item: "CGPA Requirement (>= 5.0)", passed: true, details: "5.40 CGPA" },
      { item: "No Pending Active Backlogs", passed: false, details: "3 Active Backlogs" },
    ],
  },
];

// ── 2. BACKLOG RECORDS ───────────────────────────────────────
export const MOCK_BACKLOG_RECORDS: BacklogRecord[] = [
  {
    studentId: "23CSE077",
    studentName: "Priya Nair",
    department: "CSE",
    semester: "Semester IV",
    subjectsFailed: ["CS302 - OOP through Java", "CS304 - Discrete Structures"],
    backlogCount: 2,
    supplementaryEligible: true,
    maxAttempts: 3,
    currentStatus: "Active",
  },
  {
    studentId: "22ME033",
    studentName: "Deepak Rajan",
    department: "ME",
    semester: "Semester V",
    subjectsFailed: ["ME410 - Fluid Mechanics", "ME411 - Heat Transfer", "ME309 - Thermodynamics II"],
    backlogCount: 3,
    supplementaryEligible: true,
    maxAttempts: 3,
    currentStatus: "Active",
  },
];

// ── 3. GRADUATION RECORDS ────────────────────────────────────
export const MOCK_GRADUATION_RECORDS: GraduationRecord[] = [
  {
    studentId: "22CSE001",
    studentName: "Aarav Sharma",
    program: "B.Tech",
    department: "CSE",
    creditsEarned: 132,
    totalCredits: 132,
    cgpa: 9.38,
    degreeStatus: "First Class with Distinction",
    graduationEligibility: true,
    convocationStatus: "Registered",
    certificateStatus: "Generated",
  },
  {
    studentId: "22ECE042",
    studentName: "Ananya Iyer",
    program: "B.Tech",
    department: "ECE",
    creditsEarned: 128,
    totalCredits: 130,
    cgpa: 9.12,
    degreeStatus: "First Class with Distinction",
    graduationEligibility: true,
    convocationStatus: "Registered",
    certificateStatus: "Generated",
  },
  {
    studentId: "22AIDS011",
    studentName: "Rohan Varma",
    program: "B.Tech",
    department: "AI&DS",
    creditsEarned: 130,
    totalCredits: 130,
    cgpa: 8.82,
    degreeStatus: "First Class with Distinction",
    graduationEligibility: true,
    convocationStatus: "Registered",
    certificateStatus: "Generated",
  },
];

// ── 4. TOP PERFORMERS / LEADERBOARD ──────────────────────────
export const MOCK_TOP_PERFORMERS: TopPerformer[] = [
  { rank: 1, studentId: "22CSE001", studentName: "Aarav Sharma", department: "CSE", cgpa: 9.38, achievement: "Gold Medalist & University Topper", category: "Gold Medalist" },
  { rank: 2, studentId: "22ECE042", studentName: "Ananya Iyer", department: "ECE", cgpa: 9.12, achievement: "Silver Medalist & ECE Topper", category: "Dept Topper" },
  { rank: 3, studentId: "22AIDS011", studentName: "Rohan Varma", department: "AI&DS", cgpa: 8.82, achievement: "AI&DS Department Topper", category: "Dept Topper" },
  { rank: 4, studentId: "22CSE019", studentName: "Kavitha Reddy", department: "CSE", cgpa: 8.75, achievement: "Distinction Rank Holder", category: "Top CGPA" },
  { rank: 5, studentId: "22ECE055", studentName: "Surya Teja", department: "ECE", cgpa: 8.60, achievement: "Distinction Rank Holder", category: "Top CGPA" },
];

// ── 5. NOTIFICATIONS ─────────────────────────────────────────
export const MOCK_PROMOTION_NOTIFICATIONS: PromotionNotification[] = [
  { id: "n1", message: "Semester VI promotion eligibility check completed. 89% eligible.", time: "10 mins ago", type: "success" },
  { id: "n2", message: "Graduation candidate list for Class of 2026 approved by Academic Manager.", time: "1 hour ago", type: "success" },
  { id: "n3", message: "2 students identified as detained due to attendance shortage (<65%).", time: "3 hours ago", type: "warning" },
  { id: "n4", message: "Backlog review pending for 5 students in ME department.", time: "Yesterday", type: "info" },
];

// ── 6. CHARTS DATASET ────────────────────────────────────────
export const PROMOTION_RATE_BY_DEPT = [
  { name: "CSE", Eligible: 94, Detained: 2, Pending: 4 },
  { name: "ECE", Eligible: 91, Detained: 3, Pending: 6 },
  { name: "AI&DS", Eligible: 92, Detained: 1, Pending: 7 },
  { name: "ME", Eligible: 81, Detained: 9, Pending: 10 },
  { name: "CIVIL", Eligible: 84, Detained: 6, Pending: 10 },
];

export const GRADUATION_ELIGIBILITY_CHART = [
  { name: "Eligible (Distinction)", value: 45 },
  { name: "Eligible (First Class)", value: 35 },
  { name: "Pending Credits", value: 12 },
  { name: "Ineligible / Backlogs", value: 8 },
];
