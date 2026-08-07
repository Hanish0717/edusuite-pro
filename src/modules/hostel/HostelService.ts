import api from "@/lib/api";

export interface HostelRoom {
  id: string;
  roomNo: string;
  block: "Block A (Boys)" | "Block B (Girls)" | "Block C (PG Scholars)";
  type: "2-Sharing AC" | "2-Sharing Non-AC" | "3-Sharing Non-AC" | "Single AC";
  capacity: number;
  occupancy: number;
  annualFee: number;
  status: "Available" | "Full" | "Maintenance";
}

export interface ResidentStudent {
  id: string;
  rollNo: string;
  name: string;
  department: string;
  roomNo: string;
  block: string;
  feeStatus: "Paid" | "Pending" | "Partial";
  contact: string;
  emergencyContact: string;
}

export interface GatePassRequest {
  id: string;
  rollNo: string;
  studentName: string;
  roomNo: string;
  passType: "Outing Pass" | "Home Leave" | "Maintenance Complaint";
  reason: string;
  fromDate: string;
  toDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Resolved";
}

export const INITIAL_ROOMS: HostelRoom[] = [
  {
    id: "RM-101",
    roomNo: "A-201",
    block: "Block A (Boys)",
    type: "2-Sharing AC",
    capacity: 2,
    occupancy: 2,
    annualFee: 95000,
    status: "Full",
  },
  {
    id: "RM-102",
    roomNo: "A-202",
    block: "Block A (Boys)",
    type: "2-Sharing Non-AC",
    capacity: 2,
    occupancy: 1,
    annualFee: 75000,
    status: "Available",
  },
  {
    id: "RM-103",
    roomNo: "B-105",
    block: "Block B (Girls)",
    type: "2-Sharing AC",
    capacity: 2,
    occupancy: 2,
    annualFee: 95000,
    status: "Full",
  },
  {
    id: "RM-104",
    roomNo: "B-106",
    block: "Block B (Girls)",
    type: "3-Sharing Non-AC",
    capacity: 3,
    occupancy: 2,
    annualFee: 65000,
    status: "Available",
  },
  {
    id: "RM-105",
    roomNo: "C-304",
    block: "Block C (PG Scholars)",
    type: "Single AC",
    capacity: 1,
    occupancy: 0,
    annualFee: 120000,
    status: "Maintenance",
  },
];

export const INITIAL_RESIDENTS: ResidentStudent[] = [
  {
    id: "RES-001",
    rollNo: "22CSE001",
    name: "Aarav Sharma",
    department: "CSE",
    roomNo: "A-201",
    block: "Block A (Boys)",
    feeStatus: "Paid",
    contact: "+91 9876543210",
    emergencyContact: "+91 9876500001",
  },
  {
    id: "RES-002",
    rollNo: "22ECE042",
    name: "Ananya Iyer",
    department: "ECE",
    roomNo: "B-105",
    block: "Block B (Girls)",
    feeStatus: "Paid",
    contact: "+91 9123456789",
    emergencyContact: "+91 9123400002",
  },
];

export const INITIAL_PASSES: GatePassRequest[] = [
  {
    id: "PASS-501",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    roomNo: "A-201",
    passType: "Home Leave",
    reason: "Family function during weekend",
    fromDate: "2026-08-02",
    toDate: "2026-08-04",
    status: "Pending",
  },
];

export async function fetchHostelRooms(): Promise<HostelRoom[]> {
  try {
    const res = await api.get("/api/hostel/rooms");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ROOMS;
}

export async function fetchHostelResidents(): Promise<ResidentStudent[]> {
  try {
    const res = await api.get("/api/hostel/residents");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_RESIDENTS;
}

export async function fetchGatePasses(): Promise<GatePassRequest[]> {
  try {
    const res = await api.get("/api/hostel/passes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_PASSES;
}

export async function createHostelRoom(data: Partial<HostelRoom>): Promise<HostelRoom> {
  try {
    const res = await api.post("/api/hostel/rooms", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `RM-${Math.floor(106 + Math.random() * 900)}`,
    roomNo: data.roomNo || "A-301",
    block: data.block || "Block A (Boys)",
    type: data.type || "2-Sharing AC",
    capacity: Number(data.capacity) || 2,
    occupancy: Number(data.occupancy) || 0,
    annualFee: Number(data.annualFee) || 95000,
    status: data.status || "Available",
  };
}

export async function updateGatePassStatus(id: string, status: GatePassRequest["status"]): Promise<boolean> {
  try {
    await api.put(`/api/hostel/passes/${id}`, { status });
  } catch {}
  return true;
}
