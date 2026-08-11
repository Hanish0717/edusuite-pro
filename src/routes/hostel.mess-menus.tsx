import { createFileRoute } from "@tanstack/react-router";
import { HostelMessMenusView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/mess-menus")({
  head: () => ({
    meta: [{ title: "Hostel Mess Menus — EduSuite Pro" }],
  }),
  component: HostelMessMenusPage,
});

function HostelMessMenusPage() {
  return <HostelMessMenusView />;
}
