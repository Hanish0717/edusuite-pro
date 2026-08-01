import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [{ title: "Academics & Curriculum — EduSuite Pro" }],
  }),
  component: AcademicsPage,
});

export function AcademicsPage() {
  return (
    <DashboardLayout>
      <AcademicsModuleView />
    </DashboardLayout>
  );
}
