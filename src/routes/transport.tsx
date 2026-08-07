import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/transport")({
  head: () => ({ meta: [{ title: "Campus Transport — EduSuite Pro" }] }),
  component: TransportPage,
});

function TransportPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

