export type BookType = "Hard Copy" | "E-Book";
export type BookAvailability = "Available" | "Issued" | "Reserved" | "Out of Stock";

export interface BookItem {
  id: string;
  coverImage: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  edition: string;
  isbn: string;
  rackNumber: string;
  shelfNumber: string;
  category: string;
  department: string;
  subject: string;
  callNumber: string;
  keywords: string[];
  bookType: BookType;
  status: BookAvailability;
  totalCopies: number;
  availableCopies: number;
  language: string;
  pages: number;
  description: string;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  accNumber: string;
  issueDate: string;
  dueDate: string;
  daysRemaining: number;
  lateDays: number;
  fineAmount: number;
  renewalsCount: number;
  maxRenewals: number;
  status: "Issued" | "Returned" | "Overdue";
  finePaid: boolean;
  librarianName?: string;
  issueCounter?: string;
}

export interface ReservationItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  reservedDate: string;
  queuePosition: number;
  availabilityDate: string;
  status: "Waiting" | "Reserved" | "Ready for Pickup";
}

export interface FineRecordItem {
  id: string;
  bookId: string;
  bookTitle: string;
  dueDate: string;
  currentDate: string;
  lateDays: number;
  ratePerDay: number;
  fineAmount: number;
  status: "Pending" | "Paid";
  transactionId?: string;
  dateIncurred: string;
}

export interface DigitalVisitLog {
  id: string;
  computerNumber: string;
  seatNumber: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  duration: string;
  lab: string;
  activity: string;
  status: "Active" | "Completed";
  system: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type:
    | "Book Issued"
    | "Book Returned"
    | "Fine Paid"
    | "Book Reserved"
    | "Digital Lab Login"
    | "Digital Lab Logout"
    | "Librarian Update";
  title: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "due_soon" | "overdue" | "reserved_available" | "fine_pending" | "new_book";
  read: boolean;
}

export interface CatalogFilterState {
  searchQuery: string;
  department: string;
  subject: string;
  availability: string;
  bookType: string;
  category: string;
}

export interface LibraryMetrics {
  totalBorrowed: number;
  currentlyBorrowed: number;
  overdueCount: number;
  recentReturns: number;
  pendingFine: number;
  reservedCount: number;
  wishlistCount: number;
  digitalVisitsCount: number;
}
