import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EduSuite Pro" },
      {
        name: "description",
        content: "Institution analytics and compliance in EduSuite Pro college ERP.",
      },
      { property: "og:title", content: "Reports — EduSuite Pro" },
      { property: "og:description", content: "Institution analytics and compliance." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Reports"
        description="Institution analytics and compliance"
        icon={BarChart3}
        tabs={["Academic", "Financial", "Compliance"]}
        highlights={[
          { label: "Dashboards", value: "24" },
          { label: "Scheduled", value: "12" },
          { label: "NAAC Ready", value: "Yes" },
          { label: "Exports", value: "318" },
        ]}
      />
    </DashboardLayout>
  );
}
