import {
  LayoutDashboard,
  FlaskConical,
  Info,
  CalendarRange,
  CalendarCheck,
  Cpu,
  History,
  GitMerge,
  FileQuestion,
  Wrench,
  Calendar,
  ShieldAlert,
  Box,
  Building2,
  ArrowLeftRight,
  Trash2,
  ShoppingCart,
  FileSpreadsheet,
  CheckCircle2,
  Truck,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const IMA_NAVIGATION: NavSection[] = [
  {
    label: "IMA Dean",
    items: [
      { title: "Dashboard", url: "/staff/ima", icon: LayoutDashboard },
    ],
  },
  {
    label: "Laboratory Management",
    items: [
      { title: "Laboratories", url: "/staff/ima/laboratories", icon: FlaskConical },
      { title: "Lab Details", url: "/staff/ima/lab-details", icon: Info },
      { title: "Lab Timetable", url: "/staff/ima/lab-timetable", icon: CalendarRange },
      { title: "Lab Booking", url: "/staff/ima/lab-booking", icon: CalendarCheck },
    ],
  },
  {
    label: "Equipment Management",
    items: [
      { title: "Equipment Inventory", url: "/staff/ima/equipment-inventory", icon: Cpu },
      { title: "Equipment History", url: "/staff/ima/equipment-history", icon: History },
      { title: "Equipment Allocation", url: "/staff/ima/equipment-allocation", icon: GitMerge },
      { title: "Equipment Requests", url: "/staff/ima/equipment-requests", icon: FileQuestion },
    ],
  },
  {
    label: "Maintenance",
    items: [
      { title: "Maintenance Requests", url: "/staff/ima/maintenance-requests", icon: Wrench },
      { title: "Maintenance Schedule", url: "/staff/ima/maintenance-schedule", icon: Calendar },
      { title: "AMC & Warranty", url: "/staff/ima/amc-warranty", icon: ShieldAlert },
      { title: "Vendors", url: "/staff/ima/vendors", icon: Truck },
    ],
  },
  {
    label: "Asset Management",
    items: [
      { title: "Asset Register", url: "/staff/ima/asset-register", icon: Box },
      { title: "Department Assets", url: "/staff/ima/department-assets", icon: Building2 },
      { title: "Asset Transfer", url: "/staff/ima/asset-transfer", icon: ArrowLeftRight },
      { title: "Asset Disposal", url: "/staff/ima/asset-disposal", icon: Trash2 },
    ],
  },
  {
    label: "Purchases",
    items: [
      { title: "Purchase Requests", url: "/staff/ima/purchase-requests", icon: ShoppingCart },
      { title: "Purchase Orders", url: "/staff/ima/purchase-orders", icon: FileSpreadsheet },
      { title: "Approved Purchases", url: "/staff/ima/approved-purchases", icon: CheckCircle2 },
      { title: "Vendors", url: "/staff/ima/purchase-vendors", icon: Truck },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Laboratory Reports", url: "/staff/ima/laboratory-reports", icon: BarChart3 },
      { title: "Equipment Reports", url: "/staff/ima/equipment-reports", icon: BarChart3 },
      { title: "Inventory Reports", url: "/staff/ima/inventory-reports", icon: BarChart3 },
      { title: "Maintenance Reports", url: "/staff/ima/maintenance-reports", icon: BarChart3 },
      { title: "Purchase Reports", url: "/staff/ima/purchase-reports", icon: BarChart3 },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Class Schedule", url: "/staff/ima/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/ima/notifications", icon: Bell },
      { title: "Settings", url: "/staff/ima/settings", icon: Settings },
    ],
  },
];
