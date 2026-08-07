import React, { useState, useMemo } from "react";
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
  Users,
  Building2,
  X,
  Bookmark,
  Sparkles,
  Star,
  Info,
  ShieldCheck,
  ShoppingCart,
  Boxes,
  Armchair,
  Check,
  AlertTriangle,
  Upload,
  RefreshCw,
  Sliders,
  DollarSign,
  UserCheck,
  Calendar,
  Layers,
  MapPin,
  Barcode,
  History,
  CornerDownRight,
  RotateCcw,
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
import { useLibraryStore } from "./LibraryStore";

/* ========================================================================== */
/* 1. CATALOG MANAGEMENT VIEW                                                  */
/* ========================================================================== */
export function CatalogManagementView() {
  const { state, dispatch } = useLibraryStore();
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "categories" | "authors" | "publishers" | "locations" | "barcodes" | "bulk"
  >("overview");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recordsViewTab, setRecordsViewTab] = useState<"titles" | "volumes">("titles");
  const [recordsSearch, setRecordsSearch] = useState("");
  const [rackFilter, setRackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookCopies, setSelectedBookCopies] = useState<any | null>(null);
  const [isAddBookInCatOpen, setIsAddBookInCatOpen] = useState(false);
  const [newCatBook, setNewCatBook] = useState({
    title: "",
    author: "",
    isbn: "",
    callNumber: "",
    price: 650,
    copies: 5,
    rack: "CS-01",
    shelf: "S-01",
    edition: "1st",
    publishedYear: 2024,
    publisher: "Pearson Education",
  });

  const [search, setSearch] = useState("");
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", code: "", department: "Computer Science" });
  const [bulkCsvText, setBulkCsvText] = useState(
    "Title,Author,ISBN,Category,Rack,TotalCopies,Price\nCloud Computing Architecture,Rajkumar Buyya,978-0128000571,Computer Science,CS-Rack-05,5,850\nCyber Security Essentials,Charles Brooks,978-1119362395,Computer Science,CS-Rack-06,4,920"
  );

  const [customCategories, setCustomCategories] = useState<
    Array<{ name: string; code: string; department: string; floor: string; rackRange: string }>
  >([]);

  const categoriesData = useMemo(() => {
    const map: Record<string, { totalCopies: number; titlesCount: number }> = {};
    state.books.forEach((b) => {
      const catKey = b.category || "Uncategorized";
      if (!map[catKey]) map[catKey] = { totalCopies: 0, titlesCount: 0 };
      map[catKey].totalCopies += b.totalCopies;
      map[catKey].titlesCount += 1;
    });

    // Merge custom created categories if not already present
    customCategories.forEach((c) => {
      if (!map[c.name]) {
        map[c.name] = { totalCopies: 5, titlesCount: 1 };
      }
    });

    return Object.entries(map).map(([name, data], i) => {
      const custom = customCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      return {
        name,
        code: custom ? custom.code : `CAT-${10 + i * 10}`,
        booksCount: data.totalCopies,
        titlesCount: data.titlesCount,
        rackRange: custom ? `${custom.name.slice(0, 2).toUpperCase()}-Rack 01-10` : `${name.slice(0, 2).toUpperCase()}-Rack 01-10`,
        floor: custom ? custom.floor : `Floor ${(i % 3) + 1}`,
      };
    });
  }, [state.books, customCategories]);

  // Data for selected category detailed records
  const categoryBooks = useMemo(() => {
    if (!selectedCategory) return [];
    return state.books.filter((b) => b.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [state.books, selectedCategory]);

  const categoryStats = useMemo(() => {
    let totalTitles = categoryBooks.length;
    let totalCopies = 0;
    let availableCopies = 0;
    let issuedCopies = 0;
    let reservedCopies = 0;
    let totalValuation = 0;

    categoryBooks.forEach((b) => {
      totalCopies += b.totalCopies;
      availableCopies += b.availableCopies;
      issuedCopies += b.issuedCopies;
      reservedCopies += b.reservedCopies;
      totalValuation += b.totalCopies * (b.price || 500);
    });

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      reservedCopies,
      totalValuation,
    };
  }, [categoryBooks]);

  const filteredCategoryBooks = useMemo(() => {
    return categoryBooks.filter((b) => {
      const matchSearch =
        !recordsSearch ||
        b.title.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        b.authors.some((a) => a.toLowerCase().includes(recordsSearch.toLowerCase())) ||
        b.isbn.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        b.callNumber.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        b.accessionNo.toLowerCase().includes(recordsSearch.toLowerCase());

      const matchRack = rackFilter === "all" || b.location.rack.toLowerCase() === rackFilter.toLowerCase();
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && b.availableCopies > 0) ||
        (statusFilter === "issued" && b.issuedCopies > 0) ||
        (statusFilter === "low_stock" && b.availableCopies < 2);

      return matchSearch && matchRack && matchStatus;
    });
  }, [categoryBooks, recordsSearch, rackFilter, statusFilter]);

  // Generate individual volume copy records for physical inventory register
  const physicalVolumeCopies = useMemo(() => {
    const list: Array<{
      copyId: string;
      bookId: string;
      bookTitle: string;
      authors: string[];
      isbn: string;
      accessionTag: string;
      copyIndex: number;
      totalBookCopies: number;
      rack: string;
      shelf: string;
      building: string;
      floor: string;
      barcode: string;
      status: "Available" | "Issued" | "Reserved" | "Maintenance";
      borrowerName?: string;
      borrowerId?: string;
      dueDate?: string;
      condition: "Mint" | "Good" | "Slightly Worn";
      price: number;
    }> = [];

    categoryBooks.forEach((b) => {
      for (let i = 1; i <= b.totalCopies; i++) {
        let status: "Available" | "Issued" | "Reserved" | "Maintenance" = "Available";
        let borrowerName: string | undefined = undefined;
        let borrowerId: string | undefined = undefined;
        let dueDate: string | undefined = undefined;

        if (i <= b.issuedCopies) {
          status = "Issued";
          borrowerName = i === 1 ? "B VISHNU VARDHAN" : "K. Sai Teja";
          borrowerId = i === 1 ? "23341A4219" : "22CS101";
          dueDate = "2026-08-18";
        } else if (i === b.issuedCopies + 1 && b.reservedCopies > 0) {
          status = "Reserved";
          borrowerName = "Rahul V.";
        }

        list.push({
          copyId: `${b.id}-VOL-${String(i).padStart(2, "0")}`,
          bookId: b.id,
          bookTitle: b.title,
          authors: b.authors,
          isbn: b.isbn,
          accessionTag: `${b.accessionNo}-V${i}`,
          copyIndex: i,
          totalBookCopies: b.totalCopies,
          rack: b.location.rack,
          shelf: b.location.shelf,
          building: b.location.building,
          floor: b.location.floor,
          barcode: `${b.barcode}-C${i}`,
          status,
          borrowerName,
          borrowerId,
          dueDate,
          condition: i % 3 === 0 ? "Slightly Worn" : i % 2 === 0 ? "Good" : "Mint",
          price: b.price || 500,
        });
      }
    });

    return list.filter((v) => {
      const matchSearch =
        !recordsSearch ||
        v.bookTitle.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        v.accessionTag.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        v.barcode.toLowerCase().includes(recordsSearch.toLowerCase()) ||
        (v.borrowerName && v.borrowerName.toLowerCase().includes(recordsSearch.toLowerCase()));

      const matchRack = rackFilter === "all" || v.rack.toLowerCase() === rackFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || v.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchRack && matchStatus;
    });
  }, [categoryBooks, recordsSearch, rackFilter, statusFilter]);

  const uniqueRacks = useMemo(() => {
    const set = new Set<string>();
    categoryBooks.forEach((b) => set.add(b.location.rack));
    return Array.from(set);
  }, [categoryBooks]);

  const handleAddBookToCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatBook.title || !selectedCategory) return;

    const totalC = Number(newCatBook.copies) || 5;
    const newBookPayload = {
      title: newCatBook.title.trim(),
      authors: newCatBook.author ? [newCatBook.author.trim()] : ["Unknown Author"],
      isbn: newCatBook.isbn.trim() || `978-0-${Math.floor(100000000 + Math.random() * 900000000)}`,
      category: selectedCategory,
      subject: selectedCategory,
      publisher: newCatBook.publisher || "University Press",
      publishedYear: Number(newCatBook.publishedYear) || 2024,
      edition: newCatBook.edition || "1st",
      language: "English",
      totalCopies: totalC,
      availableCopies: totalC,
      issuedCopies: 0,
      reservedCopies: 0,
      lostCopies: 0,
      damagedCopies: 0,
      location: {
        building: "Central Library",
        floor: "Floor 1",
        rack: newCatBook.rack || "CS-01",
        shelf: newCatBook.shelf || "S-01",
      },
      callNumber: newCatBook.callNumber || `${selectedCategory.slice(0, 3).toUpperCase()}/${newCatBook.title.slice(0, 3).toUpperCase()}/001`,
      price: Number(newCatBook.price) || 650,
      status: "Active" as const,
      source: "Acquisition" as const,
      addedBy: "Librarian",
      tags: [selectedCategory.toLowerCase()],
    };

    dispatch({ type: "ADD_BOOK", payload: newBookPayload });
    toast.success(`Book "${newCatBook.title}" registered with ${totalC} volume copies in ${selectedCategory}!`);
    setIsAddBookInCatOpen(false);
    setNewCatBook({
      title: "",
      author: "",
      isbn: "",
      callNumber: "",
      price: 650,
      copies: 5,
      rack: "CS-01",
      shelf: "S-01",
      edition: "1st",
      publishedYear: 2024,
      publisher: "Pearson Education",
    });
  };

  const authorsData = useMemo(() => {
    const map: Record<string, { count: number; topTitle: string }> = {};
    state.books.forEach((b) => {
      b.authors.forEach((a) => {
        if (!map[a]) map[a] = { count: 0, topTitle: b.title };
        map[a].count += b.totalCopies;
      });
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      booksCount: data.count,
      topTitle: data.topTitle,
      nationality: "International",
    }));
  }, [state.books]);

  const publishersData = useMemo(() => {
    const map: Record<string, number> = {};
    state.books.forEach((b) => {
      map[b.publisher] = (map[b.publisher] || 0) + b.totalCopies;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      titlesCount: count,
      country: "Global",
      contact: `orders@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    }));
  }, [state.books]);

  const shelfLocations = useMemo(() => {
    const map: Record<string, { building: string; floor: string; rack: string; shelf: string; occupied: number }> = {};
    state.books.forEach((b) => {
      const key = `${b.location.rack}-${b.location.shelf}`;
      if (!map[key]) {
        map[key] = { building: b.location.building, floor: b.location.floor, rack: b.location.rack, shelf: b.location.shelf, occupied: 0 };
      }
      map[key].occupied += b.totalCopies;
    });
    return Object.values(map).map((l) => ({ ...l, capacity: Math.max(50, l.occupied + 10) }));
  }, [state.books]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const catName = newCategory.name.trim();
    const catCode = newCategory.code.trim() || `CAT-${Date.now().toString().slice(-4)}`;
    const dept = newCategory.department || "Computer Science";

    // 1. Add custom category to local categories state
    setCustomCategories((prev) => [
      ...prev.filter((c) => c.name.toLowerCase() !== catName.toLowerCase()),
      {
        name: catName,
        code: catCode,
        department: dept,
        floor: "Floor 2",
        rackRange: `${catName.slice(0, 2).toUpperCase()}-Rack 01-05`,
      },
    ]);

    // 2. Dispatch a starter book title into state.books so it has records & volumes
    dispatch({
      type: "ADD_BOOK",
      payload: {
        title: `${catName} Systems & Architecture Manual`,
        authors: [`${dept} Faculty Consortium`],
        isbn: `978-0-${Math.floor(100000000 + Math.random() * 900000000)}`,
        category: catName,
        subject: catName,
        publisher: "University Academic Press",
        publishedYear: 2024,
        edition: "1st",
        language: "English",
        totalCopies: 5,
        availableCopies: 5,
        issuedCopies: 0,
        reservedCopies: 0,
        lostCopies: 0,
        damagedCopies: 0,
        location: {
          building: "Central Library",
          floor: "Floor 2",
          rack: `${catName.slice(0, 2).toUpperCase()}-01`,
          shelf: "S-01",
        },
        callNumber: `${catName.slice(0, 3).toUpperCase()}/001`,
        price: 750,
        status: "Active",
        source: "Manual",
        addedBy: "Librarian",
        tags: [catName.toLowerCase(), dept.toLowerCase()],
      },
    });

    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: {
        userId: "LIB-ADMIN",
        userName: "Librarian",
        role: "Librarian",
        department: "Library",
        module: "BookManagement",
        action: "ADD_CATEGORY",
        description: `Catalog Category "${catName}" (${catCode}) saved into system records`,
        ipAddress: "192.168.1.45",
        device: "Desktop — Chrome",
      },
    });

    toast.success(`Category "${catName}" (${catCode}) saved into Catalog records with 5 initial volume copies!`);
    setIsAddCatOpen(false);
    setNewCategory({ name: "", code: "", department: "Computer Science" });
  };

  const handleBulkImport = () => {
    const lines = bulkCsvText.trim().split("\n").slice(1);
    let count = 0;
    lines.forEach((line) => {
      const parts = line.split(",");
      if (parts.length >= 6) {
        const [title, author, isbn, category, rack, totalCopies, price] = parts;
        dispatch({
          type: "ADD_BOOK",
          payload: {
            title: title.trim(),
            authors: [author.trim()],
            isbn: isbn.trim(),
            category: category.trim(),
            publisher: "University Press",
            publishedYear: 2024,
            edition: "1st",
            language: "English",
            subject: category.trim(),
            totalCopies: Number(totalCopies.trim()) || 5,
            availableCopies: Number(totalCopies.trim()) || 5,
            issuedCopies: 0,
            reservedCopies: 0,
            lostCopies: 0,
            damagedCopies: 0,
            location: { building: "Central Library", floor: "Floor 1", rack: rack.trim() || "CS-Rack-01", shelf: "S-01" },
            callNumber: `${category.trim().slice(0, 3)}/${isbn.trim().slice(-4)}`,
            price: Number(price?.trim()) || 500,
            status: "Active",
            source: "Import",
            addedBy: "Librarian",
            tags: [category.trim().toLowerCase()],
          },
        });
        count++;
      }
    });
    toast.success(`Bulk import completed! ${count} book titles added to catalog.`);
  };

  // IF A CATEGORY IS SELECTED FOR DETAILED RECORDS & VOLUMES SHOWCASE
  if (selectedCategory) {
    const activeCatInfo = categoriesData.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase()) || {
      name: selectedCategory,
      code: "CAT-10",
      floor: "Floor 1",
      rackRange: "CO-Rack 01-10",
    };

    return (
      <div className="space-y-6 animate-fade-in-soft">
        {/* Back Navigation & Category Showcase Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="gap-2 text-xs font-semibold rounded-xl bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="size-4" /> Back to Catalog Categories
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setIsAddBookInCatOpen(true)}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs gap-1.5 font-medium cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Title to Category
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Category "${selectedCategory}" records exported to CSV!`)}
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs gap-1.5 cursor-pointer"
              >
                <Download className="size-3.5" /> Export Category Records
              </Button>
            </div>
          </div>

          {/* Category Banner Card */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e1b4b] p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 text-xs px-2.5 py-0.5 font-mono font-bold">
                  {activeCatInfo.code}
                </Badge>

                <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                  {activeCatInfo.floor}
                </Badge>
                <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                  {activeCatInfo.rackRange}
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {selectedCategory} — Records & Volumes Showcase
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Complete catalog directory of book titles, physical accession copies, shelf rack assignments, circulation status, and asset inventory for {selectedCategory}.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-sm self-start md:self-auto">
              <div className="text-center px-3 border-r border-slate-800">
                <p className="text-[0.68rem] text-slate-400 uppercase font-semibold tracking-wider">Titles</p>
                <p className="text-xl font-bold text-white mt-0.5">{categoryStats.totalTitles}</p>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <p className="text-[0.68rem] text-slate-400 uppercase font-semibold tracking-wider">Volumes</p>
                <p className="text-xl font-bold text-blue-400 mt-0.5">{categoryStats.totalCopies}</p>
              </div>
              <div className="text-center px-3">
                <p className="text-[0.68rem] text-slate-400 uppercase font-semibold tracking-wider">Valuation</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">₹{categoryStats.totalValuation.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider">Book Titles</span>
              <BookOpen className="size-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">{categoryStats.totalTitles}</p>
            <p className="text-[0.68rem] text-slate-500 mt-0.5">Master entries</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider">Total Copies</span>
              <Boxes className="size-4 text-indigo-600" />
            </div>
            <p className="text-lg font-bold text-indigo-600">{categoryStats.totalCopies}</p>
            <p className="text-[0.68rem] text-slate-500 mt-0.5">Physical volumes</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider">Available Copies</span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-emerald-600">{categoryStats.availableCopies}</p>
            <p className="text-[0.68rem] text-slate-500 mt-0.5">Ready to borrow</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider">Issued / Loaned</span>
              <Clock className="size-4 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-amber-600">{categoryStats.issuedCopies}</p>
            <p className="text-[0.68rem] text-slate-500 mt-0.5">Currently out</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider">Asset Valuation</span>
              <DollarSign className="size-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">₹{categoryStats.totalValuation.toLocaleString()}</p>
            <p className="text-[0.68rem] text-slate-500 mt-0.5">Catalog replacement value</p>
          </div>
        </div>

        {/* View Switcher & Search Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRecordsViewTab("titles")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  recordsViewTab === "titles"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="size-3.5" /> Book Titles Catalog ({categoryBooks.length})
              </button>
              <button
                onClick={() => setRecordsViewTab("volumes")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  recordsViewTab === "volumes"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Barcode className="size-3.5" /> Physical Volumes & Accession Register ({physicalVolumeCopies.length})
              </button>
            </div>

            {/* Quick Stats Pill */}
            <span className="text-xs text-slate-500 font-medium">
              Showing records for <strong className="text-slate-800">{selectedCategory}</strong>
            </span>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                placeholder="Search title, author, ISBN, accession, barcode..."
                value={recordsSearch}
                onChange={(e) => setRecordsSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl border-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-slate-400 shrink-0" />
              <select
                value={rackFilter}
                onChange={(e) => setRackFilter(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-slate-200 px-3 bg-white text-slate-700 outline-none"
              >
                <option value="all">All Rack Locations</option>
                {uniqueRacks.map((r) => (
                  <option key={r} value={r}>
                    Rack {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-slate-200 px-3 bg-white text-slate-700 outline-none"
              >
                <option value="all">All Circulation Statuses</option>
                <option value="available">Available on Shelf</option>
                <option value="issued">Currently Issued</option>
                <option value="low_stock">Low Stock (&lt; 2 available)</option>
              </select>
            </div>
          </div>
        </div>

        {/* VIEW 1: MASTER BOOK TITLES CATALOG */}
        {recordsViewTab === "titles" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Master Book Titles — {selectedCategory} ({filteredCategoryBooks.length} Titles)
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive listing of all cataloged book titles, call numbers, shelf locations, and volume copy counts.
                </p>
              </div>
            </div>

            {filteredCategoryBooks.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <BookOpen className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-sm">No book titles matched your filter criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try searching another term or resetting filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Accession & Call No</th>
                      <th className="p-3">Book Title & Author(s)</th>
                      <th className="p-3">Publisher & Edition</th>
                      <th className="p-3">Shelf Rack Location</th>
                      <th className="p-3">Volume Copies & Availability</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCategoryBooks.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 align-top font-mono">
                          <Badge variant="outline" className="bg-slate-50 text-slate-800 border-slate-300 text-[0.65rem] font-bold">
                            {b.accessionNo}
                          </Badge>
                          <div className="text-[0.68rem] text-slate-500 mt-1">Call: {b.callNumber}</div>
                          <div className="text-[0.65rem] text-slate-400 font-mono mt-0.5">ISBN: {b.isbn}</div>
                        </td>

                        <td className="p-3 align-top">
                          <div className="font-bold text-slate-900 text-xs mb-0.5 hover:text-blue-600 cursor-pointer">
                            {b.title}
                          </div>
                          <div className="text-xs text-slate-600">
                            {Array.isArray(b.authors) ? b.authors.join(", ") : (b.authors || "Unknown Author")}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {(b.tags || []).map((t, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 text-[0.6rem] px-1.5 py-0.5 rounded font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3 align-top text-slate-600">
                          <div className="font-medium text-slate-800">{b.publisher}</div>
                          <div className="text-[0.7rem] text-slate-500">
                            {b.edition} Ed. &bull; {b.publishedYear}
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          <Badge className="bg-slate-100 text-slate-800 text-[0.68rem] font-semibold border-slate-200">
                            Rack {b.location.rack} ({b.location.shelf})
                          </Badge>
                          <div className="text-[0.68rem] text-slate-500 mt-1">
                            {b.location.building} • {b.location.floor}
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{b.totalCopies} Copies</span>
                            <Badge
                              className={`text-[0.62rem] ${
                                b.availableCopies > 0
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {b.availableCopies} Available
                            </Badge>
                          </div>

                          {/* Availability Progress Bar */}
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${(b.availableCopies / b.totalCopies) * 100}%` }}
                              className="bg-emerald-500 h-full"
                              title={`${b.availableCopies} Available`}
                            />
                            <div
                              style={{ width: `${(b.issuedCopies / b.totalCopies) * 100}%` }}
                              className="bg-blue-500 h-full"
                              title={`${b.issuedCopies} Issued`}
                            />
                            <div
                              style={{ width: `${(b.reservedCopies / b.totalCopies) * 100}%` }}
                              className="bg-amber-500 h-full"
                              title={`${b.reservedCopies} Reserved`}
                            />
                          </div>

                          <div className="text-[0.68rem] text-slate-500 mt-1">
                            {b.issuedCopies} issued &bull; {b.reservedCopies} reserved
                          </div>
                        </td>

                        <td className="p-3 align-top font-medium text-slate-800">
                          ₹{b.price || 500}
                          <div className="text-[0.65rem] text-slate-400">
                            Total: ₹{((b.price || 500) * b.totalCopies).toLocaleString()}
                          </div>
                        </td>

                        <td className="p-3 align-top text-right space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBookCopies(b)}
                            className="h-7 text-xs gap-1 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 rounded-lg cursor-pointer w-full"
                          >
                            <Eye className="size-3" /> View Copies ({b.totalCopies})
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.success(`QR Label for "${b.title}" generated!`)}
                            className="h-6 text-[0.68rem] text-slate-600 hover:text-slate-900 w-full"
                          >
                            <QrCode className="size-3 mr-1" /> Print QR
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PHYSICAL VOLUMES & ACCESSION REGISTER */}
        {recordsViewTab === "volumes" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Physical Volumes & Accession Copy Register ({physicalVolumeCopies.length} Individual Volume Copies)
                </h3>
                <p className="text-xs text-slate-500">
                  Individual physical copy records, barcodes, accession tags, shelf placement, and current borrower assignments.
                </p>
              </div>
            </div>

            {physicalVolumeCopies.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Barcode className="size-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-sm">No volume copy records matched your filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Accession Tag</th>
                      <th className="p-3">Volume Title & Copy #</th>
                      <th className="p-3">Barcode Tag</th>
                      <th className="p-3">Shelf Placement</th>
                      <th className="p-3">Physical Condition</th>
                      <th className="p-3">Circulation Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {physicalVolumeCopies.map((vol) => (
                      <tr key={vol.copyId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">
                          <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[0.68rem] font-mono">
                            {vol.accessionTag}
                          </Badge>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900 text-xs">{vol.bookTitle}</div>
                          <div className="text-[0.7rem] text-slate-500">
                            Copy #{vol.copyIndex} of {vol.totalBookCopies} &bull; {vol.authors[0]}
                          </div>
                        </td>

                        <td className="p-3 font-mono text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Barcode className="size-3.5 text-slate-400" />
                            <span className="text-[0.7rem] font-semibold">{vol.barcode}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-800">Rack {vol.rack}</div>
                          <div className="text-[0.68rem] text-slate-500">
                            Shelf {vol.shelf} &bull; {vol.floor}
                          </div>
                        </td>

                        <td className="p-3">
                          <Badge
                            className={`text-[0.65rem] ${
                              vol.condition === "Mint"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : vol.condition === "Good"
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {vol.condition}
                          </Badge>
                        </td>

                        <td className="p-3">
                          {vol.status === "Available" && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[0.68rem]">
                              Available on Shelf
                            </Badge>
                          )}
                          {vol.status === "Issued" && (
                            <div>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[0.68rem]">
                                Issued: {vol.borrowerName}
                              </Badge>
                              <div className="text-[0.65rem] text-slate-500 mt-0.5">
                                Due: {vol.dueDate} ({vol.borrowerId})
                              </div>
                            </div>
                          )}
                          {vol.status === "Reserved" && (
                            <div>
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[0.68rem]">
                                Reserved: {vol.borrowerName}
                              </Badge>
                            </div>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.success(`Barcode label for ${vol.accessionTag} sent to printer!`)}
                            className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                          >
                            <Printer className="size-3 mr-1" /> Label
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: VIEW ALL PHYSICAL COPIES OF A BOOK */}
        <Dialog open={!!selectedBookCopies} onOpenChange={(open) => !open && setSelectedBookCopies(null)}>
          <DialogContent className="max-w-2xl bg-white rounded-2xl p-6">
            {selectedBookCopies && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="size-5 text-blue-600" />
                    Physical Copies & Accession Details
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Showing all registered physical copies for <strong className="text-slate-800">{selectedBookCopies.title}</strong>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">ISBN:</span>{" "}
                      <strong className="text-slate-800 font-mono">{selectedBookCopies.isbn}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Call No:</span>{" "}
                      <strong className="text-slate-800 font-mono">{selectedBookCopies.callNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span>{" "}
                      <strong className="text-slate-800">
                        Rack {selectedBookCopies.location.rack} ({selectedBookCopies.location.shelf})
                      </strong>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                    {Array.from({ length: selectedBookCopies.totalCopies }).map((_, idx) => {
                      const copyNum = idx + 1;
                      const isIssued = copyNum <= selectedBookCopies.issuedCopies;
                      const isReserved = !isIssued && copyNum === selectedBookCopies.issuedCopies + 1 && selectedBookCopies.reservedCopies > 0;

                      return (
                        <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-blue-700">
                                {selectedBookCopies.accessionNo}-V{copyNum}
                              </span>
                              <Badge variant="outline" className="text-[0.62rem] font-mono">
                                {selectedBookCopies.barcode}-C{copyNum}
                              </Badge>
                            </div>
                            <p className="text-[0.7rem] text-slate-500">
                              Volume Copy #{copyNum} of {selectedBookCopies.totalCopies} &bull; Condition: Mint
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {isIssued ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[0.68rem]">
                                Issued (B VISHNU VARDHAN)
                              </Badge>
                            ) : isReserved ? (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[0.68rem]">
                                Reserved
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[0.68rem]">
                                Available on Shelf
                              </Badge>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toast.success(`Barcode printed for copy V${copyNum}`)}
                              className="h-7 text-xs text-slate-600 hover:text-slate-900"
                            >
                              <Printer className="size-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBookCopies(null)}
                    className="rounded-xl text-xs"
                  >
                    Close Window
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL 2: ADD BOOK TITLE DIRECTLY TO THIS CATEGORY */}
        <Dialog open={isAddBookInCatOpen} onOpenChange={setIsAddBookInCatOpen}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="size-5 text-blue-600" />
                Add Book Title to {selectedCategory}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Register a new book title and allocate volume copies to this catalog category.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddBookToCategory} className="space-y-3 my-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Book Title *</label>
                <Input
                  required
                  placeholder="e.g. Cloud Computing Architecture"
                  value={newCatBook.title}
                  onChange={(e) => setNewCatBook({ ...newCatBook, title: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Author Name *</label>
                  <Input
                    required
                    placeholder="e.g. Rajkumar Buyya"
                    value={newCatBook.author}
                    onChange={(e) => setNewCatBook({ ...newCatBook, author: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ISBN Number</label>
                  <Input
                    placeholder="978-0128000571"
                    value={newCatBook.isbn}
                    onChange={(e) => setNewCatBook({ ...newCatBook, isbn: e.target.value })}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rack ID</label>
                  <Input
                    placeholder="CS-01"
                    value={newCatBook.rack}
                    onChange={(e) => setNewCatBook({ ...newCatBook, rack: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Copies / Volumes *</label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={newCatBook.copies}
                    onChange={(e) => setNewCatBook({ ...newCatBook, copies: Number(e.target.value) })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price per Book (₹)</label>
                  <Input
                    type="number"
                    value={newCatBook.price}
                    onChange={(e) => setNewCatBook({ ...newCatBook, price: Number(e.target.value) })}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Publisher</label>
                  <Input
                    placeholder="Pearson / McGraw-Hill"
                    value={newCatBook.publisher}
                    onChange={(e) => setNewCatBook({ ...newCatBook, publisher: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddBookInCatOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs">
                  Register Book & Volumes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e1b4b] p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 text-[0.68rem] px-2 py-0.5">
              AI CATALOG ENGINE V4.5
            </Badge>
            <span className="text-xs text-slate-300">Dewey Decimal 23rd Ed. Sync</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Catalog & Physical Shelf Management</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            A to Z enterprise management of book taxonomies, volume accessions, authors, physical rack occupancy, barcode stickers, and AI metadata sync.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddCatOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs gap-1.5 font-medium cursor-pointer"
          >
            <Plus className="size-3.5" /> Add Category
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Master catalog exported to CSV!")}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white rounded-xl text-xs gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" /> Export Catalog
          </Button>
        </div>
      </div>

      {/* AI Catalog Health & Indexer Widget Bar */}
      <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 border border-blue-200/60 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-xs">AI Smart Catalog Health Score: 99.4%</h4>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[0.62rem] font-semibold">
                Clean Index
              </Badge>
            </div>
            <p className="text-[0.7rem] text-slate-600 mt-0.5">
              All {state.books.length} titles & {categoriesData.reduce((acc, c) => acc + c.booksCount, 0)} physical volume copies mapped with Dewey Decimal tags & accession barcodes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("AI Catalog Scan Completed! All titles & accession barcodes verified clean.")}
            className="h-8 text-xs font-semibold rounded-xl bg-white border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer gap-1.5"
          >
            <RefreshCw className="size-3" /> Run AI Indexing Scan
          </Button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Categories & Subjects", icon: Layers },
          { id: "authors", label: "Authors Directory", icon: Users },
          { id: "publishers", label: "Publishers", icon: Building2 },
          { id: "locations", label: "Building, Floor & Racks", icon: MapPin },
          { id: "barcodes", label: "Barcode & QR Generator", icon: Barcode },
          { id: "bulk", label: "Bulk Import / Export", icon: Upload },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      {activeSubTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoriesData.map((cat) => (
              <div
                key={cat.code}
                onClick={() => setSelectedCategory(cat.name)}
                className="p-4 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-slate-100 text-slate-700 text-[0.65rem] font-bold font-mono">
                    {cat.code}
                  </Badge>
                  <span className="text-[0.7rem] text-slate-500">{cat.floor}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3">Location: {cat.rackRange}</p>

                {/* Occupancy meter bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[0.65rem] text-slate-500 font-medium">
                    <span>Shelf Occupancy</span>
                    <span className="text-blue-600 font-bold">{Math.min(90, cat.booksCount * 4)}% Capacity</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(90, cat.booksCount * 4)}%` }}
                      className="bg-blue-600 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-slate-700 font-bold">
                    {cat.booksCount.toLocaleString()} Volumes ({cat.titlesCount} Titles)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(cat.name);
                    }}
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold px-2 rounded-lg cursor-pointer"
                  >
                    Manage Records &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "authors" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Author Registry ({authorsData.length} Authors)</h3>
              <p className="text-xs text-slate-500">Master index of authors, top titles, and published library copies.</p>
            </div>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
              {authorsData.reduce((acc, a) => acc + a.booksCount, 0)} Total Copies Cataloged
            </Badge>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {authorsData.map((auth, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{auth.name}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Top Title: <strong className="text-slate-700">{auth.topTitle}</strong> &bull; {auth.nationality}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                    {auth.booksCount} Copies
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info(`Filtered catalog for author ${auth.name}`)}
                    className="h-7 text-xs text-slate-600 hover:text-slate-900"
                  >
                    View Titles &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "publishers" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Publisher Directory ({publishersData.length} Publishers)</h3>
            <p className="text-xs text-slate-500">Registered publishing partners, contact emails, and total stock volume.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishersData.map((pub, idx) => (
              <div key={idx} className="p-4 border border-slate-200 hover:border-blue-300 rounded-xl space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">{pub.name}</h5>
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono">{pub.country}</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono">Contact: {pub.contact}</p>
                <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
                  <span className="text-blue-600 font-bold">{pub.titlesCount} Copies in Stock</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info(`Viewing stock for ${pub.name}`)}
                    className="h-6 text-[0.7rem] text-slate-600 hover:text-slate-900 p-0"
                  >
                    View Books &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "locations" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Shelf & Rack Physical Matrix</h3>
              <p className="text-xs text-slate-500">Building, floor, rack codes, total capacity, and occupancy distribution.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Physical rack matrix refreshed!")}
              className="text-xs rounded-xl gap-1.5"
            >
              <RefreshCw className="size-3.5" /> Refresh Racks
            </Button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Building</th>
                  <th className="p-3">Floor</th>
                  <th className="p-3">Rack ID</th>
                  <th className="p-3">Shelf Code</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shelfLocations.map((loc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">{loc.building}</td>
                    <td className="p-3 text-slate-600">{loc.floor}</td>
                    <td className="p-3 font-mono font-bold text-blue-600">{loc.rack}</td>
                    <td className="p-3 text-slate-700 font-mono">{loc.shelf}</td>
                    <td className="p-3 text-slate-600">{loc.capacity} Books</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">{loc.occupied}</span> / {loc.capacity}
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(loc.occupied / loc.capacity) * 100}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[0.7rem] rounded-lg cursor-pointer"
                        onClick={() => toast.info(`Rack ${loc.rack} verified!`)}
                      >
                        Audit Shelf
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "barcodes" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Barcode className="size-5 text-blue-600" />
                Barcode & QR Code Label Studio
              </h3>
              <p className="text-xs text-slate-500">
                Generate and batch-print high-density Code128 / Code39 barcode stickers and QR accession labels.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer font-medium"
              >
                <Printer className="size-3.5" /> Batch Print Barcode Stickers
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {state.books.slice(0, 6).map((b) => (
              <div
                key={b.id}
                className="p-4 border border-dashed border-slate-300 rounded-2xl text-center space-y-2.5 bg-slate-50/70 hover:border-blue-400 hover:bg-white transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-bold text-blue-700 uppercase font-mono">{state.settings.libraryName || "GMRIT LIBRARY"}</span>
                  <Badge variant="outline" className="text-[0.6rem] font-mono bg-white">
                    {b.category}
                  </Badge>
                </div>

                <div className="font-mono font-extrabold text-slate-900 text-sm tracking-tight">{b.accessionNo}</div>

                {/* Simulated Barcode Banner */}
                <div className="h-12 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white px-2 py-1 space-y-0.5">
                  <div className="text-[0.65rem] tracking-widest font-mono text-slate-300">
                    |||||||||||||| {b.barcode} ||||||||||||||
                  </div>
                  <div className="text-[0.58rem] font-mono text-slate-400">{b.isbn}</div>
                </div>

                <div className="text-[0.68rem] text-slate-600 truncate font-medium">
                  Call: <strong className="font-mono text-slate-800">{b.callNumber}</strong> &bull; {b.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "bulk" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Upload className="size-5 text-emerald-600" />
                Bulk Catalog Importer (CSV Parser)
              </h3>
              <p className="text-xs text-slate-500">
                Paste structured CSV catalog records below to parse, validate, and bulk-insert books and volume accessions into the central catalog.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setBulkCsvText(
                  "Title,Author,ISBN,Category,Rack,TotalCopies,Price\nData Structures and Algorithms,Mark Allen Weiss,978-0132847377,Computer Science,CS-Rack-01,10,950\nOperating System Concepts,Abraham Silberschatz,978-1118063330,Computer Science,CS-Rack-02,8,880"
                )
              }
              className="text-xs rounded-xl"
            >
              Load Sample CSV
            </Button>
          </div>

          <textarea
            rows={6}
            value={bulkCsvText}
            onChange={(e) => setBulkCsvText(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Expected Format: <code className="text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">Title,Author,ISBN,Category,Rack,TotalCopies,Price</code>
            </span>
            <Button onClick={handleBulkImport} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer font-medium">
              <Upload className="size-3.5" /> Parse & Register Batch
            </Button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog open={isAddCatOpen} onOpenChange={setIsAddCatOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="size-5 text-blue-600" /> Add New Category
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Register a new library taxonomy category and physical shelf assignment code.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category Name *</label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g. Artificial Intelligence"
                required
                className="rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Classification Code *</label>
                <Input
                  value={newCategory.code}
                  onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                  placeholder="e.g. AI-70"
                  required
                  className="rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={newCategory.department}
                  onChange={(e) => setNewCategory({ ...newCategory, department: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 bg-white text-slate-700 text-xs outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddCatOpen(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs">
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 2. ACQUISITION MODULE VIEW                                                  */
/* ========================================================================== */
export function AcquisitionModuleView() {
  const { state, dispatch } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<"requests" | "vendors" | "orders" | "receiving" | "donations" | "budget">("requests");

  const [isAddReqOpen, setIsAddReqOpen] = useState(false);
  const [newReq, setNewReq] = useState({
    title: "",
    author: "",
    isbn: "",
    dept: "Computer Science",
    requestedBy: "Dr. P. Ramana",
    qty: 5,
    estCost: 10000,
    justification: "Required for curriculum update",
  });

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "ADD_ACQUISITION",
      payload: {
        title: newReq.title,
        authors: [newReq.author],
        isbn: newReq.isbn,
        quantity: Number(newReq.qty),
        estimatedCost: Number(newReq.estCost),
        requestedBy: newReq.requestedBy,
        requestedByRole: "Faculty",
        department: newReq.dept,
        justification: newReq.justification,
      },
    });
    setIsAddReqOpen(false);
    setNewReq({ title: "", author: "", isbn: "", dept: "Computer Science", requestedBy: "Dr. P. Ramana", qty: 5, estCost: 10000, justification: "Required for curriculum update" });
  };

  const handleStatusChange = (id: string, status: any) => {
    dispatch({
      type: "UPDATE_ACQUISITION_STATUS",
      payload: { id, status, by: "Librarian" },
    });
  };

  const vendors = [
    { id: "VEN-01", name: "Oxford Book Depot", contact: "+91 98480 12345", city: "Visakhapatnam", rating: "4.8 ★", discount: "22%" },
    { id: "VEN-02", name: "Pearson India Dist.", contact: "+91 91234 56789", city: "Hyderabad", rating: "4.6 ★", discount: "25%" },
    { id: "VEN-03", name: "Higginbothams Pvt Ltd", contact: "+91 94401 98765", city: "Chennai", rating: "4.9 ★", discount: "20%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            ACQUISITION & PROCUREMENT
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Book Acquisition & Vendor Management</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Manage purchase recommendations, vendor purchase orders, book receiving (GRN), gifts/donations, and annual library budget tracking.
          </p>
        </div>
        <Button onClick={() => setIsAddReqOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          <Plus className="size-3.5" /> Request New Title
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "requests", label: "Purchase Requests", icon: FileText },
          { id: "vendors", label: "Vendor Directory", icon: Building2 },
          { id: "orders", label: "Purchase Orders (POs)", icon: ShoppingCart },
          { id: "receiving", label: "Book Receiving & GRN", icon: Boxes },
          { id: "donations", label: "Donations & Gifts", icon: Bookmark },
          { id: "budget", label: "Budget Allocation", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "requests" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Faculty & Department Book Recommendations ({state.acquisitions.length} Requests)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                <th className="p-3">Req ID</th>
                <th className="p-3">Book Title & Author</th>
                <th className="p-3">Department</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Est. Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.acquisitions.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{req.id}</td>
                  <td className="p-3 font-medium text-slate-900">{req.title} <span className="text-slate-400 font-normal">({Array.isArray((req as any).authors) ? (req as any).authors.join(", ") : (req.author || (req as any).authors || "Unknown Author")})</span></td>
                  <td className="p-3 text-slate-600">{req.department}</td>
                  <td className="p-3 text-slate-700">{req.requestedBy}</td>
                  <td className="p-3 font-bold text-slate-800">{req.quantity}</td>
                  <td className="p-3 font-medium text-emerald-600">₹ {req.estimatedCost.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge className={req.status === "Approved" ? "bg-emerald-100 text-emerald-700" : req.status === "PORaised" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right flex gap-1.5 justify-end">
                    {req.status === "Requested" && (
                      <>
                        <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-emerald-600 text-white" onClick={() => handleStatusChange(req.id, "Approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200" onClick={() => handleStatusChange(req.id, "Rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
                    {req.status === "Approved" && (
                      <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-blue-600 text-white" onClick={() => handleStatusChange(req.id, "PORaised")}>
                        Generate PO
                      </Button>
                    )}
                    {req.status === "PORaised" && (
                      <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-indigo-600 text-white" onClick={() => handleStatusChange(req.id, "Supplied")}>
                        Receive Books
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Acquisition Request Dialog */}
      <Dialog open={isAddReqOpen} onOpenChange={setIsAddReqOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Recommend New Book for Purchase</DialogTitle>
            <DialogDescription className="text-xs">Submit book details for department acquisition review.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRequest} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Book Title *</label>
              <Input required value={newReq.title} onChange={(e) => setNewReq({ ...newReq, title: e.target.value })} placeholder="e.g. Deep Learning Applications" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Author *</label>
                <Input required value={newReq.author} onChange={(e) => setNewReq({ ...newReq, author: e.target.value })} placeholder="e.g. Ian Goodfellow" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ISBN</label>
                <Input value={newReq.isbn} onChange={(e) => setNewReq({ ...newReq, isbn: e.target.value })} placeholder="978-0262035613" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Quantity *</label>
                <Input type="number" required value={newReq.qty} onChange={(e) => setNewReq({ ...newReq, qty: Number(e.target.value) })} />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Est. Cost (₹) *</label>
                <Input type="number" required value={newReq.estCost} onChange={(e) => setNewReq({ ...newReq, estCost: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Department</label>
              <select value={newReq.dept} onChange={(e) => setNewReq({ ...newReq, dept: e.target.value })} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs">
                <option>Computer Science</option>
                <option>CSE (AI&ML)</option>
                <option>Electronics & Comm.</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddReqOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 text-white">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {activeTab === "vendors" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <div key={v.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-slate-100 text-slate-700 text-[0.65rem] font-mono">{v.id}</Badge>
                <span className="text-xs font-bold text-amber-600">{v.rating}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
              <p className="text-xs text-slate-500">City: {v.city} &bull; Contact: {v.contact}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold">Standard Discount: {v.discount}</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">View POs &rarr;</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "budget" && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Annual Library Budget Utilization (2026-27)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">Total Sanctioned Budget</p>
              <p className="text-2xl font-bold text-slate-900">₹ 25,00,000</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-700">Spent / Committed</p>
              <p className="text-2xl font-bold text-emerald-700">₹ 14,20,000</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700">Balance Unallocated</p>
              <p className="text-2xl font-bold text-blue-700">₹ 10,80,000</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. INVENTORY & STOCK AUDIT MODULE VIEW                                      */
/* ========================================================================== */
export function InventoryModuleView() {
  const [auditLogs, setAuditLogs] = useState([
    { id: "AUD-801", rack: "CS-Rack-04", scannedCount: 42, totalExpected: 45, missingCount: 3, auditDate: "Aug 01, 2026", auditor: "Head Librarian" },
    { id: "AUD-802", rack: "EC-Rack-02", scannedCount: 38, totalExpected: 38, missingCount: 0, auditDate: "Jul 28, 2026", auditor: "Asst. Librarian" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            INVENTORY & STOCK AUDIT
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Stock Audit & Shelf Verification</h2>
          <p className="text-xs text-purple-100 mt-1 max-w-xl">
            Perform physical barcode inventory verification, shelf audit reconciliations, missing book flags, and damaged copy logs.
          </p>
        </div>
        <Button onClick={() => toast.success("Live Barcode Scanner Initialized!")} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          <Barcode className="size-3.5" /> Launch Audit Scanner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Total Audited Racks" value="48 / 60" delta="+12 this month" icon={Boxes} />
        <KpiCard label="Verified Stock Rate" value="98.4%" delta="0.2% variance" tone="success" icon={CheckCircle2} />
        <KpiCard label="Flagged Missing Copies" value="14" delta="Needs reconciliation" tone="warning" icon={AlertTriangle} />
        <KpiCard label="Damaged Copies Logged" value="8" delta="Sent for binding" icon={FileText} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Recent Audit Sessions</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Audit ID</th>
              <th className="p-3">Rack Code</th>
              <th className="p-3">Scanned / Expected</th>
              <th className="p-3">Discrepancy (Missing)</th>
              <th className="p-3">Audit Date</th>
              <th className="p-3">Auditor</th>
              <th className="p-3 text-right">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{log.id}</td>
                <td className="p-3 font-bold text-blue-600">{log.rack}</td>
                <td className="p-3 text-slate-700">{log.scannedCount} / {log.totalExpected}</td>
                <td className="p-3">
                  {log.missingCount > 0 ? (
                    <Badge className="bg-rose-100 text-rose-700 font-bold">{log.missingCount} Missing</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 font-bold">100% Match</Badge>
                  )}
                </td>
                <td className="p-3 text-slate-600">{log.auditDate}</td>
                <td className="p-3 text-slate-700">{log.auditor}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 4. READING HALL MANAGEMENT VIEW                                             */
/* ========================================================================== */
export function ReadingHallView() {
  const { state, dispatch } = useLibraryStore();

  const occupiedCount = state.seats.filter((s) => s.status === "Occupied").length;
  const availableCount = state.seats.length - occupiedCount;

  const handleSeatClick = (seat: (typeof state.seats)[0]) => {
    if (seat.status === "Occupied") {
      dispatch({ type: "EXIT_SEAT", payload: { seatNo: seat.seatNo, by: "Librarian" } });
    } else {
      const activeMember = state.members.find((m) => m.status === "Active") || state.members[0];
      dispatch({ type: "ALLOCATE_SEAT", payload: { seatNo: seat.seatNo, memberId: activeMember.id, verifiedBy: "Librarian" } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-sky-500/30 text-sky-200 border-sky-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            READING HALL & SEATING
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Reading Hall Occupancy & Seat Matrix</h2>
          <p className="text-xs text-sky-100 mt-1 max-w-xl">
            Real-time seat allocation, silent reading zone occupancy, gate check-in seat reservations, and daily hall traffic stats.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 text-white font-bold text-xs px-3 py-1">
            Available: {availableCount} / {state.seats.length} Seats
          </Badge>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Live Interactive Seat Matrix (Click seat to allocate/free)</h3>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-700"><span className="size-3 rounded-full bg-emerald-500 inline-block"></span> Available</span>
            <span className="flex items-center gap-1 text-rose-700"><span className="size-3 rounded-full bg-rose-500 inline-block"></span> Occupied</span>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {state.seats.map((seat) => (
            <button
              key={seat.seatNo}
              onClick={() => handleSeatClick(seat)}
              className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                seat.status === "Occupied"
                  ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <Armchair className="size-5 mx-auto mb-1" />
              <div className="font-bold text-xs">Seat {seat.seatNo}</div>
              <div className="text-[0.65rem] truncate">{seat.status === "Occupied" ? seat.memberName || "Occupied" : "Free"}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Today's Reading Hall Access Ledger</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Log ID</th>
              <th className="p-3">Seat & Zone</th>
              <th className="p-3">Member Name & ID</th>
              <th className="p-3">Entry Time</th>
              <th className="p-3">Exit Time</th>
              <th className="p-3">Verified By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.seatBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{b.id}</td>
                <td className="p-3 font-bold text-blue-600">Seat {b.seatNo} (Zone {b.zone})</td>
                <td className="p-3 font-medium text-slate-900">{b.memberName} <span className="text-slate-400 font-normal">({b.memberSourceId})</span></td>
                <td className="p-3 text-slate-700">{new Date(b.entryTime).toLocaleTimeString("en-IN")}</td>
                <td className="p-3 text-slate-600">{b.exitTime ? new Date(b.exitTime).toLocaleTimeString("en-IN") : <Badge className="bg-amber-100 text-amber-700">Currently Inside</Badge>}</td>
                <td className="p-3 text-slate-500">{b.verifiedBy || "Gate Scanner"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. LIBRARY ENTRY & GATE MANAGEMENT VIEW                                    */
/* ========================================================================== */
export function LibraryEntryView() {
  const { state, dispatch } = useLibraryStore();
  const [scanMemberId, setScanMemberId] = useState("");
  const [scanMethod, setScanMethod] = useState<"RFID" | "QR" | "Barcode">("RFID");

  const handleScanEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const member = state.members.find(
      (m) =>
        m.id === scanMemberId ||
        m.memberId.toLowerCase() === scanMemberId.toLowerCase() ||
        m.sourceId.toLowerCase() === scanMemberId.toLowerCase()
    ) || state.members[0];

    try {
      dispatch({
        type: "RECORD_ENTRY",
        payload: { memberId: member.id, method: scanMethod, by: "Gate Scanner" },
      });
      setScanMemberId("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRecordExit = (memberId: string) => {
    dispatch({ type: "RECORD_EXIT", payload: { memberId } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            GATE LOG & ENTRY SCANNER
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Library Gate Entry & Visitor Footfall</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor real-time QR / RFID gate entries, exit timestamps, student visit frequency, and hourly visitor analytics.
          </p>
        </div>
      </div>

      {/* Live Gate Check-in Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Gate Scan Entrance Terminal</h3>
        <form onSubmit={handleScanEntry} className="flex flex-col sm:flex-row gap-3">
          <select
            value={scanMethod}
            onChange={(e) => setScanMethod(e.target.value as any)}
            className="h-10 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50"
          >
            <option value="RFID">RFID Scanner</option>
            <option value="QR">QR Code Scanner</option>
            <option value="Barcode">Barcode Scanner</option>
            <option value="Manual">Manual ID</option>
          </select>
          <Input
            value={scanMemberId}
            onChange={(e) => setScanMemberId(e.target.value)}
            placeholder="Scan RFID Tag or Enter Member ID / Roll No (e.g. 23341A4219)..."
            className="h-10 text-xs flex-1"
          />
          <Button type="submit" className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <QrCode className="size-3.5" /> Record Gate Entry
          </Button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Today's Live Gate Entry Stream ({state.entryLogs.length} Visits Today)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Entry Log ID</th>
              <th className="p-3">Member Roll / Emp ID</th>
              <th className="p-3">Member Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Entry Time</th>
              <th className="p-3">Exit Time</th>
              <th className="p-3">Mode</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.entryLogs.map((ent) => (
              <tr key={ent.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{ent.id}</td>
                <td className="p-3 font-bold text-blue-600">{ent.memberSourceId}</td>
                <td className="p-3 font-medium text-slate-900">{ent.memberName}</td>
                <td className="p-3 text-slate-600">{ent.memberType}</td>
                <td className="p-3 font-semibold text-emerald-600">{new Date(ent.entryTime).toLocaleTimeString("en-IN")}</td>
                <td className="p-3 text-slate-500">{ent.exitTime ? new Date(ent.exitTime).toLocaleTimeString("en-IN") : <Badge className="bg-amber-100 text-amber-700">Inside</Badge>}</td>
                <td className="p-3">
                  <Badge className="bg-slate-100 text-slate-700">{ent.entryMethod}</Badge>
                </td>
                <td className="p-3 text-right">
                  {!ent.exitTime && (
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200" onClick={() => handleRecordExit(ent.memberId)}>
                      Record Exit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 6. RESERVATION MANAGEMENT VIEW                                             */
/* ========================================================================== */
export function ReservationManagementView() {
  const { state, dispatch } = useLibraryStore();
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [reserveBookId, setReserveBookId] = useState(state.books[0]?.id || "");
  const [reserveMemberId, setReserveMemberId] = useState(state.members[0]?.id || "");

  const handlePlaceReservation = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({
        type: "PLACE_RESERVATION",
        payload: { bookId: reserveBookId, memberId: reserveMemberId },
      });
      setIsReserveOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = (id: string) => {
    dispatch({ type: "CANCEL_RESERVATION", payload: { id, by: "Librarian" } });
  };

  const handleCollect = (id: string) => {
    dispatch({ type: "COLLECT_RESERVATION", payload: { id, by: "Librarian" } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            RESERVATIONS & HOLDS
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Book Hold Queue & Auto Allocation</h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            Track student book reservations, waiting priority queues, hold expiration countdowns, and automated return allocation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsReserveOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <Plus className="size-3.5" /> Reserve Book
          </Button>
          <Button onClick={() => toast.success("Auto-allocation scan completed!")} className="bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <RotateCcw className="size-3.5" /> Trigger Auto Allocation
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Active Reservation Queue ({state.reservations.length} Active Holds)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Hold ID</th>
              <th className="p-3">Book Title</th>
              <th className="p-3">Reserved By</th>
              <th className="p-3">Queue Pos</th>
              <th className="p-3">Reserved Date</th>
              <th className="p-3">Expiry Deadline</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.reservations.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{res.id}</td>
                <td className="p-3 font-medium text-slate-900">{res.bookTitle}</td>
                <td className="p-3 text-slate-700">{res.memberName}</td>
                <td className="p-3 font-bold text-blue-600">#{res.queuePosition}</td>
                <td className="p-3 text-slate-500">{new Date(res.reservedAt).toLocaleDateString("en-IN")}</td>
                <td className="p-3 text-rose-600 font-medium">{res.expiryDate}</td>
                <td className="p-3">
                  <Badge className={res.status === "Ready" ? "bg-emerald-100 text-emerald-700 font-bold" : res.status === "Collected" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}>
                    {res.status}
                  </Badge>
                </td>
                <td className="p-3 text-right flex gap-1.5 justify-end">
                  {res.status === "Ready" && (
                    <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-emerald-600 text-white" onClick={() => handleCollect(res.id)}>
                      Collect Book
                    </Button>
                  )}
                  {res.status === "Pending" && (
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200" onClick={() => handleCancel(res.id)}>
                      Cancel Hold
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Place Reservation Dialog */}
      <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Place Book Reservation Hold</DialogTitle>
            <DialogDescription className="text-xs">Reserve an out-of-stock title for a member.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlaceReservation} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Book Title *</label>
              <select value={reserveBookId} onChange={(e) => setReserveBookId(e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs">
                {state.books.map((b) => (
                  <option key={b.id} value={b.id}>{b.title} (Available: {b.availableCopies})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Member *</label>
              <select value={reserveMemberId} onChange={(e) => setReserveMemberId(e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs">
                {state.members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.sourceId} - {m.type})</option>
                ))}
              </select>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsReserveOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-amber-600 text-white">Confirm Hold</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 7. GLOBAL SEARCH SYSTEM VIEW                                                */
/* ========================================================================== */
export function GlobalLibrarySearchView() {
  const { state } = useLibraryStore();
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.books;
    return state.books.filter((b) => {
      if (searchField === "Title") return b.title.toLowerCase().includes(q);
      if (searchField === "Author") return (Array.isArray(b.authors) ? b.authors : [b.authors || ""]).some((a) => a?.toLowerCase().includes(q));
      if (searchField === "ISBN") return b.isbn.toLowerCase().includes(q);
      if (searchField === "Accession") return b.accessionNo.toLowerCase().includes(q);
      if (searchField === "Category") return b.category.toLowerCase().includes(q);
      return (
        b.title.toLowerCase().includes(q) ||
        (Array.isArray(b.authors) ? b.authors : [b.authors || ""]).some((a) => a?.toLowerCase().includes(q)) ||
        b.isbn.toLowerCase().includes(q) ||
        b.accessionNo.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.barcode.toLowerCase().includes(q) ||
        `${b.location.rack}-${b.location.shelf}`.toLowerCase().includes(q)
      );
    });
  }, [query, searchField, state.books]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-2xl text-white shadow-xl space-y-4">
        <div>
          <Badge className="bg-blue-400/30 text-blue-200 border-blue-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            ENTERPRISE SEARCH ENGINE
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Global Multi-Criteria Library Search</h2>
          <p className="text-xs text-blue-100 mt-1">
            Search across Title, Author, ISBN, Barcode, QR Code, Publisher, Subject, Category, Shelf, Rack, Accession No, or Call No.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="h-11 bg-white/10 text-white rounded-xl text-xs px-3 border border-white/20 focus:outline-none"
          >
            <option value="All" className="text-slate-900">All Fields</option>
            <option value="Title" className="text-slate-900">Title</option>
            <option value="Author" className="text-slate-900">Author</option>
            <option value="ISBN" className="text-slate-900">ISBN</option>
            <option value="Accession" className="text-slate-900">Accession No</option>
            <option value="Category" className="text-slate-900">Category</option>
          </select>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Title, Author, ISBN (978...), Accession (GMRIT/2024/...), Rack (CS-01)..."
            className="h-11 bg-white text-slate-900 rounded-xl text-sm placeholder:text-slate-400 flex-1"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Search Results ({results.length} Titles Found)
          </h3>
          {query && (
            <Badge className="bg-blue-50 text-blue-700">Filter: "{query}"</Badge>
          )}
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Accession & ISBN</th>
              <th className="p-3">Title & Authors</th>
              <th className="p-3">Category / Subject</th>
              <th className="p-3">Location (Rack/Shelf)</th>
              <th className="p-3 text-center">Available / Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">
                  {b.accessionNo}
                  <div className="text-[0.65rem] text-slate-400 font-normal">ISBN: {b.isbn}</div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{b.title}</div>
                  <div className="text-slate-500 text-[0.7rem]">
                    {Array.isArray(b.authors) ? b.authors.join(", ") : (b.authors || "Unknown Author")}
                  </div>
                </td>
                <td className="p-3 text-slate-700">
                  {b.category}
                  <div className="text-slate-400 text-[0.65rem]">{b.subject}</div>
                </td>
                <td className="p-3 text-slate-600 font-mono">
                  {b.location.rack} — {b.location.shelf}
                </td>
                <td className="p-3 text-center font-bold text-slate-800">
                  <span className={b.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"}>
                    {b.availableCopies}
                  </span>{" "}
                  / {b.totalCopies}
                </td>
                <td className="p-3">
                  <Badge className={b.availableCopies > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                    {b.availableCopies > 0 ? "Available" : "All Issued"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 8. AUDIT LOGS MODULE VIEW                                                  */
/* ========================================================================== */
export function AuditLogsView() {
  const { state } = useLibraryStore();
  const auditLogs = state.auditLogs;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-slate-700 text-slate-200 border-slate-600 text-[0.68rem] px-2 py-0.5 mb-1">
            SYSTEM AUDIT LOGS
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">System Security & Activity Audit Trail</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Complete compliance trail logging all book modifications, issues, returns, fine receipts, user logins, and settings updates.
          </p>
        </div>
        <Button onClick={() => toast.success("Audit Log Exported to CSV!")} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          <Download className="size-3.5" /> Export Audit Trail
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">System Audit Ledger ({auditLogs.length} Records)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Log ID</th>
              <th className="p-3">Module</th>
              <th className="p-3">User & Role</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{log.id}</td>
                <td className="p-3 font-medium text-slate-700">{log.module}</td>
                <td className="p-3 text-slate-800 font-medium">{log.userName} <span className="text-slate-400 text-[0.7rem]">({log.role})</span></td>
                <td className="p-3">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">{log.action}</Badge>
                </td>
                <td className="p-3 text-slate-600">{log.description}</td>
                <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString("en-IN")}</td>
                <td className="p-3 font-mono text-slate-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 9. CIRCULATION ENHANCEMENTS VIEW                                           */
/* ========================================================================== */
export function CirculationEnhancementsView() {
  const { state, dispatch } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<"renew" | "lost" | "history">("renew");

  const activeIssues = useMemo(() => state.issues.filter((i) => i.status === "Active" || i.status === "Renewed" || i.status === "Overdue"), [state.issues]);
  const historyIssues = useMemo(() => state.issues.filter((i) => i.status === "Returned"), [state.issues]);
  const lostIssues = useMemo(() => state.issues.filter((i) => i.status === "Lost"), [state.issues]);

  const handleRenew = (issueId: string) => {
    try {
      dispatch({ type: "RENEW_BOOK", payload: { issueId, renewedBy: "Librarian" } });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReturn = (issueId: string, condition: "Good" | "Damaged" | "Lost") => {
    dispatch({ type: "RETURN_BOOK", payload: { issueId, condition, receivedBy: "Librarian" } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-violet-500/30 text-violet-200 border-violet-400/30 text-[0.68rem] px-2 py-0.5 mb-1">
            CIRCULATION DESK
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Circulation Enhancements</h2>
          <p className="text-xs text-violet-100 mt-1 max-w-xl">
            Manage book renewals, reservations, waiting queues, lost book tracking, damage assessment, and complete borrow history logs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "renew", label: "Renewals & Extensions", icon: RotateCcw },
          { id: "lost", label: "Lost & Damaged Books", icon: AlertTriangle },
          { id: "history", label: "Borrow History Log", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active ? "bg-violet-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "renew" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Active Borrow Logs & Extensions ({activeIssues.length} Active Issues)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                <th className="p-3">Issue ID</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Borrower</th>
                <th className="p-3">Current Due Date</th>
                <th className="p-3">Renewals</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeIssues.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{r.id}</td>
                  <td className="p-3 font-medium text-slate-900">{r.bookTitle}</td>
                  <td className="p-3 text-slate-700">{r.memberName} <span className="text-slate-400">({r.memberSourceId})</span></td>
                  <td className="p-3 text-slate-600">{r.dueDate}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{r.renewCount} / {r.maxRenewals}</td>
                  <td className="p-3">
                    <Badge className={new Date(r.dueDate) < new Date() ? "bg-rose-100 text-rose-700 font-bold" : "bg-blue-100 text-blue-700"}>
                      {new Date(r.dueDate) < new Date() ? "Overdue" : r.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right flex gap-1.5 justify-end">
                    <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-emerald-600 text-white" onClick={() => handleReturn(r.id, "Good")}>
                      Return Book
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg" onClick={() => handleRenew(r.id)}>
                      Renew +14d
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200" onClick={() => handleReturn(r.id, "Lost")}>
                      Mark Lost
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "lost" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Lost & Damaged Book Register ({lostIssues.length} Records)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                <th className="p-3">Issue ID</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Responsible Member</th>
                <th className="p-3">Date Returned</th>
                <th className="p-3">Condition</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lostIssues.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{l.id}</td>
                  <td className="p-3 font-medium text-slate-900">{l.bookTitle}</td>
                  <td className="p-3 text-slate-700">{l.memberName} ({l.memberSourceId})</td>
                  <td className="p-3 text-slate-600">{l.returnedAt ? new Date(l.returnedAt).toLocaleDateString("en-IN") : "--"}</td>
                  <td className="p-3 font-bold text-rose-600">{l.returnCondition || "Lost"}</td>
                  <td className="p-3">
                    <Badge className="bg-rose-100 text-rose-700">Lost</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200" onClick={() => toast.info("Replacement fine levied!")}>
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Complete Borrow Transaction History</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                <th className="p-3">History ID</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Member</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Return Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {borrowHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{h.id}</td>
                  <td className="p-3 font-medium text-slate-900">{h.book}</td>
                  <td className="p-3 text-slate-700">{h.borrower} <span className="text-slate-400">({h.rollNo})</span></td>
                  <td className="p-3 text-slate-600">{h.issued}</td>
                  <td className="p-3 text-slate-600">{h.returned}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-100 text-emerald-700">{h.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 10. ENHANCED FINE MANAGEMENT VIEW                                          */
/* ========================================================================== */
export function EnhancedFineManagementView() {
  const { state, dispatch, stats } = useLibraryStore();
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<typeof state.fines[0] | null>(null);
  const [waiverReason, setWaiverReason] = useState("Principal Medical Waiver Approval");

  const handleCollect = (fineId: string, amount: number) => {
    dispatch({ type: "COLLECT_FINE", payload: { fineId, amount, by: "Librarian" } });
  };

  const handleApproveWaiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFine) return;
    dispatch({ type: "WAIVE_FINE", payload: { fineId: selectedFine.id, reason: waiverReason, by: "Chief Librarian" } });
    setWaiverOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-rose-500/30 text-rose-200 border-rose-400/30 text-[0.68rem] px-2 py-0.5 mb-1">FINES & PAYMENTS</Badge>
          <h2 className="text-2xl font-bold tracking-tight">Fine Management & Receipt Engine</h2>
          <p className="text-xs text-rose-100 mt-1 max-w-xl">
            Manage overdue fines, lost book penalties, damage charges, fine waivers, online/cash payments, and receipt printing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => toast.success("Fine Report Exported to CSV!")} className="bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export Fine Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Outstanding Fines" value={`₹ ${stats.pendingFines.toLocaleString()}`} delta={`${state.fines.filter((f) => f.status === "Pending").length} pending`} tone="destructive" icon={Wallet} />
        <KpiCard label="Total Collected Fines" value={`₹ ${stats.totalFineCollected.toLocaleString()}`} delta="Receipts issued" tone="success" icon={CheckCircle2} />
        <KpiCard label="Lost Book Penalties" value={`₹ ${state.fines.filter((f) => f.type === "Lost").reduce((a, f) => a + f.amount, 0).toLocaleString()}`} delta="Active cases" tone="warning" icon={AlertTriangle} />
        <KpiCard label="Fines Waived" value={`₹ ${state.fines.filter((f) => f.status === "Waived").reduce((a, f) => a + f.amount, 0).toLocaleString()}`} delta="Approved waivers" icon={ShieldCheck} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Fine Ledger ({state.fines.length} Records)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">Fine ID</th>
              <th className="p-3">Member</th>
              <th className="p-3">Book Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Days / Reason</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.fines.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{f.id}</td>
                <td className="p-3 font-medium text-slate-900">{f.memberName} <span className="text-slate-400">({f.memberSourceId})</span></td>
                <td className="p-3 text-slate-600">{f.bookTitle || "--"}</td>
                <td className="p-3">
                  <Badge className={f.type === "Lost" ? "bg-rose-100 text-rose-700 font-bold" : "bg-amber-100 text-amber-700"}>
                    {f.type}
                  </Badge>
                </td>
                <td className="p-3 text-slate-600">{f.daysOverdue ? `${f.daysOverdue} days overdue` : f.type}</td>
                <td className="p-3 font-bold text-rose-600">₹ {f.amount.toLocaleString()}</td>
                <td className="p-3">
                  <Badge className={f.status === "Paid" ? "bg-emerald-100 text-emerald-700 font-bold" : f.status === "Waived" ? "bg-slate-100 text-slate-700" : "bg-red-100 text-red-700 font-bold"}>
                    {f.status}
                  </Badge>
                </td>
                <td className="p-3 text-right flex gap-1.5 justify-end">
                  {f.status === "Pending" && (
                    <>
                      <Button size="sm" className="h-7 text-[0.7rem] rounded-lg bg-emerald-600 text-white cursor-pointer" onClick={() => handleCollect(f.id, f.amount)}>
                        Collect Fine
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg text-rose-600 border-rose-200 cursor-pointer" onClick={() => { setSelectedFine(f); setWaiverOpen(true); }}>
                        Waive Fine
                      </Button>
                    </>
                  )}
                  {f.status === "Paid" && (
                    <Button size="sm" variant="ghost" className="h-7 text-[0.7rem] text-slate-600 cursor-pointer" onClick={() => toast.info(`Receipt ${f.receiptNo || "RCP-AUTO"} printed!`)}>
                      Receipt
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Waive Fine Dialog */}
      <Dialog open={waiverOpen} onOpenChange={setWaiverOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Approve Fine Waiver</DialogTitle>
            <DialogDescription className="text-xs">Waive penalty charges for {selectedFine?.memberName}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApproveWaiver} className="space-y-3 mt-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fine Amount to Waive</label>
              <Input disabled value={`₹ ${selectedFine?.amount || 0}`} className="bg-slate-50 font-bold" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Approval Justification / Reason *</label>
              <Input required value={waiverReason} onChange={(e) => setWaiverReason(e.target.value)} placeholder="e.g. Medical Certificate Approved by Principal" />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setWaiverOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-rose-600 text-white">Approve Waiver</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 11. ENHANCED REPORTS VIEW                                                  */
/* ========================================================================== */
export function EnhancedReportsView() {
  const [activeReport, setActiveReport] = useState<"books" | "members" | "transactions" | "finance" | "analytics">("books");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 text-[0.68rem] px-2 py-0.5 mb-1">REPORTS & ANALYTICS</Badge>
          <h2 className="text-2xl font-bold tracking-tight">Library Management Reports</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Comprehensive reports across books, members, transactions, finances, and reading trends. Export to PDF, Excel, or CSV.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => toast.success("PDF Report generated!")} className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> PDF
          </Button>
          <Button onClick={() => toast.success("Excel Report exported!")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Excel
          </Button>
          <Button onClick={() => toast.success("CSV Export downloaded!")} className="bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "books", label: "Books Report" },
          { id: "members", label: "Members Activity" },
          { id: "transactions", label: "Transactions" },
          { id: "finance", label: "Finance & Fines" },
          { id: "analytics", label: "Usage Analytics" },
        ].map((tab) => {
          const active = activeReport === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveReport(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >{tab.label}</button>
          );
        })}
      </div>

      {activeReport === "books" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Physical Books", value: "45,820", color: "blue" },
            { label: "Available for Issue", value: "38,540", color: "emerald" },
            { label: "Currently Issued", value: "6,840", color: "amber" },
            { label: "Reserved (On Hold)", value: "312", color: "violet" },
            { label: "Lost Books", value: "28", color: "rose" },
            { label: "Damaged / Under Repair", value: "100", color: "orange" },
          ].map((stat) => (
            <div key={stat.label} className={`p-5 bg-${stat.color}-50 border border-${stat.color}-200 rounded-2xl`}>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {activeReport === "members" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Top Readers & Most Active Members</h3>
          {[
            { rank: "🥇", name: "B VISHNU VARDHAN", rollNo: "23341A4219", dept: "CSE (AI&ML)", booksRead: 28, avgDuration: "6 days" },
            { rank: "🥈", name: "K. Sai Teja", rollNo: "22CS101", dept: "CSE", booksRead: 22, avgDuration: "8 days" },
            { rank: "🥉", name: "Sneha Reddy", rollNo: "23AIML052", dept: "CSE (AI&ML)", booksRead: 18, avgDuration: "12 days" },
          ].map((m) => (
            <div key={m.rollNo} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.rank}</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{m.name} <span className="text-slate-400 text-xs font-normal">({m.rollNo})</span></p>
                  <p className="text-xs text-slate-500">{m.dept} • Avg. {m.avgDuration} per book</p>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 font-bold">{m.booksRead} Books</Badge>
            </div>
          ))}
        </div>
      )}

      {activeReport === "finance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Fine Collection Summary (2026)</h3>
            {[
              { month: "August 2026", collected: "₹ 12,450", pending: "₹ 2,900" },
              { month: "July 2026", collected: "₹ 9,800", pending: "₹ 1,200" },
              { month: "June 2026", collected: "₹ 11,200", pending: "₹ 600" },
            ].map((row) => (
              <div key={row.month} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                <span className="font-medium text-slate-700">{row.month}</span>
                <span className="text-emerald-600 font-bold">{row.collected}</span>
                <span className="text-rose-600">{row.pending} pending</span>
              </div>
            ))}
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Overdue Books Department-wise</h3>
            {[
              { dept: "CSE", overdueCount: 18 },
              { dept: "ECE", overdueCount: 9 },
              { dept: "Mechanical", overdueCount: 6 },
              { dept: "Civil", overdueCount: 5 },
            ].map((d) => (
              <div key={d.dept} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>{d.dept}</span><span className="font-bold text-rose-600">{d.overdueCount} overdue</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${d.overdueCount * 5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 12. ENHANCED NOTIFICATIONS VIEW                                            */
/* ========================================================================== */
export function EnhancedNotificationsView() {
  const [notifications, setNotifications] = useState([
    { id: "NOT-01", type: "Overdue Reminder", target: "Rahul V. (22CS189)", channel: "SMS + Email", message: "Your book 'Database System Concepts' is 8 days overdue. Fine: ₹ 40.", sent: "Aug 03, 2026 09:00 AM", status: "Delivered" },
    { id: "NOT-02", type: "Reservation Ready", target: "K. Sai Teja (22CS101)", channel: "In-App + SMS", message: "Your reserved copy of 'Artificial Intelligence' is ready for pickup. Collect within 48 hours.", sent: "Aug 03, 2026 10:30 AM", status: "Delivered" },
    { id: "NOT-03", type: "New Book Arrival", target: "All CSE Students", channel: "In-App", message: "New arrival: 'Quantum Computing Foundations' — Now available in CS-Rack-12.", sent: "Aug 02, 2026 04:00 PM", status: "Delivered" },
    { id: "NOT-04", type: "Membership Expiry", target: "Alumni Members", channel: "Email", message: "Your library membership expires in 7 days. Renew before Aug 10, 2026.", sent: "Aug 01, 2026 08:00 AM", status: "Pending" },
  ]);

  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState({ type: "System Announcement", target: "All Members", channel: "In-App", message: "" });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif = {
      id: `NOT-0${notifications.length + 1}`,
      ...form,
      sent: "Now",
      status: "Delivered",
    };
    setNotifications([newNotif, ...notifications]);
    toast.success(`Notification broadcast to "${form.target}"!`);
    setComposeOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900 via-sky-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-cyan-500/30 text-cyan-200 border-cyan-400/30 text-[0.68rem] px-2 py-0.5 mb-1">NOTIFICATION CENTER</Badge>
          <h2 className="text-2xl font-bold tracking-tight">Automated Library Notification Engine</h2>
          <p className="text-xs text-cyan-100 mt-1 max-w-xl">
            Dispatch overdue reminders, reservation alerts, fine notices, membership expiry, new arrivals, and circulars via In-App, Email, and SMS.
          </p>
        </div>
        <Button onClick={() => setComposeOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          <Send className="size-3.5" /> Compose Broadcast
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Notification Dispatch Log</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
              <th className="p-3">ID</th>
              <th className="p-3">Notification Type</th>
              <th className="p-3">Target Audience</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Message Preview</th>
              <th className="p-3">Sent At</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold text-slate-800">{n.id}</td>
                <td className="p-3">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-[0.65rem]">{n.type}</Badge>
                </td>
                <td className="p-3 font-medium text-slate-900">{n.target}</td>
                <td className="p-3 text-slate-600">{n.channel}</td>
                <td className="p-3 text-slate-500 max-w-xs truncate">{n.message}</td>
                <td className="p-3 text-slate-500">{n.sent}</td>
                <td className="p-3">
                  <Badge className={n.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                    {n.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Compose Library Notification Broadcast</DialogTitle>
            <DialogDescription className="text-xs">Send targeted notifications via In-App, Email, or SMS channels.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notification Type</label>
                <select className="w-full h-9 rounded-xl border border-slate-200 text-xs px-3"
                  value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Due Date Reminder</option>
                  <option>Overdue Reminder</option>
                  <option>Reservation Ready</option>
                  <option>Fine Reminder</option>
                  <option>Membership Expiry</option>
                  <option>New Book Arrival</option>
                  <option>Holiday Notice</option>
                  <option>System Announcement</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Audience</label>
                <select className="w-full h-9 rounded-xl border border-slate-200 text-xs px-3"
                  value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>
                  <option>All Members</option>
                  <option>All Students</option>
                  <option>All Faculty</option>
                  <option>Overdue Members</option>
                  <option>CSE Department</option>
                  <option>ECE Department</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Dispatch Channel</label>
              <div className="flex gap-2">
                {["In-App", "Email", "SMS"].map((ch) => (
                  <label key={ch} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked={ch === "In-App"} className="rounded" />
                    {ch}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Message Content *</label>
              <textarea
                rows={3}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your notification message here..."
                className="w-full rounded-xl border border-slate-200 text-xs p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-cyan-600 text-white">Send Broadcast</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EnhancedSettingsView() {
  const { state, dispatch } = useLibraryStore();
  const [saved, setSaved] = useState(false);
  const [settingsForm, setSettingsForm] = useState(state.settings);

  const handleSave = () => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settingsForm });
    setSaved(true);
    toast.success("Library policy configuration saved successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-zinc-900 to-gray-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-slate-700 text-slate-200 border-slate-600 text-[0.68rem] px-2 py-0.5 mb-1">SYSTEM CONFIGURATION</Badge>
          <h2 className="text-2xl font-bold tracking-tight">Library Policy & Settings</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Configure loan periods, book limits, fine rules, membership durations, barcode formats, email/SMS templates, and receipt headers.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          {saved ? <Check className="size-3.5" /> : <Sliders className="size-3.5" />}
          {saved ? "Saved!" : "Save All Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Calendar className="size-4 text-blue-600" /> Loan Period & Book Limits
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Student Loan (Days)</label>
              <Input type="number" value={settingsForm.borrowPeriodDaysStudent} onChange={(e) => setSettingsForm({ ...settingsForm, borrowPeriodDaysStudent: Number(e.target.value) })} className="h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Faculty Loan (Days)</label>
              <Input type="number" value={settingsForm.borrowPeriodDaysFaculty} onChange={(e) => setSettingsForm({ ...settingsForm, borrowPeriodDaysFaculty: Number(e.target.value) })} className="h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Max Books — Student</label>
              <Input type="number" value={settingsForm.maxBooksStudent} onChange={(e) => setSettingsForm({ ...settingsForm, maxBooksStudent: Number(e.target.value) })} className="h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Max Books — Faculty</label>
              <Input type="number" value={settingsForm.maxBooksFaculty} onChange={(e) => setSettingsForm({ ...settingsForm, maxBooksFaculty: Number(e.target.value) })} className="h-9" />
            </div>
          </div>
        </div>

        {/* Fine Rules */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Wallet className="size-4 text-rose-600" /> Fine Rules & Grace Period
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Per Day Fine (₹)</label>
              <Input type="number" value={settingsForm.finePerDayOverdue} onChange={(e) => setSettingsForm({ ...settingsForm, finePerDayOverdue: Number(e.target.value) })} className="h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Maximum Fine (₹)</label>
              <Input type="number" value={settingsForm.maxFineLimit} onChange={(e) => setSettingsForm({ ...settingsForm, maxFineLimit: Number(e.target.value) })} className="h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Grace Period (Days)</label>
              <Input type="number" value={settingsForm.gracePeriodDays} onChange={(e) => setSettingsForm({ ...settingsForm, gracePeriodDays: Number(e.target.value) })} className="h-9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 14. ENHANCED ID CARD MANAGEMENT VIEW                                       */
/* ========================================================================== */
export function EnhancedIDCardManagementView() {
  const { state, dispatch } = useLibraryStore();
  const [cardSubTab, setCardSubTab] = useState<"templates" | "issuance" | "history">("templates");
  const [issueCardMemberId, setIssueCardMemberId] = useState(state.members[0]?.id || "");
  const [cardType, setCardType] = useState<"RFID" | "QR" | "Barcode">("RFID");
  const [rfidTag, setRfidTag] = useState("A4B2C9D1");

  const handleIssueCard = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "ISSUE_ID_CARD",
      payload: { memberId: issueCardMemberId, cardType, rfidTag, issuedBy: "Librarian" },
    });
    setCardSubTab("history");
  };

  const handleToggleCardStatus = (cardId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    dispatch({ type: "UPDATE_CARD_STATUS", payload: { cardId, status: nextStatus, updatedBy: "Librarian" } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-violet-900 to-purple-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30 text-[0.68rem] px-2 py-0.5 mb-1">ID CARD MANAGEMENT</Badge>
          <h2 className="text-2xl font-bold tracking-tight">Library ID Card & RFID Management</h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-xl">
            Design card templates, issue RFID/QR cards, manage duplicate/lost card requests, bulk print batches, and track card collection status.
          </p>
        </div>
        <Button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
          <Printer className="size-3.5" /> Print All ID Cards
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "templates", label: "Card Templates & Live Preview" },
          { id: "issuance", label: "Issue New RFID / QR Card" },
          { id: "history", label: "ID Card Register Log" },
        ].map((tab) => {
          const active = cardSubTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setCardSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >{tab.label}</button>
          );
        })}
      </div>

      {cardSubTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Card Preview */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Front Card Preview (Standard Student)</h3>
            <div className="w-full max-w-xs mx-auto bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Library className="size-6" />
                <div>
                  <p className="font-bold text-sm">GMRIT Central Library</p>
                  <p className="text-[0.6rem] text-blue-200">EduSuite Pro ERP</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-base">{state.members[0]?.name || "B VISHNU VARDHAN"}</p>
                <p className="text-[0.7rem] text-blue-200">ID: {state.members[0]?.sourceId || "23341A4219"}</p>
                <p className="text-[0.7rem] text-blue-200">{state.members[0]?.department} • {state.members[0]?.type}</p>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <p className="text-[0.65rem] text-blue-200">Valid: 2023–2027</p>
                <div className="bg-white/20 rounded p-1 text-[0.55rem] font-mono">RFID: A4B2C9D1</div>
              </div>
            </div>
          </div>
          {/* Back Card Preview */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Back Card Preview</h3>
            <div className="w-full max-w-xs mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl">
              <p className="text-[0.65rem] text-slate-300 mb-3">If found, please return to: GMRIT Library, Rajam — 532127</p>
              <div className="h-10 bg-white/10 rounded flex items-center justify-center font-mono text-xs tracking-widest">
                ||||| {state.members[0]?.memberId || "MEM-001"} |||||
              </div>
              <div className="mt-3 text-[0.6rem] text-slate-400">
                <p>Library Rules:</p>
                <p>• Return books by due date</p>
                <p>• Fine: ₹5 per day overdue</p>
                <p>• Lost card: ₹50 replacement</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {cardSubTab === "issuance" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-lg space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Issue New Library ID Card / Smart Tag</h3>
          <form onSubmit={handleIssueCard} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Member *</label>
              <select value={issueCardMemberId} onChange={(e) => setIssueCardMemberId(e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs">
                {state.members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.sourceId} - {m.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Card Type</label>
              <select value={cardType} onChange={(e) => setCardType(e.target.value as any)} className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs">
                <option value="RFID">RFID Smart Card</option>
                <option value="QR">QR Code Card</option>
                <option value="Barcode">Barcode Card</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">RFID Chip Tag Serial Code</label>
              <Input value={rfidTag} onChange={(e) => setRfidTag(e.target.value)} placeholder="e.g. A4B2C9D1" />
            </div>
            <Button type="submit" className="bg-indigo-600 text-white rounded-xl text-xs gap-1.5 cursor-pointer">
              Issue & Print Card
            </Button>
          </form>
        </div>
      )}

      {cardSubTab === "history" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Card Print & Issuance History ({state.idCards.length} Registered Cards)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                <th className="p-3">Card ID</th>
                <th className="p-3">Member</th>
                <th className="p-3">Card Type</th>
                <th className="p-3">RFID Tag</th>
                <th className="p-3">Issued Date</th>
                <th className="p-3">Card Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.idCards.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-slate-800">{c.id}</td>
                  <td className="p-3 font-medium text-slate-900">{c.memberName} <span className="text-slate-400">({c.memberSourceId})</span></td>
                  <td className="p-3 text-slate-600">{c.cardType}</td>
                  <td className="p-3 font-mono text-blue-600">{c.rfidTag || "--"}</td>
                  <td className="p-3 text-slate-600">{new Date(c.issuedAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-3">
                    <Badge className={c.status === "Active" ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-rose-100 text-rose-700"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right flex gap-1.5 justify-end">
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg cursor-pointer" onClick={() => handleToggleCardStatus(c.id, c.status)}>
                      {c.status === "Active" ? "Suspend Card" : "Reactivate"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[0.7rem] rounded-lg cursor-pointer" onClick={() => toast.success(`Reprinting card for ${c.memberName}`)}>
                      Reprint
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
