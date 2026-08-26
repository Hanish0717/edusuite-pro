import { createFileRoute } from "@tanstack/react-router";
import { FeeManagementCockpit } from "@/components/admin-finance/FeeManagementCockpit";

export const Route = createFileRoute("/staff/finance-dean/fees")({
  head: () => ({ meta: [{ title: "Fee Management Cockpit — Finance Dean — EduSuite Pro" }] }),
  component: () => <FeeManagementCockpit />,
});

