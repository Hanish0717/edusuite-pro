import api from "@/lib/api";

export interface ReportItem {
  id: string;
  name: string;
  category: "Attendance Reports" | "Student Reports" | "Assessment Reports" | "Assignment Reports" | "Course Files" | "Lesson Plans" | "Research Reports" | "NBA Reports" | "NAAC Reports" | "Department Reports";
  generatedBy: string;
  generatedDate: string;
  academicYear: string;
  semester: string;
  department: string;
  status: "Completed" | "Pending" | "Failed";
  fileFormat: "PDF" | "XLSX" | "CSV";
  size: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: "Weekly" | "Monthly" | "Semesterly" | "Compliance-driven";
  nextGenDate: string;
  status: "Active" | "Paused";
}

export interface ReportSummaryStats {
  totalGenerated: number;
  attendanceCount: number;
  marksCount: number;
  courseFileCount: number;
  nbaNaacCount: number;
  pendingCount: number;
  generatedThisMonth: number;
}

export interface PerformanceSnapshotData {
  assignedSubjects: number;
  classesConducted: number;
  attendanceSubmitted: number;
  lessonPlansCompleted: number;
  assignmentsPublished: number;
  internalMarksSubmitted: number;
  researchPublications: number;
  leaveUtilization: string;
  payrollStatus: string;
}

export interface AnalyticsTrendItem {
  name: string;
  value: number;
}

export interface ReportsAnalyticsData {
  attendanceTrend: AnalyticsTrendItem[];
  studentPerformance: AnalyticsTrendItem[];
  assignmentSubmissions: AnalyticsTrendItem[];
  assessmentCompletion: AnalyticsTrendItem[];
  courseCoverage: AnalyticsTrendItem[];
  facultyWorkload: AnalyticsTrendItem[];
}

export interface ReportsResponse {
  reports: ReportItem[];
  scheduled: ScheduledReport[];
  stats: ReportSummaryStats;
  performance: PerformanceSnapshotData;
  analytics: ReportsAnalyticsData;
}

