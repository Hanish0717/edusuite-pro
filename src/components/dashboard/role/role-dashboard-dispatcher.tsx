import { normalizeRole } from "@/lib/roleResolver";
import { useRole } from "@/context/role-context";

// Role-specific static dashboard imports
import { SuperAdminDashboard } from "./super-admin-dashboard";
import { AdminDashboard } from "./admin-dashboard";
import { PrincipalDashboard } from "./principal-dashboard";
import { VicePrincipalDashboard } from "./vice-principal-dashboard";
import { DeanDashboard } from "./dean-dashboard";
import { HodDashboard } from "./hod-dashboard";
import { StaffDashboard } from "./staff-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { ParentDashboard } from "./parent-dashboard";
import { ExamCellDashboard } from "./exam-cell-dashboard";
import { LibrarianDashboard } from "./librarian-dashboard";
import { PlacementDashboard } from "./placement-dashboard";
import { WardenDashboard } from "./warden-dashboard";
import { TransportDashboard } from "./transport-dashboard";
import { AccountsDashboard } from "./accounts-dashboard";
import { LmsDashboard } from "./lms-dashboard";
import { AlumniCoordinatorDashboard } from "./alumni-coordinator-dashboard";
import { AlumniDashboard } from "./alumni-dashboard";

export function RoleDashboardDispatcher() {
  const { role, flags } = useRole();
  const canonicalRole = normalizeRole(role);

  // If staff has specific privilege flags, route to their specialized dashboard
  if (role === "staff") {
    if (flags.includes("isHod")) return <HodDashboard />;
    if (flags.includes("isDean")) return <DeanDashboard />;
    if (flags.includes("isExamController")) return <ExamCellDashboard />;
    if (flags.includes("isPlacementOfficer")) return <PlacementDashboard />;
    if (flags.includes("isLibraryAdmin")) return <LibrarianDashboard />;
    if (flags.includes("isTransportOfficer")) return <TransportDashboard />;
    if (flags.includes("isHostelWarden")) return <WardenDashboard />;
    if (flags.includes("isFinanceOfficer")) return <AccountsDashboard />;
    if (flags.includes("isPrincipal")) return <PrincipalDashboard />;
    if (flags.includes("isVicePrincipal")) return <VicePrincipalDashboard />;
    if (flags.includes("isSystemAdmin")) return <SuperAdminDashboard />;
    return <StaffDashboard />;
  }

  switch (canonicalRole) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "principal":
      return <PrincipalDashboard />;
    case "vice_principal":
      return <VicePrincipalDashboard />;
    case "dean":
      return <DeanDashboard />;
    case "hod":
      return <HodDashboard />;
    case "faculty":
      return <StaffDashboard />;
    case "student":
      return <StudentDashboard />;
    case "parent":
      return <ParentDashboard />;
    case "exam_cell":
      return <ExamCellDashboard />;
    case "librarian":
      return <LibrarianDashboard />;
    case "placement":
      return <PlacementDashboard />;
    case "warden":
      return <WardenDashboard />;
    case "transport":
      return <TransportDashboard />;
    case "accounts":
      return <AccountsDashboard />;
    case "lms":
      return <LmsDashboard />;
    case "alumni_coordinator":
      return <AlumniCoordinatorDashboard />;
    case "alumni":
      return <AlumniDashboard />;
    default:
      return <StaffDashboard />;
  }
}
