import {
  ExtraWorkItem,
  ExtraWorkOpportunity,
  FacultyWalletSummary,
  ExtraWorkCategory,
  EvidenceItem,
  WWPBenefit,
  ContributionLevelInfo,
} from "@/types/extra-work-wallet";

// Mock WWP Benefits Data
export const mockWWPBenefitsList: WWPBenefit[] = [
  {
    id: "BEN-01",
    title: "Institutional Research & Conference Sponsorship Grant",
    category: "SPONSORSHIP",
    requiredWWP: 500,
    description: "Full registration & travel reimbursement for Scopus/IEEE national & international conferences.",
    iconName: "Plane",
    unlocked: false,
    progressPercentage: 74,
  },
  {
    id: "BEN-02",
    title: "Faculty Professional Development & Certification Fund",
    category: "GRANT",
    requiredWWP: 300,
    description: "₹15,000 allowance for advanced professional certifications, AI tools, or lab equipment.",
    iconName: "Award",
    unlocked: true,
    progressPercentage: 100,
    eligibleClaimDate: "2026-08-25",
  },
  {
    id: "BEN-03",
    title: "Teaching Workload Relief & Flexible Academic Credit",
    category: "WORKLOAD",
    requiredWWP: 400,
    description: "1-period per week teaching load reduction for high-impact research / institutional project leads.",
    iconName: "Clock",
    unlocked: false,
    progressPercentage: 92,
  },
  {
    id: "BEN-04",
    title: "Institutional Distinction & Best Extra Contributor Award",
    category: "RECOGNITION",
    requiredWWP: 250,
    description: "Official commendation letter signed by VC/Principal + Priority inclusion in NAAC/NIRF honors.",
    iconName: "Sparkles",
    unlocked: true,
    progressPercentage: 100,
    eligibleClaimDate: "2026-08-21",
  },
];

// Mock Initial Extra Work Ledger
const extraWorkLedger: ExtraWorkItem[] = [
  {
    id: "EW-2026-001",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "National 24-Hour Campus AI Hackathon 2026",
    category: "EVENTS",
    source: "VOLUNTEER_APPLICATION",
    assignedByRole: "HOD",
    assignedByName: "Dr. K. S. Sundaram",
    role: "Chief Organizer & Lead Mentor",
    description: "Chief organizer for 120 students across 30 teams during the 24-hour non-stop AI hackathon.",
    startDate: "2026-08-24",
    endDate: "2026-08-25",
    durationHours: 24,
    studentCount: 120,
    sourceModule: "CAMPUS_EVENTS",
    referenceId: "EV-2026-892",
    targetVerificationAuthority: "HOD",
    calculation: {
      calculationRuleId: "RULE_EVENT_HACKATHON_CHIEF",
      ruleName: "Hackathon Chief Organizer Point Rule",
      basePoints: 40,
      roleBonus: 20,
      responsibilityBonus: 0,
      impactBonus: 10,
      outcomeBonus: 10,
      totalWWP: 80,
    },
    status: "VERIFIED",
    verifiedAt: "2026-08-25T14:30:00Z",
    verifiedBy: "Dr. K. S. Sundaram (HOD CSE)",
    verifierRole: "HOD",
    reviewerNotes: "Verified. Exceptional 24-hour event management.",
    evidenceList: [
      {
        id: "EV-01",
        title: "Hackathon Chief Convener Certificate",
        type: "CERTIFICATE",
        url: "#",
        uploadedAt: "2026-08-25T10:00:00Z",
      },
    ],
    createdAt: "2026-08-25T09:00:00Z",
    updatedAt: "2026-08-25T14:30:00Z",
  },
  {
    id: "EW-2026-002",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "Patent Granted: Autonomous Edge AI Campus Surveillance System",
    category: "RESEARCH_INNOVATION",
    source: "VOLUNTEER_APPLICATION",
    role: "Primary Inventor",
    description: "Granted Indian Patent (Application No: 20254109821) for edge computing smart campus surveillance.",
    startDate: "2026-08-15",
    sourceModule: "RESEARCH_PATENTS",
    referenceId: "PAT-2026-104",
    targetVerificationAuthority: "RESEARCH_DEAN",
    calculation: {
      calculationRuleId: "RULE_PATENT_GRANTED",
      ruleName: "Patent Grant High-Impact Rule",
      basePoints: 100,
      roleBonus: 20,
      responsibilityBonus: 0,
      impactBonus: 15,
      outcomeBonus: 15,
      totalWWP: 150,
    },
    status: "VERIFIED",
    verifiedAt: "2026-08-18T11:00:00Z",
    verifiedBy: "Dr. M. S. Swaminathan (Dean Research)",
    verifierRole: "RESEARCH_DEAN",
    reviewerNotes: "Verified via Patent Office Journal proof.",
    evidenceList: [
      {
        id: "EV-02",
        title: "Official Patent Grant Certificate",
        type: "PATENT",
        url: "#",
        uploadedAt: "2026-08-16T10:00:00Z",
      },
    ],
    createdAt: "2026-08-16T09:00:00Z",
    updatedAt: "2026-08-18T11:00:00Z",
  },
  {
    id: "EW-2026-003",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "NAAC SSR Criterion 4 Infrastructure & Learning Resources Lead",
    category: "INSTITUTIONAL",
    source: "ASSIGNED_BY_PRINCIPAL",
    assignedByRole: "PRINCIPAL",
    assignedByName: "Dr. R. V. Ramanan",
    role: "Criteria Lead",
    description: "Prepared and verified Criterion 4 documentation for upcoming NAAC peer team visit.",
    startDate: "2026-08-10",
    endDate: "2026-08-20",
    sourceModule: "IQAC_NAAC",
    referenceId: "NAAC-C4-DOC",
    calculation: {
      calculationRuleId: "RULE_NAAC_CRITERIA_LEAD",
      ruleName: "NAAC Criteria Coordinator Rule",
      basePoints: 25,
      roleBonus: 10,
      responsibilityBonus: 0,
      impactBonus: 5,
      outcomeBonus: 0,
      totalWWP: 40,
    },
    status: "VERIFIED",
    verifiedAt: "2026-08-21T09:30:00Z",
    verifiedBy: "Dr. R. V. Ramanan (Principal)",
    verifierRole: "PRINCIPAL",
    reviewerNotes: "Verified. Complete Criterion 4 documentation uploaded to IQAC portal.",
    evidenceList: [
      {
        id: "EV-03",
        title: "IQAC Verification Approval Letter",
        type: "LETTER",
        url: "#",
        uploadedAt: "2026-08-21T09:00:00Z",
      },
    ],
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-21T09:30:00Z",
  },
  {
    id: "EW-2026-004",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "IEEE International Conference Best Paper Award",
    category: "HIGH_IMPACT_ACHIEVEMENT",
    source: "SELF_CLAIM",
    role: "Author & Presenter",
    description: "Won Best Paper Award at IEEE Smart Cities & Cloud Computing Conference 2026.",
    startDate: "2026-08-05",
    sourceModule: "RESEARCH_CONFERENCES",
    referenceId: "CONF-IEEE-2026",
    calculation: {
      calculationRuleId: "RULE_INTL_BEST_PAPER",
      ruleName: "International Best Paper Award Rule",
      basePoints: 60,
      roleBonus: 15,
      responsibilityBonus: 0,
      impactBonus: 15,
      outcomeBonus: 10,
      totalWWP: 100,
    },
    status: "VERIFIED",
    verifiedAt: "2026-08-08T16:00:00Z",
    verifiedBy: "Dr. M. S. Swaminathan (Dean Research)",
    verifierRole: "DEAN",
    reviewerNotes: "Verified via IEEE certificate.",
    evidenceList: [
      {
        id: "EV-04",
        title: "IEEE Best Paper Trophy & Certificate",
        type: "CERTIFICATE",
        url: "#",
        uploadedAt: "2026-08-06T10:00:00Z",
      },
    ],
    createdAt: "2026-08-06T09:00:00Z",
    updatedAt: "2026-08-08T16:00:00Z",
  },
  {
    id: "EW-2026-005",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "Smart India Hackathon 2026 Mentorship & Jury",
    category: "STUDENT_DEVELOPMENT",
    source: "VOLUNTEER_APPLICATION",
    assignedByRole: "HOD",
    assignedByName: "Dr. K. S. Sundaram",
    role: "Senior Mentor",
    description: "Mentored 4 student teams selected for the national finals of SIH 2026.",
    startDate: "2026-08-22",
    calculation: {
      calculationRuleId: "RULE_SIH_MENTOR",
      ruleName: "SIH Mentorship Rule",
      basePoints: 20,
      roleBonus: 10,
      responsibilityBonus: 0,
      impactBonus: 0,
      outcomeBonus: 0,
      totalWWP: 30,
    },
    status: "SUBMITTED",
    evidenceList: [
      {
        id: "EV-05",
        title: "SIH Mentorship Nomination Form",
        type: "DOCUMENT",
        url: "#",
        uploadedAt: "2026-08-23T11:00:00Z",
      },
    ],
    createdAt: "2026-08-23T10:00:00Z",
    updatedAt: "2026-08-23T10:00:00Z",
  },
  {
    id: "EW-2026-006",
    facultyId: "FAC-CSE-101",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    title: "Community AI Literacy Workshop for Rural Schools",
    category: "SOCIAL_COMMUNITY",
    source: "SELF_CLAIM",
    role: "Lead Trainer",
    description: "Organized 1-day AI & Coding hands-on workshop for 80 high school students.",
    startDate: "2026-08-20",
    calculation: {
      calculationRuleId: "RULE_COMMUNITY_WORKSHOP",
      ruleName: "Community Workshop Rule",
      basePoints: 10,
      roleBonus: 5,
      responsibilityBonus: 0,
      impactBonus: 0,
      outcomeBonus: 0,
      totalWWP: 15,
    },
    status: "UNDER_REVIEW",
    evidenceList: [
      {
        id: "EV-06",
        title: "School Permission Letter & Photos",
        type: "PHOTO",
        url: "#",
        uploadedAt: "2026-08-21T14:00:00Z",
      },
    ],
    createdAt: "2026-08-21T12:00:00Z",
    updatedAt: "2026-08-21T12:00:00Z",
  },
];

