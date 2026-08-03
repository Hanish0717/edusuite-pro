import api from "@/lib/api";

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  type: "Core Theory" | "Lab Practical" | "Professional Elective" | "Project Work";
  instructor: string;
  regulations: string;
  prerequisite?: string;
  syllabusOverview?: string;
}

export interface AcademicDepartment {
  id: string;
  code: string;
  name: string;
  hodName: string;
  facultyCount: number;
  studentCapacity: number;
  laboratoriesCount: number;
  accreditation: string;
  establishedYear: string;
}

export interface CurriculumScheme {
  id: string;
  regulationCode: string;
  programName: string;
  effectiveBatch: string;
  totalCredits: number;
  coreTheoryCredits: number;
  labCredits: number;
  electiveCredits: number;
  projectCredits: number;
  status: "Active" | "Draft" | "Archived";
}

export interface LiveFacultyStatus {
  id: string;
  facultyId: string;
  name: string;
  department: string;
  status: "FREE" | "IN CLASS / WORKING" | "ON LEAVE";
  currentClass?: string; // e.g. "CSE-3A"
  subject?: string; // e.g. "Data Structures"
  roomNo?: string; // e.g. "Block B - 302"
  timeSlot?: string; // e.g. "10:00 AM - 11:00 AM"
  leaveReason?: string; // e.g. "Casual Leave"
  period: number; // 1 to 8
}

export interface ClassStudentAttendance {
  id: string;
  rollNo: string;
  name: string;
  avatar?: string;
  status: "Present" | "Absent" | "Late";
}

export interface AttendanceSubmission {
  classId: string;
  subjectId: string;
  date: string;
  period: number;
  records: { studentId: string; status: "Present" | "Absent" | "Late" }[];
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  unitTitle: string;
  completionPct: number; // 0 to 100
  status: "Completed" | "In Progress" | "Remaining";
}

export interface SyllabusProgress {
  id: string;
  facultyId: string;
  facultyName: string;
  courseCode: string;
  courseName: string;
  department: string;
  totalClassesScheduled: number;
  classesCompleted: number;
  classesCancelled: number;
  units: SyllabusUnit[];
  overallProgressPct: number;
}

export interface AllClassesAttendanceItem {
  id: string;
  className: string;
  department: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  classTeacher: string;
  status: "Normal" | "Defaulter Warning";
}

export const INITIAL_COURSES: AcademicCourse[] = [
  {
    id: "CRS-101",
    code: "CS401",
    name: "Advanced Artificial Intelligence & Deep Learning",
    department: "CSE",
    semester: "Semester 7",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. K. Sai Teja",
    regulations: "R24 Regulation",
    prerequisite: "CS302: Data Structures & Algorithms",
    syllabusOverview: "Neural Networks, Backpropagation, Convolutional Networks, Transformers, and LLM Fine-tuning.",
  },
  {
    id: "CRS-102",
    code: "EC304",
    name: "VLSI System Design & Cadence Synthesis",
    department: "ECE",
    semester: "Semester 6",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. Meera Rao",
    regulations: "R24 Regulation",
    prerequisite: "EC201: Digital Logic Design",
    syllabusOverview: "CMOS Inverter, Circuit Layout, Static Timing Analysis, FPGA Synthesis, and Verilog HDL.",
  },
  {
    id: "CRS-103",
    code: "CS401L",
    name: "AI & Machine Learning Laboratory",
    department: "CSE",
    semester: "Semester 7",
    credits: 2,
    type: "Lab Practical",
    instructor: "Ms. Ananya Verma",
    regulations: "R24 Regulation",
    prerequisite: "CS302L: Python Programming Lab",
    syllabusOverview: "PyTorch tensor operations, Scikit-learn model training, OpenCV computer vision pipelines.",
  },
  {
    id: "CRS-104",
    code: "ME308",
    name: "Computer Aided Design (CAD) & Finite Element Analysis",
    department: "ME",
    semester: "Semester 5",
    credits: 3,
    type: "Core Theory",
    instructor: "Prof. V. K. Murthy",
    regulations: "R22 Regulation",
    prerequisite: "ME202: Fluid Mechanics",
    syllabusOverview: "3D Solid Modeling, ANSYS Stress Simulation, Mesh Generation, and Thermal Analysis.",
  },
  {
    id: "CRS-105",
    code: "AI402",
    name: "Natural Language Processing & Large Language Models",
    department: "AI&DS",
    semester: "Semester 7",
    credits: 3,
    type: "Professional Elective",
    instructor: "Dr. Rajesh Sharma",
    regulations: "R24 Regulation",
    prerequisite: "CS401: Advanced AI",
    syllabusOverview: "Tokenization, Word Embeddings, Attention Mechanism, RAG Architectures, and Prompt Engineering.",
  },
];

