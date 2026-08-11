import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ApprovalCenterModuleView } from "@/modules/approval";

export const Route = createFileRoute("/approval-center")({
  head: () => ({ meta: [{ title: "Centralized Approval Center — EduSuite Pro" }] }),
  component: ApprovalCenterPage,
});

function ApprovalCenterPage() {
  return (
    <DashboardLayout>
      <ApprovalCenterModuleView />
    </DashboardLayout>
  );
}
