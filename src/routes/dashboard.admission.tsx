import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AdmissionModuleView } from "@/modules/admission/AdmissionComponents";

export const Route = createFileRoute("/dashboard/admission")({
  head: () => ({
    meta: [{ title: "Admission Desk — EduSuite Pro" }],
  }),
  component: DashboardAdmissionPage,
});

function DashboardAdmissionPage() {
  return (
    <DashboardLayout>
      <AdmissionModuleView />
    </DashboardLayout>
  );
}
