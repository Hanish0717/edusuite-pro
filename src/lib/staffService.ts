export interface StaffKpiStats {
  students: string;
  classesToday: string;
  attendanceAvg: string;
  pendingEvaluations: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  room: string;
  tone: "primary" | "info" | "success" | "warning";
}

export interface PendingTaskItem {
  title: string;
  due: string;
  status: "Pending" | "Urgent";
}

export const MOCK_STAFF_STATS: StaffKpiStats = {
  students: "184",
  classesToday: "4",
  attendanceAvg: "89%",
  pendingEvaluations: "23",
};

export const MOCK_STAFF_SCHEDULE: ScheduleItem[] = [
  { time: "09:00 - 10:00", title: "Data Structures", room: "CSE II-A", tone: "primary" },
  { time: "10:15 - 11:15", title: "Database Management", room: "CSE II-B", tone: "info" },
  { time: "11:30 - 12:30", title: "Operating Systems", room: "CSE II-A", tone: "success" },
  { time: "02:00 - 03:00", title: "Mentoring Session", room: "Block C", tone: "warning" },
];

export const MOCK_STAFF_PENDING_TASKS: PendingTaskItem[] = [
  { title: "Upload notes - DBMS Unit 3", due: "Due in 2 days", status: "Pending" },
  { title: "Evaluate assignments (23)", due: "Due in 3 days", status: "Pending" },
  { title: "Enter attendance", due: "Due today", status: "Urgent" },
  { title: "Internal marks entry", due: "Due in 5 days", status: "Pending" },
];

export function fetchStaffStats(): StaffKpiStats {
  return MOCK_STAFF_STATS;
}

export function fetchStaffSchedule(): ScheduleItem[] {
  return MOCK_STAFF_SCHEDULE;
}

export function fetchStaffPendingTasks(): PendingTaskItem[] {
  return MOCK_STAFF_PENDING_TASKS;
}
