import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModuleLayout } from "@/shared/layouts/ModuleLayout";
import { BrainCircuit } from "lucide-react";
import { PermissionProvider } from "@/shared/permission-engine";

export const Route = createFileRoute("/ai-analytics")({
  head: () => ({
    meta: [{ title: "AI & Analytics Suite — EduSuite Pro" }],
  }),
  component: AIAnalyticsParentLayout,
});

const ROUTE_TITLES = {
  "/attendance-prediction": {
    title: "AI Attendance Forecasting",
    description: "RNN models mapping biometric registries and historical trends to flag attendance shortages.",
  },
  "/student-risk": {
    title: "Student Risk & Retention Analytics",
    description: "XGBoost classifiers predicting performance deficiencies and dropout risks.",
  },
  "/chatbot": {
    title: "AI Virtual Assistant Hub",
    description: "Interact with the campus LLM engine for instant query resolutions.",
  },
  "/reports": {
    title: "AI Compliance Reports",
    description: "Download verified, compiled audit reports for academic boards.",
  },
  "/notifications": {
    title: "Automated AI Triggers",
    description: "Real-time log of dispatched push alerts, emails, and SMS alerts.",
  },
  "/model-insights": {
    title: "Model Performance Vitals",
    description: "Explore the underlying parameters, training status, and accuracy of institutional AI classifiers.",
  },
  "/settings": {
    title: "AI Engine Configuration",
    description: "Modify parameters, alert thresholds, and LLM context bindings.",
  },
};

function AIAnalyticsParentLayout() {
  return (
    <PermissionProvider>
      <ModuleLayout
        moduleId="ai-analytics"
        defaultTitle="AI & Analytics Intelligence Suite"
        defaultDescription="Enterprise analytics forecasting attendance, placements, grades, and risk profiles."
        headerIcon={BrainCircuit}
        routeTitles={ROUTE_TITLES}
      >
        <Outlet />
      </ModuleLayout>
    </PermissionProvider>
  );
}
