import { createFileRoute } from "@tanstack/react-router";
import { PreAdmissionCandidatePortal } from "@/modules/admission/PreAdmissionModule";

export const Route = createFileRoute("/dashboard/pre-admission")({
  head: () => ({
    meta: [{ title: "Pre-Admission Candidate Portal — EduSuite Pro" }],
  }),
  component: PreAdmissionCandidatePortal,
});
