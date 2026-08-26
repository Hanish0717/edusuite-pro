import { createFileRoute } from "@tanstack/react-router";
import { FeeManagementCockpit } from "@/components/admin-finance/FeeManagementCockpit";

export const Route = createFileRoute("/finance/fees")({
  head: () => ({
    meta: [{ title: "Fee Management Cockpit — EduSuite Pro" }],
  }),
  component: FinanceFeesPage,
});

function FinanceFeesPage() {
  return <FeeManagementCockpit />;
}

