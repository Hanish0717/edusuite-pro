import { createFileRoute } from "@tanstack/react-router";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/dashboard")({
  head: () => ({
    meta: [{ title: "Hostel Management Workspace — EduSuite Pro" }],
  }),
  component: HostelModuleView,
});

function HostelDashboardPage() {
  return <HostelModuleView />;
}
