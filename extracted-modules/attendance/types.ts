export interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  section: string;
  instructor: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  percentage: number;
  status: "Submitted" | "Pending Verification" | "Condoned";
}

export interface ClassStudentAttendance {
  id: string;
  rollNo: string;
  name: string;
  avatar?: string;
  status: "Present" | "Absent" | "Late";
}
export type ClassStudent = ClassStudentAttendance;

export interface AttendanceSubmission {
  classId: string;
  subjectId: string;
  date: string;
  period: number;
  records: { studentId: string; status: "Present" | "Absent" | "Late" }[];
}

export interface AllClassesAttendanceItem {
  id: string;
  className: string;
  department: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  classTeacher: string;
  status: "Normal" | "Defaulter Warning";
}
export type AllClassesAttendance = AllClassesAttendanceItem;

export type AttendanceSubpart =
  | "all-classes-attendance"
  | "attendance-mark"
  | "records";
