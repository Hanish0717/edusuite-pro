import React, { useState, useRef, useMemo } from "react";
import {
  Library,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  AlertCircle,
  FileText,
  CreditCard,
  QrCode,
  Wallet,
  BookPlus,
  Send,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  TrendingUp,
  ExternalLink,
  User,
  UserCheck,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  X,
  Mic,
  Bookmark,
  Sparkles,
  Star,
  Info,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLibrarianTab } from "@/context/librarian-context";
import {
  CatalogManagementView,
  AcquisitionModuleView,
  InventoryModuleView,
  ReadingHallView,
  LibraryEntryView,
  ReservationManagementView,
  GlobalLibrarySearchView,
  AuditLogsView,
  CirculationEnhancementsView,
  EnhancedFineManagementView,
  EnhancedReportsView,
  EnhancedNotificationsView,
  EnhancedSettingsView,
  EnhancedIDCardManagementView,
} from "@/modules/library/EnterpriseLibraryComponents";
import { LibraryStoreProvider, useLibraryStore } from "@/modules/library/LibraryStore";

// Categories List
const categories = [
  "All",
  "Computer Science",
  "Software Engineering",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Mathematics",
  "Physics",
  "Engineering",
  "General",
];

// Mock Data for Books matching Pic 1 & Pic 2
const initialBooks = [
  {
    id: "B-101",
    isbn: "9780262033848",
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    category: "Computer Science",
    rack: "CS-Rack-04",
    total: 25,
    available: 18,
    price: 1450,
  },
  {
    id: "B-102",
    isbn: "9780073523323",
    title: "Database System Concepts",
    author: "Silberschatz, Korth, Sudarshan",
    category: "Computer Science",
    rack: "CS-Rack-02",
    total: 20,
    available: 14,
    price: 1100,
  },
  {
    id: "B-103",
    isbn: "2515",
    title: "ncmn",
    author: "dhcd45",
    category: "General",
    rack: "GEN-Rack-01",
    total: 10,
    available: 8,
    price: 450,
  },
  {
    id: "B-104",
    isbn: "9780137085156",
    title: "Digital Signal Processing",
    author: "John G. Proakis",
    category: "Electronics",
    rack: "ECE-Rack-02",
    total: 20,
    available: 12,
    price: 890,
  },
  {
    id: "B-105",
    isbn: "9780136042594",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    category: "Computer Science",
    rack: "CS-Rack-08",
    total: 30,
    available: 5,
    price: 1850,
  },
  {
    id: "B-106",
    isbn: "9780201633610",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    category: "Software Engineering",
    rack: "CS-Rack-01",
    total: 15,
    available: 15,
    price: 1200,
  },
  {
    id: "B-107",
    isbn: "9780070151437",
    title: "Thermodynamics: An Engineering Approach",
    author: "Yunus A. Cengel",
    category: "Mechanical",
    rack: "ME-Rack-05",
    total: 18,
    available: 8,
    price: 950,
  },
];

// Mock Data for Issued Books
const initialIssued = [
  {
    id: "ISS-401",
    accessionNo: "ACC-8821",
    bookTitle: "Introduction to Algorithms (Cormen)",
    borrowerName: "K. Sai Teja",
    borrowerId: "22CS101",
    issueDate: "Jul 22, 2026",
    dueDate: "Aug 05, 2026",
    status: "Issued",
  },
  {
    id: "ISS-402",
    accessionNo: "ACC-9042",
    bookTitle: "Digital Signal Processing (Proakis)",
    borrowerName: "Priya S.",
    borrowerId: "22ECE044",
    issueDate: "Jul 25, 2026",
    dueDate: "Aug 08, 2026",
    status: "Issued",
  },
  {
    id: "ISS-403",
    accessionNo: "ACC-7120",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    borrowerName: "Prof. Ananya Sharma",
    borrowerId: "EMP-409",
    issueDate: "Jul 18, 2026",
    dueDate: "Aug 01, 2026",
    status: "Due Today",
  },
  {
    id: "ISS-404",
    accessionNo: "ACC-5411",
    bookTitle: "Database System Concepts",
    borrowerName: "Rahul V.",
    borrowerId: "22CS189",
    issueDate: "Jul 10, 2026",
    dueDate: "Jul 24, 2026",
    status: "Overdue",
  },
];

// Mock Data for Members
const initialMembers = [
  {
    id: "MEM-001",
    rollNo: "23341A4219",
    name: "B VISHNU VARDHAN",
    type: "Student",
    department: "CSE (AI&ML)",
    email: "vishnu@gmrit.edu.in",
    mobile: "6300460031",
    dob: "19-05-2005",
    bloodGroup: "O+ve",
    issued: 1,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-002",
    rollNo: "22CS101",
    name: "K. Sai Teja",
    type: "Student",
    department: "CSE",
    email: "saiteja@edusuite.edu",
    mobile: "9876543210",
    dob: "12-08-2004",
    bloodGroup: "A+ve",
    issued: 1,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-003",
    rollNo: "22ECE044",
    name: "Priya S.",
    type: "Student",
    department: "ECE",
    email: "priya@edusuite.edu",
    mobile: "9876543211",
    dob: "25-11-2004",
    bloodGroup: "B+ve",
    issued: 1,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-004",
    rollNo: "EMP-409",
    name: "Prof. Ananya Sharma",
    type: "Faculty",
    department: "CSE",
    email: "ananya@edusuite.edu",
    mobile: "9876543212",
    dob: "15-03-1988",
    bloodGroup: "O+ve",
    issued: 3,
    limit: 10,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-005",
    rollNo: "22CS189",
    name: "Rahul V.",
    type: "Student",
    department: "CSE",
    email: "rahul@edusuite.edu",
    mobile: "9876543213",
    dob: "04-02-2004",
    bloodGroup: "O+ve",
    issued: 2,
    limit: 3,
    fine: 40,
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-006",
    rollNo: "23AIML052",
    name: "Sneha Reddy",
    type: "Student",
    department: "CSE (AI&ML)",
    email: "sneha@gmrit.edu.in",
    mobile: "9876543214",
    dob: "18-09-2005",
    bloodGroup: "B+ve",
    issued: 0,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-007",
    rollNo: "21EEE092",
    name: "Venkatesh K.",
    type: "Student",
    department: "EEE",
    email: "venkatesh@gmrit.edu.in",
    mobile: "9876543215",
    dob: "30-01-2003",
    bloodGroup: "AB+ve",
    issued: 2,
    limit: 3,
    fine: 60,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-008",
    rollNo: "21ME034",
    name: "Kavya M.",
    type: "Student",
    department: "Mechanical",
    email: "kavya@gmrit.edu.in",
    mobile: "9876543216",
    dob: "14-06-2003",
    bloodGroup: "A+ve",
    issued: 1,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-009",
    rollNo: "EMP-512",
    name: "Dr. Rajesh Verma",
    type: "Faculty",
    department: "ECE",
    email: "rajesh.ece@gmrit.edu.in",
    mobile: "9876543217",
    dob: "22-10-1982",
    bloodGroup: "O+ve",
    issued: 4,
    limit: 10,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "MEM-010",
    rollNo: "22CIV018",
    name: "Deepak N.",
    type: "Student",
    department: "Civil",
    email: "deepak@gmrit.edu.in",
    mobile: "9876543218",
    dob: "08-12-2004",
    bloodGroup: "B-ve",
    issued: 0,
    limit: 3,
    fine: 0,
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
  },
];

// Mock Data for Digital Resources matching Images 1 & 2
const initialDigitalResources = [
  {
    id: "DIG-01",
    title: "Introduction to Algorithms (4th Edition)",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    department: "CSE",
    subject: "Data Structures & Algorithms...",
    sem: "Sem 3",
    rating: "4.8",
    reviews: 185,
    size: "12.4 MB",
    downloads: 1240,
    pages: "1312 Pages",
    format: "PDF",
    isbn: "9780262046305",
    coverGradient: "bg-gradient-to-br from-indigo-700 via-blue-600 to-[#2563eb]",
  },
  {
    id: "DIG-02",
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose",
    category: "Computer Science",
    department: "CSE",
    subject: "Computer Networks (Sem 5)",
    sem: "Sem 5",
    rating: "4.6",
    reviews: 124,
    size: "8.7 MB",
    downloads: 850,
    pages: "864 Pages",
    format: "PDF",
    isbn: "9780133594140",
    coverGradient: "bg-gradient-to-br from-[#4f46e5] via-indigo-600 to-purple-600",
  },
  {
    id: "DIG-03",
    title: "Database System Concepts (7th Edition)",
    author: "Abraham Silberschatz",
    category: "Computer Science",
    department: "CSE",
    subject: "Database Management Systems...",
    sem: "Sem 4",
    rating: "4.5",
    reviews: 98,
    size: "15.2 MB",
    downloads: 920,
    pages: "1376 Pages",
    format: "PDF",
    isbn: "9780078022159",
    coverGradient: "bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700",
  },
  {
    id: "DIG-04",
    title: "Digital Signal Processing & Applications",
    author: "John G. Proakis",
    category: "Science",
    department: "ECE",
    subject: "Signal Processing (Sem 4)",
    sem: "Sem 4",
    rating: "4.7",
    reviews: 76,
    size: "18.6 MB",
    downloads: 640,
    pages: "1024 Pages",
    format: "PDF",
    isbn: "9780131873742",
    coverGradient: "bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700",
  },
  {
    id: "DIG-05",
    title: "Modern Control Systems Engineering",
    author: "Richard C. Dorf",
    category: "Mathematics",
    department: "EEE",
    subject: "Control Engineering (Sem 5)",
    sem: "Sem 5",
    rating: "4.9",
    reviews: 112,
    size: "14.1 MB",
    downloads: 790,
    pages: "1104 Pages",
    format: "PDF",
    isbn: "9780134407623",
    coverGradient: "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800",
  },
  {
    id: "DIG-06",
    title: "Principles of Corporate Finance & Business",
    author: "Richard A. Brealey",
    category: "Business",
    department: "MBA",
    subject: "Financial Management",
    sem: "Sem 2",
    rating: "4.4",
    reviews: 54,
    size: "10.8 MB",
    downloads: 410,
    pages: "960 Pages",
    format: "PDF",
    isbn: "9781260013900",
    coverGradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800",
  },
];

