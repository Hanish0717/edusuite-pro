// ============================================================
// Academic Settings & System Configuration — Mock Data
// ============================================================

export interface AcademicYearConfig {
  currentYear: string;
  upcomingYear: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Archived";
}

export interface SemesterConfig {
  id: string;
  semesterNumber: number;
  semesterName: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: "Active" | "Upcoming" | "Completed" | "Archived";
}

export interface ProgramRegulation {
  id: string;
  program: string;
  regulation: string; // e.g. R22, R25
  effectiveYear: string;
  revisionHistory: string[];
  status: "Active" | "Draft" | "Deprecated";
}

export interface CreditSystemConfig {
  minCreditsPerSem: number;
  maxCreditsPerSem: number;
  electiveCredits: number;
  labCredits: number;
  projectCredits: number;
  internshipCredits: number;
  totalGraduationCredits: number;
}

export interface GradeRow {
  grade: string;
  gradePoint: number;
  marksRange: string;
  resultStatus: "Pass" | "Fail" | "Distinction";
}

export interface AttendancePolicyConfig {
  minAttendancePct: number;
  warningPct: number;
  medicalLeavePct: number;
  odLeavePct: number;
  sportsLeavePct: number;
  detentionRule: string;
  condonationRule: string;
}

export interface PromotionRulesConfig {
  minCreditsToPromote: number;
  maxBacklogsAllowed: number;
  minCgpaRequired: number;
  attendanceRequirementPct: number;
  supplementaryRules: string;
  graduationCriteria: string;
}

export interface ExamRulesConfig {
  internalWeightage: number;
  externalWeightage: number;
  passingMarks: number;
  graceMarksAllowed: number;
  revaluationWindowDays: number;
  improvementExamAllowed: boolean;
}

export interface SettingsHistoryRecord {
  id: string;
  settingName: string;
  oldValue: string;
  newValue: string;
  updatedBy: string;
  updatedDate: string;
}

// ── 1. ACADEMIC YEAR DEFAULT ────────────────────────────────
export const DEFAULT_ACADEMIC_YEAR: AcademicYearConfig = {
  currentYear: "2026-27",
  upcomingYear: "2027-28",
  startDate: "2026-08-01",
  endDate: "2027-05-31",
  status: "Active",
};

// ── 2. SEMESTERS LIST ────────────────────────────────────────
export const MOCK_SEMESTER_CONFIGS: SemesterConfig[] = [
  { id: "sem-1", semesterNumber: 1, semesterName: "Semester I (Autumn)", startDate: "2026-08-01", endDate: "2026-12-15", registrationDeadline: "2026-08-15", status: "Active" },
  { id: "sem-3", semesterNumber: 3, semesterName: "Semester III (Autumn)", startDate: "2026-08-01", endDate: "2026-12-15", registrationDeadline: "2026-08-15", status: "Active" },
  { id: "sem-5", semesterNumber: 5, semesterName: "Semester V (Autumn)", startDate: "2026-08-01", endDate: "2026-12-15", registrationDeadline: "2026-08-15", status: "Active" },
  { id: "sem-7", semesterNumber: 7, semesterName: "Semester VII (Autumn)", startDate: "2026-08-01", endDate: "2026-12-15", registrationDeadline: "2026-08-15", status: "Active" },
  { id: "sem-2", semesterNumber: 2, semesterName: "Semester II (Spring)", startDate: "2027-01-05", endDate: "2027-05-20", registrationDeadline: "2027-01-15", status: "Upcoming" },
];

// ── 3. REGULATIONS ───────────────────────────────────────────
export const MOCK_REGULATIONS: ProgramRegulation[] = [
  { id: "reg-1", program: "B.Tech Computer Science & Engg", regulation: "R25 Choice Based Credit System (CBCS)", effectiveYear: "2025", revisionHistory: ["R22 Revised", "R25 Adopted"], status: "Active" },
  { id: "reg-2", program: "B.Tech Electronics & Comm", regulation: "R25 Choice Based Credit System (CBCS)", effectiveYear: "2025", revisionHistory: ["R22 Revised", "R25 Adopted"], status: "Active" },
  { id: "reg-3", program: "M.Tech Software Engineering", regulation: "R26 Outcome Based Education (OBE)", effectiveYear: "2026", revisionHistory: ["R26 Drafted"], status: "Active" },
];

