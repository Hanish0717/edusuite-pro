import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LibraryModuleView } from "@/modules/library";

export const Route = createFileRoute("/library/books")({
  head: () => ({
    meta: [{ title: "Library Catalogue — EduSuite Pro" }],
  }),
  component: () => (
    <DashboardLayout>
      <LibraryModuleView />
    </DashboardLayout>
  ),
});
