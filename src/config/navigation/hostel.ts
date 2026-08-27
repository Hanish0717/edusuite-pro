import {
  LayoutDashboard,
  BedDouble,
  Building2,
  Users,
  CalendarCheck,
  KeyRound,
  History,
  FileCheck,
  Utensils,
  BookOpen,
  Receipt,
  Wrench,
  ShieldAlert,
  CreditCard,
  UserCheck,
  QrCode,
  Smartphone,
  ShieldCheck,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const HOSTEL_NAVIGATION: NavSection[] = [
  {
    label: "Hostel Governance Desk",
    items: [
      { title: "Dashboard Overview", url: "/hostel/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Blocks & Allotment",
    items: [
      { title: "Rooms & Occupancy", url: "/hostel/rooms", icon: BedDouble },
      { title: "Room Allocation", url: "/hostel/room-allocation", icon: KeyRound },
      { title: "Hostel Blocks", url: "/hostel/blocks", icon: Building2 },
      { title: "Resident Students", url: "/hostel/students", icon: Users },
    ],
  },
  {
    label: "Outing & Attendance",
    items: [
      { title: "Hostel Attendance", url: "/hostel/attendance", icon: CalendarCheck },
      { title: "Outing Approvals", url: "/hostel/outing-approvals", icon: FileCheck },
      { title: "Outing Log History", url: "/hostel/outing-log-history", icon: History },
      { title: "Leaves & Suspensions", url: "/hostel/leaves-suspension", icon: ShieldAlert },
    ],
  },
  {
    label: "Mess & Dining",
    items: [
      { title: "Mess Management", url: "/hostel/mess-management", icon: Utensils },
      { title: "Mess Menus", url: "/hostel/mess-menus", icon: BookOpen },
      { title: "Mess Fees", url: "/hostel/mess-fees", icon: Receipt },
    ],
  },
  {
    label: "Maintenance & Billing",
    items: [
      { title: "Maintenance Requests", url: "/hostel/maintenance", icon: Wrench },
      { title: "Complaints & Grievances", url: "/hostel/complaints", icon: ShieldAlert },
      { title: "Fee Collection", url: "/hostel/fees", icon: CreditCard },
      { title: "Guest Billing", url: "/hostel/guest-billing", icon: Receipt },
    ],
  },
  {
    label: "Security & Visitors",
    items: [
      { title: "Visitors Log", url: "/hostel/visitors", icon: QrCode },
      { title: "Device Management", url: "/hostel/device-management", icon: Smartphone },
      { title: "User Management", url: "/hostel/user-management", icon: UserCheck },
      { title: "System Audit Logs", url: "/hostel/log-history", icon: ShieldCheck },
    ],
  },
  {
    label: "System & Settings",
    items: [
      { title: "Notifications", url: "/hostel/notifications", icon: Bell },
      { title: "Hostel Settings", url: "/hostel/settings", icon: Settings },
    ],
  },
];
