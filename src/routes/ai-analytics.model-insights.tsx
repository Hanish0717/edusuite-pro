import { createFileRoute } from "@tanstack/react-router";
import { ModelInsights } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/model-insights")({
  component: ModelInsights,
});
