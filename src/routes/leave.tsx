import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LeaveModuleView } from "@/modules/leave";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [{ title: "Leave Management — EduSuite Pro" }],
  }),
  component: LeavePage,
});

function LeavePage() {
  return (
    <DashboardLayout>
      <LeaveModuleView />
    </DashboardLayout>
  );
}
