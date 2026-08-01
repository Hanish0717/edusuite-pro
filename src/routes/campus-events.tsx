import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CampusEventsModuleView } from "@/modules/campus-events";

export const Route = createFileRoute("/campus-events")({
  head: () => ({
    meta: [{ title: "Campus Events — EduSuite Pro" }],
  }),
  component: CampusEventsPage,
});

function CampusEventsPage() {
  return (
    <DashboardLayout>
      <CampusEventsModuleView />
    </DashboardLayout>
  );
}
