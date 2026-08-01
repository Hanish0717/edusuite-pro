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
 * Push a new recruiter-submitted assessment into the shared queue.
 */
export function pushToSharedQueue(record: AssessmentRequestRecord): void {
  SHARED_ASSESSMENT_REQUESTS.unshift(record);
}

/**
 * Save a student's completed test submission into the shared store.
 */
export function saveStudentSubmission(submission: StudentSubmissionRecord): void {
  SHARED_STUDENT_SUBMISSIONS.unshift(submission);
}
