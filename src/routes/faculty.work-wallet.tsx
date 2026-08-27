import { createFileRoute } from "@tanstack/react-router";
import { FacultyExtraWorkWallet } from "@/components/extra-work/FacultyExtraWorkWallet";

export const Route = createFileRoute("/faculty/work-wallet")({
  head: () => ({
    meta: [{ title: "Faculty Extra Work Wallet — EduSuite Pro" }],
  }),
  component: FacultyWorkWalletPage,
});

function FacultyWorkWalletPage() {
  return <FacultyExtraWorkWallet />;
}
