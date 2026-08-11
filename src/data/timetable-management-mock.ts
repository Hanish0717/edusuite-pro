export interface TimetableSlot {
  id: string;
  academicYear: string;
  department: string;
  program: string;
  semester: string;
  section: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  period: number; // e.g. 1 to 7
  subject: string;
  subjectCode: string;
  faculty: string;
  facultyId: string;
  room: string;
  laboratory?: string;
  startTime: string;
  endTime: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Published" | "Archived";
  credits?: number;
  duration?: string;
}

export interface FacultyAvailability {
  facultyId: string;
  facultyName: string;
  department: string;
  weeklyWorkload: number; // hours
  maxWorkload: number;
  availableHours: number;
  unavailableSlots: string[]; // e.g. ["Monday-Period 1", "Wednesday-Period 5"]
  status: "Optimal" | "Overloaded" | "Available";
}

export interface Classroom {
  roomId: string;
  roomNumber: string;
  building: string;
  capacity: number;
  roomType: "Lecture Hall" | "Seminar Hall" | "Tutorial Room";
  status: "Available" | "Occupied";
  currentSchedule?: string;
}

export interface Laboratory {
  labId: string;
  labName: string;
  department: string;
  capacity: number;
  equipment: string;
  status: "Available" | "Occupied";
  availableTimeSlots: string[];
}

export interface TimetableConflict {
  id: string;
  type: "Faculty Conflict" | "Room Conflict" | "Lab Conflict" | "Overload Warning";
  message: string;
  severity: "info" | "warning" | "critical";
  affectedSlotId: string;
}

export const MOCK_TIMETABLE_SLOTS: TimetableSlot[] = [
  // Monday
  {
    id: "tt-1",
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    day: "Monday",
    period: 1,
    subject: "Computer Networks",
    subjectCode: "CS501",
    faculty: "Dr. K. Sai Teja",
    facultyId: "fac-101",
    room: "LH-302",
    startTime: "09:30 AM",
    endTime: "10:30 AM",
    status: "Published",
    credits: 4,
    duration: "1 hour"
  },
  {
    id: "tt-2",
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    day: "Monday",
    period: 2,
    subject: "Web Technologies",
    subjectCode: "CS502",
    faculty: "Dr. S. K. Gupta",
    facultyId: "fac-102",
    room: "LH-302",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    status: "Published",
    credits: 4,
    duration: "1 hour"
  },
  {
    id: "tt-3",
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    day: "Monday",
    period: 3,
    subject: "Artificial Intelligence",
    subjectCode: "CS503",
    faculty: "Dr. Rajesh Sharma",
    facultyId: "fac-103",
    room: "LH-302",
    startTime: "11:45 AM",
    endTime: "12:45 PM",
    status: "Published",
    credits: 3,
    duration: "1 hour"
  },
  {
    id: "tt-4",
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    day: "Monday",
    period: 5,
    subject: "Cloud Computing Lab",
    subjectCode: "CS511",
    faculty: "Ms. Ananya Verma",
    facultyId: "fac-104",
    room: "Lab 5",
    laboratory: "AI Center Lab",
    startTime: "01:30 PM",
    endTime: "03:30 PM",
    status: "Published",
    credits: 2,
    duration: "2 hours"
  },
  // Tuesday
  {
    id: "tt-5",
    academicYear: "2026-27",
    department: "ECE",
    program: "B.Tech",
    semester: "Semester III",
    section: "ECE-B",
    day: "Tuesday",
    period: 1,
    subject: "VLSI System Design",
    subjectCode: "EC304",
    faculty: "Dr. Meera Rao",
    facultyId: "fac-201",
    room: "LH-204",
    startTime: "09:30 AM",
    endTime: "10:30 AM",
    status: "Published",
    credits: 4,
    duration: "1 hour"
  },
  {
    id: "tt-6",
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    day: "Wednesday",
    period: 4,
    subject: "Formal Languages",
    subjectCode: "CS404",
    faculty: "Dr. Rajesh Sharma",
    facultyId: "fac-103",
    room: "LH-302",
    startTime: "12:45 PM",
    endTime: "01:30 PM",
    status: "Published",
    credits: 3,
    duration: "45 mins"
  }
];

