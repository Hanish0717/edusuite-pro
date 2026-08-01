import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel")({
  head: () => ({ meta: [{ title: "Hostel Management — EduSuite Pro" }] }),
  component: HostelPage,
});

export function HostelPage() {
  return (
    <DashboardLayout>
      <HostelModuleView />
    </DashboardLayout>
  );
}
