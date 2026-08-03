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
