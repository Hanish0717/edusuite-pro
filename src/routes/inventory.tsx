import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { InventoryModuleView } from "@/modules/inventory";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [{ title: "Inventory & Procurement — EduSuite Pro" }],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  return (
    <DashboardLayout>
      <InventoryModuleView />
    </DashboardLayout>
  );
}
