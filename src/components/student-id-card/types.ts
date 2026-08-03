export type IdCardStatus = "Active" | "Lost" | "Under Verification" | "Reprinting";

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Completed";

export interface StudentIdCardData {
  studentId: string;
  rollNumber: string;
  registrationNumber: string;
  name: string;
  avatarUrl: string;
  initials: string;
  department: string;
  departmentCode: string;
  course: string;
  degree: string;
  year: string;
  semester: number;
  section: string;
  bloodGroup: string;
  dob: string;
  validTill: string;
  status: IdCardStatus;
  
  // Contacts & Addresses
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  parentContact: {
    fatherName: string;
    fatherPhone: string;
  };
  
  // Identifiers & Services
  libraryId: string;
  hostelStatus: string;
  transportStatus: string;
  
  // Signatures & Barcodes
  studentSignatureText: string;
  principalSignatureText: string;
  barcodeValue: string;
  qrCodeValue: string;
  
  // Institution Meta
  collegeName: string;
  collegeLogoText: string;
  collegeAddress: string;
  collegePhone: string;
  collegeEmail: string;
  instructions: string[];
}

export interface IdCardRequest {
  requestId: string;
  studentId: string;
  requestType: "Lost ID Card" | "Request Correction" | "Request Reprint";
  submittedDate: string;
  status: RequestStatus;
  assignedTo: "Librarian";
  details: string;
  remarks?: string;
  expectedCompletionDate?: string;
}

export interface IdCardHistoryItem {
  id: string;
  title: string;
  date: string;
  actor: string;
  statusBadge: string;
  description: string;
}
