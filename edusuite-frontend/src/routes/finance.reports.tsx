import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";
import { fetchPayrollStats } from "@/modules/payroll/PayrollService";

export const Route = createFileRoute("/finance/reports")({
  head: () => ({
    meta: [{ title: "Finance Reports — EduSuite Pro" }],
  }),
  component: FinanceReportsPage,
});

function FinanceReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const s = await fetchPayrollStats();
        setStats(s);
      } catch {}
    }
    loadData();
  }, []);

  const totalPayrollPaidStr = stats
    ? `₹${(stats.totalNetSalary / 100000).toFixed(2)} Lakhs`
    : "₹1.13 Cr";

  return (
    <ModulePage
      title="Financial Reports"
      description="Manage salary payouts, tax computations, and balance reports."
      icon={Wallet}
      tabs={["Salary Payouts", "Tax Audits", "Balance Sheets"]}
      highlights={[
        { label: "Total Payroll Paid", value: totalPayrollPaidStr },
        { label: "Active Tax Audits", value: "1" },
        { label: "Operating Expenses", value: "Rs 14.8 L" },
        { label: "Net Cash Flow", value: "Positive" },
      ]}
    />
  );
}
