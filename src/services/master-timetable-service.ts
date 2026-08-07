export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
export type LectureType = "Lecture" | "Lab" | "Tutorial" | "Project";
export type TimetableStatus = "Scheduled" | "Rescheduled" | "Cancelled";

export interface TimetableEntry {
  id: string;
  academicYear: string; // e.g. "2025-26"
  regulation: string; // e.g. "R22"
  department: string; // e.g. "Computer Science and Engineering"
  deptCode: string; // e.g. "CSE"
  program: string; // e.g. "B.Tech"
  semester: string; // e.g. "Semester 6"
  section: string; // e.g. "CSE-A", "CSE-B", "ECE-A", "ME-A"
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string; // e.g. "EMP-CSE-2041"
  facultyName: string;
  room: string; // e.g. "LH-302"
  building: string; // e.g. "Academic Block A"
  day: DayOfWeek;
  period: number; // 1 to 6
  startTime: string; // "09:00 AM"
  endTime: string; // "10:00 AM"
  credits: number;
  lectureType: LectureType;
  batch?: string; // e.g. "Batch 1"
  status: TimetableStatus;
  studentCount: number;
}

export interface TimetableConflict {
  type: "faculty_double_booking" | "room_conflict" | "section_conflict" | "lab_conflict";
  message: string;
  entries: TimetableEntry[];
}

export interface TimetableFilterParams {
  department?: string;
  program?: string;
  semester?: string;
  section?: string;
  facultyId?: string;
  facultyName?: string;
  subjectName?: string;
  room?: string;
  isLab?: boolean;
  academicYear?: string;
  day?: string;
}

// ──────────────── CENTRALIZED MASTER INSTITUTIONAL TIMETABLE DATA ────────────────
// Single Source of Truth for Academic Management, Faculty Timetables & Dashboard Widgets

export let MASTER_TIMETABLE_ENTRIES: TimetableEntry[] = [
  // ── MONDAY ──
  {
    id: "TT-MASTER-101",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-302",
    building: "Academic Block A",
    day: "Monday",
    period: 1,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-102",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS602",
    subjectName: "Database Management Systems",
    subjectCode: "CS602",
    facultyId: "EMP-CSE-2042",
    facultyName: "Dr. Ravi Kumar",
    room: "LH-302",
    building: "Academic Block A",
    day: "Monday",
    period: 2,
    startTime: "10:15 AM",
    endTime: "11:15 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-103",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-B",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-304",
    building: "Academic Block A",
    day: "Monday",
    period: 3,
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 60,
  },
  {
    id: "TT-MASTER-104",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS601L",
    subjectName: "Operating Systems Laboratory",
    subjectCode: "CS601L",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "Lab 5 (AI Center)",
    building: "Innovation Center",
    day: "Monday",
    period: 4,
    startTime: "01:30 PM",
    endTime: "03:30 PM",
    credits: 2,
    lectureType: "Lab",
    batch: "Batch 1",
    status: "Scheduled",
    studentCount: 32,
  },

  // ── TUESDAY ──
  {
    id: "TT-MASTER-201",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS603",
    subjectName: "Computer Networks",
    subjectCode: "CS603",
    facultyId: "EMP-CSE-2043",
    facultyName: "Prof. M. Verma",
    room: "LH-302",
    building: "Academic Block A",
    day: "Tuesday",
    period: 1,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    credits: 3,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-202",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-302",
    building: "Academic Block A",
    day: "Tuesday",
    period: 2,
    startTime: "10:15 AM",
    endTime: "11:15 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-203",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-B",
    subjectId: "CS601L",
    subjectName: "Operating Systems Laboratory",
    subjectCode: "CS601L",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "Lab 5 (AI Center)",
    building: "Innovation Center",
    day: "Tuesday",
    period: 4,
    startTime: "01:30 PM",
    endTime: "03:30 PM",
    credits: 2,
    lectureType: "Lab",
    batch: "Batch 1",
    status: "Scheduled",
    studentCount: 30,
  },

  // ── WEDNESDAY ──
  {
    id: "TT-MASTER-301",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS604",
    subjectName: "Compiler Design",
    subjectCode: "CS604",
    facultyId: "EMP-CSE-2044",
    facultyName: "Dr. K. Patel",
    room: "LH-302",
    building: "Academic Block A",
    day: "Wednesday",
    period: 1,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    credits: 3,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-302",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-B",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-304",
    building: "Academic Block A",
    day: "Wednesday",
    period: 2,
    startTime: "10:15 AM",
    endTime: "11:15 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 60,
  },
  {
    id: "TT-MASTER-303",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-302",
    building: "Academic Block A",
    day: "Wednesday",
    period: 3,
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },

  // ── THURSDAY ──
  {
    id: "TT-MASTER-401",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS602",
    subjectName: "Database Management Systems",
    subjectCode: "CS602",
    facultyId: "EMP-CSE-2042",
    facultyName: "Dr. Ravi Kumar",
    room: "LH-302",
    building: "Academic Block A",
    day: "Thursday",
    period: 1,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-402",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-B",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-304",
    building: "Academic Block A",
    day: "Thursday",
    period: 2,
    startTime: "10:15 AM",
    endTime: "11:15 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 60,
  },

  // ── FRIDAY ──
  {
    id: "TT-MASTER-501",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    program: "B.Tech",
    semester: "Semester 6",
    section: "CSE-A",
    subjectId: "CS601",
    subjectName: "Operating Systems",
    subjectCode: "CS601",
    facultyId: "EMP-CSE-2041",
    facultyName: "Dr. Ananya Sharma",
    room: "LH-302",
    building: "Academic Block A",
    day: "Friday",
    period: 1,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 64,
  },
  {
    id: "TT-MASTER-502",
    academicYear: "2025-26",
    regulation: "R22",
    department: "Mechanical Engineering",
    deptCode: "ME",
    program: "B.Tech",
    semester: "Semester 6",
    section: "ME-A",
    subjectId: "ME601",
    subjectName: "Thermodynamics",
    subjectCode: "ME601",
    facultyId: "EMP-ME-102",
    facultyName: "Prof. V. K. Singh",
    room: "LH-105",
    building: "Engineering Wing",
    day: "Friday",
    period: 2,
    startTime: "10:15 AM",
    endTime: "11:15 AM",
    credits: 4,
    lectureType: "Lecture",
    status: "Scheduled",
    studentCount: 55,
  },
];

