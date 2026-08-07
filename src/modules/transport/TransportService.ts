import api from "@/lib/api";

export interface BusRoute {
  id: string;
  routeNo?: string;
  routeName: string;
  busRegNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  passHoldersCount?: number;
  pickupStops?: string[];
  status?: "Active" | "Maintenance" | "Inactive";
}

export interface EnhancedBusRoute extends BusRoute {
  routeCode?: string;
  routeCategory?: string;
  category?: string;
  occupancyPercentage?: number;
  studentCount?: number;
  facultyCount?: number;
  waitingList?: number;
  activePassCount?: number;
  totalCapacity?: number;
  startPoint?: string;
  endPoint?: string;
  viaStops?: string[];
  monthlyFee?: number | string;
  estimatedTravelTime?: string;
  onTimePerformancePct?: number;
  avgDelay?: string;
  distanceKm?: number;
  fuelEfficiencyKmpl?: number;
  dailyTrips?: number;
  gpsStatus?: string;
  vehicleHealth?: "Optimal" | "Servicing Due" | "Critical" | "Good";
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  maintenanceDue?: string;
  inspectionStatus?: string;
  safetyRating?: string;
  complaintCount?: number;
}

export interface TransportPass {
  id: string;
  passId?: string;
  rollNo?: string;
  studentName?: string;
  department: string;
  routeNo?: string;
  pickupStop?: string;
  pickupPoint?: string;
  annualFee?: number;
  paymentStatus?: "Paid" | "Pending" | "Partial";
}

export interface EnhancedTransportPass extends TransportPass {
  userType?: "Student" | "Faculty" | "Staff";
  userName?: string;
  userRollNo?: string;
  passNumber?: string;
  routeName?: string;
  routeCode?: string;
  year?: string;
  dropPoint?: string;
  passType?: string;
  expiryDate?: string;
  renewalStatus?: string;
  academicYear?: string;
  passStatus?: "Active" | "Expired" | "Renewal Due" | "Blocked";
  feePaidAmount?: number;
  totalFeeAmount?: number;
  qrCodeData?: string;
  issuedDate?: string;
  validFrom?: string;
  validTill?: string;
}

export interface TransportConfig {
  academicYear?: string;
  workingDays?: string;
  holidaySchedule?: string;
  emergencyMode?: boolean;
  feeStructure: {
    singleZone: number;
    doubleZone: number;
    fullZone: number;
    staffAnnualFee: number;
    installmentRules?: string;
    refundPolicy?: string;
  };
  routeCategories: string[];
  transportPolicies: string;
  eligibilityRules: string;
  staffTransportPolicy: string;
  seatingCapacity?: number;
  preventiveMaintenancePolicy?: string;
  fuelConsumptionStandards: string;
  vehicleReplacementPolicy?: string;
  driverEligibility?: string;
  licenseVerification?: string;
  driverRotation?: string;
  maxWorkingHours?: number;
  healthCheckSchedule?: string;
  routeEligibility?: string;
  boardingRules?: string;
  passRenewalPolicy?: string;
  lostPassPolicy?: string;
  disciplineRules?: string;
  gpsConfig: string;
  gpsProvider?: string;
  liveTrackingPingSec?: number;
  routeDeviationAlertKm?: number;
  speedAlertLimitKmvh?: number;
  sosTracking?: string;
  routeDelayAlertMin?: number;
  breakdownAlerts?: boolean;
  passExpiryNotificationDays?: number;
  notificationRules: string;
  vehicleInspectionSchedule: string;
  driverComplianceRules: string;
  transportTimings: string;
  emergencyContacts: string;
  holidayTransportSchedule: string;
}

