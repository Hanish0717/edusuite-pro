import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LibraryModuleView } from "@/modules/library";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library Management — EduSuite Pro" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <DashboardLayout>
      <LibraryModuleView />
    </DashboardLayout>
  );
}
