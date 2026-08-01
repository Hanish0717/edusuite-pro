export interface AcademicSnapshot {
  cgpa: number;
  credits: number;
  semester: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

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
  time?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  subjectCode?: string;
  subjectName?: string;
  code?: string;
  faculty: string;
  room: string;
  building?: string;
  isOnline?: boolean;
  joinUrl?: string;
  attendanceStatus?: string;
  status: "completed" | "current" | "upcoming" | "Current" | "Next" | "Completed" | "Upcoming";
}

export type TimetableItem = TimetableSlot;
export type ScheduleItem = TimetableSlot;

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  urgent?: boolean;
  status?: string;
  route?: string;
  priority?: "High" | "Medium" | "Low" | string;
  linkUrl: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  category?: string;
  priority?: "High" | "Medium" | "Low" | string;
  type?: "Exam" | "Workshop" | "Hackathon" | "Placement" | "Seminar" | "Holiday" | string;
  location: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  status?: string;
  type: any;
}

export type RecentActivityItem = ActivityItem;

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  date: string;
  category: string;
  unread?: boolean;
  isPinned?: boolean;
}

export interface AttendanceSnapshot {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  totalClassesAttended?: number;
  totalClassesConducted?: number;
  classesNeededFor85?: number;
  riskStatus?: string;
  shortageCount?: number;
  status: string;
}

export interface ExamSnapshot {
  nextExamName: string;
  nextExamDate: string;
  hallTicketStatus: string;
  latestCgpa: number;
  cgpa?: number;
  sgpa?: number;
}

export interface FinanceSnapshot {
  pendingAmount: number;
  dueDate: string;
  feesPaid?: number;
  feesPending?: number;
  totalFees?: number;
  scholarshipStatus?: string;
  fineAmount?: number;
  status: string;
}

export interface LmsSnapshot {
  activeCoursesCount?: number;
  registeredCoursesCount?: number;
  registeredCourses?: number;
  pendingAssignmentsCount?: number;
  pendingAssignments?: number;
  pendingQuizCount?: number;
  upcomingQuizzes?: number;
  completedCourses?: number;
  learningProgressPercentage?: number;
}

export interface LibrarySnapshot {
  borrowedBooksCount?: number;
  booksIssued?: number;
  dueBooks?: any[];
  booksDue?: any[];
  nextDueDate?: string;
  digitalUsageHours?: number;
  dueDate: string;
  fineAmount: number;
}

export interface HostelSnapshot {
  roomNo?: string;
  roomNumber?: string;
  block?: string;
  messPlan?: string;
  gatePassStatus?: string;
  hostelNotice?: string;
  messMenuToday?: string | any[];
  messFeeStatus?: string;
}

export interface TransportSnapshot {
  routeNo?: string;
  busNo?: string;
  busNumber?: string;
  route?: string;
  todaysRoute?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: string;
  eta?: string;
  passValidity?: string;
}

export interface PlacementSnapshot {
  eligibleCompaniesCount: number;
  upcomingDrivesCount: number;
  upcomingInterviewsCount?: number;
  appliedDrivesCount?: number;
  applicationsSubmittedCount: number;
  resumeStatus: string;
  profileCompletionPct: number;
}
