import { createFileRoute } from "@tanstack/react-router";
import { PayrollModuleView } from "@/modules/payroll/PayrollComponents";

export const Route = createFileRoute("/faculty/payroll")({
  head: () => ({
    meta: [{ title: "Payroll & Payslips — EduSuite Pro" }],
  }),
  component: FacultyPayrollPage,
});

function FacultyPayrollPage() {
  return <PayrollModuleView />;
}

