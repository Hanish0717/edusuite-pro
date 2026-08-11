export interface Department {
  id: string;
  departmentCode: string;
  departmentName: string;
  description: string;
  school: "Engineering" | "Management" | "Sciences" | "Arts" | "Medicine";
  hod: string;
  establishedYear: number;
  facultyCount: number;
  studentCount: number;
  courseCount: number;
  subjectCount: number;
  email: string;
  phone: string;
  officeLocation: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  attentionRequired?: boolean;
  attentionReason?: string;
}

export interface FacultySummary {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  departmentCode: string;
}

export interface DepartmentActivity {
  id: string;
  type: "faculty" | "subject" | "timetable" | "course";
  description: string;
  timestamp: string;
  user: string;
}

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "dept-cse",
    departmentCode: "CSE",
    departmentName: "Computer Science & Engineering",
    description: "Focuses on computer hardware systems, software architecture, algorithm design, cybersecurity, and artificial intelligence applications.",
    school: "Engineering",
    hod: "Dr. S. K. Gupta",
    establishedYear: 2001,
    facultyCount: 42,
    studentCount: 780,
    courseCount: 12,
    subjectCount: 48,
    email: "cse.hod@college.com",
    phone: "+91 94401 23456",
    officeLocation: "Ramanujan Block, Room 301",
    status: "active",
    createdAt: "2001-08-10",
    updatedAt: "2026-08-01",
  },
  {
    id: "dept-ece",
    departmentCode: "ECE",
    departmentName: "Electronics & Communication Engineering",
    description: "Dedicated to microprocessors, telecommunications, signal processing, VLSI design, and embedded system technologies.",
    school: "Engineering",
    hod: "Dr. Meera Rao",
    establishedYear: 2001,
    facultyCount: 36,
    studentCount: 520,
    courseCount: 8,
    subjectCount: 38,
    email: "ece.hod@college.com",
    phone: "+91 94401 23457",
    officeLocation: "Bhabha Block, Room 204",
    status: "active",
    createdAt: "2001-08-10",
    updatedAt: "2026-07-28",
  },
  {
    id: "dept-eee",
    departmentCode: "EEE",
    departmentName: "Electrical & Electronics Engineering",
    description: "Provides academic curriculum in power systems, control engineering, renewable energy, and electrical machinery.",
    school: "Engineering",
    hod: "Prof. V. K. Murthy",
    establishedYear: 2004,
    facultyCount: 28,
    studentCount: 290,
    courseCount: 6,
    subjectCount: 28,
    email: "eee.hod@college.com",
    phone: "+91 94401 23458",
    officeLocation: "Tesla Block, Room 102",
    status: "active",
    createdAt: "2004-06-15",
    updatedAt: "2026-07-30",
    attentionRequired: true,
    attentionReason: "HOD Term Expiring Next Month",
  },
  {
    id: "dept-me",
    departmentCode: "ME",
    departmentName: "Mechanical Engineering",
    description: "Covers thermal sciences, manufacturing engineering, material sciences, robotics, computer-aided design, and fluid mechanics.",
    school: "Engineering",
    hod: "Prof. Rajesh Sharma",
    establishedYear: 2005,
    facultyCount: 30,
    studentCount: 380,
    courseCount: 6,
    subjectCount: 30,
    email: "me.hod@college.com",
    phone: "+91 94401 23459",
    officeLocation: "Newton Hall, Workshop 1",
    status: "active",
    createdAt: "2005-07-01",
    updatedAt: "2026-08-02",
  },
  {
    id: "dept-civil",
    departmentCode: "Civil",
    departmentName: "Civil Engineering",
    description: "Deals with structural mechanics, environmental engineering, geotechnical surveys, and sustainable urban infrastructure planning.",
    school: "Engineering",
    hod: "Dr. N. R. Prasad",
    establishedYear: 2012,
    facultyCount: 22,
    studentCount: 310,
    courseCount: 4,
    subjectCount: 22,
    email: "civil.hod@college.com",
    phone: "+91 94401 23460",
    officeLocation: "Visvesvaraya Block, Room 105",
    status: "active",
    createdAt: "2012-04-18",
    updatedAt: "2026-08-03",
  },
  {
    id: "dept-mba",
    departmentCode: "MBA",
    departmentName: "Master of Business Administration",
    description: "Offers specialization streams in financial management, organizational behavior, marketing analytics, and supply chain logistics.",
    school: "Management",
    hod: "Dr. H. Verma",
    establishedYear: 2010,
    facultyCount: 16,
    studentCount: 200,
    courseCount: 2,
    subjectCount: 18,
    email: "mba.hod@college.com",
    phone: "+91 94401 23461",
    officeLocation: "Chanakya Block, Room 402",
    status: "active",
    createdAt: "2010-05-20",
    updatedAt: "2026-07-29",
  },
  {
    id: "dept-hns",
    departmentCode: "H&S",
    departmentName: "Humanities & Sciences",
    description: "Serves first-year foundational curriculum courses in applied physics, engineering chemistry, advanced mathematics, and English communication.",
    school: "Sciences",
    hod: "Dr. Sarah Paul",
    establishedYear: 2001,
    facultyCount: 20,
    studentCount: 0, // Freshers assigned to specific branches
    courseCount: 0,
    subjectCount: 16,
    email: "hns.hod@college.com",
    phone: "+91 94401 23462",
    officeLocation: "Einstein Lab Block, Room 201",
    status: "active",
    createdAt: "2001-08-10",
    updatedAt: "2026-07-15",
  },
  {
    id: "dept-biotech",
    departmentCode: "BT",
    departmentName: "Bio-Technology",
    description: "Explores bioinformatics, molecular cloning, genetic engineering, biochemical processes, and microbiology methodologies.",
    school: "Sciences",
    hod: "Vacant",
    establishedYear: 2018,
    facultyCount: 8,
    studentCount: 110,
    courseCount: 2,
    subjectCount: 14,
    email: "biotech.hod@college.com",
    phone: "+91 94401 23463",
    officeLocation: "Darwin Lab Block, Room 303",
    status: "inactive",
    createdAt: "2018-06-01",
    updatedAt: "2026-08-01",
    attentionRequired: true,
    attentionReason: "HOD Position is Currently Vacant",
  }
];