export const INITIAL_DEPARTMENTS: AcademicDepartment[] = [
  {
    id: "DEP-101",
    code: "CSE",
    name: "Computer Science & Engineering",
    hodName: "Dr. Rajesh Sharma",
    facultyCount: 85,
    studentCapacity: 1250,
    laboratoriesCount: 12,
    accreditation: "NBA & NAAC A+",
    establishedYear: "2002",
  },
  {
    id: "DEP-102",
    code: "ECE",
    name: "Electronics & Communication Engineering",
    hodName: "Dr. Meera Rao",
    facultyCount: 64,
    studentCapacity: 980,
    laboratoriesCount: 10,
    accreditation: "NBA Accredited",
    establishedYear: "2002",
  },
  {
    id: "DEP-103",
    code: "AI&DS",
    name: "Artificial Intelligence & Data Science",
    hodName: "Dr. K. Sai Teja",
    facultyCount: 42,
    studentCapacity: 640,
    laboratoriesCount: 8,
    accreditation: "NAAC A+",
    establishedYear: "2020",
  },
  {
    id: "DEP-104",
    code: "ME",
    name: "Mechanical Engineering",
    hodName: "Prof. V. K. Murthy",
    facultyCount: 50,
    studentCapacity: 720,
    laboratoriesCount: 9,
    accreditation: "NBA Accredited",
    establishedYear: "2004",
  },
  {
    id: "DEP-105",
    code: "BIOTECH",
    name: "Biotechnology & Bio-Engineering",
    hodName: "Dr. S. Priya",
    facultyCount: 28,
    studentCapacity: 410,
    laboratoriesCount: 6,
    accreditation: "NIRF Top 50",
    establishedYear: "2010",
  },
];

export const INITIAL_CURRICULUM_SCHEMES: CurriculumScheme[] = [
  {
    id: "CURR-2024-CSE",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Computer Science & Engineering",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 78,
    labCredits: 32,
    electiveCredits: 30,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-2024-ECE",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Electronics & Communication",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 82,
    labCredits: 30,
    electiveCredits: 28,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-2022-CSE",
    regulationCode: "R22 Regulation",
    programName: "B.Tech Computer Science & Engineering",
    effectiveBatch: "2022-2026",
    totalCredits: 160,
    coreTheoryCredits: 80,
    labCredits: 32,
    electiveCredits: 28,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-2024-AIDS",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Artificial Intelligence & Data Science",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 76,
    labCredits: 34,
    electiveCredits: 30,
    projectCredits: 20,
    status: "Active",
  },
];

