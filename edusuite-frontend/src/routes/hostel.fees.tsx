import { createFileRoute } from "@tanstack/react-router";
import { HostelFeesView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/fees")({
  head: () => ({
    meta: [{ title: "Hostel Fee Collection — EduSuite Pro" }],
  }),
  component: HostelFeesPage,
});

function HostelFeesPage() {
  return <HostelFeesView />;
}
