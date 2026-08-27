import {
  LayoutDashboard,
  FolderGit2,
  CheckCircle2,
  Building2,
  Briefcase,
  BookOpen,
  FileText,
  Bookmark,
  Database,
  Award,
  ShieldCheck,
  Sparkles,
  Rocket,
  Landmark,
  Building,
  DollarSign,
  TrendingUp,
  GraduationCap,
  UserCheck,
  Activity,
  FileCheck,
  FlaskConical,
  Cpu,
  CalendarCheck,
  LineChart,
  Calendar,
  BookMarked,
  Presentation,
  Video,
  CalendarRange,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const RESEARCH_NAVIGATION: NavSection[] = [
  {
    label: "R&D Dean",
    items: [
      { title: "Dashboard", url: "/staff/research-development", icon: LayoutDashboard },
    ],
  },
  {
    label: "Research Projects",
    items: [
      { title: "Ongoing Projects", url: "/staff/research-development/ongoing-projects", icon: FolderGit2 },
      { title: "Completed Projects", url: "/staff/research-development/completed-projects", icon: CheckCircle2 },
      { title: "Sponsored Projects", url: "/staff/research-development/sponsored-projects", icon: Building2 },
      { title: "Consultancy Projects", url: "/staff/research-development/consultancy-projects", icon: Briefcase },
    ],
  },
  {
    label: "Research Publications",
    items: [
      { title: "Journal Publications", url: "/staff/research-development/journal-publications", icon: BookOpen },
      { title: "Conference Publications", url: "/staff/research-development/conference-publications", icon: FileText },
      { title: "Book Chapters", url: "/staff/research-development/book-chapters", icon: Bookmark },
      { title: "Publications Repository", url: "/staff/research-development/publications-repo", icon: Database },
    ],
  },
  {
    label: "Patents & Innovation",
    items: [
      { title: "Patents", url: "/staff/research-development/patents", icon: Award },
      { title: "Copyrights", url: "/staff/research-development/copyrights", icon: ShieldCheck },
      { title: "Faculty Research Extra Work", url: "/staff/faculty-work-wallet", icon: Award },
      { title: "Innovations", url: "/staff/research-development/innovations", icon: Sparkles },
      { title: "Startups & Incubation", url: "/staff/research-development/incubation", icon: Rocket },
    ],
  },
  {
    label: "Research Grants",
    items: [
      { title: "Government Grants", url: "/staff/research-development/govt-grants", icon: Landmark },
      { title: "Industry Grants", url: "/staff/research-development/industry-grants", icon: Building },
      { title: "Funding Agencies", url: "/staff/research-development/funding-agencies", icon: DollarSign },
      { title: "Grant Utilization", url: "/staff/research-development/grant-utilization", icon: TrendingUp },
    ],
  },
  {
    label: "Research Scholars",
    items: [
      { title: "PhD Scholars", url: "/staff/research-development/phd-scholars", icon: GraduationCap },
      { title: "Research Guides", url: "/staff/research-development/research-guides", icon: UserCheck },
      { title: "Scholar Progress", url: "/staff/research-development/scholar-progress", icon: Activity },
      { title: "Thesis Repository", url: "/staff/research-development/thesis-repo", icon: FileCheck },
    ],
  },
  {
    label: "Research Laboratories",
    items: [
      { title: "Research Labs", url: "/staff/research-development/research-labs", icon: FlaskConical },
      { title: "Lab Equipment", url: "/staff/research-development/lab-equipment", icon: Cpu },
      { title: "Lab Booking", url: "/staff/research-development/lab-booking", icon: CalendarCheck },
      { title: "Lab Utilization", url: "/staff/research-development/lab-utilization", icon: LineChart },
    ],
  },
  {
    label: "Research Events",
    items: [
      { title: "Conferences", url: "/staff/research-development/conferences", icon: Calendar },
      { title: "FDPs", url: "/staff/research-development/fdps", icon: BookMarked },
      { title: "Workshops", url: "/staff/research-development/workshops", icon: Presentation },
      { title: "Seminars", url: "/staff/research-development/seminars", icon: Video },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Research Reports", url: "/staff/research-development/research-reports", icon: BarChart3 },
      { title: "Publication Reports", url: "/staff/research-development/publication-reports", icon: BarChart3 },
      { title: "Patent Reports", url: "/staff/research-development/patent-reports", icon: BarChart3 },
      { title: "Grant Reports", url: "/staff/research-development/grant-reports", icon: BarChart3 },
      { title: "Scholar Reports", url: "/staff/research-development/scholar-reports", icon: BarChart3 },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Class Schedule", url: "/staff/research-development/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/research-development/notifications", icon: Bell },
      { title: "Settings", url: "/staff/research-development/settings", icon: Settings },
    ],
  },
];
