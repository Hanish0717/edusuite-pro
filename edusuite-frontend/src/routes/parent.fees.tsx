import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/parent/fees")({
  head: () => ({
    meta: [{ title: "Ward Fee Ledger — EduSuite Pro" }],
  }),
  component: ParentFeesPage,
});

function ParentFeesPage() {
  return (
    <ModulePage
      title="Ward Fee Ledger"
      description="Fee details, payment history, and active receipts ledger."
      icon={Wallet}
      tabs={["Active Dues", "Payment Ledger", "Receipts"]}
      highlights={[
        { label: "Total Dues", value: "Rs 45,000" },
        { label: "Paid this Year", value: "Rs 90,000" },
        { label: "Due Date", value: "15 Aug 2026" },
        { label: "Discount / Scholarship", value: "Rs 10,000" },
      ]}
    />
  );
}
