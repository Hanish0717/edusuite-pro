import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/finance/fees")({
  head: () => ({
    meta: [{ title: "Finance Fee Plans — EduSuite Pro" }],
  }),
  component: FinanceFeesPage,
});

function FinanceFeesPage() {
  return (
    <ModulePage
      title="Fees Management"
      description="Manage fee structures, collection metrics, and scholarship programs."
      icon={Wallet}
      tabs={["Fee Plans", "Collections Status", "Scholarships Log"]}
      highlights={[
        { label: "Total Target", value: "Rs 14.2 Cr" },
        { label: "Collected amount", value: "Rs 12.4 Cr" },
        { label: "Pending Dues", value: "Rs 1.8 Cr" },
        { label: "Scholarships", value: "Rs 62 L" },
      ]}
    />
  );
}
