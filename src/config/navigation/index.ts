// src/config/navigation/index.ts
import type { NavSection } from "./navigation";
import { ACADEMIC_DEAN_NAVIGATION } from "./academic-dean";
import { STUDENT_DEAN_NAVIGATION } from "./student-dean";
import { IQAC_NAVIGATION } from "./iqac";
import { IMA_NAVIGATION } from "./ima";
import { RESEARCH_NAVIGATION } from "./research";
import { FINANCE_NAVIGATION } from "./finance";
import { EXAMINATION_NAVIGATION } from "./examination";
import { PLACEMENT_NAVIGATION } from "./placement";
import type { LoginRole } from "@/config/roles";

/**
 * Returns the navigation configuration for a given dean role.
 * The role string corresponds to the designation ID used in the auth flow
 * (e.g., "academic_dean", "student_dean", "iqac_dean", etc.).
 * If the role does not match any known dean, an empty navigation array is returned.
 */
export function getNavigationByRole(role: LoginRole): NavSection[] {
  switch (role) {
    case "academic_dean":
      return ACADEMIC_DEAN_NAVIGATION;
    case "student_dean":
      return STUDENT_DEAN_NAVIGATION;
    case "iqac_dean":
      return IQAC_NAVIGATION;
    case "ima_dean":
      return IMA_NAVIGATION;
    case "research_dean":
      return RESEARCH_NAVIGATION;
    case "finance_dean":
      return FINANCE_NAVIGATION;
    case "examination_dean":
      return EXAMINATION_NAVIGATION;
    case "placement_dean":
      return PLACEMENT_NAVIGATION;
    default:
      return [];
  }
}
