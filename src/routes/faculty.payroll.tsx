import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/payroll")({
  head: () => ({
    meta: [{ title: "Payroll — EduSuite Pro" }],
  }),
  component: FacultyPayrollPage,
});

function FacultyPayrollPage() {
  return (
    <ModulePage
      title="Payroll & Payslips"
      description="View monthly salaries, benefits, tax sheets, and payslips"
      icon={Wallet}
      tabs={["Payslips", "Tax Breakdown", "Reimbursements"]}
      highlights={[
        { label: "Gross Salary (Monthly)", value: "$7,200" },
        { label: "Deductions", value: "$420" },
        { label: "Tax Regime", value: "Standard" },
        { label: "Last Payslip", value: "July 2026" },
      ]}
    />
  );
}
