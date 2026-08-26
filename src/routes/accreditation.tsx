import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AccreditationModuleView } from "@/modules/accreditation";

export const Route = createFileRoute("/accreditation")({
  head: () => ({
    meta: [{ title: "Accreditation & IQAC — EduSuite Pro" }],
  }),
  component: AccreditationPage,
});

export function AccreditationPage() {
  return (
    <DashboardLayout>
      <AccreditationModuleView />
    </DashboardLayout>
  );
}
