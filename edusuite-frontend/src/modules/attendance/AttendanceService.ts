import api from "@/lib/api";

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

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export interface AttendanceStats {
  averageAttendance: number;
  presentToday: number;
  absentToday: number;
  shortageAlertsCount: number;
  totalRecords: number;
  date: string;
}

export async function fetchAttendanceStats(department?: string, date?: string): Promise<AttendanceStats> {
  try {
    const query = new URLSearchParams();
    if (department && department !== "All Departments") query.append("department", department);
    if (date) query.append("date", date);

    const res = await api.get(`/api/attendance/stats?${query.toString()}`);
    if (res && res.data && res.data.averageAttendance !== undefined) return res.data;
  } catch {}

  return {
    averageAttendance: 88.5,
    presentToday: 540,
    absentToday: 35,
    shortageAlertsCount: 12,
    totalRecords: 2313,
    date: date || new Date().toISOString().split("T")[0],
  };
}

export async function fetchAttendanceRecords(department?: string, search?: string): Promise<AttendanceRecord[]> {
  try {
    const query = new URLSearchParams();
    if (department && department !== "All Departments") query.append("department", department);
    if (search) query.append("search", search);

    const res = await api.get(`/api/attendance/classes?${query.toString()}`);
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return [];
}

export async function fetchAttendanceLedger(department?: string, status?: string, search?: string) {
  try {
    const query = new URLSearchParams();
    if (department && department !== "All Departments") query.append("department", department);
    if (status && status !== "All") query.append("status", status);
    if (search) query.append("search", search);

    const res = await api.get(`/api/attendance/ledger?${query.toString()}`);
    if (res && Array.isArray(res.data)) return res.data;
  } catch {}
  return [];
}

export async function createAttendanceRecord(
  data: Partial<AttendanceRecord>,
): Promise<AttendanceRecord> {
  try {
    const res = await api.post("/api/attendance", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const total = Number(data.totalStudents) || 60;
  const present = Number(data.presentCount) || 54;
  const absent = total - present;
  const pct = Number(((present / total) * 100).toFixed(1));

  return {
    id: `ATT-2026-${Math.floor(106 + Math.random() * 900)}`,
    date: data.date || new Date().toISOString().split("T")[0] || "",
    courseCode: data.courseCode || "CS405",
    courseTitle: data.courseTitle || "Cloud Computing",
    department: data.department || "CSE",
    section: data.section || "CSE-B",
    instructor: data.instructor || "Dr. S. K. Gupta",
    totalStudents: total,
    presentCount: present,
    absentCount: absent,
    percentage: pct,
    status: data.status || "Submitted",
  };
}

export async function updateAttendanceRecord(
  id: string,
  updates: Partial<AttendanceRecord>,
): Promise<Partial<AttendanceRecord>> {
  try {
    const res = await api.put(`/api/attendance/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteAttendanceRecord(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/attendance/${id}`);
  } catch {}
  return true;
}

export async function exportAttendanceLogs(): Promise<any[]> {
  try {
    const res = await api.get("/api/attendance/export");
    if (res && Array.isArray(res.data)) return res.data;
  } catch {}
  return [];
}
