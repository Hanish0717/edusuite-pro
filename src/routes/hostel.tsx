import { createFileRoute } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel — EduSuite Pro" },
      { name: "description", content: "Room allotment and mess in EduSuite Pro college ERP." },
      { property: "og:title", content: "Hostel — EduSuite Pro" },
      { property: "og:description", content: "Room allotment and mess." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Hostel"
        description="Room allotment and mess"
        icon={BedDouble}
        tabs={["Blocks", "Allotment", "Mess"]}
        highlights={[{"label": "Blocks", "value": "6"}, {"label": "Occupancy", "value": "88%"}, {"label": "Vacant Beds", "value": "142"}, {"label": "Mess Bills", "value": "Rs 8.2L"}]}
      />
    </DashboardLayout>
  );
}
