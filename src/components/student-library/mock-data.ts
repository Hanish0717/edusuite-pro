import {
  BookItem,
  IssuedBookItem,
  BorrowHistoryItem,
  ReservedBookItem,
  FineRecordItem,
  DigitalResourceItem,
  LibrarySummaryMetrics,
} from "./types";

export const mockSummaryMetrics: LibrarySummaryMetrics = {
  booksIssued: 3,
  maxBorrowLimit: 6,
  availableBorrowLimit: 3,
  booksReserved: 2,
  fineAmount: 45.0,
  digitalResourcesCount: 520,
  recentlyAddedBooksCount: 48,
};

// Currently Issued Books (3 books)
export const mockIssuedBooks: IssuedBookItem[] = [
  {
    id: "ISS-9081",
    bookId: "BK-101",
    title: "Introduction to Algorithms (4th Edition)",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    isbn: "978-0262046305",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
    issueDate: "2026-07-15",
    dueDate: "2026-08-05",
    daysRemaining: 4,
    accNumber: "ACC-CS-4412",
    fineAmount: 0.0,
    renewalsCount: 1,
    maxRenewals: 2,
  },
  {
    id: "ISS-9082",
    bookId: "BK-104",
    title: "Database System Concepts (7th Edition)",
    author: "Abraham Silberschatz, Henry F. Korth",
    isbn: "978-0078022159",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    issueDate: "2026-07-10",
    dueDate: "2026-07-31",
    daysRemaining: -1,
    accNumber: "ACC-CS-3891",
    fineAmount: 20.0, // 4 days late * Rs 5
    renewalsCount: 2,
    maxRenewals: 2,
  },
  {
    id: "ISS-9083",
    bookId: "BK-110",
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose, Keith Ross",
    isbn: "978-0133594140",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80",
    issueDate: "2026-07-20",
    dueDate: "2026-08-10",
    daysRemaining: 9,
    accNumber: "ACC-CS-5109",
    fineAmount: 0.0,
    renewalsCount: 0,
    maxRenewals: 2,
  },
];

// Reserved Books (10 items)
export const mockReservedBooks: ReservedBookItem[] = [
  {
    id: "RES-101",
    bookId: "BK-102",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    reservedDate: "2026-07-28",
    queuePosition: 1,
    availabilityDate: "2026-08-03",
    status: "Ready for Pickup",
  },
  {
    id: "RES-102",
    bookId: "BK-105",
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin, Gagne",
    reservedDate: "2026-07-29",
    queuePosition: 3,
    availabilityDate: "2026-08-08",
    status: "In Queue",
  },
  {
    id: "RES-103",
    bookId: "BK-112",
    title: "Deep Learning with Python",
    author: "François Chollet",
    reservedDate: "2026-07-30",
    queuePosition: 2,
    availabilityDate: "2026-08-06",
    status: "In Queue",
  },
  {
    id: "RES-104",
    bookId: "BK-115",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    reservedDate: "2026-07-25",
    queuePosition: 1,
    availabilityDate: "2026-08-02",
    status: "Ready for Pickup",
  },
  {
    id: "RES-105",
    bookId: "BK-118",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm",
    reservedDate: "2026-07-20",
    queuePosition: 4,
    availabilityDate: "2026-08-12",
    status: "In Queue",
  },
  {
    id: "RES-106",
    bookId: "BK-122",
    title: "Digital Design and Computer Architecture",
    author: "David Harris, Sarah Harris",
    reservedDate: "2026-07-18",
    queuePosition: 5,
    availabilityDate: "2026-08-15",
    status: "In Queue",
  },
  {
    id: "RES-107",
    bookId: "BK-125",
    title: "Principles of Neural Science",
    author: "Eric R. Kandel",
    reservedDate: "2026-07-15",
    queuePosition: 2,
    availabilityDate: "2026-08-04",
    status: "In Queue",
  },
  {
    id: "RES-108",
    bookId: "BK-129",
    title: "Modern Control Engineering",
    author: "Katsuhiko Ogata",
    reservedDate: "2026-07-12",
    queuePosition: 1,
    availabilityDate: "2026-08-01",
    status: "Expired",
  },
  {
    id: "RES-109",
    bookId: "BK-133",
    title: "Cloud Computing: Concepts, Technology & Architecture",
    author: "Thomas Erl",
    reservedDate: "2026-07-10",
    queuePosition: 3,
    availabilityDate: "2026-08-09",
    status: "In Queue",
  },
  {
    id: "RES-110",
    bookId: "BK-140",
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    reservedDate: "2026-07-08",
    queuePosition: 2,
    availabilityDate: "2026-08-07",
    status: "In Queue",
  },
];