// ── 4. CREDIT SYSTEM DEFAULTS ────────────────────────────────
export const DEFAULT_CREDIT_CONFIG: CreditSystemConfig = {
  minCreditsPerSem: 18,
  maxCreditsPerSem: 26,
  electiveCredits: 24,
  labCredits: 30,
  projectCredits: 16,
  internshipCredits: 8,
  totalGraduationCredits: 160,
};

// ── 5. GRADING SYSTEM TABLE ──────────────────────────────────
export const MOCK_GRADING_TABLE: GradeRow[] = [
  { grade: "O", gradePoint: 10.0, marksRange: "90% - 100%", resultStatus: "Distinction" },
  { grade: "A+", gradePoint: 9.0, marksRange: "80% - 89%", resultStatus: "Distinction" },
  { grade: "A", gradePoint: 8.0, marksRange: "70% - 79%", resultStatus: "Pass" },
  { grade: "B+", gradePoint: 7.0, marksRange: "60% - 69%", resultStatus: "Pass" },
  { grade: "B", gradePoint: 6.0, marksRange: "55% - 59%", resultStatus: "Pass" },
  { grade: "C", gradePoint: 5.0, marksRange: "50% - 54%", resultStatus: "Pass" },
  { grade: "F", gradePoint: 0.0, marksRange: "0% - 49%", resultStatus: "Fail" },
];

// ── 6. ATTENDANCE POLICY DEFAULTS ────────────────────────────
export const DEFAULT_ATTENDANCE_POLICY: AttendancePolicyConfig = {
  minAttendancePct: 75,
  warningPct: 65,
  medicalLeavePct: 10,
  odLeavePct: 15,
  sportsLeavePct: 10,
  detentionRule: "Students below 65% attendance are automatically detained from end-semester examinations without condonation.",
  condonationRule: "Attendance between 65% and 74% can be condoned by the Academic Manager on medical or institutional OD grounds.",
};

// ── 7. PROMOTION RULES DEFAULTS ──────────────────────────────
export const DEFAULT_PROMOTION_RULES: PromotionRulesConfig = {
  minCreditsToPromote: 120,
  maxBacklogsAllowed: 3,
  minCgpaRequired: 5.0,
  attendanceRequirementPct: 75,
  supplementaryRules: "Max 2 attempts allowed for supplementary examinations per subject.",
  graduationCriteria: "Successful completion of 160 credits, no active backlogs, CGPA >= 5.0, and cleared disciplinary record.",
};

// ── 8. EXAM RULES DEFAULTS ───────────────────────────────────
export const DEFAULT_EXAM_RULES: ExamRulesConfig = {
  internalWeightage: 40,
  externalWeightage: 60,
  passingMarks: 40,
  graceMarksAllowed: 3,
  revaluationWindowDays: 15,
  improvementExamAllowed: true,
};

// ── 9. SETTINGS HISTORY ──────────────────────────────────────
export const MOCK_SETTINGS_HISTORY: SettingsHistoryRecord[] = [
  { id: "hist-1", settingName: "Minimum Attendance %", oldValue: "70%", newValue: "75%", updatedBy: "Dr. S. R. Krishnan", updatedDate: "2026-08-02" },
  { id: "hist-2", settingName: "Revaluation Window", oldValue: "10 Days", newValue: "15 Days", updatedBy: "Dr. S. R. Krishnan", updatedDate: "2026-07-28" },
  { id: "hist-3", settingName: "B.Tech Total Graduation Credits", oldValue: "165 Credits", newValue: "160 Credits", updatedBy: "Academic Council", updatedDate: "2026-07-15" },
];
