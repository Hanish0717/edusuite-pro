import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { useMemo } from "react";

import { ModulePage } from "@/components/dashboard/module-page";
import { useRole } from "@/context/role-context";
import { fetchHodDepartmentStats } from "@/lib/hodService";

export const Route = createFileRoute("/hod/attendance")({
  head: () => ({
    meta: [{ title: "HOD Attendance Controls — EduSuite Pro" }],
  }),
  component: HodAttendancePage,
});

function HodAttendancePage() {
  const { department } = useRole();
  const activeDept = department || "CSE";

  const stats = useMemo(() => fetchHodDepartmentStats(activeDept), [activeDept]);

  return (
    <ModulePage
      title={`${activeDept} Attendance Control`}
      description="Manage student shortage logs, condonation approvals, and alerts."
      icon={CalendarCheck}
      tabs={["Shortage Alerts", "Condonation Approvals", "Daily Stats"]}
      highlights={[
        { label: "Students Below 75%", value: "14" },
        { label: "Pending Approvals", value: String(stats.pendingApprovalsCount) },
        { label: "Average Attendance", value: stats.attendancePercentage },
        { label: "Condoned Today", value: "0" },
      ]}
    />
  );
}
