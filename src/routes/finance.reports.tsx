import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/finance/reports")({
  head: () => ({
    meta: [{ title: "Finance Reports — EduSuite Pro" }],
  }),
  component: FinanceReportsPage,
});

function FinanceReportsPage() {
  return (
    <ModulePage
      title="Financial Reports"
      description="Manage salary payouts, tax computations, and balance reports."
      icon={Wallet}
      tabs={["Salary Payouts", "Tax Audits", "Balance Sheets"]}
      highlights={[
        { label: "Total Payroll Paid", value: "Rs 3.1 Cr" },
        { label: "Active Tax Audits", value: "1" },
        { label: "Operating Expenses", value: "Rs 14.8 L" },
        { label: "Net Cash Flow", value: "Positive" },
      ]}
    />
  );
}
