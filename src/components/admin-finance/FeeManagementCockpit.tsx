import React, { useState } from "react";
import {
  Wallet,
  Building2,
  Building,
  GraduationCap,
  Users,
  Award,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Calendar,
  Settings,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  ArrowRight,
  Printer,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Types
export interface FeeStructureItem {
  id: string;
  year: string;
  module: "Hostel" | "College";
  category: string;
  kind: "Normal Fee" | "Tuition Fee" | "Admission/Special Fee" | "Pending Dues (Rejoin)";
  amount: number;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export interface BankAccountItem {
  id: string;
  name: string;
  code: string;
  accountNo: string;
  bankIfsc: string;
  kind: string;
  module: "college" | "hostel";
  status: "Active" | "Inactive";
}

export interface AcademicYearItem {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  active: boolean;
  status: "Current" | "Upcoming" | "Completed";
}

export interface ScholarshipItem {
  id: string;
  studentName: string;
  rollNo: string;
  type: string;
  amount: number;
  applied: number;
  remaining: number;
  status: "Approved" | "Pending" | "Rejected";
}

export interface DetainedStudentItem {
  id: string;
  studentName: string;
  rollNo: string;
  department: string;
  currentYear: string;
  detainedInYear: string;
  reason: string;
  detentionDate: string;
  status: "Active Detention" | "Revoked";
}

export function FeeManagementCockpit() {
  const [activeTab, setActiveTab] = useState<
    "fee-structures" | "bank-accounts" | "academic-years" | "scholarships" | "detentions" | "institution-settings" | "fee-collection"
  >("fee-structures");

  // 1. Fee Structures State
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>([
    {
      id: "fs-1",
      year: "2026-2027",
      module: "Hostel",
      category: "Admission Fee",
      kind: "Normal Fee",
      amount: 1000,
      appliesTo: "Three Occupied Room, Two Occupied Room, Four Occupied Room",
      status: "Active",
    },
    {
      id: "fs-2",
      year: "2026-2027",
      module: "Hostel",
      category: "Hostel Caution Deposit Fee",
      kind: "Normal Fee",
      amount: 2000,
      appliesTo: "Three Occupied Room, Two Occupied Room, Four Occupied Room",
      status: "Active",
    },
    {
      id: "fs-3",
      year: "2026-2027",
      module: "Hostel",
      category: "Miscellaneous Fee",
      kind: "Normal Fee",
      amount: 1400,
      appliesTo: "Three Occupied Room, Two Occupied Room, Four Occupied Room",
      status: "Active",
    },
    {
      id: "fs-4",
      year: "2026-2027",
      module: "Hostel",
      category: "Room Rent",
      kind: "Normal Fee",
      amount: 600,
      appliesTo: "Three Occupied Room, Two Occupied Room, Four Occupied Room",
      status: "Active",
    },
    {
      id: "fs-5",
      year: "2026-2027",
      module: "College",
      category: "College Fee",
      kind: "Tuition Fee",
      amount: 45000,
      appliesTo: "All programmes",
      status: "Active",
    },
    {
      id: "fs-6",
      year: "2026-2027",
      module: "College",
      category: "College Fee",
      kind: "Admission/Special Fee",
      amount: 2850,
      appliesTo: "All programmes",
      status: "Active",
    },
    {
      id: "fs-7",
      year: "2026-2027",
      module: "College",
      category: "College Fee",
      kind: "Admission/Special Fee",
      amount: 8630,
      appliesTo: "All programmes",
      status: "Active",
    },
    {
      id: "fs-8",
      year: "2026-2027",
      module: "College",
      category: "College Fee",
      kind: "Admission/Special Fee",
      amount: 3050,
      appliesTo: "All programmes",
      status: "Active",
    },
    {
      id: "fs-9",
      year: "2026-2027",
      module: "College",
      category: "College Fee",
      kind: "Tuition Fee",
      amount: 10000,
      appliesTo: "All programmes",
      status: "Active",
    },
  ]);

  // Filters for Fee Structures
  const [fsModuleFilter, setFsModuleFilter] = useState<"All" | "Hostel" | "College">("All");
  const [fsYearFilter, setFsYearFilter] = useState<string>("2026-2027");
  const [fsSearch, setFsSearch] = useState<string>("");

  // Modal State for Fee Structure
  const [isFsModalOpen, setIsFsModalOpen] = useState(false);
  const [editingFs, setEditingFs] = useState<FeeStructureItem | null>(null);
  const [fsFormData, setFsFormData] = useState({
    year: "2026-2027",
    module: "College" as "Hostel" | "College",
    category: "College Fee",
    kind: "Tuition Fee" as FeeStructureItem["kind"],
    amount: 15000,
    appliesTo: "All programmes",
    status: "Active" as "Active" | "Inactive",
  });

  // 2. Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([
    {
      id: "ba-1",
      name: "Tuition Fee Account",
      code: "tuition",
      accountNo: "TUITION-001",
      bankIfsc: "SBI (SBIN0001234)",
      kind: "Tuition Fee",
      module: "college",
      status: "Active",
    },
    {
      id: "ba-2",
      name: "Special Fee Account",
      code: "special",
      accountNo: "SPECIAL-001",
      bankIfsc: "SBI (SBIN0001234)",
      kind: "Special Fee",
      module: "college",
      status: "Active",
    },
    {
      id: "ba-3",
      name: "Hostel Account 1",
      code: "hostel_1",
      accountNo: "HOSTEL-001",
      bankIfsc: "SBI (SBIN0001234)",
      kind: "Hostel Account 1",
      module: "hostel",
      status: "Active",
    },
    {
      id: "ba-4",
      name: "Hostel Account 2",
      code: "hostel_2",
      accountNo: "HOSTEL-002",
      bankIfsc: "SBI (SBIN0001234)",
      kind: "Hostel Account 2",
      module: "hostel",
      status: "Active",
    },
  ]);

  const [isBaModalOpen, setIsBaModalOpen] = useState(false);
  const [baFormData, setBaFormData] = useState({
    name: "",
    code: "",
    accountNo: "",
    bankIfsc: "SBI (SBIN0001234)",
    kind: "General Fee",
    module: "college" as "college" | "hostel",
  });

  // 3. Academic Years State
  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([
    {
      id: "ay-1",
      year: "2026-2027",
      startDate: "2026-06-01",
      endDate: "2027-05-31",
      active: true,
      status: "Current",
    },
    {
      id: "ay-2",
      year: "2025-26",
      startDate: "2025-07-01",
      endDate: "2026-04-30",
      active: false,
      status: "Current",
    },
  ]);

  const [isAyModalOpen, setIsAyModalOpen] = useState(false);
  const [ayFormData, setAyFormData] = useState({
    year: "2027-2028",
    startDate: "2027-06-01",
    endDate: "2028-05-31",
    active: false,
    status: "Upcoming" as "Current" | "Upcoming" | "Completed",
  });

  // 4. Student Scholarships State
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([
    {
      id: "sc-1",
      studentName: "V. Sai Kumar",
      rollNo: "22001A0512",
      type: "Jagananna Vidya Deevena (RTF)",
      amount: 45000,
      applied: 45000,
      remaining: 0,
      status: "Approved",
    },
    {
      id: "sc-2",
      studentName: "K. Anusha",
      rollNo: "23001A0408",
      type: "Merit Cum Means Scholarship",
      amount: 25000,
      applied: 15000,
      remaining: 10000,
      status: "Pending",
    },
  ]);
  const [scSearch, setScSearch] = useState("");

  // 5. Detention Management State
  const [detentions, setDetentions] = useState<DetainedStudentItem[]>([
    {
      id: "dt-1",
      studentName: "P. Rakesh Sharma",
      rollNo: "22001A0345",
      department: "Mechanical Engineering",
      currentYear: "3rd Year (2026-27)",
      detainedInYear: "3rd Year (2027-28)",
      reason: "Shortage of Attendance (<65% aggregate)",
      detentionDate: "2026-08-10",
      status: "Active Detention",
    },
  ]);
  const [dtSearch, setDtSearch] = useState("");

  // 6. Institution Settings State
  const [instSettings, setInstSettings] = useState({
    mode: "Both (Unified)" as "Both (Unified)" | "College Only" | "Hostel Only",
    name: "JNTUA College of Engineering",
    code: "JNTUA-CE-ANANTAPUR",
    enableScholarship: true,
    enableDetention: true,
    enableBulkExcel: true,
    enableLateFeeFine: true,
    enablePartialPayments: true,
  });

  // 7. Student Fee Collection Search State
  const [lookupRollNo, setLookupRollNo] = useState("");
  const [searchedStudent, setSearchedStudent] = useState<{
    name: string;
    rollNo: string;
    program: string;
    year: string;
    collegeDue: number;
    hostelDue: number;
    status: string;
  } | null>(null);

  // Handlers
  const handleSaveFeeStructure = () => {
    if (editingFs) {
      setFeeStructures((prev) =>
        prev.map((item) => (item.id === editingFs.id ? { ...item, ...fsFormData } : item))
      );
      toast.success("Fee structure updated successfully");
    } else {
      const newItem: FeeStructureItem = {
        id: `fs-${Date.now()}`,
        ...fsFormData,
      };
      setFeeStructures((prev) => [newItem, ...prev]);
      toast.success("New fee structure created");
    }
    setIsFsModalOpen(false);
    setEditingFs(null);
  };

  const handleApplyFeeStructure = (item: FeeStructureItem) => {
    toast.success(`Applied ${item.category} (₹${item.amount.toLocaleString()}) to ${item.appliesTo}`);
  };

  const handleAddBankAccount = () => {
    if (!baFormData.name || !baFormData.accountNo) {
      toast.error("Please enter Bank Account Name and Account Number");
      return;
    }
    const newBa: BankAccountItem = {
      id: `ba-${Date.now()}`,
      name: baFormData.name,
      code: baFormData.code || baFormData.name.toLowerCase().replace(/\s+/g, "_"),
      accountNo: baFormData.accountNo,
      bankIfsc: baFormData.bankIfsc,
      kind: baFormData.kind,
      module: baFormData.module,
      status: "Active",
    };
    setBankAccounts((prev) => [...prev, newBa]);
    toast.success("Bank Account added successfully");
    setIsBaModalOpen(false);
    setBaFormData({
      name: "",
      code: "",
      accountNo: "",
      bankIfsc: "SBI (SBIN0001234)",
      kind: "General Fee",
      module: "college",
    });
  };

  const handleAddAcademicYear = () => {
    if (!ayFormData.year) {
      toast.error("Please specify academic year format (e.g. 2027-2028)");
      return;
    }
    const newAy: AcademicYearItem = {
      id: `ay-${Date.now()}`,
      ...ayFormData,
    };
    setAcademicYears((prev) => [...prev, newAy]);
    toast.success("Academic year added");
    setIsAyModalOpen(false);
  };

  const handleSaveInstitutionSettings = () => {
    toast.success("Institution fee configuration updated successfully!");
  };

  const handleSearchStudentLookup = () => {
    if (!lookupRollNo.trim()) {
      toast.error("Enter a roll number to search");
      return;
    }
    setSearchedStudent({
      name: "B. Ramesh Naidu",
      rollNo: lookupRollNo.toUpperCase(),
      program: "B.Tech Computer Science & Engineering",
      year: "3rd Year (Sem 5)",
      collegeDue: 45000,
      hostelDue: 1200,
      status: "Regular / Clear",
    });
    toast.success("Student account loaded");
  };

  // Filtered Fee Structures
  const filteredFeeStructures = feeStructures.filter((item) => {
    const matchesModule = fsModuleFilter === "All" || item.module === fsModuleFilter;
    const matchesYear = !fsYearFilter || item.year === fsYearFilter;
    const matchesSearch =
      !fsSearch ||
      item.category.toLowerCase().includes(fsSearch.toLowerCase()) ||
      item.kind.toLowerCase().includes(fsSearch.toLowerCase()) ||
      item.appliesTo.toLowerCase().includes(fsSearch.toLowerCase());
    return matchesModule && matchesYear && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                Fee Management
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2.5 py-0.5">
                  Hostel + College
                </Badge>
              </h1>
              <p className="text-xs text-slate-500">
                Configure hostel and college fee structures, scholarships, bank accounts, and detentions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setActiveTab("fee-collection")}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-700 text-xs gap-2 font-medium"
          >
            <Search className="h-3.5 w-3.5" /> Fee Collection Workspace
          </Button>
          <Button
            onClick={() => {
              setEditingFs(null);
              setIsFsModalOpen(true);
            }}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Add Fee Structure
          </Button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Fee Structures</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{feeStructures.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Active hostel & college structures</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Hostel Due</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">₹0</div>
          <span className="text-[10px] text-slate-400">Outstanding hostel fees</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">College Due</span>
          <div className="text-2xl font-bold font-mono text-amber-600">₹3,69,31,350</div>
          <span className="text-[10px] text-slate-400">Outstanding academic fees</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Students with Dues</span>
          <div className="text-2xl font-bold font-mono text-blue-600">864</div>
          <span className="text-[10px] text-slate-400">Across enabled modules</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Scholarships Pending</span>
          <div className="text-2xl font-bold font-mono text-purple-600">{scholarships.filter(s => s.status === "Pending").length}</div>
          <span className="text-[10px] text-slate-400">Awaiting approval</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Active Detentions</span>
          <div className="text-2xl font-bold font-mono text-rose-600">{detentions.filter(d => d.status === "Active Detention").length}</div>
          <span className="text-[10px] text-slate-400">Currently blocked students</span>
        </div>
      </div>

      {/* BANNER NOTIFICATION */}
      <div className="p-3.5 px-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-blue-600 text-white">
            <Users className="h-3.5 w-3.5" />
          </div>
          <span>
            <strong>Student accounts live in Fee Collection.</strong> Search students, collect payments, apply concessions, and promote years from the collection screen.
          </span>
        </div>
        <button
          onClick={() => setActiveTab("fee-collection")}
          className="text-blue-700 dark:text-blue-300 font-bold hover:underline flex items-center gap-1 text-[11px]"
        >
          Open Fee Collection <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 pb-1">
        {[
          { id: "fee-structures", label: "Fee Structures", icon: Wallet },
          { id: "bank-accounts", label: "Bank Accounts", icon: CreditCard },
          { id: "academic-years", label: "Academic Years", icon: Calendar },
          { id: "scholarships", label: "Scholarships", icon: Award },
          { id: "detentions", label: "Detentions", icon: UserX },
          { id: "institution-settings", label: "Institution Settings", icon: Settings },
          { id: "fee-collection", label: "Fee Collection & Lookup", icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: FEE STRUCTURES */}
      {activeTab === "fee-structures" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Fee Structures Master</h2>
              <p className="text-xs text-slate-500">
                Define hostel and college charges by academic year. College kinds: Admission, Special, Tuition, Pending Dues (Rejoin).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => toast.success("Exported Fee Structures Master Excel")}
                size="sm"
                variant="outline"
                className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
              </Button>
              <Button
                onClick={() => {
                  setEditingFs(null);
                  setIsFsModalOpen(true);
                }}
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> Add Structure
              </Button>
            </div>
          </div>

          {/* FILTERS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            {/* Module Filter Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
              {(["All", "Hostel", "College"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFsModuleFilter(m)}
                  className={`flex-1 py-1 px-2 rounded-md text-[11px] font-semibold transition-all ${
                    fsModuleFilter === m
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Academic Year Dropdown */}
            <select
              value={fsYearFilter}
              onChange={(e) => setFsYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>

            {/* Search Input */}
            <div className="relative sm:col-span-3">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search category, dept, program…"
                value={fsSearch}
                onChange={(e) => setFsSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <th className="p-3">Year</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Kind</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Applies To</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFeeStructures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-medium text-slate-800 dark:text-slate-200">{item.year}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          item.module === "Hostel"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {item.module}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.category}</td>
                    <td className="p-3">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {item.kind}
                      </span>
                    </td>
                    <td className="p-3 font-bold font-mono text-blue-600 text-sm">₹{item.amount.toLocaleString("en-IN")}.00</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-xs truncate">{item.appliesTo}</td>
                    <td className="p-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Active</Badge>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingFs(item);
                          setFsFormData({
                            year: item.year,
                            module: item.module,
                            category: item.category,
                            kind: item.kind,
                            amount: item.amount,
                            appliesTo: item.appliesTo,
                            status: item.status,
                          });
                          setIsFsModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleApplyFeeStructure(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-md border border-blue-200 dark:border-blue-800"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BANK ACCOUNTS */}
      {activeTab === "bank-accounts" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Bank Accounts Configuration</h2>
              <p className="text-xs text-slate-500">
                Manage the accounts used in Fee Collection (Tuition, Special, Hostel 1, Hostel 2). Direct bank mapping.
              </p>
            </div>

            <Button
              onClick={() => setIsBaModalOpen(true)}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Bank Account
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Account No.</th>
                  <th className="p-3">Bank / IFSC</th>
                  <th className="p-3">Kind</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bankAccounts.map((ba) => (
                  <tr key={ba.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {ba.name}
                      <span className="block text-[10px] text-slate-400 font-mono">{ba.code}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-800 dark:text-slate-200">{ba.accountNo}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{ba.bankIfsc}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{ba.kind}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {ba.module}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toast.success(`Bank account ${ba.name} settings edited`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC YEARS */}
      {activeTab === "academic-years" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Academic Years Master</h2>
              <p className="text-xs text-slate-500">
                Add years used by fee structures, scholarships, and collection. Format: YYYY-YY (e.g. 2026-27).
              </p>
            </div>

            <Button
              onClick={() => setIsAyModalOpen(true)}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Academic Year
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <th className="p-3">Year</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Active Status</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {academicYears.map((ay) => (
                  <tr key={ay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">{ay.year}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono">{ay.startDate}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono">{ay.endDate}</td>
                    <td className="p-3">
                      {ay.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-blue-600">{ay.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SCHOLARSHIPS */}
      {activeTab === "scholarships" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Student Scholarships & Concessions</h2>
              <p className="text-xs text-slate-500">
                Assign, approve, and apply scholarship concessions to matching unpaid fees.
              </p>
            </div>

            <Button
              onClick={() => {
                const newSc: ScholarshipItem = {
                  id: `sc-${Date.now()}`,
                  studentName: "M. Dinesh Varma",
                  rollNo: "22001A0589",
                  type: "Prathibha Scholarship",
                  amount: 20000,
                  applied: 0,
                  remaining: 20000,
                  status: "Pending",
                };
                setScholarships((prev) => [newSc, ...prev]);
                toast.success("Assigned new scholarship application");
              }}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Assign Scholarship
            </Button>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll number…"
                value={scSearch}
                onChange={(e) => setScSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
            <select className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs">
              <option>2026-2027</option>
              <option>2025-2026</option>
            </select>
            <select className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs">
              <option>All statuses</option>
              <option>Pending</option>
              <option>Approved</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <th className="p-3">Student</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Applied</th>
                  <th className="p-3">Remaining</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scholarships.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                      No scholarships found.
                    </td>
                  </tr>
                ) : (
                  scholarships.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {sc.studentName}
                        <span className="block text-[10px] text-slate-400 font-mono">{sc.rollNo}</span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{sc.type}</td>
                      <td className="p-3 font-bold font-mono text-blue-600">₹{sc.amount.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-600">₹{sc.applied.toLocaleString()}</td>
                      <td className="p-3 font-mono text-slate-500">₹{sc.remaining.toLocaleString()}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            sc.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }
                        >
                          {sc.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {sc.status === "Pending" && (
                          <button
                            onClick={() => {
                              setScholarships((prev) =>
                                prev.map((s) => (s.id === sc.id ? { ...s, status: "Approved", applied: s.amount, remaining: 0 } : s))
                              );
                              toast.success(`Approved scholarship for ${sc.studentName}`);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200"
                          >
                            Approve & Apply
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DETENTIONS */}
      {activeTab === "detentions" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Detention Management</h2>
              <p className="text-xs text-slate-500">
                Academic hold: the student repeats the same year next academic year, or is held in a lower year. This is not based on unpaid fees. You can also Detain from Fee Collection next to Promote.
              </p>
            </div>

            <Button
              onClick={() => {
                const newDt: DetainedStudentItem = {
                  id: `dt-${Date.now()}`,
                  studentName: "K. Suresh Babu",
                  rollNo: "21001A0419",
                  department: "ECE",
                  currentYear: "4th Year",
                  detainedInYear: "4th Year",
                  reason: "Condonation Shortage",
                  detentionDate: "2026-08-15",
                  status: "Active Detention",
                };
                setDetentions((prev) => [newDt, ...prev]);
                toast.error("Applied Academic Detention hold");
              }}
              size="sm"
              variant="destructive"
              className="rounded-xl text-xs gap-1.5 shadow-sm"
            >
              <UserX className="h-3.5 w-3.5" /> Detain Student
            </Button>
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search detained students…"
              value={dtSearch}
              onChange={(e) => setDtSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                  <th className="p-3">Student</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Current Year</th>
                  <th className="p-3">Detained In Year</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {detentions.map((dt) => (
                  <tr key={dt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {dt.studentName}
                      <span className="block text-[10px] text-slate-400 font-mono">{dt.rollNo}</span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{dt.department}</td>
                    <td className="p-3 font-mono">{dt.currentYear}</td>
                    <td className="p-3 font-mono text-rose-600 font-bold">{dt.detainedInYear}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{dt.reason}</td>
                    <td className="p-3">
                      <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">{dt.status}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setDetentions((prev) => prev.filter((d) => d.id !== dt.id));
                          toast.success(`Revoked detention for ${dt.studentName}`);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200"
                      >
                        Revoke Hold
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: INSTITUTION SETTINGS */}
      {activeTab === "institution-settings" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Institution Settings</h2>
            <p className="text-xs text-slate-500">
              Choose hostel, college, or both, then turn modules on or off for this campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: INSTITUTION MODE & INFO */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Institution Mode
                </h3>
                <p className="text-xs text-slate-500">
                  Mode controls which fee modules appear in the workspace and navigation.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(["Both (Unified)", "College Only", "Hostel Only"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInstSettings((prev) => ({ ...prev, mode }))}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        instSettings.mode === mode
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={instSettings.name}
                    onChange={(e) => setInstSettings((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Institution Code
                  </label>
                  <input
                    type="text"
                    value={instSettings.code}
                    onChange={(e) => setInstSettings((prev) => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MODULE TOGGLES & DETENTION NOTICE */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Modules Toggle
                </h3>
                <p className="text-xs text-slate-500">
                  Disabled modules are hidden from this workspace until turned back on.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enable Scholarship Module
                    </span>
                    <input
                      type="checkbox"
                      checked={instSettings.enableScholarship}
                      onChange={(e) => setInstSettings((prev) => ({ ...prev, enableScholarship: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enable Detention Module
                    </span>
                    <input
                      type="checkbox"
                      checked={instSettings.enableDetention}
                      onChange={(e) => setInstSettings((prev) => ({ ...prev, enableDetention: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enable Bulk Excel Uploads
                    </span>
                    <input
                      type="checkbox"
                      checked={instSettings.enableBulkExcel}
                      onChange={(e) => setInstSettings((prev) => ({ ...prev, enableBulkExcel: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* DETENTION EXPLANATION CARD */}
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4" /> Detention Policy Note
                </div>
                <p className="text-[11px] leading-relaxed">
                  Detention is academic standing, not unpaid fees. A 3rd-year student in 2026-27 can repeat 3rd year in 2027-28, or be held in 2nd year. Use Promote / Detain on Fee Collection.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button onClick={handleSaveInstitutionSettings} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2 font-bold px-6">
              <Check className="h-4 w-4" /> Save Institution Settings
            </Button>
          </div>
        </div>
      )}

      {/* TAB 7: FEE COLLECTION WORKSPACE */}
      {activeTab === "fee-collection" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Collection & Student Account Lookup</h2>
            <p className="text-xs text-slate-500">
              Search student roll number to view pending dues, apply concessions, record online/cash payments, and promote/detain years.
            </p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              placeholder="Enter Roll Number or PIN (e.g. 21001A0501)…"
              value={lookupRollNo}
              onChange={(e) => setLookupRollNo(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
            />
            <Button onClick={handleSearchStudentLookup} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2">
              <Search className="h-3.5 w-3.5" /> Lookup Student
            </Button>
          </div>

          {searchedStudent && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{searchedStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{searchedStudent.rollNo} • {searchedStudent.program}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 self-start">{searchedStudent.status}</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">College Fee Due</span>
                  <span className="text-base font-bold font-mono text-amber-600">₹{searchedStudent.collegeDue.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hostel Fee Due</span>
                  <span className="text-base font-bold font-mono text-emerald-600">₹{searchedStudent.hostelDue.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Current Academic Year</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{searchedStudent.year}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Actions</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Button onClick={() => toast.success(`Collected ₹${searchedStudent.collegeDue} fee for ${searchedStudent.name}`)} size="sm" className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white">
                      Collect Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT FEE STRUCTURE */}
      {isFsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingFs ? "Edit Fee Structure" : "Add Fee Structure"}
              </h3>
              <button onClick={() => setIsFsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Academic Year</label>
                  <select
                    value={fsFormData.year}
                    onChange={(e) => setFsFormData({ ...fsFormData, year: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Module</label>
                  <select
                    value={fsFormData.module}
                    onChange={(e) => setFsFormData({ ...fsFormData, module: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="College">College</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Category Name</label>
                <input
                  type="text"
                  value={fsFormData.category}
                  onChange={(e) => setFsFormData({ ...fsFormData, category: e.target.value })}
                  placeholder="e.g. College Fee, Hostel Caution Deposit"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Fee Kind</label>
                  <select
                    value={fsFormData.kind}
                    onChange={(e) => setFsFormData({ ...fsFormData, kind: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Normal Fee">Normal Fee</option>
                    <option value="Tuition Fee">Tuition Fee</option>
                    <option value="Admission/Special Fee">Admission/Special Fee</option>
                    <option value="Pending Dues (Rejoin)">Pending Dues (Rejoin)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={fsFormData.amount}
                    onChange={(e) => setFsFormData({ ...fsFormData, amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Applies To</label>
                <input
                  type="text"
                  value={fsFormData.appliesTo}
                  onChange={(e) => setFsFormData({ ...fsFormData, appliesTo: e.target.value })}
                  placeholder="e.g. All programmes, Room Occupants..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsFsModalOpen(false)} variant="outline" size="sm" className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleSaveFeeStructure} size="sm" className="rounded-xl bg-blue-600 text-white">
                Save Fee Structure
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD BANK ACCOUNT */}
      {isBaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Bank Account</h3>
              <button onClick={() => setIsBaModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tuition Fee Account"
                  value={baFormData.name}
                  onChange={(e) => setBaFormData({ ...baFormData, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. TUITION-001"
                  value={baFormData.accountNo}
                  onChange={(e) => setBaFormData({ ...baFormData, accountNo: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Bank Name / IFSC</label>
                <input
                  type="text"
                  value={baFormData.bankIfsc}
                  onChange={(e) => setBaFormData({ ...baFormData, bankIfsc: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Account Kind</label>
                  <input
                    type="text"
                    value={baFormData.kind}
                    onChange={(e) => setBaFormData({ ...baFormData, kind: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Module</label>
                  <select
                    value={baFormData.module}
                    onChange={(e) => setBaFormData({ ...baFormData, module: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="college">College</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsBaModalOpen(false)} variant="outline" size="sm" className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleAddBankAccount} size="sm" className="rounded-xl bg-blue-600 text-white">
                Save Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ACADEMIC YEAR */}
      {isAyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Academic Year</h3>
              <button onClick={() => setIsAyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Academic Year Title</label>
                <input
                  type="text"
                  placeholder="e.g. 2027-2028"
                  value={ayFormData.year}
                  onChange={(e) => setAyFormData({ ...ayFormData, year: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={ayFormData.startDate}
                    onChange={(e) => setAyFormData({ ...ayFormData, startDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Date</label>
                  <input
                    type="date"
                    value={ayFormData.endDate}
                    onChange={(e) => setAyFormData({ ...ayFormData, endDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsAyModalOpen(false)} variant="outline" size="sm" className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleAddAcademicYear} size="sm" className="rounded-xl bg-blue-600 text-white">
                Save Academic Year
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
