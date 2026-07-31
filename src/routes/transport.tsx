import { createFileRoute } from "@tanstack/react-router";
import { Bus } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/transport")({
  head: () => ({
    meta: [
      { title: "Transport — EduSuite Pro" },
      { name: "description", content: "Routes, stops and tracking in EduSuite Pro college ERP." },
      { property: "og:title", content: "Transport — EduSuite Pro" },
      { property: "og:description", content: "Routes, stops and tracking." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Transport"
        description="Routes, stops and tracking"
        icon={Bus}
        tabs={["Routes", "Vehicles", "Tracking"]}
        highlights={[{"label": "Routes", "value": "22"}, {"label": "Buses", "value": "28"}, {"label": "Riders", "value": "1,486"}, {"label": "On Time", "value": "96%"}]}
      />
    </DashboardLayout>
  );
}
