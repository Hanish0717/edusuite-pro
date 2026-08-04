import api from "@/lib/api";

export interface BusRoute {
  id: string;
  routeNo: string;
  routeName: string;
  busRegNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  passHoldersCount: number;
  pickupStops: string[];
  status: "Active" | "Maintenance" | "Inactive";
}

export interface EnhancedBusRoute extends BusRoute {
  occupancyPercentage: number;
  distanceKm: number;
  fuelEfficiencyKmpl: number;
  gpsStatus: string;
  vehicleHealth: "Optimal" | "Servicing Due" | "Critical";
  maintenanceDue: string;
  inspectionStatus: string;
}

export interface TransportPass {
  id: string;
  passId: string;
  rollNo: string;
  studentName: string;
  department: string;
  routeNo: string;
  pickupStop: string;
  annualFee: number;
  paymentStatus: "Paid" | "Pending" | "Partial";
}

export interface EnhancedTransportPass extends TransportPass {
  userType: "Student" | "Faculty";
  year: string;
  expiryDate: string;
  passStatus: "Active" | "Expired" | "Renewal Due" | "Blocked";
}

export interface TransportConfig {
  feeStructure: {
    singleZone: number;
    doubleZone: number;
    fullZone: number;
    staffAnnualFee: number;
  };
  routeCategories: string[];
  transportPolicies: string;
  eligibilityRules: string;
  staffTransportPolicy: string;
  gpsConfig: string;
  fuelConsumptionStandards: string;
  vehicleInspectionSchedule: string;
  driverComplianceRules: string;
  transportTimings: string;
  emergencyContacts: string;
  notificationRules: string;
  holidayTransportSchedule: string;
}

export interface FleetHealthCompliance {
  vehicleHealthScore: number;
  insuranceExpiry: string;
  permitStatus: string;
  pollutionCertificate: string;
  fitnessCertificate: string;
  maintenanceSchedule: string;
  gpsStatus: string;
  emergencyKitStatus: string;
  fireExtinguisherStatus: string;
  roadTaxStatus: string;
}

export interface ExecutiveTransportAnalyticsData {
  routeUtilization: number;
  peakRoutes: string;
  lowUsageRoutes: string;
  monthlyFuelCost: string;
  monthlyMaintenanceCost: string;
  transportRevenue: string;
  studentUsagePct: number;
  facultyUsagePct: number;
  averageOccupancyPct: number;
  tripsCompletedToday: number;
  vehicleDowntimePct: number;
}

export interface TransportAlert {
  id: string;
  severity: "high" | "medium" | "info";
  title: string;
  description: string;
  timestamp: string;
}

export interface TransportActivityLog {
  id: string;
  date: string;
  user: string;
  action: string;
  category: string;
}

export interface TransportStaffSummary {
  transportManager: string;
  fleetSupervisorsCount: number;
  driversCount: number;
  mechanicsCount: number;
  supportStaffCount: number;
  staffAvailability: string;
  pendingLeaveRequests: number;
}

export const INITIAL_ENHANCED_ROUTES: EnhancedBusRoute[] = [
  {
    id: "TR-101",
    routeNo: "Route 1",
    routeName: "Secunderabad Station ──> Campus via Jubilee Hills",
    busRegNo: "TS-09-UB-4589",
    driverName: "M. Ramakrishna",
    driverPhone: "+91 9848012345",
    capacity: 50,
    passHoldersCount: 48,
    occupancyPercentage: 96.0,
    distanceKm: 32,
    fuelEfficiencyKmpl: 4.8,
    gpsStatus: "Online (100% Signal)",
    vehicleHealth: "Optimal",
    maintenanceDue: "Servicing Oct 2026",
    inspectionStatus: "Passed (Valid 2027)",
    pickupStops: ["Secunderabad Stn", "Paradise Circle", "Begumpet", "Jubilee Hills Checkpost", "Campus Gate 1"],
    status: "Active",
  },
  {
    id: "TR-102",
    routeNo: "Route 2",
    routeName: "LB Nagar ──> Campus via Dilsukhnagar & Malakpet",
    busRegNo: "TS-09-UB-7812",
    driverName: "S. Venkatesh",
    driverPhone: "+91 9848098765",
    capacity: 50,
    passHoldersCount: 50,
    occupancyPercentage: 100.0,
    distanceKm: 28,
    fuelEfficiencyKmpl: 5.1,
    gpsStatus: "Online (100% Signal)",
    vehicleHealth: "Optimal",
    maintenanceDue: "Servicing Nov 2026",
    inspectionStatus: "Passed (Valid 2027)",
    pickupStops: ["LB Nagar Ring Road", "Dilsukhnagar Metro", "Malakpet", "Koti", "Campus Gate 2"],
    status: "Active",
  },
  {
    id: "TR-103",
    routeNo: "Route 3",
    routeName: "Kukatpally Housing Board ──> Campus via Hitec City",
    busRegNo: "TS-09-UB-2109",
    driverName: "K. Nageswara Rao",
    driverPhone: "+91 9848033344",
    capacity: 50,
    passHoldersCount: 42,
    occupancyPercentage: 84.0,
    distanceKm: 24,
    fuelEfficiencyKmpl: 4.5,
    gpsStatus: "Online (98% Signal)",
    vehicleHealth: "Servicing Due",
    maintenanceDue: "Brake Pad Check Due",
    inspectionStatus: "Passed (Valid 2027)",
    pickupStops: ["KPHB Colony", "JNTU Metro", "Hitec City Phase 2", "Gachibowli", "Campus Main Gate"],
    status: "Active",
  },
];

