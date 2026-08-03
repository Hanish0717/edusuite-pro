import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/hostel")({
  head: () => ({ meta: [{ title: "Hostel Management — EduSuite Pro" }] }),
  component: HostelPage,
});

export function HostelPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
