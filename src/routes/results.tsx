import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — EduSuite Pro" },
      { name: "description", content: "Result publishing and analytics in EduSuite Pro college ERP." },
      { property: "og:title", content: "Results — EduSuite Pro" },
      { property: "og:description", content: "Result publishing and analytics." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Results"
        description="Result publishing and analytics"
        icon={Award}
        tabs={["Published", "Revaluation", "Toppers"]}
        highlights={[{"label": "Pass %", "value": "93.4"}, {"label": "Distinctions", "value": "486"}, {"label": "Revaluations", "value": "38"}, {"label": "Backlogs", "value": "212"}]}
      />
    </DashboardLayout>
  );
}
