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

export async function fetchAcademicCourses(): Promise<AcademicCourse[]> {
  try {
    const res = await api.get("/api/academics/courses");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_COURSES;
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