export interface VehicleComplianceItem {
  id: string;
  vehicleNo: string;
  busRegNo?: string;
  routeName: string;
  routeCode?: string;
  vehicleType: string;
  manufacturer: string;
  model: string;
  purchaseYear: number;
  seatingCapacity: number;
  assignedDriver: string;
  insuranceStatus: "Compliant" | "Expiring Soon" | "Expired";
  insuranceExpiry: string;
  insuranceExpiryDate?: string;
  permitStatus: "Compliant" | "Expiring Soon" | "Expired";
  permitExpiry: string;
  fitnessCertificate: "Compliant" | "Expiring Soon" | "Expired";
  fitnessExpiry: string;
  fitnessExpiryDate?: string;
  pollutionCertificate: "Compliant" | "Expiring Soon" | "Expired";
  pollutionExpiry: string;
  pollutionExpiryDate?: string;
  roadTaxStatus: "Compliant" | "Expiring Soon" | "Expired";
  fireExtinguisherStatus: "Compliant" | "Needs Refill";
  emergencyKitStatus: "Installed & Verified" | "Replenishment Due";
  gpsStatus: string;
  cctvStatus: string;
  lastServiceDate: string;
  nextServiceDate: string;
  maintenanceCost: string;
  breakdownHistory: string;
  tyreHealth: string;
  batteryHealth: string;
  vehicleHealth: "Healthy" | "Warning" | "Critical";
  status?: string;
  overallComplianceScore: number;
  safetyScore: number;
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
  dailyTrips: number;
  monthlyTrips: number;
  averageOccupancyPct: number;
  routeUtilization: number;
  peakTravelHours: string;
  averageDelay: string;
  peakRoutes: string;
  lowUsageRoutes: string;
  monthlyFuelCost: string;
  monthlyFuelCostFormatted?: string;
  monthlyMaintenanceCost: string;
  monthlyRevenue: string;
  annualRevenueFormatted?: string;
  pendingFees: string;
  revenueTrend: string;
  transportRevenue: string;
  vehiclesInService: number;
  vehiclesUnderMaintenance: number;
  idleVehicles: number;
  fleetAvailabilityPct: number;
  studentUsagePct: number;
  facultyUsagePct: number;
  tripsCompletedToday: number;
  vehicleDowntimePct: number;
  driverAttendancePct: number;
  driverPerformanceScore: string;
  safetyRatingPct: number;
  licenseExpiryAlertsCount: number;
  vehicleBreakdownsCount: number;
  speedViolationsCount: number;
  emergencyAlertsCount: number;
  gpsOfflineCount: number;
  securityIncidentsCount: number;
  avgMileageKmpl?: number;
  gpsUptimePct?: number;
  aiInsights: string[];
}

export interface PolicyGovernanceData {
  feePolicy: string;
  driverPolicy: string;
  studentEligibility: string;
  vehicleReplacementPolicy: string;
  emergencyTransportPolicy: string;
  governmentCompliancePct: number;
  insuranceCompliancePct: number;
  safetyCompliancePct: number;
  pollutionCompliancePct: number;
  lastFleetAudit: string;
  nextScheduledAudit: string;
  auditStatus: string;
  complianceScore: number;
  documents: {
    title: string;
    category: string;
    docNo: string;
    expiry: string;
    status: string;
  }[];
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
  date?: string;
  timestamp?: string;
  user?: string;
  action: string;
  performedBy?: string;
  details?: string;
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
  totalFleetBuses?: number;
  activePassHolders?: number;
  verifiedStudents?: number;
  verifiedFaculty?: number;
  avgOccupancyRate?: number;
}

