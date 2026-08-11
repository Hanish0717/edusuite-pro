import { createFileRoute } from "@tanstack/react-router";
import { HostelLogHistoryView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/log-history")({
  head: () => ({
    meta: [{ title: "Log History — EduSuite Pro Hostel" }],
  }),
  component: HostelLogHistoryPage,
});

function HostelLogHistoryPage() {
  return <HostelLogHistoryView />;
}
