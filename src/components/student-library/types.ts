export type BookAvailabilityStatus = "Available" | "Issued" | "Reserved" | "Reference Only";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  department: string;
  rackNumber: string;
  edition: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  status: BookAvailabilityStatus;
  coverImage: string;
  description: string;
  language: string;
  semester?: string;
  rating?: number;
  callNumber?: string;
  bookType?: string;
  pages?: number;
  shelfNumber?: string;
  subject?: string;
}

export interface IssuedBookItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  issueDate: string;
  dueDate: string;
  daysRemaining: number;
  accNumber: string;
  fineAmount: number;
  renewalsCount: number;
  maxRenewals: number;
  status?: string;
  librarianName?: string;
  issueCounter?: string;
  finePaid?: boolean;
  lateDays?: number;
}

export type BorrowedBook = IssuedBookItem;

export interface BorrowHistoryItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  issuedDate: string;
  returnedDate: string;
  finePaid: number;
  status: "Returned" | "Returned Late" | "Lost & Replaced";
  receiptId: string;
}

export interface ReservedBookItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  reservedDate: string;
  queuePosition: number;
  availabilityDate: string;
  status: "In Queue" | "Ready for Pickup" | "Expired";
  coverImage?: string;
}

export type ReservationItem = ReservedBookItem;

export interface FineRecordItem {
  id: string;
  bookTitle: string;
  reason?: string;
  amount?: number;
  dateIncurred: string;
  status: "Pending" | "Paid" | "Waived";
  transactionId?: string;
  bookId?: string;
  dueDate?: string;
  lateDays?: number;
  ratePerDay?: number;
  fineAmount?: number;
  currentDate?: string;
}

export interface DigitalResourceItem {
  id: string;
  title: string;
  category: 
    | "E-Books"
    | "Courseware"
    | "Digital Library"
    | "Dictionary"
    | "Journals"
    | "Lecture Videos"
    | "Open ETD"
    | "Useful Links"
    | "Virtual Labs"
    | "Previous Question Papers"
    | "IEEE Papers"
    | "NPTEL Courses"
    | "Research Publications";
  description: string;
  department: string;
  subject: string;
  fileFormat: string;
  fileSize: string;
  downloadsCount: number;
  authorOrProvider: string;
  year: number;
  url: string;
  isBookmarked?: boolean;
}

export interface DigitalVisitLog {
  id: string;
  resourceTitle: string;
  visitDate: string;
  durationMinutes: number;
  computerNumber?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
  type?: string;
  title?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type?: string;
}

export interface LibrarySummaryMetrics {
  booksIssued: number;
  maxBorrowLimit: number;
  booksReserved: number;
  fineAmount: number;
  availableBorrowLimit: number;
  digitalResourcesCount: number;
  recentlyAddedBooksCount: number;
}

export interface CatalogFilterState {
  searchQuery: string;
  department: string;
  semester: string;
  availability: string;
  category: string;
  language: string;
  publicationYear: string;
}
