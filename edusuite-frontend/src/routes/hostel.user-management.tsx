import { createFileRoute } from "@tanstack/react-router";
import { HostelUserManagementView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/user-management")({
  head: () => ({
    meta: [{ title: "User Management — EduSuite Pro Hostel" }],
  }),
  component: HostelUserManagementPage,
});

function HostelUserManagementPage() {
  return <HostelUserManagementView />;
}
