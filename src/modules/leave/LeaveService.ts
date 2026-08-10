import api from "@/lib/api";

export interface ApprovalStep {
  name: string;
  status: "Completed" | "Current" | "Pending";
  date?: string;
  approver?: string;
  remarks?: string;
}

export interface LeaveApplication {
  id: string;
  applicantName: string;
  applicantRole: string;
  department: string;
  leaveType: "Casual" | "Sick" | "Earned" | "Duty Leave" | "Comp-Off" | "Maternity" | "Paternity";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  isHalfDay: boolean;
  emergencyContact: string;
  remarks?: string;
  attachmentName?: string;
  status: "Pending" | "Approved" | "Rejected" | "Draft" | "Cancelled";
  appliedOn: string;
  approver: string;
  approvalSteps: ApprovalStep[];
}

export interface LeaveBalance {
  leaveType: string;
  remaining: number;
  used: number;
  total: number;
  color: string;
}

export interface HolidayEvent {
  date: string;
  title: string;
  type: "Approved" | "Pending" | "Rejected" | "Holiday" | "National" | "Event" | "Exam";
  details: string;
}

export const MOCK_LEAVE_BALANCES: Record<string, LeaveBalance[]> = {
  CSE: [
    { leaveType: "Casual Leave", remaining: 8, used: 4, total: 12, color: "bg-blue-500" },
    { leaveType: "Sick Leave", remaining: 12, used: 3, total: 15, color: "bg-emerald-500" },
    { leaveType: "Earned Leave", remaining: 6, used: 4, total: 10, color: "bg-violet-500" },
    { leaveType: "Duty Leave", remaining: 2, used: 3, total: 5, color: "bg-amber-500" },
    { leaveType: "Comp-Off", remaining: 3, used: 1, total: 4, color: "bg-rose-500" },
  ],
  ECE: [
    { leaveType: "Casual Leave", remaining: 9, used: 3, total: 12, color: "bg-blue-500" },
    { leaveType: "Sick Leave", remaining: 14, used: 1, total: 15, color: "bg-emerald-500" },
    { leaveType: "Earned Leave", remaining: 8, used: 2, total: 10, color: "bg-violet-500" },
    { leaveType: "Duty Leave", remaining: 4, used: 1, total: 5, color: "bg-amber-500" },
    { leaveType: "Comp-Off", remaining: 2, used: 2, total: 4, color: "bg-rose-500" },
  ],
};

export const MOCK_HOLIDAYS_AND_EVENTS: HolidayEvent[] = [
  { date: "2026-08-15", title: "Independence Day", type: "National", details: "National Holiday - Independence Day Celebrations" },
  { date: "2026-08-25", title: "Janmashtami", type: "Holiday", details: "College Holiday - Krishna Janmashtami" },
  { date: "2026-08-10", title: "Internal Assessment 1", type: "Exam", details: "Academics - Sem 5 & 7 Midterm Exams" },
  { date: "2026-08-18", title: "Board of Studies Meeting", type: "Event", details: "Department Event - Curriculum Revision Review" },
  { date: "2026-08-22", title: "AI/ML Workshop", type: "Event", details: "Department Event - Special guest lecture on NLP" },
];

