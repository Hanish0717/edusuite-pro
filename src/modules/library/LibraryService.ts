import api from "@/lib/api";

export interface LibraryBook {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  isbn: string;
  category: "Computer Science" | "Electronics" | "Mechanical" | "AI & Data Science" | "General Science";
  totalCopies: number;
  availableCopies: number;
  rackNo: string;
}

export interface BookIssueRecord {
  id: string;
  issueId: string;
  rollNo: string;
  studentName: string;
  bookTitle: string;
  accessionNo: string;
  issueDate: string;
  dueDate: string;
  status: "Issued" | "Returned" | "Overdue";
  fineAmount: number;
}

export interface LibraryConfig {
  borrowingPeriodDays: number;
  maxBooksPerStudent: number;
  maxBooksPerFaculty: number;
  finePerDay: number;
  lostBookPolicy: string;
  reservationPolicy: string;
  digitalLibraryAccess: string;
  workingHours: string;
  holidayCalendar: string;
  notificationRules: string;
  lateReturnPolicy: string;
}

export interface LibraryHealthStatus {
  bookAvailability: string;
  shelfOccupancy: string;
  digitalResourceAvailability: string;
  systemStatus: string;
  rfidStatus: string;
  barcodeScannerStatus: string;
  libraryDatabaseStatus: string;
  overallHealthScore: number; // e.g. 98
}

export interface OverdueSummary {
  booksOverdue: number;
  finePending: number;
  longestOverdue: string;
  criticalOverdue: number;
  departmentsWithHighestOverdue: string;
}

export interface DigitalSubscription {
  id: string;
  name: string;
  publisher: string;
  activeSubscription: boolean;
  expiryDate: string;
  usageStats: string;
}

export interface LibrarianStaffSummary {
  currentLibrarian: string;
  assistantLibrariansCount: number;
  staffAvailability: string;
  pendingLeaveRequests: number;
  staffPerformanceSummary: string;
}

export interface LibraryAlert {
  id: string;
  severity: "high" | "medium" | "info";
  title: string;
  description: string;
  timestamp: string;
}

export interface LibraryActivityLog {
  id: string;
  date: string;
  user: string;
  action: string;
  category: string;
}

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: "BK-101",
    accessionNo: "ACC-45890",
    title: "Artificial Intelligence: A Modern Approach (4th Ed)",
    author: "Stuart Russell & Peter Norvig",
    isbn: "978-0134610993",
    category: "Computer Science",
    totalCopies: 15,
    availableCopies: 11,
    rackNo: "Rack CS-04",
  },
  {
    id: "BK-102",
    accessionNo: "ACC-32145",
    title: "CMOS VLSI Design: A Circuits and Systems Perspective",
    author: "Neil Weste & David Harris",
    isbn: "978-0321547743",
    category: "Electronics",
    totalCopies: 10,
    availableCopies: 4,
    rackNo: "Rack EC-02",
  },
  {
    id: "BK-103",
    accessionNo: "ACC-21098",
    title: "Shigley's Mechanical Engineering Design",
    author: "Richard Budynas & Keith Nisbett",
    isbn: "978-0073398204",
    category: "Mechanical",
    totalCopies: 12,
    availableCopies: 8,
    rackNo: "Rack ME-01",
  },
  {
    id: "BK-104",
    accessionNo: "ACC-54321",
    title: "Deep Learning with Python & PyTorch",
    author: "Francois Chollet",
    isbn: "978-1617294433",
    category: "AI & Data Science",
    totalCopies: 20,
    availableCopies: 16,
    rackNo: "Rack AI-01",
  },
  {
    id: "BK-105",
    accessionNo: "ACC-67890",
    title: "University Physics with Modern Physics",
    author: "Hugh Young & Roger Freedman",
    isbn: "978-0135159552",
    category: "General Science",
    totalCopies: 18,
    availableCopies: 14,
    rackNo: "Rack GS-03",
  },
];

