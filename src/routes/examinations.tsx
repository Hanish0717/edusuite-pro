import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/examinations")({
  head: () => ({ meta: [{ title: "Examinations & Evaluation — EduSuite Pro" }] }),
  component: ExaminationsLayout,
});

function ExaminationsLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
