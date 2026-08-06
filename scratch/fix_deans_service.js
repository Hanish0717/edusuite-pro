import fs from 'fs';
import path from 'path';

const fileContent = `// Centralized Dean Data Service for All 8 Executive Dean Portals

export interface AcademicKpiData {
  departments: number;
  programs: number;
  faculty: number;
  students: number;
  todaysClasses: number;
  pendingCurriculumApprovals: number;
  upcomingAcademicMeetings: number;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  hod: string;
  facultyCount: number;
  studentCount: number;
  programsCount: number;
  accreditation: string;
  status: "Active" | "Under Review";
}

export interface ProgramRecord {
  id: string;
  name: string;
  code: string;
  department: string;
  duration: string;
  students: number;
  coordinator: string;
  status: "Active" | "Draft" | "Archived";
}

export interface FacultyRecord {
  id: string;
  facultyId: string;
  name: string;
  department: string;
  designation: string;
  experience: string;
  subjects: string[];
  workloadHours: number;
  maxWorkloadHours: number;
  status: "Active" | "On Leave" | "Sabbatical";
  email: string;
}

export interface CourseAllocationRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  department: string;
  semester: number;
  section: string;
  credits: number;
  status: "Allocated" | "Pending" | "Reassigned";
}

export interface TimetablePeriodSlot {
  periodNum: number;
  timeSlot: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  semester: number;
  section: string;
  branch: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  type: "Semester Start" | "Semester End" | "Exams" | "Holidays" | "Workshops" | "Meetings";
  date: string;
  duration: string;
  venue: string;
  organizer: string;
}

export interface AcademicReportRecord {
  id: string;
  title: string;
  category: "Course Completion" | "Faculty Performance" | "Department Performance" | "Attendance Report" | "Result Analysis";
  metric: string;
  value: string;
  generatedDate: string;
}

export interface AcademicNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "urgent";
}

export interface AcademicActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  user: string;
}

export interface AcademicDeanDashboardData {
  kpis: AcademicKpiData;
  departments: DepartmentRecord[];
  programs: ProgramRecord[];
  facultyList: FacultyRecord[];
  courseAllocations: CourseAllocationRecord[];
  weeklyTimetable: Record<string, TimetablePeriodSlot[]>;
  myTimetable: {
    todaysClasses: TimetablePeriodSlot[];
    assignedSubjects: string[];
    sections: string[];
    pendingAttendanceCount: number;
  };
  calendarEvents: AcademicCalendarEvent[];
  reports: AcademicReportRecord[];
  notifications: AcademicNotification[];
  recentActivities: AcademicActivity[];
  charts: {
    deptWiseFaculty: { dept: string; count: number }[];
    studentDistribution: { dept: string; count: number }[];
    courseCompletion: { month: string; percentage: number }[];
    attendanceTrends: { month: string; attendance: number }[];
    facultyWorkload: { dept: string; avgHours: number }[];
  };
}

export function getAcademicDeanDashboardData(): AcademicDeanDashboardData {
  const departments: DepartmentRecord[] = [
    { id: "dept-1", name: "Computer Science Engineering", code: "CSE", hod: "Dr. S. K. Gupta", facultyCount: 38, studentCount: 840, programsCount: 4, accreditation: "NBA Tier 1", status: "Active" },
    { id: "dept-2", name: "Artificial Intelligence and Data Science", code: "AI & DS", hod: "Dr. Ananya Roy", facultyCount: 22, studentCount: 480, programsCount: 2, accreditation: "NBA Provisionally Accredited", status: "Active" },
    { id: "dept-3", name: "Cyber Security", code: "CS", hod: "Dr. Vikram Varma", facultyCount: 18, studentCount: 360, programsCount: 2, accreditation: "NAAC Approved", status: "Active" },
    { id: "dept-4", name: "Internet of Things", code: "IoT", hod: "Dr. P. V. Ramana", facultyCount: 16, studentCount: 320, programsCount: 2, accreditation: "NAAC Approved", status: "Active" },
    { id: "dept-5", name: "Electronics and Communication Engg", code: "ECE", hod: "Dr. Meera Rao", facultyCount: 32, studentCount: 720, programsCount: 3, accreditation: "NBA Tier 1", status: "Active" },
    { id: "dept-6", name: "Electrical and Electronics Engg", code: "EEE", hod: "Dr. R. Karthik", facultyCount: 24, studentCount: 540, programsCount: 2, accreditation: "NBA Accredited", status: "Active" },
    { id: "dept-7", name: "Mechanical Engineering", code: "ME", hod: "Dr. Rajeshwar Rao", facultyCount: 26, studentCount: 580, programsCount: 3, accreditation: "NBA Accredited", status: "Active" },
    { id: "dept-8", name: "Civil Engineering", code: "CE", hod: "Dr. K. V. R. Prasad", facultyCount: 20, studentCount: 420, programsCount: 2, accreditation: "NBA Accredited", status: "Active" },
    { id: "dept-9", name: "Information Technology", code: "IT", hod: "Dr. Sunita Sharma", facultyCount: 24, studentCount: 480, programsCount: 2, accreditation: "NBA Accredited", status: "Active" },
    { id: "dept-10", name: "Master of Business Administration", code: "MBA", hod: "Dr. Srikant Verma", facultyCount: 15, studentCount: 240, programsCount: 3, accreditation: "ACBSP Accredited", status: "Active" },
    { id: "dept-11", name: "Master of Computer Applications", code: "MCA", hod: "Dr. Ramesh Agrawal", facultyCount: 12, studentCount: 180, programsCount: 1, accreditation: "NAAC A++", status: "Active" },
    { id: "dept-12", name: "Robotics and Automation", code: "RAE", hod: "Dr. Arvind Swamy", facultyCount: 10, studentCount: 160, programsCount: 1, accreditation: "Under Inspection", status: "Active" },
    { id: "dept-13", name: "Aerospace Engineering", code: "AAE", hod: "Dr. Col. Rathore", facultyCount: 8, studentCount: 120, programsCount: 1, accreditation: "NAAC Approved", status: "Active" },
    { id: "dept-14", name: "Biomedical Engineering", code: "BME", hod: "Dr. Priya Nair", facultyCount: 7, studentCount: 100, programsCount: 1, accreditation: "NAAC Approved", status: "Active" },
    { id: "dept-15", name: "Chemical Engineering", code: "CHE", hod: "Dr. Gurpreet Singh", facultyCount: 9, studentCount: 140, programsCount: 1, accreditation: "NBA Accredited", status: "Active" },
  ];

  const programs: ProgramRecord[] = [
    { id: "prog-1", name: "B.Tech Computer Science Engineering", code: "BTECH-CSE", department: "CSE", duration: "4 Years", students: 480, coordinator: "Dr. S. K. Gupta", status: "Active" },
    { id: "prog-2", name: "B.Tech AI and Data Science", code: "BTECH-AIDS", department: "AI & DS", duration: "4 Years", students: 240, coordinator: "Dr. Ananya Roy", status: "Active" },
    { id: "prog-3", name: "B.Tech Cyber Security", code: "BTECH-CS", department: "Cyber Security", duration: "4 Years", students: 180, coordinator: "Dr. Vikram Varma", status: "Active" },
    { id: "prog-4", name: "B.Tech Electronics and Communication", code: "BTECH-ECE", department: "ECE", duration: "4 Years", students: 360, coordinator: "Dr. Meera Rao", status: "Active" },
    { id: "prog-5", name: "B.Tech Mechanical Engineering", code: "BTECH-ME", department: "ME", duration: "4 Years", students: 300, coordinator: "Dr. Rajeshwar Rao", status: "Active" },
    { id: "prog-6", name: "B.Tech Civil Engineering", code: "BTECH-CE", department: "Civil", duration: "4 Years", students: 240, coordinator: "Dr. K. V. R. Prasad", status: "Active" },
    { id: "prog-7", name: "B.Tech Electrical and Electronics Engg", code: "BTECH-EEE", department: "EEE", duration: "4 Years", students: 280, coordinator: "Dr. R. Karthik", status: "Active" },
    { id: "prog-8", name: "B.Tech Information Technology", code: "BTECH-IT", department: "IT", duration: "4 Years", students: 240, coordinator: "Dr. Sunita Sharma", status: "Active" },
    { id: "prog-9", name: "M.Tech Software Engineering", code: "MTECH-SE", department: "CSE", duration: "2 Years", students: 60, coordinator: "Dr. S. K. Gupta", status: "Active" },
    { id: "prog-10", name: "M.Tech VLSI and Embedded Systems", code: "MTECH-VLSI", department: "ECE", duration: "2 Years", students: 45, coordinator: "Dr. Meera Rao", status: "Active" },
    { id: "prog-11", name: "Master of Business Administration", code: "MBA-GEN", department: "MBA", duration: "2 Years", students: 180, coordinator: "Dr. Srikant Verma", status: "Active" },
    { id: "prog-12", name: "Master of Computer Applications", code: "MCA-GEN", department: "MCA", duration: "2 Years", students: 120, coordinator: "Dr. Ramesh Agrawal", status: "Active" },
    { id: "prog-13", name: "PhD Computer Science Engineering", code: "PHD-CSE", department: "CSE", duration: "3-5 Years", students: 38, coordinator: "Dr. S. K. Gupta", status: "Active" },
    { id: "prog-14", name: "B.Tech Robotics and Automation", code: "BTECH-RAE", department: "RAE", duration: "4 Years", students: 120, coordinator: "Dr. Arvind Swamy", status: "Active" },
    { id: "prog-15", name: "B.Tech Aerospace Engineering", code: "BTECH-AAE", department: "AAE", duration: "4 Years", students: 90, coordinator: "Dr. Col. Rathore", status: "Active" },
  ];

  const deptsList = ["CSE", "ECE", "ME", "CE", "EEE", "AI & DS", "IT", "MBA", "MCA", "Cyber Security"];
  const designationsList = ["Senior Professor", "Professor", "Associate Professor", "Assistant Professor"];
  const facultyList: FacultyRecord[] = Array.from({ length: 54 }).map((_, idx) => {
    const idNum = 101 + idx;
    const dept = deptsList[idx % deptsList.length];
    const desig = designationsList[idx % designationsList.length];
    const exp = (3 + (idx % 18)) + " Years";
    const work = 12 + (idx % 8);
    return {
      id: "fac-" + idNum,
      facultyId: "FAC-2026-" + idNum,
      name: idx === 0 ? "Prof. Anand Kumar (Academic Dean)" : "Dr. Faculty Member " + (idx + 1),
      department: dept,
      designation: idx === 0 ? "Dean & Senior Professor" : desig,
      experience: exp,
      subjects: ["CS" + (500 + (idx % 10)) + " - Subject " + (idx + 1), "CS" + (600 + (idx % 5)) + " - Elective"],
      workloadHours: work,
      maxWorkloadHours: 20,
      status: idx % 11 === 0 ? "On Leave" : "Active",
      email: idx === 0 ? "academic_dean@college.com" : "faculty" + idNum + "@college.com",
    };
  });

  const courseAllocations: CourseAllocationRecord[] = Array.from({ length: 25 }).map((_, idx) => ({
    id: "alloc-" + (100 + idx),
    subjectCode: "CS" + (501 + (idx % 12)),
    subjectName: [
      "Advanced Software Engineering",
      "Cloud Computing & Systems",
      "AI & Machine Learning",
      "Database Systems",
      "Compiler Design",
      "Operating Systems",
      "Data Structures & Algorithms",
      "Computer Networks",
      "Cyber Security Fundamentals",
      "Web Technologies",
    ][idx % 10],
    facultyName: facultyList[idx % facultyList.length].name,
    department: deptsList[idx % deptsList.length],
    semester: (idx % 8) + 1,
    section: "Sec " + String.fromCharCode(65 + (idx % 3)),
    credits: (idx % 2 === 0) ? 4 : 3,
    status: idx % 7 === 0 ? "Pending" : "Allocated",
  }));

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:15 - 12:15",
    "12:15 - 01:15",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
    "05:00 - 06:00",
  ];

  const weeklyTimetable: Record<string, TimetablePeriodSlot[]> = {};
  days.forEach((day, di) => {
    weeklyTimetable[day] = timeSlots.map((slotTime, pIdx) => {
      const fObj = facultyList[(di + pIdx) % facultyList.length];
      return {
        periodNum: pIdx + 1,
        timeSlot: slotTime,
        subjectCode: "CS" + (501 + ((di * 3 + pIdx) % 15)),
        subjectName: [
          "Advanced Software Engineering",
          "Cloud Computing & Systems",
          "AI & Machine Learning",
          "Database Systems",
          "Compiler Design",
          "Operating Systems",
        ][(di + pIdx) % 6],
        facultyName: fObj.name,
        room: "Lab-" + (301 + (pIdx % 5)),
        semester: 5,
        section: "Sec A",
        branch: "CSE",
      };
    });
  });

  const calendarEvents: AcademicCalendarEvent[] = [
    { id: "cal-1", title: "Autumn Semester Opening & Orientation", type: "Semester Start", date: "2026-08-10", duration: "Full Day", venue: "Main Auditorium", organizer: "Academic Dean Office" },
    { id: "cal-2", title: "R24 Curriculum Revision Council Meeting", type: "Meetings", date: "2026-08-14", duration: "10:00 AM - 01:00 PM", venue: "Boardroom 1", organizer: "Academic Council" },
    { id: "cal-3", title: "Mid-Semester Examinations Phase 1", type: "Exams", date: "2026-09-15", duration: "1 Week", venue: "Exam Halls 1-12", organizer: "Controller of Exams" },
    { id: "cal-4", title: "National Faculty Development Workshop on AI in OBE", type: "Workshops", date: "2026-09-22", duration: "3 Days", venue: "AI Center", organizer: "Academic Dean & IQAC" },
    { id: "cal-5", title: "Gandhi Jayanti Institutional Holiday", type: "Holidays", date: "2026-10-02", duration: "Full Day", venue: "Campus Wide", organizer: "Administration" },
    { id: "cal-6", title: "End-Semester Examinations Commencement", type: "Semester End", date: "2026-11-25", duration: "2 Weeks", venue: "Exam Centers", organizer: "Examination Cell" },
  ];

  const reports: AcademicReportRecord[] = [
    { id: "rep-1", title: "Overall Syllabus Completion Ledger Q3", category: "Course Completion", metric: "94.8% Completed", value: "High Progress", generatedDate: "2026-08-01" },
    { id: "rep-2", title: "Faculty Teaching Workload & Audit Score 2026", category: "Faculty Performance", metric: "4.85 / 5.0 Rating", value: "98% Compliance", generatedDate: "2026-08-02" },
    { id: "rep-3", title: "Department-wise OBE Learning Outcome Attainment", category: "Department Performance", metric: "89.2% Target Achieved", value: "Exceeds Benchmark", generatedDate: "2026-08-03" },
    { id: "rep-4", title: "Student Attendance & Shortage Audit Report", category: "Attendance Report", metric: "91.4% Avg Attendance", value: "Clean Ledger", generatedDate: "2026-08-04" },
    { id: "rep-5", title: "End-Semester Result Analysis & SGPA Distribution", category: "Result Analysis", metric: "92.6% Pass Rate", value: "Top Tier", generatedDate: "2026-08-04" },
  ];

  const notifications: AcademicNotification[] = [
    { id: "not-1", title: "Curriculum Approval Required", message: "HOD CSE submitted R24 Course Allocation revision for approval", time: "10 mins ago", type: "warning" },
    { id: "not-2", title: "Academic Council Meeting Scheduled", message: "Academic Council Meeting set for Friday, 10:00 AM in Senate Hall", time: "1 hour ago", type: "info" },
    { id: "not-3", title: "Syllabus Audit Ledger Complete", message: "All 15 departments submitted August syllabus coverage report", time: "3 hours ago", type: "success" },
    { id: "not-4", title: "Faculty Workload Threshold Warning", message: "2 faculty members in EEE exceed maximum 20-hour weekly load", time: "5 hours ago", type: "urgent" },
  ];

  const recentActivities: AcademicActivity[] = [
    { id: "act-1", title: "Approved Course Allocation", description: "Approved CSE Sem 5 Course Allocation for R24 Regulation", time: "30 mins ago", user: "Prof. Anand Kumar" },
    { id: "act-2", title: "Timetable Published", description: "Master Weekly Timetable for Autumn 2026 published to portal", time: "2 hours ago", user: "Academic Office" },
    { id: "act-3", title: "Department Audit Reviewed", description: "Reviewed AI & DS Department Syllabus Completion Report", time: "4 hours ago", user: "Prof. Anand Kumar" },
    { id: "act-4", title: "Faculty Substitute Approved", description: "Approved class substitution request for Dr. Meera Rao", time: "1 day ago", user: "Academic Dean" },
  ];

  return {
    kpis: {
      departments: 12,
      programs: 38,
      faculty: 245,
      students: 5420,
      todaysClasses: 126,
      pendingCurriculumApprovals: 9,
      upcomingAcademicMeetings: 4,
    },
    departments,
    programs,
    facultyList,
    courseAllocations,
    weeklyTimetable,
    myTimetable: {
      todaysClasses: weeklyTimetable["Monday"].slice(0, 4),
      assignedSubjects: ["CS501 Advanced Software Engg", "CS503 Cloud Computing & Systems"],
      sections: ["CSE Sem 5 - Sec A", "CSE Sem 5 - Sec B"],
      pendingAttendanceCount: 1,
    },
    calendarEvents,
    reports,
    notifications,
    recentActivities,
    charts: {
      deptWiseFaculty: [
        { dept: "CSE", count: 38 },
        { dept: "ECE", count: 32 },
        { dept: "ME", count: 26 },
        { dept: "EEE", count: 24 },
        { dept: "IT", count: 24 },
        { dept: "AI & DS", count: 22 },
        { dept: "Civil", count: 20 },
        { dept: "Cyber Sec", count: 18 },
      ],
      studentDistribution: [
        { dept: "CSE", count: 840 },
        { dept: "ECE", count: 720 },
        { dept: "ME", count: 580 },
        { dept: "EEE", count: 540 },
        { dept: "AI & DS", count: 480 },
        { dept: "IT", count: 480 },
        { dept: "Civil", count: 420 },
      ],
      courseCompletion: [
        { month: "Jan", percentage: 20 },
        { month: "Feb", percentage: 40 },
        { month: "Mar", percentage: 60 },
        { month: "Apr", percentage: 78 },
        { month: "May", percentage: 94 },
      ],
      attendanceTrends: [
        { month: "Week 1", attendance: 95.2 },
        { month: "Week 2", attendance: 94.1 },
        { month: "Week 3", attendance: 93.8 },
        { month: "Week 4", attendance: 94.6 },
        { month: "Week 5", attendance: 95.8 },
      ],
      facultyWorkload: [
        { dept: "CSE", avgHours: 16.4 },
        { dept: "ECE", avgHours: 15.8 },
        { dept: "ME", avgHours: 16.0 },
        { dept: "EEE", avgHours: 17.2 },
        { dept: "AI & DS", avgHours: 15.5 },
      ],
    },
  };
}

// ----------------------------------------------------------------------
// 1. STUDENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface StudentRecord {
  rollNo: string;
  name: string;
  department: string;
  year: string;
  attendance: number;
  cgpa: number;
  status: "Active" | "Detained" | "Graduated";
}

export interface GrievanceRecord {
  id: string;
  student: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
}

export interface StudentDeanDashboardData {
  kpis: {
    totalStudents: number;
    avgAttendance: string;
    activeGrievances: number;
    resolvedGrievancesPct: string;
    activeClubs: number;
    hostelOccupancyPct: string;
    scholarshipsDisbursed: string;
  };
  students: StudentRecord[];
  grievances: GrievanceRecord[];
  clubs: { name: string; category: string; members: number; lead: string }[];
  hostelRooms: { block: string; totalRooms: number; occupied: number; status: string }[];
  scholarships: { name: string; amount: string; recipients: number; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getStudentDeanDashboardData(): StudentDeanDashboardData {
  return {
    kpis: {
      totalStudents: 5420,
      avgAttendance: "92.4%",
      activeGrievances: 4,
      resolvedGrievancesPct: "98.2%",
      activeClubs: 42,
      hostelOccupancyPct: "94.5%",
      scholarshipsDisbursed: "₹1.85 Cr",
    },
    students: Array.from({ length: 20 }).map((_, i) => ({
      rollNo: "22CS" + (101 + i),
      name: "Student Name " + (i + 1),
      department: ["CSE", "ECE", "ME", "EEE", "AI & DS"][i % 5],
      year: "Year " + ((i % 4) + 1),
      attendance: 85 + (i % 14),
      cgpa: +(7.5 + (i % 25) * 0.1).toFixed(2),
      status: i % 12 === 0 ? "Detained" : "Active",
    })),
    grievances: [
      { id: "GRV-901", student: "K. Sai Teja (22CS101)", category: "Hostel Wi-Fi Bandwidth", priority: "Medium", status: "In Progress", date: "2026-08-01" },
      { id: "GRV-902", student: "Student Council", category: "Cafeteria Hygiene Audit", priority: "High", status: "Resolved", date: "2026-08-02" },
      { id: "GRV-903", student: "Research Scholars", category: "Library Night Facility", priority: "Low", status: "Resolved", date: "2026-08-03" },
      { id: "GRV-904", student: "Ananya Roy (23EC204)", category: "Sports Ground Lighting", priority: "Medium", status: "Open", date: "2026-08-04" },
    ],
    clubs: [
      { name: "Coding & Hackathon Club", category: "Technical", members: 340, lead: "Ananya Roy (CSE)" },
      { name: "Robotics & Automation Guild", category: "Technical", members: 210, lead: "K. Sai Teja (ECE)" },
      { name: "Literary & Debate Society", category: "Cultural", members: 185, lead: "Rohan Varma (ME)" },
      { name: "NSS & Community Service", category: "Social Welfare", members: 450, lead: "Priya Sundaram (EEE)" },
    ],
    hostelRooms: [
      { block: "A Block (Boys)", totalRooms: 200, occupied: 192, status: "96% Occupied" },
      { block: "B Block (Boys)", totalRooms: 180, occupied: 170, status: "94% Occupied" },
      { block: "C Block (Girls)", totalRooms: 220, occupied: 210, status: "95% Occupied" },
      { block: "D Block (Girls)", totalRooms: 150, occupied: 135, status: "90% Occupied" },
    ],
    scholarships: [
      { name: "Merit-cum-Means National Scholarship", amount: "₹50,000 / Student", recipients: 120, status: "Disbursed" },
      { name: "State Government Fee Reimbursement", amount: "₹35,000 / Student", recipients: 340, status: "Verified" },
      { name: "Alumni Endowment Excellence Fund", amount: "₹25,000 / Student", recipients: 45, status: "Approved" },
    ],
    reports: [
      { title: "Monthly Student Attendance & Shortage Report", metric: "92.4% Overall Avg", date: "2026-08-01" },
      { title: "Hostel Welfare & Discipline Audit Report", metric: "Zero Ragging Incidents", date: "2026-08-02" },
      { title: "Grievance Redressal Committee Annual Ledger", metric: "98.2% Resolution SLA", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 2. IQAC DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface IqacDashboardData {
  kpis: {
    naacScore: string;
    nbaAccreditedDepts: string;
    aqarStatus: string;
    facultyQualityIndex: string;
    auditCompletionPct: string;
  };
  naacCriteria: { id: string; criterion: string; weightage: number; score: number; status: string }[];
  qualityAudits: { id: string; dept: string; type: string; score: string; date: string }[];
  ssrMetrics: { code: string; metricName: string; target: string; current: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getIqacDashboardData(): IqacDashboardData {
  return {
    kpis: {
      naacScore: "3.78 / 4.0 (Grade A++)",
      nbaAccreditedDepts: "12 / 15 Depts",
      aqarStatus: "Submitted (2025-26)",
      facultyQualityIndex: "94.2%",
      auditCompletionPct: "98.5%",
    },
    naacCriteria: [
      { id: "C1", criterion: "Curricular Aspects", weightage: 150, score: 142, status: "Excellent" },
      { id: "C2", criterion: "Teaching-Learning and Evaluation", weightage: 350, score: 338, status: "Excellent" },
      { id: "C3", criterion: "Research, Innovations and Extension", weightage: 150, score: 139, status: "Very Good" },
      { id: "C4", criterion: "Infrastructure and Learning Resources", weightage: 100, score: 96, status: "Excellent" },
      { id: "C5", criterion: "Student Support and Progression", weightage: 100, score: 94, status: "Excellent" },
      { id: "C6", criterion: "Governance, Leadership and Management", weightage: 100, score: 95, status: "Excellent" },
      { id: "C7", criterion: "Institutional Values and Best Practices", weightage: 50, score: 48, status: "Excellent" },
    ],
    qualityAudits: [
      { id: "AUD-2026-01", dept: "CSE", type: "Academic & Administrative Audit", score: "4.85 / 5.0", date: "2026-07-15" },
      { id: "AUD-2026-02", dept: "ECE", type: "NBA Outcome Assessment Audit", score: "4.78 / 5.0", date: "2026-07-20" },
      { id: "AUD-2026-03", dept: "ME", type: "Laboratory & Safety Audit", score: "4.65 / 5.0", date: "2026-07-28" },
    ],
    ssrMetrics: [
      { code: "1.1.1", metricName: "Curriculum Design & OBE Alignment", target: "100%", current: "96.4%", status: "Achieved" },
      { code: "2.4.1", metricName: "Full-Time Faculty with Ph.D Degree", target: "80%", current: "84.2%", status: "Exceeds Target" },
      { code: "3.4.2", metricName: "SCI/Scopus Publications per Faculty", target: "2.0 / Year", current: "2.3 / Year", status: "Exceeds Target" },
    ],
    reports: [
      { title: "Annual Quality Assurance Report (AQAR 2025-26)", metric: "Clean NAAC Audit Pass", date: "2026-08-01" },
      { title: "Institutional Self Study Report (SSR Dossier)", metric: "Grade A++ Standard", date: "2026-08-03" },
    ],
  };
}

// ----------------------------------------------------------------------
// 3. IMA DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ImaDashboardData {
  kpis: {
    activeProjects: number;
    complianceScore: string;
    policyDirectives: number;
    infraBudgetUsed: string;
    assetAuditPassPct: string;
  };
  campusProjects: { name: string; budget: string; progress: number; targetDate: string }[];
  policyDirectives: { id: string; title: string; category: string; status: string }[];
  complianceAudits: { area: string; standard: string; compliance: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getImaDashboardData(): ImaDashboardData {
  return {
    kpis: {
      activeProjects: 8,
      complianceScore: "100%",
      policyDirectives: 24,
      infraBudgetUsed: "₹12.4 Cr",
      assetAuditPassPct: "99.2%",
    },
    campusProjects: [
      { name: "New Advanced AI & Supercomputing Lab Building", budget: "₹6.5 Cr", progress: 82, targetDate: "Oct 2026" },
      { name: "Solar Rooftop 500kW Green Energy Transition", budget: "₹2.2 Cr", progress: 95, targetDate: "Aug 2026" },
      { name: "Central Auditorium Acoustics & AV Upgrade", budget: "₹1.8 Cr", progress: 60, targetDate: "Nov 2026" },
      { name: "Student Innovation Incubator Center Extension", budget: "₹1.9 Cr", progress: 40, targetDate: "Dec 2026" },
    ],
    policyDirectives: [
      { id: "POL-2026-01", title: "Institutional IT Security & Cloud Governance", category: "IT Policy", status: "Active" },
      { id: "POL-2026-02", title: "Green Campus Net Zero Carbon Neutral Directive", category: "Environment", status: "Active" },
      { id: "POL-2026-03", title: "Campus Procurement & Asset Inventory Guideline", category: "Administration", status: "Under Review" },
    ],
    complianceAudits: [
      { area: "Fire & Campus Safety", standard: "NFPA Compliance", compliance: "100%", status: "Certified" },
      { area: "Electrical & Substation", standard: "IEEE Safety Standard", compliance: "100%", status: "Certified" },
      { area: "Waste & Sewage Treatment", standard: "State PCB Norms", compliance: "98.5%", status: "Compliant" },
    ],
    reports: [
      { title: "Master Infrastructure Masterplan Progress Report", metric: "8 Active Projects", date: "2026-08-01" },
      { title: "Institutional Compliance & Governance Ledger", metric: "100% Compliance Pass", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 4. RESEARCH & DEVELOPMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ResearchDevelopmentDashboardData {
  kpis: {
    totalGrantFunds: string;
    publishedPapers: number;
    patentsFiled: number;
    activePhdScholars: number;
    incubationStartups: number;
  };
  topGrants: { title: string; agency: string; amount: string; status: string }[];
  publications: { title: string; journal: string; impactFactor: string; authors: string }[];
  patents: { title: string; patentNo: string; filingDate: string; status: string }[];
  phdScholars: { name: string; dept: string; guide: string; topic: string; year: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getResearchDevelopmentDashboardData(): ResearchDevelopmentDashboardData {
  return {
    kpis: {
      totalGrantFunds: "₹4.85 Cr",
      publishedPapers: 142,
      patentsFiled: 18,
      activePhdScholars: 86,
      incubationStartups: 12,
    },
    topGrants: [
      { title: "DST SERB: Quantum Machine Learning for Edge Devices", agency: "DST SERB", amount: "₹85.0 Lakhs", status: "Active" },
      { title: "ISRO RESPOND: Satellite Image Segmentation with Deep Learning", agency: "ISRO", amount: "₹62.5 Lakhs", status: "Active" },
      { title: "AICTE IDEA Lab Industry Collaboration Grant", agency: "AICTE", amount: "₹50.0 Lakhs", status: "Approved" },
      { title: "MeitY Microelectronics Fabrication Research Project", agency: "MeitY", amount: "₹1.2 Cr", status: "Under Review" },
    ],
    publications: [
      { title: "Deep Transformer Networks for Medical Image Diagnostics", journal: "IEEE Transactions on Medical Imaging", impactFactor: "10.6", authors: "Dr. S. K. Gupta et al." },
      { title: "Smart Grid Load Forecasting via Hybrid LSTM Networks", journal: "Elsevier Energy Conversion", impactFactor: "8.9", authors: "Dr. R. Karthik et al." },
      { title: "Graphene Nanocomposites for Aerospace Structural Components", journal: "Nature Materials Today", impactFactor: "12.4", authors: "Dr. Rajeshwar Rao et al." },
    ],
    patents: [
      { title: "AI-Powered Non-Invasive Blood Glucose Sensor Device", patentNo: "IN-2026110948", filingDate: "2026-03-12", status: "Published" },
      { title: "Self-Healing Solar Panel Coating Material", patentNo: "IN-2026110982", filingDate: "2026-05-18", status: "Under Examination" },
    ],
    phdScholars: [
      { name: "Praveen Kumar", dept: "CSE", guide: "Dr. S. K. Gupta", topic: "Federated Learning Privacy Models", year: "Year 3" },
      { name: "Sneha Reddy", dept: "ECE", guide: "Dr. Meera Rao", topic: "5G mmWave Beamforming Algorithms", year: "Year 2" },
    ],
    reports: [
      { title: "Annual Institutional Research & Journal Publication Compendium", metric: "142 SCI/Scopus Papers", date: "2026-08-01" },
      { title: "Sponsored Research Grants & DST Funding Audit Ledger", metric: "₹4.85 Cr Total Grants", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 5. FINANCE DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface FinanceDeanDashboardData {
  kpis: {
    totalBudget: string;
    disbursedFunds: string;
    pendingFeeDues: string;
    auditPassStatus: string;
    payrollDisbursedPct: string;
  };
  deptBudgets: { dept: string; allocated: string; spent: string; percentage: number }[];
  feeCollections: { category: string; expected: string; collected: string; pending: string }[];
  expenseLedger: { id: string; category: string; amount: string; date: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getFinanceDeanDashboardData(): FinanceDeanDashboardData {
  return {
    kpis: {
      totalBudget: "₹48.5 Cr",
      disbursedFunds: "₹36.2 Cr",
      pendingFeeDues: "₹1.4 Cr",
      auditPassStatus: "Clean Audit Pass (FY26)",
      payrollDisbursedPct: "100%",
    },
    deptBudgets: [
      { dept: "CSE & AI Labs", allocated: "₹8.5 Cr", spent: "₹7.2 Cr", percentage: 84.7 },
      { dept: "ECE Robotics & VLSI", allocated: "₹6.8 Cr", spent: "₹5.9 Cr", percentage: 86.7 },
      { dept: "Mechanical & CAD Labs", allocated: "₹5.2 Cr", spent: "₹4.5 Cr", percentage: 86.5 },
      { dept: "Library Digital Resources", allocated: "₹3.0 Cr", spent: "₹2.8 Cr", percentage: 93.3 },
      { dept: "R&D Seed Grants", allocated: "₹2.5 Cr", spent: "₹2.1 Cr", percentage: 84.0 },
    ],
    feeCollections: [
      { category: "Tuition Fee Autumn 2026", expected: "₹24.0 Cr", collected: "₹23.1 Cr", pending: "₹90 Lakhs" },
      { category: "Hostel & Mess Fee", expected: "₹6.5 Cr", collected: "₹6.1 Cr", pending: "₹40 Lakhs" },
      { category: "Transport & Bus Fee", expected: "₹2.2 Cr", collected: "₹2.1 Cr", pending: "₹10 Lakhs" },
    ],
    expenseLedger: [
      { id: "EXP-2026-901", category: "Faculty Monthly Payroll (July 2026)", amount: "₹2.85 Cr", date: "2026-08-01", status: "Paid" },
      { id: "EXP-2026-902", category: "Supercomputing Server Hardware Upgrade", amount: "₹45.0 Lakhs", date: "2026-08-02", status: "Approved" },
    ],
    reports: [
      { title: "Institutional Annual Financial Budget & Balance Sheet 2026", metric: "Clean Statutory Audit", date: "2026-08-01" },
      { title: "Department Budget Utilization & Expenditure Audit", metric: "88.4% Average Utilization", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 6. EXAMINATION DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ExaminationDeanDashboardData {
  kpis: {
    examsScheduled: number;
    hallTicketsIssued: number;
    revaluationRequests: number;
    avgResultDays: number;
    passPercentage: string;
  };
  examSchedules: { code: string; subject: string; date: string; session: string; students: number }[];
  revaluations: { id: string; student: string; subject: string; currentGrade: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getExaminationDeanDashboardData(): ExaminationDeanDashboardData {
  return {
    kpis: {
      examsScheduled: 184,
      hallTicketsIssued: 4850,
      revaluationRequests: 14,
      avgResultDays: 14,
      passPercentage: "92.6%",
    },
    examSchedules: [
      { code: "CS401", subject: "Deep Learning & Neural Networks", date: "2026-08-18", session: "Morning (09:30 AM)", students: 420 },
      { code: "EC304", subject: "VLSI Design & Embedded Systems", date: "2026-08-19", session: "Afternoon (02:00 PM)", students: 380 },
      { code: "EE202", subject: "Power Electronics & Smart Grids", date: "2026-08-20", session: "Morning (09:30 AM)", students: 260 },
      { code: "ME305", subject: "Finite Element Analysis", date: "2026-08-21", session: "Afternoon (02:00 PM)", students: 310 },
    ],
    revaluations: [
      { id: "REV-2026-01", student: "K. Sai Teja (22CS101)", subject: "CS401 Deep Learning", currentGrade: "B+", status: "Under Review" },
      { id: "REV-2026-02", student: "Ananya Roy (22EC104)", subject: "EC304 VLSI Design", currentGrade: "A", status: "Grade Updated" },
    ],
    reports: [
      { title: "Controller of Examinations Annual Result Analysis Report", metric: "92.6% Pass Rate", date: "2026-08-01" },
      { title: "Hall Ticket Dispatch & Attendance SLA Audit", metric: "100% On-Time Generation", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 7. PLACEMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface PlacementDeanDashboardData {
  kpis: {
    placementRate: string;
    highestPackage: string;
    averagePackage: string;
    drivesCompleted: number;
    activeMoUs: number;
  };
  topRecruiters: { company: string; offers: number; package: string; tier: string }[];
  placementDrives: { company: string; driveDate: string; eligibleStudents: number; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getPlacementDeanDashboardData(): PlacementDeanDashboardData {
  return {
    kpis: {
      placementRate: "92.6%",
      highestPackage: "₹44.5 LPA",
      averagePackage: "₹11.8 LPA",
      drivesCompleted: 78,
      activeMoUs: 42,
    },
    topRecruiters: [
      { company: "Google Cloud India", offers: 18, package: "₹44.5 LPA", tier: "Dream Tier 1" },
      { company: "Microsoft R&D", offers: 24, package: "₹38.0 LPA", tier: "Dream Tier 1" },
      { company: "Qualcomm India", offers: 32, package: "₹26.5 LPA", tier: "Tier 1" },
      { company: "Amazon AWS", offers: 28, package: "₹32.0 LPA", tier: "Dream Tier 1" },
      { company: "Deloitte Digital", offers: 64, package: "₹14.0 LPA", tier: "Mass Recruiter" },
    ],
    placementDrives: [
      { company: "Google Cloud India Drive", driveDate: "2026-08-12", eligibleStudents: 240, status: "Scheduled" },
      { company: "Microsoft Campus Recruitment", driveDate: "2026-08-20", eligibleStudents: 310, status: "Registration Open" },
      { company: "Qualcomm VLSI Placement Drive", driveDate: "2026-08-25", eligibleStudents: 180, status: "Shortlisting" },
    ],
    reports: [
      { title: "Executive Placement & Corporate Recruiting Statistics 2026", metric: "92.6% Placement Rate", date: "2026-08-01" },
      { title: "Tier-1 Corporate MoU & Industry Cell Report", metric: "42 Active Corporate MoUs", date: "2026-08-04" },
    ],
  };
}
`;

const targetPath = path.join(process.cwd(), 'src/lib/deansService.ts');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully written src/lib/deansService.ts');
