/**
 * shared-assessment-store.ts
 *
 * A simple module-level singleton array that acts as the bridge between
 * the Recruiter Portal (creates assessments) and the TPO Approval Center
 * (reviews them).  Both modules import and mutate this same reference,
 * so a recruiter-created assessment is immediately visible to the TPO.
 */

import type { AssessmentRequestRecord } from "@/components/dashboard/role/assessment-requests-approval-page";

/**
 * Shared live queue — contains all assessment requests visible to the TPO.
 * Pre-seeded with the four canonical sample records (kept in sync with the
 * static array previously inside assessment-requests-approval-page.tsx).
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
  {
    id: "REQ-2026-003",
    assessmentId: "AST-2026-AMZ-01",
    name: "Amazon AWS System Design & DSA Assessment",
    recruiterName: "Samantha Wright (Talent Manager)",
    recruiterEmail: "samantha.wright@amazon.com",
    company: "Amazon AWS",
    companyLogoBg: "bg-amber-500",
    assessmentType: "MCQ + Coding + SQL",
    mcqCount: 20,
    codingCount: 10,
    sqlCount: 8,
    totalQuestions: 38,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 65,
    submittedDate: "2026-07-25",
    priority: "Medium",
    status: "Changes Requested",
    version: "v1.0",
    expectedCandidates: 200,
    programmingLanguages: ["Java", "Python", "Go"],
    recruiterNotes: "System Design + DSA combo",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [{ timestamp: "2026-07-25 11:00", action: "Submitted", actor: "Samantha Wright", notes: "" }],
    versionHistory: [{ version: "v1.0", date: "2026-07-25", status: "Changes Requested", author: "Samantha Wright" }],
  },
  {
    id: "REQ-2026-004",
    assessmentId: "AST-2026-QLC-01",
    name: "Qualcomm Hardware & Embedded C Assessment",
    recruiterName: "Rajesh Kumar (Technical Lead)",
    recruiterEmail: "rajesh.kumar@qualcomm.com",
    company: "Qualcomm India",
    companyLogoBg: "bg-rose-600",
    assessmentType: "Aptitude & MCQ",
    mcqCount: 52,
    codingCount: 0,
    sqlCount: 0,
    totalQuestions: 52,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 70,
    submittedDate: "2026-07-26",
    priority: "Standard",
    status: "Approved",
    version: "v1.1",
    expectedCandidates: 60,
    programmingLanguages: ["C", "C++"],
    recruiterNotes: "Embedded systems + DSP focused",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [{ timestamp: "2026-07-26 14:00", action: "Approved", actor: "Dr. Ravi Kumar (TPO)", notes: "All sections verified" }],
    versionHistory: [{ version: "v1.1", date: "2026-07-26", status: "Approved", author: "Rajesh Kumar" }],
  },
];

/**
 * Push a new recruiter-submitted assessment into the shared queue.
 * Called by the Recruiter Portal when a new assessment is created.
 */
export function pushToSharedQueue(record: AssessmentRequestRecord): void {
  SHARED_ASSESSMENT_REQUESTS.unshift(record);
}
