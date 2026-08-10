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

// Default initial datasets as memory fallback and seed values
export interface HostelBlockInfo {
  id: string;
  name: string;
  capacity: number;
  occupiedRooms: number;
  vacantRooms: number;
  underMaintenance: number;
  occupancyPercentage: number;
  annualRevenue: number;
  currentWarden: string;
  healthStatus: "Healthy" | "Warning" | "Critical";
  roomUtilizationPercentage: number;
  maintenanceDue: string;
  inspectionDate: string;
  quickStatusBadge: "Healthy" | "Warning" | "Critical";
}

export interface EnhancedResidentStudent extends ResidentStudent {
  year: string;
  checkInDate: string;
  attendanceStatus: string;
  disciplinaryStatus: string;
  medicalAlerts: string;
  residentStatus: "Present" | "On Leave" | "Weekend Outing" | "Suspended";
  isInternational: boolean;
  isScholarship: boolean;
}

export interface GatePassSecurityMetrics {
  requestsToday: number;
  approved: number;
  rejected: number;
  pending: number;
  emergencyPasses: number;
  avgApprovalTime: string;
  securityIncidents: number;
  lateEntries: number;
  visitorRecords: number;
}

export interface ComplaintComplianceSummary {
  complaints: {
    open: number;
    inProgress: number;
    resolved: number;
    escalated: number;
  };
  compliance: {
    fireSafety: string;
    hostelRules: string;
    visitorRegister: string;
    securityAudit: string;
    inspectionStatus: string;
    governmentCompliance: string;
  };
}

export interface GatePassDetailItem {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  hostelBlock: string;
  passType: "Outing Pass" | "Home Leave" | "Emergency Pass";
  exitTime: string;
  expectedReturn: string;
  status: "Approved" | "Pending" | "Rejected" | "Late Return";
}

export interface HostelComplaintDetailItem {
  id: string;
  complaintId: string;
  studentName: string;
  hostelBlock: string;
  category: "Plumbing" | "Electrical" | "Wi-Fi Network" | "Furniture / Maintenance";
  priority: "High" | "Medium" | "Low";
  assignedWarden: string;
  status: "Open" | "In Progress" | "Resolved";
}

export interface ExecutiveHostelAnalyticsData {
  monthlyOccupancyTrend: { month: string; occupancyPct: number }[];
  hostelRevenue: string;
  maintenanceCost: string;
  messUtilization: string;
  studentSatisfaction: string;
  complaintTrend: string;
  gatePassStats: string;
  feeCollection: string;
  mostOccupiedHostel: string;
  leastOccupiedHostel: string;
  maintenanceTrend: string;
  inspectionReports: string;
}

export interface HostelConfig {
  feeStructure: {
    singleAc: number;
    doubleAc: number;
    doubleNonAc: number;
    tripleNonAc: number;
    cautionDeposit: number;
    messFeeAnnual: number;
  };
  roomCategories: string[];
  occupancyRules: string;
  checkInPolicy: string;
  checkOutPolicy: string;
  visitorPolicy: string;
  gatePassPolicy: string;
  lateEntryPolicy: string;
  hostelTimings: string;
  messTimings: string;
  fineRules: string;
  maintenanceSchedule: string;
  emergencyContacts: string;
  hostelHolidays: string;
  notificationRules: string;
}

export interface HostelHealthStatus {
  occupancyStatus: "Optimal" | "High" | "Critical";
  electricityStatus: "Operational" | "Grid Backup Active" | "Degraded";
  waterSupply: "Normal (98% Tank)" | "Maintenance Planned" | "Low Supply";
  wifiStatus: "1 Gbps Active" | "Partial Outage" | "Down";
  cctvStatus: "128/128 Cameras Active" | "2 Offline" | "Critical Fault";
  fireSafetyCompliance: "Compliant (Certified)" | "Audit Due" | "Non-Compliant";
  securityStatus: "24/7 Guarded" | "Understaffed" | "Alert Mode";
  maintenanceStatus: "Low Backlog" | "Moderate" | "High Backlog";
  overallHealthScore: number;
}

export interface MaintenanceSummary {
  pendingMaintenance: number;
  completedRepairs: number;
  criticalIssues: number;
  roomsUnderMaintenance: number;
  estimatedCompletion: string;
}

export interface HostelAlert {
  id: string;
  severity: "high" | "medium" | "info";
  title: string;
  description: string;
  timestamp: string;
}

export interface HostelActivityLog {
  id: string;
  date: string;
  user: string;
  action: string;
  category: string;
}

