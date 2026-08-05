// ============================================================
// Academic Calendar & Event Management — Mock Data
// ============================================================

export type EventCategory =
  | "Semester Start"
  | "Semester End"
  | "Holiday"
  | "Mid Examination"
  | "End Semester Examination"
  | "Laboratory Examination"
  | "Project Review"
  | "Industrial Visit"
  | "Workshop"
  | "Seminar"
  | "Guest Lecture"
  | "Hackathon"
  | "Placement Drive"
  | "Sports Event"
  | "Cultural Event"
  | "Faculty Meeting"
  | "Academic Council Meeting"
  | "Accreditation Visit"
  | "Convocation";

export type EventPriority = "Low" | "Medium" | "High" | "Critical";
export type EventStatus = "Scheduled" | "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
export type ApprovalStatus = "Draft" | "Pending Approval" | "Approved" | "Published" | "Completed" | "Archived";

export interface AcademicEvent {
  id: string;
  title: string;
  category: EventCategory;
  department: string;
  organizer: string;
  venue: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  priority: EventPriority;
  status: EventStatus;
  academicYear: string;
  semester: string;
  participantsCount: number;
  approvalStatus: ApprovalStatus;
}

export interface Holiday {
  id: string;
  holidayName: string;
  type: "National Holiday" | "State Holiday" | "College Holiday" | "Emergency Holiday";
  startDate: string;
  endDate: string;
  applicableTo: string;
  status: "Active" | "Scheduled";
}

export interface ExamEvent {
  id: string;
  examName: string;
  semester: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  status: "Scheduled" | "Ongoing" | "Completed";
}

export interface AcademicDeadline {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  daysLeft: number;
  status: "Pending" | "Urgent" | "Completed";
}

export interface AcademicMilestone {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Completed" | "Current" | "Upcoming";
}

export interface CalendarNotification {
  id: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
}

// ── 1. ACADEMIC EVENTS ───────────────────────────────────────
export const MOCK_ACADEMIC_EVENTS: AcademicEvent[] = [
  {
    id: "EVT-101",
    title: "Semester VI Commencement",
    category: "Semester Start",
    department: "All Departments",
    organizer: "Academic Management",
    venue: "Main Auditorium",
    description: "Official commencement of Semester VI instructions, orientation, and syllabus briefing.",
    startDate: "2026-08-01",
    endDate: "2026-08-01",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    priority: "High",
    status: "Completed",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 2450,
    approvalStatus: "Published",
  },
  {
    id: "EVT-102",
    title: "Mid-Term Examinations Cycle I",
    category: "Mid Examination",
    department: "CSE, ECE, ME",
    organizer: "Examination Cell",
    venue: "Exam Blocks A & B",
    description: "First mid-semester theory assessments for 3rd and 4th year B.Tech streams.",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
    startTime: "09:30 AM",
    endTime: "12:30 PM",
    priority: "Critical",
    status: "Upcoming",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 1220,
    approvalStatus: "Published",
  },
  {
    id: "EVT-103",
    title: "Independence Day Celebrations & Cultural Meet",
    category: "Holiday",
    department: "All Departments",
    organizer: "Cultural Committee",
    venue: "Central Sports Ground",
    description: "Flag hoisting ceremony, patriotic cultural performances, and awards ceremony.",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    startTime: "08:00 AM",
    endTime: "01:00 PM",
    priority: "High",
    status: "Upcoming",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 2500,
    approvalStatus: "Published",
  },
  {
    id: "EVT-104",
    title: "AI & Microservices Cloud Workshop",
    category: "Workshop",
    department: "CSE",
    organizer: "Dr. K. Sai Teja",
    venue: "Lab 5 - Cloud Center",
    description: "Hands-on technical workshop on deploying Microservices with Kubernetes and Docker.",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    priority: "Medium",
    status: "Scheduled",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 120,
    approvalStatus: "Approved",
  },
  {
    id: "EVT-105",
    title: "NBA Tier-1 Accreditation Audit Visit",
    category: "Accreditation Visit",
    department: "ECE, ME",
    organizer: "IQAC Committee",
    venue: "Conference Room 1",
    description: "External peer team evaluation visit for NBA Tier-1 accreditation verification.",
    startDate: "2026-08-25",
    endDate: "2026-08-27",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    priority: "Critical",
    status: "Scheduled",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 85,
    approvalStatus: "Approved",
  },
  {
    id: "EVT-106",
    title: "Annual Hackathon 2026 — EduHack",
    category: "Hackathon",
    department: "CSE, AI&DS",
    organizer: "Innovation Cell",
    venue: "Seminar Hall 2",
    description: "36-hour non-stop coding hackathon focused on Smart Campus & EdTech AI solutions.",
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    startTime: "09:00 AM",
    endTime: "09:00 PM",
    priority: "High",
    status: "Scheduled",
    academicYear: "2026-27",
    semester: "Semester VI",
    participantsCount: 300,
    approvalStatus: "Approved",
  },
];

