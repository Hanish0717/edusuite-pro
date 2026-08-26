// =============================================================================
// TRANSPORT MODULE V2 PERMISSIONS HOOK
// =============================================================================

import { TRANSPORT_PERMISSIONS, TransportPermission } from "../constants";

export function useTransportPermissions(userPermissions: string[] = Object.values(TRANSPORT_PERMISSIONS)) {
  const can = (permission: TransportPermission): boolean => {
    return userPermissions.includes(TRANSPORT_PERMISSIONS[permission]);
  };

  return {
    can,
    canViewTransport: can("VIEW_TRANSPORT"),
    canManageRoutes: can("MANAGE_ROUTES"),
    canManageVehicles: can("MANAGE_VEHICLES"),
    canManageDrivers: can("MANAGE_DRIVERS"),
    canIssueBusPass: can("ISSUE_BUS_PASS"),
    canManageFees: can("MANAGE_TRANSPORT_FEES"),
    canExportReports: can("EXPORT_TRANSPORT_REPORTS"),
  };
}
