import {
  BookItem,
  BorrowedBook,
  ReservationItem,
  FineRecordItem,
  DigitalVisitLog,
  ActivityLog,
  NotificationItem,
} from "./types";

const LOCAL_STORAGE_KEY = "edusuite_student_library_data_v4";

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: "BK-1001",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin",
    publisher: "John Wiley & Sons",
    publicationYear: 2021,
    edition: "10th Edition",
    isbn: "978-1119456339",
    callNumber: "005.43 SIL/O",
    rackNumber: "RACK-B12",
    shelfNumber: "SHELF-04",
    category: "Computer Science",
    department: "Computer Science",
    subject: "Operating Systems",
    keywords: ["OS", "Kernel", "Concurrency", "Process", "Memory", "Galvin"],
    bookType: "Hard Copy",
    status: "Available",
    totalCopies: 10,
    availableCopies: 4,
    language: "English",
    pages: 976,
    description:
      "Operating System Concepts provides a clear description of the concepts that underlie operating systems.",
  },
  {
    id: "BK-1002",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose, Keith Ross",
    publisher: "Pearson Education",
    publicationYear: 2022,
    edition: "8th Edition",
    isbn: "978-0136681557",
    callNumber: "004.6 KUR/C",
    rackNumber: "RACK-NET01",
    shelfNumber: "SHELF-02",
    category: "Computer Science",
    department: "Computer Science",
    subject: "Computer Networks",
    keywords: ["Networks", "TCP/IP", "HTTP", "Protocols", "Kurose", "Sockets"],
    bookType: "E-Book",
    status: "Available",
    totalCopies: 50,
    availableCopies: 42,
    language: "English",
    pages: 864,
    description:
      "Modern overview of computer networking using the Internet and layered protocol stack.",
  },
  {
    id: "BK-1003",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    publisher: "Pearson",
    publicationYear: 2020,
    edition: "4th Edition",
    isbn: "978-0134610993",
    callNumber: "006.3 RUS/A",
    rackNumber: "RACK-AI05",
    shelfNumber: "SHELF-01",
    category: "Artificial Intelligence",
    department: "Artificial Intelligence",
    subject: "AI & Machine Learning",
    keywords: ["AI", "Neural Networks", "Agents", "Search", "Norvig", "Robotics"],
    bookType: "Hard Copy",
    status: "Available",
    totalCopies: 8,
    availableCopies: 2,
    language: "English",
    pages: 1152,
    description:
      "The comprehensive reference guide for artificial intelligence principles.",
  },
  {
    id: "BK-1004",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
    title: "Database System Concepts",
    author: "Henry F. Korth, S. Sudarshan",
    publisher: "McGraw-Hill Education",
    publicationYear: 2019,
    edition: "7th Edition",
    isbn: "978-0078022159",
    callNumber: "005.74 KOR/D",
    rackNumber: "RACK-DB02",
    shelfNumber: "SHELF-03",
    category: "Computer Science",
    department: "Computer Science",
    subject: "Database Systems",
    keywords: ["SQL", "Relational Database", "Transactions", "Korth", "Normalization"],
    bookType: "Hard Copy",
    status: "Issued",
    totalCopies: 6,
    availableCopies: 0,
    language: "English",
    pages: 1376,
    description:
      "Essential guide for database design, SQL querying, transaction management, and indexing.",
  },
  {
    id: "BK-1005",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80",
    title: "Deep Learning with Python",
    author: "François Chollet",
    publisher: "Manning Publications",
    publicationYear: 2021,
    edition: "2nd Edition",
    isbn: "978-1617296864",
    callNumber: "006.31 CHO/D",
    rackNumber: "RACK-DL01",
    shelfNumber: "SHELF-05",
    category: "Data Science",
    department: "Artificial Intelligence",
    subject: "Deep Learning",
    keywords: ["Keras", "TensorFlow", "Python", "Chollet", "Computer Vision"],
    bookType: "E-Book",
    status: "Available",
    totalCopies: 100,
    availableCopies: 95,
    language: "English",
    pages: 504,
    description:
      "Written by Keras creator François Chollet, introduces deep learning using Python and Keras.",
  },
  {
    id: "BK-1006",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
    title: "Microelectronic Circuits",
    author: "Adel S. Sedra, Kenneth C. Smith",
    publisher: "Oxford University Press",
    publicationYear: 2020,
    edition: "8th Edition",
    isbn: "978-0190853464",
    callNumber: "621.381 SED/M",
    rackNumber: "RACK-ECE08",
    shelfNumber: "SHELF-02",
    category: "Electronics",
    department: "Electronics & Comm",
    subject: "Analog Circuits",
    keywords: ["MOSFET", "Op-Amps", "Sedra", "Semiconductors", "ECE"],
    bookType: "Hard Copy",
    status: "Available",
    totalCopies: 12,
    availableCopies: 5,
    language: "English",
    pages: 1480,
    description:
      "Standard text for undergraduate electronics engineering.",
  },
];

