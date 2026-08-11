import { createFileRoute } from "@tanstack/react-router";
import { Notifications } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/notifications")({
  component: Notifications,
});