export interface HostelStaffSummary {
  chiefWarden: string;
  assistantWardensCount: number;
  securityStaffCount: number;
  maintenanceStaffCount: number;
  messSupervisor: string;
  staffAvailability: string;
  pendingLeaveRequests: number;
}

export interface PolicyComplianceStatus {
  fireSafetyStatus: "Valid (Expires Dec 2026)";
  governmentCompliance: "100% Certified";
  healthInspectionStatus: "Grade A+ (Passed July 2026)";
  buildingSafetyCertificate: "Valid (Renewal 2028)";
  insuranceStatus: "Active Comprehensive Cover";
  lastAuditDate: string;
}

export const INITIAL_BLOCKS: HostelBlockInfo[] = [
  {
    id: "BLK-01",
    name: "Block A (Boys)",
    capacity: 450,
    occupiedRooms: 433,
    vacantRooms: 17,
    underMaintenance: 0,
    occupancyPercentage: 96.2,
    annualRevenue: 40755000,
    currentWarden: "Dr. Rajesh Kumar",
    healthStatus: "Healthy",
    roomUtilizationPercentage: 96.2,
    maintenanceDue: "Water Tank Audit (Sunday)",
    inspectionDate: "2026-07-28",
    quickStatusBadge: "Healthy",
  },
  {
    id: "BLK-02",
    name: "Block B (Girls)",
    capacity: 400,
    occupiedRooms: 379,
    vacantRooms: 21,
    underMaintenance: 0,
    occupancyPercentage: 94.8,
    annualRevenue: 31200000,
    currentWarden: "Dr. Meenakshi Sundaram",
    healthStatus: "Healthy",
    roomUtilizationPercentage: 94.8,
    maintenanceDue: "HVAC Servicing Sep 2026",
    inspectionDate: "2026-07-25",
    quickStatusBadge: "Healthy",
  },
  {
    id: "BLK-03",
    name: "Block C (PG Scholars)",
    capacity: 150,
    occupiedRooms: 132,
    vacantRooms: 17,
    underMaintenance: 1,
    occupancyPercentage: 88.0,
    annualRevenue: 15840000,
    currentWarden: "Prof. Vikramaditya",
    healthStatus: "Warning",
    roomUtilizationPercentage: 88.0,
    maintenanceDue: "Room C-304 AC Repair",
    inspectionDate: "2026-07-30",
    quickStatusBadge: "Warning",
  },
];

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

export const DEFAULT_HOSTEL_CONFIG: HostelConfig = {
  feeStructure: {
    singleAc: 120000,
    doubleAc: 95000,
    doubleNonAc: 75000,
    tripleNonAc: 65000,
    cautionDeposit: 10000,
    messFeeAnnual: 42000,
  },
  roomCategories: ["Single AC", "2-Sharing AC", "2-Sharing Non-AC", "3-Sharing Non-AC"],
  occupancyRules: "Maximum 1 student per single room. Mandatory biometric check-in at block entry.",
  checkInPolicy: "New admissions check-in between 9:00 AM - 5:00 PM with verification slip.",
  checkOutPolicy: "Vacating requires NOC clearance from Library, Accounts & Hostel Warden.",
  visitorPolicy: "Parents & guardians permitted in visiting hall between 4:00 PM - 7:00 PM weekends only.",
  gatePassPolicy: "Emergency gate passes authorized by Chief Warden; weekend passes apply via ERP by Thursday 6:00 PM.",
  lateEntryPolicy: "Curfew at 9:30 PM. Late entry requires prior Warden approval & biometric logging.",
  hostelTimings: "Curfew: 9:30 PM (Boys & Girls Blocks). Study Quiet Hours: 10:00 PM - 6:00 AM.",
  messTimings: "Breakfast: 7:30 - 9:00 AM | Lunch: 12:30 - 2:00 PM | Dinner: 7:30 - 9:00 PM.",
  fineRules: "Late entry fine: ₹500/instance. Property damage cost + 20% penalty. Mess card loss: ₹200.",
  maintenanceSchedule: "Weekly water tank audit every Sunday. HVAC servicing quarterly. Electrical safety monthly.",
  emergencyContacts: "Chief Warden: +91 99000 11223 | Security Desk: +91 99000 11224 | Health Clinic: Ext. 404.",
  hostelHolidays: "Diwali Break (Nov 1-5), Winter Break (Dec 22-Jan 2), Summer Vacation (May 15-Jun 30).",
  notificationRules: "Automated SMS to parent on late curfew breach. Email alerts for fee dues 15 days prior.",
};

