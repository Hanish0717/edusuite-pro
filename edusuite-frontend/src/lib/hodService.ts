import type { DepartmentCode } from "@/config/roles";

export interface HodDepartmentStats {
  studentsCount: number;
  facultyCount: number;
  attendancePercentage: string;
  pendingApprovalsCount: number;
  deltaAttendance: string;
  deltaStudents: string;
}

export interface DepartmentPerformanceTrend {
  month: string;
  attendance: number;
  results: number;
  placement: number;
}

export interface SubjectScore {
  subject: string;
  score: number;
}

export interface HodStudent {
  roll: string;
  name: string;
  dept: string;
  year: string;
  attendance: string;
  cgpa: string;
  status: "Active" | "At Risk" | "Suspended";
}

export interface HodFacultyMember {
  id: string;
  name: string;
  designation: string;
  dept: string;
  workloadHours: string;
  pendingLeaves: number;
  status: "Active" | "On Leave";
}

export interface HodApprovalItem {
  title: string;
  count: number;
  category: string;
}

export const HOD_DEPARTMENT_STATS_MAP: Record<string, HodDepartmentStats> = {
  CSE: {
    studentsCount: 512,
    facultyCount: 28,
    attendancePercentage: "91%",
    pendingApprovalsCount: 7,
    deltaAttendance: "2.4%",
    deltaStudents: "3.1%",
  },
  ECE: {
    studentsCount: 420,
    facultyCount: 22,
    attendancePercentage: "89%",
    pendingApprovalsCount: 5,
    deltaAttendance: "1.8%",
    deltaStudents: "2.5%",
  },
  EEE: {
    studentsCount: 380,
    facultyCount: 18,
    attendancePercentage: "88%",
    pendingApprovalsCount: 4,
    deltaAttendance: "1.2%",
    deltaStudents: "2.0%",
  },
  ME: {
    studentsCount: 340,
    facultyCount: 16,
    attendancePercentage: "87%",
    pendingApprovalsCount: 6,
    deltaAttendance: "0.9%",
    deltaStudents: "1.5%",
  },
  Civil: {
    studentsCount: 310,
    facultyCount: 15,
    attendancePercentage: "86%",
    pendingApprovalsCount: 3,
    deltaAttendance: "1.0%",
    deltaStudents: "1.2%",
  },
  MBA: {
    studentsCount: 260,
    facultyCount: 14,
    attendancePercentage: "93%",
    pendingApprovalsCount: 2,
    deltaAttendance: "3.0%",
    deltaStudents: "4.0%",
  },
};

export const MOCK_PERFORMANCE_TREND: DepartmentPerformanceTrend[] = [
  { month: "Jan", attendance: 86, results: 78, placement: 62 },
  { month: "Feb", attendance: 88, results: 81, placement: 66 },
  { month: "Mar", attendance: 91, results: 84, placement: 71 },
  { month: "Apr", attendance: 89, results: 86, placement: 74 },
  { month: "May", attendance: 93, results: 88, placement: 79 },
  { month: "Jun", attendance: 91, results: 90, placement: 84 },
];

export const TOP_SUBJECTS_MAP: Record<string, SubjectScore[]> = {
  CSE: [
    { subject: "Data Structures", score: 92 },
    { subject: "DBMS", score: 89 },
    { subject: "Operating Systems", score: 87 },
    { subject: "Computer Networks", score: 84 },
    { subject: "Java Programming", score: 82 },
  ],
  ECE: [
    { subject: "Digital Signal Processing", score: 90 },
    { subject: "Microprocessors 8086", score: 86 },
    { subject: "VLSI Design", score: 88 },
    { subject: "Analog Circuits", score: 83 },
    { subject: "Embedded Systems", score: 85 },
  ],
  DEFAULT: [
    { subject: "Engineering Mathematics", score: 88 },
    { subject: "Core Fundamentals", score: 85 },
    { subject: "Lab Practice", score: 91 },
    { subject: "Project Work", score: 89 },
  ],
};

