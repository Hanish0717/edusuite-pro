export interface StatCardData {
  title: string;
  value: string | number;
  iconName: string;
  trend: {
    value: string;
    isUp: boolean;
  };
}

export interface ChartData {
  label: string;
  value: number;
}

export interface ActivityData {
  id: string;
  type: "subject" | "faculty" | "timetable" | "attendance" | "course" | "exam";
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  type: "subject" | "timetable" | "course" | "exam";
  department: string;
  requestedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export interface AcademicNotification {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  time: string;
  isRead: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "academic" | "holiday" | "milestone";
  description: string;
}

export const MOCK_STATS_CARDS: StatCardData[] = [
  {
    title: "Total Departments",
    value: 6,
    iconName: "Building2",
    trend: { value: "No change", isUp: true },
  },
  {
    title: "Total Faculty",
    value: 142,
    iconName: "UserCog",
    trend: { value: "+4 this sem", isUp: true },
  },
  {
    title: "Total Students",
    value: 2480,
    iconName: "Users",
    trend: { value: "+120 this year", isUp: true },
  },
  {
    title: "Active Courses",
    value: 36,
    iconName: "BookOpen",
    trend: { value: "+2 new courses", isUp: true },
  },
  {
    title: "Classes Scheduled Today",
    value: 48,
    iconName: "CalendarRange",
    trend: { value: "Full Schedule", isUp: true },
  },
  {
    title: "Overall Attendance",
    value: "88.5%",
    iconName: "ClipboardCheck",
    trend: { value: "+1.2% vs last month", isUp: true },
  },
  {
    title: "Pending Approvals",
    value: 12,
    iconName: "FileCheck",
    trend: { value: "Needs review", isUp: false },
  },
  {
    title: "Upcoming Exams",
    value: 4,
    iconName: "FileSpreadsheet",
    trend: { value: "Starts in 10 days", isUp: true },
  },
];

export const MOCK_DEPT_DISTRIBUTION: ChartData[] = [
  { label: "CSE", value: 780 },
  { label: "ECE", value: 520 },
  { label: "ME", value: 380 },
  { label: "Civil", value: 310 },
  { label: "EEE", value: 290 },
  { label: "MBA", value: 200 },
];

export const MOCK_ATTENDANCE_TREND: ChartData[] = [
  { label: "Jan", value: 87 },
  { label: "Feb", value: 89 },
  { label: "Mar", value: 91 },
  { label: "Apr", value: 88 },
  { label: "May", value: 85 },
  { label: "Jun", value: 90 },
];

export const MOCK_FACULTY_WORKLOAD: ChartData[] = [
  { label: "CSE", value: 16 }, // hours/week avg
  { label: "ECE", value: 14 },
  { label: "ME", value: 15 },
  { label: "Civil", value: 12 },
  { label: "EEE", value: 14 },
  { label: "MBA", value: 10 },
];

export const MOCK_EXAM_TIMELINE = [
  { label: "Mid Sem (R22)", date: "Aug 14" },
  { label: "Lab Externals", date: "Sep 02" },
  { label: "Theory Externals", date: "Sep 15" },
  { label: "Supply Exams", date: "Oct 05" },
];

export const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: "act-1",
    type: "subject",
    title: "Subject Assigned",
    description: "Dr. Ravi Kumar assigned to Advanced Cryptography (CS801)",
    timestamp: "10 mins ago",
    user: "HOD CSE",
  },
  {
    id: "act-2",
    type: "faculty",
    title: "Faculty Assigned",
    description: "Prof. Priya Sen added to ECE Department",
    timestamp: "1 hour ago",
    user: "Dean Academics",
  },
  {
    id: "act-3",
    type: "timetable",
    title: "Timetable Updated",
    description: "Year III Semester V Class timetable updated for batch 2024-28",
    timestamp: "2 hours ago",
    user: "Academic Coordinator",
  },
  {
    id: "act-4",
    type: "attendance",
    title: "Attendance Approved",
    description: "Monthly attendance summary approved for EEE Department",
    timestamp: "Yesterday",
    user: "HOD EEE",
  },
  {
    id: "act-5",
    type: "course",
    title: "New Course Added",
    description: "Artificial Intelligence in Health Care (OE-903) approved as open elective",
    timestamp: "2 days ago",
    user: "Academic Manager",
  },
  {
    id: "act-6",
    type: "exam",
    title: "Exam Schedule Modified",
    description: "Mid-term examination date sheet modified for Year II students",
    timestamp: "3 days ago",
    user: "Controller of Exams",
  },
];

export const MOCK_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "app-1",
    title: "Faculty Subject Assignment",
    type: "subject",
    department: "Computer Science",
    requestedBy: "Dr. S. K. Gupta (HOD)",
    date: "2026-08-03",
    status: "pending",
  },
  {
    id: "app-2",
    title: "Year II Semester I Timetable Approval",
    type: "timetable",
    department: "Mechanical Engineering",
    requestedBy: "Prof. Rajesh (HOD)",
    date: "2026-08-04",
    status: "pending",
  },
  {
    id: "app-3",
    title: "B.Tech Cyber Security Course Structure",
    type: "course",
    department: "Information Technology",
    requestedBy: "Dr. P. V. Ramana",
    date: "2026-08-02",
    status: "pending",
  },
  {
    id: "app-4",
    title: "Mid-Semester Examination Schedule",
    type: "exam",
    department: "All Departments",
    requestedBy: "Exam Controller Cell",
    date: "2026-08-03",
    status: "pending",
  },
  {
    id: "app-5",
    title: "Faculty Guest Lectures Allocation",
    type: "subject",
    department: "Master of Business Admin",
    requestedBy: "Dr. H. Verma",
    date: "2026-08-01",
    status: "approved",
  },
];

export const MOCK_NOTIFICATIONS: AcademicNotification[] = [
  {
    id: "not-1",
    priority: "high",
    title: "NBA accreditation files audit scheduled for next Friday",
    time: "30 mins ago",
    isRead: false,
  },
  {
    id: "not-2",
    priority: "medium",
    title: "Review of open elective registrations requested by Registrar",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "not-3",
    priority: "low",
    title: "Minutes of the Board of Studies (BoS) meeting published",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "not-4",
    priority: "high",
    title: "Faculty feedback forms submission deadline set to Aug 10",
    time: "2 days ago",
    isRead: true,
  },
];

export const MOCK_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "evt-1",
    title: "Odd Semester Commencement",
    date: "Aug 10, 2026",
    type: "academic",
    description: "Official start of regular theory classes for semesters III, V, and VII.",
  },
  {
    id: "evt-2",
    title: "First Mid-term Examinations",
    date: "Sep 07 - Sep 12, 2026",
    type: "exam",
    description: "Evaluations for all streams, continuous assessment review.",
  },
  {
    id: "evt-3",
    title: "Engineers Day Exhibition",
    date: "Sep 15, 2026",
    type: "milestone",
    description: "Student project display and academic manager innovation awards.",
  },
  {
    id: "evt-4",
    title: "Dussehra Holidays",
    date: "Oct 19 - Oct 24, 2026",
    type: "holiday",
    description: "Institutional festival holidays, campus closed.",
  },
];
