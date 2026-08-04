import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { useMemo } from "react";

import { ModulePage } from "@/components/dashboard/module-page";
import { useRole } from "@/context/role-context";
import { fetchHodDepartmentStats, fetchHodFaculty } from "@/lib/hodService";

export const Route = createFileRoute("/hod/faculty")({
  head: () => ({
    meta: [{ title: "HOD Faculty Control — EduSuite Pro" }],
  }),
  component: HodFacultyPage,
});

function HodFacultyPage() {
  const { department } = useRole();
  const activeDept = department || "CSE";

  const stats = useMemo(() => fetchHodDepartmentStats(activeDept), [activeDept]);
  const facultyMembers = useMemo(() => fetchHodFaculty(activeDept), [activeDept]);

  const leaveCount = facultyMembers.reduce((acc, f) => acc + f.pendingLeaves, 0);

  return (
    <ModulePage
      title={`${activeDept} Department Faculty`}
      description="Manage department faculty profiles, load distribution, and leaves."
      icon={UserCog}
      tabs={["Active Faculty", "Load Distribution", "Leave Approvals"]}
      highlights={[
        { label: "Dept Faculty", value: String(stats.facultyCount) },
        { label: "Avg Load Hour", value: "14 hrs" },
        { label: "Pending Leaves", value: String(leaveCount) },
        { label: "Vacant Slots", value: "1" },
      ]}
    />
  );
}
