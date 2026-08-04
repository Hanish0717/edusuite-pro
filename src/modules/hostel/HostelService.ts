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

export const ENHANCED_RESIDENTS: EnhancedResidentStudent[] = [
  {
    id: "RES-001",
    rollNo: "22CSE001",
    name: "Aarav Sharma",
    department: "CSE",
    year: "3rd Year",
    roomNo: "A-201",
    block: "Block A (Boys)",
    checkInDate: "2024-08-01",
    feeStatus: "Paid",
    attendanceStatus: "98% Present",
    disciplinaryStatus: "Clean Record",
    contact: "+91 9876543210",
    emergencyContact: "+91 9876500001",
    medicalAlerts: "None",
    residentStatus: "Present",
    isInternational: false,
    isScholarship: true,
  },
  {
    id: "RES-002",
    rollNo: "22ECE042",
    name: "Ananya Iyer",
    department: "ECE",
    year: "3rd Year",
    roomNo: "B-105",
    block: "Block B (Girls)",
    checkInDate: "2024-08-02",
    feeStatus: "Paid",
    attendanceStatus: "96% Present",
    disciplinaryStatus: "Clean Record",
    contact: "+91 9123456789",
    emergencyContact: "+91 9123400002",
    medicalAlerts: "Asthma (Inhaler in Room)",
    residentStatus: "Present",
    isInternational: false,
    isScholarship: false,
  },
  {
    id: "RES-003",
    rollNo: "23MECH018",
    name: "Rohan Verma",
    department: "Mechanical",
    year: "2nd Year",
    roomNo: "A-202",
    block: "Block A (Boys)",
    checkInDate: "2025-07-25",
    feeStatus: "Paid",
    attendanceStatus: "92% Present",
    disciplinaryStatus: "Clean Record",
    contact: "+91 9811223344",
    emergencyContact: "+91 9811220000",
    medicalAlerts: "None",
    residentStatus: "Weekend Outing",
    isInternational: false,
    isScholarship: true,
  },
  {
    id: "RES-004",
    rollNo: "24CIVIL009",
    name: "Priya Nair",
    department: "Civil",
    year: "1st Year",
    roomNo: "B-106",
    block: "Block B (Girls)",
    checkInDate: "2025-08-10",
    feeStatus: "Partial",
    attendanceStatus: "95% Present",
    disciplinaryStatus: "Clean Record",
    contact: "+91 9744556677",
    emergencyContact: "+91 9744550000",
    medicalAlerts: "Dust Allergy",
    residentStatus: "On Leave",
    isInternational: true,
    isScholarship: false,
  },
];

export const DEFAULT_SECURITY_METRICS: GatePassSecurityMetrics = {
  requestsToday: 18,
  approved: 14,
  rejected: 2,
  pending: 2,
  avgApprovalTime: "45 Mins",
  securityIncidents: 0,
  lateEntries: 3,
  visitorRecords: 24,
};

export const DEFAULT_COMPLAINT_COMPLIANCE: ComplaintComplianceSummary = {
  complaints: {
    open: 2,
    inProgress: 3,
    resolved: 48,
    escalated: 0,
  },
  compliance: {
    fireSafety: "100% Certified (Valid Dec 2026)",
    hostelRules: "Fully Compliant",
    visitorRegister: "Biometric & Digital Logged",
    securityAudit: "Grade A+ (Passed July 2026)",
    inspectionStatus: "Passed Municipal Audit",
    governmentCompliance: "100% Certified",
  },
};

export const DEFAULT_ANALYTICS: ExecutiveHostelAnalyticsData = {
  monthlyOccupancyTrend: [
    { month: "Jan", occupancyPct: 92.4 },
    { month: "Feb", occupancyPct: 93.1 },
    { month: "Mar", occupancyPct: 94.0 },
    { month: "Apr", occupancyPct: 94.5 },
    { month: "May", occupancyPct: 91.2 },
    { month: "Jun", occupancyPct: 88.0 },
    { month: "Jul", occupancyPct: 93.8 },
    { month: "Aug", occupancyPct: 94.8 },
  ],
  hostelRevenue: "₹8.78 Cr",
  maintenanceCost: "₹12.4 Lakhs",
  messUtilization: "96.5%",
  studentSatisfaction: "4.8 / 5.0",
  complaintTrend: "-15% MoM Decrease",
  gatePassStats: "428 Passes Issued / Month",
  feeCollection: "98.2% Realized",
  mostOccupiedHostel: "Block A (Boys Hostel - 96.2%)",
  leastOccupiedHostel: "Block C (PG Scholars - 88.0%)",
  maintenanceTrend: "Low Backlog (Avg 24h SLA)",
  inspectionReports: "3/3 Audits Passed (100%)",
};

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
    status: "Approved",
  },
  {
    id: "PASS-502",
    rollNo: "24CIVIL009",
    studentName: "Priya Nair",
    roomNo: "B-106",
    passType: "Outing Pass",
    reason: "Project research equipment procurement",
    fromDate: "2026-08-04",
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
    severity: "medium",
    title: "Hostel Block A at 98% occupancy",
    description: "Block A (Boys) has reached 98% occupancy capacity.",
    timestamp: "2 Hours ago",
  },
  {
    id: "ALT-102",
    severity: "high",
    title: "Fire Safety Inspection Due",
    description: "Annual municipal fire audit due in 12 days for Block C.",
    timestamp: "1 Day ago",
  },
  {
    id: "ALT-103",
    severity: "info",
    title: "Water Maintenance Scheduled",
    description: "Overhead tank cleaning scheduled for Block A on Sunday 6:00 AM - 9:00 AM.",
    timestamp: "5 Hours ago",
  },
  {
    id: "ALT-104",
    severity: "medium",
    title: "Internet Outage in Block C",
    description: "Fiber line switch failure reported in PG Scholars Block C.",
    timestamp: "3 Hours ago",
  },
  {
    id: "ALT-105",
    severity: "info",
    title: "Hostel Fee Collection Pending",
    description: "Semester fee dues pending for 18 resident scholars.",
    timestamp: "2 Days ago",
  },
  {
    id: "ALT-106",
    severity: "medium",
    title: "Security Audit Due",
    description: "Quarterly CCTV & perimeter security audit scheduled for next week.",
    timestamp: "3 Days ago",
  },
];

export const INITIAL_ACTIVITIES: HostelActivityLog[] = [
  {
    id: "ACT-001",
    date: "2026-08-04 14:30",
    user: "Dr. Rajesh Kumar (Chief Warden)",
    action: "Occupancy Audit Completed",
    category: "Audit",
  },
  {
    id: "ACT-002",
    date: "2026-08-03 11:15",
    user: "Estate Maintenance Lead",
    action: "Room Maintenance Completed (A-104 AC Repair)",
    category: "Maintenance",
  },
  {
    id: "ACT-003",
    date: "2026-08-02 09:00",
    user: "Super Admin",
    action: "New Hostel Block Opened (Block C PG Annex)",
    category: "Infrastructure",
  },
  {
    id: "ACT-004",
    date: "2026-08-01 16:45",
    user: "Safety Auditor",
    action: "Security & CCTV Audit Conducted",
    category: "Safety",
  },
  {
    id: "ACT-005",
    date: "2026-07-31 10:20",
    user: "Mess Committee Chair",
    action: "Mess Menu Updated & Nutrition Approved",
    category: "Mess",
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
