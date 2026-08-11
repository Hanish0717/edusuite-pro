import {
  LayoutDashboard,
  CalendarDays,
  AlertTriangle,
  MessageSquareCode,
  FileSpreadsheet,
  BellRing,
  BrainCircuit,
  Sliders,
} from "lucide-react";

export type AINestedTab =
  | "dashboard"
  | "attendance-prediction"
  | "student-risk"
  | "chatbot"
  | "reports"
  | "notifications"
  | "model-insights"
  | "settings";

export interface AISubNavigationItem {
  id: AINestedTab;
  label: string;
  url: string;
  icon: typeof LayoutDashboard;
}

export const AI_SUB_NAV_ITEMS: AISubNavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    url: "/ai-analytics/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "attendance-prediction",
    label: "AI Attendance Prediction",
    url: "/ai-analytics/attendance-prediction",
    icon: CalendarDays,
  },
  {
    id: "student-risk",
    label: "Student Risk Analysis",
    url: "/ai-analytics/student-risk",
    icon: AlertTriangle,
  },
  {
    id: "chatbot",
    label: "AI Chatbot",
    url: "/ai-analytics/chatbot",
    icon: MessageSquareCode,
  },
  {
    id: "reports",
    label: "Reports",
    url: "/ai-analytics/reports",
    icon: FileSpreadsheet,
  },
  {
    id: "notifications",
    label: "Notifications",
    url: "/ai-analytics/notifications",
    icon: BellRing,
  },
  {
    id: "model-insights",
    label: "Model Insights",
    url: "/ai-analytics/model-insights",
    icon: BrainCircuit,
  },
  {
    id: "settings",
    label: "Settings",
    url: "/ai-analytics/settings",
    icon: Sliders,
  },
];