export const INITIAL_BORROWED: BorrowedBook[] = [
  {
    id: "BR-2026-001",
    bookId: "BK-1004",
    title: "Database System Concepts",
    author: "Henry F. Korth, S. Sudarshan",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
    isbn: "978-0078022159",
    accNumber: "ACC-88391",
    issueDate: "2026-07-15",
    dueDate: "2026-08-01",
    daysRemaining: -3,
    lateDays: 3,
    fineAmount: 15.0,
    renewalsCount: 1,
    maxRenewals: 2,
    status: "Overdue",
    finePaid: false,
    librarianName: "Dr. S. Ramanujan (Chief Librarian)",
    issueCounter: "Counter #02 - Main Circulation",
  },
  {
    id: "BR-2026-002",
    bookId: "BK-1001",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    isbn: "978-1119456339",
    accNumber: "ACC-90412",
    issueDate: "2026-07-28",
    dueDate: "2026-08-18",
    daysRemaining: 14,
    lateDays: 0,
    fineAmount: 0.0,
    renewalsCount: 0,
    maxRenewals: 2,
    status: "Issued",
    finePaid: true,
    librarianName: "Prof. Ananya Sharma (Assistant Librarian)",
    issueCounter: "Counter #01 - Circulation Desk",
  },
];

export const INITIAL_RESERVATIONS: ReservationItem[] = [
  {
    id: "RES-9901",
    bookId: "BK-1003",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    reservedDate: "2026-08-02",
    queuePosition: 1,
    availabilityDate: "2026-08-06",
    status: "Ready for Pickup",
  },
];

export const INITIAL_FINES: FineRecordItem[] = [
  {
    id: "FINE-8801",
    bookId: "BK-1004",
    bookTitle: "Database System Concepts",
    dueDate: "2026-08-01",
    currentDate: "2026-08-04",
    lateDays: 3,
    ratePerDay: 5,
    fineAmount: 15.0,
    status: "Pending",
    dateIncurred: "2026-08-02",
  },
];

export const INITIAL_DIGITAL_VISITS: DigitalVisitLog[] = [
  {
    id: "VISIT-2026-001",
    computerNumber: "PC-21",
    seatNumber: "Seat-12",
    date: "08 Aug 2026",
    loginTime: "09:15 AM",
    logoutTime: "11:05 AM",
    duration: "1 Hour 50 Minutes",
    lab: "Central Digital Library",
    activity: "Programming Practice",
    status: "Completed",
    system: "Windows 11 - Lab PC",
  },
  {
    id: "VISIT-2026-002",
    computerNumber: "PC-14",
    seatNumber: "Seat-05",
    date: "04 Aug 2026",
    loginTime: "02:30 PM",
    logoutTime: "--",
    duration: "Live Session",
    lab: "Central Digital Library",
    activity: "E-Journal & IEEE Research",
    status: "Active",
    system: "Windows 11 - Lab PC",
  },
  {
    id: "VISIT-2026-003",
    computerNumber: "PC-08",
    seatNumber: "Seat-02",
    date: "01 Aug 2026",
    loginTime: "10:00 AM",
    logoutTime: "12:15 PM",
    duration: "2 Hours 15 Minutes",
    lab: "Central Digital Library",
    activity: "Database Systems Lab Work",
    status: "Completed",
    system: "Windows 11 - Lab PC",
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "ACT-099",
    timestamp: "2026-08-02 04:20 PM",
    type: "Book Reserved",
    title: "Hold Queue Reservation Placed",
    details: 'Reserved "Artificial Intelligence: A Modern Approach". Queue Position #1.',
  },
  {
    id: "ACT-098",
    timestamp: "2026-07-28 10:00 AM",
    type: "Book Issued",
    title: "Book Issued from Counter 2",
    details: 'Checked out "Operating System Concepts" (ACC-90412). Due date: 18 Aug 2026.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-1",
    title: "Book Overdue Alert",
    message: '"Database System Concepts" is overdue by 3 days. Fine of ₹15.00 pending.',
    date: "2026-08-02",
    type: "overdue",
    read: false,
  },
  {
    id: "NOTIF-2",
    title: "Reserved Book Ready for Pickup",
    message: '"Artificial Intelligence: A Modern Approach" is ready at Counter 2.',
    date: "2026-08-04",
    type: "reserved_available",
    read: false,
  },
];

export interface StorageSchema {
  books: BookItem[];
  borrowed: BorrowedBook[];
  reservations: ReservationItem[];
  fines: FineRecordItem[];
  digitalVisits: DigitalVisitLog[];
  activities: ActivityLog[];
  notifications: NotificationItem[];
  wishlist: string[];
}

export function loadLibraryState(): StorageSchema {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error loading library data from localStorage", e);
  }

  const defaultState: StorageSchema = {
    books: INITIAL_BOOKS,
    borrowed: INITIAL_BORROWED,
    reservations: INITIAL_RESERVATIONS,
    fines: INITIAL_FINES,
    digitalVisits: INITIAL_DIGITAL_VISITS,
    activities: INITIAL_ACTIVITIES,
    notifications: INITIAL_NOTIFICATIONS,
    wishlist: ["BK-1002", "BK-1005"],
  };

  saveLibraryState(defaultState);
  return defaultState;
}

export function saveLibraryState(state: StorageSchema): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving library data to localStorage", e);
  }
}

export function resetLibraryState(): StorageSchema {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return loadLibraryState();
}

export function calculateOverdueFine(dueDateStr: string, currentDateStr: string = "2026-08-04") {
  const due = new Date(dueDateStr).getTime();
  const current = new Date(currentDateStr).getTime();
  const diffTime = current - due;
  const lateDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const fineAmount = lateDays * 5;
  return { lateDays, fineAmount };
}
