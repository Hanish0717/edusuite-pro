import { createFileRoute } from "@tanstack/react-router";
import { HostelBlocksView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/blocks")({
  head: () => ({
    meta: [{ title: "Block Management — EduSuite Pro Hostel" }],
  }),
  component: HostelBlocksPage,
});

function HostelBlocksPage() {
  return <HostelBlocksView />;
}
