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

export interface TimetablePeriod {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  roomNo: string;
  isLab?: boolean;
  branch?: string;
  semester?: number;
  section?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictReason?: string;
}

export type TimetableGrid = TimetableSlot[] | TimetablePeriod[];

export const SEMESTERS = [1, 3, 5, 7];

export const SECTIONS = ["Section A", "Section B", "Section C"];

export const DAYS: TimetablePeriod["day"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const PERIOD_SLOTS = [
  { periodNumber: 1, startTime: "09:00 AM", endTime: "10:00 AM" },
  { periodNumber: 2, startTime: "10:00 AM", endTime: "11:00 AM" },
  { periodNumber: 3, startTime: "11:10 AM", endTime: "12:10 PM" },
  { periodNumber: 4, startTime: "12:10 PM", endTime: "01:10 PM" },
  { periodNumber: 5, startTime: "02:00 PM", endTime: "03:00 PM" },
  { periodNumber: 6, startTime: "03:00 PM", endTime: "04:00 PM" },
  { periodNumber: 7, startTime: "04:00 PM", endTime: "05:00 PM" },
];

export const MOCK_SUBJECTS_BY_BRANCH_SEM: Record<string, { code: string; name: string; faculty: string; facultyId: string; room: string; isLab: boolean }[]> = {
  "CSE-5": [
    { code: "CS501", name: "Machine Learning & Neural Nets", faculty: "Dr. K. Sai Teja", facultyId: "FAC-106", room: "Block B - 302", isLab: false },
    { code: "CS502", name: "Compiler Design & Lexical Parsing", faculty: "Dr. Rajesh K. Varma", facultyId: "FAC-101", room: "Block B - 302", isLab: false },
    { code: "CS503", name: "Database Systems & SQL Optimization", faculty: "Ms. Ananya Sharma", facultyId: "FAC-105", room: "Block B - 302", isLab: false },
    { code: "CS504L", name: "Machine Learning Laboratory", faculty: "Dr. K. Sai Teja", facultyId: "FAC-106", room: "Lab - AI Center", isLab: true },
    { code: "CS505L", name: "Compiler Design Lab", faculty: "Dr. Rajesh K. Varma", facultyId: "FAC-101", room: "Lab - CSE 2", isLab: true },
    { code: "CS506", name: "Web Technologies & Microservices", faculty: "Prof. Arvind Swaminathan", facultyId: "FAC-103", room: "Block B - 302", isLab: false },
  ],
  "ECE-5": [
    { code: "EC501", name: "VLSI System Design & Cadence", faculty: "Dr. Meera Nambiar", facultyId: "FAC-102", room: "Block C - 201", isLab: false },
    { code: "EC502", name: "Digital Signal Processing", faculty: "Dr. K. Sai Teja", facultyId: "FAC-106", room: "Block C - 201", isLab: false },
    { code: "EC503L", name: "VLSI CAD Laboratory", faculty: "Dr. Meera Nambiar", facultyId: "FAC-102", room: "Lab - ECE 1", isLab: true },
    { code: "EC504", name: "Microcontrollers & Embedded C", faculty: "Prof. V. K. Murthy", facultyId: "FAC-107", room: "Block C - 201", isLab: false },
  ],
  "ME-5": [
    { code: "ME501", name: "Thermal Engineering & Fluid Dynamics", faculty: "Dr. Sankar Narayan", facultyId: "FAC-104", room: "Engg Block - 105", isLab: false },
    { code: "ME502L", name: "CAD/CAM Mechanical Simulation Lab", faculty: "Dr. Sankar Narayan", facultyId: "FAC-104", room: "Lab - ME CAD", isLab: true },
  ],
  "AI&DS-5": [
    { code: "AD501", name: "Deep Learning & Computer Vision", faculty: "Prof. Arvind Swaminathan", facultyId: "FAC-103", room: "Block A - 105", isLab: false },
    { code: "AD502L", name: "Computer Vision & PyTorch Lab", faculty: "Prof. Arvind Swaminathan", facultyId: "FAC-103", room: "Lab - AI Center", isLab: true },
  ],
};

type PatternItem = { code: string; name: string; faculty: string; isLab?: boolean };

export function generateInitialSchedule(branch: string = "CSE", semester: number = 5, section: string = "Section A"): TimetablePeriod[] {
  const periods: TimetablePeriod[] = [];
  let idCounter = 100;

  const defaultPatternNormal: PatternItem[] = [
    { code: "CS501", name: "Machine Learning & Neural Nets", faculty: "Teja" },
    { code: "CS502", name: "Compiler Design & Lexical Parsing", faculty: "Varma" },
    { code: "CS503", name: "Database Systems & SQL Optimization", faculty: "Sharma" },
    { code: "CS506", name: "Web Technologies & Microservices", faculty: "Swaminathan" },
    { code: "CS501", name: "Machine Learning & Neural Nets", faculty: "Teja" },
    { code: "CS502", name: "Compiler Design & Lexical Parsing", faculty: "Varma" },
    { code: "CS503", name: "Database Systems & SQL Optimization", faculty: "Sharma" },
  ];

  const defaultPatternTueThu: PatternItem[] = [
    { code: "CS501", name: "Machine Learning & Neural Nets", faculty: "Teja" },
    { code: "CS502", name: "Compiler Design & Lexical Parsing", faculty: "Varma" },
    { code: "CS503", name: "Database Systems & SQL Optimization", faculty: "Sharma" },
    { code: "CS506", name: "Web Technologies & Microservices", faculty: "Swaminathan" },
    { code: "CS504L", name: "Machine Learning Laboratory", faculty: "Teja", isLab: true },
    { code: "CS505", name: "Design & Analysis of Algorithms", faculty: "Rao" },
    { code: "CS507", name: "Software Engineering & Agile", faculty: "Kumar" },
  ];

  DAYS.forEach((day) => {
    const isTueOrThu = day === "Tuesday" || day === "Thursday";
    const pattern = isTueOrThu ? defaultPatternTueThu : defaultPatternNormal;

    PERIOD_SLOTS.forEach((slot, slotIdx) => {
      const item = pattern[slotIdx] || pattern[0] || { code: "CS501", name: "Machine Learning", faculty: "Teja" };
      periods.push({
        id: `TT-${idCounter++}`,
        day,
        periodNumber: slot.periodNumber,
        startTime: slot.startTime,
        endTime: slot.endTime,
        subjectCode: item.code,
        subjectName: item.name,
        facultyId: `FAC-${100 + slotIdx}`,
        facultyName: item.faculty,
        roomNo: item.isLab ? "Lab - AI Center" : "LH-205",
        isLab: !!item.isLab,
        branch,
        semester,
        section,
      });
    });
  });

  return periods;
}

export function checkScheduleConflict(
  schedule: TimetablePeriod[],
  newPeriod: Partial<TimetablePeriod>
): ConflictCheckResult {
  const clash = schedule.find(
    (p) =>
      p.id !== newPeriod.id &&
      p.day === newPeriod.day &&
      p.periodNumber === newPeriod.periodNumber &&
      p.facultyName.toLowerCase() === (newPeriod.facultyName || "").toLowerCase()
  );

  if (clash) {
    return {
      hasConflict: true,
      conflictReason: `⚠️ CLASH ALERT: ${newPeriod.facultyName} is already assigned to ${clash.branch}-${clash.semester} (${clash.subjectName}) in Period ${clash.periodNumber} on ${clash.day}!`,
    };
  }

  return { hasConflict: false };
}

export async function fetchTimetableGrid(
  branch: string = "CSE",
  semester: number = 5,
  section: string = "Section A"
): Promise<TimetableGrid> {
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
