import { createFileRoute } from "@tanstack/react-router";
import { AttendancePrediction } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/attendance-prediction")({
  component: AttendancePrediction,
});
