import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Calendar,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const HR_NAVIGATION: NavSection[] = [
  {
    label: "HR & Employee Desk",
    items: [
      { title: "Dashboard Overview", url: "/hr/dashboard", icon: LayoutDashboard },
      { title: "Employee Directory", url: "/hr/employees", icon: Users },
    ],
  },
  {
    label: "Workforce & Payroll",
    items: [
      { title: "Employee Management", url: "/employee-management", icon: UserCheck },
      { title: "Payroll Administration", url: "/hr/payroll", icon: CreditCard },
      { title: "Leave Management", url: "/leave", icon: Calendar },
    ],
  },
  {
    label: "Performance & Admin",
    items: [
      { title: "Appraisals & Performance", url: "/promotions", icon: TrendingUp },
      { title: "HR Analytics", url: "/reports", icon: BarChart3 },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "HR Settings", url: "/settings", icon: Settings },
    ],
  },
];
