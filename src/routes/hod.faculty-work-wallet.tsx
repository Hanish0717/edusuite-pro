import { createFileRoute } from "@tanstack/react-router";
import { HODExtraWorkConsole } from "@/components/extra-work/HODExtraWorkConsole";

export const Route = createFileRoute("/hod/faculty-work-wallet")({
  head: () => ({
    meta: [{ title: "Department Faculty Work Wallet — EduSuite Pro" }],
  }),
  component: HodFacultyWorkWalletPage,
});

function HodFacultyWorkWalletPage() {
  return <HODExtraWorkConsole />;
}
