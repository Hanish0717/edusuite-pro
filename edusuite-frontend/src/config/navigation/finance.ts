import {
  LayoutDashboard,
  Wallet,
  Building2,
  PieChart,
  TrendingUp,
  CreditCard,
  Clock,
  Award,
  RefreshCw,
  DollarSign,
  Receipt,
  ShoppingCart,
  Truck,
  UserCheck,
  Users,
  History,
  Calculator,
  FileCheck2,
  Package,
  ShieldCheck,
  FileText,
  CalendarRange,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const FINANCE_NAVIGATION: NavSection[] = [
  {
    label: "Finance Dean",
    items: [
      { title: "Dashboard", url: "/staff/finance-dean", icon: LayoutDashboard },
    ],
  },
  {
    label: "Budget Management",
    items: [
      { title: "Annual Budget", url: "/staff/finance-dean/annual-budget", icon: Wallet },
      { title: "Department Budgets", url: "/staff/finance-dean/dept-budgets", icon: Building2 },
      { title: "Budget Allocation", url: "/staff/finance-dean/budget-allocation", icon: PieChart },
      { title: "Budget Utilization", url: "/staff/finance-dean/budget-utilization", icon: TrendingUp },
    ],
  },
  {
    label: "Fee Management",
    items: [
      { title: "Fee Collection", url: "/staff/finance-dean/fee-collection", icon: CreditCard },
      { title: "Pending Fees", url: "/staff/finance-dean/pending-fees", icon: Clock },
      { title: "Scholarships & Concessions", url: "/staff/finance-dean/scholarships-concessions", icon: Award },
      { title: "Refund Management", url: "/staff/finance-dean/refund-management", icon: RefreshCw },
    ],
  },
  {
    label: "Expenditure Management",
    items: [
      { title: "Daily Expenses", url: "/staff/finance-dean/daily-expenses", icon: DollarSign },
      { title: "Department Expenses", url: "/staff/finance-dean/dept-expenses", icon: Receipt },
      { title: "Purchase Payments", url: "/staff/finance-dean/purchase-payments", icon: ShoppingCart },
      { title: "Vendor Payments", url: "/staff/finance-dean/vendor-payments", icon: Truck },
    ],
  },
  {
    label: "Payroll",
    items: [
      { title: "Faculty Payroll", url: "/staff/finance-dean/faculty-payroll", icon: UserCheck },
      { title: "Staff Payroll", url: "/staff/finance-dean/staff-payroll", icon: Users },
      { title: "Salary History", url: "/staff/finance-dean/salary-history", icon: History },
      { title: "Allowances & Deductions", url: "/staff/finance-dean/allowances-deductions", icon: Calculator },
    ],
  },
  {
    label: "Purchases & Vendors",
    items: [
      { title: "Purchase Requests", url: "/staff/finance-dean/purchase-requests", icon: FileCheck2 },
      { title: "Purchase Orders", url: "/staff/finance-dean/purchase-orders", icon: Package },
      { title: "Vendor Management", url: "/staff/finance-dean/vendor-management", icon: Truck },
      { title: "Invoice Management", url: "/staff/finance-dean/invoice-management", icon: Receipt },
    ],
  },
  {
    label: "Financial Audit",
    items: [
      { title: "Internal Audit", url: "/staff/finance-dean/internal-audit", icon: ShieldCheck },
      { title: "External Audit", url: "/staff/finance-dean/external-audit", icon: FileText },
      { title: "Audit Compliance", url: "/staff/finance-dean/audit-compliance", icon: ShieldCheck },
      { title: "Audit History", url: "/staff/finance-dean/audit-history", icon: History },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Schedule", url: "/staff/finance-dean/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Financial Reports", url: "/staff/finance-dean/financial-reports", icon: BarChart3 },
      { title: "Budget Reports", url: "/staff/finance-dean/budget-reports", icon: BarChart3 },
      { title: "Fee Reports", url: "/staff/finance-dean/fee-reports", icon: BarChart3 },
      { title: "Payroll Reports", url: "/staff/finance-dean/payroll-reports", icon: BarChart3 },
      { title: "Audit Reports", url: "/staff/finance-dean/audit-reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/finance-dean/notifications", icon: Bell },
      { title: "Settings", url: "/staff/finance-dean/settings", icon: Settings },
    ],
  },
];
