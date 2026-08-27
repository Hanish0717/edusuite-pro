import {
  LayoutDashboard,
  Brain,
  TrendingUp,
  LineChart,
  Bot,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/config/navigation";

export const AI_ANALYTICS_NAVIGATION: NavSection[] = [
  {
    label: "AI Intelligence Desk",
    items: [
      { title: "Dashboard Overview", url: "/ai-analytics/dashboard", icon: LayoutDashboard },
      { title: "Student Risk Predictor", url: "/ai-analytics/student-risk", icon: Brain },
    ],
  },
  {
    label: "Predictive Telemetry",
    items: [
      { title: "Attendance Forecast", url: "/ai-analytics/attendance-prediction", icon: TrendingUp },
      { title: "Model Insights & SHAP", url: "/ai-analytics/model-insights", icon: LineChart },
      { title: "AI Academic Copilot", url: "/ai-analytics/chatbot", icon: Bot },
    ],
  },
  {
    label: "Analytics & Config",
    items: [
      { title: "Executive Reports", url: "/ai-analytics/reports", icon: BarChart3 },
      { title: "AI System Alerts", url: "/ai-analytics/notifications", icon: Bell },
      { title: "Model Settings", url: "/ai-analytics/settings", icon: Settings },
    ],
  },
];
