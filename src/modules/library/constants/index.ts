// =============================================================================
// LIBRARY MODULE V2 CONSTANTS & PERMISSIONS
// =============================================================================

export const LIBRARY_PERMISSIONS = {
  VIEW_LIBRARY: "VIEW_LIBRARY",
  MANAGE_BOOKS: "MANAGE_BOOKS",
  ISSUE_BOOK: "ISSUE_BOOK",
  RETURN_BOOK: "RETURN_BOOK",
  MANAGE_FINES: "MANAGE_FINES",
  MANAGE_MEMBERS: "MANAGE_MEMBERS",
  MANAGE_READING_HALL: "MANAGE_READING_HALL",
  EXPORT_LIBRARY_REPORTS: "EXPORT_LIBRARY_REPORTS",
} as const;

export type LibraryPermission = keyof typeof LIBRARY_PERMISSIONS;

export const BOOK_CATEGORIES = [
  "All Categories",
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Basic Sciences & Humanities",
  "Management & General",
] as const;

export const BOOK_CONDITIONS = ["Good", "Damaged", "Lost"] as const;

export const FINE_STATUSES = ["Pending", "Paid", "Waived", "Partially Paid"] as const;
