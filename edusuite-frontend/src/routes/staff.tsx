import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff & Executive Deans Portal — EduSuite Pro" },
      {
        name: "description",
        content: "Institutional Staff Workspace & Executive Dean Portals.",
      },
    ],
  }),
  component: StaffLayout,
});

function StaffLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
