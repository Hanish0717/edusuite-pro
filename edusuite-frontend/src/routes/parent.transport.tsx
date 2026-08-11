import { createFileRoute } from "@tanstack/react-router";
import { Bus } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/parent/transport")({
  head: () => ({
    meta: [{ title: "Ward Transport — EduSuite Pro" }],
  }),
  component: ParentTransportPage,
});

function ParentTransportPage() {
  return (
    <ModulePage
      title="Ward Transport"
      description="Live bus route tracking, checkpoints log, and driver alerts."
      icon={Bus}
      tabs={["Live Location", "Route Timings", "Driver Details"]}
      highlights={[
        { label: "Active Bus", value: "Route 12 (AP-04-X-9922)" },
        { label: "Status", value: "En Route" },
        { label: "Next Stop", value: "Miyapur Cross Roads" },
        { label: "Driver Contact", value: "+91 91234 56789" },
      ]}
    />
  );
}