// Fine Records (15 items)
export const mockFineRecords: FineRecordItem[] = [
  {
    id: "FINE-2026-001",
    bookTitle: "Database System Concepts (7th Edition)",
    reason: "Late Return Overdue (4 Days)",
    amount: 20.0,
    dateIncurred: "2026-07-31",
    status: "Pending",
  },
  {
    id: "FINE-2026-002",
    bookTitle: "Software Engineering: A Practitioner's Approach",
    reason: "Late Return Overdue (5 Days)",
    amount: 25.0,
    dateIncurred: "2026-07-28",
    status: "Pending",
  },
  {
    id: "FINE-2026-003",
    bookTitle: "Computer Organization and Architecture",
    reason: "Barcode Damaged Fee",
    amount: 15.0,
    dateIncurred: "2026-06-15",
    status: "Paid",
    transactionId: "TXN-LIB-88910",
  },
  {
    id: "FINE-2026-004",
    bookTitle: "Discrete Mathematics and Its Applications",
    reason: "Late Return Overdue (2 Days)",
    amount: 10.0,
    dateIncurred: "2026-05-20",
    status: "Paid",
    transactionId: "TXN-LIB-77612",
  },
  {
    id: "FINE-2026-005",
    bookTitle: "Compiler Design Principles",
    reason: "Late Return Overdue (6 Days)",
    amount: 30.0,
    dateIncurred: "2026-04-12",
    status: "Waived",
  },
  {
    id: "FINE-2026-006",
    bookTitle: "Python Data Science Handbook",
    reason: "Late Return Overdue (1 Day)",
    amount: 5.0,
    dateIncurred: "2026-03-30",
    status: "Paid",
    transactionId: "TXN-LIB-65190",
  },
  {
    id: "FINE-2026-007",
    bookTitle: "Theory of Computation",
    reason: "Late Return Overdue (3 Days)",
    amount: 15.0,
    dateIncurred: "2026-03-10",
    status: "Paid",
    transactionId: "TXN-LIB-54011",
  },
  {
    id: "FINE-2026-008",
    bookTitle: "Machine Learning in Action",
    reason: "Spine Binding Replacement Charge",
    amount: 50.0,
    dateIncurred: "2026-02-18",
    status: "Paid",
    transactionId: "TXN-LIB-43100",
  },
  {
    id: "FINE-2026-009",
    bookTitle: "Calculus and Analytical Geometry",
    reason: "Late Return Overdue (4 Days)",
    amount: 20.0,
    dateIncurred: "2026-01-25",
    status: "Paid",
    transactionId: "TXN-LIB-32091",
  },
  {
    id: "FINE-2026-010",
    bookTitle: "Signals and Systems",
    reason: "Late Return Overdue (2 Days)",
    amount: 10.0,
    dateIncurred: "2025-12-14",
    status: "Paid",
    transactionId: "TXN-LIB-21045",
  },
  {
    id: "FINE-2026-011",
    bookTitle: "Engineering Physics",
    reason: "Late Return Overdue (1 Day)",
    amount: 5.0,
    dateIncurred: "2025-11-20",
    status: "Paid",
    transactionId: "TXN-LIB-10932",
  },
  {
    id: "FINE-2026-012",
    bookTitle: "Organic Chemistry for Engineers",
    reason: "Late Return Overdue (3 Days)",
    amount: 15.0,
    dateIncurred: "2025-10-05",
    status: "Paid",
    transactionId: "TXN-LIB-09122",
  },
  {
    id: "FINE-2026-013",
    bookTitle: "Introduction to VLSI Circuits",
    reason: "Late Return Overdue (2 Days)",
    amount: 10.0,
    dateIncurred: "2025-09-18",
    status: "Paid",
    transactionId: "TXN-LIB-08011",
  },
  {
    id: "FINE-2026-014",
    bookTitle: "Microprocessor Architecture 8085/8086",
    reason: "Late Return Overdue (5 Days)",
    amount: 25.0,
    dateIncurred: "2025-08-22",
    status: "Paid",
    transactionId: "TXN-LIB-07100",
  },
  {
    id: "FINE-2026-015",
    bookTitle: "Industrial Management and Entrepreneurship",
    reason: "Late Return Overdue (1 Day)",
    amount: 5.0,
    dateIncurred: "2025-08-01",
    status: "Paid",
    transactionId: "TXN-LIB-06001",
  },
];

