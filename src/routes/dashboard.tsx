import { createFileRoute } from "@tanstack/react-router";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HodDashboard } from "@/components/dashboard/role/hod-dashboard";
import { ParentDashboard } from "@/components/dashboard/role/parent-dashboard";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";
import { StudentDashboard } from "@/components/dashboard/role/student-dashboard";
import { SuperAdminDashboard } from "@/components/dashboard/role/super-admin-dashboard";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EduSuite Pro" },
      { name: "description", content: "Role-based campus dashboard for admins, faculty, students, parents and HODs." },
      { property: "og:title", content: "Dashboard — EduSuite Pro" },
      { property: "og:description", content: "Role-based campus dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = useRole();

  return (
    <DashboardLayout>
      {role === "super-admin" && <SuperAdminDashboard />}
      {role === "staff" && <StaffDashboard />}
      {role === "student" && <StudentDashboard />}
      {role === "parent" && <ParentDashboard />}
      {role === "hod" && <HodDashboard />}
    </DashboardLayout>
  );
}
