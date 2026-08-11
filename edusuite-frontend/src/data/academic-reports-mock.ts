// ============================================================
// Academic Reports & Analytics — Mock Data
// ============================================================

export interface ExecutiveKpi {
  id: string;
  label: string;
  value: string;
  comparison: string;
  trend: "up" | "down";
  tone: "primary" | "success" | "warning" | "info" | "destructive";
  iconName: string;
}

export interface ReportCategoryItem {
  id: string;
  title: string;
  category: "Academic" | "Performance" | "Compliance" | "Operations";
  description: string;
  lastGenerated: string;
  status: "Ready" | "Scheduled" | "Generating";
  format: "PDF" | "Excel" | "CSV";
}

export interface DepartmentAnalytic {
  departmentId: string;
  departmentName: string;
  facultyCount: number;
  studentCount: number;
  avgAttendance: number;
  passPercentage: number;
  avgCgpa: number;
  backlogs: number;
  performanceScore: number;
  rank: number;
}

export interface FacultyAnalytic {
  facultyId: string;
  facultyName: string;
  department: string;
  subjectsHandled: number;
  classesConducted: number;
  avgStudentAttendance: number;
  resultPerformance: number;
  workloadHours: number;
  feedbackScore: number;
}

export interface SubjectAnalytic {
  subjectCode: string;
  subjectName: string;
  department: string;
  facultyName: string;
  passPercent: number;
  failPercent: number;
  avgMarks: number;
  attendancePercent: number;
  difficultyIndex: "Low" | "Moderate" | "High";
}

export interface StudentAnalytic {
  studentId: string;
  studentName: string;
  department: string;
  attendance: number;
  avgMarks: number;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  backlogs: number;
  trend: "Improving" | "Stable" | "Declining";
  riskCategory: "Low" | "Medium" | "High";
}

export interface InstitutionalTargetKpi {
  title: string;
  target: number;
  achieved: number;
  unit: "%" | "hrs";
  status: "Exceeded" | "On Track" | "Needs Attention";
}

export interface ReportHistoryItem {
  id: string;
  reportName: string;
  generatedBy: string;
  generatedOn: string;
  category: string;
  format: "PDF" | "Excel" | "CSV";
  status: "Completed" | "Archived";
  size: string;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: "positive" | "warning" | "info";
  metric: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
}

// ── EXECUTIVE KPIS ───────────────────────────────────────────
export const EXECUTIVE_KPIS: ExecutiveKpi[] = [
  { id: "kpi-1", label: "Overall Student Strength", value: "2,450", comparison: "+5% vs prev sem", trend: "up", tone: "primary", iconName: "Users" },
  { id: "kpi-2", label: "Overall Faculty Strength", value: "185", comparison: "+3 new joined", trend: "up", tone: "info", iconName: "UserCheck" },
  { id: "kpi-3", label: "Average Attendance", value: "86.4%", comparison: "+1.8% vs prev sem", trend: "up", tone: "success", iconName: "CalendarCheck" },
  { id: "kpi-4", label: "Institution Pass %", value: "91.2%", comparison: "+2.4% vs prev sem", trend: "up", tone: "success", iconName: "TrendingUp" },
  { id: "kpi-5", label: "Average CGPA", value: "7.84", comparison: "+0.12 vs prev sem", trend: "up", tone: "primary", iconName: "Award" },
  { id: "kpi-6", label: "Placement Eligible", value: "520 / 580", comparison: "89.6% eligibility", trend: "up", tone: "info", iconName: "Briefcase" },
  { id: "kpi-7", label: "Depts Meeting Targets", value: "4 / 5", comparison: "80% compliance", trend: "up", tone: "success", iconName: "Building2" },
  { id: "kpi-8", label: "Pending Activities", value: "12 Tasks", comparison: "3 due this week", trend: "down", tone: "warning", iconName: "Clock" },
];

