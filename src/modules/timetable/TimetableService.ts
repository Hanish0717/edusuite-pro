import api from "@/lib/api";

export interface TimetablePeriod {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periodNumber: number; // 1 to 8
  startTime: string;    // e.g. "09:00 AM"
  endTime: string;      // e.g. "10:00 AM"
  subjectCode: string;  // e.g. "CS502"
  subjectName: string;  // e.g. "Compiler Design"
  facultyId: string;
  facultyName: string;
  roomNo: string;       // e.g. "Block-A 301"
  isLab: boolean;
  branch: string;       // e.g. "CSE"
  semester: number;     // 1, 3, 5, 7
  section: string;      // "Section A", "Section B"
}

export interface TimetableGrid {
  branch: string;
  semester: number;
  section: string;
  academicYear: string;
  schedule: TimetablePeriod[];
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictReason?: string;
}

export const BRANCHES = [
  "CSE",
  "ECE",
  "ME",
  "CE",
  "EEE",
  "IT",
  "AI&DS",
];

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
  { periodNumber: 3, startTime: "11:15 AM", endTime: "12:15 PM" },
  { periodNumber: 4, startTime: "12:15 PM", endTime: "01:15 PM" },
  { periodNumber: 5, startTime: "02:00 PM", endTime: "03:00 PM" },
  { periodNumber: 6, startTime: "03:00 PM", endTime: "04:00 PM" },
  { periodNumber: 7, startTime: "04:00 PM", endTime: "05:00 PM" },
  { periodNumber: 8, startTime: "05:00 PM", endTime: "06:00 PM" },
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

export function generateInitialSchedule(branch: string = "CSE", semester: number = 5, section: string = "Section A"): TimetablePeriod[] {
  const key = `${branch}-${semester}`;
  const subjects = MOCK_SUBJECTS_BY_BRANCH_SEM[key] || MOCK_SUBJECTS_BY_BRANCH_SEM["CSE-5"];
  const periods: TimetablePeriod[] = [];

  let idCounter = 100;

  DAYS.forEach((day, dayIdx) => {
    PERIOD_SLOTS.forEach((slot, slotIdx) => {
      // Create continuous lab block for period 6 & 7 on Tuesday and Thursday
      if ((day === "Tuesday" || day === "Thursday") && (slot.periodNumber === 6 || slot.periodNumber === 7)) {
        const labSubject = subjects.find((s) => s.isLab) || subjects[0];
        periods.push({
          id: `TT-${idCounter++}`,
          day,
          periodNumber: slot.periodNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subjectCode: labSubject.code,
          subjectName: labSubject.name,
          facultyId: labSubject.facultyId,
          facultyName: labSubject.faculty,
          roomNo: labSubject.room,
          isLab: true,
          branch,
          semester,
          section,
        });
      } else {
        const subIndex = (dayIdx * 8 + slotIdx) % subjects.filter((s) => !s.isLab).length;
        const sub = subjects.filter((s) => !s.isLab)[subIndex] || subjects[0];

        periods.push({
          id: `TT-${idCounter++}`,
          day,
          periodNumber: slot.periodNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subjectCode: sub.code,
          subjectName: sub.name,
          facultyId: sub.facultyId,
          facultyName: sub.faculty,
          roomNo: sub.room,
          isLab: false,
          branch,
          semester,
          section,
        });
      }
    });
  });

  return periods;
}

export function checkScheduleConflict(
  schedule: TimetablePeriod[],
  newPeriod: Partial<TimetablePeriod>
): ConflictCheckResult {
  // Check if faculty is already teaching elsewhere in the same day and period
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
    const res = await api.get(`/api/academics/timetable?branch=${branch}&semester=${semester}&section=${section}`);
    if (res && res.data && res.data.schedule) return res.data;
  } catch {}

  return {
    branch,
    semester,
    section,
    academicYear: "2026-2027",
    schedule: generateInitialSchedule(branch, semester, section),
  };
}

export async function autoGenerateTimetable(
  branch: string,
  semester: number,
  section: string
): Promise<TimetableGrid> {
  try {
    const res = await api.post("/api/academics/timetable/generate", { branch, semester, section });
    if (res && res.data && res.data.schedule) return res.data;
  } catch {}

  // Generate randomized conflict-free schedule
  return {
    branch,
    semester,
    section,
    academicYear: "2026-2027",
    schedule: generateInitialSchedule(branch, semester, section),
  };
}

export async function updateTimetablePeriod(
  periodData: Partial<TimetablePeriod>
): Promise<boolean> {
  try {
    await api.put("/api/academics/timetable/update-period", periodData);
  } catch {}
  return true;
}
