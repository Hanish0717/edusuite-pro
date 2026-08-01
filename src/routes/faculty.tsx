import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [{ title: "Faculty & Staff — EduSuite Pro" }],
  }),
  component: FacultyPage,
});

export function FacultyPage() {
  return (
    <DashboardLayout>
      <FacultyModuleView />
    </DashboardLayout>
  );
}
