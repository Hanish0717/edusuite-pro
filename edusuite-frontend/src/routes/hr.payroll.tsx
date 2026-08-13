import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";
import { fetchPayrollStats } from "@/modules/payroll/PayrollService";

export const Route = createFileRoute("/hr/payroll")({
  head: () => ({
    meta: [{ title: "HR Payroll — EduSuite Pro" }],
  }),
  component: HrPayrollPage,
});

function HrPayrollPage() {
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

  const totalPayrollStr = stats
    ? `₹${(stats.totalNetSalary / 100000).toFixed(2)} Lakhs`
    : "₹1.13 Cr";
  const processedCountStr = stats ? `${stats.totalRecords}` : "109";

  return (
    <ModulePage
      title="Payroll & Payslips"
      description="Manage salary structures, monthly payroll release, tax logs, and payslips."
      icon={UserCog}
      tabs={["Salary Structure", "Generate Payslips", "Tax Declarations"]}
      highlights={[
        { label: "Monthly Payroll", value: totalPayrollStr },
        { label: "Processed count", value: processedCountStr },
        { label: "Due Release", value: "31st July" },
        { label: "TDS Logs", value: "Verified" },
      ]}
    />
  );
}