// ── REPORT CATEGORIES (15 Reports) ───────────────────────────
export const REPORT_CATEGORIES: ReportCategoryItem[] = [
  { id: "rep-1", title: "Attendance Report", category: "Academic", description: "Consolidated student and department attendance summary.", lastGenerated: "2026-08-04 09:00 AM", status: "Ready", format: "PDF" },
  { id: "rep-2", title: "Result Report", category: "Academic", description: "Semester examination pass/fail rates and SGPA/CGPA distribution.", lastGenerated: "2026-08-03 04:30 PM", status: "Ready", format: "Excel" },
  { id: "rep-3", title: "Department Performance", category: "Performance", description: "Comparative academic score, pass rates, and research output per department.", lastGenerated: "2026-08-02 11:15 AM", status: "Ready", format: "PDF" },
  { id: "rep-4", title: "Faculty Performance", category: "Performance", description: "Class completion rate, student feedback scores, and workload hours.", lastGenerated: "2026-08-01 02:00 PM", status: "Ready", format: "Excel" },
  { id: "rep-5", title: "Subject Performance", category: "Academic", description: "Pass percentages, average scores, and difficulty metrics per subject.", lastGenerated: "2026-07-30 05:45 PM", status: "Ready", format: "PDF" },
  { id: "rep-6", title: "Student Performance", category: "Academic", description: "Individual and cohort academic progression trends and risk categories.", lastGenerated: "2026-08-04 08:30 AM", status: "Ready", format: "CSV" },
  { id: "rep-7", title: "Curriculum Report", category: "Compliance", description: "Syllabus completion percentage and regulation credit mapping.", lastGenerated: "2026-07-28 10:00 AM", status: "Ready", format: "PDF" },
  { id: "rep-8", title: "Examination Report", category: "Academic", description: "Exam hall allocation, seating capacity utilization, and invigilator duties.", lastGenerated: "2026-08-03 01:20 PM", status: "Ready", format: "Excel" },
  { id: "rep-9", title: "Timetable Utilization", category: "Operations", description: "Classroom and laboratory weekly slot occupancy analysis.", lastGenerated: "2026-08-01 09:30 AM", status: "Ready", format: "PDF" },
  { id: "rep-10", title: "Course Completion", category: "Academic", description: "Unit-wise lecture progress tracking against academic calendar.", lastGenerated: "2026-08-04 10:00 AM", status: "Ready", format: "Excel" },
  { id: "rep-11", title: "Academic Calendar Compliance", category: "Compliance", description: "Instructional days conducted versus scheduled university target.", lastGenerated: "2026-07-25 03:00 PM", status: "Ready", format: "PDF" },
  { id: "rep-12", title: "Student Promotion Report", category: "Academic", description: "Eligibility criteria validation for next semester progression.", lastGenerated: "2026-07-20 11:00 AM", status: "Ready", format: "CSV" },
  { id: "rep-13", title: "Backlog Report", category: "Academic", description: "Failed subject counts, student shortage lists, and supplementary plans.", lastGenerated: "2026-08-03 03:15 PM", status: "Ready", format: "PDF" },
  { id: "rep-14", title: "Accreditation Report", category: "Compliance", description: "Institutional key indicator responses for NIRF and state body audits.", lastGenerated: "2026-07-15 04:00 PM", status: "Ready", format: "PDF" },
  { id: "rep-15", title: "NAAC/NBA Report", category: "Compliance", description: "Criterion-wise self-study report (SSR) data points & outcome mapping.", lastGenerated: "2026-07-10 02:30 PM", status: "Ready", format: "Excel" },
];