export const MOCK_FACULTY_POOL: FacultySummary[] = [
  { id: "fac-1", name: "Dr. Ravi Kumar", designation: "Professor", email: "ravi.kumar@college.com", phone: "+91 90001 00001", departmentCode: "CSE" },
  { id: "fac-2", name: "Dr. Anand Kumar", designation: "Professor & Dean", email: "anand.kumar@college.com", phone: "+91 90001 00002", departmentCode: "CSE" },
  { id: "fac-3", name: "Dr. Priya Sen", designation: "Associate Professor", email: "priya.sen@college.com", phone: "+91 90001 00003", departmentCode: "ECE" },
  { id: "fac-4", name: "Prof. Vikram Malhotra", designation: "Professor", email: "vikram.m@college.com", phone: "+91 90001 00004", departmentCode: "EEE" },
  { id: "fac-5", name: "Dr. Anil Deshmukh", designation: "Professor", email: "anil.d@college.com", phone: "+91 90001 00005", departmentCode: "ME" },
  { id: "fac-6", name: "Dr. N. R. Prasad", designation: "Professor", email: "nr.prasad@college.com", phone: "+91 90001 00006", departmentCode: "Civil" },
  { id: "fac-7", name: "Dr. Sarah Paul", designation: "Associate Professor", email: "sarah.paul@college.com", phone: "+91 90001 00007", departmentCode: "H&S" },
  { id: "fac-8", name: "Prof. Rajesh Sharma", designation: "Associate Professor", email: "rajesh.s@college.com", phone: "+91 90001 00008", departmentCode: "ME" },
];

export const MOCK_DEPARTMENT_ACTIVITIES: Record<string, DepartmentActivity[]> = {
  "dept-cse": [
    { id: "act-1", type: "faculty", description: "Dr. Amit Varma was added to the department staff.", timestamp: "2 hours ago", user: "HOD CSE" },
    { id: "act-2", type: "subject", description: "Syllabus overview updated for CS801 (Advanced Cryptography).", timestamp: "Yesterday", user: "HOD CSE" },
    { id: "act-3", type: "timetable", description: "Semester V Timetable modified for Section B batch.", timestamp: "3 days ago", user: "Academic Coordinator" },
    { id: "act-4", type: "course", description: "New Elective Course: 'Quantum Computing Fundamentals' approved.", timestamp: "5 days ago", user: "Academic Manager" }
  ],
  "dept-ece": [
    { id: "act-5", type: "subject", description: "VLSI Laboratory course curriculum revised.", timestamp: "Yesterday", user: "HOD ECE" },
    { id: "act-6", type: "faculty", description: "Prof. S. R. Chawla assigned to microprocessors course.", timestamp: "3 days ago", user: "HOD ECE" }
  ],
  "dept-eee": [
    { id: "act-7", type: "timetable", description: "Renewable energy lab schedules adjusted.", timestamp: "4 days ago", user: "Academic Coordinator" }
  ],
  "dept-me": [
    { id: "act-8", type: "course", description: "Approved degree track: B.Tech Mechatronics curriculum scheme.", timestamp: "Yesterday", user: "Academic Manager" }
  ]
};
