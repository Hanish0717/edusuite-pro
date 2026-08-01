import type { LoginRole, DepartmentCode, ExternalPersona } from "@/config/roles";

export type PermissionAction = "read" | "create" | "update" | "delete" | "approve";

export type PermissionScope = "own" | "department" | "school" | "campus" | "institution" | "global";

export interface UserPermissionContext {
  role: LoginRole;
  flags: string[];
  department?: DepartmentCode | undefined;
  externalPersona?: ExternalPersona | undefined;
  featureFlags?: Record<string, boolean> | undefined;
}

// Module IDs mapping:
// admission, student-info, academics, attendance, examination, lms, placement, hostel, transport, library, finance, hrms, inventory, accreditation, communication, grievance, alumni

export interface ModulePermissions {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  scope: PermissionScope;
}

// Helper to check if a specific staff flag grants admin control over a module
export function getFlagOverrideForModule(
  flags: string[],
  moduleId: string,
): Partial<ModulePermissions> | null {
  if (flags.includes("isSystemAdmin") || flags.includes("isPrincipal")) {
    return { read: true, create: true, update: true, delete: true, approve: true, scope: "global" };
  }

  switch (moduleId) {
    case "admission":
      if (flags.includes("isPrincipal") || flags.includes("isVicePrincipal")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "institution",
        };
      }
      break;
    case "student-info":
      if (flags.includes("isHod")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "department",
        };
      }
      if (flags.includes("isClassAdvisor") || flags.includes("isMentor")) {
        return {
          read: true,
          create: false,
          update: true,
          delete: false,
          approve: false,
          scope: "department",
        };
      }
      break;
    case "academics":
      if (flags.includes("isDean")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "school",
        };
      }
      if (flags.includes("isHod")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: true,
          scope: "department",
        };
      }
      break;
    case "attendance":
      if (flags.includes("isHod")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "department",
        }; // Attendance override
      }
      break;
    case "examination":
      if (flags.includes("isExamController")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      if (flags.includes("isHod")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: true,
          scope: "department",
        };
      }
      break;
    case "placement":
      if (flags.includes("isPlacementOfficer")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "hostel":
      if (flags.includes("isHostelWarden")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "transport":
      if (flags.includes("isTransportOfficer")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "library":
      if (flags.includes("isLibraryAdmin")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "finance":
      if (flags.includes("isFinanceOfficer")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "hrms":
      if (flags.includes("isHRManager")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "inventory":
      if (flags.includes("isInventoryManager") || flags.includes("isPurchaseManager")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "accreditation":
      if (
        flags.includes("isIQACCoordinator") ||
        flags.includes("isNAACCoordinator") ||
        flags.includes("isNBACoordinator")
      ) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: true,
          scope: "global",
        };
      }
      break;
    case "alumni":
      if (flags.includes("isTrainingCoordinator")) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: false,
          scope: "global",
        };
      }
      break;
  }

  return null;
}

// Get the base permissions for a core login role
export function getBasePermissions(
  role: LoginRole,
  moduleId: string,
  externalPersona?: ExternalPersona,
): ModulePermissions {
  const denyAll: ModulePermissions = {
    read: false,
    create: false,
    update: false,
    delete: false,
    approve: false,
    scope: "own",
  };

  if (role === "super-admin") {
    return { read: true, create: true, update: true, delete: true, approve: true, scope: "global" };
  }

  switch (role) {
    case "student":
      // Students have read-only access to most things and own-scoped access
      if (["student-info", "attendance", "examination", "lms", "results"].includes(moduleId)) {
        return {
          read: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (moduleId === "finance") {
        return {
          read: true,
          create: true,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        }; // Pay fees
      }
      if (moduleId === "transport" || moduleId === "library") {
        return {
          read: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (moduleId === "grievance") {
        return {
          read: true,
          create: true,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        }; // Raise grievance
      }
      break;

    case "parent":
      // Parents view their child's data
      if (
        ["student-info", "attendance", "examination", "results", "finance", "transport"].includes(
          moduleId,
        )
      ) {
        return {
          read: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      break;

    case "external-user":
      // External User access depends on the sub-persona
      if (!externalPersona) return denyAll;

      if (externalPersona === "applicant" && moduleId === "admission") {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (externalPersona === "alumni" && moduleId === "alumni") {
        return {
          read: true,
          create: false,
          update: true,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (externalPersona === "recruiter" && moduleId === "placement") {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (externalPersona === "vendor" && moduleId === "inventory") {
        return {
          read: true,
          create: false,
          update: true,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      if (externalPersona === "guest-faculty" && moduleId === "academics") {
        return {
          read: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
          scope: "own",
        };
      }
      break;

    case "staff":
      // Default Staff access: Profile, Attendance, Leave, Calendar, Documents, LMS
      if (["student-info", "attendance", "academics", "lms"].includes(moduleId)) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: false,
          scope: "department",
        };
      }
      if (["examination", "library", "transport", "hostel"].includes(moduleId)) {
        return {
          read: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
          scope: "institution",
        };
      }
      if (["communication", "grievance"].includes(moduleId)) {
        return {
          read: true,
          create: true,
          update: true,
          delete: false,
          approve: false,
          scope: "department",
        };
      }
      break;
  }

  return denyAll;
}

// Master permission checker
// Formula: Permission = Role + Privilege + Module + Action + Scope
export function hasPermission(
  user: UserPermissionContext,
  moduleId: string,
  action: PermissionAction,
): { allowed: boolean; scope: PermissionScope } {
  // 0. Licensing & Feature Flags Check
  if (user.featureFlags) {
    if (moduleId === "finance" && !user.featureFlags["finance"])
      return { allowed: false, scope: "own" };
    if (moduleId === "hostel" && !user.featureFlags["hostel"]) return { allowed: false, scope: "own" };
    if (moduleId === "transport" && !user.featureFlags["transport"])
      return { allowed: false, scope: "own" };
    if (moduleId === "placement" && !user.featureFlags["placement"])
      return { allowed: false, scope: "own" };
    if (moduleId === "library" && !user.featureFlags["library"])
      return { allowed: false, scope: "own" };
  }

  // 1. Get base permission for the role
  const permissions = getBasePermissions(user.role, moduleId, user.externalPersona);

  // 2. Layer privilege flag overrides on top (if staff)
  if (user.role === "staff") {
    const override = getFlagOverrideForModule(user.flags, moduleId);
    if (override) {
      Object.assign(permissions, override);
    }
  }

  // 3. Return allowed status and scope
  return {
    allowed: permissions[action],
    scope: permissions.scope,
  };
}
