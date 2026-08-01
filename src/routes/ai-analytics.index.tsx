import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/")({
  component: Dashboard,
});
