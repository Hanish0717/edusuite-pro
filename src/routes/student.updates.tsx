import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ErpUpdatesModule } from "@/components/erp-updates";

export const Route = createFileRoute("/student/updates")({
  head: () => ({
    meta: [
      { title: "Updates — EduSuite Pro" },
      {
        name: "description",
        content: "Stay informed with the latest ERP improvements, platform enhancements, new features, maintenance announcements and release notes.",
      },
      { property: "og:title", content: "Updates — EduSuite Pro" },
      { property: "og:description", content: "Stay informed with the latest ERP improvements, platform enhancements, new features, maintenance announcements and release notes." },
    ],
  }),
  component: StudentUpdatesRoute,
});

function StudentUpdatesRoute() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <ErpUpdatesModule />
      </div>
    </DashboardLayout>
  );
}