export const INITIAL_ISSUES: BookIssueRecord[] = [
  {
    id: "ISS-501",
    issueId: "ISS-2026-088",
    rollNo: "22CSE001",
    studentName: "Aarav Sharma",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    accessionNo: "ACC-45890",
    issueDate: "2026-07-20",
    dueDate: "2026-08-04",
    status: "Issued",
    fineAmount: 0,
  },
  {
    id: "ISS-502",
    issueId: "ISS-2026-042",
    rollNo: "22ECE042",
    studentName: "Ananya Iyer",
    bookTitle: "CMOS VLSI Design",
    accessionNo: "ACC-32145",
    issueDate: "2026-07-10",
    dueDate: "2026-07-25",
    status: "Overdue",
    fineAmount: 140,
  },
  {
    id: "ISS-503",
    issueId: "ISS-2026-105",
    rollNo: "23MECH018",
    studentName: "Rohan Verma",
    bookTitle: "Shigley's Mechanical Engineering Design",
    accessionNo: "ACC-21098",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "Issued",
    fineAmount: 0,
  },
  {
    id: "ISS-504",
    issueId: "ISS-2026-112",
    rollNo: "24CIVIL009",
    studentName: "Priya Nair",
    bookTitle: "Deep Learning with Python",
    accessionNo: "ACC-54321",
    issueDate: "2026-07-05",
    dueDate: "2026-07-19",
    status: "Overdue",
    fineAmount: 220,
  },
];

export const DEFAULT_LIBRARY_CONFIG: LibraryConfig = {
  borrowingPeriodDays: 14,
  maxBooksPerStudent: 4,
  maxBooksPerFaculty: 10,
  finePerDay: 10,
  lostBookPolicy: "Replacement with new copy or 150% printed book cost penalty.",
  reservationPolicy: "Reserved titles held for 48 Hours upon check-in return.",
  digitalLibraryAccess: "24/7 Remote VPN & Campus IP Range Access authorized.",
  workingHours: "Mon-Sat: 8:00 AM - 9:00 PM | Sun: 10:00 AM - 4:00 PM",
  holidayCalendar: "Gazetted University Holidays & Festival Vacations apply.",
  notificationRules: "Automated SMS & Email alerts sent 2 days prior to due date.",
  lateReturnPolicy: "Suspension of borrowing privileges if overdue exceeds 15 days.",
};

export const DEFAULT_LIBRARY_HEALTH: LibraryHealthStatus = {
  bookAvailability: "92.4% Available",
  shelfOccupancy: "88.5% Shelf Capacity",
  digitalResourceAvailability: "100% Uptime",
  systemStatus: "Operational (KOHA ERP Integrated)",
  rfidStatus: "Active (12 Smart Gates Online)",
  barcodeScannerStatus: "100% Operational",
  libraryDatabaseStatus: "Synced (PostgreSQL Cluster)",
  overallHealthScore: 98,
};

export const DEFAULT_OVERDUE_SUMMARY: OverdueSummary = {
  booksOverdue: 14,
  finePending: 1420,
  longestOverdue: "42 Days (CMOS Microelectronics)",
  criticalOverdue: 3,
  departmentsWithHighestOverdue: "CSE (6) & Mechanical (4)",
};

export const DEFAULT_DIGITAL_SUBSCRIPTIONS: DigitalSubscription[] = [
  {
    id: "DS-001",
    name: "IEEE Xplore Digital Library",
    publisher: "IEEE",
    activeSubscription: true,
    expiryDate: "2026-12-31",
    usageStats: "14,250 Downloads / Month",
  },
  {
    id: "DS-002",
    name: "SpringerLink Journals",
    publisher: "Springer Nature",
    activeSubscription: true,
    expiryDate: "2026-11-15",
    usageStats: "9,800 Searches / Month",
  },
  {
    id: "DS-003",
    name: "Elsevier ScienceDirect",
    publisher: "Elsevier",
    activeSubscription: true,
    expiryDate: "2027-03-31",
    usageStats: "11,400 Articles Downloaded",
  },
  {
    id: "DS-004",
    name: "ACM Digital Library",
    publisher: "Association for Computing Machinery",
    activeSubscription: true,
    expiryDate: "2026-10-30",
    usageStats: "8,200 Papers Accessed",
  },
  {
    id: "DS-005",
    name: "NPTEL Video Portal",
    publisher: "IIT / MHRD Govt of India",
    activeSubscription: true,
    expiryDate: "Lifetime Access",
    usageStats: "24,500 Streaming Hours",
  },
  {
    id: "DS-006",
    name: "National Digital Library (NDLI)",
    publisher: "IIT Kharagpur",
    activeSubscription: true,
    expiryDate: "Institutional Member",
    usageStats: "18,900 Student Logins",
  },
];

