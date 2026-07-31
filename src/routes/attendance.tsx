import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — EduSuite Pro" },
      { name: "description", content: "Period-wise attendance and shortage alerts in EduSuite Pro college ERP." },
      { property: "og:title", content: "Attendance — EduSuite Pro" },
      { property: "og:description", content: "Period-wise attendance and shortage alerts." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Attendance"
        description="Period-wise attendance and shortage alerts"
        icon={CalendarCheck}
        tabs={["Daily", "Subject Wise", "Shortage"]}
        highlights={[{"label": "Today", "value": "92%"}, {"label": "This Month", "value": "89%"}, {"label": "Shortage", "value": "112"}, {"label": "Condoned", "value": "23"}]}
      />
    </DashboardLayout>
  );
}
