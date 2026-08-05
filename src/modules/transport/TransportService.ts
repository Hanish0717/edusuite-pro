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

export const INITIAL_ROUTES: BusRoute[] = [
  {
    id: "TR-101",
    routeNo: "Route 1",
    routeName: "Secunderabad Station ──> Campus via Jubilee Hills",
    busRegNo: "TS-09-UB-4589",
    driverName: "M. Ramakrishna",
    driverPhone: "+91 9848012345",
    capacity: 50,
    passHoldersCount: 48,
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
    pickupStops: ["KPHB Colony", "JNTU Metro", "Hitec City Phase 2", "Gachibowli", "Campus Main Gate"],
    status: "Active",
  },
];

export const INITIAL_PASSES: TransportPass[] = [
  {
    id: "TP-501",
    passId: "PASS-2026-001",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    department: "CSE",
    routeNo: "Route 1",
    pickupStop: "Jubilee Hills Checkpost",
    annualFee: 32000,
    paymentStatus: "Paid",
  },
  {
    id: "TP-502",
    passId: "PASS-2026-042",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    department: "ECE",
    routeNo: "Route 3",
    pickupStop: "Hitec City Phase 2",
    annualFee: 35000,
    paymentStatus: "Paid",
  },
];

export async function fetchBusRoutes(): Promise<BusRoute[]> {
  try {
    const res = await api.get("/api/transport/routes");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ROUTES;
}

export async function fetchTransportPasses(): Promise<TransportPass[]> {
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
