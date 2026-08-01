import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [{ title: "Faculty & Staff — EduSuite Pro" }],
  }),
  component: FacultyPage,
});

export function FacultyPage() {
  const { role } = useRole();
  const isSuperAdmin = role === "super-admin" || role === "super_admin";

  if (role !== "staff" && !isSuperAdmin) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
          <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            You need Staff (Faculty) privileges to view this section. Please switch your role in the
            topbar or log in.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <FacultyModuleView />
    </DashboardLayout>
  );
}
