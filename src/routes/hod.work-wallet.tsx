import { createFileRoute } from "@tanstack/react-router";
import { HODExtraWorkConsole } from "@/components/extra-work/HODExtraWorkConsole";

export const Route = createFileRoute("/hod/work-wallet")({
  head: () => ({
    meta: [{ title: "HOD Work Wallet Verification — EduSuite Pro" }],
  }),
  component: HodWorkWalletPage,
});

function HodWorkWalletPage() {
  return <HODExtraWorkConsole />;
}
