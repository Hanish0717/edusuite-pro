import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PlacementModuleView } from "@/modules/placement";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [{ title: "Placement & Training Cell — EduSuite Pro" }],
  }),
  component: PlacementPage,
});

export function PlacementPage() {
  return (
    <DashboardLayout>
      <PlacementModuleView />
    </DashboardLayout>
  );
}
