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

// ----------------------------------------------------
// Warden API Implementations
// ----------------------------------------------------

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
