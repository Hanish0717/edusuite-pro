import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

import { LibraryStoreProvider } from "@/modules/library/LibraryStore";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library Management — EduSuite Pro" }] }),
  component: LibraryPage,
});

export function LibraryPage() {
  return (
    <LibraryStoreProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </LibraryStoreProvider>
  );
}
