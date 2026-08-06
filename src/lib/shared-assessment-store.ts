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

export interface StudentDriveApplication {
  id: string;
  formId: string;
  driveTitle: string;
  companyName: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  rollNo: string;
  department: string;
  
  // 10th Standard Details
  tenthSchoolName: string;
  tenthBoard: string;
  tenthPercentage: number;
  tenthYearOfPassing: string;
  
  // Stream Toggle: Intermediate vs Diploma
  qualificationStream: "Intermediate" | "Diploma";
  
  // Inter details
  interCollegeName?: string | undefined;
  interBoard?: string | undefined;
  interPercentage?: number | undefined;
  interYearOfPassing?: string | undefined;
  
  // Diploma details
  diplomaCollegeName?: string | undefined;
  diplomaBranch?: string | undefined;
  diplomaPercentage?: number | undefined;
  diplomaYearOfPassing?: string | undefined;

  // Upload Metadata
  resumeFileName: string;
  passportPhotoUrl: string;
  
  submittedAt: string;
}

export interface DriveApplicationForm {
  id: string;
  driveId: string;
  title: string;
  company: string;
  role: string;
  ctc: string;
  deadlineDate: string;
  instructions: string;
  googleFormUrl?: string | undefined;
  status: "Draft" | "Sent to TPO" | "Dispatched to Students" | "Expired";
  createdDate: string;
  applicantCount: number;
}

export const SHARED_DRIVE_APPLICATION_FORMS: DriveApplicationForm[] = [
  {
    id: "APP-FORM-2026-GGL",
    driveId: "DRV-GGL-01",
    title: "Google Cloud SDE Placement Drive Registration 2026",
    company: "Google Cloud India",
    role: "Software Engineer I (Cloud Solutions)",
    ctc: "₹32.0 LPA",
    deadlineDate: "2026-08-10 23:59",
    instructions: "Please submit this registration form using your official college email address. Eligible applicants will receive the assessment link automatically after the registration deadline expires.",
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-GoogleCloudPlacementForm2026/viewform",
    status: "Dispatched to Students",
    createdDate: "2026-08-01",
    applicantCount: 9,
  },
];