// ── DEPARTMENT ANALYTICS ─────────────────────────────────────
export const DEPARTMENT_ANALYTICS: DepartmentAnalytic[] = [
  { departmentId: "CSE", departmentName: "Computer Science & Engineering", facultyCount: 45, studentCount: 680, avgAttendance: 89.2, passPercentage: 94.2, avgCgpa: 8.24, backlogs: 18, performanceScore: 95, rank: 1 },
  { departmentId: "ECE", departmentName: "Electronics & Communication Engg", facultyCount: 38, studentCount: 540, avgAttendance: 87.5, passPercentage: 90.8, avgCgpa: 7.95, backlogs: 24, performanceScore: 91, rank: 2 },
  { departmentId: "AI&DS", departmentName: "Artificial Intelligence & Data Science", facultyCount: 28, studentCount: 420, avgAttendance: 88.1, passPercentage: 92.0, avgCgpa: 8.10, backlogs: 12, performanceScore: 93, rank: 3 },
  { departmentId: "CIVIL", departmentName: "Civil Engineering", facultyCount: 32, studentCount: 380, avgAttendance: 84.0, passPercentage: 86.4, avgCgpa: 7.42, backlogs: 35, performanceScore: 84, rank: 4 },
  { departmentId: "ME", departmentName: "Mechanical Engineering", facultyCount: 42, studentCount: 430, avgAttendance: 83.2, passPercentage: 82.5, avgCgpa: 7.30, backlogs: 48, performanceScore: 81, rank: 5 },
];

// ── FACULTY ANALYTICS ────────────────────────────────────────
export const FACULTY_ANALYTICS: FacultyAnalytic[] = [
  { facultyId: "FAC-101", facultyName: "Dr. K. Sai Teja", department: "CSE", subjectsHandled: 3, classesConducted: 48, avgStudentAttendance: 91.5, resultPerformance: 96.0, workloadHours: 18, feedbackScore: 4.8 },
  { facultyId: "FAC-102", facultyName: "Dr. Meera Rao", department: "ECE", subjectsHandled: 2, classesConducted: 42, avgStudentAttendance: 88.0, resultPerformance: 92.5, workloadHours: 16, feedbackScore: 4.7 },
  { facultyId: "FAC-103", facultyName: "Dr. S. K. Gupta", department: "AI&DS", subjectsHandled: 3, classesConducted: 45, avgStudentAttendance: 89.8, resultPerformance: 94.0, workloadHours: 19, feedbackScore: 4.9 },
  { facultyId: "FAC-104", facultyName: "Ms. Ananya Verma", department: "CSE", subjectsHandled: 2, classesConducted: 38, avgStudentAttendance: 86.2, resultPerformance: 88.0, workloadHours: 15, feedbackScore: 4.5 },
  { facultyId: "FAC-105", facultyName: "Dr. S. Rajan", department: "ME", subjectsHandled: 3, classesConducted: 40, avgStudentAttendance: 82.4, resultPerformance: 84.5, workloadHours: 20, feedbackScore: 4.3 },
];

// ── SUBJECT ANALYTICS ────────────────────────────────────────
export const SUBJECT_ANALYTICS: SubjectAnalytic[] = [
  { subjectCode: "CS501", subjectName: "Computer Networks", department: "CSE", facultyName: "Dr. K. Sai Teja", passPercent: 94, failPercent: 6, avgMarks: 78, attendancePercent: 91.2, difficultyIndex: "Moderate" },
  { subjectCode: "EC304", subjectName: "VLSI System Design", department: "ECE", facultyName: "Dr. Meera Rao", passPercent: 88, failPercent: 12, avgMarks: 72, attendancePercent: 87.5, difficultyIndex: "High" },
  { subjectCode: "AI401", subjectName: "Deep Learning Foundations", department: "AI&DS", facultyName: "Dr. S. K. Gupta", passPercent: 92, failPercent: 8, avgMarks: 81, attendancePercent: 89.8, difficultyIndex: "Moderate" },
  { subjectCode: "CS302", subjectName: "OOP through Java", department: "CSE", facultyName: "Ms. Ananya Verma", passPercent: 85, failPercent: 15, avgMarks: 69, attendancePercent: 86.2, difficultyIndex: "Moderate" },
  { subjectCode: "ME309", subjectName: "Thermodynamics II", department: "ME", facultyName: "Dr. S. Rajan", passPercent: 74, failPercent: 26, avgMarks: 61, attendancePercent: 82.4, difficultyIndex: "High" },
];

