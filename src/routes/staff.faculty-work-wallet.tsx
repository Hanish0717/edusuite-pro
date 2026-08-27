import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { InstitutionExtraWorkGovernance } from "@/components/extra-work/InstitutionExtraWorkGovernance";
import { HODExtraWorkConsole } from "@/components/extra-work/HODExtraWorkConsole";
import { ResearchExtraWorkGovernance } from "@/components/extra-work/ResearchExtraWorkGovernance";
import { IQACExtraWorkGovernance } from "@/components/extra-work/IQACExtraWorkGovernance";

export const Route = createFileRoute("/staff/faculty-work-wallet")({
  head: () => ({
    meta: [{ title: "Faculty Extra Work Governance — EduSuite Pro" }],
  }),
  component: StaffFacultyWorkWalletPage,
});

function StaffFacultyWorkWalletPage() {
  const { role, flags, profile } = useRole();
  const persona = profile.externalPersona?.toLowerCase() || "";

  if (role === "super_admin" || role === "super-admin") {
    return <InstitutionExtraWorkGovernance />;
  }

  if (persona.includes("research") || flags.includes("isResearchDean")) {
    return <ResearchExtraWorkGovernance />;
  }

  if (persona.includes("iqac") || flags.includes("isIQAC")) {
    return <IQACExtraWorkGovernance />;
  }

  if (flags.includes("isHod") || role === "hod") {
    return <HODExtraWorkConsole />;
  }

  return <InstitutionExtraWorkGovernance />;
}
