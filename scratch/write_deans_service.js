import fs from 'fs';
import path from 'path';

const fileContent = `// Centralized Dean Data Service for Academic Dean Module

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
`;

const targetPath = path.join(process.cwd(), 'src/lib/deansService.ts');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully written src/lib/deansService.ts');
