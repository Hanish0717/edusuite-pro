import api from "@/lib/api";

export interface FacultyRecord {
  id: string;
  empId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: "Professor" | "Associate Professor" | "Assistant Professor" | "Senior Lecturer";
  department: string;
  specialization: string;
  teachingLoadHours: number;
  assignedCoursesCount: number;
  status: "Active" | "On Leave" | "Sabbatical";
  joiningDate: string;
}

export const INITIAL_FACULTY: FacultyRecord[] = [
  {
    id: "FAC-1001",
    empId: "EMP-FAC-012",
    fullName: "Dr. K. Sai Teja",
    email: "saiteja.k@college.edu",
    phone: "+91 9876543210",
    designation: "Professor",
    department: "CSE",
    specialization: "Artificial Intelligence & Neural Networks",
    teachingLoadHours: 16,
    assignedCoursesCount: 3,
    status: "Active",
    joiningDate: "2018-06-15",
  },
  {
    id: "FAC-1002",
    empId: "EMP-FAC-024",
    fullName: "Dr. Meera Rao",
    email: "meera.rao@college.edu",
    phone: "+91 9123456789",
    designation: "Professor",
    department: "ECE",
    specialization: "VLSI Architecture & Cadence Tools",
    teachingLoadHours: 18,
    assignedCoursesCount: 4,
    status: "Active",
    joiningDate: "2016-08-20",
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
    teachingLoadHours: 14,
    assignedCoursesCount: 2,
    status: "Active",
    joiningDate: "2021-01-10",
  },
  {
    id: "FAC-1004",
    empId: "EMP-FAC-055",
    fullName: "Prof. V. K. Murthy",
    email: "vkmurthy@college.edu",
    phone: "+91 9765432109",
    designation: "Associate Professor",
    department: "ME",
    specialization: "CAD Synthesis & Finite Element Analysis",
    teachingLoadHours: 15,
    assignedCoursesCount: 3,
    status: "On Leave",
    joiningDate: "2019-03-01",
  },
  {
    id: "FAC-1005",
    empId: "EMP-FAC-071",
    fullName: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@college.edu",
    phone: "+91 9848022334",
    designation: "Professor & HOD",
    department: "AI&DS",
    specialization: "NLP & Transformer Architectures",
    teachingLoadHours: 12,
    assignedCoursesCount: 2,
    status: "Active",
    joiningDate: "2015-07-01",
  },
];

export async function fetchFacultyRecords(): Promise<FacultyRecord[]> {
  try {
    const res = await api.get("/api/faculty");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_FACULTY;
}

export async function createFacultyRecord(
  data: Partial<FacultyRecord>,
): Promise<FacultyRecord> {
  try {
    const res = await api.post("/api/faculty", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newFaculty: FacultyRecord = {
    id: `FAC-${Math.floor(1006 + Math.random() * 900)}`,
    empId: data.empId || "EMP-FAC-099",
    fullName: data.fullName || "New Faculty Member",
    email: data.email || "faculty@college.edu",
    phone: data.phone || "+91 9000000000",
    designation: data.designation || "Assistant Professor",
    department: data.department || "CSE",
    specialization: data.specialization || "Computer Science",
    teachingLoadHours: Number(data.teachingLoadHours) || 16,
    assignedCoursesCount: Number(data.assignedCoursesCount) || 3,
    status: data.status || "Active",
    joiningDate: new Date().toISOString().split("T")[0],
  };

  return newFaculty;
}

export async function updateFacultyRecord(
  id: string,
  updates: Partial<FacultyRecord>,
): Promise<Partial<FacultyRecord>> {
  try {
    const res = await api.put(`/api/faculty/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteFacultyRecord(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/faculty/${id}`);
  } catch {}
  return true;
}
