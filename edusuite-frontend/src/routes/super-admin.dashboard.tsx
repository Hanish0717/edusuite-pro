import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminDashboard } from "@/components/dashboard/role/super-admin-dashboard";

export const Route = createFileRoute("/super-admin/dashboard")({
  head: () => ({
    meta: [{ title: "Super Admin Dashboard — EduSuite Pro" }],
  }),
  component: SuperAdminDashboard,
});
