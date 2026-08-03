/**
 * shared-assessment-store.ts
 *
 * A simple module-level singleton array that acts as the bridge between
 * the Recruiter Portal (creates assessments), TPO Approval Center, and
 * Student Live Exam Engine (saves submitted student test scores).
 */

import type { AssessmentRequestRecord } from "@/components/dashboard/role/assessment-requests-approval-page";

export interface StudentSubmissionRecord {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  department: string;
  mcqScore: number;
  mcqTotal: number;
  codingScore: number;
  codingTotal: number;
  totalPercentage: number;
  passStatus: boolean;
  violationsLogged: number;
  isAutoSubmitted: boolean;
  submissionTime: string;
}

/**
 * Shared live queue — contains all assessment requests visible to the TPO.
 */
export const SHARED_ASSESSMENT_REQUESTS: AssessmentRequestRecord[] = [
  {
    id: "REQ-2026-001",
    assessmentId: "AST-2026-GGL-01",
    name: "Google Cloud Aptitude & Coding Round 1",
    recruiterName: "David Miller (Staff Recruiter)",
    recruiterEmail: "david.miller@google.com",
    company: "Google Cloud India",
    companyLogoBg: "bg-blue-600",
    assessmentType: "MCQ + Coding + SQL",
    mcqCount: 35,
    codingCount: 5,
    sqlCount: 5,
    totalQuestions: 45,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 75,
    submittedDate: "2026-07-28",
    priority: "High",
    status: "Submitted",
    version: "v1.2",
    expectedCandidates: 120,
    programmingLanguages: ["Java", "Python", "C++"],
    recruiterNotes: "Priority round for SDE-2 roles",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [{ timestamp: "2026-07-28 09:00", action: "Submitted", actor: "David Miller", notes: "Initial submission" }],
    versionHistory: [{ version: "v1.2", date: "2026-07-28", status: "Submitted", author: "David Miller" }],
  },
  {
    id: "REQ-2026-002",
    assessmentId: "AST-2026-MSF-01",
    name: "Microsoft Software Engineering Technical Test",
    recruiterName: "Ananya Sharma (HR Lead)",
    recruiterEmail: "ananya.sharma@microsoft.com",
    company: "Microsoft India",
    companyLogoBg: "bg-cyan-600",
    assessmentType: "Coding Only",
    mcqCount: 0,
    codingCount: 6,
    sqlCount: 0,
    totalQuestions: 6,
    duration: "120 Mins",
    totalMarks: 120,
    passingMarksPct: 70,
    submittedDate: "2026-07-29",
    priority: "High",
    status: "Under Review",
    version: "v2.0",
    expectedCandidates: 80,
    programmingLanguages: ["C#", "Java", "Python"],
    recruiterNotes: "Azure Cloud focused coding round",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [{ timestamp: "2026-07-29 10:00", action: "Submitted", actor: "Ananya Sharma", notes: "" }],
    versionHistory: [{ version: "v2.0", date: "2026-07-29", status: "Under Review", author: "Ananya Sharma" }],
  },
];

/**
 * Shared array of student test submissions.
 * Stores completed test responses with scores, candidate college email & roll no.
 */
export const SHARED_STUDENT_SUBMISSIONS: StudentSubmissionRecord[] = [
  {
    id: "SUB-2026-6743",
    assessmentId: "AST-GGL-2026-01",
    assessmentTitle: "Google Cloud Systems & Coding Assessment 2026",
    studentName: "K. Sai Teja",
    studentEmail: "23341a4229@college.edu.in",
    rollNo: "23341A4229",
    department: "CSM",
    mcqScore: 0,
    mcqTotal: 20,
    codingScore: 45,
    codingTotal: 50,
    totalPercentage: 64,
    passStatus: true,
    violationsLogged: 0,
    isAutoSubmitted: false,
    submissionTime: "2026-08-03 14:54:16",
  },
  {
    id: "SUB-2026-001",
    assessmentId: "AST-GGL-2026-01",
    assessmentTitle: "Google Cloud Systems & Coding Assessment 2026",
    studentName: "Sneha Reddy",
    studentEmail: "sneha.2022ece042@college.edu.in",
    rollNo: "2022ECE042",
    department: "ECE",
    mcqScore: 18,
    mcqTotal: 20,
    codingScore: 45,
    codingTotal: 50,
    totalPercentage: 90,
    passStatus: true,
    violationsLogged: 0,
    isAutoSubmitted: false,
    submissionTime: "2026-08-01 14:30:12",
  },
  {
    id: "SUB-2026-002",
    assessmentId: "AST-GGL-2026-01",
    assessmentTitle: "Google Cloud Systems & Coding Assessment 2026",
    studentName: "Rahul Verma",
    studentEmail: "rahul.2022cse108@college.edu.in",
    rollNo: "2022CSE108",
    department: "CSE",
    mcqScore: 15,
    mcqTotal: 20,
    codingScore: 40,
    codingTotal: 50,
    totalPercentage: 78,
    passStatus: true,
    violationsLogged: 1,
    isAutoSubmitted: false,
    submissionTime: "2026-08-01 15:10:45",
  },
];

