import api from "@/lib/api";

export interface HeroConfig {
  deanName: string;
  departmentName: string;
  academicYear: string;
  currentSemester: string;
  status: string;
}

export interface DeptStats {
  totalStudents: number;
  totalFaculty: number;
  totalSubjects: number;
  activePrograms: number;
  overallAttendance: number;
  passPercentage: number;
  researchPublications: number;
}

export interface CurriculumUpdate {
  id: string;
  title: string;
  date: string;
}

export interface PendingBoardApproval {
  id: string;
  title: string;
  submittedBy: string;
  category: string;
}

export interface RecentlyApprovedCurriculum {
  id: string;
  title: string;
  approvedDate: string;
}

export interface BoardOfStudiesData {
  curriculumStatus: string;
  recentUpdates: CurriculumUpdate[];
  pendingApprovals: PendingBoardApproval[];
  recentlyApproved: RecentlyApprovedCurriculum[];
}

export interface CriteriaProgress {
  criterion: string;
  progress: number;
}

export interface AccreditationData {
  naacProgress: number;
  nbaProgress: number;
  readinessScore: number;
  criteriaProgress: CriteriaProgress[];
  documentationComplete: number;
}

export interface PerformanceData {
  avgCgpa: number;
  passPercentage: number;
  backlogStudents: number;
  topSemester: string;
  placementEligible: number;
}

export interface AttendanceTrendItem {
  month: string;
  attendance: number;
}

export interface LowAttendanceStudent {
  id: string;
  name: string;
  percentage: number;
  semester: string;
}

export interface FacultyAttendanceRecord {
  name: string;
  status: "Present" | "On Leave" | "OD";
  percentage: number;
}

export interface AttendanceData {
  overallAttendance: number;
  trend: AttendanceTrendItem[];
  lowAttendanceStudents: LowAttendanceStudent[];
  facultyAttendanceSummary: FacultyAttendanceRecord[];
}

export interface UpcomingExamItem {
  subjectCode: string;
  subjectName: string;
  date: string;
}

export interface ExaminationOverviewData {
  upcomingExams: UpcomingExamItem[];
  completedExams: number;
  pendingResults: number;
  evaluationStatus: string;
}

export interface FacultyWorkloadItem {
  name: string;
  hoursPerWeek: number;
  coursesCount: number;
}

export interface FacultyOverviewData {
  totalFaculty: number;
  workloadList: FacultyWorkloadItem[];
  subjectsAssigned: number;
  pendingAllocationCount: number;
}

export interface SemesterDistributionItem {
  semester: string;
  count: number;
}

export interface GenderDistributionItem {
  name: string;
  value: number;
}

export interface StudentOverviewData {
  studentStrength: number;
  semesterDistribution: SemesterDistributionItem[];
  genderDistribution: GenderDistributionItem[];
  intakeCount: number;
}

export interface RecentActivityItem {
  id: string;
  type: "curriculum" | "faculty" | "subject" | "timetable" | "result" | "accreditation";
  title: string;
  time: string;
}

export interface DeanDashboardData {
  hero: HeroConfig;
  stats: DeptStats;
  curriculum: BoardOfStudiesData;
  accreditation: AccreditationData;
  performance: PerformanceData;
  attendance: AttendanceData;
  examinations: ExaminationOverviewData;
  faculty: FacultyOverviewData;
  students: StudentOverviewData;
  timeline: RecentActivityItem[];
}