// ──────────────── SERVICE FUNCTIONS (API-READY FOR BACKEND INTEGRATION) ────────────────

export function getCentralizedMasterTimetable(filters?: TimetableFilterParams): TimetableEntry[] {
  if (!filters) return MASTER_TIMETABLE_ENTRIES;

  return MASTER_TIMETABLE_ENTRIES.filter((entry) => {
    if (filters.department && entry.deptCode !== filters.department && entry.department !== filters.department) return false;
    if (filters.program && entry.program !== filters.program) return false;
    if (filters.semester && entry.semester !== filters.semester) return false;
    if (filters.section && entry.section !== filters.section) return false;
    if (filters.facultyId && entry.facultyId !== filters.facultyId) return false;
    if (filters.facultyName && !entry.facultyName.toLowerCase().includes(filters.facultyName.toLowerCase())) return false;
    if (filters.subjectName && !entry.subjectName.toLowerCase().includes(filters.subjectName.toLowerCase())) return false;
    if (filters.room && entry.room !== filters.room) return false;
    if (filters.isLab !== undefined) {
      const isLabType = entry.lectureType === "Lab" || entry.room.toLowerCase().includes("lab");
      if (filters.isLab && !isLabType) return false;
      if (!filters.isLab && isLabType) return false;
    }
    if (filters.academicYear && entry.academicYear !== filters.academicYear) return false;
    if (filters.day && entry.day.toLowerCase() !== filters.day.toLowerCase()) return false;

    return true;
  });
}

// Automatically filter timetable by facultyId or facultyName
export function getFacultyTimetable(facultyIdOrName: string): TimetableEntry[] {
  return MASTER_TIMETABLE_ENTRIES.filter(
    (e) => e.facultyId === facultyIdOrName || e.facultyName.toLowerCase().includes(facultyIdOrName.toLowerCase())
  );
}

export function getDepartmentTimetable(deptCode: string): TimetableEntry[] {
  return MASTER_TIMETABLE_ENTRIES.filter((e) => e.deptCode === deptCode || e.department.includes(deptCode));
}

export function getSectionTimetable(section: string): TimetableEntry[] {
  return MASTER_TIMETABLE_ENTRIES.filter((e) => e.section === section);
}

export function getRoomTimetable(room: string): TimetableEntry[] {
  return MASTER_TIMETABLE_ENTRIES.filter((e) => e.room === room);
}

// Master CRUD Actions
export function addMasterTimetableEntry(newEntry: Omit<TimetableEntry, "id">): TimetableEntry {
  const created: TimetableEntry = {
    ...newEntry,
    id: `TT-MASTER-${Date.now()}`,
  };
  MASTER_TIMETABLE_ENTRIES = [created, ...MASTER_TIMETABLE_ENTRIES];
  return created;
}

export function updateMasterTimetableEntry(id: string, updates: Partial<TimetableEntry>): TimetableEntry | null {
  let updatedEntry: TimetableEntry | null = null;
  MASTER_TIMETABLE_ENTRIES = MASTER_TIMETABLE_ENTRIES.map((entry) => {
    if (entry.id === id) {
      updatedEntry = { ...entry, ...updates };
      return updatedEntry;
    }
    return entry;
  });
  return updatedEntry;
}

export function deleteMasterTimetableEntry(id: string): boolean {
  const initialLength = MASTER_TIMETABLE_ENTRIES.length;
  MASTER_TIMETABLE_ENTRIES = MASTER_TIMETABLE_ENTRIES.filter((e) => e.id !== id);
  return MASTER_TIMETABLE_ENTRIES.length < initialLength;
}

// Conflict Detection Algorithm
export function validateTimetableConflicts(entries: TimetableEntry[] = MASTER_TIMETABLE_ENTRIES): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];

      // Check same day and period overlap
      if (a.day === b.day && a.period === b.period) {
        // Faculty double booking
        if (a.facultyId === b.facultyId) {
          conflicts.push({
            type: "faculty_double_booking",
            message: `Faculty double booking: ${a.facultyName} is assigned to both ${a.section} (${a.subjectName}) and ${b.section} (${b.subjectName}) on ${a.day} Period ${a.period}.`,
            entries: [a, b],
          });
        }

        // Room conflict
        if (a.room === b.room) {
          conflicts.push({
            type: "room_conflict",
            message: `Room conflict: ${a.room} is assigned to both ${a.section} and ${b.section} on ${a.day} Period ${a.period}.`,
            entries: [a, b],
          });
        }

        // Section conflict
        if (a.section === b.section) {
          conflicts.push({
            type: "section_conflict",
            message: `Section conflict: Section ${a.section} has two overlapping classes (${a.subjectName} & ${b.subjectName}) on ${a.day} Period ${a.period}.`,
            entries: [a, b],
          });
        }
      }
    }
  }

  return conflicts;
}