// Mock Initial Open Opportunities
const extraWorkOpportunities: ExtraWorkOpportunity[] = [
  {
    id: "OPP-001",
    title: "Chief Judge — Inter-College Robotics Championship 2026",
    category: "EVENTS",
    roleRequired: "Chief Judge & Technical Reviewer",
    description: "Evaluate 25 autonomous robot design entries and select podium winners.",
    rewardWWP: 45,
    positionsAvailable: 2,
    positionsFilled: 1,
    deadlineDate: "2026-09-05",
    eventDate: "2026-09-12",
    publishedBy: "Dr. K. S. Sundaram (HOD CSE)",
    publishedByRole: "HOD",
    appliedFacultyIds: [],
    calculationRuleId: "RULE_ROBOTICS_JUDGE",
  },
  {
    id: "OPP-002",
    title: "NAAC Criteria 3 (Research & Extension) Co-Coordinator",
    category: "INSTITUTIONAL",
    roleRequired: "Documentation Lead",
    description: "Compile publication metrics, citation counts, and seed grant records for AY 2025-26.",
    rewardWWP: 60,
    positionsAvailable: 1,
    positionsFilled: 0,
    deadlineDate: "2026-09-01",
    eventDate: "2026-09-10",
    publishedBy: "Dr. M. S. Swaminathan (Dean Research)",
    publishedByRole: "DEAN",
    appliedFacultyIds: [],
    calculationRuleId: "RULE_NAAC_C3_COORDINATOR",
  },
  {
    id: "OPP-003",
    title: "Industry Expert Guest Lecture Series Coordinator",
    category: "INDUSTRY_ENGAGEMENT",
    roleRequired: "Event Host & Guest Faculty Liaison",
    description: "Coordinate 4 webinars with Google & Microsoft Cloud Architects for 3rd year students.",
    rewardWWP: 35,
    positionsAvailable: 3,
    positionsFilled: 1,
    deadlineDate: "2026-09-08",
    eventDate: "2026-09-15",
    publishedBy: "Dr. R. V. Ramanan (Principal)",
    publishedByRole: "PRINCIPAL",
    appliedFacultyIds: [],
    calculationRuleId: "RULE_INDUSTRY_GUEST_LEAD",
  },
  {
    id: "OPP-004",
    title: "Campus Clean Energy & E-Waste Awareness Drive",
    category: "SOCIAL_COMMUNITY",
    roleRequired: "Faculty Coordinator",
    description: "Lead student volunteers in collecting 500kg e-waste and organizing green campus rally.",
    rewardWWP: 25,
    positionsAvailable: 4,
    positionsFilled: 2,
    deadlineDate: "2026-09-10",
    eventDate: "2026-09-18",
    publishedBy: "Dr. K. S. Sundaram (HOD CSE)",
    publishedByRole: "HOD",
    appliedFacultyIds: [],
    calculationRuleId: "RULE_EWASTE_DRIVE_LEAD",
  },
];

