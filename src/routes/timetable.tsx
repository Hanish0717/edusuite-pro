import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — EduSuite Pro" },
      { name: "description", content: "Period planning and substitutions in EduSuite Pro college ERP." },
      { property: "og:title", content: "Timetable — EduSuite Pro" },
      { property: "og:description", content: "Period planning and substitutions." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Timetable"
        description="Period planning and substitutions"
        icon={CalendarRange}
        tabs={["Class View", "Faculty View", "Substitutions"]}
        highlights={[{"label": "Sections", "value": "46"}, {"label": "Periods/Week", "value": "1,380"}, {"label": "Clashes", "value": "0"}, {"label": "Substitutions", "value": "7"}]}
      />
    </DashboardLayout>
  );
}