// ── 2. HOLIDAYS ──────────────────────────────────────────────
export const MOCK_HOLIDAYS: Holiday[] = [
  { id: "HOL-101", holidayName: "Independence Day", type: "National Holiday", startDate: "2026-08-15", endDate: "2026-08-15", applicableTo: "All Faculty & Students", status: "Active" },
  { id: "HOL-102", holidayName: "Ganesh Chaturthi", type: "State Holiday", startDate: "2026-09-14", endDate: "2026-09-14", applicableTo: "All Faculty & Students", status: "Scheduled" },
  { id: "HOL-103", holidayName: "Gandhi Jayanti", type: "National Holiday", startDate: "2026-10-02", endDate: "2026-10-02", applicableTo: "All Faculty & Students", status: "Scheduled" },
  { id: "HOL-104", holidayName: "Dussecta / Vijayadashami Break", type: "College Holiday", startDate: "2026-10-18", endDate: "2026-10-22", applicableTo: "All Faculty & Students", status: "Scheduled" },
  { id: "HOL-105", holidayName: "Diwali Vacation", type: "College Holiday", startDate: "2026-11-08", endDate: "2026-11-12", applicableTo: "All Faculty & Students", status: "Scheduled" },
];

// ── 3. EXAM CALENDAR ─────────────────────────────────────────
export const MOCK_EXAM_CALENDAR: ExamEvent[] = [
  { id: "EXM-201", examName: "Computer Networks Mid-I", semester: "Semester V", department: "CSE", date: "2026-08-10", time: "09:30 AM - 11:30 AM", venue: "LH-302", status: "Scheduled" },
  { id: "EXM-202", examName: "VLSI System Design End-Sem", semester: "Semester VI", department: "ECE", date: "2026-08-12", time: "09:30 AM - 12:30 PM", venue: "LH-204", status: "Scheduled" },
  { id: "EXM-203", examName: "Deep Learning Practical Exam", semester: "Semester VI", department: "AI&DS", date: "2026-08-14", time: "01:30 PM - 04:30 PM", venue: "Lab 5", status: "Scheduled" },
  { id: "EXM-204", examName: "Thermodynamics II Viva", semester: "Semester IV", department: "ME", date: "2026-08-18", time: "10:00 AM - 01:00 PM", venue: "Thermal Lab", status: "Scheduled" },
];

// ── 4. ACADEMIC DEADLINES ────────────────────────────────────
export const MOCK_DEADLINES: AcademicDeadline[] = [
  { id: "DLD-1", title: "Attendance Shortage Submission", dueDate: "2026-08-08", category: "Attendance", daysLeft: 4, status: "Urgent" },
  { id: "DLD-2", title: "Internal Assessment Marks Entry", dueDate: "2026-08-18", category: "Examination", daysLeft: 14, status: "Pending" },
  { id: "DLD-3", title: "B.Tech Final Year Project Phase-I Review", dueDate: "2026-08-22", category: "Project", daysLeft: 18, status: "Pending" },
  { id: "DLD-4", title: "End-Sem Exam Result Approval Deadline", dueDate: "2026-08-30", category: "Results", daysLeft: 26, status: "Pending" },
];

// ── 5. ACADEMIC TIMELINE MILESTONES ──────────────────────────
export const MOCK_ACADEMIC_MILESTONES: AcademicMilestone[] = [
  { id: "M1", title: "Academic Year Start", startDate: "2026-07-01", endDate: "2026-07-05", status: "Completed" },
  { id: "M2", title: "Semester VI Instruction", startDate: "2026-07-06", endDate: "2026-08-09", status: "Current" },
  { id: "M3", title: "Mid Examinations", startDate: "2026-08-10", endDate: "2026-08-15", status: "Upcoming" },
  { id: "M4", title: "Practical Exams", startDate: "2026-08-18", endDate: "2026-08-24", status: "Upcoming" },
  { id: "M5", title: "End Semester Exams", startDate: "2026-09-10", endDate: "2026-09-25", status: "Upcoming" },
  { id: "M6", title: "Semester Break", startDate: "2026-09-26", endDate: "2026-10-10", status: "Upcoming" },
  { id: "M7", title: "Academic Year End", startDate: "2027-05-30", endDate: "2027-06-05", status: "Upcoming" },
];

// ── 6. NOTIFICATIONS ──────────────────────────────────────────
export const MOCK_CALENDAR_NOTIFICATIONS: CalendarNotification[] = [
  { id: "n1", message: "Mid-Semester exam timetable published for CSE & ECE.", time: "15 mins ago", type: "success" },
  { id: "n2", message: "Independence Day holiday schedule approved by Academic Manager.", time: "1 hour ago", type: "info" },
  { id: "n3", message: "NBA accreditation team audit dates confirmed for August 25.", time: "3 hours ago", type: "warning" },
  { id: "n4", message: "Attendance shortage list submission deadline in 4 days.", time: "Yesterday", type: "warning" },
];

// ── 7. ANALYTICS CHARTS DATA ──────────────────────────────────
export const EVENTS_BY_CATEGORY = [
  { name: "Examinations", value: 8 },
  { name: "Holidays", value: 5 },
  { name: "Workshops & Seminars", value: 6 },
  { name: "Meetings", value: 4 },
  { name: "Cultural & Sports", value: 3 },
];

export const MONTHLY_EVENT_DISTRIBUTION = [
  { name: "Jul", Events: 4 },
  { name: "Aug", Events: 12 },
  { name: "Sep", Events: 9 },
  { name: "Oct", Events: 8 },
  { name: "Nov", Events: 10 },
  { name: "Dec", Events: 6 },
];

export const DEPT_PARTICIPATION_CHART = [
  { name: "CSE", Events: 14 },
  { name: "ECE", Events: 11 },
  { name: "AI&DS", Events: 10 },
  { name: "ME", Events: 8 },
  { name: "CIVIL", Events: 6 },
];
