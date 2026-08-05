import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicSettingsModuleView } from "@/modules/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Academic Settings & System Configuration — EduSuite Pro" },
      {
        name: "description",
        content: "Configure institution-wide academic settings, policies, grading systems, regulations, semesters, attendance rules, and examination policies.",
      },
    ],
  }),
  component: SettingsPage,
});

export function SettingsPage() {
  return (
    <DashboardLayout>
      <AcademicSettingsModuleView />
    </DashboardLayout>
  );
}
