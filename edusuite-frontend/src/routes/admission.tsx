import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AdmissionModuleView } from "@/modules/admission";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [{ title: "Admission Management — EduSuite Pro" }],
  }),
  component: AdmissionPage,
});

function AdmissionPage() {
  return (
    <DashboardLayout>
      <AdmissionModuleView />
    </DashboardLayout>
  );
}
