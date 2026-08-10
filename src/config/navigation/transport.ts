import {
  LayoutDashboard,
  Navigation,
  Bus,
  Users,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Sliders,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const TRANSPORT_NAVIGATION: NavSection[] = [
  {
    label: "Fleet & Operations",
    items: [
      { title: "Transport Dashboard", url: "/transport/dashboard", icon: LayoutDashboard },
      { title: "Routes & Schedules", url: "/transport/routes", icon: Navigation },
      { title: "Vehicle Fleet", url: "/transport/buses", icon: Bus },
    ],
  },
  {
    label: "Passenger Services",
    items: [
      { title: "Pass Holders Directory", url: "/transport/passengers", icon: Users },
      { title: "Fee Collections & Passes", url: "/transport/fees", icon: CreditCard },
    ],
  },
  {
    label: "Compliance & Telematics",
    items: [
      { title: "Fleet Health & Compliance", url: "/transport/health", icon: ShieldCheck },
      { title: "Executive Analytics", url: "/transport/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Governance & Admin",
    items: [
      { title: "Policy & Governance", url: "/transport/governance", icon: Sliders },
      { title: "System Notifications", url: "/transport/notifications", icon: Bell },
      { title: "Transport Settings", url: "/transport/settings", icon: Settings },
    ],
  },
];