export const HOD_STUDENTS_LIST: HodStudent[] = [
  {
    roll: "22CS101",
    name: "K. Sai Teja",
    dept: "CSE",
    year: "II",
    attendance: "88%",
    cgpa: "8.45",
    status: "Active",
  },
  {
    roll: "22CS114",
    name: "A. Meghana",
    dept: "CSE",
    year: "II",
    attendance: "94%",
    cgpa: "9.10",
    status: "Active",
  },
  {
    roll: "22EC067",
    name: "R. Karthik",
    dept: "ECE",
    year: "II",
    attendance: "71%",
    cgpa: "7.20",
    status: "At Risk",
  },
  {
    roll: "22CS158",
    name: "V. Ananya",
    dept: "CSE",
    year: "III",
    attendance: "91%",
    cgpa: "8.80",
    status: "Active",
  },
  {
    roll: "22ME089",
    name: "Anish Kulkarni",
    dept: "ME",
    year: "III",
    attendance: "74%",
    cgpa: "6.95",
    status: "At Risk",
  },
  {
    roll: "22EE042",
    name: "S. Divya",
    dept: "EEE",
    year: "II",
    attendance: "93%",
    cgpa: "8.90",
    status: "Active",
  },
];

export const HOD_FACULTY_LIST: HodFacultyMember[] = [
  {
    id: "FAC-H01",
    name: "Dr. S. K. Gupta",
    designation: "HOD & Professor",
    dept: "CSE",
    workloadHours: "14 hrs/wk",
    pendingLeaves: 0,
    status: "Active",
  },
  {
    id: "FAC-H02",
    name: "Dr. Ravi Kumar",
    designation: "Associate Professor",
    dept: "CSE",
    workloadHours: "16 hrs/wk",
    pendingLeaves: 1,
    status: "Active",
  },
  {
    id: "FAC-H03",
    name: "Priya Sharma",
    designation: "Assistant Professor",
    dept: "CSE",
    workloadHours: "18 hrs/wk",
    pendingLeaves: 1,
    status: "On Leave",
  },
  {
    id: "FAC-H04",
    name: "M. N. Rao",
    designation: "Assistant Professor",
    dept: "ECE",
    workloadHours: "15 hrs/wk",
    pendingLeaves: 0,
    status: "Active",
  },
];

export const HOD_PENDING_APPROVALS: HodApprovalItem[] = [
  { title: "Leave approvals", count: 5, category: "Leave" },
  { title: "Attendance overrides", count: 2, category: "Attendance" },
  { title: "Internal marks approval", count: 3, category: "Marks" },
  { title: "Purchase requests", count: 4, category: "Procurement" },
];

export function fetchHodDepartmentStats(departmentCode?: string): HodDepartmentStats {
  const code = departmentCode && HOD_DEPARTMENT_STATS_MAP[departmentCode] ? departmentCode : "CSE";
  return HOD_DEPARTMENT_STATS_MAP[code];
}

export function fetchDepartmentPerformanceTrend(departmentCode?: string): DepartmentPerformanceTrend[] {
  return MOCK_PERFORMANCE_TREND;
}

export function fetchTopSubjects(departmentCode?: string): SubjectScore[] {
  const code = departmentCode && TOP_SUBJECTS_MAP[departmentCode] ? departmentCode : "CSE";
  return TOP_SUBJECTS_MAP[code] || TOP_SUBJECTS_MAP["DEFAULT"];
}

export function fetchHodStudents(
  departmentCode?: string,
  searchQuery: string = "",
  statusFilter: string = "All Statuses",
): HodStudent[] {
  return HOD_STUDENTS_LIST.filter((s) => {
    const matchesDept = !departmentCode || s.dept === departmentCode || departmentCode === "All";
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || s.status === statusFilter;

    return matchesDept && matchesSearch && matchesStatus;
  });
}

export function fetchHodFaculty(
  departmentCode?: string,
  searchQuery: string = "",
): HodFacultyMember[] {
  return HOD_FACULTY_LIST.filter((f) => {
    const matchesDept = !departmentCode || f.dept === departmentCode || departmentCode === "All";
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSearch;
  });
}

export function fetchHodPendingApprovals(departmentCode?: string): HodApprovalItem[] {
  return HOD_PENDING_APPROVALS;
}
