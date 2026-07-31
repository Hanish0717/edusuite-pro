import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/examinations")({
  head: () => ({
    meta: [
      { title: "Examinations — EduSuite Pro" },
      { name: "description", content: "Schedules, hall tickets and internals in EduSuite Pro college ERP." },
      { property: "og:title", content: "Examinations — EduSuite Pro" },
      { property: "og:description", content: "Schedules, hall tickets and internals." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Examinations"
        description="Schedules, hall tickets and internals"
        icon={FileSpreadsheet}
        tabs={["Exam Schedule", "Hall Tickets", "Internal Marks"]}
        highlights={[{"label": "Upcoming", "value": "3"}, {"label": "Halls", "value": "24"}, {"label": "Hall Tickets", "value": "2,980"}, {"label": "Invigilators", "value": "140"}]}
      />
    </DashboardLayout>
  );
}
