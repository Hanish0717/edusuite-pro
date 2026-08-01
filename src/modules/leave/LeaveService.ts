import api from "@/lib/api";

export interface LeaveApplication {
  id: string;
  applicantName: string;
  applicantRole: string;
  leaveType: "Casual" | "Sick" | "Earned" | "Duty Leave";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export async function fetchLeaveApplications(): Promise<LeaveApplication[]> {
  try {
    const { data } = await api.get("/api/leave");
    return data;
  } catch {
    return [
      { id: "LV-901", applicantName: "Dr. K. Sai Teja", applicantRole: "Assistant Professor", leaveType: "Casual", startDate: "2026-08-05", endDate: "2026-08-07", days: 3, reason: "Attending National AI Conference", status: "Pending" },
      { id: "LV-902", applicantName: "Prof. Anish Kulkarni", applicantRole: "Associate Professor", leaveType: "Sick", startDate: "2026-08-01", endDate: "2026-08-02", days: 2, reason: "Viral fever", status: "Approved" },
      { id: "LV-903", applicantName: "S. Priya", applicantRole: "Lab Assistant", leaveType: "Earned", startDate: "2026-08-10", endDate: "2026-08-15", days: 5, reason: "Personal family event", status: "Pending" },
    ];
  }
}

export async function applyForLeave(leaveData: Partial<LeaveApplication>): Promise<LeaveApplication> {
  const { data } = await api.post("/api/leave", leaveData);
  return data;
}

export async function updateLeaveStatus(id: string, status: "Approved" | "Rejected"): Promise<LeaveApplication> {
  const { data } = await api.put(`/api/leave/${id}`, { status });
  return data;
}