// ── STUDENT ANALYTICS ────────────────────────────────────────
export const STUDENT_ANALYTICS: StudentAnalytic[] = [
  { studentId: "22CSE001", studentName: "Aarav Sharma", department: "CSE", attendance: 94.5, avgMarks: 91, sgpa: 9.45, cgpa: 9.38, creditsEarned: 124, backlogs: 0, trend: "Improving", riskCategory: "Low" },
  { studentId: "22ECE042", studentName: "Ananya Iyer", department: "ECE", attendance: 92.0, avgMarks: 88, sgpa: 9.20, cgpa: 9.12, creditsEarned: 120, backlogs: 0, trend: "Improving", riskCategory: "Low" },
  { studentId: "22AIDS011", studentName: "Rohan Varma", department: "AI&DS", attendance: 90.2, avgMarks: 84, sgpa: 8.90, cgpa: 8.82, creditsEarned: 118, backlogs: 0, trend: "Stable", riskCategory: "Low" },
  { studentId: "23ME014", studentName: "Vikram Aditya", department: "ME", attendance: 78.4, avgMarks: 68, sgpa: 7.20, cgpa: 7.15, creditsEarned: 84, backlogs: 0, trend: "Stable", riskCategory: "Medium" },
  { studentId: "23CSE077", studentName: "Priya Nair", department: "CSE", attendance: 71.0, avgMarks: 52, sgpa: 5.80, cgpa: 6.10, creditsEarned: 76, backlogs: 2, trend: "Declining", riskCategory: "High" },
];

// ── INSTITUTIONAL KPIS (Target vs Achieved) ──────────────────
export const INSTITUTIONAL_TARGETS: InstitutionalTargetKpi[] = [
  { title: "Academic Target Achievement", target: 90, achieved: 92, unit: "%", status: "Exceeded" },
  { title: "Attendance Target", target: 85, achieved: 86.4, unit: "%", status: "Exceeded" },
  { title: "Pass Percentage Target", target: 90, achieved: 91.2, unit: "%", status: "Exceeded" },
  { title: "Course Completion", target: 95, achieved: 94, unit: "%", status: "On Track" },
  { title: "Faculty Utilization", target: 85, achieved: 88, unit: "%", status: "Exceeded" },
  { title: "Classroom Utilization", target: 80, achieved: 82, unit: "%", status: "Exceeded" },
  { title: "Laboratory Utilization", target: 75, achieved: 79, unit: "%", status: "Exceeded" },
  { title: "Curriculum Completion", target: 95, achieved: 96, unit: "%", status: "Exceeded" },
];

// ── CHARTS DATA ───────────────────────────────────────────────
export const OVERALL_ATTENDANCE_TREND = [
  { name: "Jan", Attendance: 82.4 },
  { name: "Feb", Attendance: 84.1 },
  { name: "Mar", Attendance: 85.8 },
  { name: "Apr", Attendance: 86.0 },
  { name: "May", Attendance: 87.2 },
  { name: "Jun", Attendance: 86.4 },
];

export const PASS_PERCENTAGE_TREND = [
  { name: "Sem I", PassRate: 85.2 },
  { name: "Sem II", PassRate: 87.0 },
  { name: "Sem III", PassRate: 88.4 },
  { name: "Sem IV", PassRate: 89.1 },
  { name: "Sem V", PassRate: 90.5 },
  { name: "Sem VI", PassRate: 91.2 },
];

export const DEPT_COMPARISON_CHART = [
  { name: "CSE", PassRate: 94.2, Attendance: 89.2 },
  { name: "ECE", PassRate: 90.8, Attendance: 87.5 },
  { name: "AI&DS", PassRate: 92.0, Attendance: 88.1 },
  { name: "CIVIL", PassRate: 86.4, Attendance: 84.0 },
  { name: "ME", PassRate: 82.5, Attendance: 83.2 },
];

export const CGPA_DISTRIBUTION_CHART = [
  { name: "9.0 - 10.0 (Distinction)", value: 15 },
  { name: "8.0 - 8.99 (Very Good)", value: 38 },
  { name: "7.0 - 7.99 (Good)", value: 32 },
  { name: "6.0 - 6.99 (Average)", value: 11 },
  { name: "Below 6.0 (At Risk)", value: 4 },
];

