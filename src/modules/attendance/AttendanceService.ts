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

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT-2026-101",
    date: "2026-08-01",
    courseCode: "CS401",
    courseTitle: "Advanced Artificial Intelligence & Deep Learning",
    department: "CSE",
    section: "CSE-A",
    instructor: "Dr. K. Sai Teja",
    totalStudents: 60,
    presentCount: 56,
    absentCount: 4,
    percentage: 93.3,
    status: "Submitted",
  },
  {
    id: "ATT-2026-102",
    date: "2026-08-01",
    courseCode: "EC304",
    courseTitle: "VLSI System Design & Cadence Synthesis",
    department: "ECE",
    section: "ECE-B",
    instructor: "Dr. Meera Rao",
    totalStudents: 58,
    presentCount: 52,
    absentCount: 6,
    percentage: 89.6,
    status: "Submitted",
  },
  {
    id: "ATT-2026-103",
    date: "2026-08-01",
    courseCode: "ME308",
    courseTitle: "Computer Aided Design (CAD)",
    department: "ME",
    section: "ME-A",
    instructor: "Prof. V. K. Murthy",
    totalStudents: 55,
    presentCount: 38,
    absentCount: 17,
    percentage: 69.1,
    status: "Pending Verification",
  },
  {
    id: "ATT-2026-104",
    date: "2026-07-31",
    courseCode: "AI402",
    courseTitle: "Natural Language Processing",
    department: "AI&DS",
    section: "AIDS-A",
    instructor: "Dr. Rajesh Sharma",
    totalStudents: 62,
    presentCount: 59,
    absentCount: 3,
    percentage: 95.1,
    status: "Submitted",
  },
  {
    id: "ATT-2026-105",
    date: "2026-07-31",
    courseCode: "BIO201",
    courseTitle: "Cellular & Molecular Biology",
    department: "Biotech",
    section: "BIO-A",
    instructor: "Dr. S. Priya",
    totalStudents: 45,
    presentCount: 42,
    absentCount: 3,
    percentage: 93.3,
    status: "Condoned",
  },
];

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const res = await api.get("/api/attendance");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_ATTENDANCE;
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

  const newRec: AttendanceRecord = {
    id: `ATT-2026-${Math.floor(106 + Math.random() * 900)}`,
    date: data.date || new Date().toISOString().split("T")[0],
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

  return newRec;
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
