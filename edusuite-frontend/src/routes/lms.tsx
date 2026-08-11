import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LMSModuleView } from "@/modules/lms";

export const Route = createFileRoute("/lms")({
  head: () => ({
    meta: [{ title: "Learning Management System — EduSuite Pro" }],
  }),
  component: LmsPage,
});

function LmsPage() {
  return (
    <DashboardLayout>
      <LMSModuleView />
    </DashboardLayout>
  );
}
