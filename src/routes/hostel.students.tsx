import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/students")({
  head: () => ({ meta: [{ title: "Hostel Students — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <HostelModuleView />
    </DashboardLayout>
  ),
});
