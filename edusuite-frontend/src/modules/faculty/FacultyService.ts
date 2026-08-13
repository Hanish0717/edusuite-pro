import api from "@/lib/api";

export interface TimetableEntry {
  day: string;
  time: string;
  course: string;
  room: string;
}

export interface FacultyRecord {
  id: string;
  empId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: "Professor" | "Associate Professor" | "Assistant Professor" | "Lecturer" | "Visiting Faculty";
  department: string;
  specialization: string;
  qualification: string;
  experience: number; // in years
  teachingLoadHours: number;
  assignedCoursesCount: number;
  assignedSubjectsList: string[];
  attendancePercentage: number;
  status: "Active" | "On Leave" | "Sabbatical";
  joiningDate: string;
  publicationsCount: number;
  performanceRating: string;
  weeklyTimetable: TimetableEntry[];
}

export interface GetFacultyResponse {
  data: FacultyRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FacultyStats {
  totalFaculty: number;
  professors: number;
  associateProfessors: number;
  assistantProfessors: number;
  lecturers: number;
  visitingFaculty: number;
  avgWorkload: number;
  avgAttendance: number;
  totalPublications: number;
}

export const INITIAL_FACULTY: FacultyRecord[] = [
  // CSE Faculty
  {
    id: "FAC-1001",
    empId: "EMP-FAC-012",
    fullName: "Dr. K. Sai Teja",
    email: "saiteja.k@college.edu",
    phone: "+91 9876543210",
    designation: "Professor",
    department: "CSE",
    specialization: "Artificial Intelligence & Neural Networks",
    qualification: "Ph.D. in Computer Science",
    experience: 15,
    teachingLoadHours: 16,
    assignedCoursesCount: 3,
    assignedSubjectsList: ["Artificial Intelligence (CS401)", "Deep Learning (CS452)", "Neural Networks (CS302)"],
    attendancePercentage: 98,
    status: "Active",
    joiningDate: "2018-06-15",
    publicationsCount: 14,
    performanceRating: "Excellent (4.8/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "09:00 - 10:00", course: "AI (CS401)", room: "LH-201" },
      { day: "Wednesday", time: "11:00 - 12:00", course: "Deep Learning", room: "LH-202" },
      { day: "Friday", time: "14:00 - 15:00", course: "Neural Networks", room: "Lab-4" },
    ],
  },
  {
    id: "FAC-1003",
    empId: "EMP-FAC-038",
    fullName: "Ms. Ananya Verma",
    email: "ananya.v@college.edu",
    phone: "+91 9988776655",
    designation: "Assistant Professor",
    department: "CSE",
    specialization: "Computer Vision & PyTorch",
    qualification: "M.Tech in Software Engineering",
    experience: 5,
    teachingLoadHours: 14,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Computer Vision (CS402)", "Python Programming (CS101)"],
    attendancePercentage: 94,
    status: "Active",
    joiningDate: "2021-01-10",
    publicationsCount: 8,
    performanceRating: "Very Good (4.4/5.0)",
    weeklyTimetable: [
      { day: "Tuesday", time: "10:00 - 11:00", course: "Computer Vision", room: "LH-203" },
      { day: "Thursday", time: "13:00 - 14:00", course: "Python Programming", room: "Lab-1" },
    ],
  },
  {
    id: "FAC-1006",
    empId: "EMP-FAC-082",
    fullName: "Dr. Ravi Kumar",
    email: "ravikumar@college.edu",
    phone: "+91 9888223344",
    designation: "Associate Professor",
    department: "CSE",
    specialization: "Cloud Computing & Distributed Systems",
    qualification: "Ph.D. in Cloud Networks",
    experience: 12,
    teachingLoadHours: 18,
    assignedCoursesCount: 3,
    assignedSubjectsList: ["Cloud Architecture (CS305)", "Distributed Systems (CS403)", "Advanced OS (CS204)"],
    attendancePercentage: 95,
    status: "Active",
    joiningDate: "2017-02-14",
    publicationsCount: 18,
    performanceRating: "Excellent (4.7/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "11:00 - 12:00", course: "Cloud Architecture", room: "LH-205" },
      { day: "Wednesday", time: "09:00 - 10:00", course: "Distributed Systems", room: "LH-201" },
      { day: "Thursday", time: "15:00 - 16:00", course: "Advanced OS", room: "LH-202" },
    ],
  },
  {
    id: "FAC-1007",
    empId: "EMP-FAC-090",
    fullName: "Mr. Suresh Babu",
    email: "sureshbabu@college.edu",
    phone: "+91 9123887766",
    designation: "Lecturer",
    department: "CSE",
    specialization: "Data Structures & Java",
    qualification: "M.Tech in CS",
    experience: 3,
    teachingLoadHours: 16,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Data Structures (CS201)", "Java Programming (CS203)"],
    attendancePercentage: 92,
    status: "Active",
    joiningDate: "2023-07-01",
    publicationsCount: 2,
    performanceRating: "Good (4.1/5.0)",
    weeklyTimetable: [
      { day: "Tuesday", time: "09:00 - 10:00", course: "Data Structures", room: "LH-101" },
      { day: "Friday", time: "11:00 - 12:00", course: "Java Programming", room: "Lab-2" },
    ],
  },
  {
    id: "FAC-1008",
    empId: "EMP-FAC-099",
    fullName: "Prof. Alan Turing",
    email: "alanturing@college.edu",
    phone: "+91 9888998877",
    designation: "Visiting Faculty",
    department: "CSE",
    specialization: "Quantum Computing & Cryptography",
    qualification: "Ph.D. in Computer Science",
    experience: 20,
    teachingLoadHours: 8,
    assignedCoursesCount: 1,
    assignedSubjectsList: ["Quantum Computing (CS499)"],
    attendancePercentage: 90,
    status: "Active",
    joiningDate: "2024-01-15",
    publicationsCount: 45,
    performanceRating: "Outstanding (4.9/5.0)",
    weeklyTimetable: [
      { day: "Wednesday", time: "14:00 - 16:00", course: "Quantum Computing", room: "LH-Seminar" },
    ],
  },

  // ECE Faculty
  {
    id: "FAC-1002",
    empId: "EMP-FAC-024",
    fullName: "Dr. Meera Rao",
    email: "meera.rao@college.edu",
    phone: "+91 9123456789",
    designation: "Professor",
    department: "ECE",
    specialization: "VLSI Architecture & Cadence Tools",
    qualification: "Ph.D. in VLSI Systems",
    experience: 16,
    teachingLoadHours: 18,
    assignedCoursesCount: 4,
    assignedSubjectsList: ["VLSI Design (EC301)", "Analog Electronics (EC202)", "Cadence Flow (EC412)", "Embedded Systems (EC305)"],
    attendancePercentage: 95,
    status: "Active",
    joiningDate: "2016-08-20",
    publicationsCount: 11,
    performanceRating: "Excellent (4.6/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "10:00 - 11:00", course: "VLSI Design", room: "LH-104" },
      { day: "Tuesday", time: "14:00 - 15:00", course: "Cadence Flow", room: "VLSI-Lab" },
    ],
  },
  {
    id: "FAC-1009",
    empId: "EMP-FAC-044",
    fullName: "Dr. Amit Verma",
    email: "amitverma@college.edu",
    phone: "+91 9848033445",
    designation: "Professor",
    department: "ECE",
    specialization: "5G Wireless Networks & Signal Processing",
    qualification: "Ph.D. in Wireless Communication",
    experience: 14,
    teachingLoadHours: 14,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Wireless Communication (EC403)", "Signals & Systems (EC201)"],
    attendancePercentage: 97,
    status: "Active",
    joiningDate: "2017-06-10",
    publicationsCount: 15,
    performanceRating: "Excellent (4.7/5.0)",
    weeklyTimetable: [
      { day: "Wednesday", time: "10:00 - 11:00", course: "Wireless Comm", room: "LH-104" },
      { day: "Friday", time: "15:00 - 16:00", course: "Signals & Systems", room: "LH-105" },
    ],
  },
  {
    id: "FAC-1010",
    empId: "EMP-FAC-061",
    fullName: "Mr. Rajesh G.",
    email: "rajeshg@college.edu",
    phone: "+91 9911228833",
    designation: "Assistant Professor",
    department: "ECE",
    specialization: "Microprocessors & Arduino Flow",
    qualification: "M.Tech in Electronics",
    experience: 6,
    teachingLoadHours: 16,
    assignedCoursesCount: 3,
    assignedSubjectsList: ["Microprocessors (EC303)", "Digital Logic (EC102)", "Microcontrollers Lab (EC353)"],
    attendancePercentage: 93,
    status: "Active",
    joiningDate: "2020-11-01",
    publicationsCount: 4,
    performanceRating: "Very Good (4.2/5.0)",
    weeklyTimetable: [
      { day: "Thursday", time: "09:00 - 10:00", course: "Microprocessors", room: "LH-106" },
      { day: "Friday", time: "14:00 - 16:00", course: "Microcontrollers Lab", room: "Micro-Lab" },
    ],
  },

  // EEE Faculty
  {
    id: "FAC-1011",
    empId: "EMP-FAC-019",
    fullName: "Dr. S. N. Singh",
    email: "snsingh@college.edu",
    phone: "+91 9877665544",
    designation: "Professor",
    department: "EEE",
    specialization: "Power Systems & Smart Grid Systems",
    qualification: "Ph.D. in Power Engineering",
    experience: 18,
    teachingLoadHours: 12,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Power Systems (EE301)", "Smart Grid Tech (EE451)"],
    attendancePercentage: 99,
    status: "Active",
    joiningDate: "2014-06-01",
    publicationsCount: 12,
    performanceRating: "Outstanding (4.9/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "14:00 - 15:00", course: "Power Systems", room: "LH-301" },
      { day: "Wednesday", time: "10:00 - 11:00", course: "Smart Grid Tech", room: "LH-302" },
    ],
  },
  {
    id: "FAC-1012",
    empId: "EMP-FAC-075",
    fullName: "Dr. Meenakshi S.",
    email: "meenakshi@college.edu",
    phone: "+91 9900887766",
    designation: "Associate Professor",
    department: "EEE",
    specialization: "Electrical Machines & Control Theory",
    qualification: "Ph.D. in Control Systems",
    experience: 10,
    teachingLoadHours: 16,
    assignedCoursesCount: 3,
    assignedSubjectsList: ["Control Systems (EE204)", "Electrical Machines (EE202)", "Machines Lab (EE252)"],
    attendancePercentage: 94,
    status: "Active",
    joiningDate: "2018-09-01",
    publicationsCount: 9,
    performanceRating: "Very Good (4.5/5.0)",
    weeklyTimetable: [
      { day: "Tuesday", time: "11:00 - 12:00", course: "Control Systems", room: "LH-303" },
      { day: "Thursday", time: "14:00 - 16:00", course: "Machines Lab", room: "Machines-Lab" },
    ],
  },

  // ME Faculty
  {
    id: "FAC-1004",
    empId: "EMP-FAC-055",
    fullName: "Prof. V. K. Murthy",
    email: "vkmurthy@college.edu",
    phone: "+91 9765432109",
    designation: "Associate Professor",
    department: "ME",
    specialization: "CAD Synthesis & Finite Element Analysis",
    qualification: "Ph.D. in Mechanical CAD",
    experience: 19,
    teachingLoadHours: 15,
    assignedCoursesCount: 3,
    assignedSubjectsList: ["CAD Synthesis (ME401)", "Finite Element Analysis (ME403)", "Engineering Drawing (ME101)"],
    attendancePercentage: 94,
    status: "Active",
    joiningDate: "2019-03-01",
    publicationsCount: 8,
    performanceRating: "Very Good (4.4/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "10:00 - 11:00", course: "CAD Synthesis", room: "LH-401" },
      { day: "Tuesday", time: "15:00 - 16:00", course: "FEA", room: "CAD-Lab" },
    ],
  },
  {
    id: "FAC-1013",
    empId: "EMP-FAC-062",
    fullName: "Dr. H. P. Sharma",
    email: "hpsharma@college.edu",
    phone: "+91 9811229988",
    designation: "Professor",
    department: "ME",
    specialization: "Thermodynamics & Thermal Sciences",
    qualification: "Ph.D. in Fluid Dynamics",
    experience: 15,
    teachingLoadHours: 11,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Thermodynamics (ME201)", "Fluid Mechanics (ME203)"],
    attendancePercentage: 98,
    status: "Active",
    joiningDate: "2016-07-01",
    publicationsCount: 10,
    performanceRating: "Excellent (4.7/5.0)",
    weeklyTimetable: [
      { day: "Wednesday", time: "11:00 - 12:00", course: "Thermodynamics", room: "LH-402" },
      { day: "Friday", time: "09:00 - 10:00", course: "Fluid Mechanics", room: "LH-403" },
    ],
  },

  // Civil Faculty
  {
    id: "FAC-1014",
    empId: "EMP-FAC-049",
    fullName: "Dr. R. K. Mittal",
    email: "rkmittal@college.edu",
    phone: "+91 9911335577",
    designation: "Professor",
    department: "Civil",
    specialization: "Structural Engineering & Concrete Tech",
    qualification: "Ph.D. in Structures",
    experience: 16,
    teachingLoadHours: 10,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Concrete Design (CE401)", "Structural Mechanics (CE202)"],
    attendancePercentage: 97,
    status: "Active",
    joiningDate: "2015-08-15",
    publicationsCount: 10,
    performanceRating: "Excellent (4.6/5.0)",
    weeklyTimetable: [
      { day: "Monday", time: "09:00 - 10:00", course: "Concrete Design", room: "LH-501" },
      { day: "Wednesday", time: "11:00 - 12:00", course: "Structural Mechanics", room: "LH-502" },
    ],
  },

  // MBA Faculty
  {
    id: "FAC-1015",
    empId: "EMP-FAC-077",
    fullName: "Dr. Neha Kapoor",
    email: "nehakapoor@college.edu",
    phone: "+91 9899001122",
    designation: "Professor",
    department: "MBA",
    specialization: "Corporate Placements & Strategic HR",
    qualification: "Ph.D. in Business Management",
    experience: 12,
    teachingLoadHours: 16,
    assignedCoursesCount: 2,
    assignedSubjectsList: ["Strategic Management (MB301)", "Organizational Behavior (MB102)"],
    attendancePercentage: 98,
    status: "Active",
    joiningDate: "2018-06-18",
    publicationsCount: 16,
    performanceRating: "Excellent (4.8/5.0)",
    weeklyTimetable: [
      { day: "Tuesday", time: "10:00 - 12:00", course: "Strategic Management", room: "MBA-LH1" },
      { day: "Thursday", time: "14:00 - 15:30", course: "Organizational Behavior", room: "MBA-LH2" },
    ],
  },
];

