import { Brain, LayoutDashboard, CalendarRange, UserCheck, ShieldAlert, FileOutput, MessageCircle, Settings, Sliders } from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  url: string;
  icon: any;
  permissions?: string[];
  children?: NavItemConfig[];
}

export const navigationConfig: Record<string, NavItemConfig[]> = {
  "ai-analytics": [
    {
      id: "dashboard",
      label: "AI Dashboard",
      url: "/ai-analytics/dashboard",
      icon: LayoutDashboard,
      permissions: ["VIEW_AI"],
    },
    {
      id: "attendance-prediction",
      label: "Attendance Forecasts",
      url: "/ai-analytics/attendance-prediction",
      icon: CalendarRange,
      permissions: ["VIEW_AI"],
    },
    {
      id: "student-risk",
      label: "Student Risk Analysis",
      url: "/ai-analytics/student-risk",
      icon: ShieldAlert,
      permissions: ["VIEW_AI"],
    },
    {
      id: "chatbot",
      label: "AI Campus Chatbot",
      url: "/ai-analytics/chatbot",
      icon: MessageCircle,
      permissions: ["VIEW_AI"],
    },
    {
      id: "reports",
      label: "AI Audit Reports",
      url: "/ai-analytics/reports",
      icon: FileOutput,
      permissions: ["VIEW_AI"],
    },
    {
      id: "notifications",
      label: "AI Trigger Warning Logs",
      url: "/ai-analytics/notifications",
      icon: UserCheck,
      permissions: ["VIEW_AI", "TRIGGER_AI_ALERTS"],
    },
    {
      id: "model-insights",
      label: "Model Insights",
      url: "/ai-analytics/model-insights",
      icon: Brain,
      permissions: ["VIEW_AI"],
    },
    {
      id: "settings",
      label: "Engine Configuration",
      url: "/ai-analytics/settings",
      icon: Sliders,
      permissions: ["VIEW_AI", "ADMIN_SETTINGS"],
    },
  ],
};

export default navigationConfig;
