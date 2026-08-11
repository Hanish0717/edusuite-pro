// =============================================================================
// HOSTEL MODULE V2 TYPES
// =============================================================================

export interface HostelBlock {
  id: string;
  blockName: string;
  gender: "Boys" | "Girls" | "Co-Ed";
  wardenName: string;
  wardenPhone: string;
  totalFloors: number;
  totalRooms: number;
  totalCapacity: number;
  occupiedBeds: number;
  availableBeds: number;
  status: "Active" | "Maintenance";
}

export interface HostelRoom {
  id: string;
  blockId: string;
  blockName: string;
  roomNumber: string;
  floor: number;
  roomType: "Single AC" | "Double Non-AC" | "Triple Non-AC" | "Four Sharing";
  capacity: number;
  occupied: number;
  status: "Available" | "Full" | "Under Maintenance";
  annualFee: number;
}

export interface BedAllocation {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: string;
  blockId: string;
  blockName: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  allocatedDate: string;
  feeStatus: "Paid" | "Pending";
}

export interface OutingPass {
  id: string;
  passNumber: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  blockName: string;
  roomNumber: string;
  outingType: "Local Outing" | "Night Out" | "Vacation";
  purpose: string;
  outTime: string;
  expectedInTime: string;
  actualInTime?: string;
  parentConsent: "Approved" | "Pending" | "Not Required";
  status: "Requested" | "Approved" | "Rejected" | "Completed" | "Overdue";
}

export interface HostelComplaint {
  id: string;
  complaintNumber: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: "Plumbing" | "Electrical" | "Furniture" | "Cleanliness" | "Internet";
  description: string;
  priority: "Low" | "Medium" | "High" | "Emergency";
  reportedDate: string;
  resolvedDate?: string;
  status: "Open" | "In Progress" | "Resolved";
}

export interface RoomAllocationPayload {
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  year: string;
  blockId: string;
  roomId: string;
  bedNumber: string;
}

export interface OutingRequestPayload {
  studentId: string;
  studentName: string;
  rollNo: string;
  blockName: string;
  roomNumber: string;
  outingType: "Local Outing" | "Night Out" | "Vacation";
  purpose: string;
  outTime: string;
  expectedInTime: string;
}
