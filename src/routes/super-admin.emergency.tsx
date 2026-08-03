import { createFileRoute } from "@tanstack/react-router";
import { EmergencyModuleView } from "@/modules/emergency";

export const Route = createFileRoute("/super-admin/emergency")({
  head: () => ({
    meta: [{ title: "Emergency Broadcast & Instant Alerts — Super Admin Portal" }],
  }),
  component: SuperAdminEmergencyPage,
});

function SuperAdminEmergencyPage() {
  return <EmergencyModuleView />;
}
