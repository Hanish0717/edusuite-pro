import api from "@/lib/api";

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  timeSlot: string;
  department: string;
  section: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  roomNo: string;
  building: string;
  status: "Scheduled" | "Rescheduled" | "Cancelled";
}

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  {
    id: "TT-101",
    day: "Monday",
    timeSlot: "09:30 AM - 10:30 AM",
    department: "CSE",
    section: "CSE-A",
    courseCode: "CS401",
    courseTitle: "Advanced Artificial Intelligence & Deep Learning",
    instructor: "Dr. K. Sai Teja",
    roomNo: "LH-302",
    building: "Academic Block A",
    status: "Scheduled",
  },
  {
    id: "TT-102",
    day: "Monday",
    timeSlot: "10:30 AM - 11:30 AM",
    department: "ECE",
    section: "ECE-B",
    courseCode: "EC304",
    courseTitle: "VLSI System Design & Cadence Synthesis",
    instructor: "Dr. Meera Rao",
    roomNo: "LH-204",
    building: "Academic Block B",
    status: "Scheduled",
  },
  {
    id: "TT-103",
    day: "Tuesday",
    timeSlot: "01:30 PM - 03:30 PM",
    department: "CSE",
    section: "CSE-A",
    courseCode: "CS401L",
    courseTitle: "AI & Machine Learning Laboratory",
    instructor: "Ms. Ananya Verma",
    roomNo: "Lab 5 (AI Center)",
    building: "Innovation Center",
    status: "Scheduled",
  },
  {
    id: "TT-104",
    day: "Wednesday",
    timeSlot: "11:30 AM - 12:30 PM",
    department: "ME",
    section: "ME-A",
    courseCode: "ME308",
    courseTitle: "Computer Aided Design (CAD)",
    instructor: "Prof. V. K. Murthy",
    roomNo: "LH-105",
    building: "Engineering Wing",
    status: "Rescheduled",
  },
  {
    id: "TT-105",
    day: "Thursday",
    timeSlot: "09:30 AM - 10:30 AM",
    department: "AI&DS",
    section: "AIDS-A",
    courseCode: "AI402",
    courseTitle: "Natural Language Processing",
    instructor: "Dr. Rajesh Sharma",
    roomNo: "LH-401",
    building: "Academic Block A",
    status: "Scheduled",
  },
];

export async function fetchTimetableSlots(): Promise<TimetableSlot[]> {
  try {
    const res = await api.get("/api/timetable");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_TIMETABLE;
}

export async function createTimetableSlot(
  data: Partial<TimetableSlot>,
): Promise<TimetableSlot> {
  try {
    const res = await api.post("/api/timetable", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newSlot: TimetableSlot = {
    id: `TT-${Math.floor(106 + Math.random() * 900)}`,
    day: data.day || "Monday",
    timeSlot: data.timeSlot || "09:30 AM - 10:30 AM",
    department: data.department || "CSE",
    section: data.section || "CSE-B",
    courseCode: data.courseCode || "CS405",
    courseTitle: data.courseTitle || "Cloud Computing",
    instructor: data.instructor || "Dr. S. K. Gupta",
    roomNo: data.roomNo || "LH-305",
    building: data.building || "Academic Block A",
    status: "Scheduled",
  };

  return newSlot;
}

export async function updateTimetableSlot(
  id: string,
  updates: Partial<TimetableSlot>,
): Promise<Partial<TimetableSlot>> {
  try {
    const res = await api.put(`/api/timetable/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteTimetableSlot(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/timetable/${id}`);
  } catch {}
  return true;
}
