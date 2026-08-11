import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/reports")({
  component: Reports,
});
