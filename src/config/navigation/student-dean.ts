import {
  LayoutDashboard,
  Users,
  User,
  CalendarCheck,
  ShieldAlert,
  Award,
  MessageSquare,
  BedDouble,
  Calendar,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  HeartHandshake,
  FileCheck,
  Activity,
  FileSpreadsheet,
  CalendarRange,
  History,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const STUDENT_DEAN_NAVIGATION: NavSection[] = [
  {
    label: "Student Dean",
    items: [
      { title: "Dashboard", url: "/staff/student-dean", icon: LayoutDashboard },
    ],
  },
  {
    label: "Student Management",
    items: [
      { title: "Students", url: "/staff/student-dean/students", icon: Users },
      { title: "Student Profiles", url: "/staff/student-dean/student-profiles", icon: User },
      { title: "Attendance", url: "/staff/student-dean/attendance", icon: CalendarCheck },
      { title: "Attendance History", url: "/staff/student-dean/attendance-history", icon: History },
      { title: "Grievances", url: "/staff/student-dean/grievances", icon: ShieldAlert },
      { title: "Scholarships", url: "/staff/student-dean/scholarships", icon: Award },
      { title: "Discipline", url: "/staff/student-dean/discipline", icon: BookOpen },
      { title: "Counselling", url: "/staff/student-dean/counselling", icon: MessageSquare },
    ],
  },
  {
    label: "Campus Life",
    items: [
      { title: "Hostel Management", url: "/staff/student-dean/hostel", icon: BedDouble },
      { title: "Clubs & Events", url: "/staff/student-dean/clubs-events", icon: Calendar },
      { title: "Student Activities", url: "/staff/student-dean/student-activities", icon: Activity },
    ],
  },
  {
    label: "Academic Support",
    items: [
      { title: "Mentoring", url: "/staff/student-dean/mentoring", icon: HeartHandshake },
      { title: "Faculty Extra Work Approvals", url: "/staff/faculty-work-wallet", icon: Award },
      { title: "Student Requests", url: "/staff/student-dean/student-requests", icon: FileCheck },
      { title: "Certificates", url: "/staff/student-dean/certificates", icon: Award },
      { title: "Timetable", url: "/staff/student-dean/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Student Reports", url: "/staff/student-dean/reports", icon: BarChart3 },
      { title: "Attendance Reports", url: "/staff/student-dean/attendance-reports", icon: FileSpreadsheet },
      { title: "Scholarship Reports", url: "/staff/student-dean/scholarship-reports", icon: Award },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/student-dean/notifications", icon: Bell },
      { title: "Settings", url: "/staff/student-dean/settings", icon: Settings },
    ],
  },
];
