// =============================================================================
// HOSTEL MODULE V2 PERMISSIONS HOOK
// =============================================================================

import { HOSTEL_PERMISSIONS, HostelPermission } from "../constants";

export function useHostelPermissions(userPermissions: string[] = Object.values(HOSTEL_PERMISSIONS)) {
  const can = (permission: HostelPermission): boolean => {
    return userPermissions.includes(HOSTEL_PERMISSIONS[permission]);
  };

  return {
    can,
    canViewHostel: can("VIEW_HOSTEL"),
    canManageRooms: can("MANAGE_ROOMS"),
    canAllocateBed: can("ALLOCATE_BED"),
    canApproveOuting: can("APPROVE_OUTING"),
    canManageMess: can("MANAGE_MESS"),
    canRaiseComplaint: can("RAISE_COMPLAINT"),
    canExportReports: can("EXPORT_HOSTEL_REPORTS"),
  };
}
