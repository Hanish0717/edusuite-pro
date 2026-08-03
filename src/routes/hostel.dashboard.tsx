import { createFileRoute } from "@tanstack/react-router";
import { HostelModuleView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/dashboard")({
  head: () => ({
    meta: [{ title: "Hostel Warden Dashboard — EduSuite Pro" }],
  }),
  component: HostelModuleView,
});
