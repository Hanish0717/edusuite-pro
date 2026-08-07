import api from "@/lib/api";

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  type: "Core Theory" | "Lab Practical" | "Professional Elective" | "Project Work";
  instructor: string; // Faculty Assigned
  regulations: string;
  prerequisite?: string; // Prerequisite Subjects
  syllabusOverview?: string;
  theoryHours?: number;
  practicalHours?: number;
  status?: "Active" | "Draft" | "Archived";
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

// 1. EXTENDED DEPARTMENT MOCK DATA ROSTER
export const ALL_MOCK_COURSES: AcademicCourse[] = [
  // Computer Science & Engineering (CSE)
  {
    id: "CRS-CSE-001",
    code: "CS101",
    name: "Introduction to Computer Programming",
    department: "CSE",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Ravi Kumar",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Intro to C Programming, variables, loops, arrays, functions, and structured coding styles.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CSE-002",
    code: "CS201",
    name: "Data Structures & Algorithm Design",
    department: "CSE",
    semester: "Semester 3",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. K. Sai Teja",
    regulations: "R24 Regulation",
    prerequisite: "CS101: Computer Programming",
    syllabusOverview: "Binary trees, graphs, sorting, searching algorithms, stacks, queues, and complexity analysis.",
    theoryHours: 4,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CSE-003",
    code: "CS201L",
    name: "Data Structures Laboratory",
    department: "CSE",
    semester: "Semester 3",
    credits: 2,
    type: "Lab Practical",
    instructor: "Ms. Ananya Verma",
    regulations: "R24 Regulation",
    prerequisite: "CS101: Computer Programming",
    syllabusOverview: "Hands-on implementation of trees, stacks, graphs, search algorithms using PyTorch and C++.",
    theoryHours: 0,
    practicalHours: 4,
    status: "Active",
  },
  {
    id: "CRS-CSE-004",
    code: "CS301",
    name: "Database Management Systems (DBMS)",
    department: "CSE",
    semester: "Semester 5",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Rajesh Sharma",
    regulations: "R22 Regulation",
    prerequisite: "CS201: Data Structures",
    syllabusOverview: "Relational algebra, SQL queries, transaction management, Normalization, and Indexing details.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CSE-005",
    code: "CS401",
    name: "Advanced AI & Deep Learning Models",
    department: "CSE",
    semester: "Semester 7",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. K. Sai Teja",
    regulations: "R24 Regulation",
    prerequisite: "CS201: Data Structures",
    syllabusOverview: "Neural networks backpropagation, CNNs, Transformers, NLP architectures, and LLMs.",
    theoryHours: 4,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CSE-006",
    code: "CS402",
    name: "Natural Language Processing (NLP)",
    department: "CSE",
    semester: "Semester 7",
    credits: 3,
    type: "Professional Elective",
    instructor: "Dr. Rajesh Sharma",
    regulations: "R24 Regulation",
    prerequisite: "CS401: Advanced AI",
    syllabusOverview: "Tokenization, attention weights, fine-tuning pre-trained models, and RAG architectures.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CSE-007",
    code: "CS499",
    name: "Major Capstone Project R&D",
    department: "CSE",
    semester: "Semester 8",
    credits: 6,
    type: "Project Work",
    instructor: "Dr. Ravi Kumar",
    regulations: "R24 Regulation",
    prerequisite: "All Core subjects",
    syllabusOverview: "Full project lifecycle development, paper publication, and prototype demonstrations.",
    theoryHours: 0,
    practicalHours: 12,
    status: "Active",
  },

  // Electronics & Communication Engineering (ECE)
  {
    id: "CRS-ECE-001",
    code: "EC101",
    name: "Semiconductor Physics & Devices",
    department: "ECE",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Amit Verma",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Diode characteristics, BJT modeling, MOSFET, and energy band structures.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-ECE-002",
    code: "EC201",
    name: "Digital Logic Design & Circuits",
    department: "ECE",
    semester: "Semester 3",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Meera Rao",
    regulations: "R24 Regulation",
    prerequisite: "EC101: Semiconductor Devices",
    syllabusOverview: "K-maps, combinational circuits, sequential flip-flops, and state machines design.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-ECE-003",
    code: "EC302",
    name: "Microprocessor & Embedded Systems",
    department: "ECE",
    semester: "Semester 5",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. Amit Verma",
    regulations: "R22 Regulation",
    prerequisite: "EC201: Digital Logic",
    syllabusOverview: "Intel 8086 architecture, assembly language programming, interfacing, and ARM controllers.",
    theoryHours: 3,
    practicalHours: 2,
    status: "Active",
  },
  {
    id: "CRS-ECE-004",
    code: "EC304",
    name: "VLSI System Design & Synthesis",
    department: "ECE",
    semester: "Semester 6",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. Meera Rao",
    regulations: "R24 Regulation",
    prerequisite: "EC201: Digital Logic",
    syllabusOverview: "Cadence digital flow, CMOS inverter timing layouts, FPGA synthesis, and Verilog HDL.",
    theoryHours: 4,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-ECE-005",
    code: "EC401",
    name: "Wireless Sensor Communications",
    department: "ECE",
    semester: "Semester 7",
    credits: 3,
    type: "Professional Elective",
    instructor: "Dr. Amit Verma",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Antenna arrays, LTE/5G propagation standards, MIMO systems, and path loss models.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },

  // Electrical & Electronics Engineering (EEE)
  {
    id: "CRS-EEE-001",
    code: "EE101",
    name: "Basic Electrical Network Theory",
    department: "EEE",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. S. N. Singh",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "KCL, KVL, Thevenin, Norton network theorems, transient state analysis, and AC circuits.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-EEE-002",
    code: "EE201",
    name: "AC & DC Electrical Machines",
    department: "EEE",
    semester: "Semester 3",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. S. N. Singh",
    regulations: "R24 Regulation",
    prerequisite: "EE101: Network Theory",
    syllabusOverview: "Transformers, DC generator characteristics, synchronous motors, and three-phase induction.",
    theoryHours: 3,
    practicalHours: 2,
    status: "Active",
  },
  {
    id: "CRS-EEE-003",
    code: "EE301",
    name: "Power System Transmission & Grid",
    department: "EEE",
    semester: "Semester 5",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. S. N. Singh",
    regulations: "R22 Regulation",
    prerequisite: "EE201: Electrical Machines",
    syllabusOverview: "Load flow analyses, substation modeling, fault analyses, and smart grid systems.",
    theoryHours: 4,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-EEE-004",
    code: "EE401",
    name: "Renewable Wind & Solar Energy",
    department: "EEE",
    semester: "Semester 7",
    credits: 3,
    type: "Professional Elective",
    instructor: "Dr. S. N. Singh",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Photovoltaic cells, wind turbogenerator designs, battery grids, and converter schemes.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },

  // Mechanical Engineering (ME)
  {
    id: "CRS-ME-001",
    code: "ME101",
    name: "Engineering Graphics & Design Drafting",
    department: "ME",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. H. P. Sharma",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Orthographic projections, isometric views, sectioning, and basic CAD drawing templates.",
    theoryHours: 2,
    practicalHours: 2,
    status: "Active",
  },
  {
    id: "CRS-ME-002",
    code: "ME201",
    name: "Thermodynamics & Heat Transfer",
    department: "ME",
    semester: "Semester 3",
    credits: 3,
    type: "Core Theory",
    instructor: "Prof. V. K. Murthy",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "First and second laws of thermo, entropy, Rankine cycle, Carnot efficiency, and conduction.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-ME-003",
    code: "ME308",
    name: "Computer Aided Design & FEA Analysis",
    department: "ME",
    semester: "Semester 5",
    credits: 3,
    type: "Core Theory",
    instructor: "Prof. V. K. Murthy",
    regulations: "R22 Regulation",
    prerequisite: "None",
    syllabusOverview: "3D solid modeling equations, stress analyses, mesh elements generation, and ANSYS solver.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-ME-004",
    code: "ME401",
    name: "Robotics & Smart Manufacturing",
    department: "ME",
    semester: "Semester 7",
    credits: 3,
    type: "Professional Elective",
    instructor: "Dr. H. P. Sharma",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Kinematics of manipulators, CNC codes, automated assembly configurations, and AGVs.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },

  // Civil Engineering (Civil)
  {
    id: "CRS-CE-001",
    code: "CE101",
    name: "Basic Land Surveying & Levelling",
    department: "Civil",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. R. K. Mittal",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Theodolite surveying, chain survey, contour mapping, GPS coordinates, and total station.",
    theoryHours: 2,
    practicalHours: 2,
    status: "Active",
  },
  {
    id: "CRS-CE-002",
    code: "CE201",
    name: "Strength of Structural Materials",
    department: "Civil",
    semester: "Semester 3",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. R. K. Mittal",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Shear force, bending moments, stress-strain curves, deflection of beams, and columns buckling.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-CE-003",
    code: "CE301",
    name: "Geotechnical & Soil Engineering",
    department: "Civil",
    semester: "Semester 5",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. R. K. Mittal",
    regulations: "R22 Regulation",
    prerequisite: "CE201: Strength of Materials",
    syllabusOverview: "Soil compaction, bearing capacity, shallow foundations, shear strength, and seepage analysis.",
    theoryHours: 3,
    practicalHours: 2,
    status: "Active",
  },
  {
    id: "CRS-CE-004",
    code: "CE401",
    name: "Design of Reinforced Concrete Structures",
    department: "Civil",
    semester: "Semester 7",
    credits: 4,
    type: "Core Theory",
    instructor: "Dr. R. K. Mittal",
    regulations: "R24 Regulation",
    prerequisite: "CE201: Strength of Materials",
    syllabusOverview: "Limit state design of beams, columns, slabs, and shear reinforcement calculations.",
    theoryHours: 4,
    practicalHours: 0,
    status: "Active",
  },

  // Master of Business Administration (MBA)
  {
    id: "CRS-MBA-001",
    code: "MB101",
    name: "Principles of Management & Organization",
    department: "MBA",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Neha Kapoor",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Managerial planning, leadership styles, corporate social responsibility, and strategic control.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-MBA-002",
    code: "MB102",
    name: "Managerial Accounting & Economics",
    department: "MBA",
    semester: "Semester 1",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Neha Kapoor",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Balance sheets, cost accounting ratios, elasticity of demand, and market structures.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-MBA-003",
    code: "MB201",
    name: "Corporate Financial Systems",
    department: "MBA",
    semester: "Semester 2",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Neha Kapoor",
    regulations: "R24 Regulation",
    prerequisite: "MB102: Managerial Accounting",
    syllabusOverview: "Capital budgeting, working capital control, stock valuations, and cost of capital.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-MBA-004",
    code: "MB301",
    name: "Strategic HR Management",
    department: "MBA",
    semester: "Semester 3",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Neha Kapoor",
    regulations: "R22 Regulation",
    prerequisite: "None",
    syllabusOverview: "Performance appraisals, hiring grids, compensation design, and labor laws.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
  {
    id: "CRS-MBA-005",
    code: "MB401",
    name: "Business Ethics & Corporate Governance",
    department: "MBA",
    semester: "Semester 4",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. Neha Kapoor",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "Corporate compliance models, whistleblowing, ethical dilemmas, and CSR models.",
    theoryHours: 3,
    practicalHours: 0,
    status: "Active",
  },
];

export const INITIAL_DEPARTMENTS: AcademicDepartment[] = [
  {
    id: "DEP-101",
    code: "CSE",
    name: "Computer Science & Engineering (CSE)",
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
    name: "Electronics & Communication Engineering (ECE)",
    hodName: "Dr. Amit Verma",
    facultyCount: 64,
    studentCapacity: 980,
    laboratoriesCount: 10,
    accreditation: "NBA Accredited",
    establishedYear: "2002",
  },
  {
    id: "DEP-103",
    code: "EEE",
    name: "Electrical & Electronics Engineering (EEE)",
    hodName: "Dr. S. N. Singh",
    facultyCount: 45,
    studentCapacity: 620,
    laboratoriesCount: 8,
    accreditation: "NAAC A+",
    establishedYear: "2003",
  },
  {
    id: "DEP-104",
    code: "ME",
    name: "Mechanical Engineering (ME)",
    hodName: "Dr. H. P. Sharma",
    facultyCount: 50,
    studentCapacity: 720,
    laboratoriesCount: 9,
    accreditation: "NBA Accredited",
    establishedYear: "2004",
  },
  {
    id: "DEP-105",
    code: "Civil",
    name: "Civil Engineering",
    hodName: "Dr. R. K. Mittal",
    facultyCount: 35,
    studentCapacity: 480,
    laboratoriesCount: 7,
    accreditation: "NAAC A+",
    establishedYear: "2005",
  },
  {
    id: "DEP-106",
    code: "MBA",
    name: "Master of Business Administration (MBA)",
    hodName: "Dr. Neha Kapoor",
    facultyCount: 24,
    studentCapacity: 320,
    laboratoriesCount: 2,
    accreditation: "NAAC A+",
    establishedYear: "2006",
  },
];

// 2. EXTENDED CURRICULUM MOCK DATA ROSTER
export const ALL_CURRICULUM_SCHEMES: CurriculumScheme[] = [
  {
    id: "CURR-R24-CSE",
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
    id: "CURR-R24-ECE",
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
    id: "CURR-R24-EEE",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Electrical & Electronics",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 80,
    labCredits: 32,
    electiveCredits: 28,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-R24-ME",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Mechanical Engineering",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 84,
    labCredits: 28,
    electiveCredits: 28,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-R24-CIVIL",
    regulationCode: "R24 Regulation",
    programName: "B.Tech Civil Engineering",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 80,
    labCredits: 32,
    electiveCredits: 28,
    projectCredits: 20,
    status: "Active",
  },
  {
    id: "CURR-R24-MBA",
    regulationCode: "R24 Regulation",
    programName: "Master of Business Administration",
    effectiveBatch: "2024-2026",
    totalCredits: 90,
    coreTheoryCredits: 50,
    labCredits: 10,
    electiveCredits: 20,
    projectCredits: 10,
    status: "Active",
  },
];

export const INITIAL_COURSES = ALL_MOCK_COURSES;
export const INITIAL_CURRICULUM_SCHEMES = ALL_CURRICULUM_SCHEMES;

// 3. GETSUBJECTS WITH DELAY & FILTERS
export interface GetSubjectsParams {
  department: string;
  semester?: string;
  search?: string;
  filters?: {
    type?: string;
    credits?: number;
    status?: string;
    instructor?: string;
  };
  page?: number;
  limit?: number;
}

export async function getSubjects(params: GetSubjectsParams): Promise<AcademicCourse[]> {
  try {
    const query = new URLSearchParams();
    query.set("department", params.department);
    if (params.semester) query.set("semester", params.semester);
    if (params.search) query.set("search", params.search);
    const res = await api.get(`/api/academic/subjects?${query.toString()}`);
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = ALL_MOCK_COURSES.filter((c) => c.department === params.department);

      if (params.semester && params.semester !== "All Semesters") {
        filtered = filtered.filter((c) => c.semester === params.semester);
      }

      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            c.code.toLowerCase().includes(s) ||
            c.instructor.toLowerCase().includes(s)
        );
      }

      if (params.filters) {
        const { type, credits, status, instructor } = params.filters;
        if (type && type !== "All Types") {
          filtered = filtered.filter((c) => c.type === type);
        }
        if (credits) {
          filtered = filtered.filter((c) => c.credits === credits);
        }
        if (status) {
          filtered = filtered.filter((c) => c.status === status);
        }
        if (instructor) {
          filtered = filtered.filter((c) => c.instructor === instructor);
        }
      }

      if (params.page && params.limit) {
        const start = (params.page - 1) * params.limit;
        filtered = filtered.slice(start, start + params.limit);
      }

      resolve(filtered);
    }, 300);
  });
}

// 4. GETCURRICULUM WITH DELAY
export async function getCurriculum(department: string): Promise<CurriculumScheme[]> {
  try {
    const res = await api.get(`/api/academic/curriculum?department=${department}`);
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const filtered = ALL_CURRICULUM_SCHEMES.filter((s) => s.id.toUpperCase().includes(code.toUpperCase()));
      resolve(filtered);
    }, 300);
  });
}

export async function fetchAcademicCourses(): Promise<AcademicCourse[]> {
  try {
    const res = await api.get("/api/academics/courses");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return ALL_MOCK_COURSES;
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
  return ALL_CURRICULUM_SCHEMES;
}

export async function createAcademicCourse(
  courseData: Partial<AcademicCourse>,
): Promise<AcademicCourse> {
  try {
    const res = await api.post("/api/academic/subjects", courseData);
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
    theoryHours: Number(courseData.theoryHours) || 3,
    practicalHours: Number(courseData.practicalHours) || 0,
    status: courseData.status || "Active",
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
    const res = await api.post("/api/academic/curriculum", schemeData);
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
    const res = await api.put(`/api/academic/subjects/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteAcademicCourse(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/academic/subjects/${id}`);
  } catch {}
  return true;
}
