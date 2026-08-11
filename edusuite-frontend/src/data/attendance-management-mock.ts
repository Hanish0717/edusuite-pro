export interface StudentAttendance {
  studentId: string;
  studentName: string;
  department: string;
  program: string;
  semester: string;
  section: string;
  attendancePercentage: number;
  conducted: number;
  attended: number;
  missed: number;
  status: "Excellent" | "Good" | "Warning" | "Critical";
  riskLevel: "Below 75%" | "Below 65%" | "Below 50%" | "Optimal";
  shortage: number; // classes needed to reach 75%
}

export interface FacultySubmission {
  facultyId: string;
  facultyName: string;
  department: string;
  assignedClasses: number;
  completedClasses: number;
  pendingSubmissions: number;
  submissionRate: number; // percentage
  status: "Submitted All" | "Submissions Pending" | "Overdue Action";
}

export interface DepartmentAttendance {
  departmentId: string;
  averageAttendance: number;
  studentsCount: number;
  bestSection: string;
  lowestSection: string;
  trend: "up" | "down" | "stable";
}

export interface CorrectionRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  facultyName: string;
  subjectCode: string;
  subjectName: string;
  requestedDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface LeaveRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  department: string;
  type: "Medical Leave" | "OD Request" | "Sports" | "NCC" | "Internship" | "Placement";
  reason: string;
  requestedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface AttendanceAlert {
  id: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: string;
}

export const MOCK_STUDENT_ATTENDANCE: StudentAttendance[] = [
  {
    studentId: "stu-101",
    studentName: "Aditya Vardhan",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    attendancePercentage: 88.5,
    conducted: 40,
    attended: 35,
    missed: 5,
    status: "Good",
    riskLevel: "Optimal",
    shortage: 0
  },
  {
    studentId: "stu-102",
    studentName: "Rohan Sharma",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    attendancePercentage: 72.0,
    conducted: 40,
    attended: 28,
    missed: 12,
    status: "Warning",
    riskLevel: "Below 75%",
    shortage: 3 // needs 3 consecutive classes to reach 75%
  },
  {
    studentId: "stu-103",
    studentName: "Sneha Reddy",
    department: "ECE",
    program: "B.Tech",
    semester: "Semester III",
    section: "ECE-B",
    attendancePercentage: 94.2,
    conducted: 38,
    attended: 36,
    missed: 2,
    status: "Excellent",
    riskLevel: "Optimal",
    shortage: 0
  },
  {
    studentId: "stu-104",
    studentName: "Vikram Malhotra",
    department: "ME",
    program: "B.Tech",
    semester: "Semester VII",
    section: "ME-A",
    attendancePercentage: 62.5,
    conducted: 42,
    attended: 26,
    missed: 16,
    status: "Critical",
    riskLevel: "Below 65%",
    shortage: 6
  },
  {
    studentId: "stu-105",
    studentName: "Priya Nair",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester V",
    section: "CSE-A",
    attendancePercentage: 48.0,
    conducted: 40,
    attended: 19,
    missed: 21,
    status: "Critical",
    riskLevel: "Below 50%",
    shortage: 11
  }
];

export const MOCK_FACULTY_SUBMISSIONS: FacultySubmission[] = [
  {
    facultyId: "fac-101",
    facultyName: "Dr. K. Sai Teja",
    department: "CSE",
    assignedClasses: 18,
    completedClasses: 18,
    pendingSubmissions: 0,
    submissionRate: 100,
    status: "Submitted All"
  },
  {
    facultyId: "fac-102",
    facultyName: "Dr. S. K. Gupta",
    department: "CSE",
    assignedClasses: 22,
    completedClasses: 18,
    pendingSubmissions: 4,
    submissionRate: 81.8,
    status: "Submissions Pending"
  },
  {
    facultyId: "fac-103",
    facultyName: "Dr. Rajesh Sharma",
    department: "CSE",
    assignedClasses: 16,
    completedClasses: 14,
    pendingSubmissions: 2,
    submissionRate: 87.5,
    status: "Submissions Pending"
  },
  {
    facultyId: "fac-201",
    facultyName: "Dr. Meera Rao",
    department: "ECE",
    assignedClasses: 15,
    completedClasses: 15,
    pendingSubmissions: 0,
    submissionRate: 100,
    status: "Submitted All"
  }
];

export const MOCK_DEPARTMENT_ATTENDANCE: DepartmentAttendance[] = [
  {
    departmentId: "CSE",
    averageAttendance: 84.5,
    studentsCount: 780,
    bestSection: "CSE-A Sem V",
    lowestSection: "CSE-B Sem III",
    trend: "up"
  },
  {
    departmentId: "ECE",
    averageAttendance: 82.2,
    studentsCount: 520,
    bestSection: "ECE-A Sem V",
    lowestSection: "ECE-B Sem I",
    trend: "stable"
  },
  {
    departmentId: "ME",
    averageAttendance: 76.8,
    studentsCount: 380,
    bestSection: "ME-B Sem VII",
    lowestSection: "ME-A Sem V",
    trend: "down"
  }
];

export const MOCK_CORRECTION_REQUESTS: CorrectionRequest[] = [
  {
    requestId: "REQ-001",
    studentId: "stu-102",
    studentName: "Rohan Sharma",
    facultyName: "Dr. K. Sai Teja",
    subjectCode: "CS501",
    subjectName: "Computer Networks",
    requestedDate: "2026-08-01",
    reason: "Marked absent due to laboratory biometric fingerprint scanner error.",
    status: "Pending"
  },
  {
    requestId: "REQ-002",
    studentId: "stu-104",
    studentName: "Vikram Malhotra",
    facultyName: "Prof. V. K. Murthy",
    subjectCode: "ME308",
    subjectName: "Computer Aided Design",
    requestedDate: "2026-08-02",
    reason: "Represented the institution in Inter-College Sports meet; OD not updated.",
    status: "Pending"
  }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    requestId: "LV-201",
    studentId: "stu-102",
    studentName: "Rohan Sharma",
    department: "CSE",
    type: "Medical Leave",
    reason: "Hospitalized due to viral gastroenteritis; medical certificate attached.",
    requestedDate: "2026-08-01",
    status: "Pending"
  },
  {
    requestId: "LV-202",
    studentId: "stu-103",
    studentName: "Sneha Reddy",
    department: "ECE",
    type: "OD Request",
    reason: "Represented the campus in National level Hackathon project presentation.",
    requestedDate: "2026-08-02",
    status: "Pending"
  }
];

export const MOCK_ALERTS: AttendanceAlert[] = [
  {
    id: "al-1",
    message: "New attendance correction request submitted by Rohan Sharma.",
    type: "info",
    timestamp: "10 mins ago"
  },
  {
    id: "al-2",
    message: "Department of ME average attendance dropped to 76.8% (Below 80% threshold).",
    type: "warning",
    timestamp: "2 hours ago"
  },
  {
    id: "al-3",
    message: "Dr. S. K. Gupta has 4 pending attendance submissions overdue by 48 hours.",
    type: "error",
    timestamp: "5 hours ago"
  }
];
