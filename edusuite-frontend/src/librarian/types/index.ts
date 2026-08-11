// Centralized TypeScript Type Definitions for Library & Librarian ERP Module

export type DepartmentCode =
  | "CSE"
  | "ECE"
  | "MECH"
  | "CIVIL"
  | "EEE"
  | "IT"
  | "AI_ML"
  | "DATA_SCIENCE"
  | "BASIC_SCIENCES"
  | "HUMANITIES";

export type BookCategory =
  | "Computer Science"
  | "Software Engineering"
  | "Electronics"
  | "Electrical"
  | "Mechanical"
  | "Civil"
  | "Mathematics"
  | "Physics"
  | "Engineering"
  | "General"
  | "Reference"
  | "Periodical";

export type BookStatus = "Active" | "Archived" | "Under Maintenance" | "Lost" | "Damaged";

export type BookSource = "Acquisition" | "Donation" | "Grant" | "Manual";

export type MemberType = "Student" | "Faculty" | "Staff" | "Research Scholar" | "Guest";

export type MemberStatus = "Active" | "Suspended" | "Expired" | "Blocked";

export type LoanStatus = "Active" | "Returned" | "Overdue" | "Renewed" | "Lost";

export type FineStatus = "Paid" | "Unpaid" | "Waived" | "Partial";

export type ReservationStatus = "Pending" | "Fulfilled" | "Cancelled" | "Expired";

export interface BookLocation {
  building: string;
  floor: string;
  rack: string;
  shelf: string;
}

export interface BookCopy {
  copyId: string;
  accessionNo: string;
  barcode: string;
  rfidTag?: string;
  status: "Available" | "Issued" | "Reserved" | "Maintenance" | "Lost" | "Damaged";
  condition: "Mint" | "Good" | "Slightly Worn" | "Damaged";
  location: BookLocation;
  borrowerId?: string;
  borrowerName?: string;
  dueDate?: string;
}

export interface Book {
  id: string;
  accessionNo: string; // Master Accession # e.g. GMRIT/2024/0001
  barcode?: string;
  qrCode?: string;
  title: string;
  authors: string[];
  isbn: string;
  category: BookCategory | string;
  subject: string;
  publisher: string;
  publishedYear: number;
  edition: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  reservedCopies: number;
  lostCopies: number;
  damagedCopies: number;
  location: BookLocation;
  callNumber: string;
  price: number;
  status: BookStatus;
  source: BookSource;
  addedBy: string;
  tags: string[];
  coverUrl?: string;
  description?: string;
}

export interface LibraryMember {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  role: MemberType;
  department: string;
  status: MemberStatus;
  maxAllowedBooks: number;
  currentIssuedBooks: number;
  totalFinesDue: number;
  rfidCardNo?: string;
  barcodeNo?: string;
  joinDate: string;
  expiryDate: string;
  profileImage?: string;
}

export interface IssueRecord {
  id: string;
  transactionId: string;
  bookId: string;
  bookTitle: string;
  accessionNo: string;
  barcode: string;
  memberId: string;
  memberName: string;
  memberSourceId?: string;
  memberRole: MemberType;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  returnedAt?: string;
  status: LoanStatus;
  issuedBy: string;
  receivedBy?: string;
  fineAmount: number;
  fineStatus: FineStatus;
  remarks?: string;
  renewCount: number;
  maxRenewals?: number;
  returnCondition?: "Good" | "Slightly Worn" | "Damaged" | "Lost";
}

export interface BookReservation {
  id: string;
  reservationId: string;
  bookId: string;
  bookTitle: string;
  isbn: string;
  memberId: string;
  memberName: string;
  memberDept?: string;
  memberPhone?: string;
  memberRole?: MemberType;
  reservationDate: string;
  status: ReservationStatus;
  queuePosition?: number;
  priority?: "High" | "Normal" | "Low";
  notifyMethod?: "SMS" | "Email" | "InApp" | "All";
  notifiedAt?: string;
  expiresAt: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  collectedAt?: string;
  collectedBy?: string;
  notes?: string;
  holdDays?: number;
}

export interface FineRecord {
  id: string;
  fineId: string;
  memberId: string;
  memberName: string;
  issueTransactionId: string;
  bookTitle: string;
  amount: number;
  paidAmount: number;
  reason: "Overdue Return" | "Book Damaged" | "Book Lost" | "ID Card Replacement";
  status: FineStatus;
  generatedDate: string;
  paidDate?: string;
  paymentMode?: "Cash" | "UPI" | "Card" | "Online Portal" | "Waiver";
  receiptNo?: string;
}

export interface LibraryGateEntry {
  id: string;
  entryTime: string;
  exitTime?: string;
  memberId: string;
  memberName: string;
  role: MemberType;
  department: string;
  purpose: "Reading" | "Issue/Return" | "Digital Access" | "Study Group";
  status: "In Building" | "Exited";
  gateId: string;
}

export interface AcquisitionOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  title: string;
  author: string;
  isbn?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  expectedDelivery: string;
  status: "Requested" | "Approved" | "Ordered" | "Delivered" | "Cataloged" | "Cancelled";
  requestedBy: string;
  department: string;
}

export interface DigitalPaperResource {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationYear: number;
  doi: string;
  category: string;
  pdfUrl: string;
  downloadsCount: number;
  accessLevel: "Open Access" | "Campus Only" | "Restricted";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  department: string;
  module: string;
  action: string;
  description: string;
  ipAddress: string;
  device?: string;
}

export interface ReadingHallSeat {
  id: string;
  seatNo: string; // e.g. RH-A01
  section: "Quiet Zone" | "Digital Zone" | "Group Discussion" | "General";
  status: "Vacant" | "Occupied" | "Reserved" | "Maintenance";
  occupiedBy?: string;
  occupiedByName?: string;
  occupiedSince?: string;
}

export interface LibrarySettings {
  libraryName: string;
  maxBooksStudent: number;
  maxBooksFaculty: number;
  loanDaysStudent: number;
  loanDaysFaculty: number;
  finePerDayOverdue: number;
  maxRenewals: number;
  workingHours: string;
  autoSendOverdueEmail: boolean;
  enableRfidGates: boolean;
  enableAiHygieneScanner: boolean;
}
