import api from "@/lib/api";

export interface PlacementDrive {
  id: string;
  companyName: string;
  jobRole: string;
  ctcLpa: number;
  eligibleDepts: string[];
  driveDate: string;
  location: string;
  totalApplicants: number;
  selectedCount: number;
  status: "Upcoming" | "Ongoing" | "Completed";
}

export interface PlacedStudent {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  companyName: string;
  jobRole: string;
  ctcLpa: number;
  offerLetterStatus: "Issued" | "Pending Verification" | "Accepted";
}

export const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: "DRV-101",
    companyName: "Google India",
    jobRole: "Software Development Engineer (SDE-1)",
    ctcLpa: 32.5,
    eligibleDepts: ["CSE", "ECE", "AI&DS"],
    driveDate: "2026-08-12",
    location: "Campus Auditorium & Virtual",
    totalApplicants: 180,
    selectedCount: 8,
    status: "Upcoming",
  },
  {
    id: "DRV-102",
    companyName: "Microsoft Corp",
    jobRole: "Cloud Solution Architect & AI Engineer",
    ctcLpa: 45.0,
    eligibleDepts: ["CSE", "AI&DS"],
    driveDate: "2026-08-18",
    location: "Innovation Hub",
    totalApplicants: 140,
    selectedCount: 5,
    status: "Upcoming",
  },
  {
    id: "DRV-103",
    companyName: "TCS Digital / Ninja",
    jobRole: "Systems Engineer & Systems Specialist",
    ctcLpa: 9.0,
    eligibleDepts: ["CSE", "ECE", "ME", "AI&DS", "Biotech"],
    driveDate: "2026-07-28",
    location: "Campus On-line Labs",
    totalApplicants: 420,
    selectedCount: 85,
    status: "Completed",
  },
];

export const INITIAL_PLACED: PlacedStudent[] = [
  {
    id: "PL-501",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    companyName: "Microsoft Corp",
    jobRole: "Cloud Solution Architect",
    ctcLpa: 45.0,
    offerLetterStatus: "Issued",
  },
  {
    id: "PL-502",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    companyName: "Texas Instruments",
    jobRole: "VLSI Hardware Engineer",
    ctcLpa: 28.0,
    offerLetterStatus: "Accepted",
  },
];

export async function fetchPlacementDrives(): Promise<PlacementDrive[]> {
  try {
    const res = await api.get("/api/placement/drives");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_DRIVES;
}

export async function fetchPlacedStudents(): Promise<PlacedStudent[]> {
  try {
    const res = await api.get("/api/placement/placed-students");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_PLACED;
}

export async function createPlacementDrive(data: Partial<PlacementDrive>): Promise<PlacementDrive> {
  try {
    const res = await api.post("/api/placement/drives", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `DRV-${Math.floor(104 + Math.random() * 900)}`,
    companyName: data.companyName || "Amazon Web Services",
    jobRole: data.jobRole || "Cloud Systems Engineer",
    ctcLpa: Number(data.ctcLpa) || 18.0,
    eligibleDepts: data.eligibleDepts || ["CSE", "ECE", "AI&DS"],
    driveDate: data.driveDate || "2026-08-25",
    location: data.location || "Campus Placement Block",
    totalApplicants: 120,
    selectedCount: 0,
    status: "Upcoming",
  };
}

export async function addPlacedStudentOffer(data: Partial<PlacedStudent>): Promise<PlacedStudent> {
  try {
    const res = await api.post("/api/placement/placed-students", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `PL-${Math.floor(503 + Math.random() * 900)}`,
    rollNo: data.rollNo || "22AIDS012",
    studentName: data.studentName || "Rohan Varma",
    department: data.department || "AI&DS",
    companyName: data.companyName || "Google India",
    jobRole: data.jobRole || "SDE-1",
    ctcLpa: Number(data.ctcLpa) || 32.5,
    offerLetterStatus: "Issued",
  };
}
