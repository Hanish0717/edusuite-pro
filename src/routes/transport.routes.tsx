import { createFileRoute } from "@tanstack/react-router";
import { Bus } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/transport/routes")({
  head: () => ({
    meta: [{ title: "Transport Routes — EduSuite Pro" }],
  }),
  component: TransportRoutesPage,
});

function TransportRoutesPage() {
  return (
    <ModulePage
      title="Transport Routes"
      description="Manage campus transport routes, stops sequence, and student mappings."
      icon={Bus}
      tabs={["Active Routes", "Stops Mappings", "Route Planning"]}
      highlights={[
        { label: "Active Routes", value: "22" },
        { label: "Total Stops", value: "148" },
        { label: "Assigned Students", value: "1,486" },
        { label: "Optimized Routes", value: "18" },
      ]}
    />
  );
}
