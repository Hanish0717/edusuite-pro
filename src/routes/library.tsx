import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LibraryModuleView } from "@/modules/library";

import { LibraryStoreProvider } from "@/modules/library/LibraryStore";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library Management — EduSuite Pro" }] }),
  component: LibraryPage,
});

export function LibraryPage() {
  return (
    <LibraryStoreProvider>
      <DashboardLayout>
        <LibraryModuleView />
      </DashboardLayout>
    </LibraryStoreProvider>
  );
}
