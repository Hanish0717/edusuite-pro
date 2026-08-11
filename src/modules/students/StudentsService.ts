import api from "@/lib/api";

export interface StudentRecord {
  id: string;
  rollNo: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  academicYear: string;
  batchCode: string;
  cgpa: number;
  attendancePct: number;
  feeStatus: "Paid" | "Pending" | "Partial";
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
  
  // Dynamic Academic management fields
  semester: string;
  section: string;
  creditsEarned: number;
  status: "Active" | "Inactive";
}

export const MOCK_DEPARTMENT_STUDENTS: Record<string, StudentRecord[]> = {
  CSE: [
    {
      id: "STU-1001",
      rollNo: "22CSE001",
      fullName: "Aarav Sharma",
      email: "aarav.sharma@college.edu",
      phone: "+91 9876543210",
      department: "CSE",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 9.12,
      attendancePct: 94.5,
      feeStatus: "Paid",
      guardianName: "Rajesh Sharma",
      guardianPhone: "+91 9876500001",
      enrollmentDate: "2023-08-10",
      semester: "Semester 6",
      section: "A",
      creditsEarned: 104,
      status: "Active"
    },
    {
      id: "STU-1002",
      rollNo: "22CSE015",
      fullName: "Ishita Kapoor",
      email: "ishita.k@college.edu",
      phone: "+91 9876543211",
      department: "CSE",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 8.85,
      attendancePct: 73.0,
      feeStatus: "Paid",
      guardianName: "Sanjay Kapoor",
      guardianPhone: "+91 9876500011",
      enrollmentDate: "2023-08-11",
      semester: "Semester 6",
      section: "B",
      creditsEarned: 102,
      status: "Active"
    },
    {
      id: "STU-1003",
      rollNo: "23CSE045",
      fullName: "Rohan Varma",
      email: "rohan.v@college.edu",
      phone: "+91 9876543212",
      department: "CSE",
      academicYear: "Year 2 (Sem 4)",
      batchCode: "2024-2028",
      cgpa: 7.95,
      attendancePct: 81.2,
      feeStatus: "Partial",
      guardianName: "Dinesh Varma",
      guardianPhone: "+91 9876500012",
      enrollmentDate: "2024-08-12",
      semester: "Semester 4",
      section: "A",
      creditsEarned: 68,
      status: "Active"
    }
  ],
  ECE: [
    {
      id: "STU-2001",
      rollNo: "22ECE042",
      fullName: "Ananya Iyer",
      email: "ananya.iyer@college.edu",
      phone: "+91 9123456789",
      department: "ECE",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 8.65,
      attendancePct: 89.2,
      feeStatus: "Paid",
      guardianName: "Srinivasan Iyer",
      guardianPhone: "+91 9123400002",
      enrollmentDate: "2023-08-12",
      semester: "Semester 6",
      section: "A",
      creditsEarned: 98,
      status: "Active"
    },
    {
      id: "STU-2002",
      rollNo: "23ECE011",
      fullName: "Aditya Nair",
      email: "aditya.n@college.edu",
      phone: "+91 9123456790",
      department: "ECE",
      academicYear: "Year 2 (Sem 4)",
      batchCode: "2024-2028",
      cgpa: 8.10,
      attendancePct: 91.0,
      feeStatus: "Partial",
      guardianName: "Balakrishnan Nair",
      guardianPhone: "+91 9123400010",
      enrollmentDate: "2024-08-14",
      semester: "Semester 4",
      section: "B",
      creditsEarned: 64,
      status: "Active"
    }
  ],
  EEE: [
    {
      id: "STU-3001",
      rollNo: "22EEE005",
      fullName: "Vikram Sen",
      email: "vikram.sen@college.edu",
      phone: "+91 9234567890",
      department: "EEE",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 8.20,
      attendancePct: 84.5,
      feeStatus: "Paid",
      guardianName: "Alok Sen",
      guardianPhone: "+91 9234500001",
      enrollmentDate: "2023-08-10",
      semester: "Semester 6",
      section: "A",
      creditsEarned: 96,
      status: "Active"
    },
    {
      id: "STU-3002",
      rollNo: "23EEE012",
      fullName: "Meera Krishnan",
      email: "meera.k@college.edu",
      phone: "+91 9234567891",
      department: "EEE",
      academicYear: "Year 2 (Sem 4)",
      batchCode: "2024-2028",
      cgpa: 9.30,
      attendancePct: 95.0,
      feeStatus: "Paid",
      guardianName: "Gopal Krishnan",
      guardianPhone: "+91 9234500002",
      enrollmentDate: "2024-08-11",
      semester: "Semester 4",
      section: "A",
      creditsEarned: 72,
      status: "Active"
    }
  ],
  ME: [
    {
      id: "STU-4001",
      rollNo: "21ME075",
      fullName: "Karthik Verma",
      email: "karthik.v@college.edu",
      phone: "+91 9765432109",
      department: "ME",
      academicYear: "Year 4 (Sem 8)",
      batchCode: "2022-2026",
      cgpa: 7.85,
      attendancePct: 68.5,
      feeStatus: "Pending",
      guardianName: "Sunil Verma",
      guardianPhone: "+91 9765400004",
      enrollmentDate: "2022-08-01",
      semester: "Semester 8",
      section: "A",
      creditsEarned: 130,
      status: "Active"
    },
    {
      id: "STU-4002",
      rollNo: "22ME018",
      fullName: "Rahul Dixit",
      email: "rahul.d@college.edu",
      phone: "+91 9765432110",
      department: "ME",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 8.40,
      attendancePct: 92.5,
      feeStatus: "Paid",
      guardianName: "Anil Dixit",
      guardianPhone: "+91 9765400010",
      enrollmentDate: "2023-08-10",
      semester: "Semester 6",
      section: "B",
      creditsEarned: 100,
      status: "Active"
    }
  ],
  Civil: [
    {
      id: "STU-5001",
      rollNo: "22CIV024",
      fullName: "Pooja Hegde",
      email: "pooja.h@college.edu",
      phone: "+91 9345678901",
      department: "Civil",
      academicYear: "Year 3 (Sem 6)",
      batchCode: "2023-2027",
      cgpa: 8.50,
      attendancePct: 88.0,
      feeStatus: "Paid",
      guardianName: "Mohan Hegde",
      guardianPhone: "+91 9345600001",
      enrollmentDate: "2023-08-10",
      semester: "Semester 6",
      section: "A",
      creditsEarned: 96,
      status: "Active"
    },
    {
      id: "STU-5002",
      rollNo: "23CIV009",
      fullName: "Siddharth Roy",
      email: "sid.roy@college.edu",
      phone: "+91 9345678902",
      department: "Civil",
      academicYear: "Year 2 (Sem 4)",
      batchCode: "2024-2028",
      cgpa: 7.70,
      attendancePct: 71.5,
      feeStatus: "Pending",
      guardianName: "Subrata Roy",
      guardianPhone: "+91 9345600002",
      enrollmentDate: "2024-08-12",
      semester: "Semester 4",
      section: "A",
      creditsEarned: 62,
      status: "Active"
    }
  ],
  MBA: [
    {
      id: "STU-6001",
      rollNo: "24MBA002",
      fullName: "Kriti Sanon",
      email: "kriti.s@college.edu",
      phone: "+91 9456789012",
      department: "MBA",
      academicYear: "Year 2 (Sem 3)",
      batchCode: "2024-2026",
      cgpa: 9.25,
      attendancePct: 93.5,
      feeStatus: "Paid",
      guardianName: "Rahul Sanon",
      guardianPhone: "+91 9456700001",
      enrollmentDate: "2024-08-05",
      semester: "Semester 3",
      section: "A",
      creditsEarned: 48,
      status: "Active"
    },
    {
      id: "STU-6002",
      rollNo: "24MBA018",
      fullName: "Varun Dhawan",
      email: "varun.d@college.edu",
      phone: "+91 9456789013",
      department: "MBA",
      academicYear: "Year 2 (Sem 3)",
      batchCode: "2024-2026",
      cgpa: 8.15,
      attendancePct: 82.0,
      feeStatus: "Paid",
      guardianName: "David Dhawan",
      guardianPhone: "+91 9456700002",
      enrollmentDate: "2024-08-06",
      semester: "Semester 3",
      section: "B",
      creditsEarned: 44,
      status: "Active"
    }
  ]
};

