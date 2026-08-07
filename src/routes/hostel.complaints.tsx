import { createFileRoute } from "@tanstack/react-router";
import { HostelComplaintsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/complaints")({
  head: () => ({
    meta: [{ title: "Hostel Maintenance Complaints — EduSuite Pro" }],
  }),
  component: HostelComplaintsPage,
});

function HostelComplaintsPage() {
  return <HostelComplaintsView />;
}
