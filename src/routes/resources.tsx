import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ResourceManagementModuleView } from "@/modules/resources";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Classroom & Laboratory Resources — EduSuite Pro" },
      {
        name: "description",
        content: "Manage classrooms, laboratories, resource allocation, utilization, and maintenance.",
      },
    ],
  }),
  component: ResourcesPage,
});

export function ResourcesPage() {
  return (
    <DashboardLayout>
      <ResourceManagementModuleView />
    </DashboardLayout>
  );
}
