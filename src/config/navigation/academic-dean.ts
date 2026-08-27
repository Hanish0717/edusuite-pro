import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  FileSpreadsheet,
  Calendar,
  Monitor,
  UserCheck,
  Award,
  AlertCircle,
  Trophy,
  CalendarRange,
  Clock,
  Building,
  UserPlus,
  History,
  Briefcase,
  Layers,
  BarChart2,
  TrendingUp,
  Target,
  GitMerge,
  CheckSquare,
  ShieldCheck,
  Users2,
  FileCheck2,
  BellRing,
  CheckCircle2,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const ACADEMIC_DEAN_NAVIGATION: NavSection[] = [
  {
    label: "Academic Dean",
    items: [
      { title: "Dashboard", url: "/staff/academic-dean", icon: LayoutDashboard },
    ],
  },
  {
    label: "Academic Management",
    items: [
      { title: "Departments", url: "/staff/academic-dean/departments", icon: Building2 },
      { title: "Faculty Management", url: "/staff/academic-dean/faculty-management", icon: Users },
      { title: "Course Management", url: "/staff/academic-dean/course-management", icon: BookOpen },
      { title: "Curriculum & Syllabus", url: "/staff/academic-dean/curriculum", icon: FileSpreadsheet },
      { title: "Academic Calendar", url: "/staff/academic-dean/academic-calendar", icon: Calendar },
    ],
  },
  {
    label: "Student Academics",
    items: [
      { title: "Class Monitoring", url: "/staff/academic-dean/class-monitoring", icon: Monitor },
      { title: "Attendance Monitoring", url: "/staff/academic-dean/attendance-monitoring", icon: UserCheck },
      { title: "Academic Performance", url: "/staff/academic-dean/academic-performance", icon: Award },
      { title: "Slow Learners", url: "/staff/academic-dean/slow-learners", icon: AlertCircle },
      { title: "Top Performers", url: "/staff/academic-dean/top-performers", icon: Trophy },
    ],
  },
  {
    label: "Timetable Management",
    items: [
      { title: "Timetable", url: "/staff/academic-dean/timetable", icon: CalendarRange },
      { title: "Faculty Timetable", url: "/staff/academic-dean/faculty-timetable", icon: Clock },
      { title: "Classroom Allocation", url: "/staff/academic-dean/classroom-allocation", icon: Building },
      { title: "Substitute Faculty", url: "/staff/academic-dean/substitute-faculty", icon: UserPlus },
      { title: "Timetable History", url: "/staff/academic-dean/timetable-history", icon: History },
    ],
  },
  {
    label: "Faculty Workload",
    items: [
      { title: "Teaching Load", url: "/staff/academic-dean/teaching-load", icon: Briefcase },
      { title: "Subject Allocation", url: "/staff/academic-dean/subject-allocation", icon: Layers },
      { title: "Faculty Extra Work Approvals", url: "/staff/faculty-work-wallet", icon: Award },
      { title: "Department Workload", url: "/staff/academic-dean/dept-workload", icon: BarChart2 },
      { title: "Faculty Performance", url: "/staff/academic-dean/faculty-performance", icon: TrendingUp },
    ],
  },
  {
    label: "Academic Quality",
    items: [
      { title: "OBE Management", url: "/staff/academic-dean/obe-management", icon: Target },
      { title: "CO-PO Mapping", url: "/staff/academic-dean/copo-mapping", icon: GitMerge },
      { title: "Course Outcomes", url: "/staff/academic-dean/course-outcomes", icon: CheckSquare },
      { title: "Academic Audit", url: "/staff/academic-dean/academic-audit", icon: ShieldCheck },
    ],
  },
  {
    label: "Meetings & Approvals",
    items: [
      { title: "Academic Council", url: "/staff/academic-dean/academic-council", icon: Users2 },
      { title: "BOS Meetings", url: "/staff/academic-dean/bos-meetings", icon: FileCheck2 },
      { title: "Circulars", url: "/staff/academic-dean/circulars", icon: BellRing },
      { title: "Approvals", url: "/staff/academic-dean/approvals", icon: CheckCircle2 },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Department Reports", url: "/staff/academic-dean/department-reports", icon: BarChart3 },
      { title: "Faculty Reports", url: "/staff/academic-dean/faculty-reports", icon: BarChart3 },
      { title: "Student Performance Reports", url: "/staff/academic-dean/student-reports", icon: BarChart3 },
      { title: "Attendance Reports", url: "/staff/academic-dean/attendance-reports", icon: BarChart3 },
      { title: "Timetable Reports", url: "/staff/academic-dean/timetable-reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/academic-dean/notifications", icon: Bell },
      { title: "Settings", url: "/staff/academic-dean/settings", icon: Settings },
    ],
  },
];
