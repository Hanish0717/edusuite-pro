import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Building,
  CalendarCheck,
  Briefcase,
  Clock,
  CheckCircle2,
  Globe,
  Users,
  UserPlus,
  FileCheck2,
  Award,
  FileText,
  Rocket,
  Activity,
  LineChart,
  BookOpen,
  Code,
  MessageSquare,
  Video,
  FileCheck,
  PieChart,
  BarChart3,
  TrendingUp,
  CalendarRange,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const PLACEMENT_NAVIGATION: NavSection[] = [
  {
    label: "Placement Dean",
    items: [
      { title: "Dashboard", url: "/staff/placement-dean", icon: LayoutDashboard },
    ],
  },
  {
    label: "Company Management",
    items: [
      { title: "Companies", url: "/staff/placement-dean/companies", icon: Building2 },
      { title: "Company Profiles", url: "/staff/placement-dean/company-profiles", icon: UserCheck },
      { title: "Recruitment Partners", url: "/staff/placement-dean/recruitment-partners", icon: Building },
      { title: "Company Visits", url: "/staff/placement-dean/company-visits", icon: CalendarCheck },
    ],
  },
  {
    label: "Placement Drives",
    items: [
      { title: "Upcoming Drives", url: "/staff/placement-dean/upcoming-drives", icon: Briefcase },
      { title: "Ongoing Drives", url: "/staff/placement-dean/ongoing-drives", icon: Clock },
      { title: "Completed Drives", url: "/staff/placement-dean/completed-drives", icon: CheckCircle2 },
      { title: "Off-Campus Drives", url: "/staff/placement-dean/off-campus-drives", icon: Globe },
    ],
  },
  {
    label: "Student Placement",
    items: [
      { title: "Eligible Students", url: "/staff/placement-dean/eligible-students", icon: Users },
      { title: "Registered Students", url: "/staff/placement-dean/registered-students", icon: UserPlus },
      { title: "Shortlisted Students", url: "/staff/placement-dean/shortlisted-students", icon: FileCheck2 },
      { title: "Selected Students", url: "/staff/placement-dean/selected-students", icon: Award },
      { title: "Offer Letters", url: "/staff/placement-dean/offer-letters", icon: FileText },
    ],
  },
  {
    label: "Internships",
    items: [
      { title: "Internship Opportunities", url: "/staff/placement-dean/internship-opportunities", icon: Rocket },
      { title: "Internship Tracking", url: "/staff/placement-dean/internship-tracking", icon: Activity },
      { title: "Internship Reports", url: "/staff/placement-dean/internship-reports", icon: LineChart },
    ],
  },
  {
    label: "Training & Development",
    items: [
      { title: "Aptitude Training", url: "/staff/placement-dean/aptitude-training", icon: BookOpen },
      { title: "Coding Training", url: "/staff/placement-dean/coding-training", icon: Code },
      { title: "Soft Skills", url: "/staff/placement-dean/soft-skills", icon: MessageSquare },
      { title: "Mock Interviews", url: "/staff/placement-dean/mock-interviews", icon: Video },
      { title: "Resume Reviews", url: "/staff/placement-dean/resume-reviews", icon: FileCheck },
    ],
  },
  {
    label: "Placement Analytics",
    items: [
      { title: "Placement Statistics", url: "/staff/placement-dean/placement-statistics", icon: PieChart },
      { title: "Department-wise Placements", url: "/staff/placement-dean/dept-placements", icon: BarChart3 },
      { title: "Package Analysis", url: "/staff/placement-dean/package-analysis", icon: TrendingUp },
      { title: "Company-wise Hiring", url: "/staff/placement-dean/company-hiring", icon: Building },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Schedule", url: "/staff/placement-dean/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Placement Reports", url: "/staff/placement-dean/placement-reports", icon: BarChart3 },
      { title: "Internship Reports", url: "/staff/placement-dean/internship-reports-list", icon: BarChart3 },
      { title: "Company Reports", url: "/staff/placement-dean/company-reports", icon: BarChart3 },
      { title: "Student Reports", url: "/staff/placement-dean/student-reports", icon: BarChart3 },
      { title: "Training Reports", url: "/staff/placement-dean/training-reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/placement-dean/notifications", icon: Bell },
      { title: "Settings", url: "/staff/placement-dean/settings", icon: Settings },
    ],
  },
];
