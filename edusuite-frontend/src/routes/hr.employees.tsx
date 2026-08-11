import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hr/employees")({
  head: () => ({
    meta: [{ title: "Employee Registry — EduSuite Pro" }],
  }),
  component: HrEmployeesPage,
});

function HrEmployeesPage() {
  return (
    <ModulePage
      title="Employees Registry"
      description="Manage teaching faculty and non-teaching employee database profiles."
      icon={UserCog}
      tabs={["All Employees", "Onboarding", "Leave Management"]}
      highlights={[
        { label: "Total Employees", value: "264" },
        { label: "Teaching Staff", value: "186" },
        { label: "Non-Teaching", value: "78" },
        { label: "Leave Today", value: "12" },
      ]}
    />
  );
}
