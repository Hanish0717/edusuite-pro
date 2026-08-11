import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/complaints")({
  head: () => ({ meta: [{ title: "Hostel Complaints — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <HostelModuleView />
    </DashboardLayout>
  ),
});
