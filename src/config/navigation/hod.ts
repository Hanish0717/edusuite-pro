import {
  LayoutDashboard,
  UserCog,
  CalendarCheck,
  UserCheck,
  Star,
  BarChart3,
  User,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FileSpreadsheet,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const HOD_NAVIGATION: NavSection[] = [
  {
    label: "HOD Governance",
    items: [
      { title: "Dashboard", url: "/hod/dashboard", icon: LayoutDashboard },
      { title: "Department Faculty", url: "/hod/faculty", icon: UserCog },
      { title: "Attendance Overview", url: "/hod/attendance", icon: CalendarCheck },
      { title: "Work Verification", url: "/staff/faculty-work-wallet", icon: UserCheck, badge: "Audit" },
      { title: "Department Reports", url: "/hod/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Faculty Personal Workspace",
    items: [
      { title: "My Profile", url: "/faculty/profile", icon: User },
      { title: "My Extra Work Wallet", url: "/faculty/work-wallet", icon: Star, badge: "WWP" },
      { title: "My Timetable", url: "/faculty/timetable", icon: CalendarCheck },
      { title: "My Subjects", url: "/faculty/subjects", icon: BookOpen },
      { title: "Lesson Plans", url: "/faculty/lesson-plan", icon: ClipboardList },
      { title: "Student Attendance", url: "/faculty/attendance", icon: CalendarCheck },
      { title: "Assignments", url: "/faculty/assignments", icon: ClipboardList },
      { title: "Assessments", url: "/faculty/assessments", icon: GraduationCap },
      { title: "Examinations", url: "/faculty/examinations", icon: FileSpreadsheet },
      { title: "Research & Claims", url: "/faculty/research", icon: TrendingUp },
      { title: "Payroll & Wallet", url: "/faculty/payroll", icon: Wallet },
      { title: "Notifications", url: "/faculty/notifications", icon: Bell },
      { title: "Settings", url: "/faculty/settings", icon: Settings },
    ],
  },
];