// Borrow History (30 items)
export const mockBorrowHistory: BorrowHistoryItem[] = Array.from({ length: 30 }).map((_, idx) => {
  const titles = [
    "Computer Networks", "Database Management Systems", "Artificial Intelligence", "Operating Systems",
    "Design and Analysis of Algorithms", "Software Engineering", "Compiler Construction", "Discrete Mathematics",
    "Computer Organization", "Machine Learning", "Digital Signal Processing", "Cloud Computing Architectures",
    "Cyber Security Principles", "Web Technologies", "Embedded Systems Design", "Object Oriented Programming Java",
    "Python for Data Analysis", "Mobile Application Development", "Big Data Analytics", "Blockchain Basics"
  ];
  const authors = [
    "Andrew S. Tanenbaum", "Ramez Elmasri", "Stuart Russell", "William Stallings",
    "Ellis Horowitz", "Ian Sommerville", "Alfred V. Aho", "Kenneth H. Rosen",
    "Carl Hamacher", "Tom M. Mitchell", "John G. Proakis", "Kai Hwang",
    "William Stallings", "Deitel & Deitel", "Raj Kamal", "E. Balagurusamy",
    "Wesley McKinney", "Bill Phillips", "Vikram Gopal", "Don Tapscott"
  ];

  const title = titles[idx % titles.length];
  const author = authors[idx % authors.length];

  return {
    id: `HIST-${9000 - idx}`,
    bookId: `BK-${200 + idx}`,
    title: `${title} (Vol. ${ (idx % 4) + 1 })`,
    author: author,
    isbn: `978-013${100000 + idx}`,
    issuedDate: `2026-0${Math.max(1, 6 - Math.floor(idx / 5))}-${(idx % 25) + 1}`,
    returnedDate: `2026-0${Math.max(1, 6 - Math.floor(idx / 5))}-${(idx % 25) + 5}`,
    finePaid: idx % 4 === 0 ? 15.0 : 0.0,
    status: idx % 4 === 0 ? "Returned Late" : "Returned",
    receiptId: `REC-LIB-${202600 + idx}`,
  };
});

// Digital Resources Across 13 Categories (150 Items Generator)
const categoriesList = [
  "E-Books",
  "Courseware",
  "Digital Library",
  "Dictionary",
  "Journals",
  "Lecture Videos",
  "Open ETD",
  "Useful Links",
  "Virtual Labs",
  "Previous Question Papers",
  "IEEE Papers",
  "NPTEL Courses",
  "Research Publications",
] as const;

export const mockDigitalResources: DigitalResourceItem[] = Array.from({ length: 150 }).map((_, idx) => {
  const category = categoriesList[idx % categoriesList.length];
  const departments = ["Computer Science", "Electronics & Comm", "Mechanical Engg", "Civil Engg", "AI & Data Science"];
  const dept = departments[idx % departments.length];

  return {
    id: `DIG-RES-${1000 + idx}`,
    title: `${category}: Advanced Research & Practice in ${dept} (Vol. ${ (idx % 12) + 1 })`,
    category: category,
    description: `Comprehensive digital repository resource including case studies, experimental datasets, simulation code and lecture material for ${dept}.`,
    department: dept,
    subject: `CS-${300 + (idx % 20)} • Core Engineering`,
    fileFormat: idx % 3 === 0 ? "MP4 / HD" : idx % 2 === 0 ? "PDF" : "ZIP / Code",
    fileSize: `${(idx % 15) * 4 + 12} MB`,
    downloadsCount: 140 + idx * 7,
    authorOrProvider: `Prof. Dr. A. Sharma / ${category} Board`,
    year: 2024 + (idx % 3),
    url: "https://ieee.org/sample-paper.pdf",
    isBookmarked: idx % 5 === 0,
  };
});

