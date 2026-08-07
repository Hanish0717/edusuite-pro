export interface Exam {
  id: string;
  examCode: string;
  examName: string;
  examType: "Internal Assessment" | "Mid Examination" | "Practical Examination" | "Lab Examination" | "End Semester Examination" | "Supplementary Examination" | "Improvement Examination" | "Project Viva";
  department: string;
  program: string;
  semester: string;
  section: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  hall: string;
  invigilator: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Published" | "Completed" | "Cancelled";
  maxMarks: number;
  passingMarks: number;
  totalStudents: number;
}

export interface ExamHall {
  hallId: string;
  hallNumber: string;
  building: string;
  capacity: number;
  allocatedStudents: number;
  status: "Available" | "Occupied" | "Full";
}

export interface Invigilator {
  facultyId: string;
  facultyName: string;
  department: string;
  assignedHall: string;
  assignedExam: string;
  date: string;
  status: "Assigned" | "Available" | "Unavailable";
}

export interface ExamNotification {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
}

export const MOCK_EXAMS: Exam[] = [
  {
    id: "EX-101",
    examCode: "CS501-MID",
    examName: "Computer Networks Mid-Term",
    examType: "Mid Examination",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    subject: "Computer Networks",
    date: "2026-08-10",
    startTime: "09:30 AM",
    endTime: "11:30 AM",
    duration: "2 hours",
    hall: "LH-302",
    invigilator: "Dr. K. Sai Teja",
    status: "Published",
    maxMarks: 50,
    passingMarks: 20,
    totalStudents: 60
  },
  {
    id: "EX-102",
    examCode: "EC304-END",
    examName: "VLSI System Design End-Sem",
    examType: "End Semester Examination",
    department: "ECE",
    program: "B.Tech",
    semester: "Semester III",
    section: "ECE-B",
    subject: "VLSI System Design",
    date: "2026-08-12",
    startTime: "09:30 AM",
    endTime: "12:30 PM",
    duration: "3 hours",
    hall: "LH-204",
    invigilator: "Dr. Meera Rao",
    status: "Published",
    maxMarks: 100,
    passingMarks: 40,
    totalStudents: 50
  },
  {
    id: "EX-103",
    examCode: "CS302-LAB",
    examName: "Java OOP Practical Exam",
    examType: "Lab Examination",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester III",
    section: "CSE-A",
    subject: "OOP through Java",
    date: "2026-08-15",
    startTime: "01:30 PM",
    endTime: "04:30 PM",
    duration: "3 hours",
    hall: "Lab 5",
    invigilator: "Ms. Ananya Verma",
    status: "Approved",
    maxMarks: 50,
    passingMarks: 25,
    totalStudents: 40
  }
];

export const MOCK_EXAM_HALLS: ExamHall[] = [
  {
    hallId: "hall-1",
    hallNumber: "LH-302",
    building: "Academic Block A",
    capacity: 60,
    allocatedStudents: 60,
    status: "Full"
  },
  {
    hallId: "hall-2",
    hallNumber: "LH-204",
    building: "Academic Block B",
    capacity: 60,
    allocatedStudents: 50,
    status: "Occupied"
  },
  {
    hallId: "hall-3",
    hallNumber: "SH-101",
    building: "Main Seminar Wing",
    capacity: 120,
    allocatedStudents: 0,
    status: "Available"
  }
];

export const MOCK_INVIGILATORS: Invigilator[] = [
  {
    facultyId: "fac-101",
    facultyName: "Dr. K. Sai Teja",
    department: "CSE",
    assignedHall: "LH-302",
    assignedExam: "Computer Networks Mid-Term",
    date: "2026-08-10",
    status: "Assigned"
  },
  {
    facultyId: "fac-102",
    facultyName: "Dr. S. K. Gupta",
    department: "CSE",
    assignedHall: "None",
    assignedExam: "None",
    date: "2026-08-10",
    status: "Available"
  },
  {
    facultyId: "fac-201",
    facultyName: "Dr. Meera Rao",
    department: "ECE",
    assignedHall: "LH-204",
    assignedExam: "VLSI System Design End-Sem",
    date: "2026-08-12",
    status: "Assigned"
  }
];

export const MOCK_NOTIFICATIONS: ExamNotification[] = [
  {
    id: "not-1",
    message: "Mid Semester Exam Schedule R25 Regulation published successfully.",
    type: "success",
    time: "5 mins ago"
  },
  {
    id: "not-2",
    message: "Room allocation warnings: Lecture Hall LH-302 capacity is fully saturated.",
    type: "warning",
    time: "1 hour ago"
  },
  {
    id: "not-3",
    message: "Supplementary Examination schedule drafted by evaluation committee.",
    type: "info",
    time: "4 hours ago"
  }
];
