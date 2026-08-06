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
  status: "Pending" | "Approved" | "Rejected" | "Resolved" | "Completed";
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
  {
    id: "RM-106",
    roomNo: "A-305",
    block: "Block A (Boys)",
    type: "3-Sharing Non-AC",
    capacity: 3,
    occupancy: 3,
    annualFee: 45000,
    status: "Full",
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
  {
    id: "RES-003",
    rollNo: "22CS101",
    name: "K. Sai Teja",
    department: "Computer Science & Engg",
    roomNo: "A-305",
    block: "Block A (Boys)",
    feeStatus: "Paid",
    contact: "+91 98765 43220",
    emergencyContact: "+91 98490 12345",
  },
];

export const DEFAULT_SECURITY_METRICS: GatePassSecurityMetrics = {
  requestsToday: 18,
  approved: 14,
  rejected: 2,
  pending: 2,
  emergencyPasses: 3,
  avgApprovalTime: "45 Mins",
  securityIncidents: 0,
  lateEntries: 4,
  visitorRecords: 24,
};

export const INITIAL_GATE_PASS_DETAILS: GatePassDetailItem[] = [
  {
    id: "GPD-101",
    studentName: "Aarav Sharma",
    rollNo: "22CSE001",
    department: "Computer Science",
    hostelBlock: "Block A (Boys)",
    passType: "Home Leave",
    exitTime: "2026-08-02 09:00 AM",
    expectedReturn: "2026-08-04 08:00 PM",
    status: "Approved",
  },
  {
    id: "GPD-102",
    studentName: "Priya Nair",
    rollNo: "24CIVIL009",
    department: "Civil Engineering",
    hostelBlock: "Block B (Girls)",
    passType: "Outing Pass",
    exitTime: "2026-08-04 04:30 PM",
    expectedReturn: "2026-08-04 08:30 PM",
    status: "Pending",
  },
  {
    id: "GPD-103",
    studentName: "Rohan Verma",
    rollNo: "23MECH018",
    department: "Mechanical",
    hostelBlock: "Block A (Boys)",
    passType: "Outing Pass",
    exitTime: "2026-08-03 05:00 PM",
    expectedReturn: "2026-08-03 08:30 PM",
    status: "Late Return",
  },
  {
    id: "GPD-104",
    studentName: "Ananya Iyer",
    rollNo: "22ECE042",
    department: "Electronics",
    hostelBlock: "Block B (Girls)",
    passType: "Emergency Pass",
    exitTime: "2026-08-05 10:15 AM",
    expectedReturn: "2026-08-05 06:00 PM",
    status: "Approved",
  },
  {
    id: "GPD-105",
    studentName: "Vikram Malhotra",
    rollNo: "23AIDS012",
    department: "AI & Data Science",
    hostelBlock: "Block C (PG Scholars)",
    passType: "Outing Pass",
    exitTime: "2026-08-05 02:00 PM",
    expectedReturn: "2026-08-05 07:00 PM",
    status: "Rejected",
  },
];

export const INITIAL_COMPLAINT_DETAILS: HostelComplaintDetailItem[] = [
  {
    id: "CMP-001",
    complaintId: "CMP-2026-084",
    studentName: "Rohan Verma",
    hostelBlock: "Block A (Boys)",
    category: "Plumbing",
    priority: "High",
    assignedWarden: "Dr. Rajesh Kumar",
    status: "In Progress",
  },
  {
    id: "CMP-002",
    complaintId: "CMP-2026-089",
    studentName: "Priya Nair",
    hostelBlock: "Block B (Girls)",
    category: "Wi-Fi Network",
    priority: "Medium",
    assignedWarden: "Dr. Meenakshi Sundaram",
    status: "Open",
  },
  {
    id: "CMP-003",
    complaintId: "CMP-2026-072",
    studentName: "Aarav Sharma",
    hostelBlock: "Block A (Boys)",
    category: "Electrical",
    priority: "Low",
    assignedWarden: "Dr. Rajesh Kumar",
    status: "Resolved",
  },
  {
    id: "CMP-004",
    complaintId: "CMP-2026-091",
    studentName: "Siddharth Nambiar",
    hostelBlock: "Block C (PG Scholars)",
    category: "Furniture / Maintenance",
    priority: "High",
    assignedWarden: "Prof. Vikramaditya",
    status: "In Progress",
  },
  {
    id: "CMP-005",
    complaintId: "CMP-2026-065",
    studentName: "Ananya Iyer",
    hostelBlock: "Block B (Girls)",
    category: "Plumbing",
    priority: "Low",
    assignedWarden: "Dr. Meenakshi Sundaram",
    status: "Resolved",
  },
];

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

