import { createFileRoute } from "@tanstack/react-router";
import { HostelMessManagementView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/mess-management")({
  head: () => ({
    meta: [{ title: "Mess Management — EduSuite Pro Hostel" }],
  }),
  component: HostelMessManagementPage,
});

function HostelMessManagementPage() {
  return <HostelMessManagementView />;
}
