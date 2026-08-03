import api from "@/lib/api";

export interface HREmployee {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department: string;
  employmentType: "Full-Time Permanent" | "Contractual" | "Visiting Professor" | "Adjunct Faculty";
  joiningDate: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Sabbatical";
}

export interface JobRequisition {
  id: string;
  reqId: string;
  positionTitle: string;
  department: string;
  targetHires: number;
  applicantCount: number;
  hiringManager: string;
  postingDate: string;
  status: "Open Recruiting" | "Interview Stage" | "Closed";
}

export interface FacultyLeaveApplication {
  id: string;
  leaveId: string;
  empId: string;
  facultyName: string;
  department: string;
  leaveType: "Casual Leave" | "Medical Leave" | "Earned Leave" | "Sabbatical" | "Duty Leave";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  substituteFaculty: string;
  status: "Pending HR Approval" | "Approved" | "Rejected";
  appliedOn: string;
}

export const INITIAL_EMPLOYEES: HREmployee[] = [
  {
    id: "EMP-101",
    empId: "FAC-2022-014",
    name: "Dr. Rajesh K. Varma",
    designation: "Professor & HOD",
    department: "CSE",
    employmentType: "Full-Time Permanent",
    joiningDate: "2018-06-15",
    email: "rajesh.varma@edusuite.edu.in",
    phone: "+91 98765 12340",
    status: "Active",
  },
  {
    id: "EMP-102",
    empId: "FAC-2023-088",
    name: "Dr. Meera Nambiar",
    designation: "Associate Professor",
    department: "ECE",
    employmentType: "Full-Time Permanent",
    joiningDate: "2021-08-01",
    email: "meera.nambiar@edusuite.edu.in",
    phone: "+91 98765 88120",
    status: "Active",
  },
  {
    id: "EMP-103",
    empId: "FAC-2024-102",
    name: "Prof. Arvind Swaminathan",
    designation: "Assistant Professor",
    department: "AI&DS",
    employmentType: "Contractual",
    joiningDate: "2024-01-10",
    email: "arvind.s@edusuite.edu.in",
    phone: "+91 98765 99310",
    status: "Active",
  },
];

export const INITIAL_REQUISITIONS: JobRequisition[] = [
  {
    id: "REQ-301",
    reqId: "REQ-2026-012",
    positionTitle: "Professor in Quantum Computing & Cyber Security",
    department: "CSE",
    targetHires: 2,
    applicantCount: 42,
    hiringManager: "Dr. Rajesh K. Varma",
    postingDate: "2026-07-15",
    status: "Open Recruiting",
  },
  {
    id: "REQ-302",
    reqId: "REQ-2026-045",
    positionTitle: "Assistant Professor in Semiconductor Design & VLSI",
    department: "ECE",
    targetHires: 3,
    applicantCount: 28,
    hiringManager: "Dr. Meera Nambiar",
    postingDate: "2026-07-20",
    status: "Interview Stage",
  },
];

