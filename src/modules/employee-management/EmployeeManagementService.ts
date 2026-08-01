import api from "@/lib/api";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: "Active" | "On Leave" | "Terminated";
  joinDate: string;
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const { data } = await api.get("/api/employee");
    return data;
  } catch {
    // Mock fallback for offline / demo mode
    return [
      { id: "EMP001", name: "Dr. Rajesh Sharma", email: "rajesh@college.com", department: "CSE", designation: "Professor & HOD", status: "Active", joinDate: "2018-06-15" },
      { id: "EMP002", name: "Dr. Meera Rao", email: "meera@college.com", department: "ECE", designation: "Associate Professor", status: "Active", joinDate: "2019-08-01" },
      { id: "EMP003", name: "Prof. Anand Kumar", email: "anand@college.com", department: "ME", designation: "Assistant Professor", status: "On Leave", joinDate: "2021-01-10" },
    ];
  }
}

export async function createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
  const { data } = await api.post("/api/employee", employeeData);
  return data;
}
