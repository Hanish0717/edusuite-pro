import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — EduSuite Pro" },
      { name: "description", content: "Catalogue and circulation in EduSuite Pro college ERP." },
      { property: "og:title", content: "Library — EduSuite Pro" },
      { property: "og:description", content: "Catalogue and circulation." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Library"
        description="Catalogue and circulation"
        icon={Library}
        tabs={["Catalogue", "Issued", "Fines"]}
        highlights={[{"label": "Titles", "value": "18,420"}, {"label": "Issued", "value": "1,204"}, {"label": "Overdue", "value": "86"}, {"label": "Fines", "value": "Rs 12,400"}]}
      />
    </DashboardLayout>
  );
}