export const DEFAULT_HOSTEL_HEALTH: HostelHealthStatus = {
  occupancyStatus: "Optimal",
  electricityStatus: "Operational",
  waterSupply: "Normal (98% Tank)",
  wifiStatus: "1 Gbps Active",
  cctvStatus: "128/128 Cameras Active",
  fireSafetyCompliance: "Compliant (Certified)",
  securityStatus: "24/7 Guarded",
  maintenanceStatus: "Low Backlog",
  overallHealthScore: 96,
};

export const DEFAULT_MAINTENANCE_SUMMARY: MaintenanceSummary = {
  pendingMaintenance: 3,
  completedRepairs: 48,
  criticalIssues: 0,
  roomsUnderMaintenance: 1,
  estimatedCompletion: "24 Hours (Room C-304 AC Repair)",
};

export const INITIAL_ALERTS: HostelAlert[] = [
  {
    id: "ALT-101",
    severity: "high",
    title: "Students not returned before hostel curfew",
    description: "3 students delayed return past 9:30 PM curfew in Block A (Boys).",
    timestamp: "30 Mins ago",
  },
  {
    id: "ALT-102",
    severity: "medium",
    title: "High complaint volume in Block B",
    description: "4 pending Wi-Fi connectivity tickets reported in Girls Block B 2nd floor.",
    timestamp: "2 Hours ago",
  },
  {
    id: "ALT-103",
    severity: "info",
    title: "Fire safety inspection due",
    description: "Quarterly fire extinguisher & hydrant audit due in 12 days for Block C.",
    timestamp: "4 Hours ago",
  },
  {
    id: "ALT-104",
    severity: "high",
    title: "CCTV offline in Block C",
    description: "Camera #C-12 in Block C main entrance offline for scheduled maintenance.",
    timestamp: "1 Hour ago",
  },
  {
    id: "ALT-105",
    severity: "medium",
    title: "Visitor register pending verification",
    description: "2 evening visitor entry logs pending warden counter-signature verification.",
    timestamp: "3 Hours ago",
  },
];

export const INITIAL_ACTIVITIES: HostelActivityLog[] = [
  {
    id: "ACT-001",
    date: "2026-08-05 13:30",
    user: "System Automated Sync",
    action: "Gate Pass Statistics Updated",
    category: "Gate Pass",
  },
  {
    id: "ACT-002",
    date: "2026-08-05 11:15",
    user: "Safety Inspection Committee",
    action: "Hostel Inspection Completed",
    category: "Inspection",
  },
  {
    id: "ACT-003",
    date: "2026-08-04 15:45",
    user: "Fire Safety Auditor",
    action: "Fire Safety Audit Completed",
    category: "Compliance",
  },
  {
    id: "ACT-004",
    date: "2026-08-04 10:20",
    user: "Warden Office",
    action: "Complaint Summary Updated",
    category: "Complaints",
  },
  {
    id: "ACT-005",
    date: "2026-08-03 16:00",
    user: "Super Admin",
    action: "Security Report Generated",
    category: "Security",
  },
  {
    id: "ACT-006",
    date: "2026-08-03 09:30",
    user: "Biometric Security System",
    action: "Visitor Log Synced",
    category: "Visitor",
  },
];

export const DEFAULT_STAFF_SUMMARY: HostelStaffSummary = {
  chiefWarden: "Dr. Rajesh Kumar (Prof. Mechanical)",
  assistantWardensCount: 6,
  securityStaffCount: 18,
  maintenanceStaffCount: 12,
  messSupervisor: "Mr. Suresh Hegde",
  staffAvailability: "100% On Duty (All shifts manned)",
  pendingLeaveRequests: 1,
};

export const DEFAULT_POLICY_COMPLIANCE: PolicyComplianceStatus = {
  fireSafetyStatus: "Valid (Expires Dec 2026)",
  governmentCompliance: "100% Certified",
  healthInspectionStatus: "Grade A+ (Passed July 2026)",
  buildingSafetyCertificate: "Valid (Renewal 2028)",
  insuranceStatus: "Active Comprehensive Cover",
  lastAuditDate: "2026-07-28",
};

// Warden API Implementations

export async function fetchHostelRooms(): Promise<HostelRoom[]> {
  try {
    const res = await api.get("/api/hostel/rooms");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ROOMS;
}

export async function fetchHostelResidents(): Promise<EnhancedResidentStudent[]> {
  try {
    const res = await api.get("/api/hostel/residents");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return ENHANCED_RESIDENTS;
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
