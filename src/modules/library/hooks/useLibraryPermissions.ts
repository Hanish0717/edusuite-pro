// =============================================================================
// LIBRARY MODULE V2 PERMISSIONS HOOK
// =============================================================================

import { LIBRARY_PERMISSIONS, LibraryPermission } from "../constants";

export function useLibraryPermissions(userPermissions: string[] = Object.values(LIBRARY_PERMISSIONS)) {
  const can = (permission: LibraryPermission): boolean => {
    return userPermissions.includes(LIBRARY_PERMISSIONS[permission]);
  };

  return {
    can,
    canViewLibrary: can("VIEW_LIBRARY"),
    canManageBooks: can("MANAGE_BOOKS"),
    canIssueBook: can("ISSUE_BOOK"),
    canReturnBook: can("RETURN_BOOK"),
    canManageFines: can("MANAGE_FINES"),
    canManageMembers: can("MANAGE_MEMBERS"),
    canManageReadingHall: can("MANAGE_READING_HALL"),
    canExportReports: can("EXPORT_LIBRARY_REPORTS"),
  };
}
