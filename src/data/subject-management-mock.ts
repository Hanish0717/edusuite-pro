export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  department: string;
  program: "B.Tech" | "M.Tech" | "MBA" | "B.Sc";
  regulation: "R22" | "R25" | "R26";
  semester: string;
  credits: number;
  theoryHours: number;
  labHours: number;
  subjectType: "Core" | "Elective" | "Laboratory";
  facultyId: string; // assigned primary faculty id
  facultyName: string; // primary faculty name
  alternateFacultyId?: string; // secondary primary
  alternateFacultyName?: string;
  courseOutcomes: string[]; // CO1 to CO6
  prerequisites: string[]; // prerequisite subject codes
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    subjectCode: "CS801",
    subjectName: "Advanced Cryptography",
    description: "Studies mathematical fundamentals, symmetric/asymmetric encryptions, block ciphers, signature schemes, and zero-knowledge proofs.",
    department: "CSE",
    program: "B.Tech",
    regulation: "R25",
    semester: "Semester 5",
    credits: 4,
    theoryHours: 4,
    labHours: 0,
    subjectType: "Core",
    facultyId: "fac-1",
    facultyName: "Dr. Ravi Kumar",
    alternateFacultyId: "fac-3",
    alternateFacultyName: "Dr. S. K. Gupta",
    courseOutcomes: [
      "CO1: Formulate number-theoretic concepts used in cryptographic algorithms.",
      "CO2: Analyze symmetric cipher frameworks and block cipher patterns.",
      "CO3: Build message authentication codes and public-key infrastructure logs.",
      "CO4: Implement secure hash standards and elliptic curve signatures.",
      "CO5: Identify zero-knowledge verification protocols in distributed security.",
      "CO6: Solve real-world channel routing vulnerabilities with modern ciphers."
    ],
    prerequisites: ["CS302 (Discrete Mathematics)", "CS404 (Data Structures)"],
    status: "active",
    createdAt: "2025-10-15",
    updatedAt: "2026-03-01"
  },
  {
    id: "sub-2",
    subjectCode: "EE402",
    subjectName: "Control Systems",
    description: "Deals with mathematical modeling of physical systems, block diagram reductions, time domain outputs, frequency analysis, and controller tuning.",
    department: "EEE",
    program: "B.Tech",
    regulation: "R22",
    semester: "Semester 5",
    credits: 4,
    theoryHours: 3,
    labHours: 2,
    subjectType: "Laboratory",
    facultyId: "fac-4",
    facultyName: "Prof. Vikram Malhotra",
    courseOutcomes: [
      "CO1: Compute transfer functions using block diagrams and Mason gain formulas.",
      "CO2: Check transient response characteristics of first/second order systems.",
      "CO3: Determine absolute stability parameters using Routh-Hurwitz criteria.",
      "CO4: Formulate root locus models for variable loop gain factors.",
      "CO5: Perform frequency response analysis using Bode plots.",
      "CO6: Synthesize PID controllers in closed feedback networks."
    ],
    prerequisites: ["EE301 (Network Theory)"],
    status: "active",
    createdAt: "2024-06-20",
    updatedAt: "2026-02-14"
  },
  {
    id: "sub-3",
    subjectCode: "ME301",
    subjectName: "Thermodynamics",
    description: "Explores energy, entropy, laws of thermodynamics, closed and open system cycles, gas dynamics, and pure substance properties.",
    department: "ME",
    program: "B.Tech",
    regulation: "R22",
    semester: "Semester 3",
    credits: 3,
    theoryHours: 3,
    labHours: 0,
    subjectType: "Core",
    facultyId: "fac-7",
    facultyName: "Prof. Rajesh Sharma",
    courseOutcomes: [
      "CO1: State basic laws of energy transfers and boundaries.",
      "CO2: Apply first law of thermodynamics to steady-state nozzle flows.",
      "CO3: Evaluate Carnot thermal cycles and entropy bounds.",
      "CO4: Formulate equations of state for ideal and real gas blends.",
      "CO5: Read thermodynamic steam tables and Mollier diagrams.",
      "CO6: Calculate gas power cycle efficiencies (Otto, Diesel, Rankine)."
    ],
    prerequisites: ["PH102 (Applied Physics)"],
    status: "active",
    createdAt: "2024-05-10",
    updatedAt: "2026-01-20"
  },
  {
    id: "sub-4",
    subjectCode: "CS903",
    subjectName: "Cloud Infrastructure",
    description: "Details virtualization models, container registries (Docker, Kubernetes), software-defined architectures, and storage provisioning.",
    department: "CSE",
    program: "B.Tech",
    regulation: "R26",
    semester: "Semester 7",
    credits: 3,
    theoryHours: 2,
    labHours: 2,
    subjectType: "Elective",
    facultyId: "Vacant",
    facultyName: "Vacant", // No faculty assigned
    courseOutcomes: [
      "CO1: Categorize cloud service models (IaaS, PaaS, SaaS).",
      "CO2: Configure hypervisors and virtual machine clusters.",
      "CO3: Deploy container nodes via orchestration blueprints.",
      "CO4: Configure block and object storage endpoints.",
      "CO5: Formulate software-defined networks and security filters.",
      "CO6: Compare cost and availability limits across clouds."
    ],
    prerequisites: ["CS502 (Computer Networks)"],
    status: "active",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-15"
  },
  {
    id: "sub-5",
    subjectCode: "HS103",
    subjectName: "Applied Chemistry",
    description: "Introduces polymer chemistry, battery cells, fuel cells, corrosion mitigation, water treatment protocols, and instrumental spectroscopy.",
    department: "H&S",
    program: "B.Tech",
    regulation: "R25",
    semester: "Semester 1",
    credits: 3,
    theoryHours: 3,
    labHours: 0,
    subjectType: "Core",
    facultyId: "fac-6",
    facultyName: "Dr. Sarah Paul",
    courseOutcomes: [
      "CO1: Explain polymer synthesis routes and elastomer designs.",
      "CO2: Compute battery cell EMF levels using Nernst formulas.",
      "CO3: Analyze galvanic corrosion cells and passivation routes.",
      "CO4: Compare municipal water softening methodologies.",
      "CO5: Read molecular vibration transitions in IR spectra.",
      "CO6: Calculate calorific values of alternative gaseous fuels."
    ],
    prerequisites: [],
    status: "active",
    createdAt: "2025-08-01",
    updatedAt: "2026-02-15"
  },
  {
    id: "sub-6",
    subjectCode: "EC601",
    subjectName: "VLSI Circuit Design",
    description: "Covers MOS transistor dynamics, CMOS inverter layouts, clock distributions, memory cells, and digital design automation flows.",
    department: "ECE",
    program: "B.Tech",
    regulation: "R22",
    semester: "Semester 5",
    credits: 4,
    theoryHours: 3,
    labHours: 2,
    subjectType: "Laboratory",
    facultyId: "fac-2",
    facultyName: "Dr. Priya Sen",
    courseOutcomes: [
      "CO1: Formulate threshold voltage models for sub-micron MOSFETs.",
      "CO2: Calculate static and dynamic noise margins of CMOS logic.",
      "CO3: Design transmission gate networks and dynamic selectors.",
      "CO4: Structure clock tree distribution paths to prevent skew.",
      "CO5: Formulate static RAM cell layout schematics.",
      "CO6: Perform RTL synthesis and floorplanning checks."
    ],
    prerequisites: ["EC401 (Analog Circuits)"],
    status: "active",
    createdAt: "2024-06-15",
    updatedAt: "2026-04-10"
  }
];

export const MOCK_PROGRAMS = ["B.Tech", "M.Tech", "MBA", "B.Sc"];
export const MOCK_REGULATIONS = ["R22", "R25", "R26"];
export const MOCK_SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export const MOCK_FACULTY_POOL_FOR_ASSIGN = [
  { id: "fac-1", name: "Dr. Ravi Kumar", department: "CSE", designation: "Professor", workload: 14 },
  { id: "fac-2", name: "Dr. Priya Sen", department: "ECE", designation: "Associate Professor", workload: 16 },
  { id: "fac-3", name: "Dr. S. K. Gupta", department: "CSE", designation: "Professor & HOD", workload: 8 },
  { id: "fac-4", name: "Prof. Vikram Malhotra", department: "EEE", designation: "Professor", workload: 20 },
  { id: "fac-5", name: "Dr. Amit Varma", department: "CSE", designation: "Assistant Professor", workload: 0 },
  { id: "fac-6", name: "Dr. Sarah Paul", department: "H&S", designation: "Associate Professor", workload: 12 },
  { id: "fac-7", name: "Prof. Rajesh Sharma", department: "ME", designation: "Professor", workload: 16 }
];