// STATEFUL LOCAL DATABASE IN-MEMORY FOR CRUD
let localFacultyDatabase = [...INITIAL_FACULTY];

export async function getFaculty(params: {
  department: string;
  search?: string;
  filters?: {
    designation?: string;
    status?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
  };
  sort?: {
    key: keyof FacultyRecord;
    order: "asc" | "desc";
  };
  page?: number;
  limit?: number;
}): Promise<GetFacultyResponse> {
  try {
    const queryParts: string[] = [];
    if (params.department && params.department !== "All Departments") {
      queryParts.push(`department=${encodeURIComponent(params.department)}`);
    }
    if (params.search) {
      queryParts.push(`search=${encodeURIComponent(params.search)}`);
    }
    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    if (params.filters?.designation && params.filters.designation !== "All Designations") {
      queryParts.push(`designation=${encodeURIComponent(params.filters.designation)}`);
    }
    if (params.filters?.status && params.filters.status !== "All Status") {
      queryParts.push(`status=${encodeURIComponent(params.filters.status)}`);
    }

    const res = await api.get(`/api/faculty?${queryParts.join("&")}`);
    if (res && res.data && Array.isArray(res.data.data)) {
      return res.data;
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const code = (params.department === "Mechanical" || params.department === "ME") ? "ME" : params.department;
      
      let results = localFacultyDatabase;
      if (params.department && params.department !== "All Departments") {
        results = localFacultyDatabase.filter(
          (f) => f.department.toLowerCase() === code.toLowerCase()
        );
      }

      if (params.search) {
        const s = params.search.toLowerCase();
        results = results.filter(
          (f) =>
            f.fullName.toLowerCase().includes(s) ||
            f.empId.toLowerCase().includes(s) ||
            f.email.toLowerCase().includes(s) ||
            f.specialization.toLowerCase().includes(s) ||
            f.qualification.toLowerCase().includes(s)
        );
      }

      if (params.filters) {
        const { designation, status, qualification, experience } = params.filters;
        if (designation && designation !== "All Designations") {
          results = results.filter((f) => f.designation === designation);
        }
        if (status && status !== "All Status") {
          results = results.filter((f) => f.status === status);
        }
        if (qualification && qualification !== "All Qualifications") {
          results = results.filter((f) => f.qualification.toLowerCase().includes(qualification.toLowerCase()));
        }
        if (experience && experience !== "All Experience") {
          const matchExp = experience.match(/\d+/);
          if (matchExp) {
            const expVal = parseInt(matchExp[0], 10);
            results = results.filter((f) => f.experience >= expVal);
          }
        }
      }

      const page = params.page || 1;
      const limit = params.limit || 8;
      const total = results.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginatedData = results.slice(start, start + limit);

      resolve({
        data: paginatedData,
        total,
        page,
        limit,
        totalPages,
      });
    }, 200);
  });
}