export const INITIAL_RESIDENTS: ResidentStudent[] = ENHANCED_RESIDENTS;

// Complete default student database structure
const DEFAULT_STUDENT_DB = {
  roomDetails: {
    roomNumber: "A-305",
    block: "Boys Hostel - Block A",
    floor: "3rd Floor",
    roomType: "Triple Sharing (AC)",
    capacity: 3,
    occupancy: 2,
    hostelSince: "15 Aug 2024",
    expectedCheckout: "31 May 2027",
    status: "Active & Occupied",
    roommates: [
      {
        id: "rm-101",
        name: "Rahul Sharma",
        department: "Computer Science & Engg",
        semester: "Semester 5",
        contact: "+91 98765 43210",
        avatar: "RS",
        rollNo: "24CSE108",
      },
      {
        id: "rm-102",
        name: "Vamsi Krishna",
        department: "Electronics & Comm Engg",
        semester: "Semester 5",
        contact: "+91 98765 43211",
        avatar: "VK",
        rollNo: "24ECE042",
      },
    ],
  },
  hostelInfo: {
    name: "Boys Hostel - Block A",
    address: "EduSuite Pro Campus, Sector 4, Academic City, University Road",
    wardenName: "Dr. S. Ramesh",
    assistantWarden: "Mr. M. Pattnaik",
    officeTiming: "09:00 AM - 06:00 PM (Mon - Sat)",
    emergencyContact: "+91 94444 12345 / 040-27891234",
    amenities: {
      wifi: "High-Speed 100Mbps Fiber Access (24/7)",
      laundry: "Bi-weekly complimentary washing (Tues & Fri)",
      water: "24/7 RO Purified Drinking & Hot Utility Water",
      powerBackup: "100% Dual DG Set Automatic Backup",
      medicalRoom: "In-house 24/7 Nurse Station & First-Aid Desk",
    },
  },
  messPlan: "Veg Plan",
  pendingFee: 22500,
  gatePasses: [
    {
      id: "gp-001",
      refId: "GP-2026-8841",
      purpose: "Weekend Home Visit",
      destination: "Hyderabad (Home)",
      outDate: "2026-08-08",
      outTime: "05:00 PM",
      returnDate: "2026-08-10",
      returnTime: "08:00 PM",
      guardianApproval: "Verified via SMS Call (+91 98490 12345)",
      status: "Approved",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-2026-8841-A305",
    },
    {
      id: "gp-002",
      refId: "GP-2026-7210",
      purpose: "Local Outing & Books Purchase",
      destination: "City Center Mall",
      outDate: "2026-07-28",
      outTime: "02:00 PM",
      returnDate: "2026-07-28",
      returnTime: "08:30 PM",
      guardianApproval: "Self Approved (Local)",
      status: "Completed",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-2026-7210-COMPLETED",
    },
  ],
  complaints: [
    {
      id: "cmp-001",
      ticketNo: "HST-CMP-409",
      category: "Electricity",
      priority: "High",
      description: "Study table tube light flickering constantly in Room A-305.",
      status: "In Progress",
      assignedStaff: "Electrician Kumar (Ext: 402)",
      dateRaised: "2026-07-31",
    },
  ],
  maintenanceRequests: [
    {
      id: "maint-101",
      reqNo: "MAINT-882",
      item: "Geyser Power Switch Switchboard",
      category: "Electricity",
      status: "In Progress",
      assignedStaff: "Electrician Kumar",
      date: "2026-08-01",
    },
  ],
  feeReceipts: [
    {
      receiptNo: "RCP-HST-2026-001",
      date: "10 Jul 2026",
      amount: "₹22,500",
      term: "Autumn Semester 2026 (Part 1)",
      status: "Paid",
      downloadUrl: "#",
    },
  ],
  visitors: [
    {
      id: "vis-1",
      visitorName: "Ramesh Sharma",
      relationship: "Father",
      date: "2026-07-28",
      inTime: "10:30 AM",
      outTime: "01:15 PM",
      approvedBy: "Warden Office",
      verificationStatus: "Verified",
    },
  ],
  notices: [
    {
      id: "hn-1",
      title: "Overhead Water Tank Cleaning & Sanitization",
      category: "Maintenance",
      date: "Today",
      priority: "High",
      description: "Water supply in Block A & B will be suspended between 06:00 AM and 09:00 AM this Saturday due to tank cleaning.",
    },
  ],
  emergencyAlert: false,
};

