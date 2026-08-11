import { createFileRoute } from "@tanstack/react-router";
import { ExternalUserDashboard } from "@/components/dashboard/role/external-user-dashboard";

export const Route = createFileRoute("/external-user/dashboard")({
  head: () => ({
    meta: [{ title: "External Partner Portal — EduSuite Pro" }],
  }),
  component: ExternalUserDashboard,
});
