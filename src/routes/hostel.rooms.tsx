import { createFileRoute } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hostel/rooms")({
  head: () => ({
    meta: [{ title: "Hostel Rooms — EduSuite Pro" }],
  }),
  component: HostelRoomsPage,
});

function HostelRoomsPage() {
  return (
    <ModulePage
      title="Room Allotments"
      description="Manage hostel room allocations, room configuration, and vacancy audits."
      icon={BedDouble}
      tabs={["Active Allotments", "Room Configuration", "Vacancy Audit"]}
      highlights={[
        { label: "Total Beds", value: "1,200" },
        { label: "Occupied Beds", value: "1,058" },
        { label: "Vacant Beds", value: "142" },
        { label: "Under Maintenance", value: "12" },
      ]}
    />
  );
}
