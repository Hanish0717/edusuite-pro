import {
  LayoutDashboard,
  Search,
  BookOpen,
  BookPlus,
  ShoppingCart,
  Package,
  Send,
  CheckCircle2,
  RefreshCw,
  Clock,
  Building2,
  QrCode,
  Users,
  CreditCard,
  Globe,
  Wallet,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const LIBRARIAN_NAVIGATION: NavSection[] = [
  {
    label: "Central Library Desk",
    items: [
      { title: "Dashboard Overview", url: "/librarian/dashboard", icon: LayoutDashboard },
      { title: "Global OPAC Search", url: "/librarian/search", icon: Search },
    ],
  },
  {
    label: "Catalog & Acquisition",
    items: [
      { title: "Book Management", url: "/librarian/books", icon: BookOpen },
      { title: "Catalog Management", url: "/librarian/catalog", icon: BookPlus },
      { title: "Book Acquisition", url: "/librarian/acquisition", icon: ShoppingCart },
      { title: "Physical Inventory", url: "/librarian/inventory", icon: Package },
    ],
  },
  {
    label: "Circulation & Desk",
    items: [
      { title: "Issue Books", url: "/librarian/issue-books", icon: Send },
      { title: "Return Books & Fines", url: "/librarian/return-books", icon: CheckCircle2 },
      { title: "Advanced Circulation", url: "/librarian/circulation", icon: RefreshCw },
      { title: "Book Reservations", url: "/librarian/reservations", icon: Clock },
      { title: "Reading Hall Occupancy", url: "/librarian/reading-hall", icon: Building2 },
      { title: "Gate Entry Log", url: "/librarian/entry", icon: QrCode },
    ],
  },
  {
    label: "Members & Services",
    items: [
      { title: "Library Members", url: "/librarian/members", icon: Users },
      { title: "ID Card Management", url: "/librarian/id-cards", icon: CreditCard },
      { title: "Digital E-Resources", url: "/librarian/digital", icon: Globe },
      { title: "Fines & Dues", url: "/librarian/fines", icon: Wallet },
    ],
  },
  {
    label: "Analytics & Admin",
    items: [
      { title: "Circulation Reports", url: "/librarian/reports", icon: BarChart3 },
      { title: "Overdue Notifications", url: "/librarian/notifications", icon: Bell },
      { title: "System Audit Logs", url: "/librarian/audit-logs", icon: ShieldCheck },
      { title: "Library Settings", url: "/librarian/settings", icon: Settings },
    ],
  },
];
