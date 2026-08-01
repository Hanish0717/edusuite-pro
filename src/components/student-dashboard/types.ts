export interface StudentInfo {
  name: string;
  rollNo: string;
  rollNumber?: string;
  avatar?: string;
  department: string;
  semester: string;
  currentSemester?: string;
  program?: string;
  academicYear: string;
  todayDate: string;
  status?: string;
  lastLogin?: string;
}

export interface AcademicOverview {
  attendancePercentage: number;
  cgpa: number;
  currentSemester: string;
  creditsEarned: number;
  totalCredits: number;
  pendingFees: number;
  issuedBooksCount: number;
  upcomingExamsCount: number;
  pendingAssignmentsCount: number;
}

export interface TimetableSlot {
  id: string;
  time: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  status: "completed" | "current" | "upcoming";
}

export type TimetableItem = TimetableSlot;
export type ScheduleItem = TimetableSlot;

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  urgent?: boolean;
  priority?: "High" | "Medium" | "Low";
  linkUrl: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  category?: string;
  priority?: "High" | "Medium" | "Low";
  type: "Exam" | "Workshop" | "Hackathon" | "Placement" | "Seminar" | "Holiday";
  location: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: "attendance" | "assignment" | "fee" | "library" | "notice" | "exam";
}

export type RecentActivityItem = ActivityItem;

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  unread?: boolean;
}

export interface AttendanceSnapshot {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  status: string;
}

export interface ExamSnapshot {
  nextExamName: string;
  nextExamDate: string;
  hallTicketStatus: string;
  latestCgpa: number;
}

export interface FinanceSnapshot {
  pendingAmount: number;
  dueDate: string;
  status: string;
}

export interface LmsSnapshot {
  activeCoursesCount: number;
  pendingAssignmentsCount: number;
}

export interface LibrarySnapshot {
  borrowedBooksCount: number;
  dueDate: string;
  fineAmount: number;
}

export interface HostelSnapshot {
  roomNo: string;
  block: string;
  messFeeStatus: string;
}

export interface TransportSnapshot {
  routeNo: string;
  busNo: string;
  passValidity: string;
}

export interface PlacementSnapshot {
  eligibleCompaniesCount: number;
  upcomingDrivesCount: number;
  applicationsSubmittedCount: number;
  resumeStatus: string;
  profileCompletionPct: number;
}
