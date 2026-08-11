export interface FacultyMember {
  id: string;
  employeeId: string;
  name: string;
  photo: string; // initials
  department: string;
  designation: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Guest";
  qualification: string;
  experience: number; // in years
  email: string;
  phone: string;
  joiningDate: string;
  subjects: string[];
  sections: string[];
  weeklyHours: number;
  labHours: number;
  mentoringHours: number;
  projectHours: number;
  adminHours: number;
  status: "active" | "on-leave" | "inactive";
  attendanceRate: number; // %
  feedbackScore: number; // out of 5
  recentActivities: { id: string; description: string; timestamp: string }[];
}

export const MOCK_FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: "fac-1",
    employeeId: "FAC1001",
    name: "Dr. Ravi Kumar",
    photo: "RK",
    department: "CSE",
    designation: "Professor",
    employmentType: "Full-Time",
    qualification: "Ph.D. in Computer Science",
    experience: 15,
    email: "ravi.kumar@college.com",
    phone: "+91 90001 00001",
    joiningDate: "2018-06-15",
    subjects: ["Advanced Cryptography (CS801)", "Discrete Mathematics (CS302)"],
    sections: ["Section A", "Section B"],
    weeklyHours: 14,
    labHours: 4,
    mentoringHours: 2,
    projectHours: 2,
    adminHours: 2,
    status: "active",
    attendanceRate: 98.2,
    feedbackScore: 4.8,
    recentActivities: [
      { id: "act-1", description: "Assigned Advanced Cryptography Lab", timestamp: "2 hours ago" },
      { id: "act-2", description: "Timetable updated for Year III Section A", timestamp: "1 day ago" },
      { id: "act-3", description: "Class attendance records approved", timestamp: "3 days ago" }
    ]
  },
  {
    id: "fac-2",
    employeeId: "FAC1002",
    name: "Dr. Priya Sen",
    photo: "PS",
    department: "ECE",
    designation: "Associate Professor",
    employmentType: "Full-Time",
    qualification: "Ph.D. in VLSI Systems",
    experience: 10,
    email: "priya.sen@college.com",
    phone: "+91 90001 00002",
    joiningDate: "2020-07-20",
    subjects: ["VLSI Circuit Design (EC601)"],
    sections: ["Section A"],
    weeklyHours: 16,
    labHours: 6,
    mentoringHours: 2,
    projectHours: 4,
    adminHours: 0,
    status: "active",
    attendanceRate: 95.5,
    feedbackScore: 4.6,
    recentActivities: [
      { id: "act-4", description: "Allocated new Lab session for Semester VI", timestamp: "Yesterday" },
      { id: "act-5", description: "Syllabus draft for EC601 uploaded to LMS", timestamp: "5 days ago" }
    ]
  },
  {
    id: "fac-3",
    employeeId: "FAC1003",
    name: "Dr. S. K. Gupta",
    photo: "SG",
    department: "CSE",
    designation: "Professor & HOD",
    employmentType: "Full-Time",
    qualification: "Ph.D. in Network Security",
    experience: 18,
    email: "cse.hod@college.com",
    phone: "+91 94401 23456",
    joiningDate: "2015-08-10",
    subjects: ["Computer Networks (CS502)"],
    sections: ["Section B"],
    weeklyHours: 8,
    labHours: 2,
    mentoringHours: 2,
    projectHours: 0,
    adminHours: 12, // High admin hours as HOD
    status: "active",
    attendanceRate: 99.0,
    feedbackScore: 4.9,
    recentActivities: [
      { id: "act-6", description: "Syllabus overview signed off for CS801", timestamp: "1 day ago" },
      { id: "act-7", description: "HOD Council budget review completed", timestamp: "4 days ago" }
    ]
  },
  {
    id: "fac-4",
    employeeId: "FAC1004",
    name: "Prof. Vikram Malhotra",
    photo: "VM",
    department: "EEE",
    designation: "Professor",
    employmentType: "Full-Time",
    qualification: "M.Tech in Power Systems",
    experience: 22,
    email: "placement@college.com",
    phone: "+91 90001 00004",
    joiningDate: "2012-05-15",
    subjects: ["Control Systems (EE402)"],
    sections: ["Section C"],
    weeklyHours: 20, // Overloaded workload
    labHours: 8,
    mentoringHours: 4,
    projectHours: 4,
    adminHours: 4,
    status: "active",
    attendanceRate: 94.0,
    feedbackScore: 4.2,
    recentActivities: [
      { id: "act-8", description: "Exam duty assigned for mid-terms", timestamp: "2 days ago" },
      { id: "act-9", description: "Weekly test marks sheet uploaded", timestamp: "1 week ago" }
    ]
  },
  {
    id: "fac-5",
    employeeId: "FAC1005",
    name: "Dr. Amit Varma",
    photo: "AV",
    department: "CSE",
    designation: "Assistant Professor",
    employmentType: "Contract",
    qualification: "Ph.D. in Machine Learning",
    experience: 3,
    email: "amit.varma@college.com",
    phone: "+91 90001 00005",
    joiningDate: "2024-06-01",
    subjects: [], // No subjects assigned yet
    sections: [],
    weeklyHours: 0,
    labHours: 0,
    mentoringHours: 0,
    projectHours: 0,
    adminHours: 0,
    status: "active",
    attendanceRate: 97.8,
    feedbackScore: 4.0,
    recentActivities: [
      { id: "act-10", description: "Joined the institution staff pool", timestamp: "Yesterday" }
    ]
  },
  {
    id: "fac-6",
    employeeId: "FAC1006",
    name: "Dr. Sarah Paul",
    photo: "SP",
    department: "H&S",
    designation: "Associate Professor",
    employmentType: "Full-Time",
    qualification: "Ph.D. in Engineering Chemistry",
    experience: 12,
    email: "sarah.paul@college.com",
    phone: "+91 90001 00007",
    joiningDate: "2016-09-01",
    subjects: ["Applied Chemistry (HS103)"],
    sections: ["Section D", "Section E"],
    weeklyHours: 12,
    labHours: 4,
    mentoringHours: 2,
    projectHours: 0,
    adminHours: 2,
    status: "on-leave",
    attendanceRate: 88.0,
    feedbackScore: 4.5,
    recentActivities: [
      { id: "act-11", description: "Leave request approved for medical check", timestamp: "2 days ago" }
    ]
  },
  {
    id: "fac-7",
    employeeId: "FAC1007",
    name: "Prof. Rajesh Sharma",
    photo: "RS",
    department: "ME",
    designation: "Professor",
    employmentType: "Full-Time",
    qualification: "M.Tech in Manufacturing Systems",
    experience: 25,
    email: "me.hod@college.com",
    phone: "+91 94401 23459",
    joiningDate: "2010-02-14",
    subjects: ["Thermodynamics (ME301)", "Fluid Mechanics (ME401)"],
    sections: ["Section A", "Section B"],
    weeklyHours: 16,
    labHours: 6,
    mentoringHours: 2,
    projectHours: 4,
    adminHours: 4,
    status: "active",
    attendanceRate: 96.0,
    feedbackScore: 4.7,
    recentActivities: [
      { id: "act-12", description: "Workshop equipment budget approved", timestamp: "Yesterday" }
    ]
  }
];

export const MOCK_DEPARTMENTS_LIST = ["CSE", "ECE", "EEE", "ME", "Civil", "MBA", "H&S"];

export const MOCK_AVAILABLE_SUBJECTS = [
  { code: "CS501", name: "Operating Systems", department: "CSE", credits: 4, hours: 4 },
  { code: "CS503", name: "Formal Languages & Automata Theory", department: "CSE", credits: 3, hours: 3 },
  { code: "CS701", name: "Data Warehousing & Data Mining", department: "CSE", credits: 3, hours: 3 },
  { code: "EC401", name: "Analog Circuits", department: "ECE", credits: 4, hours: 4 },
  { code: "EC402", name: "Microprocessors & Microcontrollers", department: "ECE", credits: 3, hours: 3 },
  { code: "EE301", name: "Network Theory", department: "EEE", credits: 3, hours: 3 },
  { code: "ME501", name: "Heat Transfer", department: "ME", credits: 4, hours: 4 }
];