export const INITIAL_ENHANCED_ROUTES: EnhancedBusRoute[] = [
  {
    id: "TR-101",
    routeNo: "Route 1",
    routeName: "Secunderabad Station ──> Campus via Jubilee Hills",
    routeCategory: "City Express",
    category: "City Express",
    busRegNo: "TS-09-UB-4589",
    driverName: "M. Ramakrishna",
    driverPhone: "+91 9848012345",
    capacity: 50,
    passHoldersCount: 48,
    occupancyPercentage: 96.0,
    studentCount: 42,
    facultyCount: 6,
    waitingList: 3,
    startPoint: "Secunderabad Station",
    endPoint: "Campus Gate 1",
    viaStops: ["Secunderabad Stn", "Paradise Circle", "Begumpet", "Jubilee Hills Checkpost", "Campus Gate 1"],
    pickupStops: ["Secunderabad Stn", "Paradise Circle", "Begumpet", "Jubilee Hills Checkpost", "Campus Gate 1"],
    distanceKm: 32,
    estimatedTravelTime: "55 Mins",
    onTimePerformancePct: 98.4,
    avgDelay: "3.5 Mins",
    monthlyFee: "₹2,200",
    fuelEfficiencyKmpl: 4.8,
    dailyTrips: 4,
    gpsStatus: "Online (100% Signal)",
    vehicleHealth: "Optimal",
    lastMaintenanceDate: "2026-07-15",
    nextMaintenanceDue: "2026-10-15",
    maintenanceDue: "Servicing Oct 2026",
    inspectionStatus: "Passed (Valid 2027)",
    safetyRating: "4.9 / 5.0",
    complaintCount: 1,
    status: "Active",
  },
  {
    id: "TR-102",
    routeNo: "Route 2",
    routeName: "LB Nagar ──> Campus via Dilsukhnagar & Malakpet",
    routeCategory: "Suburban Feeder",
    category: "Suburban Feeder",
    busRegNo: "TS-09-UB-7812",
    driverName: "S. Venkatesh",
    driverPhone: "+91 9848098765",
    capacity: 50,
    passHoldersCount: 50,
    occupancyPercentage: 100.0,
    studentCount: 45,
    facultyCount: 5,
    waitingList: 8,
    startPoint: "LB Nagar Ring Road",
    endPoint: "Campus Gate 2",
    viaStops: ["LB Nagar Ring Road", "Dilsukhnagar Metro", "Malakpet", "Koti", "Campus Gate 2"],
    pickupStops: ["LB Nagar Ring Road", "Dilsukhnagar Metro", "Malakpet", "Koti", "Campus Gate 2"],
    distanceKm: 28,
    estimatedTravelTime: "45 Mins",
    onTimePerformancePct: 99.1,
    avgDelay: "2.1 Mins",
    monthlyFee: "₹2,000",
    fuelEfficiencyKmpl: 5.1,
    dailyTrips: 4,
    gpsStatus: "Online (100% Signal)",
    vehicleHealth: "Optimal",
    lastMaintenanceDate: "2026-07-20",
    nextMaintenanceDue: "2026-11-20",
    maintenanceDue: "Servicing Nov 2026",
    inspectionStatus: "Passed (Valid 2027)",
    safetyRating: "5.0 / 5.0",
    complaintCount: 0,
    status: "Active",
  },
  {
    id: "TR-103",
    routeNo: "Route 3",
    routeName: "Kukatpally Housing Board ──> Campus via Hitec City",
    routeCategory: "Metro Link",
    category: "Metro Link",
    busRegNo: "TS-09-UB-2109",
    driverName: "K. Nageswara Rao",
    driverPhone: "+91 9848033344",
    capacity: 50,
    passHoldersCount: 42,
    occupancyPercentage: 84.0,
    studentCount: 38,
    facultyCount: 4,
    waitingList: 0,
    startPoint: "KPHB Colony",
    endPoint: "Campus Main Gate",
    viaStops: ["KPHB Colony", "JNTU Metro", "Hitec City Phase 2", "Gachibowli", "Campus Main Gate"],
    pickupStops: ["KPHB Colony", "JNTU Metro", "Hitec City Phase 2", "Gachibowli", "Campus Main Gate"],
    distanceKm: 24,
    estimatedTravelTime: "40 Mins",
    onTimePerformancePct: 96.2,
    avgDelay: "5.4 Mins",
    monthlyFee: "₹1,800",
    fuelEfficiencyKmpl: 4.5,
    dailyTrips: 4,
    gpsStatus: "Online (98% Signal)",
    vehicleHealth: "Servicing Due",
    lastMaintenanceDate: "2026-06-10",
    nextMaintenanceDue: "2026-08-25",
    maintenanceDue: "Brake Pad Check Due",
    inspectionStatus: "Passed (Valid 2027)",
    safetyRating: "4.8 / 5.0",
    complaintCount: 2,
    status: "Active",
  },
];

export const INITIAL_ROUTES = INITIAL_ENHANCED_ROUTES;

