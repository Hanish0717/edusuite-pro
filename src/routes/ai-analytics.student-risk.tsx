import { createFileRoute } from "@tanstack/react-router";
import { StudentRisk } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/student-risk")({
  component: StudentRisk,
});
