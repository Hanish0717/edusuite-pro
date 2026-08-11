import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

import { ModulePage } from "@/components/dashboard/module-page";
import { useRole } from "@/context/role-context";
import { fetchHodDepartmentStats } from "@/lib/hodService";

export const Route = createFileRoute("/hod/reports")({
  head: () => ({
    meta: [{ title: "HOD Department Reports — EduSuite Pro" }],
  }),
  component: HodReportsPage,
});

function HodReportsPage() {
  const { department } = useRole();
  const activeDept = department || "CSE";

  const stats = useMemo(() => fetchHodDepartmentStats(activeDept), [activeDept]);

  return (
    <ModulePage
      title={`${activeDept} Department Reports`}
      description="Access academic metrics, student results statistics, and syllabus progress."
      icon={BarChart3}
      tabs={["Academic Metrics", "Syllabus Progress", "NBA/NAAC Logs"]}
      highlights={[
        { label: "Syllabus Covered", value: "62%" },
        { label: "Avg Mid Marks", value: "78%" },
        { label: "NBA Files Ready", value: "8 / 12" },
        { label: "Flagged Risks", value: String(stats.pendingApprovalsCount > 4 ? 3 : 2) },
      ]}
    />
  );
}
