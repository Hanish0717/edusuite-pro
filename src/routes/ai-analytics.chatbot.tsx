import { createFileRoute } from "@tanstack/react-router";
import { Chatbot } from "@/modules/ai-analytics";

export const Route = createFileRoute("/ai-analytics/chatbot")({
  component: Chatbot,
});