export const INITIAL_ENHANCED_PASSES: EnhancedTransportPass[] = [
  {
    id: "TP-501",
    passId: "PASS-2026-001",
    passNumber: "TP-2026-001",
    rollNo: "22CSE001",
    userRollNo: "22CSE001",
    studentName: "Aarav Sharma",
    userName: "Aarav Sharma",
    userType: "Student",
    department: "CSE",
    routeNo: "Route 1",
    routeCode: "RT-CSE-01",
    pickupStop: "Jubilee Hills Checkpost",
    annualFee: 32000,
    validFrom: "2026-08-01",
    validTill: "2027-05-31",
    expiryDate: "2027-05-31",
    renewalStatus: "Renewed",
    academicYear: "2026 - 2027",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-502",
    passId: "PASS-2026-042",
    passNumber: "TP-2026-042",
    rollNo: "22ECE042",
    userRollNo: "22ECE042",
    studentName: "Ananya Iyer",
    userName: "Ananya Iyer",
    userType: "Student",
    department: "ECE",
    routeNo: "Route 3",
    routeCode: "RT-MECH-03",
    pickupStop: "Hitec City Phase 2",
    annualFee: 35000,
    validFrom: "2026-08-01",
    validTill: "2027-05-31",
    expiryDate: "2027-05-31",
    renewalStatus: "Renewed",
    academicYear: "2026 - 2027",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-503",
    passId: "PASS-2026-108",
    passNumber: "TP-2026-108",
    rollNo: "FAC-8812",
    userRollNo: "FAC-8812",
    studentName: "Dr. K. Srinivas",
    userName: "Dr. K. Srinivas",
    userType: "Faculty",
    department: "Mechanical",
    year: "Faculty",
    routeNo: "Route 2",
    routeCode: "RT-ECE-02",
    pickupStop: "Dilsukhnagar Metro",
    dropPoint: "Campus Gate 2",
    passType: "Staff Special Shuttle Pass",
    annualFee: 28000,
    validFrom: "2026-08-01",
    validTill: "2027-05-31",
    expiryDate: "2027-05-31",
    renewalStatus: "Renewed",
    academicYear: "2026 - 2027",
    paymentStatus: "Paid",
    passStatus: "Active",
  },
  {
    id: "TP-504",
    passId: "PASS-2025-089",
    passNumber: "TP-2025-089",
    rollNo: "21CIVIL004",
    userRollNo: "21CIVIL004",
    studentName: "Manish Kumar",
    userName: "Manish Kumar",
    userType: "Student",
    department: "Civil",
    year: "4th Year",
    routeNo: "Route 1",
    routeCode: "RT-CSE-01",
    pickupStop: "Begumpet",
    dropPoint: "Campus Gate 1",
    passType: "Single Zone Standard Pass",
    annualFee: 32000,
    validFrom: "2025-08-01",
    validTill: "2026-07-31",
    expiryDate: "2026-07-31",
    renewalStatus: "Pending Renewal",
    academicYear: "2026 - 2027",
    paymentStatus: "Pending",
    passStatus: "Renewal Due",
  },
];

export const INITIAL_PASSES = INITIAL_ENHANCED_PASSES;

export const DEFAULT_TRANSPORT_CONFIG: TransportConfig = {
  academicYear: "2026 - 2027",
  workingDays: "Mon - Sat (6 Days / Week)",
  holidaySchedule: "No Sunday service except during end-semester exams",
  emergencyMode: false,
  feeStructure: {
    singleZone: 28000,
    doubleZone: 32000,
    fullZone: 35000,
    staffAnnualFee: 28000,
    installmentRules: "2 Installments allowed per academic year (50% per semester).",
    refundPolicy: "Pro-rata fee refund allowed within first 30 days of semester start.",
  },
  routeCategories: ["City Express", "Suburban Feeder", "Metro Link", "Staff Shuttle"],
  seatingCapacity: 50,
  preventiveMaintenancePolicy: "Quarterly engine overhaul & bi-monthly brake pad inspection.",
  fuelConsumptionStandards: "Target mileage: 5.0 Kmpl for heavy fleet. Monthly audit mandatory.",
  vehicleReplacementPolicy: "10 Years or 250,000 km operational threshold for fleet retirement.",
  driverEligibility: "Min 3 Years Heavy Commercial Driving License with clean traffic record.",
  licenseVerification: "Quarterly RTO online verification & annual driving test.",
  driverRotation: "Monthly route rotation to prevent fatigue.",
  maxWorkingHours: 8,
  healthCheckSchedule: "Bi-annual eye checkup & mandatory daily breathalyzer test.",
  routeEligibility: "Valid university transport pass holders only.",
  boardingRules: "Mandatory RFID card tapping at entry. Assigned boarding stops only.",
  passRenewalPolicy: "Annual auto-renewal upon academic fee clearance.",
  lostPassPolicy: "Duplicate pass issued upon payment of ₹200 processing fee.",
  disciplineRules: "Strict zero-tolerance policy for disturbance or unauthorized riders.",
  gpsConfig: "AIS-140 Compliant Dual SIM GPS with panic buttons integrated to Campus Security Command.",
  gpsProvider: "Telematics India AIS-140 Certified",
  liveTrackingPingSec: 1,
  routeDeviationAlertKm: 0.5,
  speedAlertLimitKmvh: 55,
  sosTracking: "Panic button linked to Campus Security Command Room",
  routeDelayAlertMin: 10,
  breakdownAlerts: true,
  passExpiryNotificationDays: 15,
  transportPolicies: "Mandatory RFID pass tapping at bus entry. Seat allotment strictly per pass number.",
  eligibilityRules: "All registered full-time students and university faculty with clearance slip.",
  staffTransportPolicy: "Reserved seating in Row 1 & 2 for teaching and administrative staff.",
  vehicleInspectionSchedule: "RTO Fitness Audit bi-annually. Daily 10-point safety check by supervisor.",
  driverComplianceRules: "Commercial Heavy Vehicle License valid >3 years. Zero-tolerance drug & breathalyzer policy.",
  transportTimings: "Morning Pickup: 7:15 AM - 8:15 AM | Evening Return: 4:45 PM & 6:15 PM.",
  emergencyContacts: "Transport Desk: +91 99000 44556 | Command Center: Ext 505 | RTO Helpline: 112.",
  holidayTransportSchedule: "No Sunday service except during end-semester examinations.",
  notificationRules: "Automated SMS alerts to pass holders 15 minutes before bus arrives at stop.",
};

