import { toast } from "sonner";

export interface DeanTimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  period: string; // e.g. "09:00 AM - 10:00 AM"
  slotNum: number;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  section: string;
  room: string;
  assignedFaculty: string;
  originalFaculty: string;
  isSubstituted?: boolean;
}

export interface AttendanceRecord {
  classId: string;
  date: string;
  subject: string;
  branch: string;
  section: string;
  students: {
    id: string;
    rollNo: string;
    name: string;
    status: "Present" | "Absent" | "Late";
  }[];
  isSaved?: boolean;
}

export interface SubstitutionRecord {
  id: string;
  originalFaculty: string;
  substituteFaculty: string;
  date: string;
  period: string;
  subject: string;
  branchSection: string;
  reason: string;
  status: "Assigned" | "Active" | "Completed" | "Cancelled";
  createdAt: string;
}

export const INITIAL_DEAN_TIMETABLE: DeanTimetableSlot[] = [
  {
    id: "dt-1",
    day: "Monday",
    period: "09:00 AM - 10:00 AM",
    slotNum: 1,
    subjectCode: "CS501",
    subjectName: "Advanced Software Engineering",
    branch: "CSE",
    semester: 5,
    section: "Sec A",
    room: "Lab-301",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
  {
    id: "dt-2",
    day: "Monday",
    period: "11:15 AM - 12:15 PM",
    slotNum: 3,
    subjectCode: "CS503",
    subjectName: "Cloud Computing & Systems",
    branch: "CSE",
    semester: 5,
    section: "Sec B",
    room: "CR-204",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
  {
    id: "dt-3",
    day: "Tuesday",
    period: "10:15 AM - 11:15 AM",
    slotNum: 2,
    subjectCode: "CS501",
    subjectName: "Advanced Software Engineering",
    branch: "CSE",
    semester: 5,
    section: "Sec A",
    room: "CR-102",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
  {
    id: "dt-4",
    day: "Wednesday",
    period: "02:00 PM - 03:00 PM",
    slotNum: 5,
    subjectCode: "CS504",
    subjectName: "AI & Machine Learning Seminar",
    branch: "CSE",
    semester: 7,
    section: "Sec A",
    room: "Auditorium-2",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
  {
    id: "dt-5",
    day: "Thursday",
    period: "09:00 AM - 10:00 AM",
    slotNum: 1,
    subjectCode: "CS503",
    subjectName: "Cloud Computing & Systems",
    branch: "CSE",
    semester: 5,
    section: "Sec B",
    room: "CR-204",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
  {
    id: "dt-6",
    day: "Friday",
    period: "11:15 AM - 12:15 PM",
    slotNum: 3,
    subjectCode: "CS501",
    subjectName: "Advanced Software Engineering",
    branch: "CSE",
    semester: 5,
    section: "Sec A",
    room: "Lab-301",
    assignedFaculty: "LoggedIn Dean",
    originalFaculty: "LoggedIn Dean",
  },
];

export const DEPARTMENT_FACULTY_LIST = [
  { id: "fac-1", name: "Dr. Ravi Kumar", designation: "Associate Professor", dept: "CSE" },
  { id: "fac-2", name: "Ms. Ananya Verma", designation: "Assistant Professor", dept: "CSE" },
  { id: "fac-3", name: "Prof. S. K. Gupta", designation: "Professor & HOD", dept: "CSE" },
  { id: "fac-4", name: "Dr. Meera Rao", designation: "Senior Professor", dept: "ECE" },
  { id: "fac-5", name: "Mr. R. Karthik", designation: "Assistant Professor", dept: "EEE" },
  { id: "fac-6", name: "Dr. Vikram Malhotra", designation: "Professor", dept: "ME" },
];

export const INITIAL_SUBSTITUTIONS: SubstitutionRecord[] = [
  {
    id: "SUB-1001",
    originalFaculty: "Dean (You)",
    substituteFaculty: "Ms. Ananya Verma",
    date: "2026-08-01",
    period: "09:00 AM - 10:00 AM",
    subject: "CS501 - Advanced Software Engineering",
    branchSection: "CSE Sem 5 - Sec A",
    reason: "Executive Academic Committee Meeting",
    status: "Completed",
    createdAt: "2026-07-31 16:30",
  },
  {
    id: "SUB-1002",
    originalFaculty: "Dean (You)",
    substituteFaculty: "Dr. Ravi Kumar",
    date: "2026-08-03",
    period: "02:00 PM - 03:00 PM",
    subject: "CS504 - AI & Machine Learning Seminar",
    branchSection: "CSE Sem 7 - Sec A",
    reason: "NAAC Inspection Review Session",
    status: "Active",
    createdAt: "2026-08-02 09:15",
  },
];

export const MOCK_STUDENTS_CLASS = [
  { id: "std-1", rollNo: "22CS101", name: "K. Sai Teja", status: "Present" as const },
  { id: "std-2", rollNo: "22CS102", name: "Priya Sundaram", status: "Present" as const },
  { id: "std-3", rollNo: "22CS103", name: "Anish Kulkarni", status: "Present" as const },
  { id: "std-4", rollNo: "22CS104", name: "Rohan Verma", status: "Absent" as const },
  { id: "std-5", rollNo: "22CS105", name: "Sneha Reddy", status: "Present" as const },
  { id: "std-6", rollNo: "22CS106", name: "Aditya Sharma", status: "Late" as const },
  { id: "std-7", rollNo: "22CS107", name: "Kavya Patel", status: "Present" as const },
  { id: "std-8", rollNo: "22CS108", name: "Nikhil Joshi", status: "Present" as const },
];
