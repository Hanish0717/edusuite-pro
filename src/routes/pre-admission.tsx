import { createFileRoute } from "@tanstack/react-router";
import { PreAdmissionCandidatePortal } from "@/modules/admission/PreAdmissionModule";

export const Route = createFileRoute("/pre-admission")({
  component: PreAdmissionCandidatePortal,
});