export const INITIAL_STUDENTS: StudentRecord[] = MOCK_DEPARTMENT_STUDENTS["CSE"] || [];

export interface GetStudentsParams {
  department: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    semester?: string;
    section?: string;
    status?: string;
    feeStatus?: string;
    academicYear?: string;
  };
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface GetStudentsResponse {
  students: StudentRecord[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getStudents(params: GetStudentsParams): Promise<GetStudentsResponse> {
  try {
    const qps = new URLSearchParams();
    qps.append("department", params.department);
    if (params.page) qps.append("page", String(params.page));
    if (params.limit) qps.append("limit", String(params.limit));
    if (params.search) qps.append("search", params.search);
    if (params.filters) {
      if (params.filters.semester) qps.append("semester", params.filters.semester);
      if (params.filters.section) qps.append("section", params.filters.section);
      if (params.filters.status) qps.append("status", params.filters.status);
      if (params.filters.feeStatus) qps.append("feeStatus", params.filters.feeStatus);
      if (params.filters.academicYear) qps.append("academicYear", params.filters.academicYear);
    }

    const res = await api.get(`/api/students?${qps.toString()}`);
    if (res.status === 200 && res.data) {
      return res.data;
    }
  } catch (err) {
    console.error("Failed to query student database:", err);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const deptCode = (params.department === "Mechanical" || params.department === "ME") ? "ME" : params.department;
      let list: StudentRecord[] = MOCK_DEPARTMENT_STUDENTS[deptCode] || [];

      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (s) =>
            s.fullName.toLowerCase().includes(query) ||
            s.rollNo.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query) ||
            s.guardianName.toLowerCase().includes(query)
        );
      }

      if (params.filters) {
        const { semester, section, status, feeStatus, academicYear } = params.filters;
        if (semester && semester !== "All Semesters") {
          list = list.filter((s) => s.semester === semester);
        }
        if (section && section !== "All Sections") {
          list = list.filter((s) => s.section === section);
        }
        if (status && status !== "All Status") {
          list = list.filter((s) => s.status === status);
        }
        if (feeStatus && feeStatus !== "All Fee Status") {
          list = list.filter((s) => s.feeStatus === feeStatus);
        }
        if (academicYear && academicYear !== "All Years") {
          list = list.filter((s) => s.academicYear.includes(academicYear));
        }
      }

      if (params.sort) {
        const { field, order } = params.sort;
        list = [...list].sort((a, b) => {
          const valA = (a as any)[field];
          const valB = (b as any)[field];
          if (typeof valA === "number" && typeof valB === "number") {
            return order === "asc" ? valA - valB : valB - valA;
          }
          return order === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        });
      }

      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedList = list.slice(startIndex, startIndex + limit);

      resolve({
        students: paginatedList,
        totalCount: list.length,
        totalPages: Math.ceil(list.length / limit),
        currentPage: page,
      });
    }, 100);
  });
}

