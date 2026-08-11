export type ClassType = "Lecture" | "Lab" | "Tutorial" | "Seminar" | "Online" | "Elective";

export type ClassStatus = "Completed" | "Live Now" | "Upcoming";

export type AttendanceStatus = "Present" | "Absent" | "Scheduled" | "Exempted";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type TimeSlotKey = 
  | "09:00–10:00"
  | "10:00–11:00"
  | "11:15–12:15"
  | "12:15–01:15"
  | "02:00–03:00"
  | "03:00–04:00"
  | "04:00–05:00";

export interface TimetableSlot {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  facultyAvatar: string;
  facultyEmail: string;
  department: string;
  roomNumber: string;
  building: string;
  floor: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  timeSlotKey: TimeSlotKey;
  duration: string;
  classType: ClassType;
  status: ClassStatus;
  attendanceStatus: AttendanceStatus;
  credits: number;
  syllabusCoverage: number;
  upcomingTopics: string[];
  assignments: string[];
  studyMaterial: string;
  isOnline: boolean;
  onlineJoinUrl?: string;
}

export interface SummaryMetrics {
  todaysClasses: number;
  currentClass: string;
  nextClass: string;
  totalWeeklyClasses: number;
  labSessions: number;
  attendanceThisWeek: number;
  freePeriods: number;
  onlineClasses: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  subject: string;
  department: string;
  cabin: string;
  email: string;
  phone: string;
  consultationHours: string;
  officeHours: string;
  avatar: string;
  designation: string;
}

export interface ExamScheduleItem {
  id: string;
  examName: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  venue: string;
  seatNumber: string;
  hallTicketStatus: "Issued" | "Pending Approval" | "Generated";
  duration: string;
  maxMarks: number;
}

export interface CalendarEventItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: "Class" | "Lab" | "Exam" | "Holiday" | "Event" | "Leave";
  description: string;
  timeSlot?: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "alert" | "info" | "exam" | "holiday";
  description: string;
}

export interface FilterState {
  searchQuery: string;
  academicYear: string;
  semester: string;
  week: string;
  department: string;
  faculty: string;
  classType: string;
}
