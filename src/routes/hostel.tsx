import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useRole } from "@/context/role-context";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { StudentHostelModule } from "@/components/student-hostel";

export const Route = createFileRoute("/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel Management — EduSuite Pro" },
      {
        name: "description",
        content: "Manage hostel accommodation, room details, mess services, gate passes, complaints and hostel payments.",
      },
    ],
  }),
  component: HostelLayout,
});

function HostelLayout() {
  const { role, flags } = useRole();

  if (role === "student") {
    return (
      <DashboardLayout>
        <StudentHostelModule />
      </DashboardLayout>
    );
  }

  if (role !== "super-admin" && (role !== "staff" || !flags.includes("isHostelWarden"))) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
          <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-bold">Access Denied</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            You need Hostel Warden privileges to view this section.
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
      <Outlet />
    </DashboardLayout>
  );
}
