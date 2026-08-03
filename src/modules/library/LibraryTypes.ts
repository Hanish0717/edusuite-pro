// =============================================================================
// LIBRARY ERP — COMPLETE TYPE DEFINITIONS
// University Production Library Management System
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface Holiday {
  date: string;
  name: string;
  type: "National" | "Regional" | "Institute";
}

export interface LibrarySettings {
  loanPeriodStudent: number;      // days
  loanPeriodFaculty: number;      // days
  loanPeriodStaff: number;        // days
  maxBooksStudent: number;
  maxBooksFaculty: number;
  maxBooksStaff: number;
  finePerDay: number;             // ₹ per day
  maxFine: number;                // ₹ cap
  gracePeriod: number;            // days before fine starts
  lostBookMultiplier: number;     // e.g. 3× book price
  damagedBookFine: number;        // flat ₹
  duplicateCardFee: number;       // ₹
  reservationPeriod: number;      // days hold is valid
  membershipDurationStudent: number; // years
  membershipDurationFaculty: number;
  maxRenewals: number;
  renewalExtensionDays: number;
  workingHoursStart: string;      // "08:00"
  workingHoursEnd: string;        // "20:00"
  holidays: Holiday[];
  barcodeFormat: "Code128" | "Code39" | "EAN13";
  qrCodeContent: "AccessionISBN" | "CallNumber" | "CatalogURL";
  smsTemplates: Record<LibraryNotificationType, string>;
  emailTemplates: Record<LibraryNotificationType, string>;
  receiptHeader: string;
  receiptFooter: string;
  instituteName: string;
  libraryName: string;
  accessionPrefix: string;        // e.g. "GMRIT"
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK
// ─────────────────────────────────────────────────────────────────────────────

export type BookStatus = "Active" | "Archived" | "Deleted";
export type BookSource = "Acquisition" | "Donation" | "Manual" | "Import";

export interface BookLocation {
  building: string;
  floor: string;
  rack: string;
  shelf: string;
}

export interface Book {
  id: string;
  accessionNo: string;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedYear: number;
  edition: string;
  language: string;
  category: string;
  subject: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  reservedCopies: number;
  lostCopies: number;
  damagedCopies: number;
  location: BookLocation;
  barcode: string;
  qrCode: string;
  callNumber: string;
  price: number;
  status: BookStatus;
  source: BookSource;
  acquisitionId?: string;
  addedBy: string;
  addedAt: string;
  updatedAt: string;
  description?: string;
  coverImage?: string;
  tags: string[];
  deweyDecimal?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER
// ─────────────────────────────────────────────────────────────────────────────

export type MemberType = "Student" | "Faculty" | "Staff";
export type MemberStatus = "Active" | "Suspended" | "Blocked" | "Expired";

export interface Member {
  id: string;
  memberId: string;           // LIB-2024-001
  sourceId: string;           // roll no or employee ID
  name: string;
  type: MemberType;
  department: string;
  course?: string;
  semester?: number;
  year?: number;
  designation?: string;
  email: string;
  phone: string;
  photo?: string;
  rfidTag?: string;
  cardId?: string;
  cardStatus?: "Active" | "Lost" | "Expired" | "Suspended";
  status: MemberStatus;
  statusReason?: string;
  memberSince: string;
  memberExpiry: string;
  currentBorrowedIds: string[];    // issueRecord IDs
  pendingFineAmount: number;
  totalBorrowed: number;
  totalReturned: number;
  totalFinesPaid: number;
  blockedAt?: string;
  blockedReason?: string;
  suspendedTill?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE RECORD
// ─────────────────────────────────────────────────────────────────────────────

export type IssueStatus = "Active" | "Returned" | "Overdue" | "Lost" | "Renewed";

export interface IssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookBarcode: string;
  accessionNo: string;
  isbn: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  memberSourceId: string;
  issuedBy: string;           // librarian name
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  returnedBy?: string;
  status: IssueStatus;
  renewCount: number;
  renewHistory: { renewedAt: string; newDueDate: string; renewedBy: string }[];
  fineId?: string;
  returnCondition?: "Good" | "Damaged" | "Lost";
  receiptNo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FINE RECORD
// ─────────────────────────────────────────────────────────────────────────────

export type FineType = "Overdue" | "Lost" | "Damaged" | "DuplicateCard" | "Other";
export type FineStatus = "Pending" | "Paid" | "Waived" | "Partial";

export interface FineRecord {
  id: string;
  issueId?: string;
  memberId: string;
  memberName: string;
  memberSourceId: string;
  bookId?: string;
  bookTitle?: string;
  bookBarcode?: string;
  type: FineType;
  amount: number;
  paidAmount?: number;
  daysOverdue?: number;
  status: FineStatus;
  generatedAt: string;
  generatedBy: string;
  paidAt?: string;
  receiptNo?: string;
  waivedBy?: string;
  waiverReason?: string;
  waivedAt?: string;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION
// ─────────────────────────────────────────────────────────────────────────────

export type ReservationStatus = "Pending" | "Ready" | "Collected" | "Expired" | "Cancelled";

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookBarcode: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  reservedAt: string;
  expiryDate: string;
  queuePosition: number;
  status: ReservationStatus;
  notifiedAt?: string;
  collectedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACQUISITION
// ─────────────────────────────────────────────────────────────────────────────

export type AcquisitionStatus =
  | "Requested"
  | "UnderReview"
  | "Approved"
  | "Rejected"
  | "PORaised"
  | "Supplied"
  | "Verified"
  | "AddedToCatalog";

export interface AcquisitionRequest {
  id: string;
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  edition?: string;
  quantity: number;
  estimatedCost: number;
  requestedBy: string;
  requestedByRole: string;
  department: string;
  requestedAt: string;
  justification: string;
  status: AcquisitionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  vendor?: string;
  vendorContact?: string;
  poNumber?: string;
  poRaisedAt?: string;
  suppliedAt?: string;
  verifiedBy?: string;
  actualCost?: number;
  addedBookId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY AUDIT
// ─────────────────────────────────────────────────────────────────────────────

export type AuditItemStatus = "Verified" | "Missing" | "Damaged" | "Extra" | "Misplaced";

export interface InventoryAuditItem {
  id: string;
  auditId: string;
  bookId: string;
  accessionNo: string;
  bookTitle: string;
  expectedShelf: string;
  scannedAt?: string;
  status: AuditItemStatus;
  notes?: string;
}

export interface InventoryAuditSession {
  id: string;
  sessionName: string;
  startedBy: string;
  startedAt: string;
  completedAt?: string;
  status: "InProgress" | "Completed" | "Paused";
  scope: string;          // "Full Library" | "Section X" etc.
  totalScanned: number;
  verified: number;
  missing: number;
  damaged: number;
  extra: number;
  items: InventoryAuditItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DIGITAL LIBRARY
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceType = "PDF" | "Journal" | "Thesis" | "PreviousPaper" | "QuestionBank" | "EBook" | "Video";

export interface DigitalResource {
  id: string;
  title: string;
  type: ResourceType;
  authors: string[];
  department: string;
  subject: string;
  semester?: number;
  year?: number;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  downloadCount: number;
  viewCount: number;
  tags: string[];
  description?: string;
  accessLevel: "All" | "Department" | "Faculty";
  url: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// READING HALL
// ─────────────────────────────────────────────────────────────────────────────

export type SeatStatus = "Available" | "Occupied" | "Reserved" | "Maintenance";

export interface ReadingHallSeat {
  seatNo: string;
  zone: "A" | "B" | "C" | "D";
  status: SeatStatus;
  memberId?: string;
  memberName?: string;
  entryTime?: string;
}

export interface SeatBookingRecord {
  id: string;
  seatNo: string;
  zone: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  memberSourceId: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes?: number;
  date: string;
  verifiedBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// LIBRARY ENTRY LOG
// ─────────────────────────────────────────────────────────────────────────────

export type EntryMethod = "RFID" | "QR" | "Barcode" | "Manual";

export interface LibraryEntryLog {
  id: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  memberSourceId: string;
  entryMethod: EntryMethod;
  entryTime: string;
  exitTime?: string;
  durationMinutes?: number;
  date: string;
  verifiedBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ID CARD
// ─────────────────────────────────────────────────────────────────────────────

export type CardType = "RFID" | "QR" | "Barcode" | "Smart";
export type CardStatus = "Active" | "Lost" | "Expired" | "Suspended" | "Replaced";

export interface LibraryIDCard {
  id: string;
  cardNo: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  memberSourceId: string;
  cardType: CardType;
  rfidTag?: string;
  qrData?: string;
  barcode?: string;
  issuedAt: string;
  issuedBy: string;
  expiryDate: string;
  status: CardStatus;
  issuanceType: "Original" | "Duplicate" | "Renewal" | "Replacement";
  collectedAt?: string;
  collectedBy?: string;
  previousCardId?: string;
  printedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────────────────────────────────────

export type LibraryModule =
  | "Overview"
  | "BookManagement"
  | "Members"
  | "IssueBooks"
  | "ReturnBooks"
  | "Acquisition"
  | "Inventory"
  | "Reservations"
  | "DigitalLibrary"
  | "ReadingHall"
  | "LibraryEntry"
  | "FineManagement"
  | "IDCards"
  | "Reports"
  | "Notifications"
  | "Settings"
  | "AuditLogs";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  department: string;
  module: LibraryModule;
  action: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  relatedId?: string;         // bookId, memberId, issueId etc.
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type LibraryNotificationType =
  | "BookIssued"
  | "BookReturned"
  | "DueDateReminder"
  | "Overdue"
  | "FineGenerated"
  | "FinePaid"
  | "ReservationReady"
  | "MembershipExpiry"
  | "NewArrival"
  | "CardIssued"
  | "AcquisitionApproved"
  | "SystemAlert";

export type NotificationChannel = "InApp" | "Email" | "SMS";
export type NotificationStatus = "Sent" | "Pending" | "Failed" | "Read";

export interface LibraryNotification {
  id: string;
  type: LibraryNotificationType;
  memberId?: string;
  memberName?: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  status: NotificationStatus;
  createdAt: string;
  readAt?: string;
  relatedId?: string;         // issueId, fineId, bookId
  metadata?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS (derived/computed)
// ─────────────────────────────────────────────────────────────────────────────

export interface LibraryDashboardStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  reservedBooks: number;
  lostBooks: number;
  damagedBooks: number;
  todayVisitors: number;
  todayIssues: number;
  todayReturns: number;
  activeMembers: number;
  pendingReservations: number;
  totalFineCollected: number;
  pendingFines: number;
  overdueBooks: number;
  activeAuditSessions: number;
  totalDigitalResources: number;
  readingHallOccupancy: number;
  readingHallCapacity: number;
  recentActivities: RecentActivity[];
  monthlyIssuesData: { month: string; count: number }[];
  categoryWiseBooks: { category: string; count: number }[];
  topBorrowedBooks: { title: string; count: number }[];
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  module: LibraryModule;
  type: "issue" | "return" | "fine" | "member" | "book" | "entry" | "reservation";
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE STATE
// ─────────────────────────────────────────────────────────────────────────────

export interface LibraryState {
  books: Book[];
  members: Member[];
  issues: IssueRecord[];
  fines: FineRecord[];
  reservations: Reservation[];
  acquisitions: AcquisitionRequest[];
  auditSessions: InventoryAuditSession[];
  digitalResources: DigitalResource[];
  seats: ReadingHallSeat[];
  seatBookings: SeatBookingRecord[];
  entryLogs: LibraryEntryLog[];
  idCards: LibraryIDCard[];
  auditLogs: AuditLog[];
  notifications: LibraryNotification[];
  settings: LibrarySettings;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export type LibraryAction =
  // Book actions
  | { type: "ADD_BOOK"; payload: Omit<Book, "id" | "accessionNo" | "barcode" | "qrCode" | "addedAt" | "updatedAt"> }
  | { type: "UPDATE_BOOK"; payload: { id: string; updates: Partial<Book> } }
  | { type: "ARCHIVE_BOOK"; payload: { id: string; by: string } }
  | { type: "RESTORE_BOOK"; payload: { id: string; by: string } }
  | { type: "DELETE_BOOK"; payload: { id: string; by: string } }
  // Member actions
  | { type: "ADD_MEMBER"; payload: Omit<Member, "id" | "memberId" | "currentBorrowedIds" | "pendingFineAmount" | "totalBorrowed" | "totalReturned" | "totalFinesPaid" | "memberSince" | "memberExpiry"> }
  | { type: "ACTIVATE_MEMBER"; payload: { id: string; by: string } }
  | { type: "SUSPEND_MEMBER"; payload: { id: string; reason: string; till: string; by: string } }
  | { type: "BLOCK_MEMBER"; payload: { id: string; reason: string; by: string } }
  | { type: "RENEW_MEMBERSHIP"; payload: { id: string; by: string } }
  // Issue / Return
  | { type: "ISSUE_BOOK"; payload: { bookId: string; memberId: string; issuedBy: string } }
  | { type: "RETURN_BOOK"; payload: { issueId: string; condition: "Good" | "Damaged" | "Lost"; receivedBy: string } }
  | { type: "RENEW_BOOK"; payload: { issueId: string; renewedBy: string } }
  | { type: "MARK_LOST"; payload: { issueId: string; by: string } }
  // Fine
  | { type: "COLLECT_FINE"; payload: { fineId: string; amount: number; by: string } }
  | { type: "WAIVE_FINE"; payload: { fineId: string; reason: string; by: string } }
  | { type: "ADD_FINE"; payload: Omit<FineRecord, "id" | "generatedAt" | "receiptNo"> }
  // Reservation
  | { type: "PLACE_RESERVATION"; payload: { bookId: string; memberId: string } }
  | { type: "CANCEL_RESERVATION"; payload: { id: string; by: string } }
  | { type: "COLLECT_RESERVATION"; payload: { id: string; by: string } }
  | { type: "EXPIRE_RESERVATIONS" }
  // Acquisition
  | { type: "ADD_ACQUISITION"; payload: Omit<AcquisitionRequest, "id" | "requestedAt" | "status"> }
  | { type: "UPDATE_ACQUISITION_STATUS"; payload: { id: string; status: AcquisitionStatus; by: string; notes?: string } }
  // Inventory
  | { type: "START_AUDIT"; payload: { sessionName: string; scope: string; by: string } }
  | { type: "SCAN_BOOK_AUDIT"; payload: { sessionId: string; bookId: string; status: AuditItemStatus; notes?: string } }
  | { type: "COMPLETE_AUDIT"; payload: { sessionId: string; by: string } }
  // Digital Library
  | { type: "ADD_DIGITAL_RESOURCE"; payload: Omit<DigitalResource, "id" | "uploadedAt" | "downloadCount" | "viewCount"> }
  | { type: "DOWNLOAD_RESOURCE"; payload: { resourceId: string } }
  // Reading Hall
  | { type: "ALLOCATE_SEAT"; payload: { seatNo: string; memberId: string; verifiedBy: string } }
  | { type: "EXIT_SEAT"; payload: { seatNo: string; by: string } }
  // Entry
  | { type: "RECORD_ENTRY"; payload: { memberId: string; method: EntryMethod; by?: string } }
  | { type: "RECORD_EXIT"; payload: { memberId: string } }
  // ID Cards
  | { type: "ISSUE_ID_CARD"; payload: Omit<LibraryIDCard, "id" | "cardNo" | "issuedAt" | "status"> }
  | { type: "UPDATE_CARD_STATUS"; payload: { id: string; status: CardStatus; by: string } }
  // Notification
  | { type: "MARK_NOTIFICATION_READ"; payload: { id: string } }
  // Settings
  | { type: "UPDATE_SETTINGS"; payload: Partial<LibrarySettings> }
  // Audit
  | { type: "ADD_AUDIT_LOG"; payload: Omit<AuditLog, "id" | "timestamp"> };

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface LibraryContextType {
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
  stats: LibraryDashboardStats;
  // Computed helpers
  getBook: (id: string) => Book | undefined;
  getMember: (id: string) => Member | undefined;
  getIssue: (id: string) => IssueRecord | undefined;
  getMemberIssues: (memberId: string) => IssueRecord[];
  getMemberFines: (memberId: string) => FineRecord[];
  getBookReservations: (bookId: string) => Reservation[];
  getMemberNotifications: (memberId?: string) => LibraryNotification[];
  isOverdue: (issue: IssueRecord) => boolean;
  calculateFine: (issue: IssueRecord) => number;
  canIssueBook: (memberId: string, bookId: string) => { allowed: boolean; reason?: string };
}