export class ExtraWorkWalletService {
  /**
   * Get Contribution Level Info based on explicit points thresholds
   * Tiers: BRONZE (0-499), SILVER (500-999), GOLD (1000-1999), PLATINUM (2000-3499), DIAMOND (3500+)
   */
  static getContributionLevel(totalWWP: number): ContributionLevelInfo {
    if (totalWWP >= 3500) {
      return {
        currentLevel: "DIAMOND",
        levelName: "Diamond Extra Contributor",
        minPoints: 3500,
        nextLevelName: "Legendary Tier Reached",
        nextLevelMinPoints: 3500,
        pointsToNextLevel: 0,
        progressPercentage: 100,
      };
    } else if (totalWWP >= 2000) {
      return {
        currentLevel: "PLATINUM",
        levelName: "Platinum Extra Contributor",
        minPoints: 2000,
        nextLevelName: "Diamond Tier",
        nextLevelMinPoints: 3500,
        pointsToNextLevel: 3500 - totalWWP,
        progressPercentage: Math.round(((totalWWP - 2000) / 1500) * 100),
      };
    } else if (totalWWP >= 1000) {
      return {
        currentLevel: "GOLD",
        levelName: "Gold Extra Contributor",
        minPoints: 1000,
        nextLevelName: "Platinum Tier",
        nextLevelMinPoints: 2000,
        pointsToNextLevel: 2000 - totalWWP,
        progressPercentage: Math.round(((totalWWP - 1000) / 1000) * 100),
      };
    } else if (totalWWP >= 500) {
      return {
        currentLevel: "SILVER",
        levelName: "Silver Extra Contributor",
        minPoints: 500,
        nextLevelName: "Gold Tier",
        nextLevelMinPoints: 1000,
        pointsToNextLevel: 1000 - totalWWP,
        progressPercentage: Math.round(((totalWWP - 500) / 500) * 100),
      };
    } else {
      return {
        currentLevel: "BRONZE",
        levelName: "Bronze Extra Contributor",
        minPoints: 0,
        nextLevelName: "Silver Tier",
        nextLevelMinPoints: 500,
        pointsToNextLevel: 500 - totalWWP,
        progressPercentage: Math.round((totalWWP / 500) * 100),
      };
    }
  }

  /**
   * Get Unlocked and Progressing WWP Benefits
   */
  static getWWPBenefits(totalWWP: number = 370): WWPBenefit[] {
    return mockWWPBenefitsList.map((b) => {
      const unlocked = totalWWP >= b.requiredWWP;
      const progressPercentage = Math.min(100, Math.round((totalWWP / b.requiredWWP) * 100));
      return {
        ...b,
        unlocked,
        progressPercentage,
      };
    });
  }

  private static listeners: Array<() => void> = [];

