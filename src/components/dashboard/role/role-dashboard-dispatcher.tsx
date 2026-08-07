import { useRole } from "@/context/role-context";
import { getDashboardKeyForUser } from "@/lib/permissions";

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
import { LibrarianDashboard } from "@/librarian";
import { PlacementDashboard } from "./placement-dashboard";
import { WardenDashboard } from "./warden-dashboard";
import { TransportDashboard } from "./transport-dashboard";
import { AccountsDashboard } from "./accounts-dashboard";
import { LmsDashboard } from "./lms-dashboard";
import { AlumniCoordinatorDashboard } from "./alumni-coordinator-dashboard";
import { AlumniDashboard } from "./alumni-dashboard";
import { AcademicManagementDashboard } from "./academic-management-dashboard";

import {
  AcademicDeanDashboard,
  StudentDeanDashboard,
  IQACDashboard,
  IMADashboard,
  ResearchDeanDashboard,
  FinanceDeanDashboard,
  ExaminationDeanDashboard,
  PlacementDeanDashboard,
} from "@/modules/deans";

const DASHBOARD_MAP: Record<string, React.ComponentType> = {
  super_admin: SuperAdminDashboard,
  admin: AdminDashboard,
  principal: PrincipalDashboard,
  vice_principal: VicePrincipalDashboard,
  dean: DeanDashboard,
  academic_dean: AcademicDeanDashboard,
  student_dean: StudentDeanDashboard,
  iqac_dean: IQACDashboard,
  ima_dean: IMADashboard,
  research_dean: ResearchDeanDashboard,
  finance_dean: FinanceDeanDashboard,
  examination_dean: ExaminationDeanDashboard,
  placement_dean: PlacementDeanDashboard,
  hod: HodDashboard,
  staff: StaffDashboard,
  faculty: StaffDashboard,
  student: StudentDashboard,
  parent: ParentDashboard,
  exam_cell: ExamCellDashboard,
  librarian: LibrarianDashboard,
  placement: PlacementDashboard,
  warden: WardenDashboard,
  transport: TransportDashboard,
  accounts: AccountsDashboard,
  lms: LmsDashboard,
  alumni_coordinator: AlumniCoordinatorDashboard,
  alumni: AlumniDashboard,
  academic_management: AcademicManagementDashboard,
};

export function RoleDashboardDispatcher() {
  const { role, flags, department, externalPersona } = useRole();

  const key = getDashboardKeyForUser({ role, flags, department, externalPersona });
  const DashboardComponent = DASHBOARD_MAP[key] || DASHBOARD_MAP[role] || StaffDashboard;

  return <DashboardComponent />;
}