export const BACKLOG_TREND_CHART = [
  { name: "2023-Sem I", Backlogs: 65 },
  { name: "2023-Sem II", Backlogs: 52 },
  { name: "2024-Sem I", Backlogs: 44 },
  { name: "2024-Sem II", Backlogs: 38 },
  { name: "2025-Sem I", Backlogs: 32 },
  { name: "2025-Sem II", Backlogs: 25 },
];

// ── REPORT HISTORY ───────────────────────────────────────────
export const REPORT_HISTORY_DATA: ReportHistoryItem[] = [
  { id: "HIST-101", reportName: "Institutional Attendance Summary Q2", generatedBy: "Dr. S. R. Krishnan", generatedOn: "2026-08-04 09:30 AM", category: "Attendance", format: "PDF", status: "Completed", size: "2.4 MB" },
  { id: "HIST-102", reportName: "Semester VI End-Sem Pass Percentage Analysis", generatedBy: "Dr. S. R. Krishnan", generatedOn: "2026-08-03 04:15 PM", category: "Results", format: "Excel", status: "Completed", size: "1.8 MB" },
  { id: "HIST-103", reportName: "Department Academic Target Audit 2025-26", generatedBy: "Dr. S. R. Krishnan", generatedOn: "2026-08-02 11:00 AM", category: "Department", format: "PDF", status: "Completed", size: "4.1 MB" },
  { id: "HIST-104", reportName: "Faculty Workload & Feedback Matrix", generatedBy: "Dr. S. R. Krishnan", generatedOn: "2026-07-29 02:45 PM", category: "Faculty", format: "Excel", status: "Archived", size: "1.2 MB" },
  { id: "HIST-105", reportName: "NAAC Criteria 2 & 3 Compliance Extract", generatedBy: "Dr. S. R. Krishnan", generatedOn: "2026-07-25 10:20 AM", category: "Compliance", format: "PDF", status: "Completed", size: "6.5 MB" },
];

// ── RECENT AI-STYLE INSIGHT CARDS ─────────────────────────────
export const INSIGHT_CARDS_DATA: InsightCard[] = [
  { id: "ins-1", title: "Attendance Improvement", description: "Overall attendance improved by 6% across 1st year computer science batches.", type: "positive", metric: "+6.0%", timestamp: "Updated today" },
  { id: "ins-2", title: "Top Performing Department", description: "CSE achieved the highest pass percentage at 94.2% with 15 distinction holders.", type: "positive", metric: "94.2% Pass", timestamp: "Updated 2 hours ago" },
  { id: "ins-3", title: "Backlog Alert in Mechanical", description: "Mechanical Engineering registered a 14% backlog rate in Thermodynamics II.", type: "warning", metric: "14% Backlog", timestamp: "Updated 4 hours ago" },
  { id: "ins-4", title: "Workload Balanced", description: "Faculty teaching load is optimally distributed at an average of 18.2 hours/week.", type: "info", metric: "18.2 hrs/wk", timestamp: "Updated yesterday" },
  { id: "ins-5", title: "Course Syllabus Target", description: "Syllabus completion across all departments reached 92% ahead of schedule.", type: "positive", metric: "92% Done", timestamp: "Updated 2 days ago" },
];

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const NOTIFICATIONS_DATA: NotificationItem[] = [
  { id: "n-1", message: "Monthly institutional academic summary report is ready for download.", time: "10 mins ago", type: "success" },
  { id: "n-2", message: "CSE & ECE department performance metrics updated for Semester VI.", time: "1 hour ago", type: "info" },
  { id: "n-3", message: "New NIRF/NAAC compliance analytics dataset generated.", time: "3 hours ago", type: "info" },
  { id: "n-4", message: "Overall attendance trend improved by +1.8% compared to previous semester.", time: "Yesterday", type: "success" },
  { id: "n-5", message: "Result analysis completed for End-Semester examination cycle.", time: "2 days ago", type: "info" },
];
