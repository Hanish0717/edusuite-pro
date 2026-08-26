import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LibraryStoreProvider, LibrarianTabProvider } from "@/librarian";

export const Route = createFileRoute("/librarian")({
  component: LibrarianLayout,
});

function LibrarianLayout() {

  return (
    <LibraryStoreProvider>
      <LibrarianTabProvider>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </LibrarianTabProvider>
    </LibraryStoreProvider>
  );
}
