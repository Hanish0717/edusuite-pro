import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hr/payroll")({
  head: () => ({
    meta: [{ title: "HR Payroll — EduSuite Pro" }],
  }),
  component: HrPayrollPage,
});

function HrPayrollPage() {
  return (
    <ModulePage
      title="Payroll & Payslips"
      description="Manage salary structures, monthly payroll release, tax logs, and payslips."
      icon={UserCog}
      tabs={["Salary Structure", "Generate Payslips", "Tax Declarations"]}
      highlights={[
        { label: "Monthly Payroll", value: "Rs 1.48 Cr" },
        { label: "Processed count", value: "264" },
        { label: "Due Release", value: "05 Aug" },
        { label: "TDS Logs", value: "Pending" },
      ]}
    />
  );
}
