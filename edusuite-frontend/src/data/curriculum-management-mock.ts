export interface Program {
  id: string;
  programCode: string;
  programName: string;
  degree: "B.Tech" | "M.Tech" | "MBA" | "B.Sc";
  department: string;
  duration: number; // in years
  academicYear: string;
  credits: number;
  regulationId: string;
  regulationName: string;
  status: "active" | "inactive";
  totalSemesters: number;
  subjectsCount: number;
  facultyCount: number;
  studentsCount: number;
}

export interface CurriculumSubject {
  code: string;
  name: string;
  credits: number;
  theoryHours: number;
  labHours: number;
  subjectType: "Core" | "Elective" | "Laboratory" | "Project";
}

export interface SemesterCurriculum {
  id: string;
  programId: string;
  semester: string; // e.g. "Semester I"
  subjects: CurriculumSubject[];
  credits: number;
}

export interface Regulation {
  id: string;
  name: string;
  effectiveYear: number;
  applicablePrograms: string[];
  totalSubjects: number;
  status: "active" | "inactive";
}

export interface CurriculumRevision {
  id: string;
  programId: string;
  version: string; // e.g. "2026 Revision"
  academicYear: string;
  status: "active" | "draft" | "deprecated";
  effectiveDate: string;
  description: string;
}

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    programCode: "CSE-BTECH",
    programName: "Computer Science & Engineering",
    degree: "B.Tech",
    department: "CSE",
    duration: 4,
    academicYear: "2026-27",
    credits: 160,
    regulationId: "reg-r25",
    regulationName: "R25",
    status: "active",
    totalSemesters: 8,
    subjectsCount: 42,
    facultyCount: 28,
    studentsCount: 780
  },
  {
    id: "prog-2",
    programCode: "ECE-BTECH",
    programName: "Electronics & Communication Engineering",
    degree: "B.Tech",
    department: "ECE",
    duration: 4,
    academicYear: "2026-27",
    credits: 160,
    regulationId: "reg-r22",
    regulationName: "R22",
    status: "active",
    totalSemesters: 8,
    subjectsCount: 38,
    facultyCount: 22,
    studentsCount: 520
  },
  {
    id: "prog-3",
    programCode: "MBA-GEN",
    programName: "Master of Business Administration",
    degree: "MBA",
    department: "Management",
    duration: 2,
    academicYear: "2026-27",
    credits: 90,
    regulationId: "reg-r25",
    regulationName: "R25",
    status: "active",
    totalSemesters: 4,
    subjectsCount: 24,
    facultyCount: 16,
    studentsCount: 200
  },
  {
    id: "prog-4",
    programCode: "ME-BTECH",
    programName: "Mechanical Engineering",
    degree: "B.Tech",
    department: "ME",
    duration: 4,
    academicYear: "2025-26",
    credits: 160,
    regulationId: "reg-r22",
    regulationName: "R22",
    status: "active",
    totalSemesters: 8,
    subjectsCount: 40,
    facultyCount: 18,
    studentsCount: 380
  }
];

