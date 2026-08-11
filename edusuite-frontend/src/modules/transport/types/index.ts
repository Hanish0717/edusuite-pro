// =============================================================================
// TRANSPORT MODULE V2 TYPES
// =============================================================================

export interface TransportRoute {
  id: string;
  routeName: string;
  routeCode: string;
  startPoint: string;
  destination: string;
  totalDistanceKm: number;
  totalDurationMin: number;
  totalStops: number;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  fareMonthly: number;
  occupancy: string;
  capacity: number;
  status: "Active" | "Maintenance" | "Inactive";
}

export interface TransportVehicle {
  id: string;
  busNumber: string;
  model: string;
  registrationNumber: string;
  capacity: number;
  fuelType: "Diesel" | "Electric" | "CNG";
  currentKm: number;
  lastServiceDate: string;
  nextServiceDue: string;
  insuranceExpiry: string;
  fitnessCertificateExpiry: string;
  status: "Operational" | "Under Repair" | "Out of Service";
}

export interface TransportDriver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  assignedVehicleId?: string;
  status: "Active" | "On Leave" | "Suspended";
}

export interface TransportPass {
  id: string;
  passNumber: string;
  userId: string;
  userName: string;
  userType: "Student" | "Faculty" | "Staff";
  department: string;
  routeId: string;
  routeName: string;
  pickupStop: string;
  validFrom: string;
  validTo: string;
  feeAmount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  qrCode: string;
  status: "Active" | "Expired" | "Cancelled";
}

export interface RouteCreatePayload {
  routeName: string;
  routeCode: string;
  startPoint: string;
  destination: string;
  busNumber: string;
  driverName: string;
  fareMonthly: number;
  capacity: number;
}

export interface BusPassIssuePayload {
  userId: string;
  userName: string;
  userType: "Student" | "Faculty" | "Staff";
  department: string;
  routeId: string;
  pickupStop: string;
  validTo: string;
  feeAmount: number;
}
