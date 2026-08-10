import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CommunicationModuleView } from "@/modules/communication";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [{ title: "Digital Notice Board — EduSuite Pro" }],
  }),
  component: CommunicationPage,
});

function CommunicationPage() {
  return (
    <DashboardLayout>
      <CommunicationModuleView />
    </DashboardLayout>
  );
}
