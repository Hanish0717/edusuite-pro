import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Communication — EduSuite Pro" },
      { name: "description", content: "Circulars, SMS and notifications in EduSuite Pro college ERP." },
      { property: "og:title", content: "Communication — EduSuite Pro" },
      { property: "og:description", content: "Circulars, SMS and notifications." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Communication"
        description="Circulars, SMS and notifications"
        icon={MessageSquare}
        tabs={["Circulars", "SMS", "Templates"]}
        highlights={[{"label": "Sent Today", "value": "1,240"}, {"label": "Templates", "value": "36"}, {"label": "Delivery", "value": "98.6%"}, {"label": "Unread", "value": "6"}]}
      />
    </DashboardLayout>
  );
}