export const INITIAL_VEHICLE_COMPLIANCE: VehicleComplianceItem[] = [
  {
    id: "VC-001",
    vehicleNo: "TS-09-UB-4589",
    busRegNo: "TS-09-UB-4589",
    routeName: "Route 1 (Secunderabad)",
    routeCode: "RT-CSE-01",
    vehicleType: "Heavy Commercial Bus 50-Seater",
    manufacturer: "Tata Motors",
    model: "Starbus Urban EX",
    purchaseYear: 2023,
    seatingCapacity: 50,
    assignedDriver: "M. Ramakrishna",
    insuranceStatus: "Compliant",
    insuranceExpiry: "2027-03-31",
    insuranceExpiryDate: "2027-03-31",
    permitStatus: "Compliant",
    permitExpiry: "2027-06-30",
    fitnessCertificate: "Compliant",
    fitnessExpiry: "2027-04-15",
    fitnessExpiryDate: "2027-04-15",
    pollutionCertificate: "Compliant",
    pollutionExpiry: "2026-12-31",
    pollutionExpiryDate: "2026-12-31",
    roadTaxStatus: "Compliant",
    fireExtinguisherStatus: "Compliant",
    emergencyKitStatus: "Installed & Verified",
    gpsStatus: "Online (100% Signal)",
    cctvStatus: "4/4 Active (HD Dome)",
    lastServiceDate: "2026-07-15",
    nextServiceDate: "2026-10-15",
    maintenanceCost: "₹24,500",
    breakdownHistory: "0 Incidents (6 Months)",
    tyreHealth: "92% Tread Depth",
    batteryHealth: "100% Optimal (12.8V)",
    vehicleHealth: "Healthy",
    status: "Compliant",
    overallComplianceScore: 98,
    safetyScore: 99,
  },
  {
    id: "VC-002",
    vehicleNo: "TS-09-UB-7812",
    busRegNo: "TS-09-UB-7812",
    routeName: "Route 2 (LB Nagar)",
    routeCode: "RT-ECE-02",
    vehicleType: "Heavy Commercial Bus 50-Seater",
    manufacturer: "Ashok Leyland",
    model: "Viking 225 HP BS-VI",
    purchaseYear: 2024,
    seatingCapacity: 50,
    assignedDriver: "S. Venkatesh",
    insuranceStatus: "Compliant",
    insuranceExpiry: "2027-02-28",
    insuranceExpiryDate: "2027-02-28",
    permitStatus: "Compliant",
    permitExpiry: "2027-05-31",
    fitnessCertificate: "Compliant",
    fitnessExpiry: "2027-03-20",
    fitnessExpiryDate: "2027-03-20",
    pollutionCertificate: "Compliant",
    pollutionExpiry: "2026-11-30",
    pollutionExpiryDate: "2026-11-30",
    roadTaxStatus: "Compliant",
    fireExtinguisherStatus: "Compliant",
    emergencyKitStatus: "Installed & Verified",
    gpsStatus: "Online (100% Signal)",
    cctvStatus: "4/4 Active (HD Dome)",
    lastServiceDate: "2026-07-20",
    nextServiceDate: "2026-11-20",
    maintenanceCost: "₹18,200",
    breakdownHistory: "0 Incidents (6 Months)",
    tyreHealth: "95% Tread Depth",
    batteryHealth: "100% Optimal (12.8V)",
    vehicleHealth: "Healthy",
    status: "Compliant",
    overallComplianceScore: 96,
    safetyScore: 98,
  },
  {
    id: "VC-003",
    vehicleNo: "TS-09-UB-2109",
    busRegNo: "TS-09-UB-2109",
    routeName: "Route 3 (KPHB)",
    routeCode: "RT-MECH-03",
    vehicleType: "Heavy Commercial Bus 50-Seater",
    manufacturer: "Eicher Motors",
    model: "Skyline Pro 3009",
    purchaseYear: 2022,
    seatingCapacity: 50,
    assignedDriver: "K. Nageswara Rao",
    insuranceStatus: "Expiring Soon",
    insuranceExpiry: "2026-09-15",
    insuranceExpiryDate: "2026-09-15",
    permitStatus: "Compliant",
    permitExpiry: "2027-01-31",
    fitnessCertificate: "Expiring Soon",
    fitnessExpiry: "2026-09-01",
    fitnessExpiryDate: "2026-09-01",
    pollutionCertificate: "Compliant",
    pollutionExpiry: "2026-10-31",
    pollutionExpiryDate: "2026-10-31",
    roadTaxStatus: "Compliant",
    fireExtinguisherStatus: "Compliant",
    emergencyKitStatus: "Replenishment Due",
    gpsStatus: "Online (98% Signal)",
    cctvStatus: "3/4 Active (1 Camera Maint)",
    lastServiceDate: "2026-06-10",
    nextServiceDate: "2026-08-25",
    maintenanceCost: "₹32,400",
    breakdownHistory: "1 Minor Hose Leak (June 2026)",
    tyreHealth: "78% Tread Depth",
    batteryHealth: "88% Good (12.4V)",
    vehicleHealth: "Warning",
    status: "Expiring Soon",
    overallComplianceScore: 85,
    safetyScore: 92,
  },
];

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
  dailyTrips: 48,
  monthlyTrips: 1248,
  averageOccupancyPct: 92.4,
  routeUtilization: 94.2,
  peakTravelHours: "07:15 - 08:30 AM & 04:45 - 06:00 PM",
  averageDelay: "3.5 Mins",
  peakRoutes: "Route 1 (Secunderabad - 96%) & Route 2 (LB Nagar - 100%)",
  lowUsageRoutes: "Route 5 (Outer Ring Road - 68%)",
  monthlyFuelCost: "₹4.25 Lakhs",
  monthlyFuelCostFormatted: "4.25 Lakhs",
  monthlyMaintenanceCost: "₹1.15 Lakhs",
  monthlyRevenue: "₹3.58 Cr",
  annualRevenueFormatted: "3.58 Cr",
  pendingFees: "₹8.4 Lakhs",
  revenueTrend: "+14.2% YoY Realization",
  transportRevenue: "₹3.58 Cr",
  vehiclesInService: 22,
  vehiclesUnderMaintenance: 2,
  idleVehicles: 0,
  fleetAvailabilityPct: 91.7,
  studentUsagePct: 92.8,
  facultyUsagePct: 7.2,
  tripsCompletedToday: 48,
  vehicleDowntimePct: 0.8,
  driverAttendancePct: 98.5,
  driverPerformanceScore: "4.9 / 5.0 Rating",
  safetyRatingPct: 99.2,
  licenseExpiryAlertsCount: 1,
  vehicleBreakdownsCount: 0,
  speedViolationsCount: 0,
  emergencyAlertsCount: 0,
  gpsOfflineCount: 0,
  securityIncidentsCount: 0,
  avgMileageKmpl: 4.8,
  gpsUptimePct: 100,
  aiInsights: [
    "Route 5 utilization is below average (68%). Recommend optimizing feeder stop intervals.",
    "Fuel consumption increased by 12% on Route 1 due to peak hour traffic congestion.",
    "Two vehicles (TS-09-UB-2109 & TS-09-UB-8812) require preventive maintenance before next term.",
    "Driver license for K. Nageswara Rao is expiring next month. RTO renewal initiated.",
    "Recommend adding 1 vehicle to Route 2 (LB Nagar) due to 100% full capacity & 8 waiting list students.",
  ],
};

