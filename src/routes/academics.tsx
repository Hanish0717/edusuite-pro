import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics — EduSuite Pro" },
      { name: "description", content: "Departments, courses and curriculum in EduSuite Pro college ERP." },
      { property: "og:title", content: "Academics — EduSuite Pro" },
      { property: "og:description", content: "Departments, courses and curriculum." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Academics"
        description="Departments, courses and curriculum"
        icon={GraduationCap}
        tabs={["Departments", "Courses", "Curriculum"]}
        highlights={[{"label": "Departments", "value": "8"}, {"label": "Programmes", "value": "14"}, {"label": "Courses", "value": "326"}, {"label": "Regulations", "value": "3"}]}
      />
    </DashboardLayout>
  );
}
