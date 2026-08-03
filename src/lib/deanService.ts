export interface DeanKpiStats {
  rdPublications: string;
  curriculumReadiness: string;
  departmentAuditScore: string;
  facultyResearchGrants: string;
}

export interface DepartmentComparison {
  id: string;
  code: string;
  name: string;
  passRate: string;
  attendanceRate: string;
  researchPapers: number;
  auditScore: string;
}

export interface FacultyPerformanceRecord {
  id: string;
  name: string;
  department: string;
  publications: number;
  grantValue: string;
  rating: string;
}

export interface AcademicAnalyticsTrend {
  month: string;
  researchOutput: number;
  attendanceRate: number;
  obeAttainment: number;
}

export interface CurriculumItem {
  id: string;
  course: string;
  revision: string;
  status: "Approved" | "Under Review" | "Revision Needed";
  attainment: number;
}

export interface PendingAcademicApproval {
  id: string;
  title: string;
  category: string;
  submittedBy: string;
  priority: "Urgent" | "High" | "Medium";
  status: "Pending" | "Approved" | "Rejected";
}

export interface DeanReportConfig {
  id: string;
  title: string;
  category: string;
  dateGenerated: string;
  status: "Finalized" | "Draft";
}

export const MOCK_DEAN_STATS: DeanKpiStats = {
  rdPublications: "148 Papers",
  curriculumReadiness: "100% Outcome Based",
  departmentAuditScore: "3.8 / 4.0",
  facultyResearchGrants: "₹1.45 Cr",
};

export const MOCK_DEPARTMENT_COMPARISONS: DepartmentComparison[] = [
  { id: "CSE", code: "CSE", name: "Computer Science & Eng", passRate: "96.8%", attendanceRate: "91.2%", researchPapers: 42, auditScore: "3.9 / 4.0" },
  { id: "ECE", code: "ECE", name: "Electronics & Comm Eng", passRate: "94.2%", attendanceRate: "89.5%", researchPapers: 31, auditScore: "3.8 / 4.0" },
  { id: "EEE", code: "EEE", name: "Electrical & Electronics Eng", passRate: "93.5%", attendanceRate: "88.9%", researchPapers: 25, auditScore: "3.75 / 4.0" },
  { id: "ME", code: "ME", name: "Mechanical Engineering", passRate: "92.0%", attendanceRate: "87.8%", researchPapers: 19, auditScore: "3.65 / 4.0" },
  { id: "Civil", code: "Civil", name: "Civil Engineering", passRate: "91.8%", attendanceRate: "86.4%", researchPapers: 14, auditScore: "3.7 / 4.0" },
  { id: "MBA", code: "MBA", name: "Management Studies", passRate: "97.1%", attendanceRate: "93.0%", researchPapers: 28, auditScore: "3.85 / 4.0" },
];

export const MOCK_FACULTY_PERFORMANCE: FacultyPerformanceRecord[] = [
  { id: "FAC-D01", name: "Dr. S. K. Gupta", department: "CSE", publications: 14, grantValue: "₹45.0 Lakhs", rating: "4.9 / 5.0" },
  { id: "FAC-D02", name: "Prof. Anand Kumar", department: "ECE", publications: 11, grantValue: "₹28.5 Lakhs", rating: "4.8 / 5.0" },
  { id: "FAC-D03", name: "Dr. Meenakshi S.", department: "EEE", publications: 9, grantValue: "₹32.0 Lakhs", rating: "4.85 / 5.0" },
  { id: "FAC-D04", name: "Dr. V. K. Murthy", department: "ME", publications: 8, grantValue: "₹18.0 Lakhs", rating: "4.75 / 5.0" },
];

export const MOCK_ANALYTICS_TREND: AcademicAnalyticsTrend[] = [
  { month: "Jan", researchOutput: 18, attendanceRate: 88, obeAttainment: 85 },
  { month: "Feb", researchOutput: 22, attendanceRate: 90, obeAttainment: 87 },
  { month: "Mar", researchOutput: 26, attendanceRate: 91, obeAttainment: 89 },
  { month: "Apr", researchOutput: 24, attendanceRate: 89, obeAttainment: 90 },
  { month: "May", researchOutput: 30, attendanceRate: 92, obeAttainment: 92 },
  { month: "Jun", researchOutput: 28, attendanceRate: 91, obeAttainment: 93 },
];

export const MOCK_CURRICULUM_ITEMS: CurriculumItem[] = [
  { id: "CURR-01", course: "B.Tech CSE - AI & ML Specialization", revision: "V2026 Regulations", status: "Approved", attainment: 94 },
  { id: "CURR-02", course: "B.Tech ECE - VLSI & Embedded Systems", revision: "V2026 Regulations", status: "Approved", attainment: 90 },
  { id: "CURR-03", course: "M.Tech Data Science & Analytics", revision: "New Syllabus Draft", status: "Under Review", attainment: 86 },
  { id: "CURR-04", course: "B.Tech ME - Robotics & Automation", revision: "V2026 Regulations", status: "Approved", attainment: 88 },
];

export const MOCK_PENDING_APPROVALS: PendingAcademicApproval[] = [
  { id: "DEAN-APP-01", title: "Approve New AI & ML Course Syllabus", category: "Curriculum Revision", submittedBy: "CSE Dept Board", priority: "High", status: "Pending" },
  { id: "DEAN-APP-02", title: "Sanction Research Seed Fund (₹5.0L)", category: "R&D Seed Grant", submittedBy: "Dr. Ravi Kumar", priority: "Urgent", status: "Pending" },
  { id: "DEAN-APP-03", title: "Authorize International IEEE Conference Deputation", category: "Faculty Duty Leave", submittedBy: "Prof. Ananya Sharma", priority: "Medium", status: "Pending" },
];

export const MOCK_DEAN_REPORTS: DeanReportConfig[] = [
  { id: "REP-D01", title: "Annual R&D Publications & Citation Report", category: "R&D Governance", dateGenerated: "2026-07-28", status: "Finalized" },
  { id: "REP-D02", title: "Outcome Based Education (OBE) Attainment Log", category: "Academic Quality", dateGenerated: "2026-07-25", status: "Finalized" },
];

export function fetchDeanStats(): DeanKpiStats {
  return MOCK_DEAN_STATS;
}

export function fetchDepartmentComparison(searchQuery: string = ""): DepartmentComparison[] {
  return MOCK_DEPARTMENT_COMPARISONS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}

export function fetchFacultyPerformance(
  searchQuery: string = "",
  deptFilter: string = "All Departments",
): FacultyPerformanceRecord[] {
  return MOCK_FACULTY_PERFORMANCE.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All Departments" || f.department === deptFilter;
    return matchesSearch && matchesDept;
  });
}

export function fetchAcademicAnalyticsTrend(): AcademicAnalyticsTrend[] {
  return MOCK_ANALYTICS_TREND;
}

export function fetchCurriculumStatus(searchQuery: string = ""): CurriculumItem[] {
  return MOCK_CURRICULUM_ITEMS.filter((c) =>
    c.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}

export function fetchPendingAcademicApprovals(): PendingAcademicApproval[] {
  return MOCK_PENDING_APPROVALS;
}

export function fetchDeanReports(): DeanReportConfig[] {
  return MOCK_DEAN_REPORTS;
}
