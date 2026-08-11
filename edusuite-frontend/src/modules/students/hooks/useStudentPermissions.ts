import { STUDENT_PERMISSIONS } from "../constants";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "super-admin": Object.values(STUDENT_PERMISSIONS),
  "super_admin": Object.values(STUDENT_PERMISSIONS),
  "admin": Object.values(STUDENT_PERMISSIONS),
  "staff": [
    STUDENT_PERMISSIONS.VIEW_STUDENT,
    STUDENT_PERMISSIONS.UPDATE_STUDENT,
    STUDENT_PERMISSIONS.PROMOTE_STUDENT,
    STUDENT_PERMISSIONS.TRANSFER_STUDENT,
    STUDENT_PERMISSIONS.VIEW_DOCUMENTS,
    STUDENT_PERMISSIONS.VIEW_TIMELINE,
    STUDENT_PERMISSIONS.VIEW_CONNECTIONS,
    STUDENT_PERMISSIONS.EXPORT_STUDENTS,
  ],
  "student": [
    STUDENT_PERMISSIONS.VIEW_STUDENT,
    STUDENT_PERMISSIONS.VIEW_DOCUMENTS,
    STUDENT_PERMISSIONS.VIEW_TIMELINE,
    STUDENT_PERMISSIONS.VIEW_CONNECTIONS,
  ],
  "parent": [
    STUDENT_PERMISSIONS.VIEW_STUDENT,
    STUDENT_PERMISSIONS.VIEW_DOCUMENTS,
    STUDENT_PERMISSIONS.VIEW_TIMELINE,
  ],
};

export function useStudentPermissions() {
  // In a real production codebase, this would fetch from useAuth() or Session state.
  // For the reference implementation, we mock it by reading localStorage or returning "super-admin".
  const getActiveRole = (): string => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("EDUSUITE_USER_ROLE");
      if (stored) return stored;
    }
    return "super-admin";
  };

  const activeRole = getActiveRole();
  const permissions = ROLE_PERMISSIONS[activeRole] || [];

  return {
    can(permission: keyof typeof STUDENT_PERMISSIONS): boolean {
      return permissions.includes(STUDENT_PERMISSIONS[permission]);
    },
    activeRole,
    permissions,
  };
}
