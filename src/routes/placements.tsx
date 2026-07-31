import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/placements")({
  head: () => ({
    meta: [
      { title: "Placements — EduSuite Pro" },
      { name: "description", content: "Drives, offers and recruiters in EduSuite Pro college ERP." },
      { property: "og:title", content: "Placements — EduSuite Pro" },
      { property: "og:description", content: "Drives, offers and recruiters." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Placements"
        description="Drives, offers and recruiters"
        icon={Briefcase}
        tabs={["Drives", "Offers", "Recruiters"]}
        highlights={[{"label": "Drives", "value": "42"}, {"label": "Offers", "value": "738"}, {"label": "Highest CTC", "value": "Rs 24 LPA"}, {"label": "Placed %", "value": "82"}]}
      />
    </DashboardLayout>
  );
}
