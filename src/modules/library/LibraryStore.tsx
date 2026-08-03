// =============================================================================
// LIBRARY ERP — CENTRAL STATE STORE
// Single source of truth for all 17 library modules.
// All business logic, workflows, and auto-updates live here.
// =============================================================================

import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type {
  LibraryState,
  LibraryAction,
  LibraryContextType,
  LibraryDashboardStats,
  Book,
  Member,
  IssueRecord,
  FineRecord,
  Reservation,
  AuditLog,
  LibraryNotification,
  LibraryModule,
  RecentActivity,
} from "./LibraryTypes";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

let _idCounter = 1;
const genId = (prefix = "ID") => `${prefix}-${Date.now()}-${_idCounter++}`;
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (days: number, from?: string) => {
  const d = from ? new Date(from) : new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const daysBetween = (a: string, b: string) => {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const genAccession = (prefix: string, count: number) =>
  `${prefix}/${new Date().getFullYear()}/${String(count).padStart(4, "0")}`;
const genReceiptNo = () => `RCP-${Date.now()}`;
const genCardNo = (count: number) => `LIB-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;
const mockIP = "192.168.1." + Math.floor(Math.random() * 200 + 10);

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG HELPER
// ─────────────────────────────────────────────────────────────────────────────

function makeAudit(
  module: LibraryModule,
  action: string,
  description: string,
  userName = "Librarian",
  role = "Librarian",
  opts: Partial<AuditLog> = {}
): AuditLog {
  return {
    id: genId("AUDIT"),
    userId: "LIB-ADMIN",
    userName,
    role,
    department: "Library",
    module,
    action,
    description,
    ipAddress: mockIP,
    device: "Desktop — Chrome 126",
    timestamp: now(),
    ...opts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION HELPER
// ─────────────────────────────────────────────────────────────────────────────

function makeNotif(
  state: LibraryState,
  type: LibraryNotification["type"],
  title: string,
  message: string,
  memberId?: string,
  relatedId?: string
): LibraryNotification {
  const member = memberId ? state.members.find((m) => m.id === memberId) : undefined;
  return {
    id: genId("NOTIF"),
    type,
    memberId,
    memberName: member?.name,
    title,
    message,
    channels: ["InApp", "Email", "SMS"],
    status: "Sent",
    createdAt: now(),
    relatedId,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE — Rich seed data for real-looking ERP
// ─────────────────────────────────────────────────────────────────────────────

const SEED_SETTINGS: LibraryState["settings"] = {
  loanPeriodStudent: 14,
  loanPeriodFaculty: 30,
  loanPeriodStaff: 21,
  maxBooksStudent: 3,
  maxBooksFaculty: 10,
  maxBooksStaff: 5,
  finePerDay: 5,
  maxFine: 500,
  gracePeriod: 0,
  lostBookMultiplier: 3,
  damagedBookFine: 200,
  duplicateCardFee: 50,
  reservationPeriod: 3,
  membershipDurationStudent: 4,
  membershipDurationFaculty: 5,
  maxRenewals: 2,
  renewalExtensionDays: 14,
  workingHoursStart: "08:00",
  workingHoursEnd: "20:00",
  holidays: [
    { date: "2026-08-15", name: "Independence Day", type: "National" },
    { date: "2026-10-02", name: "Gandhi Jayanti", type: "National" },
    { date: "2026-01-26", name: "Republic Day", type: "National" },
    { date: "2026-11-14", name: "Children's Day", type: "National" },
  ],
  barcodeFormat: "Code128",
  qrCodeContent: "AccessionISBN",
  smsTemplates: {
    BookIssued: "Dear {name}, Book '{book}' issued. Due: {due}. — GMRIT Library",
    BookReturned: "Dear {name}, Book '{book}' returned. Thank you! — GMRIT Library",
    DueDateReminder: "Dear {name}, '{book}' due in 2 days on {due}. Please return. — GMRIT Library",
    Overdue: "Dear {name}, '{book}' is {days} days overdue. Fine: ₹{fine}. — GMRIT Library",
    FineGenerated: "Dear {name}, Fine of ₹{fine} generated for '{book}'. — GMRIT Library",
    FinePaid: "Dear {name}, Fine of ₹{fine} received. Receipt: {receipt}. — GMRIT Library",
    ReservationReady: "Dear {name}, '{book}' reserved copy available. Collect in 3 days. — GMRIT Library",
    MembershipExpiry: "Dear {name}, Library membership expires on {date}. Renew now. — GMRIT Library",
    NewArrival: "New books arrived: '{book}' — Now available at GMRIT Library.",
    CardIssued: "Dear {name}, Library ID Card issued. Card No: {card}. — GMRIT Library",
    AcquisitionApproved: "Book acquisition '{title}' approved by Principal. PO being raised. — Library",
    SystemAlert: "GMRIT Library System: {message}",
  },
  emailTemplates: {} as any,
  receiptHeader: "GMRIT Central Library\nRajam, Srikakulam — 532127\nTel: 08942-XXXXXX",
  receiptFooter: "Thank you for using GMRIT Library. Please return books on time.",
  instituteName: "GMRIT",
  libraryName: "GMRIT Central Library",
  accessionPrefix: "GMRIT",
};

const SEED_BOOKS: Book[] = [
  {
    id: "BK-001", accessionNo: "GMRIT/2024/0001", isbn: "978-0-262-03384-8",
    title: "Introduction to Algorithms", authors: ["Cormen T.H.", "Leiserson C.E.", "Rivest R.L."],
    publisher: "MIT Press", publishedYear: 2022, edition: "4th", language: "English",
    category: "Computer Science", subject: "Algorithms", totalCopies: 8, availableCopies: 5,
    issuedCopies: 2, reservedCopies: 1, lostCopies: 0, damagedCopies: 0,
    location: { building: "A", floor: "1", rack: "CS-01", shelf: "S-01" },
    barcode: "BAR0001", qrCode: "QR0001", callNumber: "CS/ALG/001", price: 3200,
    status: "Active", source: "Acquisition", addedBy: "Librarian", tags: ["algorithms", "data structures"],
    addedAt: "2024-01-10", updatedAt: "2024-01-10",
  },
  {
    id: "BK-002", accessionNo: "GMRIT/2024/0002", isbn: "978-0-07-352332-6",
    title: "Database System Concepts", authors: ["Silberschatz A.", "Korth H.F."],
    publisher: "McGraw-Hill", publishedYear: 2020, edition: "7th", language: "English",
    category: "Computer Science", subject: "Databases", totalCopies: 6, availableCopies: 4,
    issuedCopies: 2, reservedCopies: 0, lostCopies: 0, damagedCopies: 0,
    location: { building: "A", floor: "1", rack: "CS-02", shelf: "S-02" },
    barcode: "BAR0002", qrCode: "QR0002", callNumber: "CS/DB/002", price: 2800,
    status: "Active", source: "Acquisition", addedBy: "Librarian", tags: ["database", "SQL", "DBMS"],
    addedAt: "2024-01-15", updatedAt: "2024-01-15",
  },
  {
    id: "BK-003", accessionNo: "GMRIT/2024/0003", isbn: "978-0-13-235088-4",
    title: "Artificial Intelligence: A Modern Approach", authors: ["Russell S.", "Norvig P."],
    publisher: "Pearson", publishedYear: 2021, edition: "4th", language: "English",
    category: "Computer Science", subject: "Artificial Intelligence", totalCopies: 5,
    availableCopies: 0, issuedCopies: 4, reservedCopies: 1, lostCopies: 0, damagedCopies: 0,
    location: { building: "A", floor: "1", rack: "CS-03", shelf: "S-01" },
    barcode: "BAR0003", qrCode: "QR0003", callNumber: "CS/AI/003", price: 4200,
    status: "Active", source: "Acquisition", addedBy: "Librarian", tags: ["AI", "machine learning"],
    addedAt: "2024-02-01", updatedAt: "2024-02-01",
  },
  {
    id: "BK-004", accessionNo: "GMRIT/2024/0004", isbn: "978-0-07-460484-7",
    title: "Signals and Systems", authors: ["Oppenheim A.V.", "Willsky A.S."],
    publisher: "Pearson", publishedYear: 2010, edition: "2nd", language: "English",
    category: "Electronics", subject: "Signals & Systems", totalCopies: 10,
    availableCopies: 7, issuedCopies: 3, reservedCopies: 0, lostCopies: 0, damagedCopies: 0,
    location: { building: "B", floor: "1", rack: "EC-01", shelf: "S-01" },
    barcode: "BAR0004", qrCode: "QR0004", callNumber: "ECE/SS/004", price: 2400,
    status: "Active", source: "Acquisition", addedBy: "Librarian", tags: ["signals", "systems", "DSP"],
    addedAt: "2024-02-10", updatedAt: "2024-02-10",
  },
  {
    id: "BK-005", accessionNo: "GMRIT/2024/0005", isbn: "978-0-07-338035-9",
    title: "Thermodynamics: An Engineering Approach", authors: ["Cengel Y.A.", "Boles M.A."],
    publisher: "McGraw-Hill", publishedYear: 2019, edition: "9th", language: "English",
    category: "Mechanical", subject: "Thermodynamics", totalCopies: 8,
    availableCopies: 6, issuedCopies: 2, reservedCopies: 0, lostCopies: 0, damagedCopies: 0,
    location: { building: "C", floor: "1", rack: "ME-01", shelf: "S-01" },
    barcode: "BAR0005", qrCode: "QR0005", callNumber: "ME/TD/005", price: 3100,
    status: "Active", source: "Acquisition", addedBy: "Librarian", tags: ["thermodynamics", "heat transfer"],
    addedAt: "2024-02-15", updatedAt: "2024-02-15",
  },
];

const SEED_MEMBERS: Member[] = [
  {
    id: "MEM-001", memberId: "LIB-2024-001", sourceId: "23341A4219",
    name: "B VISHNU VARDHAN", type: "Student", department: "CSE (AI&ML)",
    course: "B.Tech", semester: 7, year: 4,
    email: "vishnuvardhan@gmrit.edu.in", phone: "9876543210",
    status: "Active", memberSince: "2023-08-01", memberExpiry: "2027-05-31",
    currentBorrowedIds: ["ISS-001"], pendingFineAmount: 0,
    totalBorrowed: 12, totalReturned: 11, totalFinesPaid: 30,
  },
  {
    id: "MEM-002", memberId: "LIB-2024-002", sourceId: "22CS101",
    name: "K. Sai Teja", type: "Student", department: "CSE",
    course: "B.Tech", semester: 5, year: 3,
    email: "saiteja@gmrit.edu.in", phone: "9123456789",
    status: "Active", memberSince: "2022-08-01", memberExpiry: "2026-05-31",
    currentBorrowedIds: ["ISS-002"], pendingFineAmount: 0,
    totalBorrowed: 8, totalReturned: 7, totalFinesPaid: 0,
  },
  {
    id: "MEM-003", memberId: "LIB-2024-003", sourceId: "22CS189",
    name: "Rahul V.", type: "Student", department: "CSE",
    course: "B.Tech", semester: 5, year: 3,
    email: "rahulv@gmrit.edu.in", phone: "9234567890",
    status: "Active", memberSince: "2022-08-01", memberExpiry: "2026-05-31",
    currentBorrowedIds: ["ISS-003"], pendingFineAmount: 40,
    totalBorrowed: 6, totalReturned: 5, totalFinesPaid: 20,
  },
  {
    id: "MEM-004", memberId: "LIB-2024-004", sourceId: "FAC-CSE-001",
    name: "Dr. P. Ramana", type: "Faculty", department: "CSE",
    designation: "Associate Professor",
    email: "ramana@gmrit.edu.in", phone: "9345678901",
    status: "Active", memberSince: "2018-06-01", memberExpiry: "2028-05-31",
    currentBorrowedIds: [], pendingFineAmount: 0,
    totalBorrowed: 45, totalReturned: 45, totalFinesPaid: 0,
  },
  {
    id: "MEM-005", memberId: "LIB-2024-005", sourceId: "21ME092",
    name: "Venkatesh K.", type: "Student", department: "Mechanical",
    course: "B.Tech", semester: 7, year: 4,
    email: "venkatesh@gmrit.edu.in", phone: "9456789012",
    status: "Suspended", statusReason: "Multiple overdue books",
    memberSince: "2021-08-01", memberExpiry: "2025-05-31",
    currentBorrowedIds: [], pendingFineAmount: 200,
    totalBorrowed: 10, totalReturned: 10, totalFinesPaid: 60,
    suspendedTill: "2026-09-01",
  },
];

const SEED_ISSUES: IssueRecord[] = [
  {
    id: "ISS-001", bookId: "BK-001", bookTitle: "Introduction to Algorithms",
    bookBarcode: "BAR0001", accessionNo: "GMRIT/2024/0001", isbn: "978-0-262-03384-8",
    memberId: "MEM-001", memberName: "B VISHNU VARDHAN", memberType: "Student",
    memberSourceId: "23341A4219", issuedBy: "Head Librarian",
    issuedAt: "2026-07-20T09:00:00Z", dueDate: "2026-08-03",
    status: "Active", renewCount: 0, renewHistory: [],
    maxRenewals: 2,
  },
  {
    id: "ISS-002", bookId: "BK-002", bookTitle: "Database System Concepts",
    bookBarcode: "BAR0002", accessionNo: "GMRIT/2024/0002", isbn: "978-0-07-352332-6",
    memberId: "MEM-002", memberName: "K. Sai Teja", memberType: "Student",
    memberSourceId: "22CS101", issuedBy: "Librarian",
    issuedAt: "2026-07-22T10:30:00Z", dueDate: "2026-08-05",
    status: "Active", renewCount: 1,
    renewHistory: [{ renewedAt: "2026-07-25", newDueDate: "2026-08-05", renewedBy: "Librarian" }],
    maxRenewals: 2,
  },
  {
    id: "ISS-003", bookId: "BK-003", bookTitle: "Artificial Intelligence: A Modern Approach",
    bookBarcode: "BAR0003", accessionNo: "GMRIT/2024/0003", isbn: "978-0-13-235088-4",
    memberId: "MEM-003", memberName: "Rahul V.", memberType: "Student",
    memberSourceId: "22CS189", issuedBy: "Librarian",
    issuedAt: "2026-07-10T11:00:00Z", dueDate: "2026-07-24",
    status: "Overdue", renewCount: 0, renewHistory: [],
    maxRenewals: 2,
  },
];

const SEED_FINES: FineRecord[] = [
  {
    id: "FIN-001", issueId: "ISS-003", memberId: "MEM-003",
    memberName: "Rahul V.", memberSourceId: "22CS189",
    bookId: "BK-003", bookTitle: "Artificial Intelligence: A Modern Approach",
    bookBarcode: "BAR0003", type: "Overdue", amount: 40,
    daysOverdue: 8, status: "Pending",
    generatedAt: "2026-08-01T00:00:00Z", generatedBy: "System",
  },
  {
    id: "FIN-002", memberId: "MEM-005", memberName: "Venkatesh K.",
    memberSourceId: "21ME092", bookId: "BK-005",
    bookTitle: "Thermodynamics: An Engineering Approach",
    type: "Overdue", amount: 200, daysOverdue: 40,
    status: "Pending", generatedAt: "2026-06-15T00:00:00Z", generatedBy: "System",
  },
];

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: "RES-001", bookId: "BK-003",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    bookBarcode: "BAR0003", memberId: "MEM-001", memberName: "B VISHNU VARDHAN",
    memberType: "Student", reservedAt: "2026-07-28T14:00:00Z",
    expiryDate: "2026-09-01", queuePosition: 1, status: "Pending",
  },
];

const SEED_SEATS: LibraryState["seats"] = Array.from({ length: 32 }, (_, i) => ({
  seatNo: `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`,
  zone: ["A", "B", "C", "D"][Math.floor(i / 8)] as any,
  status: i < 12 ? "Occupied" : "Available" as any,
  memberId: i < 3 ? ["MEM-001", "MEM-002", "MEM-004"][i] : undefined,
  memberName: i < 3 ? ["B VISHNU VARDHAN", "K. Sai Teja", "Dr. P. Ramana"][i] : undefined,
  entryTime: i < 3 ? "09:30 AM" : undefined,
}));

const SEED_DIGITAL: LibraryState["digitalResources"] = [
  {
    id: "DR-001", title: "Machine Learning Fundamentals — Lecture Notes",
    type: "PDF", authors: ["Dr. P. Ramana"], department: "CSE (AI&ML)",
    subject: "Machine Learning", semester: 7, year: 2026,
    uploadedBy: "Dr. P. Ramana", uploadedAt: "2026-07-01T10:00:00Z",
    fileSize: "4.2 MB", downloadCount: 142, viewCount: 380,
    tags: ["ML", "neural networks"], description: "Comprehensive notes for ML",
    accessLevel: "Department", url: "#",
  },
  {
    id: "DR-002", title: "DBMS Question Bank — 2023-24",
    type: "QuestionBank", authors: ["Dept. of CSE"], department: "CSE",
    subject: "Database Management", semester: 5, year: 2024,
    uploadedBy: "Librarian", uploadedAt: "2026-06-15T10:00:00Z",
    fileSize: "1.8 MB", downloadCount: 298, viewCount: 720,
    tags: ["DBMS", "SQL"], description: "Previous year question bank",
    accessLevel: "All", url: "#",
  },
];

const SEED_ACQUISITIONS: AcquisitionRequest[] = [
  {
    id: "ACQ-001", title: "Deep Learning",
    authors: ["Goodfellow I.", "Bengio Y.", "Courville A."],
    isbn: "978-0262035613", publisher: "MIT Press", edition: "1st",
    quantity: 5, estimatedCost: 18000, requestedBy: "Dr. P. Ramana",
    requestedByRole: "Faculty", department: "CSE (AI&ML)",
    requestedAt: "2026-07-15T10:00:00Z", justification: "Required for AI/ML elective courses",
    status: "Approved", reviewedBy: "Chief Librarian", reviewedAt: "2026-07-16T09:00:00Z",
    approvedBy: "Principal", approvedAt: "2026-07-18T11:00:00Z",
    vendor: "New Age Publishers", vendorContact: "9800100200",
  },
  {
    id: "ACQ-002", title: "Computer Networks",
    authors: ["Tanenbaum A.S.", "Wetherall D."],
    isbn: "978-0132126953", publisher: "Pearson", edition: "5th",
    quantity: 8, estimatedCost: 20000, requestedBy: "HoD CSE",
    requestedByRole: "HoD", department: "CSE",
    requestedAt: "2026-08-01T10:00:00Z", justification: "Existing copies insufficient for current batch",
    status: "Requested",
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  makeAudit("BookManagement", "ADD_BOOK", "Book 'Introduction to Algorithms' added to catalog", "Admin Librarian", "Library Admin"),
  makeAudit("IssueBooks", "ISSUE_BOOK", "Book 'Introduction to Algorithms' issued to B VISHNU VARDHAN (23341A4219)"),
  makeAudit("Members", "ACTIVATE_MEMBER", "Library membership activated for K. Sai Teja"),
  makeAudit("FineManagement", "FINE_GENERATED", "Overdue fine ₹40 generated for Rahul V.", "System", "Automated"),
  makeAudit("Reservations", "PLACE_RESERVATION", "Book 'AI: A Modern Approach' reserved by B VISHNU VARDHAN"),
];

const SEED_NOTIFICATIONS: LibraryNotification[] = [
  {
    id: "NOTIF-001", type: "Overdue", memberId: "MEM-003", memberName: "Rahul V.",
    title: "Overdue Book Alert", message: "Your book 'Artificial Intelligence: A Modern Approach' is 8 days overdue. Fine: ₹40.",
    channels: ["InApp", "SMS", "Email"], status: "Sent", createdAt: "2026-08-01T08:00:00Z", relatedId: "ISS-003",
  },
  {
    id: "NOTIF-002", type: "DueDateReminder", memberId: "MEM-001", memberName: "B VISHNU VARDHAN",
    title: "Due Date Reminder", message: "Your book 'Introduction to Algorithms' is due on Aug 03, 2026.",
    channels: ["InApp", "SMS"], status: "Sent", createdAt: "2026-08-01T08:00:00Z", relatedId: "ISS-001",
  },
  {
    id: "NOTIF-003", type: "BookIssued", memberId: "MEM-002", memberName: "K. Sai Teja",
    title: "Book Issued Successfully", message: "Book 'Database System Concepts' issued. Due: Aug 05, 2026.",
    channels: ["InApp", "SMS"], status: "Read", createdAt: "2026-07-22T10:30:00Z", relatedId: "ISS-002", readAt: "2026-07-22T11:00:00Z",
  },
];

const SEED_ID_CARDS: LibraryIDCard[] = [
  {
    id: "CARD-001", cardNo: "LIB-2024-0001", memberId: "MEM-001",
    memberName: "B VISHNU VARDHAN", memberType: "Student",
    memberSourceId: "23341A4219", cardType: "RFID", rfidTag: "RFID-A4B2C9D1",
    qrData: "GMRIT-LIB-MEM001", barcode: "LIB2024001",
    issuedAt: "2023-08-05", issuedBy: "Chief Librarian",
    expiryDate: "2027-05-31", status: "Active", issuanceType: "Original",
    printedAt: "2023-08-05",
  },
  {
    id: "CARD-002", cardNo: "LIB-2024-0002", memberId: "MEM-002",
    memberName: "K. Sai Teja", memberType: "Student",
    memberSourceId: "22CS101", cardType: "RFID", rfidTag: "RFID-B5C3D2E4",
    qrData: "GMRIT-LIB-MEM002", barcode: "LIB2024002",
    issuedAt: "2022-08-05", issuedBy: "Chief Librarian",
    expiryDate: "2026-05-31", status: "Active", issuanceType: "Original",
    printedAt: "2022-08-05",
  },
];

const SEED_SEAT_BOOKINGS: SeatBookingRecord[] = [
  {
    id: "SB-001", seatNo: "A1", zone: "A", memberId: "MEM-001",
    memberName: "B VISHNU VARDHAN", memberType: "Student",
    memberSourceId: "23341A4219", entryTime: "2026-08-03T09:30:00Z",
    date: today(),
  },
];

const SEED_ENTRY_LOGS: LibraryEntryLog[] = [
  {
    id: "ENTRY-001", memberId: "MEM-001", memberName: "B VISHNU VARDHAN",
    memberType: "Student", memberSourceId: "23341A4219",
    entryMethod: "RFID", entryTime: "2026-08-03T09:28:00Z", date: today(),
  },
  {
    id: "ENTRY-002", memberId: "MEM-002", memberName: "K. Sai Teja",
    memberType: "Student", memberSourceId: "22CS101",
    entryMethod: "QR", entryTime: "2026-08-03T10:00:00Z", date: today(),
  },
];

const INITIAL_STATE: LibraryState = {
  books: SEED_BOOKS,
  members: SEED_MEMBERS,
  issues: SEED_ISSUES,
  fines: SEED_FINES,
  reservations: SEED_RESERVATIONS,
  acquisitions: SEED_ACQUISITIONS,
  auditSessions: [],
  digitalResources: SEED_DIGITAL,
  seats: SEED_SEATS,
  seatBookings: SEED_SEAT_BOOKINGS,
  entryLogs: SEED_ENTRY_LOGS,
  idCards: SEED_ID_CARDS,
  auditLogs: SEED_AUDIT_LOGS,
  notifications: SEED_NOTIFICATIONS,
  settings: SEED_SETTINGS,
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER — all business logic
// ─────────────────────────────────────────────────────────────────────────────

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {

    // ── BOOK MANAGEMENT ─────────────────────────────────────────────────────
    case "ADD_BOOK": {
      const accNo = genAccession(state.settings.accessionPrefix, state.books.length + 1);
      const newBook: Book = {
        ...action.payload,
        id: genId("BK"),
        accessionNo: accNo,
        barcode: `BAR${String(state.books.length + 1).padStart(4, "0")}`,
        qrCode: `QR${String(state.books.length + 1).padStart(4, "0")}`,
        addedAt: now(),
        updatedAt: now(),
      };
      const audit = makeAudit("BookManagement", "ADD_BOOK",
        `Book '${newBook.title}' added. Accession: ${accNo}. Copies: ${newBook.totalCopies}`);
      toast.success(`Book '${newBook.title}' added! Accession: ${accNo}`);
      return { ...state, books: [...state.books, newBook], auditLogs: [audit, ...state.auditLogs] };
    }

    case "UPDATE_BOOK": {
      const book = state.books.find(b => b.id === action.payload.id);
      const updated = state.books.map(b =>
        b.id === action.payload.id ? { ...b, ...action.payload.updates, updatedAt: now() } : b
      );
      const audit = makeAudit("BookManagement", "UPDATE_BOOK",
        `Book '${book?.title}' updated`);
      toast.success("Book updated successfully!");
      return { ...state, books: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    case "ARCHIVE_BOOK": {
      const book = state.books.find(b => b.id === action.payload.id);
      const updated = state.books.map(b => b.id === action.payload.id ? { ...b, status: "Archived" as const, updatedAt: now() } : b);
      const audit = makeAudit("BookManagement", "ARCHIVE_BOOK", `Book '${book?.title}' archived`);
      toast.success("Book archived!");
      return { ...state, books: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    case "RESTORE_BOOK": {
      const book = state.books.find(b => b.id === action.payload.id);
      const updated = state.books.map(b => b.id === action.payload.id ? { ...b, status: "Active" as const, updatedAt: now() } : b);
      const audit = makeAudit("BookManagement", "RESTORE_BOOK", `Book '${book?.title}' restored from archive`);
      toast.success("Book restored!");
      return { ...state, books: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── MEMBER MANAGEMENT ───────────────────────────────────────────────────
    case "ADD_MEMBER": {
      const memberId = genCardNo(state.members.length + 1);
      const settings = state.settings;
      const durationYears = action.payload.type === "Student"
        ? settings.membershipDurationStudent
        : settings.membershipDurationFaculty;
      const expiry = addDays(durationYears * 365);
      const newMember: Member = {
        ...action.payload,
        id: genId("MEM"),
        memberId,
        currentBorrowedIds: [],
        pendingFineAmount: 0,
        totalBorrowed: 0,
        totalReturned: 0,
        totalFinesPaid: 0,
        memberSince: today(),
        memberExpiry: expiry,
      };
      const audit = makeAudit("Members", "ADD_MEMBER",
        `Library membership created for ${newMember.name} (${newMember.sourceId}). ID: ${memberId}`);
      const notif = makeNotif(state, "CardIssued",
        "Library Membership Created",
        `Welcome to GMRIT Library! Your membership ID is ${memberId}. Valid till ${fmtDate(expiry)}.`,
        newMember.id);
      toast.success(`Membership created for ${newMember.name}! ID: ${memberId}`);
      return { ...state, members: [...state.members, newMember], auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "ACTIVATE_MEMBER": {
      const member = state.members.find(m => m.id === action.payload.id);
      const updated = state.members.map(m => m.id === action.payload.id
        ? { ...m, status: "Active" as const, statusReason: undefined, blockedAt: undefined, suspendedTill: undefined } : m);
      const audit = makeAudit("Members", "ACTIVATE_MEMBER", `Membership activated for ${member?.name}`);
      toast.success(`${member?.name}'s membership activated!`);
      return { ...state, members: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    case "SUSPEND_MEMBER": {
      const member = state.members.find(m => m.id === action.payload.id);
      const updated = state.members.map(m => m.id === action.payload.id
        ? { ...m, status: "Suspended" as const, statusReason: action.payload.reason, suspendedTill: action.payload.till } : m);
      const audit = makeAudit("Members", "SUSPEND_MEMBER",
        `Membership suspended for ${member?.name}. Reason: ${action.payload.reason}. Till: ${action.payload.till}`);
      const notif = makeNotif(state, "SystemAlert", "Membership Suspended",
        `Your library membership has been suspended till ${fmtDate(action.payload.till)}. Reason: ${action.payload.reason}.`,
        action.payload.id);
      toast.warning(`${member?.name}'s membership suspended!`);
      return { ...state, members: updated, auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "BLOCK_MEMBER": {
      const member = state.members.find(m => m.id === action.payload.id);
      const updated = state.members.map(m => m.id === action.payload.id
        ? { ...m, status: "Blocked" as const, blockedReason: action.payload.reason, blockedAt: now() } : m);
      const audit = makeAudit("Members", "BLOCK_MEMBER",
        `Membership blocked for ${member?.name}. Reason: ${action.payload.reason}`);
      toast.error(`${member?.name}'s membership blocked!`);
      return { ...state, members: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    case "RENEW_MEMBERSHIP": {
      const member = state.members.find(m => m.id === action.payload.id);
      const durationYears = member?.type === "Student"
        ? state.settings.membershipDurationStudent
        : state.settings.membershipDurationFaculty;
      const newExpiry = addDays(durationYears * 365);
      const updated = state.members.map(m => m.id === action.payload.id
        ? { ...m, status: "Active" as const, memberExpiry: newExpiry } : m);
      const audit = makeAudit("Members", "RENEW_MEMBERSHIP",
        `Membership renewed for ${member?.name}. New expiry: ${fmtDate(newExpiry)}`);
      toast.success(`Membership renewed till ${fmtDate(newExpiry)}!`);
      return { ...state, members: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── ISSUE BOOK ───────────────────────────────────────────────────────────
    case "ISSUE_BOOK": {
      const { bookId, memberId, issuedBy } = action.payload;
      const book = state.books.find(b => b.id === bookId)!;
      const member = state.members.find(m => m.id === memberId)!;
      const maxBooks = member.type === "Student" ? state.settings.maxBooksStudent : state.settings.maxBooksFaculty;
      const loanDays = member.type === "Student" ? state.settings.loanPeriodStudent : state.settings.loanPeriodFaculty;

      // Business validation
      if (member.status !== "Active") throw new Error(`Member is ${member.status}. Cannot issue books.`);
      if (member.pendingFineAmount > 0) throw new Error(`Member has pending fine ₹${member.pendingFineAmount}. Clear fine first.`);
      if (member.currentBorrowedIds.length >= maxBooks) throw new Error(`Borrow limit reached (${maxBooks} books).`);
      if (book.availableCopies < 1) throw new Error("No copies available.");

      const dueDate = addDays(loanDays);
      const issue: IssueRecord = {
        id: genId("ISS"),
        bookId, bookTitle: book.title, bookBarcode: book.barcode,
        accessionNo: book.accessionNo, isbn: book.isbn,
        memberId, memberName: member.name, memberType: member.type,
        memberSourceId: member.sourceId, issuedBy,
        issuedAt: now(), dueDate, status: "Active",
        renewCount: 0, renewHistory: [], maxRenewals: state.settings.maxRenewals,
      };

      const updatedBooks = state.books.map(b => b.id === bookId
        ? { ...b, availableCopies: b.availableCopies - 1, issuedCopies: b.issuedCopies + 1, updatedAt: now() } : b);
      const updatedMembers = state.members.map(m => m.id === memberId
        ? { ...m, currentBorrowedIds: [...m.currentBorrowedIds, issue.id], totalBorrowed: m.totalBorrowed + 1 } : m);

      const audit = makeAudit("IssueBooks", "ISSUE_BOOK",
        `'${book.title}' issued to ${member.name} (${member.sourceId}). Due: ${fmtDate(dueDate)}`, issuedBy);
      const notif = makeNotif(state, "BookIssued", "Book Issued Successfully",
        `Book '${book.title}' issued. Due date: ${fmtDate(dueDate)}. Return on time to avoid fine.`,
        memberId, issue.id);

      toast.success(`'${book.title}' issued to ${member.name}. Due: ${fmtDate(dueDate)}`);
      return {
        ...state,
        books: updatedBooks,
        members: updatedMembers,
        issues: [...state.issues, issue],
        auditLogs: [audit, ...state.auditLogs],
        notifications: [notif, ...state.notifications],
      };
    }

    // ── RETURN BOOK ──────────────────────────────────────────────────────────
    case "RETURN_BOOK": {
      const { issueId, condition, receivedBy } = action.payload;
      const issue = state.issues.find(i => i.id === issueId)!;
      const book = state.books.find(b => b.id === issue.bookId)!;
      const member = state.members.find(m => m.id === issue.memberId)!;
      const receiptNo = genReceiptNo();

      // Calculate fine
      const daysOver = Math.max(0, daysBetween(issue.dueDate, today()) - state.settings.gracePeriod);
      let fineAmount = 0;
      let fineType: FineRecord["type"] = "Overdue";

      if (condition === "Lost") {
        fineAmount = book.price * state.settings.lostBookMultiplier;
        fineType = "Lost";
      } else if (condition === "Damaged") {
        fineAmount = state.settings.damagedBookFine;
        fineType = "Damaged";
      } else if (daysOver > 0) {
        fineAmount = Math.min(daysOver * state.settings.finePerDay, state.settings.maxFine);
        fineType = "Overdue";
      }

      // Update issue record
      const updatedIssues = state.issues.map(i => i.id === issueId
        ? { ...i, status: condition === "Lost" ? "Lost" as const : "Returned" as const, returnedAt: now(), returnedBy: receivedBy, returnCondition: condition, receiptNo } : i);

      // Update book copies
      const updatedBooks = state.books.map(b => {
        if (b.id === issue.bookId) {
          const base = { ...b, issuedCopies: b.issuedCopies - 1, updatedAt: now() };
          if (condition === "Lost") return { ...base, lostCopies: b.lostCopies + 1 };
          if (condition === "Damaged") return { ...base, damagedCopies: b.damagedCopies + 1 };
          return { ...base, availableCopies: b.availableCopies + 1 };
        }
        return b;
      });

      // Update member
      const updatedMembers = state.members.map(m => m.id === issue.memberId
        ? {
            ...m,
            currentBorrowedIds: m.currentBorrowedIds.filter(id => id !== issueId),
            totalReturned: m.totalReturned + 1,
            pendingFineAmount: m.pendingFineAmount + fineAmount,
          } : m);

      const newState = { ...state, issues: updatedIssues, books: updatedBooks, members: updatedMembers };

      // Generate fine if needed
      let updatedFines = state.fines;
      let fineNotif: LibraryNotification | null = null;
      if (fineAmount > 0) {
        const fine: FineRecord = {
          id: genId("FIN"), issueId, memberId: issue.memberId,
          memberName: member.name, memberSourceId: member.sourceId,
          bookId: issue.bookId, bookTitle: issue.bookTitle, bookBarcode: issue.bookBarcode,
          type: fineType, amount: fineAmount, daysOverdue: daysOver > 0 ? daysOver : undefined,
          status: "Pending", generatedAt: now(), generatedBy: receivedBy,
        };
        updatedFines = [...state.fines, fine];
        fineNotif = makeNotif(newState, "FineGenerated", `Fine of ₹${fineAmount} Generated`,
          `A fine of ₹${fineAmount} has been generated for returning '${issue.bookTitle}' (${fineType}).`,
          issue.memberId, fine.id);
      }

      // Check reservation queue — auto-allocate
      const pendingReservation = state.reservations.find(r => r.bookId === issue.bookId && r.status === "Pending");
      let updatedReservations = state.reservations;
      const reservNotifs: LibraryNotification[] = [];
      if (pendingReservation && condition === "Good") {
        updatedReservations = state.reservations.map(r =>
          r.id === pendingReservation.id ? { ...r, status: "Ready" as const, notifiedAt: now(), expiryDate: addDays(state.settings.reservationPeriod) } : r
        );
        reservNotifs.push(makeNotif({ ...newState, reservations: updatedReservations },
          "ReservationReady", "Reserved Book Available",
          `Your reserved book '${issue.bookTitle}' is now available! Collect within ${state.settings.reservationPeriod} days.`,
          pendingReservation.memberId, pendingReservation.id));
      }

      const audit = makeAudit("ReturnBooks", "RETURN_BOOK",
        `'${issue.bookTitle}' returned by ${member.name}. Condition: ${condition}. Fine: ₹${fineAmount}. Receipt: ${receiptNo}`, receivedBy);
      const returnNotif = makeNotif({ ...newState, reservations: updatedReservations }, "BookReturned",
        "Book Returned Successfully",
        `Book '${issue.bookTitle}' returned. ${fineAmount > 0 ? `Fine: ₹${fineAmount}.` : "No fine."}`,
        issue.memberId, issueId);

      toast.success(`'${issue.bookTitle}' returned! ${fineAmount > 0 ? `Fine: ₹${fineAmount}` : "No fine."}`);
      return {
        ...newState,
        fines: updatedFines,
        reservations: updatedReservations,
        auditLogs: [audit, ...newState.auditLogs],
        notifications: [returnNotif, ...(fineNotif ? [fineNotif] : []), ...reservNotifs, ...newState.notifications],
      };
    }

    // ── RENEW BOOK ───────────────────────────────────────────────────────────
    case "RENEW_BOOK": {
      const issue = state.issues.find(i => i.id === action.payload.issueId)!;
      if (issue.renewCount >= issue.maxRenewals) throw new Error(`Max renewals (${issue.maxRenewals}) reached.`);
      const member = state.members.find(m => m.id === issue.memberId)!;
      if (member.pendingFineAmount > 0) throw new Error(`Clear pending fine ₹${member.pendingFineAmount} before renewal.`);
      const newDue = addDays(state.settings.renewalExtensionDays);
      const renewEntry = { renewedAt: now(), newDueDate: newDue, renewedBy: action.payload.renewedBy };
      const updated = state.issues.map(i => i.id === action.payload.issueId
        ? { ...i, dueDate: newDue, renewCount: i.renewCount + 1, renewHistory: [...i.renewHistory, renewEntry], status: "Renewed" as const } : i);
      const audit = makeAudit("IssueBooks", "RENEW_BOOK",
        `'${issue.bookTitle}' renewed for ${issue.memberName}. New due: ${fmtDate(newDue)}. Renewal #${issue.renewCount + 1}`);
      toast.success(`Book renewed! New due date: ${fmtDate(newDue)}`);
      return { ...state, issues: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── FINE MANAGEMENT ──────────────────────────────────────────────────────
    case "COLLECT_FINE": {
      const fine = state.fines.find(f => f.id === action.payload.fineId)!;
      const receiptNo = genReceiptNo();
      const updatedFines = state.fines.map(f => f.id === action.payload.fineId
        ? { ...f, status: "Paid" as const, paidAt: now(), paidAmount: action.payload.amount, receiptNo } : f);
      const updatedMembers = state.members.map(m => m.id === fine.memberId
        ? { ...m, pendingFineAmount: Math.max(0, m.pendingFineAmount - action.payload.amount), totalFinesPaid: m.totalFinesPaid + action.payload.amount } : m);
      const audit = makeAudit("FineManagement", "COLLECT_FINE",
        `Fine ₹${action.payload.amount} collected from ${fine.memberName}. Receipt: ${receiptNo}`, action.payload.by);
      const notif = makeNotif(state, "FinePaid", "Fine Payment Received",
        `Fine of ₹${action.payload.amount} collected. Receipt: ${receiptNo}.`,
        fine.memberId, fine.id);

      // Auto-activate if member was blocked due to fine and fine cleared
      const member = state.members.find(m => m.id === fine.memberId)!;
      let finalMembers = updatedMembers;
      if (member.status === "Blocked" && member.pendingFineAmount <= action.payload.amount) {
        finalMembers = updatedMembers.map(m => m.id === fine.memberId
          ? { ...m, status: "Active" as const, blockedReason: undefined, blockedAt: undefined } : m);
      }

      toast.success(`Fine ₹${action.payload.amount} collected! Receipt: ${receiptNo}`);
      return { ...state, fines: updatedFines, members: finalMembers, auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "WAIVE_FINE": {
      const fine = state.fines.find(f => f.id === action.payload.fineId)!;
      const updatedFines = state.fines.map(f => f.id === action.payload.fineId
        ? { ...f, status: "Waived" as const, waivedBy: action.payload.by, waiverReason: action.payload.reason, waivedAt: now() } : f);
      const updatedMembers = state.members.map(m => m.id === fine.memberId
        ? { ...m, pendingFineAmount: Math.max(0, m.pendingFineAmount - fine.amount) } : m);
      const audit = makeAudit("FineManagement", "WAIVE_FINE",
        `Fine ₹${fine.amount} waived for ${fine.memberName}. Reason: ${action.payload.reason}`, action.payload.by);
      toast.success(`Fine of ₹${fine.amount} waived for ${fine.memberName}!`);
      return { ...state, fines: updatedFines, members: updatedMembers, auditLogs: [audit, ...state.auditLogs] };
    }

    case "ADD_FINE": {
      const fine: FineRecord = { ...action.payload, id: genId("FIN"), generatedAt: now(), receiptNo: undefined };
      const updatedMembers = state.members.map(m => m.id === fine.memberId
        ? { ...m, pendingFineAmount: m.pendingFineAmount + fine.amount } : m);
      const audit = makeAudit("FineManagement", "ADD_FINE",
        `Fine ₹${fine.amount} (${fine.type}) added for ${fine.memberName}`);
      toast.warning(`Fine ₹${fine.amount} added for ${fine.memberName}`);
      return { ...state, fines: [...state.fines, fine], members: updatedMembers, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── RESERVATIONS ─────────────────────────────────────────────────────────
    case "PLACE_RESERVATION": {
      const { bookId, memberId } = action.payload;
      const book = state.books.find(b => b.id === bookId)!;
      const member = state.members.find(m => m.id === memberId)!;
      if (member.status !== "Active") throw new Error("Member is not active.");
      const existing = state.reservations.find(r => r.bookId === bookId && r.memberId === memberId && r.status === "Pending");
      if (existing) throw new Error("Already reserved this book.");

      const queuePos = state.reservations.filter(r => r.bookId === bookId && r.status === "Pending").length + 1;
      const reservation: Reservation = {
        id: genId("RES"), bookId, bookTitle: book.title, bookBarcode: book.barcode,
        memberId, memberName: member.name, memberType: member.type,
        reservedAt: now(), expiryDate: addDays(state.settings.reservationPeriod + 14),
        queuePosition: queuePos, status: "Pending",
      };

      const updatedBooks = state.books.map(b => b.id === bookId
        ? { ...b, reservedCopies: b.reservedCopies + 1, updatedAt: now() } : b);

      const audit = makeAudit("Reservations", "PLACE_RESERVATION",
        `'${book.title}' reserved by ${member.name}. Queue position: #${queuePos}`);
      const notif = makeNotif(state, "ReservationReady", "Reservation Placed",
        `Your reservation for '${book.title}' is confirmed. You are #${queuePos} in the queue.`,
        memberId, reservation.id);

      toast.success(`Book '${book.title}' reserved! Queue position: #${queuePos}`);
      return { ...state, books: updatedBooks, reservations: [...state.reservations, reservation], auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "CANCEL_RESERVATION": {
      const res = state.reservations.find(r => r.id === action.payload.id)!;
      const updated = state.reservations.map(r => r.id === action.payload.id
        ? { ...r, status: "Cancelled" as const, cancelledAt: now(), cancelledBy: action.payload.by } : r);
      const updatedBooks = state.books.map(b => b.id === res.bookId
        ? { ...b, reservedCopies: Math.max(0, b.reservedCopies - 1), updatedAt: now() } : b);
      const audit = makeAudit("Reservations", "CANCEL_RESERVATION",
        `Reservation for '${res.bookTitle}' cancelled for ${res.memberName}`, action.payload.by);
      toast.success("Reservation cancelled!");
      return { ...state, reservations: updated, books: updatedBooks, auditLogs: [audit, ...state.auditLogs] };
    }

    case "COLLECT_RESERVATION": {
      const res = state.reservations.find(r => r.id === action.payload.id)!;
      const updated = state.reservations.map(r => r.id === action.payload.id
        ? { ...r, status: "Collected" as const, collectedAt: now(), collectedBy: action.payload.by } : r);
      const audit = makeAudit("Reservations", "COLLECT_RESERVATION",
        `Reserved book '${res.bookTitle}' collected by ${res.memberName}`, action.payload.by);
      toast.success(`Reserved book collected by ${res.memberName}!`);
      return { ...state, reservations: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── ACQUISITION ──────────────────────────────────────────────────────────
    case "ADD_ACQUISITION": {
      const req: AcquisitionRequest = {
        ...action.payload, id: genId("ACQ"), requestedAt: now(), status: "Requested",
      };
      const audit = makeAudit("Acquisition", "ADD_ACQUISITION",
        `Book request '${req.title}' submitted by ${req.requestedBy} (${req.department})`);
      const notif = makeNotif(state, "AcquisitionApproved", "Book Purchase Request Submitted",
        `Request for '${req.title}' (Qty: ${req.quantity}) submitted by ${req.department} for review.`,
        undefined, req.id);
      toast.success(`Acquisition request submitted for '${req.title}'!`);
      return { ...state, acquisitions: [...state.acquisitions, req], auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "UPDATE_ACQUISITION_STATUS": {
      const req = state.acquisitions.find(a => a.id === action.payload.id)!;
      const updated = state.acquisitions.map(a => a.id === action.payload.id
        ? { ...a, status: action.payload.status, ...(action.payload.status === "Approved" ? { approvedBy: action.payload.by, approvedAt: now() } : {}), ...(action.payload.status === "Rejected" ? { rejectedReason: action.payload.notes } : {}) } : a);
      const audit = makeAudit("Acquisition", "UPDATE_ACQUISITION",
        `Acquisition '${req.title}' status updated to ${action.payload.status} by ${action.payload.by}`, action.payload.by);
      toast.success(`Acquisition status updated to ${action.payload.status}`);
      return { ...state, acquisitions: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── INVENTORY ────────────────────────────────────────────────────────────
    case "START_AUDIT": {
      const session = {
        id: genId("AUDIT-S"),
        sessionName: action.payload.sessionName,
        startedBy: action.payload.by,
        startedAt: now(),
        status: "InProgress" as const,
        scope: action.payload.scope,
        totalScanned: 0, verified: 0, missing: 0, damaged: 0, extra: 0,
        items: [],
      };
      const audit = makeAudit("Inventory", "START_AUDIT",
        `Inventory audit '${action.payload.sessionName}' started. Scope: ${action.payload.scope}`, action.payload.by);
      toast.success(`Audit session '${action.payload.sessionName}' started!`);
      return { ...state, auditSessions: [...state.auditSessions, session], auditLogs: [audit, ...state.auditLogs] };
    }

    case "COMPLETE_AUDIT": {
      const updated = state.auditSessions.map(s => s.id === action.payload.sessionId
        ? { ...s, status: "Completed" as const, completedAt: now() } : s);
      const audit = makeAudit("Inventory", "COMPLETE_AUDIT", `Inventory audit completed by ${action.payload.by}`, action.payload.by);
      toast.success("Inventory audit completed!");
      return { ...state, auditSessions: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── DIGITAL LIBRARY ──────────────────────────────────────────────────────
    case "ADD_DIGITAL_RESOURCE": {
      const res: DigitalResource = {
        ...action.payload, id: genId("DR"), uploadedAt: now(), downloadCount: 0, viewCount: 0,
      };
      const audit = makeAudit("DigitalLibrary", "ADD_RESOURCE",
        `Digital resource '${res.title}' (${res.type}) uploaded by ${res.uploadedBy}`);
      toast.success(`Resource '${res.title}' uploaded!`);
      return { ...state, digitalResources: [...state.digitalResources, res], auditLogs: [audit, ...state.auditLogs] };
    }

    case "DOWNLOAD_RESOURCE": {
      const updated = state.digitalResources.map(r => r.id === action.payload.resourceId
        ? { ...r, downloadCount: r.downloadCount + 1 } : r);
      return { ...state, digitalResources: updated };
    }

    // ── READING HALL ─────────────────────────────────────────────────────────
    case "ALLOCATE_SEAT": {
      const { seatNo, memberId, verifiedBy } = action.payload;
      const member = state.members.find(m => m.id === memberId)!;
      if (member.status !== "Active") throw new Error("Member not active.");
      const seat = state.seats.find(s => s.seatNo === seatNo);
      if (seat?.status === "Occupied") throw new Error("Seat already occupied.");

      const updatedSeats = state.seats.map(s => s.seatNo === seatNo
        ? { ...s, status: "Occupied" as const, memberId, memberName: member.name, entryTime: new Date().toLocaleTimeString("en-IN") } : s);
      const booking: SeatBookingRecord = {
        id: genId("SB"), seatNo, zone: seatNo[0],
        memberId, memberName: member.name, memberType: member.type,
        memberSourceId: member.sourceId, entryTime: now(), date: today(), verifiedBy,
      };
      const audit = makeAudit("ReadingHall", "ALLOCATE_SEAT",
        `Seat ${seatNo} allocated to ${member.name}`, verifiedBy);
      toast.success(`Seat ${seatNo} allocated to ${member.name}!`);
      return { ...state, seats: updatedSeats, seatBookings: [...state.seatBookings, booking], auditLogs: [audit, ...state.auditLogs] };
    }

    case "EXIT_SEAT": {
      const seat = state.seats.find(s => s.seatNo === action.payload.seatNo);
      const updatedSeats = state.seats.map(s => s.seatNo === action.payload.seatNo
        ? { ...s, status: "Available" as const, memberId: undefined, memberName: undefined, entryTime: undefined } : s);
      const updatedBookings = state.seatBookings.map(b => {
        if (b.seatNo === action.payload.seatNo && !b.exitTime) {
          const entryMs = new Date(b.entryTime).getTime();
          const dur = Math.floor((Date.now() - entryMs) / 60000);
          return { ...b, exitTime: now(), durationMinutes: dur };
        }
        return b;
      });
      const audit = makeAudit("ReadingHall", "EXIT_SEAT",
        `${seat?.memberName} exited from seat ${action.payload.seatNo}`, action.payload.by);
      toast.success(`${seat?.memberName} exited from seat ${action.payload.seatNo}!`);
      return { ...state, seats: updatedSeats, seatBookings: updatedBookings, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── LIBRARY ENTRY ────────────────────────────────────────────────────────
    case "RECORD_ENTRY": {
      const { memberId, method } = action.payload;
      const member = state.members.find(m => m.id === memberId)!;
      if (!member) throw new Error("Member not found.");
      // Check if already inside
      const alreadyIn = state.entryLogs.find(e => e.memberId === memberId && e.date === today() && !e.exitTime);
      if (alreadyIn) throw new Error("Already inside library.");

      const log: LibraryEntryLog = {
        id: genId("ENTRY"), memberId, memberName: member.name, memberType: member.type,
        memberSourceId: member.sourceId, entryMethod: method, entryTime: now(), date: today(),
      };
      toast.success(`${member.name} entered library via ${method}.`);
      return { ...state, entryLogs: [...state.entryLogs, log] };
    }

    case "RECORD_EXIT": {
      const log = state.entryLogs.find(e => e.memberId === action.payload.memberId && e.date === today() && !e.exitTime);
      if (!log) return state;
      const dur = Math.floor((Date.now() - new Date(log.entryTime).getTime()) / 60000);
      const updated = state.entryLogs.map(e => e.id === log.id
        ? { ...e, exitTime: now(), durationMinutes: dur } : e);
      toast.success(`${log.memberName} exited. Duration: ${dur} min.`);
      return { ...state, entryLogs: updated };
    }

    // ── ID CARDS ─────────────────────────────────────────────────────────────
    case "ISSUE_ID_CARD": {
      const cardNo = genCardNo(state.idCards.length + 1);
      const card: LibraryIDCard = {
        ...action.payload, id: genId("CARD"), cardNo, issuedAt: now(), status: "Active",
      };
      const updatedMembers = state.members.map(m => m.id === card.memberId
        ? { ...m, cardId: card.id, cardStatus: "Active" as const, rfidTag: card.rfidTag } : m);
      const audit = makeAudit("IDCards", "ISSUE_ID_CARD",
        `Library ID Card issued to ${card.memberName}. Card: ${cardNo}. Type: ${card.cardType}`, card.issuedBy);
      const notif = makeNotif(state, "CardIssued", "Library ID Card Issued",
        `Your library ID card (${cardNo}) has been issued. Type: ${card.cardType}.`,
        card.memberId, card.id);
      toast.success(`ID Card ${cardNo} issued to ${card.memberName}!`);
      return { ...state, idCards: [...state.idCards, card], members: updatedMembers, auditLogs: [audit, ...state.auditLogs], notifications: [notif, ...state.notifications] };
    }

    case "UPDATE_CARD_STATUS": {
      const card = state.idCards.find(c => c.id === action.payload.id)!;
      const updated = state.idCards.map(c => c.id === action.payload.id ? { ...c, status: action.payload.status } : c);
      const audit = makeAudit("IDCards", "UPDATE_CARD_STATUS",
        `Card ${card.cardNo} status updated to ${action.payload.status}`, action.payload.by);
      toast.success(`Card status updated to ${action.payload.status}!`);
      return { ...state, idCards: updated, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── NOTIFICATIONS ────────────────────────────────────────────────────────
    case "MARK_NOTIFICATION_READ": {
      const updated = state.notifications.map(n => n.id === action.payload.id ? { ...n, status: "Read" as const, readAt: now() } : n);
      return { ...state, notifications: updated };
    }

    // ── SETTINGS ─────────────────────────────────────────────────────────────
    case "UPDATE_SETTINGS": {
      const audit = makeAudit("Settings", "UPDATE_SETTINGS", "Library settings updated");
      toast.success("Library settings saved!");
      return { ...state, settings: { ...state.settings, ...action.payload }, auditLogs: [audit, ...state.auditLogs] };
    }

    // ── AUDIT LOG ────────────────────────────────────────────────────────────
    case "ADD_AUDIT_LOG": {
      const log: AuditLog = { ...action.payload, id: genId("AUDIT"), timestamp: now() };
      return { ...state, auditLogs: [log, ...state.auditLogs] };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DERIVED STATS COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

function computeStats(state: LibraryState): LibraryDashboardStats {
  const todayStr = today();
  const todayIssues = state.issues.filter(i => i.issuedAt.slice(0, 10) === todayStr).length;
  const todayReturns = state.issues.filter(i => i.returnedAt?.slice(0, 10) === todayStr).length;
  const todayVisitors = state.entryLogs.filter(e => e.date === todayStr).length;
  const overdueCount = state.issues.filter(i => i.status === "Active" && new Date(i.dueDate) < new Date()).length;
  const occupiedSeats = state.seats.filter(s => s.status === "Occupied").length;

  const recentActivities: RecentActivity[] = [
    ...state.issues.slice(0, 5).map(i => ({
      id: i.id, action: "Book Issued",
      description: `'${i.bookTitle}' issued to ${i.memberName}`,
      user: i.issuedBy, timestamp: i.issuedAt, module: "IssueBooks" as LibraryModule, type: "issue" as const,
    })),
    ...state.issues.filter(i => i.returnedAt).slice(0, 3).map(i => ({
      id: `ret-${i.id}`, action: "Book Returned",
      description: `'${i.bookTitle}' returned by ${i.memberName}`,
      user: i.returnedBy || "Librarian", timestamp: i.returnedAt!, module: "ReturnBooks" as LibraryModule, type: "return" as const,
    })),
    ...state.fines.filter(f => f.status === "Pending").slice(0, 2).map(f => ({
      id: f.id, action: "Fine Generated",
      description: `₹${f.amount} fine for ${f.memberName} (${f.type})`,
      user: f.generatedBy, timestamp: f.generatedAt, module: "FineManagement" as LibraryModule, type: "fine" as const,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyIssuesData = monthNames.slice(0, 8).map((month, i) => ({
    month,
    count: [45, 62, 58, 74, 80, 95, 88, state.issues.length][i],
  }));

  const catMap: Record<string, number> = {};
  state.books.forEach(b => { catMap[b.category] = (catMap[b.category] || 0) + b.totalCopies; });
  const categoryWiseBooks = Object.entries(catMap).map(([category, count]) => ({ category, count }));

  const topBorrowedBooks = state.books
    .sort((a, b) => b.issuedCopies - a.issuedCopies)
    .slice(0, 5)
    .map(b => ({ title: b.title, count: b.issuedCopies + b.totalBorrowed }));

  return {
    totalBooks: state.books.reduce((a, b) => a + b.totalCopies, 0),
    availableBooks: state.books.reduce((a, b) => a + b.availableCopies, 0),
    issuedBooks: state.issues.filter(i => i.status === "Active" || i.status === "Renewed").length,
    reservedBooks: state.books.reduce((a, b) => a + b.reservedCopies, 0),
    lostBooks: state.books.reduce((a, b) => a + b.lostCopies, 0),
    damagedBooks: state.books.reduce((a, b) => a + b.damagedCopies, 0),
    todayVisitors, todayIssues, todayReturns,
    activeMembers: state.members.filter(m => m.status === "Active").length,
    pendingReservations: state.reservations.filter(r => r.status === "Pending").length,
    totalFineCollected: state.fines.filter(f => f.status === "Paid").reduce((a, f) => a + (f.paidAmount || 0), 0),
    pendingFines: state.fines.filter(f => f.status === "Pending").reduce((a, f) => a + f.amount, 0),
    overdueBooks: overdueCount,
    activeAuditSessions: state.auditSessions.filter(s => s.status === "InProgress").length,
    totalDigitalResources: state.digitalResources.length,
    readingHallOccupancy: occupiedSeats,
    readingHallCapacity: state.seats.length,
    recentActivities,
    monthlyIssuesData,
    categoryWiseBooks,
    topBorrowedBooks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const LibraryContext = createContext<LibraryContextType>(null as any);

export function LibraryStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, INITIAL_STATE);

  const safeDispatch = useCallback((action: LibraryAction) => {
    try {
      dispatch(action);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  }, []);

  const stats = useMemo(() => computeStats(state), [state]);

  const getBook = useCallback((id: string) => state.books.find(b => b.id === id), [state.books]);
  const getMember = useCallback((id: string) => state.members.find(m => m.id === id), [state.members]);
  const getIssue = useCallback((id: string) => state.issues.find(i => i.id === id), [state.issues]);
  const getMemberIssues = useCallback((memberId: string) => state.issues.filter(i => i.memberId === memberId), [state.issues]);
  const getMemberFines = useCallback((memberId: string) => state.fines.filter(f => f.memberId === memberId), [state.fines]);
  const getBookReservations = useCallback((bookId: string) => state.reservations.filter(r => r.bookId === bookId), [state.reservations]);
  const getMemberNotifications = useCallback((memberId?: string) =>
    memberId ? state.notifications.filter(n => !n.memberId || n.memberId === memberId) : state.notifications,
    [state.notifications]);

  const isOverdue = useCallback((issue: IssueRecord) =>
    issue.status === "Active" && new Date(issue.dueDate) < new Date(), []);

  const calculateFine = useCallback((issue: IssueRecord) => {
    const daysOver = Math.max(0, daysBetween(issue.dueDate, today()) - state.settings.gracePeriod);
    return Math.min(daysOver * state.settings.finePerDay, state.settings.maxFine);
  }, [state.settings]);

  const canIssueBook = useCallback((memberId: string, bookId: string): { allowed: boolean; reason?: string } => {
    const member = state.members.find(m => m.id === memberId);
    const book = state.books.find(b => b.id === bookId);
    if (!member) return { allowed: false, reason: "Member not found" };
    if (!book) return { allowed: false, reason: "Book not found" };
    if (member.status !== "Active") return { allowed: false, reason: `Member is ${member.status}` };
    if (member.pendingFineAmount > 0) return { allowed: false, reason: `Pending fine ₹${member.pendingFineAmount}` };
    const maxBooks = member.type === "Student" ? state.settings.maxBooksStudent : state.settings.maxBooksFaculty;
    if (member.currentBorrowedIds.length >= maxBooks) return { allowed: false, reason: `Borrow limit (${maxBooks}) reached` };
    if (book.availableCopies < 1) return { allowed: false, reason: "No copies available" };
    if (book.status !== "Active") return { allowed: false, reason: `Book is ${book.status}` };
    return { allowed: true };
  }, [state.members, state.books, state.settings]);

  const value: LibraryContextType = useMemo(() => ({
    state,
    dispatch: safeDispatch,
    stats,
    getBook, getMember, getIssue,
    getMemberIssues, getMemberFines, getBookReservations, getMemberNotifications,
    isOverdue, calculateFine, canIssueBook,
  }), [state, safeDispatch, stats, getBook, getMember, getIssue, getMemberIssues, getMemberFines, getBookReservations, getMemberNotifications, isOverdue, calculateFine, canIssueBook]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibraryStore() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibraryStore must be used inside LibraryStoreProvider");
  return ctx;
}

// Re-export types for convenience
export type { LibraryContextType, LibraryState, LibraryAction };