export const INITIAL_ENHANCED_PASSES: EnhancedTransportPass[] = [
  {
    id: "TP-501",
    passId: "PASS-2026-001",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    userType: "Student",
    department: "CSE",
    year: "3rd Year",
    routeNo: "Route 1",
    pickupStop: "Jubilee Hills Checkpost",
    annualFee: 32000,
    expiryDate: "2027-05-31",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-502",
    passId: "PASS-2026-042",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    userType: "Student",
    department: "ECE",
    year: "3rd Year",
    routeNo: "Route 3",
    pickupStop: "Hitec City Phase 2",
    annualFee: 35000,
    expiryDate: "2027-05-31",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-503",
    passId: "PASS-2026-108",
    rollNo: "FAC-8812",
    studentName: "Dr. K. Srinivas",
    userType: "Faculty",
    department: "Mechanical",
    year: "Faculty",
    routeNo: "Route 2",
    pickupStop: "Dilsukhnagar Metro",
    annualFee: 28000,
    expiryDate: "2027-05-31",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-504",
    passId: "PASS-2025-089",
    rollNo: "21CIVIL004",
    studentName: "Manish Kumar",
    userType: "Student",
    department: "Civil",
    year: "4th Year",
    routeNo: "Route 1",
    pickupStop: "Begumpet",
    annualFee: 32000,
    expiryDate: "2026-07-31",
    paymentStatus: "Pending",
    passStatus: "Renewal Due",
  },
];

export const DEFAULT_TRANSPORT_CONFIG: TransportConfig = {
  feeStructure: {
    singleZone: 28000,
    doubleZone: 32000,
    fullZone: 35000,
    staffAnnualFee: 28000,
  },
  routeCategories: ["City Express", "Suburban Feeder", "Metro Link", "Staff Shuttle"],
  transportPolicies: "Mandatory RFID pass tapping at bus entry. Seat allotment strictly per pass number.",
  eligibilityRules: "All registered full-time students and university faculty with clearance slip.",
  staffTransportPolicy: "Reserved seating in Row 1 & 2 for teaching and administrative staff.",
  gpsConfig: "AIS-140 Compliant Dual SIM GPS with panic buttons integrated to Campus Security Command.",
  fuelConsumptionStandards: "Target mileage: 5.0 Kmpl for heavy buses. Monthly audit mandatory.",
  vehicleInspectionSchedule: "RTO Fitness Audit bi-annually. Daily 10-point safety check by supervisor.",
  driverComplianceRules: "Commercial Heavy Vehicle License valid >3 years. Zero-tolerance drug & breathalyzer policy.",
  transportTimings: "Morning Pickup: 7:15 AM - 8:15 AM | Evening Return: 4:45 PM & 6:15 PM.",
  emergencyContacts: "Transport Desk: +91 99000 44556 | Command Center: Ext 505 | RTO Helpline: 112.",
  holidayTransportSchedule: "No Sunday service except during end-semester examinations.",
  notificationRules: "Automated SMS alerts to pass holders 15 minutes before bus arrives at stop.",
};

export const DEFAULT_FLEET_HEALTH: FleetHealthCompliance = {
  vehicleHealthScore: 96,
  insuranceExpiry: "2027-03-31 (100% Active)",
  permitStatus: "Valid Commercial RTO Permit",
  pollutionCertificate: "Valid BS-VI Certified",
  fitnessCertificate: "Valid RTO Fitness Clearance",
  maintenanceSchedule: "Quarterly Servicing Compliant",
  gpsStatus: "24/24 Units Active & Tracking",
  emergencyKitStatus: "First Aid Kit Installed (100%)",
  fireExtinguisherStatus: "Inspected & Certified (Dec 2026)",
  roadTaxStatus: "Paid (Valid Dec 2026)",
};

export const DEFAULT_ANALYTICS: ExecutiveTransportAnalyticsData = {
  routeUtilization: 92.4,
  peakRoutes: "Route 1 (Secunderabad) & Route 2 (LB Nagar)",
  lowUsageRoutes: "Route 5 (Outer Ring Road - 68%)",
  monthlyFuelCost: "₹4.25 Lakhs",
  monthlyMaintenanceCost: "₹1.15 Lakhs",
  transportRevenue: "₹3.58 Cr",
  studentUsagePct: 92.8,
  facultyUsagePct: 7.2,
  averageOccupancyPct: 92.4,
  tripsCompletedToday: 48,
  vehicleDowntimePct: 0.8,
};

