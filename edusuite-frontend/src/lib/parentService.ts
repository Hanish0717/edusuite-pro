export interface WardKpiStats {
  wardName: string;
  rollNo: string;
  cgpa: string;
  attendance: string;
  feeStatus: string;
  rank: string;
}

export interface AttendanceSplitItem {
  name: string;
  value: number;
}

export interface TeacherRemarkItem {
  date: string;
  teacher: string;
  remark: string;
}

export const MOCK_WARD_STATS: WardKpiStats = {
  wardName: "Sai Teja K.",
  rollNo: "22CS101 (CSE II-A)",
  cgpa: "8.45",
  attendance: "88%",
  feeStatus: "Paid (Sem 4)",
  rank: "Top 15%",
};

export const MOCK_ATTENDANCE_SPLIT: AttendanceSplitItem[] = [
  { name: "Present", value: 88 },
  { name: "Absent", value: 8 },
  { name: "Leave", value: 4 },
];

export const MOCK_TEACHER_REMARKS: TeacherRemarkItem[] = [
  {
    date: "2026-07-28",
    teacher: "Dr. S. K. Gupta (HOD CSE)",
    remark: "Sai Teja performs exceptionally well in lab practicals. Attendance is stable.",
  },
  {
    date: "2026-07-20",
    teacher: "Prof. Ananya Sharma",
    remark: "Good active participation in class discussions and mid-term exams.",
  },
];

export function fetchWardStats(): WardKpiStats {
  return MOCK_WARD_STATS;
}

export function fetchAttendanceSplit(): AttendanceSplitItem[] {
  return MOCK_ATTENDANCE_SPLIT;
}

export function fetchTeacherRemarks(): TeacherRemarkItem[] {
  return MOCK_TEACHER_REMARKS;
}
