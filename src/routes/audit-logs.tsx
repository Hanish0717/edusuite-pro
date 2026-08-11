import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuditLogsModuleView } from "@/modules/audit";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs & Activity Tracking — EduSuite Pro" },
      {
        name: "description",
        content: "Track every academic action, system activity, approvals, and configuration changes performed within the Academic Management module.",
      },
    ],
  }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <DashboardLayout>
      <AuditLogsModuleView />
    </DashboardLayout>
  );
}
