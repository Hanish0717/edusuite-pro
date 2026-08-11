import { createFileRoute } from "@tanstack/react-router";
import { HostelVisitorsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/visitors")({
  head: () => ({
    meta: [{ title: "Hostel Visitors Log — EduSuite Pro" }],
  }),
  component: HostelVisitorsPage,
});

function HostelVisitorsPage() {
  return <HostelVisitorsView />;
}