export const DEFAULT_POLICY_GOVERNANCE: PolicyGovernanceData = {
  feePolicy: "Annual transport fee categorized by zone distance. 2 installments allowed per academic year. 30-day pro-rata refund policy.",
  driverPolicy: "Heavy Commercial License valid >3 years required. Mandatory quarterly RTO check and daily breathalyzer test before shift.",
  studentEligibility: "All full-time registered students and staff with valid RFID pass. Assigned boarding stops enforced strictly.",
  vehicleReplacementPolicy: "10 Years or 250,000 km threshold for heavy bus replacement. Bi-annual RTO fitness clearance mandatory.",
  emergencyTransportPolicy: "AIS-140 panic button linked 24/7 to Campus Command Room. Instant relief bus dispatch within 15 minutes.",
  governmentCompliancePct: 100,
  insuranceCompliancePct: 100,
  safetyCompliancePct: 98,
  pollutionCompliancePct: 96,
  lastFleetAudit: "July 15, 2026",
  nextScheduledAudit: "August 25, 2026",
  auditStatus: "Passed Grade A+ (100% Clear)",
  complianceScore: 98,
  documents: [
    { title: "Fleet Master RTO Registration Ledger", category: "Registration", docNo: "RTO-HYD-REG-2026", expiry: "2028-12-31", status: "Active" },
    { title: "Comprehensive Fleet Insurance Master Policy", category: "Insurance", docNo: "INS-UNI-99210", expiry: "2027-03-31", status: "Active" },
    { title: "Commercial State Permit Master Certificate", category: "Permit", docNo: "PERMIT-TS-8842", expiry: "2027-06-30", status: "Active" },
    { title: "Fleet Driver Commercial License Roster", category: "Driver License", docNo: "DL-ROSTER-2026", expiry: "2026-09-15", status: "Verification Due" },
  ],
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
    timestamp: "2026-08-04 16:00",
    user: "Mr. K. V. Subba Rao (Transport Manager)",
    performedBy: "Mr. K. V. Subba Rao (Transport Manager)",
    action: "Fleet Inspection Completed (All 24 Buses Verified)",
    category: "Inspection",
  },
  {
    id: "ACT-202",
    date: "2026-08-03 14:15",
    timestamp: "2026-08-03 14:15",
    user: "Safety & RTO Auditor",
    performedBy: "Safety & RTO Auditor",
    action: "RTO Fitness Certificate Renewed for Route 2 Bus",
    category: "Compliance",
  },
  {
    id: "ACT-203",
    date: "2026-08-02 11:30",
    timestamp: "2026-08-02 11:30",
    user: "Fleet Mechanics Lead",
    performedBy: "Fleet Mechanics Lead",
    action: "Vehicle Serviced & Oil Changed (TS-09-UB-4589)",
    category: "Maintenance",
  },
  {
    id: "ACT-204",
    date: "2026-08-01 09:00",
    timestamp: "2026-08-01 09:00",
    user: "GPS Telecom Lead",
    performedBy: "GPS Telecom Lead",
    action: "AIS-140 GPS Activated & Calibrated",
    category: "Technology",
  },
  {
    id: "ACT-205",
    date: "2026-07-31 16:45",
    timestamp: "2026-07-31 16:45",
    user: "Accounts Officer",
    performedBy: "Accounts Officer",
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
  totalFleetBuses: 24,
  activePassHolders: 1240,
  verifiedStudents: 1120,
  verifiedFaculty: 120,
  avgOccupancyRate: 94.2,
};

export async function fetchBusRoutes(): Promise<EnhancedBusRoute[]> {
  try {
    const res = await api.get("/api/transport/routes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ROUTES;
}

export async function fetchTransportPasses(): Promise<EnhancedTransportPass[]> {
  try {
    const res = await api.get("/api/transport/passes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_PASSES;
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
