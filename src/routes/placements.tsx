import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PlacementModuleView } from "@/modules/placement";

export const Route = createFileRoute("/placements")({
  head: () => ({
    meta: [{ title: "Placement & Training Cell — EduSuite Pro" }],
  }),
  component: PlacementsPage,
});

export function PlacementsPage() {
  return (
    <DashboardLayout>
      <PlacementModuleView />
    </DashboardLayout>
  );
}
