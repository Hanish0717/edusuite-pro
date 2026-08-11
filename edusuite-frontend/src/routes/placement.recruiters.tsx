import { createFileRoute } from "@tanstack/react-router";
import { RecruiterManagementWorkspace } from "@/components/dashboard/role/recruiter-management";

export const Route = createFileRoute("/placement/recruiters")({
  head: () => ({
    meta: [{ title: "Recruiter Management — Placement Officer Portal" }],
  }),
  component: RecruitersPage,
});

function RecruitersPage() {
  return <RecruiterManagementWorkspace />;
}