export async function fetchHREmployees(): Promise<HREmployee[]> {
  try {
    const res = await api.get("/api/hr/employees");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_EMPLOYEES;
}

export async function fetchJobRequisitions(): Promise<JobRequisition[]> {
  try {
    const res = await api.get("/api/hr/requisitions");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_REQUISITIONS;
}

export async function onboardEmployee(data: Partial<HREmployee>): Promise<HREmployee> {
  try {
    const res = await api.post("/api/hr/onboard", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `EMP-${Math.floor(104 + Math.random() * 900)}`,
    empId: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name || "Dr. Sankar Narayan",
    designation: data.designation || "Assistant Professor",
    department: data.department || "CSE",
    employmentType: data.employmentType || "Full-Time Permanent",
    joiningDate: new Date().toISOString().split("T")[0],
    email: data.email || "sankar.n@edusuite.edu.in",
    phone: data.phone || "+91 98765 00000",
    status: "Active",
  };
}

export async function postJobRequisition(data: Partial<JobRequisition>): Promise<JobRequisition> {
  try {
    const res = await api.post("/api/hr/requisitions", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `REQ-${Math.floor(303 + Math.random() * 900)}`,
    reqId: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
    positionTitle: data.positionTitle || "Assistant Professor in Data Science",
    department: data.department || "AI&DS",
    targetHires: Number(data.targetHires) || 1,
    applicantCount: 0,
    hiringManager: "HR Department",
    postingDate: new Date().toISOString().split("T")[0],
    status: "Open Recruiting",
  };
}

// ----------------------------------------------------
// FACULTY & STAFF LEAVE MANAGEMENT (HR GOVERNANCE)
// ----------------------------------------------------
export const INITIAL_FACULTY_LEAVES: FacultyLeaveApplication[] = [
  {
    id: "LEV-101",
    leaveId: "LEV-2026-088",
    empId: "FAC-2022-014",
    facultyName: "Dr. Rajesh K. Varma",
    department: "CSE",
    leaveType: "Medical Leave",
    startDate: "2026-08-05",
    endDate: "2026-08-08",
    totalDays: 4,
    reason: "Hospitalization and post-op recovery.",
    substituteFaculty: "Ms. Ananya Sharma",
    status: "Pending HR Approval",
    appliedOn: "2026-08-02",
  },
  {
    id: "LEV-102",
    leaveId: "LEV-2026-092",
    empId: "FAC-2023-088",
    facultyName: "Dr. Meera Nambiar",
    department: "ECE",
    leaveType: "Casual Leave",
    startDate: "2026-08-12",
    endDate: "2026-08-13",
    totalDays: 2,
    reason: "Attending IEEE International Conference in Bangalore.",
    substituteFaculty: "Dr. K. Sai Teja",
    status: "Approved",
    appliedOn: "2026-07-30",
  },
  {
    id: "LEV-103",
    leaveId: "LEV-2026-095",
    empId: "FAC-2024-102",
    facultyName: "Prof. Arvind Swaminathan",
    department: "AI&DS",
    leaveType: "Duty Leave",
    startDate: "2026-08-18",
    endDate: "2026-08-19",
    totalDays: 2,
    reason: "External University PhD Examiner Duty.",
    substituteFaculty: "Dr. Rajesh K. Varma",
    status: "Approved",
    appliedOn: "2026-08-01",
  },
];

export async function fetchFacultyLeaves(): Promise<FacultyLeaveApplication[]> {
  try {
    const res = await api.get("/api/hr/leaves");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_FACULTY_LEAVES;
}

export async function approveFacultyLeave(id: string): Promise<boolean> {
  try {
    await api.post(`/api/hr/leaves/${id}/approve`);
  } catch {}
  return true;
}

export async function rejectFacultyLeave(id: string): Promise<boolean> {
  try {
    await api.post(`/api/hr/leaves/${id}/reject`);
  } catch {}
  return true;
}

export async function applyFacultyLeave(data: Partial<FacultyLeaveApplication>): Promise<FacultyLeaveApplication> {
  try {
    const res = await api.post("/api/hr/leaves", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `LEV-${Math.floor(104 + Math.random() * 900)}`,
    leaveId: `LEV-2026-${Math.floor(100 + Math.random() * 900)}`,
    empId: data.empId || "FAC-2024-105",
    facultyName: data.facultyName || "Dr. Assigned Faculty",
    department: data.department || "CSE",
    leaveType: data.leaveType || "Casual Leave",
    startDate: data.startDate || "2026-08-10",
    endDate: data.endDate || "2026-08-11",
    totalDays: Number(data.totalDays) || 2,
    reason: data.reason || "Personal work.",
    substituteFaculty: data.substituteFaculty || "Ms. Ananya Sharma",
    status: "Pending HR Approval",
    appliedOn: new Date().toISOString().split("T")[0],
  };
}
