import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RoleDashboardDispatcher } from "@/components/dashboard/role/role-dashboard-dispatcher";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — EduSuite Pro" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardLayout>
      <RoleDashboardDispatcher />
    </DashboardLayout>
  );
}
