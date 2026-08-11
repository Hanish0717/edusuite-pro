// Page Components
export { Dashboard } from "./pages/Dashboard";
export { AttendancePrediction } from "./pages/AttendancePrediction";
export { StudentRisk } from "./pages/StudentRisk";
export { Chatbot } from "./pages/Chatbot";
export { Reports } from "./pages/Reports";
export { Notifications } from "./pages/Notifications";
export { ModelInsights } from "./pages/ModelInsights";
export { Settings } from "./pages/Settings";

// Hooks
export { useAttendance } from "./hooks/useAttendance";
export { useRiskAnalysis } from "./hooks/useRiskAnalysis";
export { useChatbot } from "./hooks/useChatbot";
export { useReports } from "./hooks/useReports";
export { useNotifications } from "./hooks/useNotifications";

// Constants & Types
export * from "./types";
export * from "./constants/navigation";
export * from "./constants/permissions";
export * from "./constants/roles";
export * from "./constants/featureFlags";

// Repositories
export * from "./repositories";

