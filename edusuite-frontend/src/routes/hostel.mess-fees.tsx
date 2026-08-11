import { createFileRoute } from "@tanstack/react-router";
import { HostelMessFeesView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/mess-fees")({
  head: () => ({
    meta: [{ title: "Hostel Mess Fees & Rebates — EduSuite Pro" }],
  }),
  component: HostelMessFeesPage,
});

function HostelMessFeesPage() {
  return <HostelMessFeesView />;
}