/**
 * Get all student submissions including any saved in localStorage.
 */
export function getAllStudentSubmissions(): StudentSubmissionRecord[] {
  try {
    const raw = localStorage.getItem("edusuite_student_submissions");
    if (raw) {
      const stored: StudentSubmissionRecord[] = JSON.parse(raw);
      const map = new Map<string, StudentSubmissionRecord>();
      [...stored, ...SHARED_STUDENT_SUBMISSIONS].forEach((s) => map.set(s.id, s));
      return Array.from(map.values());
    }
  } catch (err) {
    console.error("Error reading submissions from localStorage", err);
  }
  return SHARED_STUDENT_SUBMISSIONS;
}


/**
 * Push a new recruiter-submitted assessment into the shared queue.
 */
export function pushToSharedQueue(record: AssessmentRequestRecord): void {
  SHARED_ASSESSMENT_REQUESTS.unshift(record);
}

/**
 * Save a student's completed test submission into the shared store.
 */
export function saveStudentSubmission(submission: StudentSubmissionRecord): void {
  // 1. Unshift into memory store
  SHARED_STUDENT_SUBMISSIONS.unshift(submission);

  // 2. Persist in localStorage for persistence across browser refreshes
  try {
    const existingRaw = localStorage.getItem("edusuite_student_submissions");
    const existing: StudentSubmissionRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(submission);
    localStorage.setItem("edusuite_student_submissions", JSON.stringify(existing));
    localStorage.setItem(`edusuite_submitted_exam_${submission.rollNo}`, JSON.stringify(submission));
    localStorage.setItem(`edusuite_submitted_exam_${submission.studentEmail}`, JSON.stringify(submission));
  } catch (err) {
    console.error("Failed to persist student submission in localStorage", err);
  }
}

/**
 * Check if a student (by roll number or email) has already completed an assessment.
 */
export function getStudentExamSubmission(identifier: string): StudentSubmissionRecord | undefined {
  // Check memory array first
  const memoryRecord = SHARED_STUDENT_SUBMISSIONS.find(
    (s) =>
      s.rollNo.toLowerCase() === identifier.toLowerCase() ||
      s.studentEmail.toLowerCase() === identifier.toLowerCase()
  );
  if (memoryRecord) return memoryRecord;

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(`edusuite_submitted_exam_${identifier}`);
    if (raw) return JSON.parse(raw);

    const allRaw = localStorage.getItem("edusuite_student_submissions");
    if (allRaw) {
      const all: StudentSubmissionRecord[] = JSON.parse(allRaw);
      return all.find(
        (s) =>
          s.rollNo.toLowerCase() === identifier.toLowerCase() ||
          s.studentEmail.toLowerCase() === identifier.toLowerCase()
      );
    }
  } catch (err) {
    console.error("Error reading submission from localStorage", err);
  }

  return undefined;
}

/**
 * Update a student submission record (e.g. TPO changing FAILED -> PASSED or updating scores).
 */
export function updateStudentSubmissionRecord(updated: StudentSubmissionRecord): void {
  const index = SHARED_STUDENT_SUBMISSIONS.findIndex((s) => s.id === updated.id);
  if (index !== -1) {
    SHARED_STUDENT_SUBMISSIONS[index] = updated;
  } else {
    SHARED_STUDENT_SUBMISSIONS.unshift(updated);
  }

  try {
    const all = getAllStudentSubmissions();
    const map = new Map<string, StudentSubmissionRecord>();
    all.forEach((s) => map.set(s.id, s));
    map.set(updated.id, updated);
    const updatedArray = Array.from(map.values());
    localStorage.setItem("edusuite_student_submissions", JSON.stringify(updatedArray));
    localStorage.setItem(`edusuite_submitted_exam_${updated.rollNo}`, JSON.stringify(updated));
    localStorage.setItem(`edusuite_submitted_exam_${updated.studentEmail}`, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update student submission in localStorage", err);
  }
}

