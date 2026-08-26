export interface Roommate {
  id: string;
  name: string;
  department: string;
  semester: string;
  contact: string;
  avatar: string;
  rollNo: string;
}

export interface RoomDetails {
  roomNumber: string;
  block: string;
  floor: string;
  roomType: string;
  capacity: number;
  occupancy: number;
  hostelSince: string;
  expectedCheckout: string;
  status: string;
  roommates: Roommate[];
}

export interface HostelInfo {
  name: string;
  address: string;
  wardenName: string;
  assistantWarden: string;
  officeTiming: string;
  emergencyContact: string;
  amenities: {
    wifi: string;
    laundry: string;
    water: string;
    powerBackup: string;
    medicalRoom: string;
  };
}

export interface MessMenu {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface GatePassRecord {
  id: string;
  refId: string;
  purpose: string;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  guardianApproval: string;
  status: "Approved" | "Pending" | "Expired" | "Completed";
  qrCodeUrl: string;
}

export interface ComplaintRecord {
  id: string;
  ticketNo: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  assignedStaff: string;
  dateRaised: string;
  resolutionDate?: string;
}

export interface MaintenanceRequest {
  id: string;
  reqNo: string;
  item: string;
  category: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedStaff: string;
  date: string;
}

export interface FeeReceipt {
  receiptNo: string;
  date: string;
  amount: string;
  term: string;
  status: "Paid" | "Pending" | "Overdue";
  downloadUrl: string;
}

export interface VisitorRecord {
  id: string;
  visitorName: string;
  relationship: string;
  date: string;
  inTime: string;
  outTime: string;
  approvedBy: string;
  verificationStatus: "Verified" | "Pending";
}

export interface HostelNotice {
  id: string;
  title: string;
  category: "Mess" | "Maintenance" | "Inspection" | "Events" | "General";
  date: string;
  priority: "Normal" | "High" | "Urgent" | "Low";
  description: string;
}
