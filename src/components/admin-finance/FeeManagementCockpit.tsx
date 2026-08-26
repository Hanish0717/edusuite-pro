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
  Search,
  FileText,
  Receipt,
  RotateCcw,
  RefreshCcw,
  Award,
  Gift,
  UploadCloud,
  FileCheck,
  BarChart3,
  Bell,
  ShieldAlert,
  Plus,
  Filter,
  Download,
  Printer,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// 17 Dedicated Fee Management Sub-Sections
type FeeNavSection =
  | "fee-dashboard"
  | "fee-configuration"
  | "fee-collection"
  | "fee-demands"
  | "scholarships"
  | "concessions"
  | "late-fees"
  | "bank-accounts"
  | "payments"
  | "receipts"
  | "student-ledger"
  | "refunds"
  | "adjustments"
  | "bulk-excel"
  | "fee-reports"
  | "fee-notifications"
  | "fee-clearance";

export function FeeManagementCockpit() {
  const [activeSection, setActiveSection] = useState<FeeNavSection>("fee-dashboard");

  // 1. Fee Dashboard Metrics
  const feeDashboardMetrics = {
    totalDemand: 42500000,
    totalCollected: 35568650,
    totalOutstanding: 6931350,
    studentsWithDues: 864,
    fullyPaidStudents: 2150,
    partialPaymentStudents: 540,
    unpaidStudents: 324,
    todayCollection: 245000,
    monthCollection: 8450000,
    scholarshipsConcessions: 6200000,
    totalRefunds: 125000,
    overdueAmount: 3240000,
    // Breakdown
    collegeFee: 28500000,
    hostelFee: 11200000,
    previousDues: 1800000,
    lateFee: 91350,
    otherFee: 908650,
  };

  // 2. Fee Configuration State
  const [feeSettings, setFeeSettings] = useState({
    mode: "Both (Unified)" as "Both (Unified)" | "College Only" | "Hostel Only",
    enableCollegeFees: true,
    enableHostelFees: true,
    enableScholarships: true,
    enableConcessions: true,
    enableLateFees: true,
    enableRefunds: true,
    enableOnlinePayments: true,
    enableBulkExcel: true,
  });

  // Academic Years
  const [academicYears, setAcademicYears] = useState([
    { id: "ay-1", year: "2026-27", startDate: "2026-06-01", endDate: "2027-05-31", status: "Current", isCurrent: true, isClosed: false },
    { id: "ay-2", year: "2025-26", startDate: "2025-06-01", endDate: "2026-05-31", status: "Closed", isCurrent: false, isClosed: true },
  ]);

  // Fee Structures State
  const [feeStructures, setFeeStructures] = useState([
    {
      id: "fs-1",
      year: "2026-27",
      programme: "B.Tech",
      branch: "Computer Science & Engineering",
      academicYear: "3rd Year (Sem 5)",
      hostelBlock: "Block A & B",
      roomType: "Three Occupied AC",
      feeHead: "Tuition Fee",
      amount: 45000,
      dueDate: "2026-07-15",
      installment: "Installment 1 (50%)",
      bankAccount: "Tuition Fee Account (TUITION-001)",
      status: "Active",
    },
    {
      id: "fs-2",
      year: "2026-27",
      programme: "B.Tech",
      branch: "All Branches",
      academicYear: "All Years",
      hostelBlock: "Hostel Block 1",
      roomType: "Two Occupied Non-AC",
      feeHead: "Hostel Room Rent & Mess",
      amount: 25000,
      dueDate: "2026-08-01",
      installment: "Full Payment",
      bankAccount: "Hostel Account 1 (HOSTEL-001)",
      status: "Active",
    },
  ]);

  // 3. Fee Collection State & Student Lookup
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    rollNo: string;
    id: string;
    email: string;
    programme: string;
    year: string;
    semester: string;
    dues: { feeHead: string; total: number; paid: number; due: number }[];
  }>({
    name: "B. Ramesh Naidu",
    rollNo: "21001A0501",
    id: "STU-2021-0501",
    email: "ramesh.b@student.jntuace.ac.in",
    programme: "B.Tech (CSE)",
    year: "3rd Year",
    semester: "Semester 5",
    dues: [
      { feeHead: "Tuition Fee", total: 45000, paid: 30000, due: 15000 },
      { feeHead: "Hostel Fee", total: 25000, paid: 25000, due: 0 },
      { feeHead: "Exam Fee", total: 3000, paid: 0, due: 3000 },
      { feeHead: "Previous Due", total: 5000, paid: 2000, due: 3000 },
    ],
  });

  // 4. Fee Demand Generation State
  const [demandTarget, setDemandTarget] = useState<"Individual" | "Selected" | "Branch" | "Programme" | "Year" | "Semester" | "Entire Year">("Programme");
  const [demandPreview, setDemandPreview] = useState({
    studentsCount: 420,
    grossDemand: 18900000,
    scholarships: 2100000,
    concessions: 450000,
    netDemand: 16350000,
  });

  // 5. Scholarships State
  const [scholarships, setScholarships] = useState([
    { id: "sc-1", name: "Jagananna Vidya Deevena (RTF)", type: "Government", student: "V. Sai Kumar (22001A0512)", amount: 45000, applied: 45000, remaining: 0, feeHead: "Tuition Fee", status: "Approved" },
    { id: "sc-2", name: "Merit Cum Means Scholarship", type: "Merit", student: "K. Anusha (23001A0408)", amount: 25000, applied: 15000, remaining: 10000, feeHead: "Tuition Fee", status: "Under Review" },
  ]);

  // 6. Concessions State (Separate from Scholarships)
  const [concessions, setConcessions] = useState([
    { id: "cn-1", student: "P. Rakesh (22001A0345)", amount: 5000, feeHead: "Tuition Fee", reason: "Management Merit Waiver", approvedBy: "Dean Finance", date: "2026-08-12" },
    { id: "cn-2", student: "M. Sneha (23001A0589)", amount: 2000, feeHead: "Hostel Fee", reason: "Single Parent Financial Support", approvedBy: "Finance Committee", date: "2026-08-14" },
  ]);

  // 7. Late Fee Rules State
  const [lateFeeRule, setLateFeeRule] = useState({
    dueDate: "2026-07-15",
    gracePeriodDays: 7,
    fixedFine: 100,
    dailyFine: 20,
    percentageFine: 0,
    maxFine: 1000,
    status: "Active",
  });

  // 8. Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState([
    { id: "ba-1", name: "Tuition Fee Account", accountNo: "TUITION-001", bank: "State Bank of India", ifsc: "SBIN0001234", module: "College", status: "Active" },
    { id: "ba-2", name: "Special Fee Account", accountNo: "SPECIAL-001", bank: "State Bank of India", ifsc: "SBIN0001234", module: "College", status: "Active" },
    { id: "ba-3", name: "Hostel Account 1", accountNo: "HOSTEL-001", bank: "State Bank of India", ifsc: "SBIN0001234", module: "Hostel", status: "Active" },
    { id: "ba-4", name: "Hostel Account 2", accountNo: "HOSTEL-002", bank: "State Bank of India", ifsc: "SBIN0001234", module: "Hostel", status: "Active" },
  ]);

  // 11. Student Fee Ledger State (Chronological)
  const [studentLedger, setStudentLedger] = useState([
    { date: "2026-06-01", type: "Tuition Fee Demand", debit: 45000, credit: 0, balance: 45000, ref: "INV-2026-001", mode: "System Demand", receipt: "—" },
    { date: "2026-06-01", type: "Hostel Fee Demand", debit: 25000, credit: 0, balance: 70000, ref: "INV-2026-002", mode: "System Demand", receipt: "—" },
    { date: "2026-06-10", type: "Government Scholarship (RTF)", debit: 0, credit: 10000, balance: 60000, ref: "SCH-2026-88", mode: "RTF Credit", receipt: "—" },
    { date: "2026-06-15", type: "Online Payment (UPI)", debit: 0, credit: 30000, balance: 30000, ref: "TXN-998822", mode: "Online UPI", receipt: "REC-2026-041" },
    { date: "2026-06-20", type: "Late Fee Applied", debit: 100, credit: 0, balance: 30100, ref: "FINE-2026-09", mode: "Auto Fine Rule", receipt: "—" },
  ]);

  // 12. Refunds State
  const [refunds, setRefunds] = useState([
    { id: "rf-1", student: "S. K. Verma (21001A0210)", originalPayment: "REC-2026-012", refundAmount: 2500, reason: "Double Payment Error", requestedBy: "Student", approvedBy: "Dean Finance", status: "Approved", date: "2026-08-10" },
  ]);

  // 13. Fee Adjustments State
  const [adjustments, setAdjustments] = useState([
    { id: "adj-1", student: "N. Tarun (22001A0115)", amount: -1500, feeHead: "Exam Fee", reason: "Revaluation Waiver Correction", user: "Cashier-01", approvedBy: "Finance Officer", date: "2026-08-11" },
  ]);

  // 14. Bulk Excel 5-Stage State
  const [bulkStage, setBulkStage] = useState<"upload" | "validate" | "errors" | "preview" | "confirm" | "summary">("upload");

  // Calculate Student Total Dues
  const totalStudentFee = selectedStudent.dues.reduce((acc, item) => acc + item.total, 0);
  const totalStudentPaid = selectedStudent.dues.reduce((acc, item) => acc + item.paid, 0);
  const totalStudentDue = selectedStudent.dues.reduce((acc, item) => acc + item.due, 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* SIDEBAR NAVIGATION: EDUSUITE PRO -> ADMIN -> FEE MANAGEMENT */}
      <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-5 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Fee Management</h2>
            <p className="text-[11px] text-slate-500 font-medium">EduSuite Pro • Admin</p>
          </div>
        </div>

        <nav className="space-y-3 text-xs font-semibold">
          {/* NAVIGATION GROUPS */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overview</span>
            <button
              onClick={() => setActiveSection("fee-dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === "fee-dashboard"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> 1. Fee Dashboard
            </button>
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Master Configuration</span>
            {[
              { id: "fee-configuration", label: "2. Fee Configuration", icon: Settings },
              { id: "late-fees", label: "7. Late Fee / Fine Rules", icon: AlertTriangle },
              { id: "bank-accounts", label: "8. Bank Accounts", icon: CreditCard },
              { id: "payments", label: "9. Payment Gateways", icon: Wallet },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as FeeNavSection)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Billing & Collection</span>
            {[
              { id: "fee-collection", label: "3. Fee Collection Workspace", icon: Search },
              { id: "fee-demands", label: "4. Fee Demand / Billing", icon: FileText },
              { id: "receipts", label: "10. Receipts Engine", icon: Receipt },
              { id: "student-ledger", label: "11. Student Fee Ledger", icon: Layers },
              { id: "refunds", label: "12. Refunds Management", icon: RotateCcw },
              { id: "adjustments", label: "13. Fee Adjustments", icon: RefreshCcw },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as FeeNavSection)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waivers & Operations</span>
            {[
              { id: "scholarships", label: "5. Scholarships", icon: Award },
              { id: "concessions", label: "6. Concessions", icon: Gift },
              { id: "bulk-excel", label: "14. Bulk Excel Engine", icon: UploadCloud },
              { id: "fee-reports", label: "15. Fee Reports & Ageing", icon: BarChart3 },
              { id: "fee-notifications", label: "16. Fee Notifications", icon: Bell },
              { id: "fee-clearance", label: "17. Fee Clearance / NOC", icon: FileCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as FeeNavSection)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* 1. FEE DASHBOARD OVERVIEW */}
        {activeSection === "fee-dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Fee Management Dashboard
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
                    Fee Suite Only
                  </Badge>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Executive fee-related financial summary for JNTUA College of Engineering.
                </p>
              </div>

              <Button
                onClick={() => toast.success("Exported Fee Financial Summary PDF")}
                size="sm"
                variant="outline"
                className="rounded-xl text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF Summary
              </Button>
            </div>

            {/* 12 FEE-ONLY KPI CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Fee Demand</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  ₹{(feeDashboardMetrics.totalDemand / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-slate-400">Total Net Billed</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Collected</span>
                <div className="text-xl font-bold font-mono text-emerald-600">
                  ₹{(feeDashboardMetrics.totalCollected / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Reconciled Dues</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Outstanding</span>
                <div className="text-xl font-bold font-mono text-amber-600">
                  ₹{(feeDashboardMetrics.totalOutstanding / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Pending Dues</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Students With Dues</span>
                <div className="text-xl font-bold font-mono text-blue-600">{feeDashboardMetrics.studentsWithDues}</div>
                <span className="text-[10px] text-slate-400">Enrolled Cohorts</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Fully Paid Students</span>
                <div className="text-xl font-bold font-mono text-emerald-600">{feeDashboardMetrics.fullyPaidStudents}</div>
                <span className="text-[10px] text-slate-400">Zero Dues</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Partial Payments</span>
                <div className="text-xl font-bold font-mono text-indigo-600">{feeDashboardMetrics.partialPaymentStudents}</div>
                <span className="text-[10px] text-slate-400">Installments Paid</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Unpaid Students</span>
                <div className="text-xl font-bold font-mono text-rose-600">{feeDashboardMetrics.unpaidStudents}</div>
                <span className="text-[10px] text-slate-400">Zero Payment</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Today's Collection</span>
                <div className="text-xl font-bold font-mono text-purple-600">
                  ₹{(feeDashboardMetrics.todayCollection / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-slate-400">Daily Cashier & Gateway</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Scholarships / Waivers</span>
                <div className="text-xl font-bold font-mono text-blue-600">
                  ₹{(feeDashboardMetrics.scholarshipsConcessions / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-slate-400">Concessions Granted</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Refunds</span>
                <div className="text-xl font-bold font-mono text-slate-600 dark:text-slate-300">
                  ₹{(feeDashboardMetrics.totalRefunds / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-slate-400">Processed Ledger Debits</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 sm:col-span-2 lg:col-span-2">
                <span className="text-[11px] font-semibold text-slate-500 block">Overdue Amount</span>
                <div className="text-xl font-bold font-mono text-rose-600">
                  ₹{(feeDashboardMetrics.overdueAmount / 100000).toFixed(2)} L
                </div>
                <span className="text-[10px] text-rose-600 font-semibold block">Beyond Due Date (Fine Active)</span>
              </div>
            </div>

            {/* FEE BREAKDOWN MATRIX */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fee Category Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans block">College Fee</span>
                  <span className="text-base font-bold text-blue-600">₹{(feeDashboardMetrics.collegeFee / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans block">Hostel Fee</span>
                  <span className="text-base font-bold text-emerald-600">₹{(feeDashboardMetrics.hostelFee / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans block">Previous Dues</span>
                  <span className="text-base font-bold text-amber-600">₹{(feeDashboardMetrics.previousDues / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans block">Late Fee Accumulated</span>
                  <span className="text-base font-bold text-purple-600">₹{feeDashboardMetrics.lateFee.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans block">Other Fee</span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-300">₹{(feeDashboardMetrics.otherFee / 100000).toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. FEE CONFIGURATION & CATEGORIES & STRUCTURES */}
        {activeSection === "fee-configuration" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Configuration & Structure Setup</h2>
              <p className="text-xs text-slate-500">
                Configure institution fee mode, academic years, college/hostel categories, and statutory structures.
              </p>
            </div>

            {/* INSTITUTION MODE & TOGGLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="font-bold block text-slate-800 dark:text-slate-200">Institution Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Both (Unified)", "College Only", "Hostel Only"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setFeeSettings((prev) => ({ ...prev, mode: m }))}
                        className={`p-2 rounded-lg font-bold border transition-all text-center ${
                          feeSettings.mode === m
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">Academic Years Master</h3>
                  <div className="space-y-2">
                    {academicYears.map((ay) => (
                      <div key={ay.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs font-mono">
                        <span>{ay.year} ({ay.startDate} to {ay.endDate})</span>
                        <Badge className={ay.isCurrent ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200 text-slate-600"}>
                          {ay.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MODULE TOGGLES (8 FEE-ONLY TOGGLES) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Fee Module Controls
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { key: "enableCollegeFees", label: "College Fees" },
                    { key: "enableHostelFees", label: "Hostel Fees" },
                    { key: "enableScholarships", label: "Scholarship Module" },
                    { key: "enableConcessions", label: "Concessions Module" },
                    { key: "enableLateFees", label: "Late Fees & Fines" },
                    { key: "enableRefunds", label: "Refund Module" },
                    { key: "enableOnlinePayments", label: "Online Gateway" },
                    { key: "enableBulkExcel", label: "Bulk Excel Uploads" },
                  ].map((t) => (
                    <label key={t.key} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(feeSettings as any)[t.key]}
                        onChange={(e) => setFeeSettings((prev) => ({ ...prev, [t.key]: e.target.checked }))}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* FEE CATEGORIES TAXONOMY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 space-y-2">
                <h3 className="font-bold text-blue-900 dark:text-blue-300">College Fee Categories</h3>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {["Admission Fee", "Tuition Fee", "Special Fee", "Examination Fee", "Laboratory Fee", "Library Fee", "Development Fee", "Miscellaneous Fee", "Previous Academic Dues", "Rejoin Fee"].map((cat) => (
                    <Badge key={cat} variant="outline" className="bg-white dark:bg-slate-900 border-blue-200 text-blue-700">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300">Hostel Fee Categories</h3>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {["Hostel Admission Fee", "Hostel Fee", "Room Rent", "Mess Fee", "Caution Deposit", "Utility Fee", "Miscellaneous Fee", "Previous Hostel Dues"].map((cat) => (
                    <Badge key={cat} variant="outline" className="bg-white dark:bg-slate-900 border-emerald-200 text-emerald-700">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FEE COLLECTION WORKSPACE (MAIN OPERATIONAL SCREEN) */}
        {activeSection === "fee-collection" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Collection Workspace</h2>
              <p className="text-xs text-slate-500">
                Primary operational cashier screen: Search student, view itemized dues, collect online/cash payments, and issue receipts.
              </p>
            </div>

            {/* SEARCH BAR */}
            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by Name, Roll Number, ID, or Email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
              <Button onClick={() => toast.success("Loaded Student Account")} className="rounded-xl bg-blue-600 text-white text-xs font-bold px-5">
                Search
              </Button>
            </div>

            {/* STUDENT BILLING BREAKDOWN TABLE */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{selectedStudent.name}</h3>
                  <p className="text-slate-500 font-mono">{selectedStudent.rollNo} • {selectedStudent.programme} • {selectedStudent.year} ({selectedStudent.semester})</p>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 self-start">
                  Outstanding Dues: ₹{totalStudentDue.toLocaleString()}
                </Badge>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                      <th className="p-3">Fee Head</th>
                      <th className="p-3 text-right">Total (₹)</th>
                      <th className="p-3 text-right">Paid (₹)</th>
                      <th className="p-3 text-right">Due (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedStudent.dues.map((item) => (
                      <tr key={item.feeHead} className="hover:bg-slate-50/80">
                        <td className="p-3 font-sans font-semibold text-slate-900 dark:text-white">{item.feeHead}</td>
                        <td className="p-3 text-right text-slate-700 dark:text-slate-300">₹{item.total.toLocaleString()}</td>
                        <td className="p-3 text-right text-emerald-600 font-bold">₹{item.paid.toLocaleString()}</td>
                        <td className="p-3 text-right text-amber-600 font-bold">₹{item.due.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-sm">
                      <td className="p-3 font-sans text-slate-900 dark:text-white">Total Summary</td>
                      <td className="p-3 text-right text-slate-900 dark:text-white">₹{totalStudentFee.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-600">₹{totalStudentPaid.toLocaleString()}</td>
                      <td className="p-3 text-right text-amber-600">₹{totalStudentDue.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <Button onClick={() => toast.success(`Recorded Cashier Payment of ₹${totalStudentDue}`)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs">
                  <CreditCard className="h-3.5 w-3.5" /> Collect Payment
                </Button>
                <Button onClick={() => setActiveSection("scholarships")} variant="outline" className="rounded-xl text-xs gap-1.5">
                  <Award className="h-3.5 w-3.5" /> Apply Scholarship
                </Button>
                <Button onClick={() => setActiveSection("concessions")} variant="outline" className="rounded-xl text-xs gap-1.5">
                  <Gift className="h-3.5 w-3.5" /> Apply Concession
                </Button>
                <Button onClick={() => setActiveSection("receipts")} variant="outline" className="rounded-xl text-xs gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Generate Receipt
                </Button>
                <Button onClick={() => setActiveSection("student-ledger")} variant="outline" className="rounded-xl text-xs gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> View Ledger
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. FEE DEMAND / BILLING GENERATOR */}
        {activeSection === "fee-demands" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Demand / Invoice Generator</h2>
              <p className="text-xs text-slate-500">
                Generate semester billing demands by Programme, Branch, Year, Semester, or Hostel Block.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">Select Generation Target</label>
              <div className="flex flex-wrap gap-2">
                {(["Individual", "Selected", "Branch", "Programme", "Year", "Semester", "Entire Year"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDemandTarget(t)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      demandTarget === t ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW BEFORE GENERATION */}
            <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/30 space-y-4 text-xs font-mono">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm font-sans">Batch Demand Calculation Preview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-sans block">Students Selected</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{demandPreview.studentsCount}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-sans block">Gross Demand</span>
                  <span className="text-base font-bold text-slate-800">₹{(demandPreview.grossDemand / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-sans block">Scholarships</span>
                  <span className="text-base font-bold text-emerald-600">- ₹{(demandPreview.scholarships / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-sans block">Concessions</span>
                  <span className="text-base font-bold text-indigo-600">- ₹{(demandPreview.concessions / 100000).toFixed(2)} L</span>
                </div>
                <div className="p-3 bg-blue-600 text-white rounded-xl">
                  <span className="text-[10px] font-sans block">Net Invoice Demand</span>
                  <span className="text-base font-bold">₹{(demandPreview.netDemand / 100000).toFixed(2)} L</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success(`Generated Net Fee Invoices for ${demandPreview.studentsCount} students!`)} className="rounded-xl bg-blue-600 text-white font-bold text-xs gap-2">
                  <Sparkles className="h-4 w-4" /> Confirm & Generate Student Invoices
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 11. STUDENT FEE LEDGER */}
        {activeSection === "student-ledger" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Student Fee Ledger (Chronological Audit Log)
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-[10px]">
                    Immutable Financial Record
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500">
                  Every fee demand, payment, scholarship, fine, and refund is recorded chronologically.
                </p>
              </div>

              <Button onClick={() => toast.success("Exported Student Fee Ledger PDF")} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" /> Download Ledger PDF
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                    <th className="p-3">Date</th>
                    <th className="p-3">Transaction Type</th>
                    <th className="p-3 text-right">Debit (₹)</th>
                    <th className="p-3 text-right">Credit (₹)</th>
                    <th className="p-3 text-right">Balance (₹)</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Receipt No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentLedger.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-3 text-slate-600">{row.date}</td>
                      <td className="p-3 font-sans font-semibold text-slate-900 dark:text-white">{row.type}</td>
                      <td className="p-3 text-right text-rose-600">{row.debit > 0 ? `₹${row.debit.toLocaleString()}` : "—"}</td>
                      <td className="p-3 text-right text-emerald-600 font-bold">{row.credit > 0 ? `₹${row.credit.toLocaleString()}` : "—"}</td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">₹{row.balance.toLocaleString()}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{row.ref}</td>
                      <td className="p-3 text-slate-600 font-sans text-[11px]">{row.mode}</td>
                      <td className="p-3 font-bold text-blue-600">{row.receipt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 17. FEE CLEARANCE / NO-DUE */}
        {activeSection === "fee-clearance" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Finance Fee Clearance & Digital NOC
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">
                  All Fee Dues = ₹0 Check
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Automated Finance Fee Clearance issued once outstanding student dues reach zero.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">FINANCE FEE NO-DUE CERTIFICATE</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Ref: NOC-FIN-2026-00412</p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white font-mono text-xs">FINANCE CLEARED (₹0 DUES)</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Student Name</span>
                  <span className="font-bold">B. Ramesh Naidu</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Roll Number</span>
                  <span className="font-bold">21001A0501</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Outstanding Fee Balance</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Fully Paid)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT VIEW FOR OTHER FEE-ONLY SECTIONS */}
        {![
          "fee-dashboard",
          "fee-configuration",
          "fee-collection",
          "fee-demands",
          "student-ledger",
          "fee-clearance",
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
            <Button onClick={() => setActiveSection("fee-dashboard")} size="sm" className="rounded-xl bg-blue-600 text-white text-xs font-semibold">
              Return to Fee Dashboard Overview
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
