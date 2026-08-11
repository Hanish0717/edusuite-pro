// =============================================================================
// HOSTEL MODULE V2 CONSTANTS & PERMISSIONS
// =============================================================================

export const HOSTEL_PERMISSIONS = {
  VIEW_HOSTEL: "VIEW_HOSTEL",
  MANAGE_ROOMS: "MANAGE_ROOMS",
  ALLOCATE_BED: "ALLOCATE_BED",
  APPROVE_OUTING: "APPROVE_OUTING",
  MANAGE_MESS: "MANAGE_MESS",
  RAISE_COMPLAINT: "RAISE_COMPLAINT",
  EXPORT_HOSTEL_REPORTS: "EXPORT_HOSTEL_REPORTS",
} as const;

export type HostelPermission = keyof typeof HOSTEL_PERMISSIONS;

export const COMPLAINT_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Furniture",
  "Cleanliness",
  "Internet",
] as const;

export const OUTING_TYPES = ["Local Outing", "Night Out", "Vacation"] as const;