// Unified database model containing everything
interface UnifiedHostelDB {
  rooms: HostelRoom[];
  residents: ResidentStudent[];
  studentDb: typeof DEFAULT_STUDENT_DB;
}

// Safe LocalStorage access helper
function getDb(): UnifiedHostelDB {
  if (typeof window === "undefined") {
    return {
      rooms: INITIAL_ROOMS,
      residents: INITIAL_RESIDENTS,
      studentDb: DEFAULT_STUDENT_DB,
    };
  }

  const data = localStorage.getItem("EDUSUITE_HOSTEL_DB");
  if (!data) {
    const defaultData: UnifiedHostelDB = {
      rooms: INITIAL_ROOMS,
      residents: INITIAL_RESIDENTS,
      studentDb: DEFAULT_STUDENT_DB,
    };
    localStorage.setItem("EDUSUITE_HOSTEL_DB", JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return {
      rooms: INITIAL_ROOMS,
      residents: INITIAL_RESIDENTS,
      studentDb: DEFAULT_STUDENT_DB,
    };
  }
}

function saveDb(db: UnifiedHostelDB) {
  if (typeof window !== "undefined") {
    localStorage.setItem("EDUSUITE_HOSTEL_DB", JSON.stringify(db));
  }
}

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

export async function fetchHostelRooms(): Promise<HostelRoom[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const res = await api.get("/api/hostel/rooms");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return getDb().rooms;
}

export async function fetchHostelResidents(): Promise<ResidentStudent[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const res = await api.get("/api/hostel/residents");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return getDb().residents;
}

export async function fetchGatePasses(): Promise<GatePassRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const res = await api.get("/api/hostel/passes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}

  const db = getDb();
  // Map Student gate passes to Warden GatePassRequest layout
  const mappedPasses: GatePassRequest[] = db.studentDb.gatePasses.map((p) => ({
    id: p.id,
    rollNo: "22CS101",
    studentName: "K. Sai Teja",
    roomNo: "A-305",
    passType: p.purpose.includes("Home") ? "Home Leave" : "Outing Pass",
    reason: `${p.destination} - ${p.purpose}`,
    fromDate: p.outDate,
    toDate: p.returnDate,
    status: p.status as any,
  }));

  // Combine with initial static passes if not present
  return [...mappedPasses, ...INITIAL_PASSES];
}

export async function createHostelRoom(data: Partial<HostelRoom>): Promise<HostelRoom> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const res = await api.post("/api/hostel/rooms", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const db = getDb();
  const newRoom: HostelRoom = {
    id: `RM-${Math.floor(106 + Math.random() * 900)}`,
    roomNo: data.roomNo || "A-301",
    block: data.block || "Block A (Boys)",
    type: data.type || "2-Sharing AC",
    capacity: Number(data.capacity) || 2,
    occupancy: Number(data.occupancy) || 0,
    annualFee: Number(data.annualFee) || 95000,
    status: data.status || "Available",
  };

  db.rooms = [newRoom, ...db.rooms];
  saveDb(db);
  return newRoom;
}

export async function updateGatePassStatus(id: string, status: GatePassRequest["status"]): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  try {
    await api.put(`/api/hostel/passes/${id}`, { status });
  } catch {}

  const db = getDb();
  // Update studentDb gate pass
  db.studentDb.gatePasses = db.studentDb.gatePasses.map((p) =>
    p.id === id ? { ...p, status: status as any } : p
  );
  saveDb(db);
  return true;
}

// ----------------------------------------------------
// Student API Implementations
// ----------------------------------------------------

export async function fetchStudentHostelData() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return getDb().studentDb;
}