// 1. COMPREHENSIVE DEPARTMENT DEPT-AWARE MOCK DATA
export const MOCK_REPORTS_REGISTRY: Record<string, ReportsResponse> = {
  CSE: {
    reports: [
      { id: "REP-CS-001", name: "CS301 Attendance Master Sheet", category: "Attendance Reports", generatedBy: "Dr. K. Sai Teja", generatedDate: "2026-08-01", academicYear: "2025-26", semester: "Semester 5", department: "CSE", status: "Completed", fileFormat: "PDF", size: "480 KB" },
      { id: "REP-CS-002", name: "GenAI Course Curriculum Mapping", category: "Course Files", generatedBy: "Dr. Ravi Kumar", generatedDate: "2026-07-28", academicYear: "2025-26", semester: "Semester 7", department: "CSE", status: "Completed", fileFormat: "XLSX", size: "2.1 MB" },
      { id: "REP-CS-003", name: "Deep Learning Labs OBE Attainment Assessment", category: "Assessment Reports", generatedBy: "Dr. K. Sai Teja", generatedDate: "2026-07-15", academicYear: "2025-26", semester: "Semester 5", department: "CSE", status: "Completed", fileFormat: "PDF", size: "950 KB" },
      { id: "REP-CS-004", name: "CSE Placement Eligibility & Backlogs Report", category: "Student Reports", generatedBy: "Ms. Ananya Verma", generatedDate: "2026-08-02", academicYear: "2025-26", semester: "Semester 7", department: "CSE", status: "Pending", fileFormat: "CSV", size: "120 KB" },
      { id: "REP-CS-005", name: "AI & Neural Networks Course Syllabus Compliances", category: "NBA Reports", generatedBy: "Dr. Ravi Kumar", generatedDate: "2026-07-10", academicYear: "2025-26", semester: "Semester 5", department: "CSE", status: "Completed", fileFormat: "PDF", size: "1.4 MB" },
      { id: "REP-CS-006", name: "Python Programming Assignment Ledger", category: "Assignment Reports", generatedBy: "Ms. Ananya Verma", generatedDate: "2026-08-03", academicYear: "2025-26", semester: "Semester 3", department: "CSE", status: "Completed", fileFormat: "XLSX", size: "860 KB" },
    ],
    scheduled: [
      { id: "SCH-CS-001", name: "Weekly Attendance Ledger Report", frequency: "Weekly", nextGenDate: "2026-08-07", status: "Active" },
      { id: "SCH-CS-002", name: "Monthly Faculty Workload Summary", frequency: "Monthly", nextGenDate: "2026-08-31", status: "Active" },
      { id: "SCH-CS-003", name: "Semester Performance & CGPA Audit", frequency: "Semesterly", nextGenDate: "2026-10-15", status: "Active" },
      { id: "SCH-CS-004", name: "NBA Tier-1 Accreditation Compliance Report", frequency: "Compliance-driven", nextGenDate: "2026-09-01", status: "Active" },
    ],
    stats: {
      totalGenerated: 148,
      attendanceCount: 42,
      marksCount: 35,
      courseFileCount: 28,
      nbaNaacCount: 22,
      pendingCount: 1,
      generatedThisMonth: 12,
    },
    performance: {
      assignedSubjects: 3,
      classesConducted: 48,
      attendanceSubmitted: 46,
      lessonPlansCompleted: 3,
      assignmentsPublished: 12,
      internalMarksSubmitted: 2,
      researchPublications: 14,
      leaveUtilization: "4 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 92 },
        { name: "Feb", value: 94 },
        { name: "Mar", value: 91 },
        { name: "Apr", value: 89 },
        { name: "May", value: 93 },
        { name: "Jun", value: 95 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 7.8 },
        { name: "Sem 3", value: 8.1 },
        { name: "Sem 5", value: 8.3 },
        { name: "Sem 7", value: 8.5 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 88 },
        { name: "Wk 2", value: 92 },
        { name: "Wk 3", value: 90 },
        { name: "Wk 4", value: 95 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 100 },
        { name: "Mid 1", value: 98 },
        { name: "Lab 1", value: 100 },
        { name: "Quiz 2", value: 85 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 100 },
        { name: "Unit 3", value: 85 },
        { name: "Unit 4", value: 40 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Dr. Sai Teja", value: 16 },
        { name: "Dr. Ravi Kumar", value: 18 },
        { name: "Ms. Ananya", value: 14 },
        { name: "Mr. Suresh", value: 16 },
      ],
    },
  },
  ECE: {
    reports: [
      { id: "REP-EC-001", name: "VLSI CAD Layout Simulation Sheet", category: "Course Files", generatedBy: "Dr. Meera Rao", generatedDate: "2026-07-26", academicYear: "2025-26", semester: "Semester 5", department: "ECE", status: "Completed", fileFormat: "PDF", size: "1.8 MB" },
      { id: "REP-EC-002", name: "5G Wireless Networks Lab Submissions", category: "Assignment Reports", generatedBy: "Dr. Amit Verma", generatedDate: "2026-08-01", academicYear: "2025-26", semester: "Semester 7", department: "ECE", status: "Completed", fileFormat: "XLSX", size: "750 KB" },
    ],
    scheduled: [
      { id: "SCH-EC-001", name: "Bi-Weekly ECE Lab Safety Audits", frequency: "Weekly", nextGenDate: "2026-08-10", status: "Active" },
    ],
    stats: {
      totalGenerated: 112,
      attendanceCount: 30,
      marksCount: 28,
      courseFileCount: 20,
      nbaNaacCount: 15,
      pendingCount: 0,
      generatedThisMonth: 8,
    },
    performance: {
      assignedSubjects: 4,
      classesConducted: 42,
      attendanceSubmitted: 42,
      lessonPlansCompleted: 4,
      assignmentsPublished: 10,
      internalMarksSubmitted: 2,
      researchPublications: 11,
      leaveUtilization: "2 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 89 },
        { name: "Feb", value: 91 },
        { name: "Mar", value: 90 },
        { name: "Apr", value: 88 },
        { name: "May", value: 92 },
        { name: "Jun", value: 91 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 7.5 },
        { name: "Sem 3", value: 7.8 },
        { name: "Sem 5", value: 8.0 },
        { name: "Sem 7", value: 8.2 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 85 },
        { name: "Wk 2", value: 89 },
        { name: "Wk 3", value: 87 },
        { name: "Wk 4", value: 91 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 100 },
        { name: "Mid 1", value: 95 },
        { name: "Lab 1", value: 98 },
        { name: "Quiz 2", value: 78 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 95 },
        { name: "Unit 3", value: 70 },
        { name: "Unit 4", value: 30 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Dr. Meera Rao", value: 18 },
        { name: "Dr. Amit Verma", value: 14 },
        { name: "Mr. Rajesh G.", value: 16 },
      ],
    },
  },
  EEE: {
    reports: [
      { id: "REP-EE-001", name: "Power Systems Simulation Attendance", category: "Attendance Reports", generatedBy: "Dr. S. N. Singh", generatedDate: "2026-07-22", academicYear: "2025-26", semester: "Semester 5", department: "EEE", status: "Completed", fileFormat: "PDF", size: "320 KB" },
    ],
    scheduled: [
      { id: "SCH-EE-001", name: "Weekly Machine Lab Safety Logs", frequency: "Weekly", nextGenDate: "2026-08-08", status: "Active" },
    ],
    stats: {
      totalGenerated: 85,
      attendanceCount: 22,
      marksCount: 20,
      courseFileCount: 16,
      nbaNaacCount: 10,
      pendingCount: 0,
      generatedThisMonth: 5,
    },
    performance: {
      assignedSubjects: 2,
      classesConducted: 36,
      attendanceSubmitted: 35,
      lessonPlansCompleted: 2,
      assignmentsPublished: 8,
      internalMarksSubmitted: 1,
      researchPublications: 12,
      leaveUtilization: "5 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 87 },
        { name: "Feb", value: 88 },
        { name: "Mar", value: 89 },
        { name: "Apr", value: 88 },
        { name: "May", value: 90 },
        { name: "Jun", value: 89 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 7.4 },
        { name: "Sem 3", value: 7.6 },
        { name: "Sem 5", value: 7.9 },
        { name: "Sem 7", value: 8.1 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 80 },
        { name: "Wk 2", value: 85 },
        { name: "Wk 3", value: 88 },
        { name: "Wk 4", value: 90 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 100 },
        { name: "Mid 1", value: 92 },
        { name: "Lab 1", value: 95 },
        { name: "Quiz 2", value: 80 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 90 },
        { name: "Unit 3", value: 65 },
        { name: "Unit 4", value: 20 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Dr. S. N. Singh", value: 12 },
        { name: "Dr. Meenakshi", value: 16 },
      ],
    },
  },
  ME: {
    reports: [
      { id: "REP-ME-001", name: "Thermodynamics Section B Midterm", category: "Assessment Reports", generatedBy: "Dr. H. P. Sharma", generatedDate: "2026-07-20", academicYear: "2025-26", semester: "Semester 3", department: "ME", status: "Completed", fileFormat: "PDF", size: "480 KB" },
    ],
    scheduled: [
      { id: "SCH-ME-001", name: "Monthly Workshop Maintenance Logs", frequency: "Monthly", nextGenDate: "2026-08-25", status: "Active" },
    ],
    stats: {
      totalGenerated: 74,
      attendanceCount: 18,
      marksCount: 16,
      courseFileCount: 14,
      nbaNaacCount: 8,
      pendingCount: 0,
      generatedThisMonth: 4,
    },
    performance: {
      assignedSubjects: 3,
      classesConducted: 40,
      attendanceSubmitted: 38,
      lessonPlansCompleted: 3,
      assignmentsPublished: 9,
      internalMarksSubmitted: 2,
      researchPublications: 10,
      leaveUtilization: "1 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 86 },
        { name: "Feb", value: 87 },
        { name: "Mar", value: 88 },
        { name: "Apr", value: 87 },
        { name: "May", value: 89 },
        { name: "Jun", value: 88 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 7.2 },
        { name: "Sem 3", value: 7.5 },
        { name: "Sem 5", value: 7.7 },
        { name: "Sem 7", value: 7.9 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 78 },
        { name: "Wk 2", value: 82 },
        { name: "Wk 3", value: 85 },
        { name: "Wk 4", value: 88 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 95 },
        { name: "Mid 1", value: 90 },
        { name: "Lab 1", value: 92 },
        { name: "Quiz 2", value: 75 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 88 },
        { name: "Unit 3", value: 50 },
        { name: "Unit 4", value: 15 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Prof. V. K. Murthy", value: 15 },
        { name: "Dr. H. P. Sharma", value: 11 },
      ],
    },
  },
  Civil: {
    reports: [
      { id: "REP-CE-001", name: "Structural Design Lab Marks Dossier", category: "Assessment Reports", generatedBy: "Dr. R. K. Mittal", generatedDate: "2026-07-15", academicYear: "2025-26", semester: "Semester 5", department: "Civil", status: "Completed", fileFormat: "XLSX", size: "620 KB" },
    ],
    scheduled: [
      { id: "SCH-CE-001", name: "Quarterly Concrete Strength Analysis", frequency: "Monthly", nextGenDate: "2026-08-20", status: "Active" },
    ],
    stats: {
      totalGenerated: 54,
      attendanceCount: 14,
      marksCount: 12,
      courseFileCount: 10,
      nbaNaacCount: 6,
      pendingCount: 0,
      generatedThisMonth: 3,
    },
    performance: {
      assignedSubjects: 2,
      classesConducted: 32,
      attendanceSubmitted: 32,
      lessonPlansCompleted: 2,
      assignmentsPublished: 6,
      internalMarksSubmitted: 1,
      researchPublications: 10,
      leaveUtilization: "3 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 85 },
        { name: "Feb", value: 86 },
        { name: "Mar", value: 87 },
        { name: "Apr", value: 86 },
        { name: "May", value: 88 },
        { name: "Jun", value: 86 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 7.1 },
        { name: "Sem 3", value: 7.3 },
        { name: "Sem 5", value: 7.5 },
        { name: "Sem 7", value: 7.8 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 75 },
        { name: "Wk 2", value: 80 },
        { name: "Wk 3", value: 82 },
        { name: "Wk 4", value: 85 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 90 },
        { name: "Mid 1", value: 88 },
        { name: "Lab 1", value: 90 },
        { name: "Quiz 2", value: 70 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 85 },
        { name: "Unit 3", value: 60 },
        { name: "Unit 4", value: 10 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Dr. R. K. Mittal", value: 10 },
      ],
    },
  },
  MBA: {
    reports: [
      { id: "REP-MB-001", name: "Strategic HR Marketing Case Ledger", category: "Student Reports", generatedBy: "Dr. Neha Kapoor", generatedDate: "2026-07-22", academicYear: "2025-26", semester: "Semester 3", department: "MBA", status: "Completed", fileFormat: "PDF", size: "1.2 MB" },
    ],
    scheduled: [
      { id: "SCH-MB-001", name: "Monthly Placements Intake Analytics", frequency: "Monthly", nextGenDate: "2026-08-15", status: "Active" },
    ],
    stats: {
      totalGenerated: 96,
      attendanceCount: 26,
      marksCount: 24,
      courseFileCount: 18,
      nbaNaacCount: 12,
      pendingCount: 0,
      generatedThisMonth: 6,
    },
    performance: {
      assignedSubjects: 2,
      classesConducted: 30,
      attendanceSubmitted: 30,
      lessonPlansCompleted: 2,
      assignmentsPublished: 8,
      internalMarksSubmitted: 2,
      researchPublications: 16,
      leaveUtilization: "4 / 12 Days Used",
      payrollStatus: "Disbursed (July 2026)",
    },
    analytics: {
      attendanceTrend: [
        { name: "Jan", value: 92 },
        { name: "Feb", value: 93 },
        { name: "Mar", value: 94 },
        { name: "Apr", value: 93 },
        { name: "May", value: 95 },
        { name: "Jun", value: 93 },
      ],
      studentPerformance: [
        { name: "Sem 1", value: 8.2 },
        { name: "Sem 2", value: 8.4 },
        { name: "Sem 3", value: 8.6 },
        { name: "Sem 4", value: 8.8 },
      ],
      assignmentSubmissions: [
        { name: "Wk 1", value: 90 },
        { name: "Wk 2", value: 95 },
        { name: "Wk 3", value: 94 },
        { name: "Wk 4", value: 98 },
      ],
      assessmentCompletion: [
        { name: "Quiz 1", value: 100 },
        { name: "Mid 1", value: 97 },
        { name: "Case Study 1", value: 100 },
        { name: "Quiz 2", value: 92 },
      ],
      courseCoverage: [
        { name: "Unit 1", value: 100 },
        { name: "Unit 2", value: 98 },
        { name: "Unit 3", value: 80 },
        { name: "Unit 4", value: 50 },
        { name: "Unit 5", value: 0 },
      ],
      facultyWorkload: [
        { name: "Dr. Neha Kapoor", value: 16 },
      ],
    },
  },
};

