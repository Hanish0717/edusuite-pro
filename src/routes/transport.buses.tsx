import { createFileRoute } from "@tanstack/react-router";
import { Bus } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/transport/buses")({
  head: () => ({
    meta: [{ title: "Transport Fleet — EduSuite Pro" }],
  }),
  component: TransportBusesPage,
});

function TransportBusesPage() {
  return (
    <ModulePage
      title="Vehicles Fleet"
      description="Manage transport buses fleet, driver profiles, and GPS status."
      icon={Bus}
      tabs={["Active Fleet", "Drivers Profiles", "Maintenance Logs"]}
      highlights={[
        { label: "Total Vehicles", value: "28" },
        { label: "GPS Online", value: "27 / 28" },
        { label: "Drivers Count", value: "32" },
        { label: "FC Due Soon", value: "2" },
      ]}
    />
  );
}