export async function applyHostelLeave(leaveForm: {
  startDate: string;
  endDate: string;
  reason: string;
  destinationAddress: string;
  parentPhone: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();
  
  // Submit leave as a gate pass request automatically marked as Pending
  const newPass = {
    id: `gp-${Date.now()}`,
    refId: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    purpose: `Leave: ${leaveForm.reason}`,
    destination: leaveForm.destinationAddress,
    outDate: leaveForm.startDate,
    outTime: "08:00 AM",
    returnDate: leaveForm.endDate,
    returnTime: "08:00 PM",
    guardianApproval: `Pending call validation to parent phone (${leaveForm.parentPhone})`,
    status: "Pending" as const,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-LEAVE-PENDING`,
  };

  db.studentDb.gatePasses = [newPass, ...db.studentDb.gatePasses];
  saveDb(db);
  return newPass;
}

export async function submitGatePass(gatePassForm: {
  purpose: string;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  guardianContact: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();

  // Validate student fee eligibility: if there's any pending fee, block pass generation
  if (db.studentDb.pendingFee > 0) {
    throw new Error("Cannot generate gate pass: outstanding hostel fee balance must be paid first.");
  }

  const newPass = {
    id: `gp-${Date.now()}`,
    refId: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    purpose: gatePassForm.purpose,
    destination: gatePassForm.destination,
    outDate: gatePassForm.outDate,
    outTime: gatePassForm.outTime,
    returnDate: gatePassForm.returnDate,
    returnTime: gatePassForm.returnTime,
    guardianApproval: `Verified via Parent SMS (${gatePassForm.guardianContact})`,
    status: "Approved" as const, // Approved by default or pending review
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  db.studentDb.gatePasses = [newPass, ...db.studentDb.gatePasses];
  saveDb(db);
  return newPass;
}

export async function submitComplaint(complaintForm: {
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  description: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();

  const newComplaint = {
    id: `cmp-${Date.now()}`,
    ticketNo: `HST-CMP-${Math.floor(100 + Math.random() * 900)}`,
    category: complaintForm.category,
    priority: complaintForm.priority,
    description: complaintForm.description,
    status: "In Progress" as const,
    assignedStaff: `${complaintForm.category} Desk Supervisor`,
    dateRaised: new Date().toISOString().split("T")[0],
  };

  db.studentDb.complaints = [newComplaint, ...db.studentDb.complaints];
  saveDb(db);
  return newComplaint;
}

export async function submitMaintenanceRequest(maintForm: {
  item: string;
  category: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();

  const newMaint = {
    id: `maint-${Date.now()}`,
    reqNo: `MAINT-${Math.floor(500 + Math.random() * 500)}`,
    item: maintForm.item,
    category: maintForm.category,
    status: "Pending" as const,
    assignedStaff: "Campus Maintenance Unit",
    date: new Date().toISOString().split("T")[0],
  };

  db.studentDb.maintenanceRequests = [newMaint, ...db.studentDb.maintenanceRequests];
  saveDb(db);
  return newMaint;
}

export async function submitMealFeedback(feedback: {
  mealType: string;
  rating: number;
  comments: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Emulates feedback validation. We can save a log if needed.
  return true;
}

export async function changeMessPlan(newPlan: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();
  db.studentDb.messPlan = newPlan;
  saveDb(db);
  return newPlan;
}

export async function payHostelFee(paymentInfo: {
  amount: string;
  term: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const db = getDb();

  const newReceipt = {
    receiptNo: `RCP-HST-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    amount: paymentInfo.amount,
    term: paymentInfo.term,
    status: "Paid" as const,
    downloadUrl: "#",
  };

  db.studentDb.feeReceipts = [newReceipt, ...db.studentDb.feeReceipts];
  db.studentDb.pendingFee = 0; // Cleared outstanding fee
  saveDb(db);
  return newReceipt;
}

export async function addVisitorRecord(visitorForm: {
  visitorName: string;
  relationship: string;
  date: string;
  inTime: string;
  outTime: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const db = getDb();

  const newVisitor = {
    id: `vis-${Date.now()}`,
    visitorName: visitorForm.visitorName,
    relationship: visitorForm.relationship,
    date: visitorForm.date,
    inTime: visitorForm.inTime,
    outTime: visitorForm.outTime,
    approvedBy: "Warden Office",
    verificationStatus: "Verified" as const,
  };

  db.studentDb.visitors = [newVisitor, ...db.studentDb.visitors];
  saveDb(db);
  return newVisitor;
}

export async function triggerEmergencySOS() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const db = getDb();
  db.studentDb.emergencyAlert = true;
  saveDb(db);
  return true;
}
