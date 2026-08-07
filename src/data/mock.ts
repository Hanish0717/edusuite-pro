export const academicYears = ["2024-25", "2023-24", "2022-23"];

export const admissionTrend = [
  { month: "Jan", admissions: 62, attendance: 88, fees: 54 },
  { month: "Feb", admissions: 74, attendance: 91, fees: 61 },
  { month: "Mar", admissions: 81, attendance: 89, fees: 72 },
  { month: "Apr", admissions: 69, attendance: 93, fees: 78 },
  { month: "May", admissions: 92, attendance: 90, fees: 83 },
  { month: "Jun", admissions: 105, attendance: 92, fees: 88 },
];

export const moduleUsage = [
  { name: "Academics", value: 42 },
  { name: "Attendance", value: 23 },
  { name: "Examination", value: 15 },
  { name: "Finance", value: 12 },
  { name: "Others", value: 8 },
];

export const attendanceSplit = [
  { name: "Present", value: 88 },
  { name: "Absent", value: 8 },
  { name: "Leave", value: 4 },
];

export const departmentPerformance = [
  { month: "Jan", attendance: 86, results: 78, placement: 62 },
  { month: "Feb", attendance: 88, results: 81, placement: 66 },
  { month: "Mar", attendance: 91, results: 84, placement: 71 },
  { month: "Apr", attendance: 89, results: 86, placement: 74 },
  { month: "May", attendance: 93, results: 88, placement: 79 },
  { month: "Jun", attendance: 91, results: 90, placement: 84 },
];

export const semesterProgress = [
  { term: "Sem 1", sgpa: 8.1, cgpa: 8.1 },
  { term: "Sem 2", sgpa: 8.4, cgpa: 8.25 },
  { term: "Sem 3", sgpa: 8.6, cgpa: 8.37 },
  { term: "Sem 4", sgpa: 8.7, cgpa: 8.45 },
];

export const monthlyAttendanceBars = [
  { month: "Jan", present: 92, absent: 6, leave: 2 },
  { month: "Feb", present: 88, absent: 9, leave: 3 },
  { month: "Mar", present: 94, absent: 4, leave: 2 },
  { month: "Apr", present: 86, absent: 10, leave: 4 },
  { month: "May", present: 90, absent: 7, leave: 3 },
];

export const topSubjects = [
  { subject: "Data Structures", score: 92 },
  { subject: "DBMS", score: 89 },
  { subject: "Operating Systems", score: 87 },
  { subject: "Computer Networks", score: 84 },
  { subject: "Java Programming", score: 82 },
];

export const todaysSchedule = [
  { time: "09:00 - 10:00", title: "Data Structures", room: "CSE II-A", tone: "primary" as const },
  { time: "10:15 - 11:15", title: "Database Management", room: "CSE II-B", tone: "info" as const },
  { time: "11:30 - 12:30", title: "Operating Systems", room: "CSE II-A", tone: "success" as const },
  { time: "02:00 - 03:00", title: "Mentoring Session", room: "Block C", tone: "warning" as const },
];

export const pendingTasks = [
  { title: "Upload notes - DBMS Unit 3", due: "Due in 2 days", status: "Pending" },
  { title: "Evaluate assignments (23)", due: "Due in 3 days", status: "Pending" },
  { title: "Enter attendance", due: "Due today", status: "Urgent" },
  { title: "Internal marks entry", due: "Due in 5 days", status: "Pending" },
];

export const upcomingEvents = [
  { title: "DBMS Assignment", meta: "Due 25 May 2024" },
  { title: "Internal Test - DS", meta: "27 May 2024" },
  { title: "Library book return", meta: "28 May 2024" },
  { title: "PTM Meeting", meta: "30 May 2024" },
];

export const recentActivities = [
  { title: "Admission approved for 12 applicants", meta: "Admissions - 8 min ago" },
  { title: "Attendance override request raised", meta: "CSE - 42 min ago" },
  { title: "Fee receipt #INV-20481 generated", meta: "Finance - 1 hr ago" },
  { title: "Placement drive scheduled: Infosys", meta: "Placements - 3 hrs ago" },
];

export const pendingApprovals = [
  { title: "Leave approvals", count: 5 },
  { title: "Attendance overrides", count: 2 },
  { title: "Internal marks approval", count: 3 },
  { title: "Purchase requests", count: 4 },
];

export const aiInsightsByRole: Record<string, string[]> = {
  "super-admin": [
    "32 students are at risk academically across 4 departments.",
    "Fee collection is 18% higher than the same month last year.",
    "Hostel occupancy has reached 82% - plan room allocation.",
    "5 departments have pending NAAC documentation.",
  ],
  staff: [
    "7 students in CSE II-A are below 75% attendance.",
    "Suggested revision topics for DBMS Unit 3 based on quiz scores.",
    "Assignment evaluation backlog can be cleared in ~2 hours.",
  ],
  student: [
    "Your attendance is 88% - safe, but 2 more absences drops you below 85%.",
    "Focus on Operating Systems: scores trail your CGPA by 6%.",
    "3 placement drives match your profile this month.",
  ],
  parent: [
    "Sai Teja's attendance improved by 4% this month.",
    "No pending fee dues for the current semester.",
    "Internal test results will be published on 27 May.",
  ],
  hod: [
    "Department results improved by 8% this month.",
    "12 students are at risk in DBMS - schedule remedial classes.",
    "Faculty workload is unbalanced across 3 subjects.",
  ],
};

export const studentsTable = [
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
    roll: "21ME043",
    name: "S. Divya",
    dept: "MECH",
    year: "III",
    attendance: "82%",
    cgpa: "8.02",
    status: "Active",
  },
  {
    roll: "21CS009",
    name: "M. Arjun",
    dept: "CSE",
    year: "III",
    attendance: "68%",
    cgpa: "6.85",
    status: "At Risk",
  },
];

export const notifications = [
  { title: "Internal Test - DBMS scheduled", meta: "27 May 2024", unread: true },
  { title: "PTM meeting on 30 May 2024", meta: "Communication", unread: true },
  { title: "Library book issued", meta: "15 May 2024", unread: false },
  { title: "Bus route 3 timing changed", meta: "Transport", unread: false },
];
