import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LibraryModuleView } from "@/modules/library";

export const Route = createFileRoute("/library/dashboard")({
  head: () => ({
    meta: [{ title: "Library Dashboard — EduSuite Pro" }],
  }),
  component: () => (
    <DashboardLayout>
      <LibraryModuleView />
    </DashboardLayout>
  ),
});
