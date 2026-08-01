import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { ShieldAlert, LogIn } from "lucide-react";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/super-admin")({
  beforeLoad: () => {
    // Authentication Guard Check
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token && typeof window !== "undefined") {
      // If no token exists, redirect to login page
      throw redirect({ to: "/login" });
    }
  },
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  const { role } = useRole();

  // Strict Role Verification Guard
  const isSuperAdmin = role === "super-admin" || role === "super_admin";

  if (!isSuperAdmin) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6 space-y-3">
          <ShieldAlert className="size-10 text-destructive mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Access Denied (403 Forbidden)</h3>
          <p className="text-xs text-muted-foreground">
            You require strict <strong>Super Admin</strong> privileges to access the institutional controller cockpits.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <Button asChild variant="outline" className="rounded-xl text-xs">
              <Link to="/login">
                <LogIn className="size-3.5 mr-1" /> Re-authenticate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
