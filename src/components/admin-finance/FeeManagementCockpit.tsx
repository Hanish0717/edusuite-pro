import React, { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Calendar,
  Layers,
  Wallet,
  Clock,
  AlertTriangle,
  CreditCard,
  Building,
  Users,
  FileText,
  Receipt,
  RotateCcw,
  Sliders,
  Award,
  Gift,
  UserCheck,
  UserX,
  UploadCloud,
  Download,
  CheckCircle2,
  XCircle,
  FileCheck,
  BarChart3,
  ShieldAlert,
  Bell,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  Printer,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Building2,
  ChevronRight,
  Shield,
  HelpCircle,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Navigation Sub-sections
type NavSection =
  | "dashboard"
  | "institution-settings"
  | "academic-years"
  | "fee-categories"
  | "fee-structures"
  | "installments"
  | "late-fees"
  | "bank-accounts"
  | "payment-settings"
  | "fee-collection"
  | "fee-demands"
  | "student-accounts"
  | "receipts"
  | "refunds"
  | "adjustments"
  | "scholarships"
  | "concessions"
  | "academic-status"
  | "bulk-operations"
  | "clearance-noc"
  | "reports"
  | "audit-logs"
  | "permissions";

export function FeeManagementCockpit() {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");

  // Global State Stores
  const [institutionConfig, setInstitutionConfig] = useState({
    mode: "Both (Unified)" as "Both (Unified)" | "College Only" | "Hostel Only",
    name: "JNTUA College of Engineering",
    code: "JNTUA-CE-ANANTAPUR",
    address: "Sir Mokshagundam Vishveshwariah Road, Ananthapuramu, AP - 515002",
    email: "finance@jntuace.ac.in",
    phone: "+91 8554 272404",
    website: "https://www.jntuacea.ac.in",
    gstin: "37AAAJ0000A1Z5",
    pan: "AAAJ0000A",
    receiptPrefix: "REC-2026-",
    invoicePrefix: "INV-2026-",
    enableCollege: true,
    enableHostel: true,
    enableScholarships: true,
    enableDetentions: true,
    enableTransport: true,
    enableExams: true,
    enableLibrary: true,
    enableLateFees: true,
    enableRefunds: true,
    enableOnlinePay: true,
    enableOfflinePay: true,
    enableBulkExcel: true,
    enableParentPay: true,
    enableNoc: true,
  });

  // KPI Metrics
  const metrics = {
    totalDemand: 42500000,
    collected: 35568650,
    outstanding: 6931350,
    studentsWithDues: 864,
    todayCollection: 245000,
    scholarshipsGiven: 6200000,
    pendingPayments: 12,
    refunds: 125000,
    collectionPercentage: 83.68,
  };

  // Fee Structures State with Versioning
  const [feeStructures, setFeeStructures] = useState([
    {
      id: "fs-101",
      version: "v2.0",
      year: "2026-2027",
      module: "College",
      category: "Tuition Fee",
      kind: "Tuition Fee",
      amount: 45000,
      programme: "B.Tech",
      branch: "CSE, ECE, EEE, MECH, CIVIL",
      appliesTo: "All 1st, 2nd, 3rd, 4th Year Enrolled Students",
      dueDate: "2026-07-15",
      installment: "Installment 1 (50%)",
      lateFeeRule: "Standard (₹100 + ₹20/day)",
      bankAccount: "Tuition Fee Account (TUITION-001)",
      status: "Active",
    },
    {
      id: "fs-102",
      version: "v1.0",
      year: "2026-2027",
      module: "Hostel",
      category: "Hostel Room Rent",
      kind: "Room Rent",
      amount: 600,
      programme: "All Programmes",
      branch: "All Branches",
      appliesTo: "Three Occupied Room, Two Occupied Room",
      dueDate: "2026-08-01",
      installment: "Full Payment",
      lateFeeRule: "Hostel Late Fee Rule",
      bankAccount: "Hostel Account 1 (HOSTEL-001)",
      status: "Active",
    },
    {
      id: "fs-103",
      version: "v1.0",
      year: "2026-2027",
      module: "Hostel",
      category: "Mess Fee Deposit",
      kind: "Mess Fee",
      amount: 12000,
      programme: "All Programmes",
      branch: "All Branches",
      appliesTo: "Hostel Resident Students",
      dueDate: "2026-08-01",
      installment: "Semester Wise",
      lateFeeRule: "Standard (₹100 + ₹20/day)",
      bankAccount: "Hostel Account 2 (HOSTEL-002)",
      status: "Active",
    },
  ]);

  // Modals state
  const [isNewVersionModal, setIsNewVersionModal] = useState(false);
  const [selectedFsForVersion, setSelectedFsForVersion] = useState<any>(null);
  const [newVersionAmount, setNewVersionAmount] = useState<number>(50000);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState([
    { id: "ba-1", name: "Tuition Fee Account", code: "tuition", accountNo: "TUITION-001", bank: "SBI", branch: "JNTU Anantapur", ifsc: "SBIN0001234", kind: "Tuition Fee", module: "College", status: "Active" },
    { id: "ba-2", name: "Special Fee Account", code: "special", accountNo: "SPECIAL-001", bank: "SBI", branch: "JNTU Anantapur", ifsc: "SBIN0001234", kind: "Special Fee", module: "College", status: "Active" },
    { id: "ba-3", name: "Hostel Account 1", code: "hostel_1", accountNo: "HOSTEL-001", bank: "SBI", branch: "JNTU Anantapur", ifsc: "SBIN0001234", kind: "Hostel Account 1", module: "Hostel", status: "Active" },
    { id: "ba-4", name: "Hostel Account 2", code: "hostel_2", accountNo: "HOSTEL-002", bank: "SBI", branch: "JNTU Anantapur", ifsc: "SBIN0001234", kind: "Hostel Account 2", module: "Hostel", status: "Active" },
  ]);

  // Academic Years State
  const [academicYears, setAcademicYears] = useState([
    { id: "ay-1", year: "2026-27", startDate: "2026-06-01", endDate: "2027-05-31", status: "Current", active: true, closed: false },
    { id: "ay-2", year: "2025-26", startDate: "2025-06-01", endDate: "2026-05-31", status: "Completed", active: false, closed: true },
    { id: "ay-3", year: "2027-28", startDate: "2027-06-01", endDate: "2028-05-31", status: "Upcoming", active: false, closed: false },
  ]);

  // Scholarships & Concessions State
  const [scholarships, setScholarships] = useState([
    { id: "sc-1", name: "Jagananna Vidya Deevena (RTF)", type: "Government", student: "V. Sai Kumar (22001A0512)", amount: 45000, applied: 45000, status: "Approved", date: "2026-07-20" },
    { id: "sc-2", name: "Merit Cum Means Concession", type: "Merit", student: "K. Anusha (23001A0408)", amount: 25000, applied: 15000, status: "Under Review", date: "2026-08-10" },
  ]);

  // Detentions & Promotions State
  const [detentions, setDetentions] = useState([
    { id: "dt-1", student: "P. Rakesh Sharma", rollNo: "22001A0345", branch: "Mech", currentYear: "Year 3 (2026-27)", heldYear: "Year 3 (2027-28)", reason: "Shortage of Attendance (<65%)", status: "Detained", date: "2026-08-10" }
  ]);

  // Bulk Upload 5-Stage State
  const [bulkStage, setBulkStage] = useState<"upload" | "validate" | "errors" | "preview" | "confirm" | "summary">("upload");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Audit Logs State (Immutable)
  const [auditLogs, setAuditLogs] = useState([
    { id: "log-1", date: "2026-08-26 11:20:15", user: "Dean Finance (R. Sharma)", role: "Finance Dean", action: "Activated Fee Structure Version v2.0", module: "Fee Structures", student: "N/A", oldValue: "₹42,000", newValue: "₹45,000", ip: "192.168.1.45" },
    { id: "log-2", date: "2026-08-26 10:14:02", user: "Cashier (S. Lakshmi)", role: "Finance Staff", action: "Collected Offline Fee Payment ₹22,500", module: "Fee Collection", student: "B. Ramesh (21001A0501)", oldValue: "Pending ₹45,000", newValue: "Pending ₹22,500", ip: "192.168.1.88" },
    { id: "log-3", date: "2026-08-25 16:45:00", user: "Super Admin", role: "Super Admin", action: "Approved Scholarship RTF ₹45,000", module: "Scholarships", student: "V. Sai Kumar (22001A0512)", oldValue: "Applied", newValue: "Approved", ip: "192.168.1.10" },
  ]);

  // Helper log generator
  const addAuditLog = (action: string, module: string, student: string, oldValue: string, newValue: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: "Current Admin (Finance)",
      role: "Super Admin",
      action,
      module,
      student,
      oldValue,
      newValue,
      ip: "127.0.0.1",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* SECTION 2: ADMIN SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-6 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Admin Fee Suite</h2>
            <p className="text-[11px] text-slate-500 font-medium">EduSuite Pro • Anantapur</p>
          </div>
        </div>

        <nav className="space-y-4 text-xs font-semibold">
          {/* GROUP 1: OVERVIEW */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dashboard</span>
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "dashboard"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Fee Dashboard Overview
            </button>
          </div>

          {/* GROUP 2: CONFIGURATION */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Master Configuration</span>
            {[
              { id: "institution-settings", label: "Institution Settings", icon: Settings },
              { id: "academic-years", label: "Academic Years", icon: Calendar },
              { id: "fee-categories", label: "Fee Categories & Heads", icon: Layers },
              { id: "fee-structures", label: "Fee Structures (Versioning)", icon: Wallet },
              { id: "installments", label: "Installments & Due Dates", icon: Clock },
              { id: "late-fees", label: "Late Fee & Fine Rules", icon: AlertTriangle },
              { id: "bank-accounts", label: "Bank Accounts", icon: CreditCard },
              { id: "payment-settings", label: "Payment Gateways", icon: Sliders },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as NavSection)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* GROUP 3: STUDENT FINANCE */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Finance</span>
            {[
              { id: "fee-collection", label: "Fee Collection Workspace", icon: Search },
              { id: "fee-demands", label: "Demand / Invoice Generator", icon: FileText },
              { id: "student-accounts", label: "Student Fee Ledger", icon: Users },
              { id: "receipts", label: "Receipts Management", icon: Receipt },
              { id: "refunds", label: "Refund Management", icon: RotateCcw },
              { id: "adjustments", label: "Fee Adjustments", icon: RefreshCcw },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as NavSection)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* GROUP 4: SCHOLARSHIPS & ACADEMICS */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scholarships & Standing</span>
            <button
              onClick={() => setActiveSection("scholarships")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "scholarships"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Award className="h-4 w-4" />
              Scholarships & Concessions
            </button>
            <button
              onClick={() => setActiveSection("academic-status")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "academic-status"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <UserX className="h-4 w-4" />
              Promotions & Detentions
            </button>
          </div>

          {/* GROUP 5: BULK & CLEARANCE */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bulk & Clearance</span>
            <button
              onClick={() => setActiveSection("bulk-operations")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "bulk-operations"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              Bulk Excel Engine (5-Stage)
            </button>
            <button
              onClick={() => setActiveSection("clearance-noc")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "clearance-noc"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileCheck className="h-4 w-4" />
              Department Clearance & NOC
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "reports"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Financial Reports & Ageing
            </button>
          </div>

          {/* GROUP 6: GOVERNANCE */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Governance</span>
            <button
              onClick={() => setActiveSection("audit-logs")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "audit-logs"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              Immutable Audit Logs
            </button>
            <button
              onClick={() => setActiveSection("permissions")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "permissions"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Shield className="h-4 w-4" />
              Role Permissions & Reminders
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* SECTION 3: FEE MANAGEMENT DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Fee Management Dashboard Overview
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                    Live System Sync
                  </Badge>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Central financial executive summary for JNTUA College of Engineering.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => toast.success("Exported Master Financial Summary PDF")}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </Button>
                <Button
                  onClick={() => setActiveSection("fee-demands")}
                  size="sm"
                  className="rounded-xl bg-blue-600 text-white text-xs gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Generate Invoices
                </Button>
              </div>
            </div>

            {/* 10 EXECUTIVE SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Demand</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  ₹{(metrics.totalDemand / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-slate-400">Statutory Net Gross</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Collected Amount</span>
                <div className="text-xl font-bold font-mono text-emerald-600">
                  ₹{(metrics.collected / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Reconciled in Bank</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Outstanding</span>
                <div className="text-xl font-bold font-mono text-amber-600">
                  ₹{(metrics.outstanding / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Pending Recovery</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Students With Dues</span>
                <div className="text-xl font-bold font-mono text-blue-600">{metrics.studentsWithDues}</div>
                <span className="text-[10px] text-slate-400">Across enabled modules</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Today's Collection</span>
                <div className="text-xl font-bold font-mono text-purple-600">
                  ₹{(metrics.todayCollection / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-slate-400">Online & Offline Cashier</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Scholarships Given</span>
                <div className="text-xl font-bold font-mono text-indigo-600">
                  ₹{(metrics.scholarshipsGiven / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-slate-400">Government & Merit RTF</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Pending Payments</span>
                <div className="text-xl font-bold font-mono text-rose-600">{metrics.pendingPayments}</div>
                <span className="text-[10px] text-slate-400">Awaiting Webhook / DD</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Refunds</span>
                <div className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                  ₹{(metrics.refunds / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-slate-400">Excess Fee Returned</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 sm:col-span-1 lg:col-span-2">
                <span className="text-[11px] font-semibold text-slate-500 block">Collection Progress</span>
                <div className="flex items-center justify-between text-xs font-bold font-mono text-emerald-600">
                  <span>83.68% Target Reached</span>
                  <span>₹3.55 Cr / ₹4.25 Cr</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "83.68%" }}></div>
                </div>
              </div>
            </div>

            {/* OUTSTANDING BREAKDOWN MATRIX */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Outstanding Recovery Breakdown</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">College Dues</span>
                  <span className="text-sm font-bold font-mono text-amber-600">₹45,50,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Hostel Dues</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">₹12,80,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Previous Year Dues</span>
                  <span className="text-sm font-bold font-mono text-rose-600">₹6,40,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Exam Dues</span>
                  <span className="text-sm font-bold font-mono text-purple-600">₹2,50,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Misc Dues</span>
                  <span className="text-sm font-bold font-mono text-indigo-600">₹1,20,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Late Fees Accumulated</span>
                  <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">₹91,350</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block">Total Outstanding</span>
                  <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-300">₹69,31,350</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: INSTITUTION SETTINGS */}
        {activeSection === "institution-settings" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Institution Level Settings</h2>
              <p className="text-xs text-slate-500">
                Configure institution mode, details, prefixes, and toggle module availability campus-wide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="font-bold block text-slate-800 dark:text-slate-200">Institution Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Both (Unified)", "College Only", "Hostel Only"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setInstitutionConfig((prev) => ({ ...prev, mode: m }))}
                        className={`p-2 rounded-lg font-bold border transition-all text-center ${
                          institutionConfig.mode === m
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold block mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={institutionConfig.name}
                      onChange={(e) => setInstitutionConfig((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">GSTIN</label>
                      <input
                        type="text"
                        value={institutionConfig.gstin}
                        onChange={(e) => setInstitutionConfig((prev) => ({ ...prev, gstin: e.target.value }))}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Receipt Prefix</label>
                      <input
                        type="text"
                        value={institutionConfig.receiptPrefix}
                        onChange={(e) => setInstitutionConfig((prev) => ({ ...prev, receiptPrefix: e.target.value }))}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MODULE CONTROLS TOGGLES */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Enabled Module Controls (14 Toggles)
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { key: "enableCollege", label: "College Fees" },
                    { key: "enableHostel", label: "Hostel Fees" },
                    { key: "enableScholarships", label: "Scholarships Module" },
                    { key: "enableDetentions", label: "Detention Module" },
                    { key: "enableTransport", label: "Transport Fees" },
                    { key: "enableExams", label: "Examination Fees" },
                    { key: "enableLibrary", label: "Library Fees" },
                    { key: "enableLateFees", label: "Late Fees & Fines" },
                    { key: "enableRefunds", label: "Refund Module" },
                    { key: "enableOnlinePay", label: "Online Gateway" },
                    { key: "enableOfflinePay", label: "Offline Cashier" },
                    { key: "enableBulkExcel", label: "Bulk Excel Uploads" },
                    { key: "enableParentPay", label: "Parent Portal Payments" },
                    { key: "enableNoc", label: "Digital NOC Clearance" },
                  ].map((t) => (
                    <label key={t.key} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(institutionConfig as any)[t.key]}
                        onChange={(e) =>
                          setInstitutionConfig((prev) => ({ ...prev, [t.key]: e.target.checked }))
                        }
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button
                onClick={() => {
                  addAuditLog("Updated Institution Settings", "Institution Settings", "All Students", "Old Config", "New Config");
                  toast.success("Saved Campus Institution Settings");
                }}
                className="rounded-xl bg-blue-600 text-white font-bold px-6 text-xs gap-2"
              >
                <Check className="h-4 w-4" /> Save Institution Controls
              </Button>
            </div>
          </div>
        )}

        {/* SECTION 7 & 8: FEE STRUCTURES MASTER WITH VERSIONING */}
        {activeSection === "fee-structures" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Fee Structures Master (Immutable Versioning Engine)
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                    Non-Destructive Versioning
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500">
                  Modifying active fee structures creates a new version while preserving historical student bills.
                </p>
              </div>

              <Button
                onClick={() => {
                  setSelectedFsForVersion(feeStructures[0]);
                  setIsNewVersionModal(true);
                }}
                size="sm"
                className="rounded-xl bg-blue-600 text-white text-xs gap-1.5 shadow-sm font-semibold"
              >
                <Sparkles className="h-4 w-4" /> Create New Version (v3.0)
              </Button>
            </div>

            {/* VERSIONING FLOW DIAGRAM */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between font-mono">
              <span>Current Active Version → <strong>v2.0 (₹45,000)</strong></span>
              <ChevronRight className="h-4 w-4 text-purple-400" />
              <span>Create New Version → <strong>v3.0</strong></span>
              <ChevronRight className="h-4 w-4 text-purple-400" />
              <span>Effective Date → <strong>01-06-2027</strong></span>
              <ChevronRight className="h-4 w-4 text-purple-400" />
              <Badge className="bg-purple-600 text-white text-[10px]">Historical Demands Retained</Badge>
            </div>

            {/* STRUCTURES TABLE */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                    <th className="p-3">Version</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Applies To</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {feeStructures.map((fs) => (
                    <tr key={fs.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-purple-600">{fs.version}</td>
                      <td className="p-3 font-mono">{fs.year}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={fs.module === "Hostel" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}>
                          {fs.module}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{fs.category}</td>
                      <td className="p-3 font-bold font-mono text-blue-600">₹{fs.amount.toLocaleString()}.00</td>
                      <td className="p-3 text-slate-500 text-[11px] max-w-xs truncate">{fs.appliesTo}</td>
                      <td className="p-3 font-mono text-slate-600">{fs.dueDate}</td>
                      <td className="p-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Active</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedFsForVersion(fs);
                            setIsNewVersionModal(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 rounded-md border border-purple-200"
                        >
                          New Version
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 17: DETENTION MANAGEMENT (SEPARATE FROM FINANCIAL DUES) */}
        {activeSection === "academic-status" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Academic Status Engine: Promotions & Detentions
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    Strict Financial Isolation
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500">
                  Detention is academic standing, not unpaid fees. A student can be detained even if fees are fully paid.
                </p>
              </div>

              <Button
                onClick={() => {
                  const newDt = {
                    id: `dt-${Date.now()}`,
                    student: "K. Harish Chandra",
                    rollNo: "21001A0410",
                    branch: "ECE",
                    currentYear: "Year 4 (2026-27)",
                    heldYear: "Year 4 (2027-28)",
                    reason: "Academic Shortage of Credits",
                    status: "Detained",
                    date: "2026-08-20",
                  };
                  setDetentions((prev) => [newDt, ...prev]);
                  addAuditLog("Applied Academic Detention", "Detentions", "K. Harish (21001A0410)", "Promoted", "Detained");
                  toast.error("Applied Academic Detention Hold");
                }}
                size="sm"
                variant="destructive"
                className="rounded-xl text-xs gap-1.5"
              >
                <UserX className="h-4 w-4" /> Detain Student
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium">
              ⚠️ <strong>Governance Rule #17:</strong> Financial clearance has zero effect on academic detentions. Promoting or detaining a student alters their academic standing log without silently clearing or creating fee demands.
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                    <th className="p-3">Student</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Current Year</th>
                    <th className="p-3">Held Year</th>
                    <th className="p-3">Detention Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detentions.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {d.student}
                        <span className="block text-[10px] text-slate-400 font-mono">{d.rollNo}</span>
                      </td>
                      <td className="p-3 text-slate-700">{d.branch}</td>
                      <td className="p-3 font-mono">{d.currentYear}</td>
                      <td className="p-3 font-mono text-rose-600 font-bold">{d.heldYear}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{d.reason}</td>
                      <td className="p-3">
                        <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">{d.status}</Badge>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setDetentions((prev) => prev.filter((item) => item.id !== d.id));
                            addAuditLog("Revoked Academic Detention", "Detentions", d.student, "Detained", "Promoted");
                            toast.success(`Revoked detention for ${d.student}`);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200"
                        >
                          Promote / Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 25: BULK EXCEL OPERATIONS (5-STAGE PIPELINE) */}
        {activeSection === "bulk-operations" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Bulk Excel Operations Pipeline</h2>
              <p className="text-xs text-slate-500">
                Safe 5-stage import pipeline: Upload → Validate → Show Errors → Preview → Confirm & Summary.
              </p>
            </div>

            {/* 5 STAGE PROGRESS BAR */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold font-mono">
              {[
                { id: "upload", step: "1. Upload File" },
                { id: "validate", step: "2. Validate Schema" },
                { id: "errors", step: "3. Error Report" },
                { id: "preview", step: "4. Preview Data" },
                { id: "confirm", step: "5. Confirm Import" },
              ].map((s) => (
                <div
                  key={s.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    bulkStage === s.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {s.step}
                </div>
              ))}
            </div>

            {/* STAGE 1: UPLOAD */}
            {bulkStage === "upload" && (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
                <UploadCloud className="h-10 w-10 text-blue-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Excel File (.xlsx / .csv)</h3>
                  <p className="text-xs text-slate-400">Import student dues, fee structures, or previous balance ledgers.</p>
                </div>
                <input
                  type="file"
                  id="bulk-file-input"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFileName(e.target.files[0].name);
                      setBulkStage("validate");
                      toast.info("Validating Excel schema and row constraints...");
                    }
                  }}
                />
                <Button
                  onClick={() => document.getElementById("bulk-file-input")?.click()}
                  className="rounded-xl bg-blue-600 text-white text-xs font-bold px-6"
                >
                  Browse File
                </Button>
              </div>
            )}

            {/* STAGE 2: VALIDATE */}
            {bulkStage === "validate" && (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>Validating {uploadedFileName || "Student_Dues_2026.xlsx"}...</span>
                  <span className="text-emerald-600">864 Rows Analyzed</span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs font-mono text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Total Rows</span>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">864</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 text-emerald-600">
                    <span className="text-[10px] block">Valid Rows</span>
                    <span className="text-lg font-bold">860</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 text-rose-600">
                    <span className="text-[10px] block">Invalid Rows</span>
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 text-amber-600">
                    <span className="text-[10px] block">Duplicates</span>
                    <span className="text-lg font-bold">0</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={() => setBulkStage("errors")} variant="outline" size="sm" className="rounded-xl text-xs">
                    View 4 Errors
                  </Button>
                  <Button onClick={() => setBulkStage("preview")} size="sm" className="rounded-xl bg-blue-600 text-white text-xs font-bold">
                    Proceed to Preview (860 Valid)
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE 3: ERRORS */}
            {bulkStage === "errors" && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/30 text-xs space-y-3">
                <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
                  <span>Excel Validation Error Report (4 Rows Failed)</span>
                  <Button size="sm" variant="outline" className="text-[11px] h-7 gap-1 border-rose-300">
                    <Download className="h-3 w-3" /> Download Error Excel
                  </Button>
                </div>
                <ul className="list-disc pl-5 text-[11px] text-rose-700 dark:text-rose-200 space-y-1 font-mono">
                  <li>Row 42: Invalid Roll Number format `22001A0` (Missing 2 digits).</li>
                  <li>Row 108: Fee Head `Exam Fee` amount negative `-1500.00`.</li>
                  <li>Row 315: Duplicate Roll Number `23001A0512` in same sheet.</li>
                  <li>Row 740: Academic Year `2028-29` is not configured in master.</li>
                </ul>
                <Button onClick={() => setBulkStage("preview")} size="sm" className="rounded-xl bg-blue-600 text-white text-xs">
                  Ignore Errors & Continue with 860 Valid Rows
                </Button>
              </div>
            )}

            {/* STAGE 4 & 5: PREVIEW & CONFIRM */}
            {(bulkStage === "preview" || bulkStage === "confirm") && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200 flex items-center justify-between">
                  <span>Ready to import 860 valid records into Fee Ledger database.</span>
                  <Button
                    onClick={() => {
                      addAuditLog("Executed Bulk Excel Import", "Bulk Engine", "860 Students", "0 Records", "860 Fee Records Imported");
                      toast.success("Successfully imported 860 student fee records!");
                      setBulkStage("upload");
                    }}
                    size="sm"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Confirm & Execute Bulk Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 24: NO-DUE / NOC CLEARANCE CONFIGURATION */}
        {activeSection === "clearance-noc" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Departmental Clearance Matrix & Digital NOC
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">
                    Automated Clearance Engine
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500">
                  Digital No-Due Certificate is issued automatically when all mandatory departments clear student status.
                </p>
              </div>

              <Button
                onClick={() => toast.success("Downloaded Statutory Digital NOC PDF")}
                size="sm"
                className="rounded-xl bg-blue-600 text-white text-xs gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" /> Sample Digital NOC PDF
              </Button>
            </div>

            {/* CLEARANCE DEPARTMENTS MATRIX */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                { dept: "Finance Dept", status: "Cleared", mandatory: true },
                { dept: "Library Dept", status: "Cleared", mandatory: true },
                { dept: "Hostel Admin", status: "Cleared", mandatory: true },
                { dept: "Transport Fleet", status: "Cleared", mandatory: false },
                { dept: "Department Labs", status: "Cleared", mandatory: true },
                { dept: "Exam Cell", status: "Cleared", mandatory: true },
              ].map((d) => (
                <div key={d.dept} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">{d.dept}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">
                    {d.status}
                  </Badge>
                  <span className="text-[9px] text-slate-400 block font-mono">
                    {d.mandatory ? "Mandatory" : "Optional"}
                  </span>
                </div>
              ))}
            </div>

            {/* SAMPLE NOC CERTIFICATE */}
            <div className="p-6 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">DIGITAL NO-DUE CERTIFICATE (NOC)</h3>
                    <p className="text-[11px] text-slate-500 font-mono">NOC Ref: NOC-JNTUA-2026-08912</p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white font-mono text-xs">FULLY CLEARED</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Student Name</span>
                  <span className="font-bold">B. Ramesh Naidu</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Roll Number</span>
                  <span className="font-bold">21001A0501</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Programme / Branch</span>
                  <span className="font-bold">B.Tech (CSE)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 26: FINANCIAL REPORTS & AGEING ANALYSIS */}
        {activeSection === "reports" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Financial Reports & Ageing Analysis</h2>
              <p className="text-xs text-slate-500">
                Track outstanding dues by ageing buckets (0-30 days, 31-60 days, 61-90 days, 90+ days).
              </p>
            </div>

            {/* AGEING BUCKETS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">0 - 30 Days</span>
                <span className="text-xl font-bold font-mono text-emerald-600">₹32,40,000</span>
                <span className="text-[10px] text-slate-400 block mt-1">420 Students</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block">31 - 60 Days</span>
                <span className="text-xl font-bold font-mono text-amber-600">₹21,15,000</span>
                <span className="text-[10px] text-slate-400 block mt-1">260 Students</span>
              </div>
              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <span className="text-[10px] text-orange-700 dark:text-orange-300 font-bold block">61 - 90 Days</span>
                <span className="text-xl font-bold font-mono text-orange-600">₹10,50,000</span>
                <span className="text-[10px] text-slate-400 block mt-1">115 Students</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold block">90+ Days (Critical)</span>
                <span className="text-xl font-bold font-mono text-rose-600">₹5,26,350</span>
                <span className="text-[10px] text-rose-600 font-bold block mt-1">69 Students (Gated)</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 30: IMMUTABLE AUDIT LOGS */}
        {activeSection === "audit-logs" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  System Governance: Immutable Financial Audit Logs
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[10px]">
                    Read-Only Audit Ledger
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500">
                  Every financial mutation, fee structure change, and concession is logged with user, IP, and timestamp.
                </p>
              </div>

              <Button
                onClick={() => toast.success("Exported Audit Log JSON/CSV")}
                size="sm"
                variant="outline"
                className="rounded-xl text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Export Audit Trail
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User & Role</th>
                    <th className="p-3">Action Executed</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Student Target</th>
                    <th className="p-3">Old Value</th>
                    <th className="p-3">New Value</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-500">{log.date}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {log.user}
                        <span className="block text-[9px] text-blue-600">{log.role}</span>
                      </td>
                      <td className="p-3 text-slate-800 dark:text-slate-200 font-sans font-medium">{log.action}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[9px]">{log.module}</Badge>
                      </td>
                      <td className="p-3 text-slate-600">{log.student}</td>
                      <td className="p-3 text-rose-500">{log.oldValue}</td>
                      <td className="p-3 text-emerald-600 font-bold">{log.newValue}</td>
                      <td className="p-3 text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEFAULT FALLBACK FOR OTHER SECTIONS */}
        {![
          "dashboard",
          "institution-settings",
          "fee-structures",
          "academic-status",
          "bulk-operations",
          "clearance-noc",
          "reports",
          "audit-logs",
        ].includes(activeSection) && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 w-fit mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {activeSection.replace("-", " ")} Workspace
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This module is active and connected to the central Fee Management Engine for JNTUA College of Engineering.
            </p>
            <Button
              onClick={() => setActiveSection("dashboard")}
              size="sm"
              className="rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Return to Overview Dashboard
            </Button>
          </div>
        )}
      </main>

      {/* MODAL: NEW VERSION ENGINE (v3.0) */}
      {isNewVersionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Fee Structure Version v3.0
              </h3>
              <button onClick={() => setIsNewVersionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-900 text-[11px] border border-purple-200">
                <strong>Versioning Guard:</strong> Creating version v3.0 will leave existing invoices on v2.0 (₹45,000) intact. New student demands generated after 01-06-2027 will use v3.0.
              </div>

              <div>
                <label className="font-semibold block mb-1">Fee Category</label>
                <input
                  type="text"
                  readOnly
                  value={selectedFsForVersion?.category || "College Tuition Fee"}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">New Version Amount (₹)</label>
                <input
                  type="number"
                  value={newVersionAmount}
                  onChange={(e) => setNewVersionAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm font-bold text-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setIsNewVersionModal(false)} variant="outline" size="sm" className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const newFs = {
                    id: `fs-${Date.now()}`,
                    version: "v3.0",
                    year: "2027-2028",
                    module: selectedFsForVersion?.module || "College",
                    category: selectedFsForVersion?.category || "Tuition Fee",
                    kind: selectedFsForVersion?.kind || "Tuition Fee",
                    amount: newVersionAmount,
                    programme: "B.Tech",
                    branch: "All Branches",
                    appliesTo: "2027-2028 Enrolled Cohort",
                    dueDate: "2027-07-15",
                    installment: "Installment 1 (50%)",
                    lateFeeRule: "Standard (₹100 + ₹20/day)",
                    bankAccount: "Tuition Fee Account (TUITION-001)",
                    status: "Active",
                  };
                  setFeeStructures((prev) => [newFs, ...prev]);
                  addAuditLog("Created Fee Structure Version v3.0", "Fee Structures", "All Future Cohorts", "v2.0 (₹45,000)", `v3.0 (₹${newVersionAmount.toLocaleString()})`);
                  toast.success("Activated Fee Structure Version v3.0!");
                  setIsNewVersionModal(false);
                }}
                size="sm"
                className="rounded-xl bg-purple-600 text-white font-bold"
              >
                Activate Version v3.0
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
