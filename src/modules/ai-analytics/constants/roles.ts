export type UserRole = "super-admin" | "staff" | "student" | "parent";

export const ROLE_LABELS: Record<UserRole, string> = {
  "super-admin": "Super Administrator",
  staff: "Faculty / Advisor",
  student: "Student Profile",
  parent: "Parent Profile",
};
