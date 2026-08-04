import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HRModuleView } from "@/modules/hr";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [{ title: "Faculty & Staff Leave Governance (HR) — EduSuite Pro" }],
  }),
  component: LeavePage,
});

function LeavePage() {
  return (
    <DashboardLayout>
      <HRModuleView />
    </DashboardLayout>
  );
}