// 1. EXTENDED DEPARTMENT DEAN DATA REGISTRY
export const MOCK_DEAN_DASHBOARD_REGISTRY: Record<string, DeanDashboardData> = {
  CSE: {
    hero: {
      deanName: "Dr. Ravi Kumar",
      departmentName: "Computer Science & Engineering",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 3, 5, 7)",
      status: "NBA Accredited (Tier-1)",
    },
    stats: {
      totalStudents: 1250,
      totalFaculty: 85,
      totalSubjects: 48,
      activePrograms: 3,
      overallAttendance: 91.2,
      passPercentage: 96.8,
      researchPublications: 148,
    },
    curriculum: {
      curriculumStatus: "Aligned to AICTE v2024 Guidelines",
      recentUpdates: [
        { id: "UPD-CSE-01", title: "Incorporated GenAI elective in Sem 7", date: "2026-07-28" },
        { id: "UPD-CSE-02", title: "Updated Cloud Architecture lab assignments", date: "2026-07-15" },
      ],
      pendingApprovals: [
        { id: "BOS-CSE-01", title: "Approve CSE Deep Learning lab modules", submittedBy: "Dr. K. Sai Teja", category: "Lab Redesign" },
        { id: "BOS-CSE-02", title: "Sanction new Quantum Computing elective syllabus", submittedBy: "Dr. Rajesh Sharma", category: "New Course" },
      ],
      recentlyApproved: [
        { id: "APR-CSE-01", title: "Data Structures syllabus aligned to R24 regulation", approvedDate: "2026-06-10" },
      ],
    },
    accreditation: {
      naacProgress: 95,
      nbaProgress: 90,
      readinessScore: 94,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 96 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 92 },
        { criterion: "Criterion 3 (Research)", progress: 95 },
        { criterion: "Criterion 4 (Infrastructure)", progress: 93 },
      ],
      documentationComplete: 92,
    },
    performance: {
      avgCgpa: 8.2,
      passPercentage: 96.8,
      backlogStudents: 18,
      topSemester: "Semester 7 (Avg CGPA: 8.45)",
      placementEligible: 340,
    },
    attendance: {
      overallAttendance: 91.2,
      trend: [
        { month: "Jan", attendance: 90 },
        { month: "Feb", attendance: 92 },
        { month: "Mar", attendance: 91 },
        { month: "Apr", attendance: 89 },
        { month: "May", attendance: 93 },
        { month: "Jun", attendance: 92 },
      ],
      lowAttendanceStudents: [
        { id: "STU-CSE-102", name: "Rohan Mehra", percentage: 68, semester: "Semester 3" },
        { id: "STU-CSE-145", name: "Sneha Reddy", percentage: 72, semester: "Semester 5" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. K. Sai Teja", status: "Present", percentage: 98 },
        { name: "Dr. Rajesh Sharma", status: "Present", percentage: 96 },
        { name: "Ms. Ananya Verma", status: "OD", percentage: 94 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "CS401", subjectName: "Advanced AI Theory Exam", date: "2026-08-10" },
        { subjectCode: "CS301", subjectName: "Database Systems Midterm", date: "2026-08-15" },
      ],
      completedExams: 14,
      pendingResults: 2,
      evaluationStatus: "85% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 85,
      workloadList: [
        { name: "Dr. Ravi Kumar", hoursPerWeek: 12, coursesCount: 2 },
        { name: "Dr. K. Sai Teja", hoursPerWeek: 16, coursesCount: 3 },
        { name: "Dr. Rajesh Sharma", hoursPerWeek: 14, coursesCount: 2 },
      ],
      subjectsAssigned: 46,
      pendingAllocationCount: 2,
    },
    students: {
      studentStrength: 1250,
      semesterDistribution: [
        { semester: "Sem 1", count: 320 },
        { semester: "Sem 3", count: 310 },
        { semester: "Sem 5", count: 315 },
        { semester: "Sem 7", count: 305 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 850 },
        { name: "Female Students", value: 400 },
      ],
      intakeCount: 360,
    },
    timeline: [
      { id: "ACT-CSE-01", type: "curriculum", title: "GenAI Syllabus revised by Board of Studies", time: "2 hours ago" },
      { id: "ACT-CSE-02", type: "faculty", title: "Dr. Rajesh Sharma assigned as lead in CS402", time: "5 hours ago" },
      { id: "ACT-CSE-03", type: "timetable", title: "Odd Sem Timetable version 1.2 published", time: "Yesterday" },
      { id: "ACT-CSE-04", type: "accreditation", title: "Criterion 3 NAAC Self Study Report uploaded", time: "3 days ago" },
    ],
  },
  ECE: {
    hero: {
      deanName: "Dr. Amit Verma",
      departmentName: "Electronics & Communication Engineering",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 3, 5, 7)",
      status: "NBA Review Scheduled",
    },
    stats: {
      totalStudents: 980,
      totalFaculty: 64,
      totalSubjects: 42,
      activePrograms: 2,
      overallAttendance: 89.5,
      passPercentage: 94.2,
      researchPublications: 112,
    },
    curriculum: {
      curriculumStatus: "Aligned to R24 Syllabus Schema",
      recentUpdates: [
        { id: "UPD-ECE-01", title: "VLSI System design Cadence flow updated", date: "2026-07-26" },
      ],
      pendingApprovals: [
        { id: "BOS-ECE-01", title: "Approve 5G Wireless lab setup list", submittedBy: "Dr. Meera Rao", category: "Lab Redesign" },
      ],
      recentlyApproved: [
        { id: "APR-ECE-01", title: "Semiconductor Physics core syllabus revised", approvedDate: "2026-06-12" },
      ],
    },
    accreditation: {
      naacProgress: 90,
      nbaProgress: 85,
      readinessScore: 88,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 91 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 89 },
        { criterion: "Criterion 3 (Research)", progress: 84 },
        { criterion: "Criterion 4 (Infrastructure)", progress: 90 },
      ],
      documentationComplete: 86,
    },
    performance: {
      avgCgpa: 7.95,
      passPercentage: 94.2,
      backlogStudents: 24,
      topSemester: "Semester 5 (Avg CGPA: 8.12)",
      placementEligible: 260,
    },
    attendance: {
      overallAttendance: 89.5,
      trend: [
        { month: "Jan", attendance: 88 },
        { month: "Feb", attendance: 90 },
        { month: "Mar", attendance: 89 },
        { month: "Apr", attendance: 88 },
        { month: "May", attendance: 91 },
        { month: "Jun", attendance: 90 },
      ],
      lowAttendanceStudents: [
        { id: "STU-ECE-121", name: "Anil Kapoor", percentage: 70, semester: "Semester 5" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. Amit Verma", status: "Present", percentage: 97 },
        { name: "Dr. Meera Rao", status: "Present", percentage: 95 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "EC304", subjectName: "VLSI CAD Midterm", date: "2026-08-12" },
      ],
      completedExams: 10,
      pendingResults: 1,
      evaluationStatus: "90% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 64,
      workloadList: [
        { name: "Dr. Amit Verma", hoursPerWeek: 10, coursesCount: 2 },
        { name: "Dr. Meera Rao", hoursPerWeek: 15, coursesCount: 3 },
      ],
      subjectsAssigned: 38,
      pendingAllocationCount: 4,
    },
    students: {
      studentStrength: 980,
      semesterDistribution: [
        { semester: "Sem 1", count: 250 },
        { semester: "Sem 3", count: 240 },
        { semester: "Sem 5", count: 245 },
        { semester: "Sem 7", count: 245 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 640 },
        { name: "Female Students", value: 340 },
      ],
      intakeCount: 300,
    },
    timeline: [
      { id: "ACT-ECE-01", type: "timetable", title: "ECE Midterm Exam Timetable uploaded", time: "1 day ago" },
      { id: "ACT-ECE-02", type: "faculty", title: "Dr. Meera Rao assigned to EC201 lab", time: "3 days ago" },
    ],
  },
  EEE: {
    hero: {
      deanName: "Dr. S. N. Singh",
      departmentName: "Electrical & Electronics Engineering",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 3, 5, 7)",
      status: "Accredited",
    },
    stats: {
      totalStudents: 620,
      totalFaculty: 45,
      totalSubjects: 36,
      activePrograms: 2,
      overallAttendance: 88.9,
      passPercentage: 93.5,
      researchPublications: 85,
    },
    curriculum: {
      curriculumStatus: "Aligned to Smart Grid Regulations",
      recentUpdates: [
        { id: "UPD-EEE-01", title: "Renewable Energy converters syllabus added", date: "2026-07-22" },
      ],
      pendingApprovals: [
        { id: "BOS-EEE-01", title: "Approve Electrical Machine lab guidelines", submittedBy: "Dr. S. N. Singh", category: "Lab Revision" },
      ],
      recentlyApproved: [
        { id: "APR-EEE-01", title: "Network analysis core modules updated", approvedDate: "2026-06-15" },
      ],
    },
    accreditation: {
      naacProgress: 88,
      nbaProgress: 80,
      readinessScore: 85,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 88 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 87 },
      ],
      documentationComplete: 82,
    },
    performance: {
      avgCgpa: 7.8,
      passPercentage: 93.5,
      backlogStudents: 22,
      topSemester: "Semester 7 (Avg CGPA: 8.05)",
      placementEligible: 180,
    },
    attendance: {
      overallAttendance: 88.9,
      trend: [
        { month: "Jan", attendance: 87 },
        { month: "Feb", attendance: 88 },
        { month: "Mar", attendance: 89 },
        { month: "Apr", attendance: 88 },
        { month: "May", attendance: 90 },
        { month: "Jun", attendance: 89 },
      ],
      lowAttendanceStudents: [
        { id: "STU-EEE-098", name: "Vinay Kumar", percentage: 69, semester: "Semester 3" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. S. N. Singh", status: "Present", percentage: 99 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "EE301", subjectName: "Power Systems midterm", date: "2026-08-16" },
      ],
      completedExams: 8,
      pendingResults: 1,
      evaluationStatus: "95% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 45,
      workloadList: [
        { name: "Dr. S. N. Singh", hoursPerWeek: 12, coursesCount: 2 },
      ],
      subjectsAssigned: 32,
      pendingAllocationCount: 4,
    },
    students: {
      studentStrength: 620,
      semesterDistribution: [
        { semester: "Sem 1", count: 160 },
        { semester: "Sem 3", count: 150 },
        { semester: "Sem 5", count: 155 },
        { semester: "Sem 7", count: 155 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 420 },
        { name: "Female Students", value: 200 },
      ],
      intakeCount: 180,
    },
    timeline: [
      { id: "ACT-EEE-01", type: "subject", title: "EE301 Power systems syllabus updated", time: "4 days ago" },
    ],
  },
  ME: {
    hero: {
      deanName: "Dr. H. P. Sharma",
      departmentName: "Mechanical Engineering",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 3, 5, 7)",
      status: "Accredited",
    },
    stats: {
      totalStudents: 720,
      totalFaculty: 50,
      totalSubjects: 38,
      activePrograms: 2,
      overallAttendance: 87.8,
      passPercentage: 92.0,
      researchPublications: 74,
    },
    curriculum: {
      curriculumStatus: "Aligned to Industry 4.0 Standards",
      recentUpdates: [
        { id: "UPD-ME-01", title: "CAD/FEA Simulation lab guidelines updated", date: "2026-07-15" },
      ],
      pendingApprovals: [
        { id: "BOS-ME-01", title: "Approve Robotics Workshop intake limits", submittedBy: "Dr. H. P. Sharma", category: "Audit Compliance" },
      ],
      recentlyApproved: [
        { id: "APR-ME-01", title: "Thermodynamics core structures revised", approvedDate: "2026-06-20" },
      ],
    },
    accreditation: {
      naacProgress: 85,
      nbaProgress: 75,
      readinessScore: 80,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 85 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 80 },
      ],
      documentationComplete: 78,
    },
    performance: {
      avgCgpa: 7.5,
      passPercentage: 92.0,
      backlogStudents: 35,
      topSemester: "Semester 5 (Avg CGPA: 7.82)",
      placementEligible: 190,
    },
    attendance: {
      overallAttendance: 87.8,
      trend: [
        { month: "Jan", attendance: 86 },
        { month: "Feb", attendance: 87 },
        { month: "Mar", attendance: 88 },
        { month: "Apr", attendance: 87 },
        { month: "May", attendance: 89 },
        { month: "Jun", attendance: 88 },
      ],
      lowAttendanceStudents: [
        { id: "STU-ME-065", name: "Rahul Dravid", percentage: 65, semester: "Semester 5" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. H. P. Sharma", status: "Present", percentage: 98 },
        { name: "Prof. V. K. Murthy", status: "Present", percentage: 94 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "ME308", subjectName: "CAD/FEA Written test", date: "2026-08-18" },
      ],
      completedExams: 9,
      pendingResults: 2,
      evaluationStatus: "80% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 50,
      workloadList: [
        { name: "Dr. H. P. Sharma", hoursPerWeek: 11, coursesCount: 2 },
        { name: "Prof. V. K. Murthy", hoursPerWeek: 16, coursesCount: 3 },
      ],
      subjectsAssigned: 34,
      pendingAllocationCount: 4,
    },
    students: {
      studentStrength: 720,
      semesterDistribution: [
        { semester: "Sem 1", count: 185 },
        { semester: "Sem 3", count: 175 },
        { semester: "Sem 5", count: 180 },
        { semester: "Sem 7", count: 180 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 680 },
        { name: "Female Students", value: 40 },
      ],
      intakeCount: 200,
    },
    timeline: [
      { id: "ACT-ME-01", type: "timetable", title: "ME Timetable published for R22 schema", time: "5 days ago" },
    ],
  },
  Civil: {
    hero: {
      deanName: "Dr. R. K. Mittal",
      departmentName: "Civil Engineering",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 3, 5, 7)",
      status: "Audit Scheduled",
    },
    stats: {
      totalStudents: 480,
      totalFaculty: 35,
      totalSubjects: 32,
      activePrograms: 2,
      overallAttendance: 86.4,
      passPercentage: 91.8,
      researchPublications: 54,
    },
    curriculum: {
      curriculumStatus: "Aligned to Green Building Regulations",
      recentUpdates: [
        { id: "UPD-CE-01", title: "Concrete Lab standards manual updated", date: "2026-07-12" },
      ],
      pendingApprovals: [
        { id: "BOS-CE-01", title: "Approve Structural design course changes", submittedBy: "Dr. R. K. Mittal", category: "Audit Compliance" },
      ],
      recentlyApproved: [
        { id: "APR-CE-01", title: "Strength of materials syllabus updated", approvedDate: "2026-06-18" },
      ],
    },
    accreditation: {
      naacProgress: 82,
      nbaProgress: 70,
      readinessScore: 78,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 83 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 79 },
      ],
      documentationComplete: 75,
    },
    performance: {
      avgCgpa: 7.4,
      passPercentage: 91.8,
      backlogStudents: 28,
      topSemester: "Semester 7 (Avg CGPA: 7.68)",
      placementEligible: 120,
    },
    attendance: {
      overallAttendance: 86.4,
      trend: [
        { month: "Jan", attendance: 85 },
        { month: "Feb", attendance: 86 },
        { month: "Mar", attendance: 87 },
        { month: "Apr", attendance: 86 },
        { month: "May", attendance: 88 },
        { month: "Jun", attendance: 86 },
      ],
      lowAttendanceStudents: [
        { id: "STU-CE-052", name: "Suresh Raina", percentage: 67, semester: "Semester 3" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. R. K. Mittal", status: "Present", percentage: 97 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "CE401", subjectName: "Reinforced Concrete structures exam", date: "2026-08-20" },
      ],
      completedExams: 7,
      pendingResults: 1,
      evaluationStatus: "88% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 35,
      workloadList: [
        { name: "Dr. R. K. Mittal", hoursPerWeek: 10, coursesCount: 2 },
      ],
      subjectsAssigned: 28,
      pendingAllocationCount: 4,
    },
    students: {
      studentStrength: 480,
      semesterDistribution: [
        { semester: "Sem 1", count: 120 },
        { semester: "Sem 3", count: 120 },
        { semester: "Sem 5", count: 120 },
        { semester: "Sem 7", count: 120 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 410 },
        { name: "Female Students", value: 70 },
      ],
      intakeCount: 120,
    },
    timeline: [
      { id: "ACT-CE-01", type: "timetable", title: "CE timetable published", time: "6 days ago" },
    ],
  },
  MBA: {
    hero: {
      deanName: "Dr. Neha Kapoor",
      departmentName: "Master of Business Administration",
      academicYear: "2024-25",
      currentSemester: "Odd (Sem 1, 3)",
      status: "NAAC Grade A++",
    },
    stats: {
      totalStudents: 320,
      totalFaculty: 24,
      totalSubjects: 22,
      activePrograms: 1,
      overallAttendance: 93.0,
      passPercentage: 97.1,
      researchPublications: 96,
    },
    curriculum: {
      curriculumStatus: "Aligned to AACSB Guidelines",
      recentUpdates: [
        { id: "UPD-MBA-01", title: "Corporate placements training added to Sem 3", date: "2026-07-22" },
      ],
      pendingApprovals: [
        { id: "BOS-MBA-01", title: "Approve Financial Systems syllabus revisions", submittedBy: "Dr. Neha Kapoor", category: "Audit Compliance" },
      ],
      recentlyApproved: [
        { id: "APR-MBA-01", title: "Managerial Accounting syllabus updated", approvedDate: "2026-06-18" },
      ],
    },
    accreditation: {
      naacProgress: 98,
      nbaProgress: 92,
      readinessScore: 96,
      criteriaProgress: [
        { criterion: "Criterion 1 (Curriculum)", progress: 98 },
        { criterion: "Criterion 2 (Teaching & Eval)", progress: 95 },
      ],
      documentationComplete: 95,
    },
    performance: {
      avgCgpa: 8.5,
      passPercentage: 97.1,
      backlogStudents: 5,
      topSemester: "Semester 3 (Avg CGPA: 8.62)",
      placementEligible: 150,
    },
    attendance: {
      overallAttendance: 93.0,
      trend: [
        { month: "Jan", attendance: 92 },
        { month: "Feb", attendance: 93 },
        { month: "Mar", attendance: 94 },
        { month: "Apr", attendance: 93 },
        { month: "May", attendance: 95 },
        { month: "Jun", attendance: 93 },
      ],
      lowAttendanceStudents: [
        { id: "STU-MBA-012", name: "Deepak Chawla", percentage: 74, semester: "Semester 3" },
      ],
      facultyAttendanceSummary: [
        { name: "Dr. Neha Kapoor", status: "Present", percentage: 98 },
      ],
    },
    examinations: {
      upcomingExams: [
        { subjectCode: "MB301", subjectName: "Strategic HR Midterm", date: "2026-08-22" },
      ],
      completedExams: 6,
      pendingResults: 1,
      evaluationStatus: "92% Papers Evaluated",
    },
    faculty: {
      totalFaculty: 24,
      workloadList: [
        { name: "Dr. Neha Kapoor", hoursPerWeek: 16, coursesCount: 2 },
      ],
      subjectsAssigned: 20,
      pendingAllocationCount: 2,
    },
    students: {
      studentStrength: 320,
      semesterDistribution: [
        { semester: "Sem 1", count: 170 },
        { semester: "Sem 3", count: 150 },
      ],
      genderDistribution: [
        { name: "Male Students", value: 180 },
        { name: "Female Students", value: 140 },
      ],
      intakeCount: 180,
    },
    timeline: [
      { id: "ACT-MBA-01", type: "timetable", title: "MBA Midterm timetable uploaded", time: "6 days ago" },
    ],
  },
};

export async function getDeanDashboard(department: string): Promise<DeanDashboardData> {
  try {
    const res = await api.get(`/api/dean/dashboard?department=${department}`);
    if (res && res.data && res.data.stats) {
      return res.data;
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const data = MOCK_DEAN_DASHBOARD_REGISTRY[code] || MOCK_DEAN_DASHBOARD_REGISTRY["CSE"];
      resolve(data as DeanDashboardData);
    }, 300);
  });
}