// Mock Fines Data
const initialFines = [
  {
    id: "FIN-901",
    student: "Rahul V. (22CS189)",
    book: "Database System Concepts",
    daysOverdue: 8,
    amount: 40,
    status: "Unpaid",
  },
  {
    id: "FIN-902",
    student: "Venkatesh K. (21ME092)",
    book: "Thermodynamics",
    daysOverdue: 12,
    amount: 60,
    status: "Unpaid",
  },
  {
    id: "FIN-903",
    student: "Sneha R. (23EEE012)",
    book: "Circuit Theory",
    daysOverdue: 4,
    amount: 20,
    status: "Paid",
  },
];

import { fetchLibrarianStats, fetchLibraryCirculation } from "@/lib/roleDashboardService";

export function LibrarianDashboard() {
  return (
    <LibraryStoreProvider>
      <LibrarianDashboardContent />
    </LibraryStoreProvider>
  );
}

function LibrarianDashboardContent() {
  const { activeTab, setActiveTab } = useLibrarianTab();
  const { state, dispatch, stats } = useLibraryStore();

  // State Management
  const [books, setBooks] = useState(initialBooks);
  const [issuedLogs, setIssuedLogs] = useState(initialIssued);
  const [members] = useState(initialMembers);
  const [fines, setFines] = useState(initialFines);
  const [digitalResources] = useState(initialDigitalResources);

  // Search, View Mode & Filter State for Books
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [idCardSubTab, setIdCardSubTab] = useState<"overview" | "issue" | "pending" | "receipts" | "audit">("overview");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<(typeof initialMembers)[0] | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Members Directory State & Branch Filters
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("All Branches");
  const [memberTypeFilter, setMemberTypeFilter] = useState<"All" | "Student" | "Faculty">("All");
  const [memberViewMode, setMemberViewMode] = useState<"grid" | "table">("grid");
  const [memberReportModalOpen, setMemberReportModalOpen] = useState(false);

  // Digital Library State (Images 1 & 2)
  const [digitalSubTab, setDigitalSubTab] = useState<"explore" | "my-library" | "analytics" | "feed" | "console">("explore");
  const [digitalSearchQuery, setDigitalSearchQuery] = useState("");
  const [digitalCategory, setDigitalCategory] = useState("All");
  const [aiSemanticSearch, setAiSemanticSearch] = useState(false);
  const [searchCheckboxes, setSearchCheckboxes] = useState({
    Title: true,
    Author: true,
    Subject: true,
    Department: true,
    Semester: true,
    Isbn: true,
    Keywords: true,
  });

  // Reports State (Images 1 & 2)
  const [reportsTimescale, setReportsTimescale] = useState<"3m" | "5m">("5m");

  const filteredDigitalResources = digitalResources.filter((res) => {
    const matchesCategory = digitalCategory === "All" || res.category === digitalCategory;
    const matchesSearch =
      !digitalSearchQuery.trim() ||
      res.title.toLowerCase().includes(digitalSearchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(digitalSearchQuery.toLowerCase()) ||
      res.department.toLowerCase().includes(digitalSearchQuery.toLowerCase()) ||
      res.isbn.toLowerCase().includes(digitalSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const branchesList = [
    "All Branches",
    "CSE",
    "CSE (AI&ML)",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Mathematics",
  ];

  const totalMembersCount = members.length;
  const totalStudentsCount = members.filter((m) => m.type === "Student").length;
  const totalStaffCount = members.filter((m) => m.type === "Faculty" || m.type === "Staff").length;
  const branchStudentsCount =
    selectedBranchFilter === "All Branches"
      ? totalStudentsCount
      : members.filter((m) => m.type === "Student" && m.department === selectedBranchFilter).length;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      !memberSearchQuery.trim() ||
      m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(memberSearchQuery.toLowerCase()));

    const matchesBranch =
      selectedBranchFilter === "All Branches" || m.department === selectedBranchFilter;

    const matchesType =
      memberTypeFilter === "All" || m.type === memberTypeFilter;

    return matchesSearch && matchesBranch && matchesType;
  });

  const searchResults = studentSearchQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
          m.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
          m.department.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
          (m.mobile && m.mobile.includes(studentSearchQuery)),
      )
    : [];

  // Modals & Selection
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [editBookOpen, setEditBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<(typeof initialBooks)[0] | null>(null);
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<(typeof initialMembers)[0]>(
    initialMembers[0]!,
  );

  // Add Book Form state
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Computer Science",
    rack: "CS-Rack-01",
    total: 10,
    price: 500,
  });

  // Issue Form state
  const [issueForm, setIssueForm] = useState({
    memberId: "22CS101",
    isbn: "978-0134685991",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
  });

  // Filtered Books List
  const filteredBooks = books.filter((b) => {
    const matchesCategory =
      selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.isbn.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      b.rack.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Category Scroll Function
  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Edit Book Handlers
  const handleOpenEdit = (book: (typeof initialBooks)[0]) => {
    setEditingBook({ ...book });
    setEditBookOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? editingBook : b)));
    setEditBookOpen(false);
    toast.success(`Book details for "${editingBook.title}" updated successfully!`);
  };

  // Delete Book Handler
  const handleDeleteBook = (id: string, title: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    toast.success(`"${title}" deleted from library inventory.`);
  };

  // Add Book Handler
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      toast.error("Please fill in all required fields!");
      return;
    }
    dispatch({
      type: "ADD_BOOK",
      payload: {
        title: newBook.title,
        authors: [newBook.author],
        isbn: newBook.isbn,
        category: newBook.category,
        publisher: "Standard University Press",
        publishedYear: 2024,
        edition: "1st",
        language: "English",
        subject: newBook.category,
        totalCopies: Number(newBook.total),
        availableCopies: Number(newBook.total),
        issuedCopies: 0,
        reservedCopies: 0,
        lostCopies: 0,
        damagedCopies: 0,
        location: { building: "Central Library", floor: "Floor 1", rack: newBook.rack, shelf: "S-01" },
        callNumber: `${newBook.category.slice(0, 3)}/${newBook.isbn.slice(-4)}`,
        price: Number(newBook.price),
        status: "Active",
        source: "Manual",
        addedBy: "Librarian",
        tags: [newBook.category.toLowerCase()],
      },
    });
    setAddBookOpen(false);
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      category: "Computer Science",
      rack: "CS-Rack-01",
      total: 10,
      price: 500,
    });
  };

  // Issue Book Handler
  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const foundBook = books.find(
      (b) =>
        b.isbn.includes(issueForm.isbn) ||
        b.title.toLowerCase().includes(issueForm.isbn.toLowerCase()),
    );
    const foundMember = members.find(
      (m) => m.rollNo.toLowerCase() === issueForm.memberId.toLowerCase(),
    );

    const newIssue = {
      id: `ISS-${500 + issuedLogs.length}`,
      accessionNo: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      bookTitle: foundBook ? foundBook.title : "Custom Reference Book",
      borrowerName: foundMember ? foundMember.name : issueForm.memberId,
      borrowerId: foundMember ? foundMember.rollNo : issueForm.memberId,
      issueDate: "Today",
      dueDate: issueForm.dueDate,
      status: "Issued",
    };

    setIssuedLogs([newIssue, ...issuedLogs]);
    toast.success(`Book issued successfully to ${newIssue.borrowerName}!`);
  };

  // Return Book Handler
  const handleReturnBook = (id: string) => {
    setIssuedLogs(issuedLogs.filter((item) => item.id !== id));
    toast.success("Book returned & inventory updated!");
  };

  // Fine Payment Handler
  const handlePayFine = (id: string) => {
    setFines(fines.map((f) => (f.id === id ? { ...f, status: "Paid" } : f)));
    toast.success("Fine payment recorded successfully!");
  };

  return (
    <div className="space-y-6">

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Top 4 KPI Cards matching Picture 1 & 2 */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Catalog Titles" value={`${stats.totalBooks.toLocaleString()} Volumes`} icon={Library} />
            <KpiCard label="Books Currently Issued" value={`${stats.issuedBooks.toLocaleString()} Active`} icon={BookOpen} tone="info" />
            <KpiCard label="Overdue Returns" value={`${stats.overdueBooks} Books`} icon={Clock} tone="warning" />
            <KpiCard label="Fine Collections (Total)" value={`₹ ${stats.totalFineCollected.toLocaleString()}`} icon={CheckCircle2} tone="success" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Circulation Desk & Issue Logs */}
            <div className="lg:col-span-2 space-y-6">
              <Panel title="Circulation Desk & Issue Logs">
                <div className="space-y-3">
                  {issuedLogs.map((book) => (
                    <div
                      key={book.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-900">{book.bookTitle}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Borrower: <span className="font-medium text-slate-700">{book.borrowerName} ({book.borrowerId})</span> | Due: <span className="font-medium text-slate-700">{book.dueDate}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            book.status === "Overdue"
                              ? "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] text-xs font-semibold rounded-full"
                              : book.status === "Due Today"
                              ? "bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-semibold rounded-full"
                              : "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe] text-xs font-semibold rounded-full"
                          }
                        >
                          {book.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturnBook(book.id)}
                          className="h-8 text-xs rounded-xl border-slate-200 hover:bg-slate-50"
                        >
                          Return
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Department Allocation */}
              <Panel title="Department Book Allocation & Circulation">
                <div className="space-y-4 text-xs">
                  {[
                    { dept: "Computer Science & Engineering", titles: "14,200 Titles", count: 82 },
                    { dept: "Electronics & Communication", titles: "10,500 Titles", count: 68 },
                    { dept: "Mechanical Engineering", titles: "8,400 Titles", count: 54 },
                    { dept: "Civil Engineering", titles: "7,100 Titles", count: 42 },
                  ].map((item) => (
                    <div key={item.dept} className="space-y-1.5">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{item.dept}</span>
                        <span className="text-slate-500">{item.titles}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2563eb] rounded-full"
                          style={{ width: `${item.count}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* Actions matching Picture 1 & 2 */}
            <div className="space-y-6">
              <Panel title="Library Desk Actions">
                <div className="space-y-2.5">
                  <Button
                    onClick={() => setActiveTab("issue")}
                    className="w-full justify-start bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs h-11 rounded-xl cursor-pointer shadow-2xs"
                  >
                    <Plus className="size-4 mr-2" /> Issue / Return Book
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("digital")}
                    className="w-full justify-start text-xs h-11 rounded-xl cursor-pointer border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  >
                    <BookOpen className="size-4 mr-2 text-[#2563eb]" /> Add Digital E-Book / Journal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("id-cards")}
                    className="w-full justify-start text-xs h-11 rounded-xl cursor-pointer border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  >
                    <CreditCard className="size-4 mr-2 text-indigo-600" /> Generate Member ID Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("fines")}
                    className="w-full justify-start text-xs h-11 rounded-xl cursor-pointer border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  >
                    <Wallet className="size-4 mr-2 text-emerald-600" /> Collect Library Fines
                  </Button>
                </div>
              </Panel>

              <Panel title="Library Notice Board">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Annual Stock Verification Notice</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Central library open until 8:00 PM during examination week. Self-check digital kiosk active.
                  </p>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* BOOK MANAGEMENT TAB (Pic 2 style & structure) */}
      {activeTab === "books" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Header section matching Pic 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                Book Management 📚
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage library inventory, track availability, and organize catalog (Live Database Connected).
              </p>
            </div>
            <Button
              onClick={() => setAddBookOpen(true)}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold cursor-pointer rounded-xl px-4 py-2 shadow-2xs"
            >
              <Plus className="size-4 mr-1.5" /> Add Book
            </Button>
          </div>

          {/* Search bar & View Mode Toggles */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author or ISBN..."
                className="pl-10 h-11 rounded-2xl bg-white border-slate-200 focus-visible:ring-[#2563eb] text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-end sm:self-auto shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-9 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#2563eb] text-white shadow-2xs hover:bg-[#1d4ed8]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-9 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#2563eb] text-white shadow-2xs hover:bg-[#1d4ed8]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
                title="List View"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter Pills (Horizontal scrollable) */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              className="size-8 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shrink-0 shadow-2xs"
              title="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#2563eb] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories("right")}
              className="size-8 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shrink-0 shadow-2xs"
              title="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Book Catalog Display (Grid View or List View) */}
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white space-y-3">
              <BookOpen className="size-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No books found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or selected category filter.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Blue gradient cover container matching Pic 2 */}
                  <div className="h-44 bg-gradient-to-br from-[#4f46e5] via-[#3b82f6] to-[#2563eb] relative p-4 flex items-center justify-center">
                    {/* ISBN Badge top-left */}
                    <div className="absolute top-3 left-3 bg-white/95 text-[#2563eb] font-mono text-[0.7rem] font-bold px-3 py-1 rounded-full shadow-2xs border border-white/50">
                      {b.isbn}
                    </div>
                    <BookOpen className="size-14 text-white/90 group-hover:scale-105 transition-transform" />
                  </div>

                  {/* Book Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">By {b.author}</p>
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <Badge variant="outline" className="text-[0.7rem] bg-blue-50 text-[#2563eb] border-blue-200 font-medium">
                          {b.category}
                        </Badge>
                        <span className="text-[0.75rem] text-slate-400 font-medium">
                          Rack: <span className="text-slate-700">{b.rack}</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Stock: <span className="font-bold text-[#2563eb] text-sm">{b.available}</span> / {b.total}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setIssueForm({ ...issueForm, isbn: b.isbn });
                            setActiveTab("issue");
                          }}
                          title="Issue Book"
                          className="size-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563eb] cursor-pointer"
                        >
                          <BookPlus className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Details"
                          className="size-8 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteBook(b.id, b.title)}
                          title="Delete Book"
                          className="size-8 rounded-xl hover:bg-red-50 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-4">ISBN</th>
                    <th className="p-4">Title & Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Rack Location</th>
                    <th className="p-4 text-center">Available / Total</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-all">
                      <td className="p-4 font-mono font-medium text-slate-600">{b.isbn}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{b.title}</div>
                        <div className="text-slate-500 text-[0.75rem]">By {b.author}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[0.7rem] bg-slate-50 border-slate-200">
                          {b.category}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{b.rack}</td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-[#2563eb]">{b.available}</span> / {b.total}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setIssueForm({ ...issueForm, isbn: b.isbn });
                              setActiveTab("issue");
                            }}
                            className="size-8 rounded-lg text-[#2563eb] hover:bg-blue-50 cursor-pointer"
                            title="Issue Book"
                          >
                            <BookPlus className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenEdit(b)}
                            className="size-8 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteBook(b.id, b.title)}
                            className="size-8 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete Book"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ISSUE BOOKS TAB (Pic 1 design & structure) */}
      {activeTab === "issue" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Header section matching Pic 1 */}
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              Issue Book 📖
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Search student & book records directly without dropdown lists (Live Database Connected).
            </p>
          </div>

          {/* New Book Issue Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <h4 className="font-bold text-[#2563eb] text-sm">New Book Issue</h4>

            <form onSubmit={handleIssueBook} className="space-y-4 text-xs">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Search Student */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Search Student *</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={issueForm.memberId}
                      onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })}
                      placeholder="Type student name, Roll No, ID (e.g. CS100001, Student Demo)..."
                      className="pl-10 h-11 rounded-2xl bg-white border-slate-200 focus-visible:ring-[#2563eb] text-xs"
                    />
                  </div>
                  <p className="text-[0.72rem] text-slate-400 flex items-center gap-1">
                    🔍 Enter student name or ID above to display matching student records.
                  </p>
                </div>

                {/* Search Book */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Search Book *</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={issueForm.isbn}
                      onChange={(e) => setIssueForm({ ...issueForm, isbn: e.target.value })}
                      placeholder="Type book title, author or ISBN..."
                      className="pl-10 h-11 rounded-2xl bg-white border-slate-200 focus-visible:ring-[#2563eb] text-xs"
                    />
                  </div>
                  <p className="text-[0.72rem] text-slate-400 flex items-center gap-1">
                    🔍 Enter book title or ISBN above to display matching available books.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Issue Date */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Issue Date</label>
                  <Input
                    type="date"
                    value={issueForm.issueDate || "2026-08-01"}
                    onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                    className="h-11 rounded-2xl bg-white border-slate-200 text-xs"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Due Date *</label>
                  <Input
                    type="date"
                    value={issueForm.dueDate}
                    onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                    className="h-11 rounded-2xl bg-white border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold h-11 rounded-2xl cursor-pointer text-xs shadow-xs"
                >
                  <CheckCircle2 className="size-4 mr-2" /> Issue Book
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIssueForm({ memberId: "", isbn: "", issueDate: "2026-08-01", dueDate: "2026-08-15" })}
                  className="px-6 h-11 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                >
                  Clear
                </Button>
              </div>
            </form>
          </div>

          {/* Bottom Panels Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Recently Issued Books */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Recently Issued Books</h4>
              {issuedLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                  No active book loans currently.
                </div>
              ) : (
                <div className="space-y-3">
                  {issuedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{log.bookTitle}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Issued to: <span className="font-semibold text-slate-700">{log.borrowerName}</span> ({log.borrowerId})
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Due Date: {log.dueDate}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleReturnBook(log.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl cursor-pointer shrink-0"
                      >
                        Return Book
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Issue Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Issue Summary</h4>
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 text-center space-y-2 my-auto">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Active Loans</p>
                <div className="text-4xl font-extrabold text-[#2563eb]">{issuedLogs.length}</div>
                <p className="text-xs text-slate-400">Books currently in circulation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RETURN BOOKS TAB */}
      {activeTab === "return" && (
        <div className="space-y-6 animate-fade-in-soft">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Return Books & Fine Assessment Desk</h3>
            <p className="text-xs text-slate-500">Scan returned books, calculate overdue fees, and clear active borrow records.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Quick Return Desk">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scan Accession Barcode / Issue ID</label>
                  <div className="flex gap-2">
                    <Input placeholder="ACC-8821 or 22CS101" className="rounded-xl h-10 flex-1 bg-white border-slate-200" />
                    <Button className="bg-[#2563eb] text-white rounded-xl h-10">Scan</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Book Title:</span>
                    <span className="font-bold text-slate-900">Database System Concepts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Borrower:</span>
                    <span className="font-medium text-slate-800">Rahul V. (22CS189)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Due Date:</span>
                    <span className="font-medium text-slate-800">Jul 24, 2026</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold border-t border-slate-200 pt-2">
                    <span>Days Overdue:</span>
                    <span>8 Days (Fine: Rs 40)</span>
                  </div>
                </div>

                <Button
                  onClick={() => toast.success("Book returned successfully! Fine added to student ledger.")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-semibold cursor-pointer"
                >
                  Process Return & Clear Dues
                </Button>
              </div>
            </Panel>

            <Panel title="Today's Book Returns Log">
              <div className="space-y-3">
                {[
                  { title: "Software Engineering (Sommerville)", borrower: "Deepak N.", time: "10:15 AM", fine: "Rs 0" },
                  { title: "Fluid Mechanics", borrower: "Kavya M.", time: "11:40 AM", fine: "Rs 0" },
                  { title: "Data Structures in C++", borrower: "Suresh P.", time: "01:10 PM", fine: "Rs 15" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-white">
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-slate-500">Returned by: {item.borrower} at {item.time}</div>
                    </div>
                    <Badge variant="outline" className="font-mono bg-slate-50 border-slate-200">
                      {item.fine}
                    </Badge>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* ID CARD GENERATION & MANAGEMENT TAB (Pic 1 design & structure) */}
      {activeTab === "id-cards" && (() => {
        const activeCardMember = selectedMemberForCard || initialMembers[0]!;
        return (
          <div className="space-y-6 animate-fade-in-soft">
            {/* Header section matching Pic 1 */}
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                Student ID Card Management 🎴
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Administer card generation, printing, tracking, duplicate collections, and activity logs.
              </p>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar">
              {[
                { id: "overview", label: "Overview & Reports" },
                { id: "issue", label: "Issue & Search Profile" },
                { id: "pending", label: "Pending Approval (0)" },
                { id: "receipts", label: "Receipts & Fees" },
                { id: "audit", label: "Audit History" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setIdCardSubTab(tab.id as any)}
                  className={`pb-3 transition-all whitespace-nowrap cursor-pointer relative ${
                    idCardSubTab === tab.id
                      ? "text-[#2563eb] font-extrabold border-b-2 border-[#2563eb]"
                      : "hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW & REPORTS SUB-TAB */}
            {idCardSubTab === "overview" && (
              <div className="space-y-6">
                {/* 10 KPI Stat Cards with clean white styling */}
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Total Students</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">1</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("issue")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-[#2563eb] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      CLICK TO VIEW <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500 inline-block"></span> ACTIVE ID CARDS
                      </span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">1</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("issue")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-emerald-100"
                    >
                      ISSUED LIST <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Pending Requests</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("pending")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-amber-100"
                    >
                      REVIEW <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Lost ID Cards</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("pending")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-rose-100"
                    >
                      VIEW LOST <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 5 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Duplicates Issued</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("receipts")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-purple-100"
                    >
                      DUPLICATES <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 6 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Expired ID Cards</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => toast.info("No expired ID cards recorded.")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      EXPIRED <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 7 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Today's Requests</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("pending")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-sky-100"
                    >
                      TODAY <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 8 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Today Printed</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("audit")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-indigo-100"
                    >
                      PRINTED <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 9 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Total Collected</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">₹0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("receipts")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-teal-100"
                    >
                      RECEIPTS <ExternalLink className="size-2.5" />
                    </button>
                  </div>

                  {/* Card 10 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-2 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Pending Payments</span>
                      <Eye className="size-3.5 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-[#2563eb]">₹0</div>
                    <button
                      type="button"
                      onClick={() => setIdCardSubTab("receipts")}
                      className="w-fit text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-pink-100"
                    >
                      FEES <ExternalLink className="size-2.5" />
                    </button>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Chart: Monthly ID Cards Issued */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-[#2563eb]" />
                      <h4 className="font-bold text-slate-900 text-sm">Monthly ID Cards Issued</h4>
                    </div>

                    <div className="h-60 w-full relative flex items-end pt-8 pb-2 px-4">
                      {/* Decorative Curve SVG matching Pic 1 */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 140 Q 100 140, 200 140 T 320 20 T 400 140 L 400 150 L 0 150 Z"
                          fill="url(#blueGradient)"
                        />
                        <path
                          d="M 0 140 Q 100 140, 200 140 T 320 20 T 400 140"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3"
                        />
                      </svg>
                      {/* Tooltip Overlay */}
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-md rounded-xl p-2.5 text-center text-xs space-y-0.5">
                        <div className="text-slate-500 font-medium">May 26</div>
                        <div className="font-bold text-[#2563eb]">count : 0</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Chart: Pending Requests vs Active Cards */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Pending Requests vs Active Cards</h4>
                    </div>

                    <div className="h-60 w-full flex items-center justify-center relative">
                      {/* Donut Chart SVG matching Pic 1 */}
                      <div className="relative size-44 flex items-center justify-center">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-[#2563eb]"
                            strokeDasharray="100, 100"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xl font-extrabold text-[#2563eb]">100%</span>
                          <p className="text-[0.65rem] text-slate-400 font-semibold uppercase">Active</p>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-xs font-semibold text-[#2563eb]">
                        Issued 100%
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-emerald-600">
                        Pending Requests 0%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ISSUE & SEARCH PROFILE SUB-TAB (Pics 1, 2, 3 design & structure with Student Verification) */}
            {idCardSubTab === "issue" && (
              <div className="space-y-6">
                {/* Search Bar at top matching Pic 1 */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Search students using ID, Roll Number, Name, Department, Mobile or Registration..."
                    className="pl-10 h-11 rounded-2xl bg-white border-slate-200 focus-visible:ring-[#2563eb] text-xs shadow-2xs"
                  />
                </div>

                {/* Main 2-Column Grid Layout matching Pics 1, 2, 3 */}
                <div className="grid gap-6 md:grid-cols-3 items-start">
                  {/* Left Side: Search Results Panel */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900 bg-slate-50/50">
                      Search Results ({searchResults.length})
                    </div>
                    <div className="p-4 min-h-[300px]">
                      {!studentSearchQuery.trim() ? (
                        <div className="py-16 text-center text-slate-400 space-y-2">
                          <Search className="size-8 mx-auto text-slate-300" />
                          <p className="text-xs font-medium">Search above to view student matches</p>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 space-y-2">
                          <UserCheck className="size-8 mx-auto text-slate-300" />
                          <p className="text-xs font-medium">No students found matching search</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {searchResults.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setSelectedStudentForProfile(m)}
                              className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-center gap-3 cursor-pointer ${
                                selectedStudentForProfile?.id === m.id
                                  ? "border-[#2563eb] bg-blue-50/80 font-bold shadow-2xs"
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <img
                                src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                                alt={m.name}
                                className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-900 truncate">{m.name}</div>
                                <div className="text-[0.72rem] text-slate-500 truncate">
                                  {m.rollNo} &bull; {m.department}
                                </div>
                                <Badge variant="outline" className="mt-1 text-[0.65rem] bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                                  <CheckCircle2 className="size-2.5 mr-1 inline" /> ID Card Issued
                                </Badge>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Student Verification & Profile Detail */}
                  <div className="md:col-span-2 space-y-6">
                    {!selectedStudentForProfile ? (
                      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-3 flex flex-col items-center justify-center min-h-[380px] shadow-2xs">
                        <User className="size-12 text-slate-300" />
                        <h4 className="font-bold text-slate-800 text-base">No Student Selected</h4>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Select a student from the search results side panel to view full details, digital ID card previews, status history, and actions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Student Profile Header Card matching Pic 2 */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs flex flex-col sm:flex-row items-start gap-5">
                          <img
                            src={selectedStudentForProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                            alt={selectedStudentForProfile.name}
                            className="size-24 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                          />
                          <div className="flex-1 space-y-2 text-xs">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedStudentForProfile.name}</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-600">
                              <div><span className="text-slate-400 font-medium">Roll Number:</span> <span className="font-bold text-slate-800">{selectedStudentForProfile.rollNo}</span></div>
                              <div><span className="text-slate-400 font-medium">Admission No:</span> <span className="font-bold text-slate-800">{selectedStudentForProfile.rollNo}</span></div>
                              <div><span className="text-slate-400 font-medium">Department:</span> <span className="font-bold text-slate-800">{selectedStudentForProfile.department}</span></div>
                              <div><span className="text-slate-400 font-medium">Year / Sem:</span> <span className="font-bold text-slate-800">Year 3, Sem 5</span></div>
                              <div><span className="text-slate-400 font-medium">Email:</span> <span className="font-bold text-slate-800">{selectedStudentForProfile.email || "vishnu@gmrit.edu.in"}</span></div>
                              <div><span className="text-slate-400 font-medium">Mobile:</span> <span className="font-bold text-slate-800">{selectedStudentForProfile.mobile || "6300460031"}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* ID Card Status Banner matching Pic 2 */}
                        <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-emerald-600 text-white grid place-items-center shrink-0">
                              <CheckCircle2 className="size-5" />
                            </div>
                            <div className="space-y-0.5 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-950 text-sm">🟢 ID CARD ISSUED</span>
                                <Badge className="bg-emerald-200 text-emerald-900 border-none text-[0.65rem] font-bold">OFFICIAL RECORD SAVED</Badge>
                              </div>
                              <p className="text-emerald-800 text-[0.72rem]">
                                Issue Status: <span className="font-bold">Issued</span> | Issue Date: <span className="font-bold">01-08-2023</span> | Issued By: <span className="font-bold">Librarian</span> | Card No: <span className="font-bold">IDC-{selectedStudentForProfile.rollNo}</span> | Delivery: <span className="font-bold">Handed Over</span>
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-600 text-white font-bold text-[0.7rem] px-3 py-1 shrink-0">
                            ✔ Database Synchronized
                          </Badge>
                        </div>

                        {/* Physical Card Delivery Status Box matching Pic 2 */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="space-y-1 text-xs">
                            <p className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">PHYSICAL CARD DELIVERY STATUS</p>
                            <p className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                              ⚠️ Pending Handover (Awaiting student signature)
                            </p>
                            <p className="text-slate-500 text-[0.72rem]">Physical card has not been delivered to student yet.</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <Button
                              onClick={() => toast.success(`Physical handover confirmed for ${selectedStudentForProfile.name}!`)}
                              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl h-10 px-4 cursor-pointer"
                            >
                              ✔ Confirm Physical Handover
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toast.info("Generating ID Card Form & Receipt PDF...")}
                              className="text-xs font-semibold rounded-xl h-10 border-slate-200 hover:bg-slate-50 cursor-pointer"
                            >
                              📄 ID Card Form & Receipt
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toast.info("Opening Card Branding & Customization Modal...")}
                              className="text-xs font-semibold rounded-xl h-10 border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100 cursor-pointer"
                            >
                              ✏ Customize Card & Branding
                            </Button>
                          </div>
                        </div>

                        {/* Quick Action Buttons Row matching Pic 2 */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold py-2 px-3 rounded-xl">
                            ✔ ID Card Issued (Duplicate Issuance Blocked)
                          </Badge>
                          <Button
                            onClick={() => window.print()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
                          >
                            <Printer className="size-4 mr-1.5" /> Print ID Card
                          </Button>
                          <Button
                            onClick={() => toast.success(`Reprint requested for ${selectedStudentForProfile.name}`)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
                          >
                            🔄 Reprint Card
                          </Button>
                          <Button
                            onClick={() => toast.warning(`ID Card blocked for ${selectedStudentForProfile.name}`)}
                            className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
                          >
                            🔒 Block Card
                          </Button>
                          <Button
                            onClick={() => toast.error(`Reported lost card for ${selectedStudentForProfile.name}`)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
                          >
                            🚨 Report Lost
                          </Button>
                          <Button
                            onClick={() => toast.info(`Duplicate card request initiated for ${selectedStudentForProfile.name}`)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
                          >
                            + Request Duplicate
                          </Button>
                        </div>

                        {/* Vertical ID Cards Preview Section matching Pic 3 */}
                        <div className="grid gap-6 md:grid-cols-2 pt-4">
                          {/* Front Side Vertical Official Card */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              💳 FRONT SIDE (OFFICIAL VERTICAL CARD)
                            </p>
                            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-lg space-y-4 max-w-sm mx-auto text-slate-900 border-b-4 border-b-red-600">
                              {/* Header logo */}
                              <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-sm text-blue-900 tracking-tight flex items-center gap-1">
                                    <span className="size-4 bg-orange-500 rounded-xs transform rotate-45 inline-block"></span> GMRIT - RAJAM
                                  </span>
                                  <span className="text-[0.65rem] font-bold text-blue-900">GAR</span>
                                </div>
                                <p className="text-[0.6rem] font-bold text-slate-600 uppercase">ACCREDITED BY NBA & NAAC</p>
                                <p className="text-[0.55rem] text-slate-400">An Autonomous Institute Affiliated to JNTU-GV</p>
                              </div>

                              {/* Student Photo */}
                              <div className="flex justify-center py-1">
                                <img
                                  src={selectedStudentForProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                                  alt={selectedStudentForProfile.name}
                                  className="size-36 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                                />
                              </div>

                              {/* Student Name */}
                              <div className="text-center">
                                <h4 className="font-extrabold text-base text-slate-900">{selectedStudentForProfile.name}</h4>
                              </div>

                              {/* Details table */}
                              <div className="text-[0.75rem] space-y-1 font-semibold text-slate-700 pt-1">
                                <div className="flex justify-between"><span>JNTU No</span><span>: {selectedStudentForProfile.rollNo}</span></div>
                                <div className="flex justify-between"><span>Branch</span><span>: {selectedStudentForProfile.department}</span></div>
                                <div className="flex justify-between"><span>Batch</span><span>: 2023 - 2027</span></div>
                                <div className="flex justify-between"><span>Contact No</span><span>: {selectedStudentForProfile.mobile || "6300460031"}</span></div>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                <span className="font-black text-slate-400 text-xs italic">GAR</span>
                                <div className="text-center">
                                  <div className="font-mono text-[0.65rem] font-bold tracking-tighter text-slate-700">~~~~~~~~~</div>
                                  <span className="text-[0.6rem] font-extrabold text-slate-700 uppercase">PRINCIPAL</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Back Side Personal Details Card */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              💳 BACK SIDE (PERSONAL DETAILS & BARCODE)
                            </p>
                            <div className="bg-gradient-to-b from-amber-500 via-orange-400 to-amber-500 text-slate-950 rounded-3xl p-6 shadow-lg space-y-5 max-w-sm mx-auto flex flex-col justify-between h-[480px]">
                              <div className="space-y-3">
                                <h5 className="font-black text-xs uppercase tracking-wider border-b border-slate-900/20 pb-2">PERSONAL DETAILS :</h5>
                                <div className="text-xs font-bold space-y-1.5">
                                  <div className="flex justify-between"><span>Date of Birth</span><span>: {selectedStudentForProfile.dob || "19-05-2005"}</span></div>
                                  <div className="flex justify-between"><span>Blood Group</span><span>: {selectedStudentForProfile.bloodGroup || "O+ve"}</span></div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="bg-white p-3 rounded-2xl flex items-center justify-between text-slate-900 shadow-sm">
                                  <div className="space-y-1">
                                    <div className="h-10 w-36 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)]" />
                                    <div className="text-[0.65rem] font-mono font-bold tracking-widest">{selectedStudentForProfile.rollNo}</div>
                                  </div>
                                  <div className="size-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl grid place-items-center text-white font-bold">
                                    ✓
                                  </div>
                                </div>

                                <p className="text-[0.65rem] font-semibold text-slate-900 leading-tight">
                                  Note : The Student / Staff should bring this card daily to college and produce on demand.
                                </p>
                              </div>

                              <div className="text-center text-[0.62rem] font-bold text-slate-900 space-y-0.5 border-t border-slate-900/20 pt-3">
                                <p className="underline">If found please drop in any post box.</p>
                                <p>GMR NAGAR, RAJAM - 532 127,</p>
                                <p>Ph. No. 08941 - 251593</p>
                                <p>visit us at : <span className="underline">www.gmrit.org</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PENDING APPROVAL SUB-TAB */}
            {idCardSubTab === "pending" && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Pending ID Card Approval Requests</h4>
                <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                  No pending ID card approval requests currently.
                </div>
              </div>
            )}

            {/* RECEIPTS & FEES SUB-TAB */}
            {idCardSubTab === "receipts" && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Duplicate Card Fee Receipts</h4>
                <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                  No fee collection records found for duplicate card requests.
                </div>
              </div>
            )}

            {/* AUDIT HISTORY SUB-TAB */}
            {idCardSubTab === "audit" && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Card Printing Audit Trail</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-900">Printed Library Access Card for K. Sai Teja (22CS101)</span>
                      <p className="text-slate-500 text-[0.72rem]">Executed by Librarian Admin &middot; System Kiosk #1</p>
                    </div>
                    <span className="font-mono text-slate-400 text-[0.7rem]">Today 10:30 AM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* MEMBERS DIRECTORY TAB */}
      {activeTab === "members" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                Library Members Directory 👥
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage registered students, faculty, branch distribution, and member report analytics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setMemberReportModalOpen(true)}
                variant="outline"
                className="text-xs font-semibold rounded-2xl h-10 border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
              >
                <FileText className="size-4 mr-1.5 text-[#2563eb]" /> Total Member Report
              </Button>
              <Button
                onClick={() => toast.info("Opening New Member Registration...")}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-2xl h-10 px-4 cursor-pointer shadow-2xs"
              >
                <Plus className="size-4 mr-1.5" /> Register New Member
              </Button>
            </div>
          </div>

          {/* 4 KPI Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Members */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Total Members</span>
                <div className="size-8 rounded-xl bg-blue-50 text-[#2563eb] grid place-items-center">
                  <Users className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{totalMembersCount}</div>
                <p className="text-[0.7rem] text-slate-400 font-medium mt-0.5">All registered library accounts</p>
              </div>
            </div>

            {/* Card 2: Total Students */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Total Students</span>
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
                  <GraduationCap className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{totalStudentsCount}</div>
                <p className="text-[0.7rem] text-slate-400 font-medium mt-0.5">Active student members</p>
              </div>
            </div>

            {/* Card 3: Number of Staff */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">Number of Staff</span>
                <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
                  <Briefcase className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{totalStaffCount}</div>
                <p className="text-[0.7rem] text-slate-400 font-medium mt-0.5">Faculty & staff members</p>
              </div>
            </div>

            {/* Card 4: Branch Students Count */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[130px]" title="Branch Students">
                  Branch Students ({selectedBranchFilter === "All Branches" ? "All" : selectedBranchFilter})
                </span>
                <div className="size-8 rounded-xl bg-purple-50 text-purple-600 grid place-items-center">
                  <Building2 className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#2563eb]">{branchStudentsCount}</div>
                <p className="text-[0.7rem] text-slate-400 font-medium mt-0.5 truncate">
                  Students in {selectedBranchFilter}
                </p>
              </div>
            </div>
          </div>

          {/* Search, Branch Filter & Controls Toolbar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative min-w-[240px] flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Frequently search student/staff name, roll no, dept..."
                  className="pl-10 h-10 rounded-2xl bg-slate-50/70 border-slate-200 text-xs focus-visible:ring-[#2563eb]"
                />
              </div>

              {/* Branch Dropdown Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 whitespace-nowrap hidden sm:inline">Branch:</label>
                <select
                  value={selectedBranchFilter}
                  onChange={(e) => setSelectedBranchFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer shadow-2xs"
                >
                  {branchesList.map((branch) => {
                    const count = branch === "All Branches" 
                      ? totalStudentsCount 
                      : members.filter(m => m.type === "Student" && m.department === branch).length;
                    return (
                      <option key={branch} value={branch}>
                        {branch} ({count} {count === 1 ? "Student" : "Students"})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Member Type Filter Buttons */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl text-xs font-semibold">
                {(["All", "Student", "Faculty"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMemberTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      memberTypeFilter === type
                        ? "bg-white text-[#2563eb] font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {type === "All" ? "All" : type === "Student" ? "Students" : "Staff"}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl shrink-0 self-end lg:self-auto">
              <button
                type="button"
                onClick={() => setMemberViewMode("grid")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  memberViewMode === "grid" ? "bg-white text-[#2563eb] shadow-2xs" : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setMemberViewMode("table")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  memberViewMode === "table" ? "bg-white text-[#2563eb] shadow-2xs" : "text-slate-400 hover:text-slate-700"
                }`}
                title="Table View"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>

          {/* Members Display View */}
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-2 shadow-2xs">
              <Users className="size-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No members found</p>
              <p className="text-xs text-slate-400">Try adjusting your search name query or branch dropdown filter.</p>
            </div>
          ) : memberViewMode === "grid" ? (
            /* Grid View Cards */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                        alt={m.name}
                        className="size-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{m.rollNo}</p>
                        <p className="text-[0.72rem] text-slate-400">{m.email || `${m.rollNo.toLowerCase()}@edusuite.edu`}</p>
                      </div>
                    </div>
                    <Badge className={m.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                      {m.status}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">Branch / Dept:</span>
                      <span className="font-bold text-slate-800">{m.department}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">Member Category:</span>
                      <Badge variant="outline" className="text-[0.65rem] bg-blue-50 text-blue-700 border-blue-200">
                        {m.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium">Books Issued:</span>
                      <span className="font-extrabold text-[#2563eb]">{m.issued} / {m.limit}</span>
                    </div>
                    {m.fine > 0 && (
                      <div className="flex justify-between items-center text-red-600 font-bold pt-1 border-t border-slate-200/60">
                        <span>Unpaid Fine:</span>
                        <span>₹{m.fine}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      onClick={() => {
                        setSelectedStudentForProfile(m);
                        setIdCardSubTab("issue");
                        toast.success(`Loaded ID Card Studio profile for ${m.name}`);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl h-9 cursor-pointer"
                    >
                      <CreditCard className="size-3.5 mr-1" /> View ID Card
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Roll No / Emp ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Branch / Dept</th>
                    <th className="p-4 text-center">Books Out</th>
                    <th className="p-4 text-center">Max Limit</th>
                    <th className="p-4">Dues Fine</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                          alt={m.name}
                          className="size-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div>{m.name}</div>
                          <div className="text-[0.7rem] font-normal text-slate-400">{m.email}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-700">{m.rollNo}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[0.68rem] bg-blue-50 text-blue-700 border-blue-200">
                          {m.type}
                        </Badge>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{m.department}</td>
                      <td className="p-4 text-center font-bold text-[#2563eb]">{m.issued}</td>
                      <td className="p-4 text-center text-slate-500">{m.limit}</td>
                      <td className="p-4 font-bold text-slate-700">
                        {m.fine > 0 ? <span className="text-red-600">₹{m.fine}</span> : <span className="text-slate-400">₹0</span>}
                      </td>
                      <td className="p-4">
                        <Badge className={m.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                          {m.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStudentForProfile(m);
                            setIdCardSubTab("issue");
                            toast.success(`Loaded ID Card profile for ${m.name}`);
                          }}
                          className="text-[#2563eb] hover:bg-blue-50 font-semibold cursor-pointer text-xs"
                        >
                          View Profile &rarr;
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TOTAL MEMBER REPORT MODAL */}
          {memberReportModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-extrabold text-lg text-slate-900">Total Library Member Report 📊</h4>
                    <p className="text-xs text-slate-500">Comprehensive membership breakdown and branch statistics.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMemberReportModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Summary Stat Grid */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-slate-400 font-medium text-[0.68rem] uppercase block">Total Members</span>
                      <span className="text-xl font-black text-slate-900">{totalMembersCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium text-[0.68rem] uppercase block">Total Students</span>
                      <span className="text-xl font-black text-emerald-600">{totalStudentsCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium text-[0.68rem] uppercase block">Total Staff</span>
                      <span className="text-xl font-black text-indigo-600">{totalStaffCount}</span>
                    </div>
                  </div>

                  {/* Branch Breakdown */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Students Distribution by Branch</h5>
                    <div className="space-y-2">
                      {["CSE", "CSE (AI&ML)", "ECE", "EEE", "Mechanical", "Civil"].map((branch) => {
                        const count = members.filter((m) => m.type === "Student" && m.department === branch).length;
                        const pct = totalStudentsCount > 0 ? Math.round((count / totalStudentsCount) * 100) : 0;
                        return (
                          <div key={branch} className="space-y-1">
                            <div className="flex justify-between font-medium text-slate-700">
                              <span>{branch}</span>
                              <span className="font-bold">{count} Students ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-[#2563eb] rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setMemberReportModalOpen(false)}
                    className="rounded-xl h-10 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Downloading Total Member Report CSV...");
                      setMemberReportModalOpen(false);
                    }}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl h-10 text-xs font-semibold cursor-pointer"
                  >
                    <Download className="size-4 mr-1.5" /> Export Report (CSV)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DIGITAL LIBRARY TAB (Matching Images 1 & 2) */}
      {activeTab === "digital" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Top Sub-Navigation Pills matching Image 1 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
            {[
              { id: "explore", label: "Explore Library", icon: BookOpen },
              { id: "my-library", label: "My Library (0)", icon: Bookmark },
              { id: "analytics", label: "Usage Analytics", icon: TrendingUp },
              { id: "feed", label: "Library Feed", icon: Send },
              { id: "console", label: "Librarian Console", icon: Library },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = digitalSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDigitalSubTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl border transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#2563eb] text-white border-[#2563eb] font-bold shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filters Main Panel matching Image 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            {/* Search Input Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={digitalSearchQuery}
                  onChange={(e) => setDigitalSearchQuery(e.target.value)}
                  placeholder="Search textbooks, PDFs, ISBNs, authors..."
                  className="pl-10 pr-10 h-11 rounded-2xl bg-slate-50/60 border-slate-200 text-xs focus-visible:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={() => toast.info("Voice search listening...")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Voice Search"
                >
                  <Mic className="size-4" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => toast.info("Filters menu toggled")}
                className="h-11 px-4 rounded-2xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Filter className="size-3.5 mr-1.5" /> Filters
              </Button>

              <Button
                onClick={() => toast.success(`Searching digital library for "${digitalSearchQuery}"...`)}
                className="h-11 px-6 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Search
              </Button>
            </div>

            {/* Search In Checkboxes & AI Toggle Row matching Image 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-500">Search In:</span>
                {Object.keys(searchCheckboxes).map((key) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={(searchCheckboxes as any)[key]}
                      onChange={(e) =>
                        setSearchCheckboxes({
                          ...searchCheckboxes,
                          [key]: e.target.checked,
                        })
                      }
                      className="rounded text-[#2563eb] focus:ring-[#2563eb]"
                    />
                    {key}
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-purple-700 hover:text-purple-900">
                  <input
                    type="checkbox"
                    checked={aiSemanticSearch}
                    onChange={(e) => setAiSemanticSearch(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <Sparkles className="size-3.5 text-purple-600" /> AI Semantic Search
                </label>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button type="button" className="p-1 rounded-lg bg-white shadow-2xs text-[#2563eb]" title="Grid View">
                    <LayoutGrid className="size-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-700" title="List View">
                    <List className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Tags Row matching Image 1 */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="text-slate-400 font-semibold">Popular:</span>
              {["React", "Algorithms", "Calculus", "Physics", "DBMS"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDigitalSearchQuery(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[0.72rem] font-medium transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills matching Image 1 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Computer Science", "Business", "Mathematics", "Science"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDigitalCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  digitalCategory === cat
                    ? "bg-[#2563eb] text-white font-bold shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rich Digital E-Resource Book Cover Cards Grid matching Images 1 & 2 */}
          {filteredDigitalResources.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-2 shadow-2xs">
              <BookOpen className="size-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No digital resources found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or category filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDigitalResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Digital Book Cover Graphic matching Images 1 & 2 */}
                  <div className={`relative h-60 rounded-2xl ${res.coverGradient} text-white p-5 flex flex-col justify-between shadow-sm overflow-hidden`}>
                    {/* Top row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-white bg-white/20 border-white/40 cursor-pointer" />
                        <span className="font-extrabold uppercase text-[0.7rem] tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          {res.department}
                        </span>
                      </div>
                      <Badge className="bg-white/20 text-white backdrop-blur-xs border-none font-bold text-[0.65rem]">
                        {res.format}
                      </Badge>
                    </div>

                    {/* Cover Title & Author */}
                    <div className="space-y-1 my-auto">
                      <h4 className="font-extrabold text-lg leading-snug tracking-tight drop-shadow-sm font-serif">
                        {res.title}
                      </h4>
                      <p className="text-xs text-blue-100 font-medium italic">by {res.author}</p>
                    </div>

                    {/* Bottom cover badges */}
                    <div className="flex items-center justify-between text-[0.68rem] font-mono text-blue-100/90 border-t border-white/10 pt-2">
                      <span>ISBN: {res.isbn ? res.isbn.slice(0, 7) + "..." : "978026..."}</span>
                      <span className="bg-slate-900/40 px-2 py-0.5 rounded-md font-sans font-semibold text-white">
                        {res.pages || "1200 Pages"}
                      </span>
                    </div>
                  </div>

                  {/* Info Section below cover matching Image 2 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 font-semibold">
                      <span className="text-[#2563eb]">{res.category}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {res.rating || "4.8"} ({res.reviews || 120})
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{res.title}</h4>
                    <p className="text-slate-500 text-[0.72rem]">by {res.author}</p>

                    {/* Details Container Box */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[0.7rem] text-slate-600">
                      <div>
                        <span className="text-slate-400 block font-medium">Subject & Sem</span>
                        <span className="font-bold text-slate-800 truncate max-w-[150px] inline-block">{res.subject || "Computer Science"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-medium">Size & Downloads</span>
                        <span className="font-bold text-emerald-600">{res.size} &bull; {res.downloads}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row matching Image 2 */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      onClick={() => toast.success(`Opening Reader for ${res.title}...`)}
                      className="flex-1 bg-gradient-to-r from-[#2563eb] to-indigo-600 hover:from-[#1d4ed8] hover:to-indigo-700 text-white font-bold text-xs rounded-xl h-10 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="size-4 mr-1.5" /> Read Now
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toast.info(`Resource Details: ${res.title} (${res.size})`)}
                      className="size-10 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0 cursor-pointer text-slate-600"
                      title="View Info"
                    >
                      <Info className="size-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toast.success(`Downloading ${res.title} PDF...`)}
                      className="size-10 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0 cursor-pointer text-slate-600"
                      title="Download PDF"
                    >
                      <Download className="size-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toast.info(`Editing ${res.title}...`)}
                      className="size-10 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0 cursor-pointer text-slate-600"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toast.error(`Deleted resource ${res.title}`)}
                      className="size-10 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0 cursor-pointer text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* FINES TAB */}
      {activeTab === "fines" && (
        <div className="space-y-6 animate-fade-in-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fine Collections & Waiver Desk</h3>
              <p className="text-xs text-slate-500">Record fine payments, view overdue charges, and process waiver applications.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Overdue Book Title</th>
                  <th className="p-4">Days Overdue</th>
                  <th className="p-4">Fine Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fines.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">{f.student}</td>
                    <td className="p-4 text-slate-700">{f.book}</td>
                    <td className="p-4">{f.daysOverdue} Days</td>
                    <td className="p-4 font-bold text-red-600">Rs {f.amount}</td>
                    <td className="p-4">
                      <Badge className={f.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                        {f.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {f.status === "Unpaid" && (
                        <Button
                          size="sm"
                          onClick={() => handlePayFine(f.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl cursor-pointer"
                        >
                          Collect Cash / UPI
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTS TAB (Matching Images 1 & 2) */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-fade-in-soft">
          {/* Header Row matching Image 1 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Library Reports</h3>
              <p className="text-xs text-slate-500">Analytics, statistics and performance reports.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => toast.success("Exporting Library Reports CSV/PDF...")}
              className="rounded-2xl border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer h-10 px-4"
            >
              <Download className="size-4 mr-1.5" /> Export Report
            </Button>
          </div>

          {/* Timescale Range Selector Card matching Image 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Select Timescale Range</h4>
              <p className="text-xs text-slate-500">Adjust range to sync circulation datasets</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setReportsTimescale("3m")}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  reportsTimescale === "3m"
                    ? "bg-[#2563eb] text-white font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                3 Months
              </button>
              <button
                type="button"
                onClick={() => setReportsTimescale("5m")}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  reportsTimescale === "5m"
                    ? "bg-gradient-to-r from-[#2563eb] to-indigo-600 text-white font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                5 Months
              </button>
            </div>
          </div>

          {/* 4 KPI Stat Summary Cards Grid matching Image 1 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Total Books Issued</span>
              <div className="text-3xl font-black text-slate-900">3</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="size-3.5" /> -100.0% vs last month
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Total Books Returned</span>
              <div className="text-3xl font-black text-slate-900">3</div>
              <div className="text-xs font-medium text-slate-500">Return rate: 100.0%</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Active Members</span>
              <div className="text-3xl font-black text-slate-900">1</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="size-3.5" /> -100.0% growth
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Fine Revenue</span>
              <div className="text-3xl font-black text-slate-900">₹20</div>
              <div className="text-xs font-medium text-slate-500">Collection rate: 100.0%</div>
            </div>
          </div>

          {/* 2 Analytics Charts Row matching Images 1 & 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Monthly Book Circulation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Monthly Book Circulation</h4>
                  <p className="text-xs text-slate-500">Issues and returns trend</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-[#2563eb] border-blue-200 font-semibold text-xs rounded-xl px-3 py-1">
                  5 months
                </Badge>
              </div>

              {/* Smooth Area/Line Chart SVG matching Image 1 */}
              <div className="h-64 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="circGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="155" x2="480" y2="155" stroke="#e2e8f0" />

                  {/* Y Axis labels */}
                  <text x="25" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">3</text>
                  <text x="25" y="69" fill="#94a3b8" fontSize="10" textAnchor="end">2.25</text>
                  <text x="25" y="114" fill="#94a3b8" fontSize="10" textAnchor="end">1.5</text>
                  <text x="25" y="159" fill="#94a3b8" fontSize="10" textAnchor="end">0.75</text>
                  <text x="25" y="195" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

                  {/* Curve Path for July peak */}
                  <path
                    d="M 50 190 Q 150 190 260 185 T 375 25 T 470 190"
                    fill="url(#circGradient)"
                  />
                  <path
                    d="M 50 190 Q 150 190 260 185 T 375 25 T 470 190"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                  />

                  {/* Points */}
                  <circle cx="50" cy="190" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
                  <circle cx="155" cy="190" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
                  <circle cx="260" cy="185" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
                  <circle cx="375" cy="25" r="5" fill="#ffffff" stroke="#06b6d4" strokeWidth="3" />
                  <circle cx="470" cy="190" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />

                  {/* X Axis month labels */}
                  <text x="50" y="210" fill="#64748b" fontSize="10" textAnchor="middle">April</text>
                  <text x="155" y="210" fill="#64748b" fontSize="10" textAnchor="middle">May</text>
                  <text x="260" y="210" fill="#64748b" fontSize="10" textAnchor="middle">June</text>
                  <text x="375" y="210" fill="#64748b" fontSize="10" textAnchor="middle">July</text>
                  <text x="470" y="210" fill="#64748b" fontSize="10" textAnchor="middle">August</text>
                </svg>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-indigo-600"></span> Issued</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-cyan-400"></span> Returned</span>
              </div>
            </div>

            {/* Chart 2: Fine Collection Trend */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Fine Collection Trend</h4>
                  <p className="text-xs text-slate-500">Monthly revenue from fines</p>
                </div>
                <Badge className="bg-rose-50 text-rose-600 border-rose-200 font-semibold text-xs rounded-xl px-3 py-1">
                  Decreasing
                </Badge>
              </div>

              {/* Monthly Fine Bar Chart SVG matching Image 1 */}
              <div className="h-64 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="155" x2="480" y2="155" stroke="#e2e8f0" />

                  {/* Y Axis labels */}
                  <text x="25" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">20</text>
                  <text x="25" y="69" fill="#94a3b8" fontSize="10" textAnchor="end">15</text>
                  <text x="25" y="114" fill="#94a3b8" fontSize="10" textAnchor="end">10</text>
                  <text x="25" y="159" fill="#94a3b8" fontSize="10" textAnchor="end">5</text>
                  <text x="25" y="195" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

                  {/* Bar for July (₹20) matching Image 1 */}
                  <rect x="345" y="25" width="45" height="130" rx="8" fill="#8b5cf6" />

                  {/* X Axis month labels */}
                  <text x="50" y="210" fill="#64748b" fontSize="10" textAnchor="middle">April</text>
                  <text x="155" y="210" fill="#64748b" fontSize="10" textAnchor="middle">May</text>
                  <text x="260" y="210" fill="#64748b" fontSize="10" textAnchor="middle">June</text>
                  <text x="367" y="210" fill="#64748b" fontSize="10" textAnchor="middle">July</text>
                  <text x="470" y="210" fill="#64748b" fontSize="10" textAnchor="middle">August</text>
                </svg>
              </div>

              {/* Footer Note */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                <span>Peak Revenue: ₹20 (July)</span>
                <span className="text-emerald-600 font-bold">100% Collection Rate</span>
              </div>
            </div>
          </div>

          {/* Most Borrowed Books Table matching Image 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h4 className="font-extrabold text-[#2563eb] text-sm">Most Borrowed Books</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5">Times Issued</th>
                    <th className="p-3.5">Available</th>
                    <th className="p-3.5">Popularity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { rank: 1, title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", times: 1, available: 1, pop: 100 },
                    { rank: 2, title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", times: 1, available: 1, pop: 100 },
                    { rank: 3, title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", times: 1, available: 1, pop: 85 },
                  ].map((b) => (
                    <tr key={b.rank} className="hover:bg-slate-50/70">
                      <td className="p-3.5">
                        <span className="size-7 rounded-full bg-indigo-600 text-white font-black grid place-items-center text-xs shadow-2xs">
                          {b.rank}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{b.title}</td>
                      <td className="p-3.5 text-slate-500">{b.author}</td>
                      <td className="p-3.5 font-black text-slate-900">{b.times}</td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="bg-blue-50 text-[#2563eb] border-blue-200 rounded-full font-bold text-[0.68rem] px-2.5">
                          {b.available}
                        </Badge>
                      </td>
                      <td className="p-3.5 w-48">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${b.pop}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category-wise Analysis Section matching Image 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h4 className="font-extrabold text-[#2563eb] text-sm">Category-wise Analysis</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Computer Science", pct: 42, color: "bg-[#2563eb]" },
                { name: "Electronics", pct: 28, color: "bg-indigo-600" },
                { name: "Mechanical", pct: 18, color: "bg-purple-600" },
                { name: "Basic Sciences", pct: 12, color: "bg-teal-600" },
              ].map((c) => (
                <div key={c.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>{c.name}</span>
                    <span className="text-[#2563eb]">{c.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className={`${c.color} h-full rounded-full`} style={{ width: `${c.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className="space-y-6 animate-fade-in-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Overdue Reminders & Notice Dispatch</h3>
              <p className="text-xs text-slate-500">Broadcast automated SMS/WhatsApp alerts for overdue books and reserved arrivals.</p>
            </div>
            <Button
              onClick={() => toast.success("Overdue SMS/Email alerts dispatched to 38 members!")}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl"
            >
              <Send className="size-4 mr-1.5" /> Dispatch Overdue Alerts
            </Button>
          </div>

          <Panel title="Recent Automated Notices">
            <div className="space-y-3 text-xs">
              {[
                { title: "Overdue Return Alert #401", recipient: "Rahul V. (22CS189)", status: "Sent via WhatsApp", date: "Today 09:30 AM" },
                { title: "Reserved Book Ready for Pickup", recipient: "K. Sai Teja (22CS101)", status: "Sent via Email", date: "Yesterday" },
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
                  <div>
                    <div className="font-bold text-slate-900">{n.title}</div>
                    <div className="text-slate-500">Recipient: {n.recipient}</div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-[#2563eb] border-blue-200">
                    {n.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="space-y-6 animate-fade-in-soft max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Library Policy Settings</h3>
            <p className="text-xs text-slate-500">Configure book borrowing limits, overdue fine rates, and loan durations.</p>
          </div>

          <Panel title="Configuration Form">
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Max Book Limit</label>
                <Input defaultValue="3" className="rounded-xl h-10 bg-white border-slate-200" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty Max Book Limit</label>
                <Input defaultValue="10" className="rounded-xl h-10 bg-white border-slate-200" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Default Loan Duration (Days)</label>
                <Input defaultValue="14" className="rounded-xl h-10 bg-white border-slate-200" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Overdue Fine Rate (Rs / Day)</label>
                <Input defaultValue="5" className="rounded-xl h-10 bg-white border-slate-200" />
              </div>
              <Button
                onClick={() => toast.success("Library policy configuration saved successfully!")}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl h-10 w-full cursor-pointer"
              >
                Save Policy Configuration
              </Button>
            </div>
          </Panel>
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === "search" && (
        <div className="animate-fade-in-soft">
          <GlobalLibrarySearchView />
        </div>
      )}

      {/* RESERVATIONS TAB */}
      {activeTab === "reservations" && (
        <div className="animate-fade-in-soft">
          <ReservationManagementView />
        </div>
      )}

      {/* ACQUISITION TAB */}
      {activeTab === "acquisition" && (
        <div className="animate-fade-in-soft">
          <AcquisitionModuleView />
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div className="animate-fade-in-soft">
          <InventoryModuleView />
        </div>
      )}

      {/* READING HALL TAB */}
      {activeTab === "reading-hall" && (
        <div className="animate-fade-in-soft">
          <ReadingHallView />
        </div>
      )}

      {/* GATE & ENTRY TAB */}
      {activeTab === "entry" && (
        <div className="animate-fade-in-soft">
          <LibraryEntryView />
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === "audit-logs" && (
        <div className="animate-fade-in-soft">
          <AuditLogsView />
        </div>
      )}

      {/* CATALOG MANAGEMENT TAB */}
      {activeTab === "catalog" && (
        <div className="animate-fade-in-soft">
          <CatalogManagementView />
        </div>
      )}

      {/* CIRCULATION ENHANCEMENTS TAB */}
      {activeTab === "circulation" && (
        <div className="animate-fade-in-soft">
          <CirculationEnhancementsView />
        </div>
      )}

      {/* ADD NEW BOOK MODAL DIALOG */}
      <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Add New Book to Library Catalog</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter complete book details to register a new title into the central inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBook} className="space-y-3 text-xs mt-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Book Title *</label>
              <Input
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                placeholder="e.g. Operating System Concepts"
                className="rounded-xl h-10 bg-white border-slate-200"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Author Name *</label>
              <Input
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                placeholder="e.g. Abraham Silberschatz"
                className="rounded-xl h-10 bg-white border-slate-200"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ISBN Number *</label>
                <Input
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  placeholder="978-0131873254"
                  className="rounded-xl h-10 bg-white border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Shelf Rack Location</label>
                <Input
                  value={newBook.rack}
                  onChange={(e) => setNewBook({ ...newBook, rack: e.target.value })}
                  placeholder="CS-Rack-03"
                  className="rounded-xl h-10 bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Copies</label>
                <Input
                  type="number"
                  value={newBook.total}
                  onChange={(e) => setNewBook({ ...newBook, total: Number(e.target.value) })}
                  className="rounded-xl h-10 bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Price (Rs)</label>
                <Input
                  type="number"
                  value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                  className="rounded-xl h-10 bg-white border-slate-200"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setAddBookOpen(false)} className="rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-semibold cursor-pointer">
                Add to Inventory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* EDIT BOOK MODAL DIALOG */}
      <Dialog open={editBookOpen} onOpenChange={setEditBookOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Edit Book Details</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update details for this title in the central inventory catalog.
            </DialogDescription>
          </DialogHeader>

          {editingBook && (
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs mt-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Book Title *</label>
                <Input
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="rounded-xl h-10 bg-white border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Author Name *</label>
                <Input
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="rounded-xl h-10 bg-white border-slate-200"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ISBN Number *</label>
                  <Input
                    value={editingBook.isbn}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    className="rounded-xl h-10 bg-white border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <Input
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="rounded-xl h-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shelf Rack</label>
                  <Input
                    value={editingBook.rack}
                    onChange={(e) => setEditingBook({ ...editingBook, rack: e.target.value })}
                    className="rounded-xl h-10 bg-white border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Available</label>
                  <Input
                    type="number"
                    value={editingBook.available}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, available: Number(e.target.value) })
                    }
                    className="rounded-xl h-10 bg-white border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Copies</label>
                  <Input
                    type="number"
                    value={editingBook.total}
                    onChange={(e) => setEditingBook({ ...editingBook, total: Number(e.target.value) })}
                    className="rounded-xl h-10 bg-white border-slate-200"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditBookOpen(false)}
                  className="rounded-xl border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
