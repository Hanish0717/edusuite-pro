export interface StudentInfo {
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  academicYear: string;
  todayDate: string;
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

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  urgent?: boolean;
  linkUrl: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: "Exam" | "Workshop" | "Hackathon" | "Placement" | "Seminar" | "Holiday";
  location: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: "attendance" | "assignment" | "fee" | "library" | "notice" | "exam";
}