export const MOCK_CURRICULUMS: SemesterCurriculum[] = [
  // CSE Semester I
  {
    id: "curr-1-1",
    programId: "prog-1",
    semester: "Semester I",
    credits: 20,
    subjects: [
      { code: "MA101", name: "Linear Algebra & Calculus", credits: 4, theoryHours: 4, labHours: 0, subjectType: "Core" },
      { code: "PH102", name: "Engineering Physics", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS103", name: "Programming for Problem Solving", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "HS104", name: "English Communication Skills", credits: 2, theoryHours: 2, labHours: 0, subjectType: "Core" },
      { code: "PH182", name: "Engineering Physics Lab", credits: 1.5, theoryHours: 0, labHours: 3, subjectType: "Laboratory" }
    ]
  },
  // CSE Semester II
  {
    id: "curr-1-2",
    programId: "prog-1",
    semester: "Semester II",
    credits: 22,
    subjects: [
      { code: "MA201", name: "Differential Equations & Transform Calculus", credits: 4, theoryHours: 4, labHours: 0, subjectType: "Core" },
      { code: "CH202", name: "Engineering Chemistry", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS203", name: "Data Structures & Algorithms", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "ME204", name: "Basic Mechanical & Civil Engineering", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" }
    ]
  },
  // CSE Semester III
  {
    id: "curr-1-3",
    programId: "prog-1",
    semester: "Semester III",
    credits: 21,
    subjects: [
      { code: "CS301", name: "Discrete Mathematics", credits: 4, theoryHours: 4, labHours: 0, subjectType: "Core" },
      { code: "CS302", name: "Object Oriented Programming through Java", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS303", name: "Computer Organization & Architecture", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS304", name: "Database Management Systems", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" }
    ]
  },
  // CSE Semester IV
  {
    id: "curr-1-4",
    programId: "prog-1",
    semester: "Semester IV",
    credits: 21,
    subjects: [
      { code: "CS401", name: "Operating Systems", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS402", name: "Design & Analysis of Algorithms", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS403", name: "Software Engineering", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS404", name: "Formal Languages & Automata Theory", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" }
    ]
  },
  // CSE Semester V
  {
    id: "curr-1-5",
    programId: "prog-1",
    semester: "Semester V",
    credits: 18,
    subjects: [
      { code: "CS501", name: "Computer Networks", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS502", name: "Web Technologies", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS503", name: "Artificial Intelligence", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS511", name: "Professional Elective - I (Cloud Computing)", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Elective" }
    ]
  },
  // CSE Semester VI
  {
    id: "curr-1-6",
    programId: "prog-1",
    semester: "Semester VI",
    credits: 20,
    subjects: [
      { code: "CS601", name: "Compiler Design", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS602", name: "Cryptography & Network Security", credits: 4, theoryHours: 3, labHours: 2, subjectType: "Laboratory" },
      { code: "CS611", name: "Professional Elective - II (Data Science)", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Elective" },
      { code: "CS621", name: "Open Elective - I (Intellectual Property Rights)", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Elective" }
    ]
  },
  // CSE Semester VII
  {
    id: "curr-1-7",
    programId: "prog-1",
    semester: "Semester VII",
    credits: 18,
    subjects: [
      { code: "CS701", name: "Distributed Systems", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Core" },
      { code: "CS711", name: "Professional Elective - III (Machine Learning)", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Elective" },
      { code: "CS721", name: "Open Elective - II (Entrepreneurship Development)", credits: 3, theoryHours: 3, labHours: 0, subjectType: "Elective" },
      { code: "CS781", name: "Mini Project & Seminar", credits: 3, theoryHours: 0, labHours: 6, subjectType: "Project" }
    ]
  },
  // CSE Semester VIII
  {
    id: "curr-1-8",
    programId: "prog-1",
    semester: "Semester VIII",
    credits: 16,
    subjects: [
      { code: "CS881", name: "Major Project Work", credits: 12, theoryHours: 0, labHours: 24, subjectType: "Project" },
      { code: "CS821", name: "Open Elective - III (Professional Ethics)", credits: 4, theoryHours: 4, labHours: 0, subjectType: "Elective" }
    ]
  }
];

export const MOCK_REGULATIONS: Regulation[] = [
  {
    id: "reg-r26",
    name: "R26",
    effectiveYear: 2026,
    applicablePrograms: ["B.Tech", "MBA"],
    totalSubjects: 48,
    status: "inactive" // draft/upcoming
  },
  {
    id: "reg-r25",
    name: "R25",
    effectiveYear: 2025,
    applicablePrograms: ["B.Tech", "M.Tech", "MBA"],
    totalSubjects: 52,
    status: "active"
  },
  {
    id: "reg-r22",
    name: "R22",
    effectiveYear: 2022,
    applicablePrograms: ["B.Tech", "M.Tech"],
    totalSubjects: 56,
    status: "active"
  }
];

export const MOCK_REVISIONS: CurriculumRevision[] = [
  {
    id: "rev-1",
    programId: "prog-1",
    version: "R26 Curriculum Draft",
    academicYear: "2026-27",
    status: "draft",
    effectiveDate: "2026-08-15",
    description: "Introduced advanced AI labs, quantum computing modules, and professional ethics guidelines across early semesters."
  },
  {
    id: "rev-2",
    programId: "prog-1",
    version: "R25 Curriculum Baseline",
    academicYear: "2025-26",
    status: "active",
    effectiveDate: "2025-07-01",
    description: "Realigned semester credits to 160-credit structure. Enhanced data warehousing practical modules in Semester VI."
  },
  {
    id: "rev-3",
    programId: "prog-1",
    version: "R22 Standard Baseline",
    academicYear: "2022-23",
    status: "deprecated",
    effectiveDate: "2022-07-01",
    description: "Initial 160-credits regulation aligned with international computer science core standards."
  }
];

export const MOCK_CREDITS_DISTRIBUTION = {
  theory: 72,
  lab: 32,
  project: 24,
  internship: 8,
  elective: 24,
  total: 160
};
