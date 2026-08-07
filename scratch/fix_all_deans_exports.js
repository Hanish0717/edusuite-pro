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
  ];

  const programs: ProgramRecord[] = [
    { id: "prog-1", name: "B.Tech Computer Science Engineering", code: "BTECH-CSE", department: "CSE", duration: "4 Years", students: 480, coordinator: "Dr. S. K. Gupta", status: "Active" },
  ];

  const facultyList: FacultyRecord[] = Array.from({ length: 15 }).map((_, idx) => ({
    id: "fac-" + (101 + idx),
    facultyId: "FAC-2026-" + (101 + idx),
    name: idx === 0 ? "Prof. Anand Kumar (Academic Dean)" : "Dr. Faculty Member " + (idx + 1),
    department: "CSE",
    designation: idx === 0 ? "Dean & Senior Professor" : "Professor",
    experience: "10 Years",
    subjects: ["CS501 - Advanced Software Engg"],
    workloadHours: 16,
    maxWorkloadHours: 20,
    status: "Active",
    email: "faculty" + (101 + idx) + "@college.com",
  }));

  const courseAllocations: CourseAllocationRecord[] = [
    { id: "alloc-101", subjectCode: "CS501", subjectName: "Advanced Software Engineering", facultyName: "Prof. Anand Kumar", department: "CSE", semester: 5, section: "Sec A", credits: 4, status: "Allocated" },
  ];

  const weeklyTimetable: Record<string, TimetablePeriodSlot[]> = {
    Monday: [
      { periodNum: 1, timeSlot: "09:00 - 10:00", subjectCode: "CS501", subjectName: "Advanced Software Engineering", facultyName: "Prof. Anand Kumar", room: "Lab-301", semester: 5, section: "Sec A", branch: "CSE" },
    ],
  };

  return {
    kpis: { departments: 12, programs: 38, faculty: 245, students: 5420, todaysClasses: 126, pendingCurriculumApprovals: 9, upcomingAcademicMeetings: 4 },
    departments,
    programs,
    facultyList,
    courseAllocations,
    weeklyTimetable,
    myTimetable: { todaysClasses: weeklyTimetable["Monday"], assignedSubjects: ["CS501"], sections: ["CSE Sem 5 - Sec A"], pendingAttendanceCount: 1 },
    calendarEvents: [{ id: "cal-1", title: "Autumn Opening", type: "Semester Start", date: "2026-08-10", duration: "Full Day", venue: "Main Auditorium", organizer: "Academic Dean" }],
    reports: [{ id: "rep-1", title: "Syllabus Completion", category: "Course Completion", metric: "94.8%", value: "High Progress", generatedDate: "2026-08-01" }],
    notifications: [{ id: "not-1", title: "Curriculum Revision", message: "HOD CSE submitted R24 allocation", time: "10 mins ago", type: "warning" }],
    recentActivities: [{ id: "act-1", title: "Approved Allocation", description: "Approved CSE Sem 5 allocation", time: "30 mins ago", user: "Prof. Anand Kumar" }],
    charts: {
      deptWiseFaculty: [{ dept: "CSE", count: 38 }],
      studentDistribution: [{ dept: "CSE", count: 840 }],
      courseCompletion: [{ month: "Jan", percentage: 20 }],
      attendanceTrends: [{ month: "Week 1", attendance: 95.2 }],
      facultyWorkload: [{ dept: "CSE", avgHours: 16.4 }],
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
  section: string;
  attendance: number;
  cgpa: number;
  gender: "Male" | "Female";
  admissionQuota: "Merit" | "Management" | "Convenor";
  scholarshipStatus: "Approved" | "Pending" | "None";
  hostelStatus: "Hosteller" | "Day Scholar";
  guardianName: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  status: "Active" | "Detained" | "Graduated";
}

export interface GrievanceRecord {
  id: string;
  student: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed";
  assignedOfficer: string;
  timeline: string;
  date: string;
}

export interface ScholarshipRecord {
  id: string;
  student: string;
  scheme: string;
  category: "Government" | "Merit" | "Private" | "Minority" | "SC/ST" | "BC" | "EWS";
  amount: string;
  appliedDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface DisciplineRecord {
  id: string;
  student: string;
  incidentType: string;
  actionTaken: "Warning Letter" | "Suspension" | "Counselling" | "Resolved";
  hearingDate: string;
  status: "Open" | "Under Review" | "Closed";
}

export interface CounsellingRecord {
  id: string;
  student: string;
  counsellor: string;
  issueCategory: string;
  sessionDate: string;
  status: "Upcoming" | "Completed" | "Pending";
}

export interface StudentRequestRecord {
  id: string;
  student: string;
  requestType: "Bonafide" | "Transfer Certificate (TC)" | "Migration" | "ID Card Reissue" | "Fee Receipt" | "Hall Ticket" | "Conduct Certificate";
  appliedDate: string;
  status: "Approved" | "In Process" | "Rejected";
}

export interface StudentActivityRecord {
  id: string;
  activityName: string;
  category: "Sports" | "NSS" | "NCC" | "Technical Club" | "Hackathon" | "Workshop";
  date: string;
  participantsCount: number;
  achievement: string;
}

export interface StudentDeanDashboardData {
  kpis: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    overallAttendancePct: string;
    activeGrievances: number;
    scholarshipsApproved: string;
    hostelStudents: number;
    activeClubs: number;
    eventsThisMonth: number;
    boysHostel: number;
    girlsHostel: number;
    vacantHostelRooms: number;
  };
  deptCounts: { dept: string; count: number }[];
  genderRatio: { gender: string; percentage: number }[];
  yearDistribution: { year: string; count: number }[];
  students: StudentRecord[];
  grievances: GrievanceRecord[];
  scholarships: ScholarshipRecord[];
  disciplineCases: DisciplineRecord[];
  counsellingSessions: CounsellingRecord[];
  studentRequests: StudentRequestRecord[];
  studentActivities: StudentActivityRecord[];
  clubs: { name: string; category: string; facultyCoordinator: string; studentCoordinator: string; members: number }[];
  hostelComplaints: { id: string; hostelBlock: string; issue: string; warden: string; status: string }[];
  attendanceHistory: { date: string; department: string; section: string; faculty: string; attendancePct: number; present: number; absent: number; lateEntries: number }[];
  officialSchedule: { day: string; period: string; subject: string; section: string; room: string; time: string; type: string }[];
  facultyTimetables: { facultyName: string; department: string; subject: string; day: string; period: string; room: string }[];
  substitutionHistory: { date: string; subject: string; originalFaculty: string; substituteFaculty: string; reason: string; status: string }[];
  notificationsSystem: {
    received: { id: string; sender: string; title: string; category: string; priority: string; date: string; read: boolean }[];
    sent: { id: string; receiver: string; title: string; category: string; priority: string; date: string; read: boolean }[];
  };
}

export function getStudentDeanDashboardData(): StudentDeanDashboardData {
  const students: StudentRecord[] = Array.from({ length: 25 }).map((_, i) => {
    const name = [
      "Rahul Sharma", "Priya Reddy", "K. Sai Teja", "Anjali Verma", "Rohit Kumar",
      "Nikhil Reddy", "Sneha Rao", "Harsha Vardhan", "Akhila Devi", "Abhishek Kumar",
      "Kavya Nair", "Vikram Malhotra", "Sunita Sharma", "Rohan Varma", "Priya Sundaram",
      "Arvind Swamy", "Divya Sharma", "Siddharth Rao", "Arjun Verma", "Meera Nair",
      "Rajesh Varma", "Sujatha Reddy", "Karthik Raja", "Deepika Padukone", "Vijay Kumar"
    ][i % 25];

    const indianDepts = ["CSE", "ECE", "EEE", "Civil", "Mechanical", "MBA", "MCA", "AI & DS", "Cyber Security", "IoT"];
    const dept = indianDepts[i % indianDepts.length];
    const rollNo = "22" + dept.substring(0, 2).toUpperCase() + (101 + i);
    const gender = i % 2 === 0 ? "Male" : "Female";

    return {
      rollNo,
      name,
      department: dept,
      year: "Year " + ((i % 4) + 1),
      section: "Sec " + String.fromCharCode(65 + (i % 3)),
      attendance: 78 + (i % 21),
      cgpa: +(7.2 + (i % 25) * 0.1).toFixed(2),
      gender,
      admissionQuota: ["Convenor", "Merit", "Management"][i % 3] as any,
      scholarshipStatus: i % 2 === 0 ? "Approved" : "Pending",
      hostelStatus: i % 3 === 0 ? "Hosteller" : "Day Scholar",
      guardianName: name.split(" ")[0] + " Father/Guardian",
      phone: "+91 98480 " + (10000 + i * 111),
      email: name.toLowerCase().replace(/[^a-z]/g, "") + "@edusuite.edu.in",
      address: "Plot " + (12 + i) + ", Jubilee Hills, Hyderabad, Telangana",
      bloodGroup: ["O+", "A+", "B+", "AB+"][i % 4],
      emergencyContact: "+91 99490 " + (20000 + i * 222),
      status: i % 12 === 0 ? "Detained" : "Active",
    };
  });

  return {
    kpis: {
      totalStudents: 5420,
      activeStudents: 5280,
      inactiveStudents: 140,
      overallAttendancePct: "92.4%",
      activeGrievances: 4,
      scholarshipsApproved: "₹1.85 Cr",
      hostelStudents: 1850,
      activeClubs: 42,
      eventsThisMonth: 8,
      boysHostel: 1100,
      girlsHostel: 750,
      vacantHostelRooms: 45,
    },
    deptCounts: [
      { dept: "CSE", count: 1240 },
      { dept: "ECE", count: 980 },
      { dept: "EEE", count: 650 },
      { dept: "Civil", count: 480 },
      { dept: "Mechanical", count: 620 },
      { dept: "MBA", count: 320 },
      { dept: "MCA", count: 240 },
      { dept: "AI & DS", count: 480 },
      { dept: "Cyber Security", count: 260 },
      { dept: "IoT", count: 150 },
    ],
    genderRatio: [
      { gender: "Male", percentage: 58 },
      { gender: "Female", percentage: 42 },
    ],
    yearDistribution: [
      { year: "1st Year", count: 1450 },
      { year: "2nd Year", count: 1380 },
      { year: "3rd Year", count: 1320 },
      { year: "4th Year", count: 1270 },
    ],
    students,
    grievances: [
      { id: "GRV-901", student: "K. Sai Teja (22CS101)", category: "Hostel Wi-Fi Bandwidth", priority: "Medium", status: "In Progress", assignedOfficer: "Col. R. S. Rathore", timeline: "Resolution in 2 Days", date: "2026-08-01" },
      { id: "GRV-902", student: "Rahul Sharma (22CS102)", category: "Cafeteria Hygiene Audit", priority: "High", status: "Closed", assignedOfficer: "Prof. Student Dean", timeline: "Resolved", date: "2026-08-02" },
      { id: "GRV-903", student: "Priya Reddy (22EC103)", category: "Library Night Facility", priority: "Low", status: "Closed", assignedOfficer: "M. N. Swamy", timeline: "Resolved", date: "2026-08-03" },
      { id: "GRV-904", student: "Ananya Roy (23EC204)", category: "Sports Ground Lighting", priority: "Medium", status: "Open", assignedOfficer: "Dr. Ananya Sen", timeline: "Under Investigation", date: "2026-08-04" },
    ],
    scholarships: [
      { id: "SCH-101", student: "Rahul Sharma", scheme: "State Govt Fee Reimbursement", category: "BC", amount: "₹35,000", appliedDate: "2026-07-15", status: "Approved" },
      { id: "SCH-102", student: "Priya Reddy", scheme: "National Merit Scholarship", category: "Merit", amount: "₹50,000", appliedDate: "2026-07-18", status: "Approved" },
      { id: "SCH-103", student: "K. Sai Teja", scheme: "Post-Matric SC/ST Welfare Fund", category: "SC/ST", amount: "₹45,000", appliedDate: "2026-07-20", status: "Approved" },
      { id: "SCH-104", student: "Anjali Verma", scheme: "Economically Weaker Section Support", category: "EWS", amount: "₹30,000", appliedDate: "2026-07-22", status: "Pending" },
    ],
    disciplineCases: [
      { id: "DIS-01", student: "Harsha Vardhan (22ME108)", incidentType: "Campus Attendance Deficit", actionTaken: "Warning Letter", hearingDate: "2026-08-02", status: "Closed" },
      { id: "DIS-02", student: "Abhishek Kumar (22CE110)", incidentType: "Library Late Book Return Penalty", actionTaken: "Counselling", hearingDate: "2026-08-04", status: "Closed" },
    ],
    counsellingSessions: [
      { id: "CNS-901", student: "Sneha Rao (22CS107)", counsellor: "Dr. Sunita Sharma", issueCategory: "Academic Stress & Career Guidance", sessionDate: "2026-08-10", status: "Upcoming" },
      { id: "CNS-902", student: "Nikhil Reddy (22EC106)", counsellor: "Dr. Ravi Kumar", issueCategory: "Peer Mentoring & Time Management", sessionDate: "2026-08-03", status: "Completed" },
    ],
    studentRequests: [
      { id: "REQ-501", student: "Rahul Sharma", requestType: "Bonafide Certificate", appliedDate: "2026-08-02", status: "Approved" },
      { id: "REQ-502", student: "Priya Reddy", requestType: "ID Card Reissue", appliedDate: "2026-08-03", status: "In Process" },
      { id: "REQ-503", student: "K. Sai Teja", requestType: "Fee Receipt Duplicate", appliedDate: "2026-08-04", status: "Approved" },
    ],
    studentActivities: [
      { id: "ACT-01", activityName: "Inter-College Cricket Tournament 2026", category: "Sports", date: "2026-08-01", participantsCount: 140, achievement: "Winners Trophy" },
      { id: "ACT-02", activityName: "National Hackathon 24-Hour Codefest", category: "Hackathon", date: "2026-07-28", participantsCount: 220, achievement: "1st Prize ₹50,000" },
    ],
    clubs: [
      { name: "Coding & Hackathon Society", category: "Technical", facultyCoordinator: "Dr. S. K. Gupta", studentCoordinator: "Rahul Sharma", members: 340 },
      { name: "Robotics & Embedded Guild", category: "Technical", facultyCoordinator: "Dr. Meera Rao", studentCoordinator: "K. Sai Teja", members: 210 },
      { name: "Literary & Public Speaking Club", category: "Cultural", facultyCoordinator: "Dr. Sunita Sharma", studentCoordinator: "Priya Reddy", members: 185 },
    ],
    hostelComplaints: [
      { id: "HMC-01", hostelBlock: "Boys Hostel Block A", issue: "Geyser Maintenance", warden: "Col. R. S. Rathore", status: "Resolved" },
      { id: "HMC-02", hostelBlock: "Girls Hostel Block C", issue: "Mess Menu Variation", warden: "Mrs. G. Sujatha", status: "In Progress" },
    ],
    attendanceHistory: [
      { date: "2026-08-04", department: "CSE", section: "Sec A", faculty: "Prof. Student Dean", attendancePct: 95.8, present: 46, absent: 2, lateEntries: 1 },
      { date: "2026-08-03", department: "CSE", section: "Sec B", faculty: "Dr. S. K. Gupta", attendancePct: 93.4, present: 44, absent: 3, lateEntries: 2 },
    ],
    officialSchedule: [
      { day: "Monday", period: "Period 1 (09:00 - 10:00 AM)", subject: "CS501 Advanced Software Engg", section: "CSE Sem 5 - Sec A", room: "Lab-301", time: "09:00 AM", type: "Teaching Class" },
      { day: "Tuesday", period: "Period 3 (11:15 - 12:15 PM)", subject: "Student Grievance Redressal Hearing", section: "All Batches", room: "Dean Senate Office", time: "11:15 AM", type: "Committee Meeting" },
      { day: "Wednesday", period: "Period 2 (10:00 - 11:00 AM)", subject: "Hostel Welfare Inspection", section: "Boys Hostel Block A", room: "Hostel Premises", time: "10:00 AM", type: "Inspection Schedule" },
    ],
    facultyTimetables: [
      { facultyName: "Dr. S. K. Gupta", department: "CSE", subject: "CS501 Software Engg", day: "Monday", period: "09:00 AM", room: "Hall-101" },
      { facultyName: "Dr. Meera Rao", department: "ECE", subject: "EC304 VLSI Design", day: "Tuesday", period: "10:00 AM", room: "Hall-204" },
    ],
    substitutionHistory: [
      { date: "2026-08-02", subject: "CS501 Advanced Software Engg", originalFaculty: "Prof. Student Dean", substituteFaculty: "Dr. S. K. Gupta", reason: "Attending University Academic Council", status: "Approved" },
    ],
    notificationsSystem: {
      received: [
        { id: "NOT-R1", sender: "Controller of Examinations", title: "Autumn Semester Hall Tickets Dispatch Complete", category: "Examinations", priority: "High", date: "2026-08-04", read: false },
        { id: "NOT-R2", sender: "Principal Office", title: "Monthly Student Welfare Committee Meeting on Friday", category: "Meeting", priority: "Medium", date: "2026-08-03", read: true },
      ],
      sent: [
        { id: "NOT-S1", receiver: "All HODs", title: "Attendance Deficit Shortage Warning Letters Issued", category: "Attendance", priority: "High", date: "2026-08-04", read: true },
      ],
    },
  };
}

// ----------------------------------------------------------------------
// 2. IQAC DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface IqacDashboardData {
  kpis: { naacScore: string; nbaAccreditedDepts: string; aqarStatus: string; facultyQualityIndex: string; auditCompletionPct: string };
  naacCriteria: { id: string; criterion: string; weightage: number; score: number; status: string }[];
  qualityAudits: { id: string; dept: string; type: string; score: string; date: string }[];
  ssrMetrics: { code: string; metricName: string; target: string; current: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getIqacDashboardData(): IqacDashboardData {
  return {
    kpis: { naacScore: "3.78 / 4.0 (Grade A++)", nbaAccreditedDepts: "12 / 15 Depts", aqarStatus: "Submitted (2025-26)", facultyQualityIndex: "94.2%", auditCompletionPct: "98.5%" },
    naacCriteria: [
      { id: "C1", criterion: "Curricular Aspects", weightage: 150, score: 142, status: "Excellent" },
      { id: "C2", criterion: "Teaching-Learning and Evaluation", weightage: 350, score: 338, status: "Excellent" },
    ],
    qualityAudits: [
      { id: "AUD-2026-01", dept: "CSE", type: "Academic & Administrative Audit", score: "4.85 / 5.0", date: "2026-07-15" },
    ],
    ssrMetrics: [
      { code: "1.1.1", metricName: "Curriculum Design & OBE Alignment", target: "100%", current: "96.4%", status: "Achieved" },
    ],
    reports: [
      { title: "Annual Quality Assurance Report (AQAR 2025-26)", metric: "Clean NAAC Audit Pass", date: "2026-08-01" },
    ],
  };
}

// ----------------------------------------------------------------------
// 3. IMA DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ImaDashboardData {
  kpis: { activeProjects: number; complianceScore: string; policyDirectives: number; infraBudgetUsed: string; assetAuditPassPct: string };
  campusProjects: { name: string; budget: string; progress: number; targetDate: string }[];
  policyDirectives: { id: string; title: string; category: string; status: string }[];
  complianceAudits: { area: string; standard: string; compliance: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getImaDashboardData(): ImaDashboardData {
  return {
    kpis: { activeProjects: 8, complianceScore: "100%", policyDirectives: 24, infraBudgetUsed: "₹12.4 Cr", assetAuditPassPct: "99.2%" },
    campusProjects: [{ name: "New Advanced AI Building", budget: "₹6.5 Cr", progress: 82, targetDate: "Oct 2026" }],
    policyDirectives: [{ id: "POL-2026-01", title: "Institutional IT Security", category: "IT Policy", status: "Active" }],
    complianceAudits: [{ area: "Fire & Safety", standard: "NFPA", compliance: "100%", status: "Certified" }],
    reports: [{ title: "Master Infra Progress Report", metric: "8 Active Projects", date: "2026-08-01" }],
  };
}

// ----------------------------------------------------------------------
// 4. RESEARCH & DEVELOPMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ResearchDevelopmentDashboardData {
  kpis: { totalGrantFunds: string; publishedPapers: number; patentsFiled: number; activePhdScholars: number; incubationStartups: number };
  topGrants: { title: string; agency: string; amount: string; status: string }[];
  publications: { title: string; journal: string; impactFactor: string; authors: string }[];
  patents: { title: string; patentNo: string; filingDate: string; status: string }[];
  phdScholars: { name: string; dept: string; guide: string; topic: string; year: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getResearchDevelopmentDashboardData(): ResearchDevelopmentDashboardData {
  return {
    kpis: { totalGrantFunds: "₹4.85 Cr", publishedPapers: 142, patentsFiled: 18, activePhdScholars: 86, incubationStartups: 12 },
    topGrants: [{ title: "DST SERB Quantum ML", agency: "DST SERB", amount: "₹85.0 Lakhs", status: "Active" }],
    publications: [{ title: "Deep Transformers", journal: "IEEE TMI", impactFactor: "10.6", authors: "Dr. S. K. Gupta" }],
    patents: [{ title: "AI Glucose Device", patentNo: "IN-2026110948", filingDate: "2026-03-12", status: "Published" }],
    phdScholars: [{ name: "Praveen Kumar", dept: "CSE", guide: "Dr. S. K. Gupta", topic: "Federated Learning", year: "Year 3" }],
    reports: [{ title: "Annual Research Compendium", metric: "142 Papers", date: "2026-08-01" }],
  };
}

// ----------------------------------------------------------------------
// 5. FINANCE DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface FinanceDeanDashboardData {
  kpis: { totalBudget: string; disbursedFunds: string; pendingFeeDues: string; auditPassStatus: string; payrollDisbursedPct: string };
  deptBudgets: { dept: string; allocated: string; spent: string; percentage: number }[];
  feeCollections: { category: string; expected: string; collected: string; pending: string }[];
  expenseLedger: { id: string; category: string; amount: string; date: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getFinanceDeanDashboardData(): FinanceDeanDashboardData {
  return {
    kpis: { totalBudget: "₹48.5 Cr", disbursedFunds: "₹36.2 Cr", pendingFeeDues: "₹1.4 Cr", auditPassStatus: "Clean Audit Pass", payrollDisbursedPct: "100%" },
    deptBudgets: [{ dept: "CSE Labs", allocated: "₹8.5 Cr", spent: "₹7.2 Cr", percentage: 84.7 }],
    feeCollections: [{ category: "Tuition Autumn 2026", expected: "₹24.0 Cr", collected: "₹23.1 Cr", pending: "₹90 Lakhs" }],
    expenseLedger: [{ id: "EXP-901", category: "Faculty Monthly Payroll", amount: "₹2.85 Cr", date: "2026-08-01", status: "Paid" }],
    reports: [{ title: "Annual Financial Balance Sheet", metric: "Clean Statutory Audit", date: "2026-08-01" }],
  };
}

// ----------------------------------------------------------------------
// 6. EXAMINATION DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ExaminationDeanDashboardData {
  kpis: { examsScheduled: number; hallTicketsIssued: number; revaluationRequests: number; avgResultDays: number; passPercentage: string };
  examSchedules: { code: string; subject: string; date: string; session: string; students: number }[];
  revaluations: { id: string; student: string; subject: string; currentGrade: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getExaminationDeanDashboardData(): ExaminationDeanDashboardData {
  return {
    kpis: { examsScheduled: 184, hallTicketsIssued: 4850, revaluationRequests: 14, avgResultDays: 14, passPercentage: "92.6%" },
    examSchedules: [{ code: "CS401", subject: "Deep Learning", date: "2026-08-18", session: "Morning (09:30 AM)", students: 420 }],
    revaluations: [{ id: "REV-01", student: "K. Sai Teja", subject: "CS401 Deep Learning", currentGrade: "B+", status: "Under Review" }],
    reports: [{ title: "Annual Result Analysis", metric: "92.6% Pass Rate", date: "2026-08-01" }],
  };
}

// ----------------------------------------------------------------------
// 7. PLACEMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface PlacementDeanDashboardData {
  kpis: { placementRate: string; highestPackage: string; averagePackage: string; drivesCompleted: number; activeMoUs: number };
  topRecruiters: { company: string; offers: number; package: string; tier: string }[];
  placementDrives: { company: string; driveDate: string; eligibleStudents: number; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getPlacementDeanDashboardData(): PlacementDeanDashboardData {
  return {
    kpis: { placementRate: "92.6%", highestPackage: "₹44.5 LPA", averagePackage: "₹11.8 LPA", drivesCompleted: 78, activeMoUs: 42 },
    topRecruiters: [{ company: "Google Cloud", offers: 18, package: "₹44.5 LPA", tier: "Dream Tier 1" }],
    placementDrives: [{ company: "Google Cloud Drive", driveDate: "2026-08-12", eligibleStudents: 240, status: "Scheduled" }],
    reports: [{ title: "Placement Statistics 2026", metric: "92.6% Placement Rate", date: "2026-08-01" }],
  };
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/lib/deansService.ts'), fileContent, 'utf8');
console.log("All 8 Deans exported cleanly in src/lib/deansService.ts!");
