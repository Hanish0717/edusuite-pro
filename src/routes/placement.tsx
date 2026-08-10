import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/placement")({
  head: () => ({ meta: [{ title: "Placement & Training Cell — EduSuite Pro" }] }),
  component: PlacementLayout,
});

function PlacementLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
