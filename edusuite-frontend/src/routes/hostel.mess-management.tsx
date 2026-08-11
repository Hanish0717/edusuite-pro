import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/mess-management")({
  head: () => ({ meta: [{ title: "Hostel Mess Management — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <HostelModuleView />
    </DashboardLayout>
  ),
});