export async function fetchFacultyStats(department: string): Promise<FacultyStats> {
  try {
    const deptParam = department && department !== "All Departments" ? `?department=${encodeURIComponent(department)}` : "";
    const res = await api.get(`/api/faculty/stats${deptParam}`);
    if (res && res.data && res.data.totalFaculty !== undefined) {
      return res.data;
    }
  } catch {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const deptFaculty = localFacultyDatabase.filter(
        (f) => f.department.toLowerCase() === code.toLowerCase()
      );

      const totalFaculty = deptFaculty.length;
      const professors = deptFaculty.filter((f) => f.designation === "Professor").length;
      const associateProfessors = deptFaculty.filter((f) => f.designation === "Associate Professor").length;
      const assistantProfessors = deptFaculty.filter((f) => f.designation === "Assistant Professor").length;
      const lecturers = deptFaculty.filter((f) => f.designation === "Lecturer").length;
      const visitingFaculty = deptFaculty.filter((f) => f.designation === "Visiting Faculty").length;

      const avgWorkload = totalFaculty > 0
        ? parseFloat((deptFaculty.reduce((sum, f) => sum + f.teachingLoadHours, 0) / totalFaculty).toFixed(1))
        : 0;

      const avgAttendance = totalFaculty > 0
        ? parseFloat((deptFaculty.reduce((sum, f) => sum + f.attendancePercentage, 0) / totalFaculty).toFixed(1))
        : 96;

      const totalPublications = deptFaculty.reduce((sum, f) => sum + f.publicationsCount, 0);

      resolve({
        totalFaculty,
        professors,
        associateProfessors,
        assistantProfessors,
        lecturers,
        visitingFaculty,
        avgWorkload,
        avgAttendance,
        totalPublications,
      });
    }, 200);
  });
}

