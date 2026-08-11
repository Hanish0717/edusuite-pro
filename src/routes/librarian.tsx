import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";

import { LibraryStoreProvider, LibrarianTabProvider } from "@/librarian";

export const Route = createFileRoute("/librarian")({
  component: LibrarianLayout,
});

function LibrarianLayout() {
  const { role, flags } = useRole();

  if (
    (role as any) !== "super-admin" && (role as any) !== "super_admin" &&
    role !== "librarian" &&
    (role !== "staff" || !flags.includes("isLibraryAdmin"))
  ) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
          <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            You need Librarian / Library Admin privileges to view this section.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

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
