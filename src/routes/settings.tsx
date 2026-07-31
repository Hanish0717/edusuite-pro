import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EduSuite Pro" },
      { name: "description", content: "Institution, roles and preferences in EduSuite Pro college ERP." },
      { property: "og:title", content: "Settings — EduSuite Pro" },
      { property: "og:description", content: "Institution, roles and preferences." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Settings"
        description="Institution, roles and preferences"
        icon={Settings}
        tabs={["Institution", "Roles & Access", "Preferences"]}
        highlights={[{"label": "Campuses", "value": "3"}, {"label": "Roles", "value": "5"}, {"label": "Modules", "value": "16"}, {"label": "Integrations", "value": "7"}]}
      />
    </DashboardLayout>
  );
}