export const INITIAL_ALERTS: TransportAlert[] = [
  {
    id: "ALT-301",
    severity: "medium",
    title: "Vehicle Maintenance Due",
    description: "Bus TS-09-UB-2109 (Route 3) due for brake pad & clutch servicing.",
    timestamp: "2 Hours ago",
  },
  {
    id: "ALT-302",
    severity: "info",
    title: "Insurance Renewal Expiring Soon",
    description: "Policy for 4 fleet vehicles renewal due in 35 days.",
    timestamp: "5 Hours ago",
  },
  {
    id: "ALT-303",
    severity: "high",
    title: "Driver License Renewal Due",
    description: "Driver K. Nageswara Rao commercial license renewal due next month.",
    timestamp: "1 Day ago",
  },
  {
    id: "ALT-304",
    severity: "info",
    title: "GPS Firmware Update Scheduled",
    description: "Over-the-air AIS-140 GPS module patch scheduled for Sunday midnight.",
    timestamp: "2 Days ago",
  },
  {
    id: "ALT-305",
    severity: "medium",
    title: "High Fuel Consumption Alert",
    description: "Route 1 bus recorded 4.2 Kmpl (target 5.0 Kmpl) due to traffic congestion.",
    timestamp: "3 Days ago",
  },
];

export const INITIAL_ACTIVITIES: TransportActivityLog[] = [
  {
    id: "ACT-201",
    date: "2026-08-04 16:00",
    user: "Mr. K. V. Subba Rao (Transport Manager)",
    action: "Fleet Inspection Completed (All 24 Buses Verified)",
    category: "Inspection",
  },
  {
    id: "ACT-202",
    date: "2026-08-03 14:15",
    user: "Safety & RTO Auditor",
    action: "RTO Fitness Certificate Renewed for Route 2 Bus",
    category: "Compliance",
  },
  {
    id: "ACT-203",
    date: "2026-08-02 11:30",
    user: "Fleet Mechanics Lead",
    action: "Vehicle Serviced & Oil Changed (TS-09-UB-4589)",
    category: "Maintenance",
  },
  {
    id: "ACT-204",
    date: "2026-08-01 09:00",
    user: "GPS Telecom Lead",
    action: "AIS-140 GPS Activated & Calibrated",
    category: "Technology",
  },
  {
    id: "ACT-205",
    date: "2026-07-31 16:45",
    user: "Accounts Officer",
    action: "Fuel Audit Completed & Monthly Allowance Approved",
    category: "Audit",
  },
];

export const DEFAULT_STAFF_SUMMARY: TransportStaffSummary = {
  transportManager: "Mr. K. V. Subba Rao (Chief Transport Officer)",
  fleetSupervisorsCount: 3,
  driversCount: 24,
  mechanicsCount: 6,
  supportStaffCount: 8,
  staffAvailability: "100% On Duty (All routes covered)",
  pendingLeaveRequests: 1,
};

export async function fetchBusRoutes(): Promise<BusRoute[]> {
  try {
    const res = await api.get("/api/transport/routes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ENHANCED_ROUTES;
}

export async function fetchTransportPasses(): Promise<TransportPass[]> {
  try {
    const res = await api.get("/api/transport/passes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ENHANCED_PASSES;
}

export async function createBusRoute(data: Partial<BusRoute>): Promise<BusRoute> {
  try {
    const res = await api.post("/api/transport/routes", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `TR-${Math.floor(104 + Math.random() * 900)}`,
    routeNo: data.routeNo || `Route ${Math.floor(4 + Math.random() * 10)}`,
    routeName: data.routeName || "City Center ──> Campus",
    busRegNo: data.busRegNo || "TS-09-UB-9999",
    driverName: data.driverName || "Driver Name",
    driverPhone: data.driverPhone || "+91 9848000000",
    capacity: Number(data.capacity) || 50,
    passHoldersCount: 0,
    pickupStops: data.pickupStops || ["Stop 1", "Stop 2", "Campus"],
    status: "Active",
  };
}

export async function issueTransportPass(data: Partial<TransportPass>): Promise<TransportPass> {
  try {
    const res = await api.post("/api/transport/passes", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `TP-${Math.floor(503 + Math.random() * 900)}`,
    passId: `PASS-2026-${Math.floor(100 + Math.random() * 900)}`,
    rollNo: data.rollNo || "23ME014",
    studentName: data.studentName || "Vikram Aditya",
    department: data.department || "ME",
    routeNo: data.routeNo || "Route 1",
    pickupStop: data.pickupStop || "Begumpet",
    annualFee: Number(data.annualFee) || 32000,
    paymentStatus: "Paid",
  };
}
