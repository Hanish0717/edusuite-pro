import { createFileRoute } from "@tanstack/react-router";
import { FinanceDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/finance-dean/")({
  head: () => ({
    meta: [
      { title: "Finance Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Institutional budget, expense management, and audit logs." },
    ],
  }),
  component: FinanceIndexPage,
});

function FinanceIndexPage() {
  return <FinanceDeanDashboard />;
}
