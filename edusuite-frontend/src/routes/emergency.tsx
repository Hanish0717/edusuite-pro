import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EmergencyModuleView } from "@/modules/emergency";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [{ title: "Emergency Broadcast & Instant Alert System — EduSuite Pro" }],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  return (
    <DashboardLayout>
      <EmergencyModuleView />
    </DashboardLayout>
  );
}