export const INITIAL_ALERTS: LibraryAlert[] = [
  {
    id: "ALT-201",
    severity: "high",
    title: "High Overdue Books Count",
    description: "14 books past due date requiring automated SMS reminder dispatch.",
    timestamp: "1 Hour ago",
  },
  {
    id: "ALT-202",
    severity: "medium",
    title: "Shelf Capacity Reached",
    description: "Computer Science Section (Rack CS-04) reaching 94% stack density.",
    timestamp: "4 Hours ago",
  },
  {
    id: "ALT-203",
    severity: "info",
    title: "Digital License Expiring Soon",
    description: "ACM Digital Library subscription renewal due in 45 days.",
    timestamp: "1 Day ago",
  },
  {
    id: "ALT-204",
    severity: "medium",
    title: "Inventory Audit Due",
    description: "Annual physical stock audit scheduled for Electronics section.",
    timestamp: "2 Days ago",
  },
  {
    id: "ALT-205",
    severity: "info",
    title: "Low Stock Category",
    description: "AI & Data Science reference books stock falling below minimum threshold.",
    timestamp: "3 Days ago",
  },
  {
    id: "ALT-206",
    severity: "high",
    title: "Damaged Books Pending Replacement",
    description: "5 volumes flagged for binding repair or publisher re-order.",
    timestamp: "4 Days ago",
  },
];

export const INITIAL_ACTIVITIES: LibraryActivityLog[] = [
  {
    id: "ACT-101",
    date: "2026-08-04 15:10",
    user: "Dr. K. V. Ramanathan (Chief Librarian)",
    action: "Digital Resource License Renewed (Elsevier ScienceDirect)",
    category: "Subscriptions",
  },
  {
    id: "ACT-102",
    date: "2026-08-03 14:00",
    user: "Assistant Librarian (Section B)",
    action: "Inventory Stock Audit Completed (Mechanical Dept)",
    category: "Audit",
  },
  {
    id: "ACT-103",
    date: "2026-08-02 11:30",
    user: "System Admin",
    action: "Library Closed Notification Posted (Independence Day Holiday)",
    category: "Notice",
  },
  {
    id: "ACT-104",
    date: "2026-08-01 09:45",
    user: "Technical Support Desk",
    action: "RFID Smart Gate Firmware Updated",
    category: "Infrastructure",
  },
  {
    id: "ACT-105",
    date: "2026-07-30 16:20",
    user: "Chief Librarian",
    action: "New Books Batch Added (ACC-67800 to ACC-67890)",
    category: "Acquisitions",
  },
];

export const DEFAULT_STAFF_SUMMARY: LibrarianStaffSummary = {
  currentLibrarian: "Dr. K. V. Ramanathan (Chief Librarian)",
  assistantLibrariansCount: 4,
  staffAvailability: "100% On Duty (All shifts manned)",
  pendingLeaveRequests: 1,
  staffPerformanceSummary: "Grade A+ (99.2% Catalog Audit Accuracy)",
};

export async function fetchLibraryBooks(): Promise<LibraryBook[]> {
  try {
    const res = await api.get("/api/library/books");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_BOOKS;
}

export async function fetchBookIssues(): Promise<BookIssueRecord[]> {
  try {
    const res = await api.get("/api/library/issues");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_ISSUES;
}

export async function createLibraryBook(data: Partial<LibraryBook>): Promise<LibraryBook> {
  try {
    const res = await api.post("/api/library/books", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `BK-${Math.floor(104 + Math.random() * 900)}`,
    accessionNo: `ACC-${Math.floor(50000 + Math.random() * 90000)}`,
    title: data.title || "New Computer Science Textbook",
    author: data.author || "Author Name",
    isbn: data.isbn || "978-0123456789",
    category: data.category || "Computer Science",
    totalCopies: Number(data.totalCopies) || 10,
    availableCopies: Number(data.availableCopies) || 10,
    rackNo: data.rackNo || "Rack CS-05",
  };
}

export async function issueLibraryBook(data: Partial<BookIssueRecord>): Promise<BookIssueRecord> {
  try {
    const res = await api.post("/api/library/issues", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  const now = new Date();
  const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  return {
    id: `ISS-${Math.floor(503 + Math.random() * 900)}`,
    issueId: `ISS-2026-${Math.floor(100 + Math.random() * 900)}`,
    rollNo: data.rollNo || "23CSE088",
    studentName: data.studentName || "Siddharth Nambiar",
    bookTitle: data.bookTitle || "Artificial Intelligence: A Modern Approach",
    accessionNo: data.accessionNo || "ACC-45890",
    issueDate: now.toISOString().split("T")[0]!,
    dueDate: due.toISOString().split("T")[0]!,
    status: "Issued",
    fineAmount: 0,
  };
}

export async function returnLibraryBook(id: string): Promise<boolean> {
  try {
    await api.put(`/api/library/issues/${id}/return`, {});
  } catch {}
  return true;
}
