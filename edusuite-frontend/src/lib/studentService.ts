export interface StudentKpiStats {
  cgpa: string;
  attendance: string;
  enrolledCourses: string;
  creditsEarned: string;
}

export interface SemesterTerm {
  term: string;
  sgpa: number;
  cgpa: number;
}

export interface MonthlyAttendanceBar {
  month: string;
  present: number;
  absent: number;
  leave: number;
}

export interface UpcomingEventItem {
  title: string;
  meta: string;
}

export const MOCK_STUDENT_STATS: StudentKpiStats = {
  cgpa: "8.45",
  attendance: "88%",
  enrolledCourses: "6",
  creditsEarned: "78 / 160",
};

export const MOCK_SEMESTER_PROGRESS: SemesterTerm[] = [
  { term: "Sem 1", sgpa: 8.1, cgpa: 8.1 },
  { term: "Sem 2", sgpa: 8.4, cgpa: 8.25 },
  { term: "Sem 3", sgpa: 8.6, cgpa: 8.37 },
  { term: "Sem 4", sgpa: 8.7, cgpa: 8.45 },
];

export const MOCK_MONTHLY_ATTENDANCE: MonthlyAttendanceBar[] = [
  { month: "Jan", present: 92, absent: 6, leave: 2 },
  { month: "Feb", present: 88, absent: 9, leave: 3 },
  { month: "Mar", present: 94, absent: 4, leave: 2 },
  { month: "Apr", present: 86, absent: 10, leave: 4 },
  { month: "May", present: 90, absent: 7, leave: 3 },
];

export const MOCK_UPCOMING_EVENTS: UpcomingEventItem[] = [
  { title: "DBMS Assignment", meta: "Due 25 May 2024" },
  { title: "Internal Test - DS", meta: "27 May 2024" },
  { title: "Library book return", meta: "28 May 2024" },
  { title: "PTM Meeting", meta: "30 May 2024" },
];

export function fetchStudentStats(): StudentKpiStats {
  return MOCK_STUDENT_STATS;
}

export function fetchSemesterProgress(): SemesterTerm[] {
  return MOCK_SEMESTER_PROGRESS;
}

export function fetchMonthlyAttendance(): MonthlyAttendanceBar[] {
  return MOCK_MONTHLY_ATTENDANCE;
}

export function fetchUpcomingEvents(): UpcomingEventItem[] {
  return MOCK_UPCOMING_EVENTS;
}
