// =============================================================================
// TRANSPORT MODULE V2 CONSTANTS & PERMISSIONS
// =============================================================================

export const TRANSPORT_PERMISSIONS = {
  VIEW_TRANSPORT: "VIEW_TRANSPORT",
  MANAGE_ROUTES: "MANAGE_ROUTES",
  MANAGE_VEHICLES: "MANAGE_VEHICLES",
  MANAGE_DRIVERS: "MANAGE_DRIVERS",
  ISSUE_BUS_PASS: "ISSUE_BUS_PASS",
  MANAGE_TRANSPORT_FEES: "MANAGE_TRANSPORT_FEES",
  EXPORT_TRANSPORT_REPORTS: "EXPORT_TRANSPORT_REPORTS",
} as const;

export type TransportPermission = keyof typeof TRANSPORT_PERMISSIONS;

export const VEHICLE_STATUSES = ["Operational", "Under Repair", "Out of Service"] as const;
export const PASS_STATUSES = ["Active", "Expired", "Cancelled"] as const;