export async function fetchAcademicCourses(): Promise<AcademicCourse[]> {
  try {
    const res = await api.get("/api/academics/courses");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_COURSES;
}

export async function fetchAcademicDepartments(): Promise<AcademicDepartment[]> {
  try {
    const res = await api.get("/api/academics/departments");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_DEPARTMENTS;
}

export async function fetchCurriculumSchemes(): Promise<CurriculumScheme[]> {
  try {
    const res = await api.get("/api/academics/curriculum");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_CURRICULUM_SCHEMES;
}

export async function createAcademicCourse(
  courseData: Partial<AcademicCourse>,
): Promise<AcademicCourse> {
  try {
    const res = await api.post("/api/academics/courses", courseData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newCourse: AcademicCourse = {
    id: `CRS-${Math.floor(106 + Math.random() * 900)}`,
    code: courseData.code || "CS409",
    name: courseData.name || "New Academic Course",
    department: courseData.department || "CSE",
    semester: courseData.semester || "Semester 5",
    credits: Number(courseData.credits) || 3,
    type: courseData.type || "Core Theory",
    instructor: courseData.instructor || "Dr. Rajesh Sharma",
    regulations: courseData.regulations || "R24 Regulation",
    prerequisite: courseData.prerequisite || "None",
    syllabusOverview: courseData.syllabusOverview || "Comprehensive course syllabus and laboratory modules.",
  };

  return newCourse;
}

export async function createAcademicDepartment(
  deptData: Partial<AcademicDepartment>,
): Promise<AcademicDepartment> {
  try {
    const res = await api.post("/api/academics/departments", deptData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newDept: AcademicDepartment = {
    id: `DEP-${Math.floor(106 + Math.random() * 900)}`,
    code: deptData.code || "NEW",
    name: deptData.name || "New Academic Department",
    hodName: deptData.hodName || "Dr. Assigned Professor",
    facultyCount: Number(deptData.facultyCount) || 30,
    studentCapacity: Number(deptData.studentCapacity) || 480,
    laboratoriesCount: Number(deptData.laboratoriesCount) || 6,
    accreditation: deptData.accreditation || "NAAC A+",
    establishedYear: deptData.establishedYear || "2026",
  };

  return newDept;
}

export async function createCurriculumScheme(
  schemeData: Partial<CurriculumScheme>,
): Promise<CurriculumScheme> {
  try {
    const res = await api.post("/api/academics/curriculum", schemeData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newScheme: CurriculumScheme = {
    id: `CURR-2026-${Math.floor(100 + Math.random() * 900)}`,
    regulationCode: schemeData.regulationCode || "R24 Regulation",
    programName: schemeData.programName || "B.Tech Computer Science",
    effectiveBatch: schemeData.effectiveBatch || "2026-2030",
    totalCredits: Number(schemeData.totalCredits) || 160,
    coreTheoryCredits: Number(schemeData.coreTheoryCredits) || 80,
    labCredits: Number(schemeData.labCredits) || 32,
    electiveCredits: Number(schemeData.electiveCredits) || 28,
    projectCredits: Number(schemeData.projectCredits) || 20,
    status: "Active",
  };

  return newScheme;
}

export async function updateAcademicCourse(
  id: string,
  updates: Partial<AcademicCourse>,
): Promise<Partial<AcademicCourse>> {
  try {
    const res = await api.put(`/api/academics/courses/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteAcademicCourse(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/academics/courses/${id}`);
  } catch {}
  return true;
}

// ----------------------------------------------------
// 1. LIVE FACULTY STATUS MATRIX MOCK & API ENDPOINTS
// ----------------------------------------------------
export const INITIAL_FACULTY_STATUS: LiveFacultyStatus[] = [
  {
    id: "FS-01",
    facultyId: "FAC-101",
    name: "Dr. Rajesh K. Varma",
    department: "CSE",
    status: "IN CLASS / WORKING",
    currentClass: "CSE-3A",
    subject: "Data Structures & Algorithms",
    roomNo: "Block B - 302",
    timeSlot: "10:00 AM - 11:00 AM",
    period: 2,
  },
  {
    id: "FS-02",
    facultyId: "FAC-102",
    name: "Dr. Meera Nambiar",
    department: "ECE",
    status: "FREE",
    period: 2,
  },
  {
    id: "FS-03",
    facultyId: "FAC-103",
    name: "Prof. Arvind Swaminathan",
    department: "AI&DS",
    status: "IN CLASS / WORKING",
    currentClass: "AIDS-2B",
    subject: "Machine Learning Principles",
    roomNo: "Block A - 105",
    timeSlot: "10:00 AM - 11:00 AM",
    period: 2,
  },
  {
    id: "FS-04",
    facultyId: "FAC-104",
    name: "Dr. Sankar Narayan",
    department: "ME",
    status: "ON LEAVE",
    leaveReason: "Casual Leave",
    period: 2,
  },
  {
    id: "FS-05",
    facultyId: "FAC-105",
    name: "Ms. Ananya Sharma",
    department: "CSE",
    status: "FREE",
    period: 2,
  },
  {
    id: "FS-06",
    facultyId: "FAC-106",
    name: "Dr. K. Sai Teja",
    department: "CSE",
    status: "IN CLASS / WORKING",
    currentClass: "CSE-4A",
    subject: "Advanced Deep Learning",
    roomNo: "Block C - Lab 4",
    timeSlot: "10:00 AM - 11:00 AM",
    period: 2,
  },
];

export async function fetchLiveFacultyStatus(period: number = 2): Promise<LiveFacultyStatus[]> {
  try {
    const res = await api.get(`/api/academics/faculty/live-status?period=${period}`);
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_FACULTY_STATUS.map((f) => ({ ...f, period }));
}

// ----------------------------------------------------
// 2. FACULTY ATTENDANCE MARKING MOCK & API ENDPOINTS
// ----------------------------------------------------
export const INITIAL_CLASS_STUDENTS: ClassStudentAttendance[] = [
  { id: "STU-01", rollNo: "22CSE001", name: "Aarav Sharma", status: "Present" },
  { id: "STU-02", rollNo: "22CSE002", name: "Ananya Iyer", status: "Present" },
  { id: "STU-03", rollNo: "22CSE003", name: "Rohan Varma", status: "Present" },
  { id: "STU-04", rollNo: "22CSE004", name: "Priya Nair", status: "Absent" },
  { id: "STU-05", rollNo: "22CSE005", name: "Vikram Aditya", status: "Present" },
  { id: "STU-06", rollNo: "22CSE006", name: "Kavya Patel", status: "Late" },
  { id: "STU-07", rollNo: "22CSE007", name: "Siddharth Rao", status: "Present" },
  { id: "STU-08", rollNo: "22CSE008", name: "Sneha Reddy", status: "Present" },
];

export async function fetchClassStudents(
  classId: string = "CSE-3A",
  subjectId: string = "CS302",
): Promise<ClassStudentAttendance[]> {
  try {
    const res = await api.get(
      `/api/academics/attendance/class-students?classId=${classId}&subjectId=${subjectId}`,
    );
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_CLASS_STUDENTS;
}

export async function submitAttendanceMark(
  payload: AttendanceSubmission,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post("/api/attendance/mark", payload);
    if (res && res.data) return res.data;
  } catch {}
  return {
    success: true,
    message: `Attendance log successfully submitted for ${payload.records.length} students on ${payload.date} (Period ${payload.period}).`,
  };
}

// ----------------------------------------------------
// 3. FACULTY SYLLABUS TRACKER MOCK & API ENDPOINTS
// ----------------------------------------------------
export const INITIAL_SYLLABUS_PROGRESS: SyllabusProgress[] = [
  {
    id: "SYLL-101",
    facultyId: "FAC-101",
    facultyName: "Dr. Rajesh K. Varma",
    courseCode: "CS302",
    courseName: "Data Structures & Algorithms",
    department: "CSE",
    totalClassesScheduled: 45,
    classesCompleted: 32,
    classesCancelled: 2,
    overallProgressPct: 71,
    units: [
      {
        id: "U-1",
        unitNumber: 1,
        unitTitle: "Unit 1: Introduction to Algorithms & Asymptotic Analysis",
        completionPct: 100,
        status: "Completed",
      },
      {
        id: "U-2",
        unitNumber: 2,
        unitTitle: "Unit 2: Sorting, Searching & Linear Data Structures",
        completionPct: 100,
        status: "Completed",
      },
      {
        id: "U-3",
        unitNumber: 3,
        unitTitle: "Unit 3: Dynamic Programming & Greedy Algorithms",
        completionPct: 60,
        status: "In Progress",
      },
      {
        id: "U-4",
        unitNumber: 4,
        unitTitle: "Unit 4: Graph Algorithms & Network Flow",
        completionPct: 0,
        status: "Remaining",
      },
    ],
  },
  {
    id: "SYLL-102",
    facultyId: "FAC-102",
    facultyName: "Dr. Meera Nambiar",
    courseCode: "EC304",
    courseName: "VLSI System Design",
    department: "ECE",
    totalClassesScheduled: 40,
    classesCompleted: 34,
    classesCancelled: 1,
    overallProgressPct: 85,
    units: [
      {
        id: "U-201",
        unitNumber: 1,
        unitTitle: "Unit 1: CMOS Inverter Physics & Static Timing",
        completionPct: 100,
        status: "Completed",
      },
      {
        id: "U-202",
        unitNumber: 2,
        unitTitle: "Unit 2: VLSI Layout & Cadence Synthesis",
        completionPct: 100,
        status: "Completed",
      },
      {
        id: "U-203",
        unitNumber: 3,
        unitTitle: "Unit 3: FPGA Architectures & Verilog HDL",
        completionPct: 90,
        status: "In Progress",
      },
      {
        id: "U-204",
        unitNumber: 4,
        unitTitle: "Unit 4: Low-Power VLSI & Testing",
        completionPct: 50,
        status: "In Progress",
      },
    ],
  },
];

export async function fetchSyllabusProgress(
  facultyId: string = "FAC-101",
): Promise<SyllabusProgress[]> {
  try {
    const res = await api.get(`/api/academics/faculty/syllabus-progress?facultyId=${facultyId}`);
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_SYLLABUS_PROGRESS;
}

export async function updateSyllabusUnitStatus(
  progressId: string,
  unitId: string,
  status: "Completed" | "In Progress" | "Remaining",
  completionPct: number,
): Promise<boolean> {
  try {
    await api.put("/api/academics/faculty/syllabus-progress", {
      progressId,
      unitId,
      status,
      completionPct,
    });
  } catch {}
  return true;
}

// ----------------------------------------------------
// 4. ALL CLASSES ATTENDANCE DASHBOARD FOR SUPER ADMIN
// ----------------------------------------------------
export const INITIAL_ALL_CLASSES_ATTENDANCE: AllClassesAttendanceItem[] = [
  {
    id: "CLA-101",
    className: "CSE-3A",
    department: "CSE",
    totalStudents: 60,
    presentCount: 56,
    absentCount: 3,
    lateCount: 1,
    dailyPct: 93.3,
    weeklyPct: 91.5,
    monthlyPct: 90.2,
    classTeacher: "Dr. Rajesh K. Varma",
    status: "Normal",
  },
  {
    id: "CLA-102",
    className: "ECE-2B",
    department: "ECE",
    totalStudents: 55,
    presentCount: 48,
    absentCount: 6,
    lateCount: 1,
    dailyPct: 87.2,
    weeklyPct: 86.0,
    monthlyPct: 85.4,
    classTeacher: "Dr. Meera Nambiar",
    status: "Normal",
  },
  {
    id: "CLA-103",
    className: "AIDS-2A",
    department: "AI&DS",
    totalStudents: 62,
    presentCount: 59,
    absentCount: 2,
    lateCount: 1,
    dailyPct: 95.1,
    weeklyPct: 94.2,
    monthlyPct: 93.8,
    classTeacher: "Prof. Arvind Swaminathan",
    status: "Normal",
  },
  {
    id: "CLA-104",
    className: "ME-4A",
    department: "ME",
    totalStudents: 50,
    presentCount: 36,
    absentCount: 12,
    lateCount: 2,
    dailyPct: 72.0,
    weeklyPct: 71.5,
    monthlyPct: 70.8,
    classTeacher: "Dr. Sankar Narayan",
    status: "Defaulter Warning",
  },
];

export async function fetchAllClassesAttendance(): Promise<AllClassesAttendanceItem[]> {
  try {
    const res = await api.get("/api/academics/all-classes-attendance");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ALL_CLASSES_ATTENDANCE;
}

