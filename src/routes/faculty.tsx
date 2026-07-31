import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty — EduSuite Pro" },
      { name: "description", content: "Faculty profiles and workload in EduSuite Pro college ERP." },
      { property: "og:title", content: "Faculty — EduSuite Pro" },
      { property: "og:description", content: "Faculty profiles and workload." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Faculty"
        description="Faculty profiles and workload"
        icon={UserCog}
        tabs={["Profiles", "Workload", "Leave"]}
        highlights={[{"label": "Faculty", "value": "186"}, {"label": "Departments", "value": "8"}, {"label": "On Leave", "value": "4"}, {"label": "Avg Load", "value": "16 hrs"}]}
      />
    </DashboardLayout>
  );
}
