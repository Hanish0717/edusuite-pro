export type ExtraWorkCategory = 
  | "EVENTS"                 // Hackathons, Fests, Workshops, Seminars, Conferences
  | "STUDENT_DEVELOPMENT"    // Extra Mentoring, Counselling, Competitions, Clubs
  | "INSTITUTIONAL"          // NAAC, NBA, IQAC, NIRF, Committee Work, Audit Prep
  | "RESEARCH_INNOVATION"    // Publications, Patents, Projects, Innovation, Copyrights
  | "INDUSTRY_ENGAGEMENT"    // Industry Visits, MoUs, Industry Projects, Placement Support
  | "SOCIAL_COMMUNITY"       // NSS, Community Outreach, Awareness, Rural Dev
  | "HIGH_IMPACT_ACHIEVEMENT"; // Student Competition Wins, University/State/National Awards

export type ExtraWorkSource = 
  | "ASSIGNED_BY_HOD"
  | "ASSIGNED_BY_PRINCIPAL"
  | "VOLUNTEER_APPLICATION"
  | "AUTO_GENERATED";

export type ExtraWorkStatus = 
  | "ASSIGNED"
  | "APPLIED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "CANCELLED";

export type EvidenceType = 
  | "CERTIFICATE"
  | "PHOTO"
  | "STUDENT_LIST"
  | "OFFICIAL_LETTER"
  | "REPORT"
  | "PUBLICATION"
  | "PATENT"
  | "EVENT_RECORD"
  | "OTHER";

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  fileSizeBytes?: number;
}

export interface PointCalculationBreakdown {
  calculationRuleId: string;
  ruleName: string;
  basePoints: number;
  roleBonus: number;
  responsibilityBonus: number;
  impactBonus: number;
  outcomeBonus: number;
  totalWWP: number;
  
  // Optional audit properties for manual adjustments
  adjustedPoints?: number;
  adjustmentReason?: string;
  adjustedBy?: string;
  adjustedAt?: string;
}

export type VerificationAuthority =
  | "HOD"
  | "RESEARCH_DEAN"
  | "IQAC_DEAN"
  | "STUDENT_DEAN"
  | "PLACEMENT_HEAD"
  | "PRINCIPAL";

export interface ExtraWorkItem {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  
  title: string;
  category: ExtraWorkCategory;
  source: ExtraWorkSource;
  assignedByRole?: "HOD" | "PRINCIPAL" | "DEAN" | "SYSTEM";
  assignedByName?: string;
  
  role?: string;
  description?: string;
  
  startDate: string;
  endDate?: string;
  durationHours?: number;   // Supporting info only (not automatic multiplier)
  studentCount?: number;    // Supporting info only
  
  opportunityId?: string;
  sourceModule?: string;    // E.g. "EVENTS", "RESEARCH", "STUDENT_DEAN"
  referenceId?: string;     // E.g. "EV-2026-892" (for duplicate prevention)
  
  targetVerificationAuthority: VerificationAuthority; // Routing Engine target authority
  
  calculation: PointCalculationBreakdown;
  status: ExtraWorkStatus;
  evidenceList: EvidenceItem[];
  
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verifierRole?: VerificationAuthority;
  reviewerNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ExtraWorkOpportunity {
  id: string;
  title: string;
  category: ExtraWorkCategory;
  publishedBy: string;
  publishedByRole: "HOD" | "PRINCIPAL" | "DEAN";
  department: string;
  
  roleRequired: string;
  description: string;
  expectedDurationHours?: number;
  rewardWWP: number;
  calculationRuleId: string;
  
  positionsAvailable: number;
  positionsFilled: number;
  deadlineDate: string;
  eventDate?: string;
  
  appliedFacultyIds: string[];
  approvedFacultyIds: string[];
  status: "OPEN" | "FILLED" | "CLOSED";
  createdAt: string;
}

export interface WWPBenefit {
  id: string;
  title: string;
  category: "RECOGNITION" | "SPONSORSHIP" | "WORKLOAD" | "GRANT";
  requiredWWP: number;
  description: string;
  iconName: string;
  unlocked: boolean;
  progressPercentage: number;
  eligibleClaimDate?: string;
}

export interface ContributionLevelInfo {
  currentLevel: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  levelName: string;
  minPoints: number;
  nextLevelName: string;
  nextLevelMinPoints: number;
  pointsToNextLevel: number;
  progressPercentage: number;
}

export interface FacultyWalletSummary {
  facultyId: string;
  facultyName: string;
  employeeCode: string;
  department: string;
  
  totalWWP: number;
  thisMonthWWP: number;
  thisSemesterWWP: number;
  thisAcademicYearWWP: number;
  targetAcademicYearWWP: number;
  
  pendingItemsCount: number;
  pendingWWPEstimate: number;
  
  categoryBreakdown: Record<ExtraWorkCategory, number>;
  totalVerifiedItems: number;
  totalPendingItems: number;
  totalAppliedOpportunities: number;
  
  lastCreditedDate?: string;
  levelInfo: ContributionLevelInfo;
}

export type ExtraWorkPermission =
  | "EXTRA_WORK_VIEW_SELF"
  | "EXTRA_WORK_CREATE_CLAIM"
  | "EXTRA_WORK_APPLY_OPPORTUNITY"
  | "EXTRA_WORK_VIEW_EVIDENCE_SELF"
  | "EXTRA_WORK_VIEW_DEPARTMENT"
  | "EXTRA_WORK_VERIFY_DEPARTMENT"
  | "EXTRA_WORK_ASSIGN_DEPARTMENT"
  | "EXTRA_WORK_PUBLISH_DEPARTMENT"
  | "EXTRA_WORK_VERIFY_RESEARCH"
  | "EXTRA_WORK_VERIFY_IQAC"
  | "EXTRA_WORK_VIEW_INSTITUTION"
  | "EXTRA_WORK_ASSIGN_INSTITUTION"
  | "EXTRA_WORK_MANAGE_POLICY"
  | "EXTRA_WORK_OVERRIDE_POINTS"
  | "EXTRA_WORK_VIEW_AUDIT";

export interface OverrideAuditRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  facultyName: string;
  department: string;
  originalWWP: number;
  adjustedWWP: number;
  difference: number;
  reason: string;
  requestedBy: string;
  authorizedBy: string;
  policyVersion: string;
  timestamp: string;
}

export interface WWPPolicyRule {
  activityType: string;
  category: ExtraWorkCategory;
  basePoints: number;
  maxPointsCap?: number;
}

export interface WWPPolicyVersion {
  version: string; // e.g. "v1.2"
  status: "ACTIVE" | "ARCHIVED" | "DRAFT";
  effectiveDate: string;
  modifiedBy: string;
  rules: WWPPolicyRule[];
  multiplier: number;
}