// REST CRUD Operations
export async function createFacultyRecord(data: Partial<FacultyRecord>): Promise<FacultyRecord> {
  try {
    const res = await api.post("/api/dean/faculty", data);
    if (res && res.data && res.data.id) {
      localFacultyDatabase.unshift(res.data);
      return res.data;
    }
  } catch {}

  const newFaculty: FacultyRecord = {
    id: `FAC-${Math.floor(1020 + Math.random() * 900)}`,
    empId: data.empId || `EMP-FAC-${Math.floor(100 + Math.random() * 800)}`,
    fullName: data.fullName || "New Faculty Member",
    email: data.email || "faculty@college.edu",
    phone: data.phone || "+91 9000000000",
    designation: data.designation || "Assistant Professor",
    department: data.department || "CSE",
    specialization: data.specialization || "Computer Science",
    qualification: data.qualification || "Ph.D. in Computer Science",
    experience: data.experience || 5,
    teachingLoadHours: Number(data.teachingLoadHours) || 16,
    assignedCoursesCount: Number(data.assignedCoursesCount) || 3,
    assignedSubjectsList: data.assignedSubjectsList || ["Introduction to Programming"],
    attendancePercentage: data.attendancePercentage || 95,
    status: data.status || "Active",
    joiningDate: data.joiningDate || new Date().toISOString().split("T")[0],
    publicationsCount: data.publicationsCount || 0,
    performanceRating: data.performanceRating || "Very Good (4.2/5.0)",
    weeklyTimetable: data.weeklyTimetable || [
      { day: "Monday", time: "09:00 - 10:00", course: "Core Subject", room: "LH-1" },
    ],
  };

  localFacultyDatabase.unshift(newFaculty);
  return newFaculty;
}

export async function updateFacultyRecord(id: string, updates: Partial<FacultyRecord>): Promise<Partial<FacultyRecord>> {
  try {
    const res = await api.put(`/api/dean/faculty/${id}`, updates);
    if (res && res.data) {
      localFacultyDatabase = localFacultyDatabase.map((f) => (f.id === id ? { ...f, ...updates } : f));
      return res.data;
    }
  } catch {}

  localFacultyDatabase = localFacultyDatabase.map((f) => (f.id === id ? { ...f, ...updates } : f));
  return { id, ...updates };
}

export async function deleteFacultyRecord(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/dean/faculty/${id}`);
    localFacultyDatabase = localFacultyDatabase.filter((f) => f.id !== id);
    return true;
  } catch {}

  localFacultyDatabase = localFacultyDatabase.filter((f) => f.id !== id);
  return true;
}
