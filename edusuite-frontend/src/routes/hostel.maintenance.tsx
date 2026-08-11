import { createFileRoute } from "@tanstack/react-router";
import { HostelMaintenanceView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/maintenance")({
  head: () => ({
    meta: [{ title: "Maintenance Support — EduSuite Pro Hostel" }],
  }),
  component: HostelMaintenancePage,
});

function HostelMaintenancePage() {
  return <HostelMaintenanceView />;
}
