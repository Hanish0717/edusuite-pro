import { createFileRoute } from "@tanstack/react-router";
import { HallTicketsView } from "@/modules/examinations/HallTicketsComponent";

export const Route = createFileRoute("/examinations/hall-tickets")({
  head: () => ({ meta: [{ title: "Hall Tickets — EduSuite Pro" }] }),
  component: HallTicketsPage,
});

function HallTicketsPage() {
  return <HallTicketsView />;
}
