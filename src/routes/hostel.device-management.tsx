import { createFileRoute } from "@tanstack/react-router";
import { HostelDeviceManagementView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/device-management")({
  head: () => ({
    meta: [{ title: "Device Management — EduSuite Pro Hostel" }],
  }),
  component: HostelDeviceManagementPage,
});

function HostelDeviceManagementPage() {
  return <HostelDeviceManagementView />;
}
