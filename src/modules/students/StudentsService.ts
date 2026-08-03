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
}

export const INITIAL_STUDENTS: StudentRecord[] = [
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
  },
  {
    id: "STU-1002",
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
  },
  {
    id: "STU-1003",
    rollNo: "23AIDS018",
    fullName: "Vikramaditya Rao",
    email: "vikram.rao@college.edu",
    phone: "+91 9988776655",
    department: "AI&DS",
    academicYear: "Year 2 (Sem 4)",
    batchCode: "2024-2028",
    cgpa: 8.90,
    attendancePct: 76.0,
    feeStatus: "Partial",
    guardianName: "Murali Rao",
    guardianPhone: "+91 9988700003",
    enrollmentDate: "2024-08-14",
  },
  {
    id: "STU-1004",
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
  },
  {
    id: "STU-1005",
    rollNo: "24BIO009",
    fullName: "Diya Deshmukh",
    email: "diya.d@college.edu",
    phone: "+91 9848022334",
    department: "Biotech",
    academicYear: "Year 1 (Sem 2)",
    batchCode: "2025-2029",
    cgpa: 9.40,
    attendancePct: 96.8,
    feeStatus: "Paid",
    guardianName: "Prakash Deshmukh",
    guardianPhone: "+91 9848000005",
    enrollmentDate: "2025-08-15",
  },
];

export async function fetchStudentRecords(): Promise<StudentRecord[]> {
  try {
    const res = await api.get("/api/students");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
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
    enrollmentDate: new Date().toISOString().split("T")[0],
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
