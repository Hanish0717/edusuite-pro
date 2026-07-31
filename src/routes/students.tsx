import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — EduSuite Pro" },
      { name: "description", content: "Student information and lifecycle in EduSuite Pro college ERP." },
      { property: "og:title", content: "Students — EduSuite Pro" },
      { property: "og:description", content: "Student information and lifecycle." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Students"
        description="Student information and lifecycle"
        icon={Users}
        tabs={["All Students", "Admissions", "Documents"]}
        highlights={[{"label": "Total", "value": "3,240"}, {"label": "New Admissions", "value": "612"}, {"label": "At Risk", "value": "48"}, {"label": "Alumni", "value": "5,120"}]}
      />
    </DashboardLayout>
  );
}
