import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/settings")({
  component: Settings,
});