export const MOCK_FACULTY_AVAILABILITY: FacultyAvailability[] = [
  {
    facultyId: "fac-101",
    facultyName: "Dr. K. Sai Teja",
    department: "CSE",
    weeklyWorkload: 14,
    maxWorkload: 16,
    availableHours: 26,
    unavailableSlots: ["Monday-Period 4", "Wednesday-Period 1"],
    status: "Optimal"
  },
  {
    facultyId: "fac-102",
    facultyName: "Dr. S. K. Gupta",
    department: "CSE",
    weeklyWorkload: 18,
    maxWorkload: 16,
    availableHours: 22,
    unavailableSlots: ["Tuesday-Period 2", "Thursday-Period 5"],
    status: "Overloaded"
  },
  {
    facultyId: "fac-103",
    facultyName: "Dr. Rajesh Sharma",
    department: "CSE",
    weeklyWorkload: 10,
    maxWorkload: 16,
    availableHours: 30,
    unavailableSlots: ["Friday-Period 6"],
    status: "Available"
  },
  {
    facultyId: "fac-201",
    facultyName: "Dr. Meera Rao",
    department: "ECE",
    weeklyWorkload: 12,
    maxWorkload: 16,
    availableHours: 28,
    unavailableSlots: ["Monday-Period 1"],
    status: "Optimal"
  }
];

export const MOCK_CLASSROOMS: Classroom[] = [
  {
    roomId: "room-1",
    roomNumber: "LH-302",
    building: "Academic Block A",
    capacity: 60,
    roomType: "Lecture Hall",
    status: "Occupied",
    currentSchedule: "CSE-A Semester V - Computer Networks"
  },
  {
    roomId: "room-2",
    roomNumber: "LH-204",
    building: "Academic Block B",
    capacity: 50,
    roomType: "Lecture Hall",
    status: "Available"
  },
  {
    roomId: "room-3",
    roomNumber: "SH-101",
    building: "Main Seminar Wing",
    capacity: 120,
    roomType: "Seminar Hall",
    status: "Available"
  }
];

export const MOCK_LABORATORIES: Laboratory[] = [
  {
    labId: "lab-1",
    labName: "Lab 5 (AI Center Lab)",
    department: "CSE",
    capacity: 40,
    equipment: "NVIDIA RTX Workstations, High-Speed LAN",
    status: "Occupied",
    availableTimeSlots: ["Tuesday-Period 5", "Wednesday-Period 1", "Thursday-Period 3"]
  },
  {
    labId: "lab-2",
    labName: "VLSI Synthesis Lab",
    department: "ECE",
    capacity: 35,
    equipment: "Cadence Toolkits, FPGA Evaluation Boards",
    status: "Available",
    availableTimeSlots: ["Monday-Period 2", "Wednesday-Period 4"]
  }
];

export const MOCK_CONFLICTS: TimetableConflict[] = [
  {
    id: "conf-1",
    type: "Faculty Conflict",
    message: "Dr. S. K. Gupta already assigned to ECE-B on Tuesday Period 2.",
    severity: "critical",
    affectedSlotId: "tt-2"
  },
  {
    id: "conf-2",
    type: "Room Conflict",
    message: "Lecture Hall LH-302 double booked on Monday Period 1 (CSE-A & IT-B).",
    severity: "critical",
    affectedSlotId: "tt-1"
  },
  {
    id: "conf-3",
    type: "Overload Warning",
    message: "Dr. S. K. Gupta has exceeded optimal workload limit (18 hrs / 16 hrs).",
    severity: "warning",
    affectedSlotId: "tt-2"
  }
];