// Stateful database in-memory for generation operations
let localReportsDatabase: Record<string, ReportsResponse> = JSON.parse(JSON.stringify(MOCK_REPORTS_REGISTRY));

export interface FetchReportsParams {
  department: string;
  search?: string;
  category?: string;
  status?: string;
  academicYear?: string;
  semester?: string;
}

export async function fetchReportsData(department: string): Promise<ReportsResponse> {
  try {
    const res = await api.get(`/api/faculty/reports?department=${department}`);
    if (res && res.data && res.data.stats) {
      return res.data;
    }
  } catch {}

  return new Promise<ReportsResponse>((resolve) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const data = (localReportsDatabase[code] || localReportsDatabase["CSE"]) as ReportsResponse;
      resolve(data);
    }, 250);
  });
}

export async function generateNewReport(
  department: string,
  name: string,
  category: ReportItem["category"],
  format: ReportItem["fileFormat"]
): Promise<ReportItem> {
  try {
    const res = await api.post("/api/faculty/reports/generate", { department, name, category, format });
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  return new Promise<ReportItem>((resolve) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const newRep: ReportItem = {
        id: `REP-${code}-${Math.floor(100 + Math.random() * 900)}`,
        name,
        category,
        generatedBy: "System ERP AutoGen",
        generatedDate: new Date().toISOString().split("T")[0] || "2026-08-03",
        academicYear: "2025-26",
        semester: "Semester 5",
        department: code,
        status: "Completed",
        fileFormat: format,
        size: `${Math.floor(200 + Math.random() * 800)} KB`,
      };

      let db = localReportsDatabase[code];
      if (!db) {
        db = JSON.parse(JSON.stringify(MOCK_REPORTS_REGISTRY["CSE"])) as ReportsResponse;
        localReportsDatabase[code] = db;
      }
      db.reports.unshift(newRep);
      db.stats.totalGenerated += 1;
      db.stats.generatedThisMonth += 1;
      
      resolve(newRep);
    }, 300);
  });
}

export async function deleteReportRecord(department: string, id: string): Promise<boolean> {
  try {
    await api.delete(`/api/faculty/reports/download/${id}`);
  } catch {}

  const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
  if (localReportsDatabase[code]) {
    localReportsDatabase[code].reports = localReportsDatabase[code].reports.filter((r) => r.id !== id);
    localReportsDatabase[code].stats.totalGenerated = Math.max(0, localReportsDatabase[code].stats.totalGenerated - 1);
  }
  return true;
}
