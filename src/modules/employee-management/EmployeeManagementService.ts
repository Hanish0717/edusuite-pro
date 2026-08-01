import api from "@/lib/api";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: "Full Time" | "Part Time" | "Contract" | "Guest Faculty";
  qualification: string;
  salaryGrade: string;
  status: "Active" | "On Leave" | "Terminated";
  joinDate: string;
  roleFlag?: string;
}

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "Dr. Rajesh Sharma",
    email: "rajesh@college.com",
    phone: "+91 98765 43210",
    department: "CSE",
    designation: "Professor & HOD",
    employmentType: "Full Time",
    qualification: "Ph.D. in Computer Science (IIT Bombay)",
    salaryGrade: "Level 14 (Prof)",
    status: "Active",
    joinDate: "2018-06-15",
    roleFlag: "isHod",
  },
  {
    id: "EMP002",
    name: "Dr. Meera Rao",
    email: "meera@college.com",
    phone: "+91 98765 43211",
    department: "ECE",
    designation: "Professor & Vice Principal",
    employmentType: "Full Time",
    qualification: "Ph.D. in VLSI & Microelectronics (IISc)",
    salaryGrade: "Level 14 (Prof)",
    status: "Active",
    joinDate: "2019-08-01",
    roleFlag: "isVicePrincipal",
  },
  {
    id: "EMP003",
    name: "Prof. Anand Kumar",
    email: "anand@college.com",
    phone: "+91 98765 43212",
    department: "ME",
    designation: "Associate Professor",
    employmentType: "Full Time",
    qualification: "M.Tech in Thermal Engineering (NIT Warangal)",
    salaryGrade: "Level 12 (Assoc)",
    status: "On Leave",
    joinDate: "2021-01-10",
    roleFlag: "isMentor",
  },
  {
    id: "EMP004",
    name: "Dr. S. K. Gupta",
    email: "skgupta@college.com",
    phone: "+91 98765 43213",
    department: "CSE",
    designation: "Professor & Academic Dean",
    employmentType: "Full Time",
    qualification: "Ph.D. in Artificial Intelligence (IIT Delhi)",
    salaryGrade: "Level 15 (Dean)",
    status: "Active",
    joinDate: "2016-04-01",
    roleFlag: "isDean",
  },
  {
    id: "EMP005",
    name: "Ms. Ananya Verma",
    email: "ananya.verma@college.com",
    phone: "+91 98765 43214",
    department: "AI&DS",
    designation: "Assistant Professor",
    employmentType: "Full Time",
    qualification: "M.Tech in Data Science & Machine Learning",
    salaryGrade: "Level 10 (Asst Prof)",
    status: "Active",
    joinDate: "2023-07-15",
    roleFlag: "isClassAdvisor",
  },
  {
    id: "EMP006",
    name: "Mr. Vikram Malhotra",
    email: "placement@college.com",
    phone: "+91 98765 43215",
    department: "Admin",
    designation: "Head of Placements & Training",
    employmentType: "Full Time",
    qualification: "MBA in HR & Corporate Relations",
    salaryGrade: "Level 12 (Admin)",
    status: "Active",
    joinDate: "2020-02-18",
    roleFlag: "isPlacementOfficer",
  },
  {
    id: "EMP007",
    name: "Dr. P. V. Ramana",
    email: "ramana.eee@college.com",
    phone: "+91 98765 43216",
    department: "EEE",
    designation: "Controller of Examinations",
    employmentType: "Full Time",
    qualification: "Ph.D. in High Voltage Engineering",
    salaryGrade: "Level 14 (Prof)",
    status: "Active",
    joinDate: "2017-09-01",
    roleFlag: "isExamController",
  },
  {
    id: "EMP008",
    name: "Prof. Alan Turing",
    email: "alan.guest@college.com",
    phone: "+91 98765 43217",
    department: "CSE",
    designation: "Distinguished Guest Lecturer",
    employmentType: "Guest Faculty",
    qualification: "Ph.D. in Theoretical Computer Science",
    salaryGrade: "Guest Stipend",
    status: "Active",
    joinDate: "2024-01-05",
    roleFlag: "isGuestFaculty",
  },
];

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const res = await api.get("/api/employee");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_EMPLOYEES;
}

export async function createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
  try {
    const res = await api.post("/api/employee", employeeData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  
  const newEmp: Employee = {
    id: `EMP${Math.floor(100 + Math.random() * 900)}`,
    name: employeeData.name || "New Staff Member",
    email: employeeData.email || "staff@college.com",
    phone: employeeData.phone || "+91 90000 00000",
    department: employeeData.department || "CSE",
    designation: employeeData.designation || "Assistant Professor",
    employmentType: employeeData.employmentType || "Full Time",
    qualification: employeeData.qualification || "M.Tech / M.Sc",
    salaryGrade: employeeData.salaryGrade || "Level 10",
    status: employeeData.status || "Active",
    joinDate: employeeData.joinDate || new Date().toISOString().split("T")[0],
    roleFlag: employeeData.roleFlag || "isMentor",
  };
  return newEmp;
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Partial<Employee>> {
  try {
    const res = await api.put(`/api/employee/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/employee/${id}`);
  } catch {}
  return true;
}