export const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: "LV-2026-001",
    applicantName: "Dr. Ravi Kumar",
    applicantRole: "Associate Professor",
    department: "CSE",
    leaveType: "Duty Leave",
    startDate: "2026-08-05",
    endDate: "2026-08-07",
    days: 3,
    reason: "Presenting Research Paper at IEEE International AI Conference",
    isHalfDay: false,
    emergencyContact: "+91 9876543210",
    remarks: "Travel tickets attached for review.",
    attachmentName: "IEEE_Paper_Presentation_Duty.pdf",
    status: "Pending",
    appliedOn: "2026-07-29",
    approver: "Dr. Rajesh Sharma",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: "2026-07-29" },
      { name: "HOD Review", status: "Current", approver: "Dr. Rajesh Sharma" },
      { name: "Principal Approval", status: "Pending" },
      { name: "HR Verification", status: "Pending" },
    ],
  },
  {
    id: "LV-2026-002",
    applicantName: "Dr. Ravi Kumar",
    applicantRole: "Associate Professor",
    department: "CSE",
    leaveType: "Sick",
    startDate: "2026-08-01",
    endDate: "2026-08-02",
    days: 2,
    reason: "Medical treatment and viral fever recovery",
    isHalfDay: false,
    emergencyContact: "+91 9876543210",
    status: "Approved",
    appliedOn: "2026-07-31",
    approver: "Dr. Rajesh Sharma",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: "2026-07-31" },
      { name: "HOD Review", status: "Completed", date: "2026-07-31", approver: "Dr. Rajesh Sharma", remarks: "Approved on medical grounds." },
      { name: "Principal Approval", status: "Completed", date: "2026-08-01", approver: "Principal Office" },
      { name: "HR Verification", status: "Completed", date: "2026-08-01" },
    ],
  },
  {
    id: "LV-2026-003",
    applicantName: "Dr. Ravi Kumar",
    applicantRole: "Associate Professor",
    department: "CSE",
    leaveType: "Casual",
    startDate: "2026-08-12",
    endDate: "2026-08-14",
    days: 3,
    reason: "Family function & travelling to hometown",
    isHalfDay: false,
    emergencyContact: "+91 9876543210",
    status: "Approved",
    appliedOn: "2026-08-01",
    approver: "Dr. Rajesh Sharma",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: "2026-08-01" },
      { name: "HOD Review", status: "Completed", date: "2026-08-01", approver: "Dr. Rajesh Sharma" },
      { name: "Principal Approval", status: "Completed", date: "2026-08-02", approver: "Principal Office" },
      { name: "HR Verification", status: "Completed", date: "2026-08-02" },
    ],
  },
  {
    id: "LV-2026-004",
    applicantName: "Dr. Ravi Kumar",
    applicantRole: "Associate Professor",
    department: "CSE",
    leaveType: "Earned",
    startDate: "2026-08-18",
    endDate: "2026-08-22",
    days: 5,
    reason: "Annual earned leave block for family vacation",
    isHalfDay: false,
    emergencyContact: "+91 9876543210",
    status: "Pending",
    appliedOn: "2026-07-25",
    approver: "Dr. Rajesh Sharma",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: "2026-07-25" },
      { name: "HOD Review", status: "Completed", date: "2026-07-26", approver: "Dr. Rajesh Sharma" },
      { name: "Principal Approval", status: "Current" },
      { name: "HR Verification", status: "Pending" },
    ],
  },
  {
    id: "LV-2026-005",
    applicantName: "Prof. Anish Kulkarni",
    applicantRole: "Associate Professor",
    department: "ECE",
    leaveType: "Casual",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    days: 1,
    reason: "Urgent personal work at passport office",
    isHalfDay: false,
    emergencyContact: "+91 9999999999",
    status: "Rejected",
    appliedOn: "2026-08-01",
    approver: "Dr. Meera Rao",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: "2026-08-01" },
      { name: "HOD Review", status: "Completed", date: "2026-08-01", remarks: "Denied due to exam duty assignment." },
    ],
  },
];

export async function fetchLeaveApplications(department?: string): Promise<LeaveApplication[]> {
  try {
    const res = await api.get("/api/leave");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  
  if (department) {
    return INITIAL_LEAVE_APPLICATIONS.filter((l) => l.department === department);
  }
  return INITIAL_LEAVE_APPLICATIONS;
}

export async function fetchLeaveBalances(department: string): Promise<LeaveBalance[]> {
  try {
    const res = await api.get(`/api/leave/balances?dept=${department}`);
    if (res && Array.isArray(res.data)) return res.data;
  } catch {}

  const deptCode = (department === "Mechanical" || department === "ME") ? "ME" : department;
  return MOCK_LEAVE_BALANCES[deptCode] || MOCK_LEAVE_BALANCES["CSE"] || [];
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
    id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
    applicantName: leaveData.applicantName || "Dr. Ravi Kumar",
    applicantRole: leaveData.applicantRole || "Associate Professor",
    department: leaveData.department || "CSE",
    leaveType: leaveData.leaveType || "Casual",
    startDate: leaveData.startDate || new Date().toISOString().split("T")[0] || "",
    endDate: leaveData.endDate || new Date().toISOString().split("T")[0] || "",
    days: calculatedDays,
    reason: leaveData.reason || "Personal work",
    isHalfDay: leaveData.isHalfDay || false,
    emergencyContact: leaveData.emergencyContact || "+91 9876543210",
    status: "Pending",
    appliedOn: new Date().toISOString().split("T")[0] || "",
    approver: "HOD Office",
    approvalSteps: [
      { name: "Submitted", status: "Completed", date: new Date().toISOString().split("T")[0] || "" },
      { name: "HOD Review", status: "Current", approver: "HOD Office" },
      { name: "Principal Approval", status: "Pending" },
      { name: "HR Verification", status: "Pending" },
    ],
  };

  if (leaveData.remarks !== undefined) newLeave.remarks = leaveData.remarks;
  if (leaveData.attachmentName !== undefined) newLeave.attachmentName = leaveData.attachmentName;

  return newLeave;
}

export async function updateLeaveStatus(
  id: string,
  status: "Approved" | "Rejected" | "Cancelled",
): Promise<Partial<LeaveApplication>> {
  try {
    const res = await api.put(`/api/leave/${id}`, { status });
    if (res && res.data) return res.data;
  } catch {}
  return { id, status };
}
