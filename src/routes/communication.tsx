import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CommunicationCenterModuleView } from "@/modules/communication";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Notifications & Communication Center — EduSuite Pro" },
      {
        name: "description",
        content: "Create, schedule, manage, and monitor academic announcements and communications across the institution.",
      },
    ],
  }),
  component: CommunicationPage,
});

export function CommunicationPage() {
  return (
    <DashboardLayout>
      <CommunicationCenterModuleView />
    </DashboardLayout>
  );
}