export const SHARED_STUDENT_DRIVE_APPLICATIONS: StudentDriveApplication[] = [
  {
    id: "APP-REC-005",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Rohan Verma",
    studentEmail: "rohan.2022cse054@college.edu.in",
    phone: "+91 98450 11223",
    rollNo: "2022CSE054",
    department: "CSE",
    tenthSchoolName: "Little Flower High School, Abids",
    tenthBoard: "SSC Telangana",
    tenthPercentage: 92.5,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "Sri Chaitanya Junior College",
    interBoard: "TS BIE",
    interPercentage: 94.2,
    interYearOfPassing: "2022",
    resumeFileName: "Rohan_Verma_Resume_SDE.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 11:30",
  },
  {
    id: "APP-REC-006",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Pooja Hegde",
    studentEmail: "pooja.2022csm022@college.edu.in",
    phone: "+91 97011 22334",
    rollNo: "2022CSM022",
    department: "CSM",
    tenthSchoolName: "St. Ann's High School, Secunderabad",
    tenthBoard: "CBSE",
    tenthPercentage: 96.0,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "Narayana Junior College, Madhapur",
    interBoard: "TS BIE",
    interPercentage: 98.1,
    interYearOfPassing: "2022",
    resumeFileName: "Pooja_Hegde_AIML_CV.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 12:15",
  },
  {
    id: "APP-REC-007",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Karthik Rao",
    studentEmail: "karthik.2022ece088@college.edu.in",
    phone: "+91 99633 44556",
    rollNo: "2022ECE088",
    department: "ECE",
    tenthSchoolName: "Gowtham Model School, Koti",
    tenthBoard: "SSC Telangana",
    tenthPercentage: 91.0,
    tenthYearOfPassing: "2020",
    qualificationStream: "Diploma",
    diplomaCollegeName: "Govt Polytechnic Masab Tank",
    diplomaBranch: "Electronics & Communication",
    diplomaPercentage: 90.4,
    diplomaYearOfPassing: "2023",
    resumeFileName: "Karthik_Rao_ECE_Resume.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 13:00",
  },
  {
    id: "APP-REC-008",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Divya Sree",
    studentEmail: "divya.2022inf012@college.edu.in",
    phone: "+91 96522 77889",
    rollNo: "2022INF012",
    department: "IT",
    tenthSchoolName: "Kendriya Vidyalaya Begumpet",
    tenthBoard: "CBSE",
    tenthPercentage: 93.8,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "Narayana Junior College, Kukatpally",
    interBoard: "TS BIE",
    interPercentage: 95.5,
    interYearOfPassing: "2022",
    resumeFileName: "Divya_Sree_IT_Resume.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 13:45",
  },
  {
    id: "APP-REC-009",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Manish Kumar",
    studentEmail: "manish.2022csd031@college.edu.in",
    phone: "+91 98855 66778",
    rollNo: "2022CSD031",
    department: "CSD",
    tenthSchoolName: "Hyderabad Public School (HPS), Begumpet",
    tenthBoard: "ICSE",
    tenthPercentage: 97.2,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "FIITJEE World School, Jubilee Hills",
    interBoard: "TS BIE",
    interPercentage: 96.4,
    interYearOfPassing: "2022",
    resumeFileName: "Manish_Kumar_DataScience.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 14:20",
  },
  {
    id: "APP-REC-004",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Ananya Sharma",
    studentEmail: "ananya.2022cse099@college.edu.in",
    phone: "+91 97766 55443",
    rollNo: "2022CSE099",
    department: "CSE",
    tenthSchoolName: "Delhi Public School, Nacharam",
    tenthBoard: "CBSE",
    tenthPercentage: 95.2,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "FIITJEE Junior College, Hyderabad",
    interBoard: "TS BIE",
    interPercentage: 96.8,
    interYearOfPassing: "2022",
    resumeFileName: "Ananya_Sharma_SDE_Resume.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-04 10:15",
  },
  {
    id: "APP-REC-001",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "K. Sai Teja",
    studentEmail: "23341a4229@college.edu.in",
    phone: "+91 98765 43210",
    rollNo: "23341A4229",
    department: "CSM",
    tenthSchoolName: "St. Johns High School, Hyderabad",
    tenthBoard: "SSC Telangana",
    tenthPercentage: 94.5,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "Narayana Junior College",
    interBoard: "TS BIE",
    interPercentage: 96.2,
    interYearOfPassing: "2022",
    resumeFileName: "Sai_Teja_Resume_2026.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-02 11:30",
  },
  {
    id: "APP-REC-002",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Sneha Reddy",
    studentEmail: "sneha.2022ece042@college.edu.in",
    phone: "+91 98123 45678",
    rollNo: "2022ECE042",
    department: "ECE",
    tenthSchoolName: "Kendriya Vidyalaya, Uppal",
    tenthBoard: "CBSE",
    tenthPercentage: 92.0,
    tenthYearOfPassing: "2020",
    qualificationStream: "Diploma",
    diplomaCollegeName: "Govt Polytechnic Hyderabad",
    diplomaBranch: "Electronics & Communication",
    diplomaPercentage: 89.5,
    diplomaYearOfPassing: "2023",
    resumeFileName: "Sneha_Reddy_Resume.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-02 14:15",
  },
  {
    id: "APP-REC-003",
    formId: "APP-FORM-2026-GGL",
    driveTitle: "Google Cloud SDE Placement Drive Registration 2026",
    companyName: "Google Cloud India",
    studentName: "Vikram Malhotra",
    studentEmail: "vikram.2022cse015@college.edu.in",
    phone: "+91 99887 76655",
    rollNo: "2022CSE015",
    department: "CSE",
    tenthSchoolName: "Chaitanya Techno School",
    tenthBoard: "CBSE",
    tenthPercentage: 96.8,
    tenthYearOfPassing: "2020",
    qualificationStream: "Intermediate",
    interCollegeName: "Sri Chaitanya Junior College",
    interBoard: "TS BIE",
    interPercentage: 97.4,
    interYearOfPassing: "2022",
    resumeFileName: "Vikram_Malhotra_CV.pdf",
    passportPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    submittedAt: "2026-08-03 09:45",
  },
];

export function saveStudentDriveApplication(app: StudentDriveApplication) {
  SHARED_STUDENT_DRIVE_APPLICATIONS.unshift(app);
  const form = SHARED_DRIVE_APPLICATION_FORMS.find((f) => f.id === app.formId);
  if (form) {
    form.applicantCount += 1;
  }
}

export function createDriveApplicationForm(form: DriveApplicationForm) {
  SHARED_DRIVE_APPLICATION_FORMS.unshift(form);
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

