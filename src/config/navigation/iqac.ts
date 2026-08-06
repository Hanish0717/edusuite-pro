import {
  LayoutDashboard,
  BadgeCheck,
  ShieldCheck,
  FileText,
  Database,
  ClipboardCheck,
  Activity,
  Award,
  TrendingUp,
  MessageSquare,
  Users,
  GraduationCap,
  Briefcase,
  PieChart,
  CheckSquare,
  FolderKanban,
  FolderGit2,
  Upload,
  LineChart,
  Target,
  BarChart3,
  Calendar,
  FileCheck,
  BookOpen,
  Sparkles,
  PartyPopper,
  Bell,
  Settings,
  CalendarRange,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const IQAC_NAVIGATION: NavSection[] = [
  {
    label: "IQAC Dean",
    items: [
      { title: "Dashboard", url: "/staff/iqac", icon: LayoutDashboard },
    ],
  },
  {
    label: "Quality Assurance",
    items: [
      { title: "NAAC Accreditation", url: "/staff/iqac/naac", icon: BadgeCheck },
      { title: "NBA Accreditation", url: "/staff/iqac/nba", icon: ShieldCheck },
      { title: "AQAR Management", url: "/staff/iqac/aqar", icon: FileText },
      { title: "SSR Management", url: "/staff/iqac/ssr", icon: Database },
      { title: "Academic Audit", url: "/staff/iqac/academic-audit", icon: ClipboardCheck },
      { title: "Internal Quality Audit", url: "/staff/iqac/internal-quality-audit", icon: Activity },
      { title: "Department Quality Metrics", url: "/staff/iqac/dept-quality-metrics", icon: Award },
      { title: "Quality Improvement Plans", url: "/staff/iqac/quality-improvement", icon: TrendingUp },
    ],
  },
  {
    label: "Feedback Management",
    items: [
      { title: "Student Feedback", url: "/staff/iqac/student-feedback", icon: Users },
      { title: "Faculty Feedback", url: "/staff/iqac/faculty-feedback", icon: GraduationCap },
      { title: "Alumni Feedback", url: "/staff/iqac/alumni-feedback", icon: Users },
      { title: "Employer Feedback", url: "/staff/iqac/employer-feedback", icon: Briefcase },
      { title: "Feedback Analytics", url: "/staff/iqac/feedback-analytics", icon: PieChart },
    ],
  },
  {
    label: "Compliance",
    items: [
      { title: "Compliance Tracker", url: "/staff/iqac/compliance-tracker", icon: CheckSquare },
      { title: "Criteria Documentation", url: "/staff/iqac/criteria-docs", icon: FolderKanban },
      { title: "Document Repository", url: "/staff/iqac/document-repo", icon: FolderGit2 },
      { title: "Evidence Uploads", url: "/staff/iqac/evidence-uploads", icon: Upload },
    ],
  },
  {
    label: "Institution Analytics",
    items: [
      { title: "KPI Dashboard", url: "/staff/iqac/kpi-dashboard", icon: LineChart },
      { title: "Quality Metrics", url: "/staff/iqac/quality-metrics", icon: Award },
      { title: "Benchmarking", url: "/staff/iqac/benchmarking", icon: Target },
      { title: "Performance Analysis", url: "/staff/iqac/performance-analysis", icon: BarChart3 },
    ],
  },
  {
    label: "Meetings & Activities",
    items: [
      { title: "IQAC Meetings", url: "/staff/iqac/meetings", icon: Calendar },
      { title: "Action Taken Reports (ATR)", url: "/staff/iqac/atr", icon: FileCheck },
      { title: "Workshops & FDPs", url: "/staff/iqac/workshops", icon: BookOpen },
      { title: "Best Practices", url: "/staff/iqac/best-practices", icon: Sparkles },
      { title: "Institutional Events", url: "/staff/iqac/events", icon: PartyPopper },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "NAAC Reports", url: "/staff/iqac/naac-reports", icon: BarChart3 },
      { title: "AQAR Reports", url: "/staff/iqac/aqar-reports", icon: FileText },
      { title: "Audit Reports", url: "/staff/iqac/audit-reports", icon: ClipboardCheck },
      { title: "Feedback Reports", url: "/staff/iqac/feedback-reports", icon: MessageSquare },
      { title: "KPI Reports", url: "/staff/iqac/kpi-reports", icon: LineChart },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Class Schedule", url: "/staff/iqac/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/iqac/notifications", icon: Bell },
      { title: "Settings", url: "/staff/iqac/settings", icon: Settings },
    ],
  },
];
