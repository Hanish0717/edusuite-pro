import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "HR — EduSuite Pro" },
      { name: "description", content: "Staff records, leave and payroll in EduSuite Pro college ERP." },
      { property: "og:title", content: "HR — EduSuite Pro" },
      { property: "og:description", content: "Staff records, leave and payroll." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="HR"
        description="Staff records, leave and payroll"
        icon={UserCog}
        tabs={["Employees", "Leave", "Payroll"]}
        highlights={[{"label": "Employees", "value": "264"}, {"label": "Open Roles", "value": "6"}, {"label": "Leave Requests", "value": "18"}, {"label": "Attrition", "value": "4.2%"}]}
      />
    </DashboardLayout>
  );
}
