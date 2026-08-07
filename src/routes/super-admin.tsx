import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ShieldAlert, LogIn } from "lucide-react";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/super-admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", "super-admin-auth-token");
      }
    }
  },
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  const { role } = useRole();
  const isSuperAdmin = role === "super_admin" || (role as string) === "super-admin";

  if (!isSuperAdmin) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6 space-y-3">
          <ShieldAlert className="size-10 text-destructive mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Super Admin Access Control</h3>
          <p className="text-xs text-muted-foreground">
            You are currently viewing in limited persona mode. Switch to <strong>Super Admin</strong> in the topbar to control all institutional modules.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <Button asChild variant="outline" className="rounded-xl text-xs">
              <Link to="/login">
                <LogIn className="size-3.5 mr-1" /> Login Page
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
