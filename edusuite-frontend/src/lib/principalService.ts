export interface PrincipalKpiStats {
  naacScore: string;
  overallPassPercentage: string;
  pendingApprovalsCount: number;
  facultyStrength: string;
}

export interface DepartmentScorecard {
  id: string;
  name: string;
  code: string;
  passRate: string;
  attendanceRate: string;
  budgetStatus: "On Track" | "Under Review" | "Exceeded";
  researchPapers: number;
}

export interface FacultyRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  rating: string;
  status: "Active" | "On Leave" | "Sabbatical";
}

export interface ExecutiveApprovalTicket {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  submittedBy: string;
  status: "Pending" | "Approved" | "Rejected";
  actionLabel: string;
}

export interface InstitutionalReportItem {
  id: string;
  name: string;
  category: string;
  generatedDate: string;
  status: "Finalized" | "Draft" | "Pending Review";
}

export const MOCK_PRINCIPAL_STATS: PrincipalKpiStats = {
  naacScore: "3.72 / 4.0",
  overallPassPercentage: "94.6%",
  pendingApprovalsCount: 4,
  facultyStrength: "623 Members",
};

export const MOCK_DEPARTMENT_SCORECARDS: DepartmentScorecard[] = [
  {
    id: "DEPT-CSE",
    name: "Computer Science (CSE)",
    code: "CSE",
    passRate: "96.8%",
    attendanceRate: "91.2%",
    budgetStatus: "On Track",
    researchPapers: 42,
  },
  {
    id: "DEPT-ECE",
    name: "Electronics & Comm (ECE)",
    code: "ECE",
    passRate: "94.2%",
    attendanceRate: "89.5%",
    budgetStatus: "On Track",
    researchPapers: 31,
  },
  {
    id: "DEPT-ME",
    name: "Mechanical Eng (ME)",
    code: "ME",
    passRate: "92.0%",
    attendanceRate: "87.8%",
    budgetStatus: "Under Review",
    researchPapers: 19,
  },
  {
    id: "DEPT-EEE",
    name: "Electrical Eng (EEE)",
    code: "EEE",
    passRate: "93.5%",
    attendanceRate: "88.9%",
    budgetStatus: "On Track",
    researchPapers: 25,
  },
  {
    id: "DEPT-CIVIL",
    name: "Civil Engineering (Civil)",
    code: "Civil",
    passRate: "91.8%",
    attendanceRate: "86.4%",
    budgetStatus: "On Track",
    researchPapers: 14,
  },
  {
    id: "DEPT-MBA",
    name: "Management Studies (MBA)",
    code: "MBA",
    passRate: "97.1%",
    attendanceRate: "93.0%",
    budgetStatus: "On Track",
    researchPapers: 28,
  },
];

export const MOCK_FACULTY_MEMBERS: FacultyRecord[] = [
  {
    id: "FAC-101",
    name: "Dr. S. K. Gupta",
    designation: "Professor & HOD",
    department: "CSE",
    rating: "4.9 / 5.0",
    status: "Active",
  },
  {
    id: "FAC-102",
    name: "Prof. Anand Kumar",
    designation: "Academic Dean",
    department: "ECE",
    rating: "4.8 / 5.0",
    status: "Active",
  },
  {
    id: "FAC-103",
    name: "Dr. Ravi Kumar",
    designation: "Associate Professor",
    department: "CSE",
    rating: "4.7 / 5.0",
    status: "Active",
  },
  {
    id: "FAC-104",
    name: "Dr. Meenakshi Sundaram",
    designation: "Professor",
    department: "EEE",
    rating: "4.85 / 5.0",
    status: "On Leave",
  },
  {
    id: "FAC-105",
    name: "Prof. V. K. Murthy",
    designation: "Vice Principal & Prof",
    department: "ME",
    rating: "4.95 / 5.0",
    status: "Active",
  },
];

export const MOCK_EXECUTIVE_APPROVALS: ExecutiveApprovalTicket[] = [
  {
    id: "APP-001",
    category: "PURCHASE REQUISITION",
    categoryColor: "text-amber-600 border-amber-500/20 bg-amber-500/10",
    title: "IoT Lab Robotics Kits (₹2.45L)",
    description: "Approved by Inventory & Finance Officers.",
    submittedBy: "CSE Department Head",
    status: "Pending",
    actionLabel: "Approve Purchase Order",
  },
  {
    id: "APP-002",
    category: "RESULT DECLARATION",
    categoryColor: "text-purple-600 border-purple-500/20 bg-purple-500/10",
    title: "B.Tech Sem 6 Result Gazette",
    description: "Moderated and certified by Exam Controller.",
    submittedBy: "Exam Controller",
    status: "Pending",
    actionLabel: "Authorize & Publish",
  },
  {
    id: "APP-003",
    category: "ACADEMIC MOU",
    categoryColor: "text-blue-600 border-blue-500/20 bg-blue-500/10",
    title: "Industry Collaboration with Qualcomm",
    description: "Legal verification completed by Institutional Legal Cell.",
    submittedBy: "Placement Officer",
    status: "Pending",
    actionLabel: "Sign MoU Agreement",
  },
  {
    id: "APP-004",
    category: "RESEARCH GRANT",
    categoryColor: "text-emerald-600 border-emerald-500/20 bg-emerald-500/10",
    title: "DST-SERB AI Research Project (₹14.5L)",
    description: "Recommended by Research & Development Committee.",
    submittedBy: "R&D Coordinator",
    status: "Pending",
    actionLabel: "Sanction Grant Release",
  },
];

export const MOCK_INSTITUTIONAL_REPORTS: InstitutionalReportItem[] = [
  {
    id: "REP-01",
    name: "NAAC Criteria 4 Infrastructure Audit",
    category: "Accreditation",
    generatedDate: "2026-07-28",
    status: "Finalized",
  },
  {
    id: "REP-02",
    name: "Annual Academic Audit Report 2025-26",
    category: "Academic Governance",
    generatedDate: "2026-07-25",
    status: "Finalized",
  },
  {
    id: "REP-03",
    name: "Campus Placements & Package Analysis",
    category: "Placements",
    generatedDate: "2026-07-20",
    status: "Finalized",
  },
];

export function fetchPrincipalStats(): PrincipalKpiStats {
  return MOCK_PRINCIPAL_STATS;
}

export function fetchDepartmentScorecards(searchQuery: string = ""): DepartmentScorecard[] {
  return MOCK_DEPARTMENT_SCORECARDS.filter((d) => {
    return (
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
}

export function fetchFacultyOverview(
  searchQuery: string = "",
  departmentFilter: string = "All Departments",
): FacultyRecord[] {
  return MOCK_FACULTY_MEMBERS.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === "All Departments" || f.department === departmentFilter;
    return matchesSearch && matchesDept;
  });
}

export function fetchExecutiveApprovals(): ExecutiveApprovalTicket[] {
  return MOCK_EXECUTIVE_APPROVALS;
}

export function fetchInstitutionalReports(): InstitutionalReportItem[] {
  return MOCK_INSTITUTIONAL_REPORTS;
}
