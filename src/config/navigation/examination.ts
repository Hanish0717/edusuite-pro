import {
  LayoutDashboard,
  Calendar,
  CalendarRange,
  Clock,
  Building2,
  UserCheck,
  Ticket,
  CheckCircle2,
  History,
  Upload,
  FileCheck2,
  Lock,
  Send,
  BookOpen,
  FileText,
  GraduationCap,
  Sparkles,
  FlaskConical,
  FileSpreadsheet,
  CheckSquare,
  PenTool,
  ShieldCheck,
  Activity,
  Award,
  FileCheck,
  Calculator,
  Trophy,
  RefreshCw,
  Search,
  AlertTriangle,
  FileSearch,
  ShieldAlert,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const EXAMINATION_NAVIGATION: NavSection[] = [
  {
    label: "Examination Dean",
    items: [
      { title: "Dashboard", url: "/staff/examination-dean", icon: LayoutDashboard },
    ],
  },
  {
    label: "Exam Planning",
    items: [
      { title: "Academic Calendar", url: "/staff/examination-dean/academic-calendar", icon: Calendar },
      { title: "Exam Schedule", url: "/staff/examination-dean/exam-schedule", icon: CalendarRange },
      { title: "Timetable Generation", url: "/staff/examination-dean/timetable-generation", icon: Clock },
      { title: "Hall Allocation", url: "/staff/examination-dean/hall-allocation", icon: Building2 },
      { title: "Invigilator Allocation", url: "/staff/examination-dean/invigilator-allocation", icon: UserCheck },
    ],
  },
  {
    label: "Hall Tickets",
    items: [
      { title: "Generate Hall Tickets", url: "/staff/examination-dean/generate-hall-tickets", icon: Ticket },
      { title: "Hall Ticket Status", url: "/staff/examination-dean/hall-ticket-status", icon: CheckCircle2 },
      { title: "Download History", url: "/staff/examination-dean/download-history", icon: History },
    ],
  },
  {
    label: "Question Paper Management",
    items: [
      { title: "Question Paper Upload", url: "/staff/examination-dean/question-paper-upload", icon: Upload },
      { title: "Question Paper Approval", url: "/staff/examination-dean/question-paper-approval", icon: FileCheck2 },
      { title: "Confidential Storage", url: "/staff/examination-dean/confidential-storage", icon: Lock },
      { title: "Paper Distribution", url: "/staff/examination-dean/paper-distribution", icon: Send },
    ],
  },
  {
    label: "Examinations",
    items: [
      { title: "Internal Exams", url: "/staff/examination-dean/internal-exams", icon: BookOpen },
      { title: "Mid Exams", url: "/staff/examination-dean/mid-exams", icon: FileText },
      { title: "Semester Exams", url: "/staff/examination-dean/semester-exams", icon: GraduationCap },
      { title: "Supplementary Exams", url: "/staff/examination-dean/supplementary-exams", icon: Sparkles },
      { title: "Practical Exams", url: "/staff/examination-dean/practical-exams", icon: FlaskConical },
    ],
  },
  {
    label: "Evaluation",
    items: [
      { title: "Answer Script Allocation", url: "/staff/examination-dean/answer-script-allocation", icon: FileSpreadsheet },
      { title: "Valuation Status", url: "/staff/examination-dean/valuation-status", icon: CheckSquare },
      { title: "Marks Entry", url: "/staff/examination-dean/marks-entry", icon: PenTool },
      { title: "Marks Verification", url: "/staff/examination-dean/marks-verification", icon: ShieldCheck },
    ],
  },
  {
    label: "Results",
    items: [
      { title: "Result Processing", url: "/staff/examination-dean/result-processing", icon: Activity },
      { title: "Result Publication", url: "/staff/examination-dean/result-publication", icon: Award },
      { title: "Grade Sheets", url: "/staff/examination-dean/grade-sheets", icon: FileCheck },
      { title: "CGPA Calculation", url: "/staff/examination-dean/cgpa-calculation", icon: Calculator },
      { title: "Rank List", url: "/staff/examination-dean/rank-list", icon: Trophy },
    ],
  },
  {
    label: "Revaluation",
    items: [
      { title: "Revaluation Requests", url: "/staff/examination-dean/revaluation-requests", icon: RefreshCw },
      { title: "Revaluation Status", url: "/staff/examination-dean/revaluation-status", icon: CheckCircle2 },
      { title: "Recounting", url: "/staff/examination-dean/recounting", icon: Search },
      { title: "Updated Results", url: "/staff/examination-dean/updated-results", icon: Award },
    ],
  },
  {
    label: "Malpractice",
    items: [
      { title: "Malpractice Cases", url: "/staff/examination-dean/malpractice-cases", icon: AlertTriangle },
      { title: "Committee Reports", url: "/staff/examination-dean/committee-reports", icon: FileSearch },
      { title: "Punishment History", url: "/staff/examination-dean/punishment-history", icon: ShieldAlert },
    ],
  },
  {
    label: "Timetable & Schedule",
    items: [
      { title: "Timetable & Schedule", url: "/staff/examination-dean/timetable", icon: CalendarRange },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Exam Reports", url: "/staff/examination-dean/exam-reports", icon: BarChart3 },
      { title: "Result Reports", url: "/staff/examination-dean/result-reports", icon: BarChart3 },
      { title: "Hall Ticket Reports", url: "/staff/examination-dean/hall-ticket-reports", icon: BarChart3 },
      { title: "Invigilator Reports", url: "/staff/examination-dean/invigilator-reports", icon: BarChart3 },
      { title: "Malpractice Reports", url: "/staff/examination-dean/malpractice-reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/staff/examination-dean/notifications", icon: Bell },
      { title: "Settings", url: "/staff/examination-dean/settings", icon: Settings },
    ],
  },
];
