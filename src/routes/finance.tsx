import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — EduSuite Pro" },
      { name: "description", content: "Fees, payments and payroll in EduSuite Pro college ERP." },
      { property: "og:title", content: "Finance — EduSuite Pro" },
      { property: "og:description", content: "Fees, payments and payroll." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="Finance"
        description="Fees, payments and payroll"
        icon={Wallet}
        tabs={["Fee Plans", "Collections", "Payroll"]}
        highlights={[{"label": "Collected", "value": "Rs 12.4 Cr"}, {"label": "Pending", "value": "Rs 1.8 Cr"}, {"label": "Scholarships", "value": "Rs 62 L"}, {"label": "Payroll", "value": "Rs 3.1 Cr"}]}
      />
    </DashboardLayout>
  );
}