export async function fetchStudentRecords(): Promise<StudentRecord[]> {
  try {
    const res = await api.get("/api/students");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  
  // Return default CSE students list
  return INITIAL_STUDENTS;
}

export async function createStudentRecord(
  data: Partial<StudentRecord>,
): Promise<StudentRecord> {
  try {
    const res = await api.post("/api/students", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newStudent: StudentRecord = {
    id: `STU-${Math.floor(1006 + Math.random() * 900)}`,
    rollNo: data.rollNo || "23CSE199",
    fullName: data.fullName || "New Student",
    email: data.email || "student@college.edu",
    phone: data.phone || "+91 9000000000",
    department: data.department || "CSE",
    academicYear: data.academicYear || "Year 1 (Sem 1)",
    batchCode: data.batchCode || "2024-2028",
    cgpa: Number(data.cgpa) || 8.5,
    attendancePct: Number(data.attendancePct) || 90.0,
    feeStatus: data.feeStatus || "Paid",
    guardianName: data.guardianName || "Parent / Guardian",
    guardianPhone: data.guardianPhone || "+91 9000000001",
    enrollmentDate: new Date().toISOString().split("T")[0] || "",
    semester: data.semester || "Semester 1",
    section: data.section || "A",
    creditsEarned: Number(data.creditsEarned) || 0,
    status: data.status || "Active",
  };

  return newStudent;
}

export async function updateStudentRecord(
  id: string,
  updates: Partial<StudentRecord>,
): Promise<Partial<StudentRecord>> {
  try {
    const res = await api.put(`/api/students/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteStudentRecord(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/students/${id}`);
  } catch {}
  return true;
}
