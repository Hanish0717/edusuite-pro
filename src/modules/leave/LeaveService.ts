import api from "@/lib/api";

export interface LeaveApplication {
  id: string;
  applicantName: string;
  applicantRole: string;
  department: string;
  leaveType: "Casual" | "Sick" | "Earned" | "Duty Leave";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  substituteFaculty?: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

export const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: "LV-901",
    applicantName: "Dr. K. Sai Teja",
    applicantRole: "Assistant Professor",
    department: "CSE",
    leaveType: "Duty Leave",
    startDate: "2026-08-05",
    endDate: "2026-08-07",
    days: 3,
    reason: "Presenting Research Paper at IEEE International AI Conference",
    substituteFaculty: "Ms. Ananya Verma",
    status: "Pending",
    appliedOn: "2026-07-29",
  },
  {
    id: "LV-902",
    applicantName: "Prof. Anish Kulkarni",
    applicantRole: "Associate Professor",
    department: "ECE",
    leaveType: "Sick",
    startDate: "2026-08-01",
    endDate: "2026-08-02",
    days: 2,
    reason: "Medical treatment and viral fever recovery",
    substituteFaculty: "Dr. Meera Rao",
    status: "Approved",
    appliedOn: "2026-07-31",
  },
  {
    id: "LV-903",
    applicantName: "S. Priya",
    applicantRole: "Lab Instructor",
    department: "IT",
    leaveType: "Casual",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    days: 3,
    reason: "Personal family ceremony & travel to hometown",
    substituteFaculty: "Mr. R. Karthik",
    status: "Pending",
    appliedOn: "2026-08-01",
  },
  {
    id: "LV-904",
    applicantName: "Dr. Rajesh Sharma",
    applicantRole: "Professor & HOD",
    department: "CSE",
    leaveType: "Earned",
    startDate: "2026-08-18",
    endDate: "2026-08-22",
    days: 5,
    reason: "Annual earned leave block for family vacation",
    substituteFaculty: "Dr. S. K. Gupta",
    status: "Approved",
    appliedOn: "2026-07-25",
  },
  {
    id: "LV-905",
    applicantName: "Prof. Anand Kumar",
    applicantRole: "Assistant Professor",
    department: "ME",
    leaveType: "Casual",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    days: 1,
    reason: "Urgent personal work at government office",
    substituteFaculty: "Prof. V. K. Murthy",
    status: "Rejected",
    appliedOn: "2026-08-01",
  },
];

export async function fetchLeaveApplications(): Promise<LeaveApplication[]> {
  try {
    const res = await api.get("/api/leave");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_LEAVE_APPLICATIONS;
}

export async function applyForLeave(leaveData: Partial<LeaveApplication>): Promise<LeaveApplication> {
  try {
    const res = await api.post("/api/leave", leaveData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const start = new Date(leaveData.startDate || new Date());
  const end = new Date(leaveData.endDate || new Date());
  const calculatedDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

  const newLeave: LeaveApplication = {
    id: `LV-${Math.floor(900 + Math.random() * 99)}`,
    applicantName: leaveData.applicantName || "Dr. Ravi Kumar",
    applicantRole: leaveData.applicantRole || "Faculty Member",
    department: leaveData.department || "CSE",
    leaveType: leaveData.leaveType || "Casual",
    startDate: leaveData.startDate || new Date().toISOString().split("T")[0],
    endDate: leaveData.endDate || new Date().toISOString().split("T")[0],
    days: calculatedDays,
    reason: leaveData.reason || "Personal work",
    substituteFaculty: leaveData.substituteFaculty || "Assigned by HOD",
    status: "Pending",
    appliedOn: new Date().toISOString().split("T")[0],
  };

  return newLeave;
}

export async function updateLeaveStatus(
  id: string,
  status: "Approved" | "Rejected",
): Promise<Partial<LeaveApplication>> {
  try {
    const res = await api.put(`/api/leave/${id}`, { status });
    if (res && res.data) return res.data;
  } catch {}
  return { id, status };
}