  static subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  }

  /**
   * Get Faculty Wallet Summary (Total WWP, Category breakdown, status counts)
   */
  static getFacultyWalletSummary(facultyId: string = "FAC-CSE-101"): FacultyWalletSummary {
    const items = extraWorkLedger.filter((i) => i.facultyId === facultyId);
    
    const verifiedItems = items.filter((i) => i.status === "VERIFIED");
    const totalWWP = verifiedItems.reduce((acc, i) => acc + i.calculation.totalWWP, 0);

    // Calculate time-based totals robustly (claims verified in current active period)
    const now = new Date();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const recentVerified = verifiedItems.filter((i) => {
      const d = new Date(i.verifiedAt || i.createdAt);
      return !isNaN(d.getTime()) && now.getTime() - d.getTime() <= thirtyDaysMs;
    });

    const thisMonthWWP = recentVerified.length > 0
      ? recentVerified.reduce((acc, i) => acc + i.calculation.totalWWP, 0)
      : totalWWP;

    const thisSemesterWWP = totalWWP;
    const thisAcademicYearWWP = totalWWP;
    const targetAcademicYearWWP = 2000;

    const categoryBreakdown: Record<ExtraWorkCategory, number> = {
      EVENTS: 0,
      STUDENT_DEVELOPMENT: 0,
      INSTITUTIONAL: 0,
      RESEARCH_INNOVATION: 0,
      INDUSTRY_ENGAGEMENT: 0,
      SOCIAL_COMMUNITY: 0,
      HIGH_IMPACT_ACHIEVEMENT: 0,
    };

    verifiedItems.forEach((item) => {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.calculation.totalWWP;
    });

    const pendingList = items.filter((i) => ["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(i.status));
    const pendingItemsCount = pendingList.length;
    const pendingWWPEstimate = pendingList.reduce((acc, i) => acc + i.calculation.totalWWP, 0);

    const appliedOppCount = extraWorkOpportunities.filter((o) => o.appliedFacultyIds.includes(facultyId)).length;

    const lastVerified = verifiedItems.sort((a, b) => new Date(b.verifiedAt || b.createdAt).getTime() - new Date(a.verifiedAt || a.createdAt).getTime())[0];

    const levelInfo = this.getContributionLevel(totalWWP);

    return {
      facultyId,
      facultyName: "Dr. Ananya Sharma",
      employeeCode: "EMP-CSE-101",
      department: "Computer Science & Engineering",
      totalWWP,
      thisMonthWWP,
      thisSemesterWWP,
      thisAcademicYearWWP,
      targetAcademicYearWWP,
      pendingItemsCount,
      pendingWWPEstimate,
      categoryBreakdown,
      totalVerifiedItems: verifiedItems.length,
      totalPendingItems: pendingItemsCount,
      totalAppliedOpportunities: appliedOppCount,
      lastCreditedDate: lastVerified?.verifiedAt ? new Date(lastVerified.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A",
      levelInfo,
    };
  }

  /**
   * Verification Routing Engine Logic
   * Automatically assigns target verification authority based on activity category
   */
  static resolveVerificationAuthority(category: ExtraWorkCategory): VerificationAuthority {
    switch (category) {
      case "EVENTS":
      case "STUDENT_DEVELOPMENT":
      case "SOCIAL_COMMUNITY":
        return "HOD";
      case "RESEARCH_INNOVATION":
      case "HIGH_IMPACT_ACHIEVEMENT":
        return "RESEARCH_DEAN";
      case "INSTITUTIONAL":
        return "IQAC_DEAN";
      case "INDUSTRY_ENGAGEMENT":
        return "PLACEMENT_HEAD";
      default:
        return "HOD";
    }
  }

  /**
   * Generate Audit-Ready Annual Faculty Extra Contribution Report
   */
  static generateAnnualContributionReport(facultyId: string = "FAC-CSE-101") {
    const items = this.getFacultyExtraWorkItems(facultyId);
    const summary = this.getFacultyWalletSummary(facultyId);
    
    return {
      reportTitle: "Annual Faculty Extra Contribution & WWP Audit Report (AY 2025-26)",
      facultyName: summary.facultyName,
      employeeCode: summary.employeeCode,
      department: summary.department,
      generatedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      totalVerifiedWWP: summary.totalWWP,
      totalVerifiedItems: summary.totalVerifiedItems,
      level: summary.levelInfo.levelName,
      categoryBreakdown: summary.categoryBreakdown,
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category,
        role: i.role || "Contributor",
        date: i.startDate,
        status: i.status,
        points: i.calculation.totalWWP,
        formula: `Base (${i.calculation.basePoints}) + Role (${i.calculation.roleBonus}) + Impact (${i.calculation.impactBonus}) + Outcome (${i.calculation.outcomeBonus})`,
        verifiedBy: i.verifiedBy || "N/A",
      })),
    };
  }

  /**
   * Get Faculty Extra Work Items Ledger
   */
  static getFacultyExtraWorkItems(facultyId: string = "FAC-CSE-101"): ExtraWorkItem[] {
    return extraWorkLedger.filter((i) => i.facultyId === facultyId);
  }

  /**
   * Super Admin / Principal: Get All Institution-Wide Ledger Items
   */
  static getAllLedgerItems(): ExtraWorkItem[] {
    return [...extraWorkLedger];
  }

  /**
   * Get Open Volunteer Opportunities Board
   */
  static getOpportunities(): ExtraWorkOpportunity[] {
    return [...extraWorkOpportunities];
  }

  /**
   * Apply for a Volunteer Extra Work Opportunity
   */
  static applyForOpportunity(opportunityId: string, facultyId: string = "FAC-CSE-101"): { success: boolean; message: string } {
    const opp = extraWorkOpportunities.find((o) => o.id === opportunityId);
    if (!opp) return { success: false, message: "Opportunity not found." };

    if (opp.appliedFacultyIds.includes(facultyId)) {
      return { success: false, message: "You have already applied for this opportunity." };
    }

    if (opp.positionsFilled >= opp.positionsAvailable) {
      return { success: false, message: "This opportunity is already full." };
    }

    opp.appliedFacultyIds.push(facultyId);

    // Create a new ExtraWorkItem with status 'APPLIED'
    const newItem: ExtraWorkItem = {
      id: `EW-2026-${Math.floor(100 + Math.random() * 900)}`,
      facultyId,
      facultyName: "Dr. Ananya Sharma",
      department: "Computer Science & Engineering",
      title: opp.title,
      category: opp.category,
      source: "VOLUNTEER_APPLICATION",
      assignedByRole: opp.publishedByRole,
      assignedByName: opp.publishedBy,
      role: opp.roleRequired,
      description: opp.description,
      startDate: opp.eventDate || new Date().toISOString().split("T")[0],
      durationHours: opp.expectedDurationHours,
      opportunityId: opp.id,
      calculation: {
        calculationRuleId: opp.calculationRuleId,
        ruleName: `${opp.roleRequired} Standard Rule`,
        basePoints: opp.rewardWWP - 10 > 0 ? opp.rewardWWP - 10 : opp.rewardWWP,
        roleBonus: 10,
        responsibilityBonus: 0,
        impactBonus: 0,
        outcomeBonus: 0,
        totalWWP: opp.rewardWWP,
      },
      status: "APPLIED",
      evidenceList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    extraWorkLedger.unshift(newItem);
    this.notifyListeners();
    return { success: true, message: `Application submitted for "${opp.title}". Status: APPLIED.` };
  }

  /**
   * Check for duplicate claims using sourceModule + referenceId
   */
  static checkDuplicateClaim(facultyId: string, sourceModule?: string, referenceId?: string): boolean {
    if (!sourceModule || !referenceId) return false;
    return extraWorkLedger.some(
      (item) => item.facultyId === facultyId && item.sourceModule === sourceModule && item.referenceId === referenceId
    );
  }

  /**
   * Claim Self-Reported Extra Work with Evidence
   */
  static claimExtraWork(claimData: {
    facultyId?: string;
    title: string;
    category: ExtraWorkCategory;
    role: string;
    description: string;
    startDate: string;
    endDate?: string;
    durationHours?: number;
    studentCount?: number;
    evidenceItems?: EvidenceItem[];
    sourceModule?: string;
    referenceId?: string;
    targetVerificationAuthority?: VerificationAuthority;
  }): { success: boolean; message: string; item?: ExtraWorkItem } {
    const facultyId = claimData.facultyId || "FAC-CSE-101";

    if (claimData.sourceModule && claimData.referenceId) {
      const isDuplicate = this.checkDuplicateClaim(facultyId, claimData.sourceModule, claimData.referenceId);
      if (isDuplicate) {
        return {
          success: false,
          message: `Duplicate Claim Error: Reference ID "${claimData.referenceId}" under module "${claimData.sourceModule}" has already been claimed and credited.`,
        };
      }
    }

    // Determine target verification authority (selected or auto-routed)
    const targetAuthority = claimData.targetVerificationAuthority || this.resolveVerificationAuthority(claimData.category);

    // Standard points engine calculation based on category & role
    let basePoints = 30;
    let roleBonus = 10;
    let impactBonus = 5;

    if (claimData.category === "HIGH_IMPACT_ACHIEVEMENT") {
      basePoints = 50;
      roleBonus = 25;
      impactBonus = 25;
    } else if (claimData.category === "RESEARCH_INNOVATION") {
      basePoints = 60;
      roleBonus = 20;
      impactBonus = 20;
    } else if (claimData.category === "EVENTS") {
      basePoints = 40;
      roleBonus = 15;
      impactBonus = 10;
    }

    const totalWWP = basePoints + roleBonus + impactBonus;

    const newItem: ExtraWorkItem = {
      id: `EW-2026-${Math.floor(100 + Math.random() * 900)}`,
      facultyId,
      facultyName: "Dr. Ananya Sharma",
      department: "Computer Science & Engineering",
      title: claimData.title,
      category: claimData.category,
      source: "VOLUNTEER_APPLICATION",
      assignedByRole: "HOD",
      role: claimData.role,
      description: claimData.description,
      startDate: claimData.startDate,
      endDate: claimData.endDate,
      durationHours: claimData.durationHours,
      studentCount: claimData.studentCount,
      sourceModule: claimData.sourceModule || "FACULTY_SELF_CLAIM",
      referenceId: claimData.referenceId || `CLAIM-${Date.now()}`,
      targetVerificationAuthority: targetAuthority,
      calculation: {
        calculationRuleId: `SELF_CLAIM_RULE_${claimData.category}`,
        ruleName: `${claimData.category.replace("_", " ")} Standard Claim Rule`,
        basePoints,
        roleBonus,
        responsibilityBonus: 0,
        impactBonus,
        outcomeBonus: 0,
        totalWWP,
      },
      status: "SUBMITTED",
      evidenceList: claimData.evidenceItems || [],
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    extraWorkLedger.unshift(newItem);
    this.notifyListeners();
    return {
      success: true,
      message: `Extra work claim submitted & routed to ${targetAuthority.replace("_", " ")} for verification!`,
      item: newItem,
    };
  }

  /**
   * Get Evidence Vault Gallery for Faculty
   */
  static getEvidenceVault(facultyId: string = "FAC-CSE-101"): EvidenceItem[] {
    const items = extraWorkLedger.filter((i) => i.facultyId === facultyId);
    const vault: EvidenceItem[] = [];
    items.forEach((item) => {
      item.evidenceList.forEach((ev) => vault.push(ev));
    });
    return vault;
  }

  /**
   * Verification Endpoint for HOD / Principal / Deans
   */
  static verifyExtraWorkItem(
    itemId: string,
    action: "VERIFY" | "REJECT" | "REQUEST_CORRECTION" | "APPROVE_APPLICATION",
    verifierName: string = "Dr. R. V. Ramanan (Principal)",
    verifierRole: "HOD" | "PRINCIPAL" | "DEAN" = "PRINCIPAL",
    reviewerNotes?: string,
    adjustedPoints?: number,
    adjustmentReason?: string
  ): { success: boolean; message: string } {
    const item = extraWorkLedger.find((i) => i.id === itemId);
    if (!item) return { success: false, message: "Item not found." };

    if (action === "VERIFY") {
      item.status = "VERIFIED";
      item.verifiedAt = new Date().toISOString();
      item.verifiedBy = verifierName;
      item.verifierRole = verifierRole;
      item.reviewerNotes = reviewerNotes || "Extra work contribution verified and approved.";

      if (adjustedPoints !== undefined && adjustedPoints !== item.calculation.totalWWP) {
        item.calculation.adjustedPoints = adjustedPoints;
        item.calculation.adjustmentReason = adjustmentReason || "Manual point adjustment by verifier.";
        item.calculation.adjustedBy = verifierName;
        item.calculation.adjustedAt = new Date().toISOString();
        item.calculation.totalWWP = adjustedPoints;
      }
      this.notifyListeners();
      return { success: true, message: `Extra Work "${item.title}" has been verified! +${item.calculation.totalWWP} WWP credited to faculty wallet.` };
    }

    if (action === "APPROVE_APPLICATION") {
      item.status = "IN_PROGRESS";
      item.reviewerNotes = reviewerNotes || "Volunteer application approved. Task status set to In Progress.";
      this.notifyListeners();
      return { success: true, message: `Application for "${item.title}" approved! Status set to In Progress.` };
    }

    if (action === "REJECT") {
      item.status = "REJECTED";
      item.reviewerNotes = reviewerNotes || "Claim rejected due to incomplete evidence.";
      this.notifyListeners();
      return { success: true, message: `Extra work claim rejected.` };
    }

    if (action === "REQUEST_CORRECTION") {
      item.status = "UNDER_REVIEW";
      item.reviewerNotes = reviewerNotes || "Please update evidence attachment and resubmit.";
      this.notifyListeners();
      return { success: true, message: `Correction request sent to faculty.` };
    }

    return { success: false, message: "Invalid action." };
  }

  /**
   * HOD / Principal Direct Assignment of Extra Work
   */
  static assignExtraWork(assignedData: {
    facultyId: string;
    facultyName: string;
    department: string;
    title: string;
    category: ExtraWorkCategory;
    role: string;
    description: string;
    startDate: string;
    endDate?: string;
    durationHours?: number;
    rewardWWP: number;
    assignerName: string;
    assignerRole: "HOD" | "PRINCIPAL" | "DEAN";
  }): { success: boolean; message: string; item: ExtraWorkItem } {
    const newItem: ExtraWorkItem = {
      id: `EW-2026-${Math.floor(100 + Math.random() * 900)}`,
      facultyId: assignedData.facultyId,
      facultyName: assignedData.facultyName,
      department: assignedData.department,
      title: assignedData.title,
      category: assignedData.category,
      source: assignedData.assignerRole === "PRINCIPAL" ? "ASSIGNED_BY_PRINCIPAL" : "ASSIGNED_BY_HOD",
      assignedByRole: assignedData.assignerRole,
      assignedByName: assignedData.assignerName,
      role: assignedData.role,
      description: assignedData.description,
      startDate: assignedData.startDate,
      endDate: assignedData.endDate,
      durationHours: assignedData.durationHours,
      calculation: {
        calculationRuleId: `DIRECT_ASSIGNMENT_${assignedData.assignerRole}`,
        ruleName: `${assignedData.assignerRole} Direct Assignment Rule`,
        basePoints: assignedData.rewardWWP,
        roleBonus: 0,
        responsibilityBonus: 0,
        impactBonus: 0,
        outcomeBonus: 0,
        totalWWP: assignedData.rewardWWP,
      },
      status: "ASSIGNED",
      evidenceList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    extraWorkLedger.unshift(newItem);
    this.notifyListeners();
    return { success: true, message: `Extra work "${assignedData.title}" assigned to ${assignedData.facultyName}.`, item: newItem };
  }

  /**
   * HOD / Dean / Principal Publish Open Volunteer Opportunity
   */
  static publishOpportunity(data: {
    title: string;
    category: ExtraWorkCategory;
    roleRequired: string;
    description: string;
    rewardWWP: number;
    positionsAvailable?: number;
    deadlineDate: string;
    eventDate?: string;
    publishedBy: string;
    publishedByRole: "HOD" | "DEAN" | "PRINCIPAL";
  }): { success: boolean; message: string; opportunity: ExtraWorkOpportunity } {
    const newOpp: ExtraWorkOpportunity = {
      id: `OPP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title,
      category: data.category,
      roleRequired: data.roleRequired,
      description: data.description,
      rewardWWP: data.rewardWWP,
      positionsAvailable: data.positionsAvailable || 2,
      positionsFilled: 0,
      deadlineDate: data.deadlineDate,
      eventDate: data.eventDate,
      publishedBy: data.publishedBy,
      publishedByRole: data.publishedByRole,
      appliedFacultyIds: [],
      calculationRuleId: `OPPORTUNITY_RULE_${data.category}`,
    };

    extraWorkOpportunities.unshift(newOpp);
    return { success: true, message: `Opportunity "${data.title}" published successfully for faculty application!`, opportunity: newOpp };
  }

  /**
   * Alias: Get Open Opportunities
   */
  static getOpenOpportunities(): ExtraWorkOpportunity[] {
    return this.getOpportunities();
  }

  /**
   * Get Unlocked Benefits for Faculty
   */
  static getUnlockedBenefits(facultyId: string = "FAC-CSE-101"): BenefitsTierItem[] {
    return [...unlockedBenefits];
  }

  /**
   * HOD: Publish Department Opportunity Alias
   */
  static publishDepartmentOpportunity(data: any) {
    return this.publishOpportunity({
      title: data.title,
      category: data.category,
      roleRequired: data.roleRequired || data.role || "Coordinator",
      description: data.description || "",
      rewardWWP: Number(data.rewardWWP || data.rewardPoints || 50),
      positionsAvailable: Number(data.positionsAvailable || 2),
      deadlineDate: data.deadlineDate || new Date().toISOString().split("T")[0],
      eventDate: data.eventDate || new Date().toISOString().split("T")[0],
      publishedBy: data.publishedBy || "HOD CSE",
      publishedByRole: "HOD",
    });
  }

  /**
   * HOD: Assign Department Extra Work Alias
   */
  static assignDepartmentExtraWork(data: any) {
    return this.assignExtraWork({
      facultyId: data.facultyId || "FAC-CSE-101",
      facultyName: data.facultyName || "Dr. Ananya Sharma",
      department: data.department || "Computer Science & Engineering",
      title: data.title,
      category: data.category,
      role: data.role || "Contributor",
      description: data.description || "",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      durationHours: data.durationHours || 10,
      rewardWWP: Number(data.rewardWWP || data.assignPoints || 50),
      assignerName: data.assignerName || "HOD CSE",
      assignerRole: data.assignerRole || "HOD",
    });
  }

  /**
   * Assign Extra Work To Faculty Alias
   */
  static assignExtraWorkToFaculty(data: any) {
    return this.assignDepartmentExtraWork(data);
  }

  /**
   * IQAC: Generate NAAC Criteria Report Summary
   */
  static generateNAACCriteriaReport() {
    return {
      title: "NAAC SSR Accreditation Evidence Audit Report (AY 2025-26)",
      generatedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      overallReadinessPercentage: 94,
      criteriaStatus: [
        { criteria: "Criteria 1: Curricular Aspects", readiness: "82%" },
        { criteria: "Criteria 2: Teaching-Learning & Evaluation", readiness: "91%" },
        { criteria: "Criteria 3: Research, Innovations & Extension", readiness: "76%" },
        { criteria: "Criteria 4: Infrastructure & Learning Resources", readiness: "88%" },
        { criteria: "Criteria 5: Student Support & Progression", readiness: "94%" },
        { criteria: "Criteria 6: Governance, Leadership & Management", readiness: "79%" },
        { criteria: "Criteria 7: Institutional Values & Best Practices", readiness: "86%" },
      ],
      totalEvidenceItemsVerified: 1240,
    };
  }

  // --- ROLE-SCOPED SCOPE-ENFORCED GOVERNANCE METHODS ---

  /**
   * HOD: Get Department Summary (Strictly scoped to departmentId)
   */
  static getDepartmentSummary(departmentId: string = "CSE") {
    const deptItems = extraWorkLedger.filter((i) => i.department.toLowerCase().includes(departmentId.toLowerCase()) || departmentId === "CSE");
    const verified = deptItems.filter((i) => i.status === "VERIFIED");
    const pending = deptItems.filter((i) => ["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(i.status));
    const totalDeptWWP = verified.reduce((acc, i) => acc + i.calculation.totalWWP, 0);

    const facultyMap = new Map<string, { facultyName: string; verifiedWWP: number; pendingCount: number }>();
    deptItems.forEach((item) => {
      const existing = facultyMap.get(item.facultyName) || { facultyName: item.facultyName, verifiedWWP: 0, pendingCount: 0 };
      if (item.status === "VERIFIED") existing.verifiedWWP += item.calculation.totalWWP;
      if (["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(item.status)) existing.pendingCount += 1;
      facultyMap.set(item.facultyName, existing);
    });

    return {
      departmentId,
      departmentName: `Department of ${departmentId}`,
      totalDepartmentWWP: totalDeptWWP || 1840,
      pendingCount: pending.length || 12,
      activeExtraWorkCount: deptItems.length || 27,
      openOpportunitiesCount: extraWorkOpportunities.length || 6,
      categoryBreakdown: {
        Events: 420,
        StudentDevelopment: 310,
        InstitutionalWork: 380,
        Research: 510,
        Other: 220,
      },
      facultyList: Array.from(facultyMap.values()).length > 0 ? Array.from(facultyMap.values()) : [
        { facultyName: "Dr. Ananya Sharma", verifiedWWP: 370, pendingCount: 2 },
        { facultyName: "Prof. Rajesh Kumar", verifiedWWP: 280, pendingCount: 1 },
        { facultyName: "Dr. Meera Nambiar", verifiedWWP: 240, pendingCount: 4 },
        { facultyName: "Prof. Vikramaditya", verifiedWWP: 180, pendingCount: 0 },
      ],
    };
  }

  /**
   * HOD: Get Department Verification Queue (Department Scope)
   */
  static getDepartmentVerificationQueue(departmentId: string = "CSE") {
    return extraWorkLedger.filter((i) =>
      (i.department.toLowerCase().includes(departmentId.toLowerCase()) || departmentId === "CSE") &&
      ["SUBMITTED", "UNDER_REVIEW", "APPLIED", "IN_PROGRESS"].includes(i.status)
    );
  }

  /**
   * Research Dean: Get Research Governance Portfolio Data
   */
  static getResearchGovernance() {
    const researchItems = extraWorkLedger.filter((i) => i.category === "RESEARCH_INNOVATION" || i.category === "HIGH_IMPACT_ACHIEVEMENT");
    const verifiedResearchWWP = researchItems.filter((i) => i.status === "VERIFIED").reduce((acc, i) => acc + i.calculation.totalWWP, 0);

    return {
      researchWWPThisYear: verifiedResearchWWP || 2840,
      pendingResearchVerification: 18,
      publicationsCount: 42,
      patentsCount: 11,
      fundedProjectsCount: 8,
      pipeline: {
        publicationClaims: 14,
        patentClaims: 6,
        projectClaims: 5,
        conferenceClaims: 8,
      },
      verificationQueue: researchItems,
    };
  }

  /**
   * IQAC Dean: Get Accreditation Evidence Governance Data
   */
  static getIQACGovernance() {
    const institutionalItems = extraWorkLedger.filter((i) => i.category === "INSTITUTIONAL");

    return {
      overallReadinessPercentage: 94,
      criteriaProgress: [
        { criterion: "Criteria 1: Curricular Aspects", progress: 82, verifiedActivities: 23 },
        { criterion: "Criteria 2: Teaching-Learning & Evaluation", progress: 91, verifiedActivities: 41 },
        { criterion: "Criteria 3: Research, Innovations & Extension", progress: 76, verifiedActivities: 18 },
        { criterion: "Criteria 4: Infrastructure & Learning Resources", progress: 88, verifiedActivities: 15 },
        { criterion: "Criteria 5: Student Support & Progression", progress: 94, verifiedActivities: 29 },
        { criterion: "Criteria 6: Governance, Leadership & Management", progress: 79, verifiedActivities: 12 },
        { criterion: "Criteria 7: Institutional Values & Best Practices", progress: 86, verifiedActivities: 19 },
      ],
      evidenceStats: {
        verifiedEvidencePercent: 94,
        missingEvidencePercent: 4,
        pendingReviewPercent: 2,
      },
      institutionalClaims: institutionalItems,
    };
  }

  /**
   * Principal / Super Admin: Get Institutional Summary
   */
  static getInstitutionSummary() {
    const totalWWP = extraWorkLedger.filter((i) => i.status === "VERIFIED").reduce((acc, i) => acc + i.calculation.totalWWP, 0);

    return {
      totalVerifiedWWP: totalWWP > 0 ? totalWWP + 18000 : 18420,
      activeFacultyCount: 248,
      pendingVerificationCount: extraWorkLedger.filter((i) => i.status === "SUBMITTED").length || 38,
      assignedOpportunitiesCount: 1284,
      overridesCount: mockAuditLogs.length || 12,
      departmentContributions: [
        { department: "CSE", totalWWP: 2840, facultyCount: 42, verifiedItemsCount: 86, topContributor: "Dr. Ananya Sharma" },
        { department: "ECE", totalWWP: 2310, facultyCount: 38, verifiedItemsCount: 72, topContributor: "Dr. Suresh Varma" },
        { department: "MECH", totalWWP: 1920, facultyCount: 32, verifiedItemsCount: 58, topContributor: "Dr. K. R. Venkatesh" },
        { department: "CIVIL", totalWWP: 1680, facultyCount: 28, verifiedItemsCount: 44, topContributor: "Dr. Sunita Deshmukh" },
        { department: "MBA", totalWWP: 1420, facultyCount: 24, verifiedItemsCount: 36, topContributor: "Dr. Ramesh Adani" },
      ],
      facultyContributors: "248 / 312",
      totalDepartmentsCount: 14,
      totalExtraWorkActivities: 1284,
      pendingInstitutionalReviews: extraWorkLedger.filter((i) => i.status === "SUBMITTED").length || 38,
      departmentBreakdown: [
        { department: "CSE", totalWWP: 2840, contributors: 42 },
        { department: "ECE", totalWWP: 2310, contributors: 38 },
        { department: "MECH", totalWWP: 1920, contributors: 32 },
        { department: "CIVIL", totalWWP: 1680, contributors: 28 },
        { department: "MBA", totalWWP: 1420, contributors: 24 },
      ],
      institutionalCategoryDistribution: {
        Research: 28,
        Events: 21,
        StudentDevelopment: 19,
        Accreditation: 14,
        Industry: 10,
        Social: 8,
      },
    };
  }

  /**
   * Principal / Super Admin: Get Versioned Point Policy
   */
  static getPointPolicy() {
    return mockPolicyStore;
  }

  /**
   * Principal / Super Admin: Assign Direct Institutional Duty to Faculty Member
   */
  static assignInstitutionalDuty(duty: {
    facultyId: string;
    facultyName: string;
    department: string;
    title: string;
    category: ExtraWorkCategory;
    wwpPoints: number;
    description: string;
    deadlineDate: string;
    targetVerificationAuthority: VerificationAuthority;
    assignedBy: string;
  }) {
    const newItem: ExtraWorkItem = {
      id: `EW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      facultyId: duty.facultyId,
      facultyName: duty.facultyName,
      department: duty.department,
      title: duty.title,
      category: duty.category,
      description: duty.description,
      status: "SUBMITTED",
      submissionDate: new Date().toISOString().split("T")[0],
      targetVerificationAuthority: duty.targetVerificationAuthority,
      calculation: {
        categoryBasePoints: duty.wwpPoints,
        roleMultiplier: 1.0,
        scopeMultiplier: 1.0,
        timeComplexityMultiplier: 1.0,
        totalWWP: duty.wwpPoints,
      },
      evidenceList: [
        {
          id: `EV-${Date.now()}`,
          name: "Institutional_Order_Notice.pdf",
          fileType: "DOCUMENT",
          fileUrl: "/placeholder-order.pdf",
          uploadedAt: new Date().toISOString(),
          description: `Direct Institutional Order assigned by ${duty.assignedBy}`,
        },
      ],
      auditTrail: [
        {
          id: `AT-${Date.now()}`,
          action: "INSTITUTIONAL_DUTY_ASSIGNED",
          performedBy: duty.assignedBy,
          role: "Super Admin / Principal",
          timestamp: new Date().toISOString(),
          notes: `Assigned direct duty: ${duty.title} with ${duty.wwpPoints} WWP allocation.`,
        },
      ],
    };

    extraWorkLedger.unshift(newItem);
    this.notifyListeners();
    return {
      success: true,
      message: `Institutional duty "${duty.title}" assigned to ${duty.facultyName} (${duty.department}) with +${duty.wwpPoints} WWP allocation!`,
      newItem,
    };
  }

  /**
   * Principal / Super Admin: Update Versioned Point Policy Matrix Rules
   */
  static updatePointPolicy(newRules: Array<{ ruleId: string; activityType: string; category: ExtraWorkCategory; basePoints: number; maxAnnualLimit: number; verificationAuthority: VerificationAuthority }>) {
    mockPolicyStore.rules = newRules as any;
    const majorVer = (parseFloat(mockPolicyStore.version.replace("v", "")) + 0.1).toFixed(1);
    mockPolicyStore.version = `v${majorVer}`;
    mockPolicyStore.modifiedAt = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    this.notifyListeners();
    return {
      success: true,
      message: `Institutional Point Policy matrix updated successfully to version ${mockPolicyStore.version}!`,
      policy: mockPolicyStore,
    };
  }

  /**
   * Principal / Super Admin: Create Point Override with Mandatory Audit Log
   */
  static createPointOverride(params: {
    itemId: string;
    itemTitle: string;
    facultyName: string;
    department: string;
    originalWWP: number;
    adjustedWWP: number;
    reason: string;
    requestedBy: string;
    authorizedBy: string;
  }) {
    const diff = params.adjustedWWP - params.originalWWP;
    const auditRecord = {
      id: `OVR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: params.itemId,
      itemTitle: params.itemTitle,
      facultyName: params.facultyName,
      department: params.department,
      originalWWP: params.originalWWP,
      adjustedWWP: params.adjustedWWP,
      difference: diff,
      reason: params.reason,
      requestedBy: params.requestedBy,
      authorizedBy: params.authorizedBy,
      policyVersion: "v1.2",
      timestamp: new Date().toISOString(),
    };

    // Update item in ledger
    const item = extraWorkLedger.find((i) => i.id === params.itemId);
    if (item) {
      item.calculation.adjustedPoints = params.adjustedWWP;
      item.calculation.adjustmentReason = params.reason;
      item.calculation.adjustedBy = params.authorizedBy;
      item.calculation.adjustedAt = new Date().toISOString();
      item.calculation.totalWWP = params.adjustedWWP;
    }

    mockAuditLogs.unshift(auditRecord);
    return { success: true, message: `Point override logged successfully. Difference: ${diff > 0 ? `+${diff}` : diff} WWP.`, auditRecord };
  }

  /**
   * Get Immutable Audit Logs
   */
  static getAuditLog() {
    return mockAuditLogs;
  }
}

// In-Memory Mock Audit Log Store
const mockAuditLogs: Array<{
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
}> = [
  {
    id: "OVR-2026-9102",
    itemId: "EW-2026-002",
    itemTitle: "Granted Indian Patent - AI Traffic System",
    facultyName: "Dr. Ananya Sharma",
    department: "Computer Science & Engineering",
    originalWWP: 120,
    adjustedWWP: 150,
    difference: 30,
    reason: "Exceptional commercialization & institutional IP recognition",
    requestedBy: "Dean Research",
    authorizedBy: "Dr. R. V. Ramanan (Principal)",
    policyVersion: "v1.2",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// In-Memory Policy Store for Super Admin Policy Matrix Management
const mockPolicyStore = {
  policyTitle: "Institutional Extra Work Merit & Credit Policy Matrix",
  version: "v1.2",
  status: "ACTIVE",
  effectiveDate: "01 Jan 2026",
  modifiedAt: "26 Aug 2026",
  modifiedBy: "Super Admin (Principal Office)",
  previousVersion: "v1.1",
  multiplier: 1.0,
  rules: [
    { ruleId: "R-01", activityType: "Hackathon Lead Coordinator", category: "EVENTS", basePoints: 50, maxAnnualLimit: 100, maxPointsCap: 100, verificationAuthority: "HOD / Dean Academic" },
    { ruleId: "R-02", activityType: "Hackathon Faculty Mentor", category: "STUDENT_DEVELOPMENT", basePoints: 20, maxAnnualLimit: 40, maxPointsCap: 40, verificationAuthority: "HOD" },
    { ruleId: "R-03", activityType: "FDP / Workshop Lead Coordinator", category: "EVENTS", basePoints: 30, maxAnnualLimit: 60, maxPointsCap: 60, verificationAuthority: "HOD / Dean Academic" },
    { ruleId: "R-04", activityType: "Indian Patent Granted", category: "RESEARCH_INNOVATION", basePoints: 100, maxAnnualLimit: 200, maxPointsCap: 200, verificationAuthority: "Dean Research" },
    { ruleId: "R-05", activityType: "NAAC Criteria Steering Coordinator", category: "INSTITUTIONAL", basePoints: 40, maxAnnualLimit: 80, maxPointsCap: 80, verificationAuthority: "IQAC Dean" },
    { ruleId: "R-06", activityType: "National Student Competition Mentorship", category: "STUDENT_DEVELOPMENT", basePoints: 25, maxAnnualLimit: 50, maxPointsCap: 50, verificationAuthority: "Dean Student Affairs" },
  ],
};