// 500 Books Generator for Search & Catalog Grid
const bookTitles = [
  "Introduction to Algorithms", "Artificial Intelligence: A Modern Approach", "Database System Concepts",
  "Computer Networking", "Operating System Concepts", "Clean Code", "Design Patterns", "Deep Learning",
  "Pattern Recognition and Machine Learning", "Computer Organization and Architecture", "Compilers: Principles, Techniques & Tools",
  "Discrete Mathematics and Its Applications", "Software Engineering: A Practitioner's Approach", "Python Data Science Handbook",
  "Cloud Computing: Concepts & Technology", "Cybersecurity Essentials", "Reinforcement Learning: An Introduction",
  "Digital Signal Processing", "Microprocessor Architecture 8085/8086", "Modern Control Engineering",
  "Calculus and Analytical Geometry", "Engineering Physics", "Organic Chemistry for Engineers",
  "Principles of Neural Science", "Information Theory and Coding", "Embedded Systems Design with ARM",
  "Quantum Computing for Computer Scientists", "Big Data: Principles & Best Practices", "High Performance Computer Architecture",
  "Automata Theory, Languages and Computation", "Natural Language Processing with Python", "Computer Graphics & Multimedia"
];

const authorsList = [
  "Thomas H. Cormen", "Stuart Russell", "Abraham Silberschatz", "James Kurose", "Robert C. Martin",
  "Erich Gamma", "François Chollet", "Christopher M. Bishop", "William Stallings", "Alfred V. Aho",
  "Kenneth H. Rosen", "Roger S. Pressman", "Jake VanderPlas", "Thomas Erl", "Charles P. Pfleeger",
  "Richard S. Sutton", "John G. Proakis", "Ramesh S. Gaonkar", "Katsuhiko Ogata", "George B. Thomas"
];

const publishersList = [
  "MIT Press", "Pearson Education", "McGraw Hill", "O'Reilly Media", "Addison-Wesley",
  "Wiley India", "Oxford University Press", "Springer Nature", "Cambridge University Press"
];

const categoriesArray = [
  "Computer Science", "Information Technology", "Artificial Intelligence", "Data Science",
  "Electronics", "Mechanical Engineering", "Civil Engineering", "Mathematics", "Physics", "Management"
];

export const mock500Books: BookItem[] = Array.from({ length: 500 }).map((_, idx) => {
  const title = bookTitles[idx % bookTitles.length];
  const author = authorsList[idx % authorsList.length];
  const publisher = publishersList[idx % publishersList.length];
  const category = categoriesArray[idx % categoriesArray.length];
  const status: BookItem["status"] = idx % 9 === 0 ? "Issued" : idx % 11 === 0 ? "Reserved" : idx % 20 === 0 ? "Reference Only" : "Available";

  return {
    id: `BK-${1000 + idx}`,
    title: `${title} - Edition ${ (idx % 5) + 1 }`,
    author: `${author} et al.`,
    publisher: publisher,
    isbn: `978-${ (idx % 9) + 1 }-${10000 + idx}-${ (idx % 80) + 10 }`,
    category: category,
    department: category,
    rackNumber: `Rack-${String.fromCharCode(65 + (idx % 12))}-${ (idx % 15) + 1 }`,
    edition: `${ (idx % 6) + 1 }st / ${2020 + (idx % 6)}`,
    publicationYear: 2018 + (idx % 8),
    totalCopies: (idx % 6) + 3,
    availableCopies: status === "Available" ? (idx % 4) + 1 : 0,
    status: status,
    coverImage: `https://images.unsplash.com/photo-${1532012197267 + (idx % 100)}?auto=format&fit=crop&w=400&q=80`,
    description: `Standard academic textbook recommended for undergraduate & postgraduate curricula in ${category}. Includes numerical problems, laboratory exercises, and digital companion resources.`,
    language: idx % 10 === 0 ? "German / English" : "English",
    semester: `Semester ${(idx % 8) + 1}`,
    rating: 4.2 + ((idx % 8) * 0.1),
  };
});

// Library Timings & Quick Sidebar Info
export const mockLibraryRules = [
  "Maximum 6 books can be issued concurrently to undergraduate students.",
  "Books are issued for a duration of 21 calendar days.",
  "Late return fine of ₹5 per book per day will be levied automatically.",
  "Digital access cards must be presented during check-in/check-out.",
  "Quiet study zones must be maintained on Floor 2 and Floor 3 at all times.",
];

export const mockLibraryTimings = {
  weekday: "8:00 AM – 10:00 PM",
  saturday: "9:00 AM – 6:00 PM",
  sunday: "10:00 AM – 4:00 PM",
  digitalRepository: "24/7 Access Online",
  librarianContact: {
    name: "Dr. R. K. Varma",
    title: "Chief Librarian & Information Officer",
    email: "library@edusuite.edu.in",
    phone: "+91 (040) 2718-9900 Extn: 142",
    office: "Central Library Building, Ground Floor",
  },
};
