export interface NptelCertificateRecord {
  id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  certificatePdfUrl: string;
  fileName: string;
  fileSize: string;
  comments: string;
  submissionDate: string;
  verificationStatus: "Submitted" | "Verified" | "Rejected";
  verifiedBy?: string;
  verificationDate?: string;
}

// In-memory / Mock database table for NPTEL Submissions
export const MOCK_NPTEL_CERTIFICATE_TABLE: Record<string, NptelCertificateRecord> = {};

/**
 * Upload & Store NPTEL Certificate entity
 */
export function uploadNptelCertificate(data: {
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  fileName: string;
  fileSize: string;
  pdfUrl: string;
  comments: string;
}): NptelCertificateRecord {
  const id = `nptel-${data.courseId}-${Date.now()}`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const record: NptelCertificateRecord = {
    id,
    studentId: data.studentId,
    courseId: data.courseId,
    courseCode: data.courseCode,
    courseName: data.courseName,
    certificatePdfUrl: data.pdfUrl,
    fileName: data.fileName,
    fileSize: data.fileSize,
    comments: data.comments,
    submissionDate: today,
    verificationStatus: "Verified", // Automatically verified upon valid upload in ERP demo
    verifiedBy: "Dr. A. K. Sharma (NPTEL Coordinator)",
    verificationDate: today,
  };

  MOCK_NPTEL_CERTIFICATE_TABLE[data.courseId] = record;
  return record;
}

/**
 * Admin / Faculty API to verify NPTEL Certificate
 */
export function verifyNptelCertificate(
  courseId: string,
  status: "Verified" | "Rejected",
  verifiedBy: string = "NPTEL Academic Committee"
): NptelCertificateRecord | null {
  const record = MOCK_NPTEL_CERTIFICATE_TABLE[courseId];
  if (!record) return null;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  record.verificationStatus = status;
  record.verifiedBy = verifiedBy;
  record.verificationDate = today;

  return record;
}

/**
 * Check if a course is exempted from exams due to completed/submitted NPTEL certificate
 */
export function isCourseNptelExempted(
  courseId: string,
  declarationsMap: Record<string, any> = {}
): boolean {
  const serviceRecord = MOCK_NPTEL_CERTIFICATE_TABLE[courseId];
  if (serviceRecord && (serviceRecord.verificationStatus === "Verified" || serviceRecord.verificationStatus === "Submitted")) {
    return true;
  }

  const mapRecord = declarationsMap[courseId];
  if (mapRecord && (mapRecord.pdfUrl || mapRecord.fileName)) {
    return true;
  }

  return false;
}

/**
 * Get courses eligible for examination & hall ticket (excluding NPTEL completed courses)
 */
export function getExamEligibleCourses<T extends { id: string; isNptel?: boolean; isRegistered?: boolean }>(
  courses: T[],
  declarationsMap: Record<string, any> = {}
): T[] {
  return courses.filter((c) => {
    // Must be registered for course
    if (!c.isRegistered) return false;

    // If it's an NPTEL course and has a completed certificate submission, EXCLUDE from exam
    if (c.isNptel && isCourseNptelExempted(c.id, declarationsMap)) {
      return false;
    }

    return true;
  });
}
