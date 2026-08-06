import {
  WorkflowItem,
  WorkflowStep,
  DelegationRecord,
  AuditLogEntry,
  EmergencyOverrideRecord,
  SlaInfo,
  WorkflowTemplate,
  RiskLevel,
  WorkflowDomainCategory,
} from "@/types/approval";

export const MOCK_DELEGATIONS: DelegationRecord[] = [
  {
    id: "DEL-2026-001",
    delegatorRole: "Dean",
    delegatorName: "Dr. S. K. Gupta",
    delegateeRole: "Vice Dean",
    delegateeName: "Prof. R. V. Sharma",
    validFrom: "2026-08-01",
    validUntil: "2026-08-10",
    status: "Active",
    scope: "Academic Attendance & Course Overrides",
    createdDate: "2026-08-01 09:00 AM",
  },
  {
    id: "DEL-2026-002",
    delegatorRole: "HOD",
    delegatorName: "Dr. M. N. Rao",
    delegateeRole: "Senior Faculty",
    delegateeName: "Dr. K. Swathi",
    validFrom: "2026-07-25",
    validUntil: "2026-07-30",
    status: "Expired",
    scope: "Faculty Leave Approvals",
    createdDate: "2026-07-25 10:30 AM",
  },
];

export const MOCK_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "TMPL-ATT-01",
    title: "Attendance Override Workflow",
    category: "Attendance Override",
    domainCategory: "Academic",
    riskLevel: "Low",
    defaultSlaHours: 24,
    version: "v2.1",
    description: "Standard multi-level review for medical and event attendance corrections.",
    stages: [
      { id: "s1", role: "Faculty", label: "Faculty Initiation", slaHours: 4 },
      { id: "s2", role: "HOD", label: "HOD Review & Verification", flagRequired: "isHod", slaHours: 12 },
      { id: "s3", role: "Dean", label: "Dean Endorsement (>3 Days)", flagRequired: "isDean", slaHours: 8 },
    ],
  },
  {
    id: "TMPL-LEV-02",
    title: "Faculty Leave & Conference Grant",
    category: "Leave Approval",
    domainCategory: "Human Resources",
    riskLevel: "Medium",
    defaultSlaHours: 48,
    version: "v1.4",
    description: "Approval path for casual, conference duty, and research leave requests.",
    stages: [
      { id: "s1", role: "Faculty", label: "Faculty Application", slaHours: 6 },
      { id: "s2", role: "HOD", label: "HOD Academic Clearance", flagRequired: "isHod", slaHours: 18 },
      { id: "s3", role: "HR", label: "HR Leave Balance Sign-off", flagRequired: "isHRManager", slaHours: 12 },
      { id: "s4", role: "Payroll", label: "Payroll Code Adjustment", flagRequired: "isFinanceOfficer", slaHours: 12 },
    ],
  },
  {
    id: "TMPL-RES-03",
    title: "Semester Result Gazette Declaration",
    category: "Result Declaration",
    domainCategory: "Academic",
    riskLevel: "Critical",
    defaultSlaHours: 72,
    version: "v3.0",
    description: "Executive clearance workflow for semester moderation and gazette publication.",
    stages: [
      { id: "s1", role: "Exam Cell", label: "Double Valuation & Entry", slaHours: 24 },
      { id: "s2", role: "Board", label: "Moderation Board Approval", flagRequired: "isExamController", slaHours: 24 },
      { id: "s3", role: "Principal", label: "Principal Executive Seal", flagRequired: "isPrincipal", slaHours: 24 },
    ],
  },
  {
    id: "TMPL-PRO-04",
    title: "Lab Equipment Procurement (> ₹1L)",
    category: "Purchases & Procurement",
    domainCategory: "Finance",
    riskLevel: "High",
    defaultSlaHours: 96,
    version: "v1.2",
    description: "Financial approval hierarchy for departmental capital expenditure and lab orders.",
    stages: [
      { id: "s1", role: "HOD", label: "Department Requisition", flagRequired: "isHod", slaHours: 24 },
      { id: "s2", role: "Purchase Officer", label: "Purchase & Vendor Clearance", flagRequired: "isPurchaseOfficer", slaHours: 24 },
      { id: "s3", role: "Finance Officer", label: "Budget Audit & Allocation", flagRequired: "isFinanceOfficer", slaHours: 24 },
      { id: "s4", role: "Principal", label: "Executive Authorization", flagRequired: "isPrincipal", slaHours: 24 },
    ],
  },
];

export const MOCK_WORKFLOWS: WorkflowItem[] = [
  {
    id: "WF-ATT-1029",
    title: "Attendance Override Request (Medical Leave)",
    category: "Attendance Override",
    domainCategory: "Academic",
    diagram: "Faculty -> HOD -> Dean -> System Lock",
    description: "Request to override 4 days attendance for student Roll #22CS104 due to hospitalization.",
    requestor: "Dr. Ravi Kumar",
    requestorRole: "Faculty",
    department: "Computer Science & Engineering",
    dateSubmitted: "2026-08-03 09:30 AM",
    submittedAt: "2026-08-03T09:30:00Z",
    stepStartedAt: "2026-08-03T11:00:00Z",
    slaHours: 24,
    currentStepIndex: 1,
    riskLevel: "Low",
    status: "Pending",
    isEscalated: false,
    escalationCount: 0,
    steps: [
      {
        id: "st-1",
        role: "Faculty",
        label: "Faculty Initiation",
        status: "completed",
        actor: "Dr. Ravi Kumar",
        actorRole: "Faculty",
        timestamp: "2026-08-03 09:30 AM",
        notes: "Medical certificate verified and attached from Apollo Hospitals.",
      },
      {
        id: "st-2",
        role: "HOD",
        label: "HOD Dept Review",
        flagRequired: "isHod",
        status: "active",
        notes: "Awaiting HOD approval or override signature.",
        slaHours: 12,
      },
      {
        id: "st-3",
        role: "Dean",
        label: "Dean Academic Approval",
        flagRequired: "isDean",
        status: "pending",
        notes: "Required for absences exceeding 3 days.",
        slaHours: 12,
      },
      {
        id: "st-4",
        role: "System",
        label: "Biometric DB Lock",
        status: "pending",
        notes: "Biometric database will auto-update upon final lock.",
      },
    ],
    escalationHistory: [],
    auditLogs: [
      {
        id: "log-001",
        workflowId: "WF-ATT-1029",
        workflowTitle: "Attendance Override Request (Medical Leave)",
        action: "Workflow Initiated",
        actor: "Dr. Ravi Kumar",
        role: "Faculty",
        timestamp: "2026-08-03 09:30 AM",
        ipAddress: "192.168.1.45",
        device: "Chrome / macOS",
        currentState: "Step 1 Completed",
        riskLevel: "Low",
      },
    ],
  },
  {
    id: "WF-LEV-8821",
    title: "Faculty Casual & International Conference Leave",
    category: "Leave Approval",
    domainCategory: "Human Resources",
    diagram: "Faculty -> HOD -> HR -> Payroll",
    description: "3 days duty leave application for IEEE International Conference presentation in Singapore.",
    requestor: "Prof. Ananya Sharma",
    requestorRole: "Faculty",
    department: "Electronics & Communication",
    dateSubmitted: "2026-08-02 02:15 PM",
    submittedAt: "2026-08-02T14:15:00Z",
    stepStartedAt: "2026-08-02T16:00:00Z",
    slaHours: 48,
    currentStepIndex: 2,
    riskLevel: "Medium",
    status: "Escalated",
    isEscalated: true,
    escalationCount: 1,
    steps: [
      {
        id: "st-1",
        role: "Faculty",
        label: "Faculty Applied",
        status: "completed",
        actor: "Prof. Ananya Sharma",
        actorRole: "Faculty",
        timestamp: "2026-08-02 02:15 PM",
        notes: "Conference invitation letter attached.",
      },
      {
        id: "st-2",
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. M. N. Rao",
        actorRole: "HOD",
        timestamp: "2026-08-02 04:00 PM",
        notes: "Class substitute arrangement verified with Prof. K. Ramesh.",
      },
      {
        id: "st-3",
        role: "HR",
        label: "HR Manager Sign-off",
        flagRequired: "isHRManager",
        status: "active",
        notes: "SLA timed out (24h passed). Escalated to Senior HR Admin.",
        slaHours: 12,
      },
      {
        id: "st-4",
        role: "Payroll",
        label: "Payroll Adjustment",
        flagRequired: "isFinanceOfficer",
        status: "pending",
        notes: "Duty leave code DL-04.",
      },
    ],
    escalationHistory: [
      {
        id: "esc-101",
        level: 1,
        fromRole: "HR Manager",
        toRole: "Senior HR Admin / Principal",
        reason: "SLA timeout (24h inactive limit exceeded).",
        timestamp: "2026-08-03 04:00 PM",
        triggeredBy: "Automated SLA Escalation Daemon",
      },
    ],
    auditLogs: [
      {
        id: "log-101",
        workflowId: "WF-LEV-8821",
        workflowTitle: "Faculty Casual & International Conference Leave",
        action: "Submitted",
        actor: "Prof. Ananya Sharma",
        role: "Faculty",
        timestamp: "2026-08-02 02:15 PM",
        ipAddress: "192.168.1.102",
        device: "Safari / macOS",
        riskLevel: "Medium",
      },
      {
        id: "log-102",
        workflowId: "WF-LEV-8821",
        workflowTitle: "Faculty Casual & International Conference Leave",
        action: "HOD Approved",
        actor: "Dr. M. N. Rao",
        role: "HOD",
        timestamp: "2026-08-02 04:00 PM",
        ipAddress: "192.168.1.55",
        device: "Chrome / Windows 11",
        riskLevel: "Medium",
      },
      {
        id: "log-103",
        workflowId: "WF-LEV-8821",
        workflowTitle: "Faculty Casual & International Conference Leave",
        action: "Escalation Triggered",
        actor: "System Engine",
        role: "Automated Daemon",
        timestamp: "2026-08-03 04:00 PM",
        ipAddress: "127.0.0.1",
        device: "System Process",
        reason: "SLA Exceeded",
        riskLevel: "Medium",
      },
    ],
  },
  {
    id: "WF-RES-4412",
    title: "Semester Result Moderation & Gazette Declaration",
    category: "Result Declaration",
    domainCategory: "Academic",
    diagram: "Exam Cell -> Evaluation Board -> Principal -> Published",
    description: "Final moderation approval for B.Tech Sem 6 Supplementary Results (620 scripts).",
    requestor: "Exam Controller Office",
    requestorRole: "Exam Cell",
    department: "Examination Cell",
    dateSubmitted: "2026-08-01 11:00 AM",
    submittedAt: "2026-08-01T11:00:00Z",
    stepStartedAt: "2026-08-01T17:00:00Z",
    slaHours: 72,
    currentStepIndex: 2,
    riskLevel: "Critical",
    status: "Pending",
    isEscalated: false,
    escalationCount: 0,
    steps: [
      {
        id: "st-1",
        role: "Exam Cell",
        label: "Internal Valuation Complete",
        status: "completed",
        actor: "Exam Valuation Desk",
        actorRole: "Exam Cell",
        timestamp: "2026-08-01 11:00 AM",
        notes: "Double valuation complete for all 620 scripts.",
      },
      {
        id: "st-2",
        role: "Board",
        label: "Moderation Board Approved",
        flagRequired: "isExamController",
        status: "completed",
        actor: "Dr. P. V. Ramana",
        actorRole: "Exam Controller",
        timestamp: "2026-08-01 05:00 PM",
        notes: "Grace marks applied under Regulation R22.",
      },
      {
        id: "st-3",
        role: "Principal",
        label: "Principal Executive Seal",
        flagRequired: "isPrincipal",
        status: "active",
        notes: "Awaiting final executive seal & digital signature.",
        slaHours: 24,
      },
      {
        id: "st-4",
        role: "Public",
        label: "Gazette Published to Portal",
        status: "pending",
        notes: "Results will reflect instantly in student transcripts.",
      },
    ],
    escalationHistory: [],
    auditLogs: [
      {
        id: "log-201",
        workflowId: "WF-RES-4412",
        workflowTitle: "Semester Result Moderation & Gazette Declaration",
        action: "Valuation Completed",
        actor: "Exam Valuation Desk",
        role: "Exam Cell",
        timestamp: "2026-08-01 11:00 AM",
        ipAddress: "10.0.4.12",
        device: "Firefox / Windows 10",
        riskLevel: "Critical",
      },
      {
        id: "log-202",
        workflowId: "WF-RES-4412",
        workflowTitle: "Semester Result Moderation & Gazette Declaration",
        action: "Moderation Board Approved",
        actor: "Dr. P. V. Ramana",
        role: "Exam Controller",
        timestamp: "2026-08-01 05:00 PM",
        ipAddress: "10.0.4.5",
        device: "Chrome / Windows 11",
        riskLevel: "Critical",
      },
    ],
  },
  {
    id: "WF-FIN-9904",
    title: "AI & Robotics Lab High-End GPU Server Purchase",
    category: "Purchases & Procurement",
    domainCategory: "Finance",
    diagram: "HOD -> Purchase Officer -> Finance Officer -> Principal",
    description: "Requisition for 4x NVIDIA H100 GPU servers for Advanced Deep Learning Lab (Value: ₹18.5 Lakhs).",
    requestor: "Dr. K. V. Subramanian",
    requestorRole: "HOD",
    department: "AI & Data Science",
    dateSubmitted: "2026-08-03 10:00 AM",
    submittedAt: "2026-08-03T10:00:00Z",
    stepStartedAt: "2026-08-03T14:30:00Z",
    slaHours: 96,
    currentStepIndex: 1,
    riskLevel: "High",
    status: "Pending",
    isEscalated: false,
    escalationCount: 0,
    steps: [
      {
        id: "st-1",
        role: "HOD",
        label: "Department Requisition Submitted",
        status: "completed",
        actor: "Dr. K. V. Subramanian",
        actorRole: "HOD",
        timestamp: "2026-08-03 10:00 AM",
        notes: "Detailed technical specifications & 3 vendor quotes attached.",
      },
      {
        id: "st-2",
        role: "Purchase Officer",
        label: "Vendor Commercial Clearance",
        flagRequired: "isPurchaseOfficer",
        status: "active",
        notes: "Verifying L1 vendor quotation and warranty SLA terms.",
        slaHours: 24,
      },
      {
        id: "st-3",
        role: "Finance Officer",
        label: "Budget Audit & Allocation",
        flagRequired: "isFinanceOfficer",
        status: "pending",
        notes: "Fund allocation under DST FIST Grant 2026.",
        slaHours: 24,
      },
      {
        id: "st-4",
        role: "Principal",
        label: "Principal Executive Authorization",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Final approval required for PO issuance.",
        slaHours: 24,
      },
    ],
    escalationHistory: [],
    auditLogs: [
      {
        id: "log-301",
        workflowId: "WF-FIN-9904",
        workflowTitle: "AI & Robotics Lab High-End GPU Server Purchase",
        action: "Requisition Submitted",
        actor: "Dr. K. V. Subramanian",
        role: "HOD",
        timestamp: "2026-08-03 10:00 AM",
        ipAddress: "192.168.2.14",
        device: "Chrome / Linux",
        riskLevel: "High",
      },
    ],
  },
  {
    id: "WF-STU-3320",
    title: "Degree Verification & Duplicate Transcript Request",
    category: "Certificates & Transcripts",
    domainCategory: "Student Services",
    diagram: "Student -> Verification Officer -> Registrar -> Issued",
    description: "Official transcript verification request for WES evaluation for alumnus Roll #18ECE045.",
    requestor: "Rajesh V. Verma (Alumnus)",
    requestorRole: "Alumni",
    department: "Electronics & Communication",
    dateSubmitted: "2026-08-04 08:30 AM",
    submittedAt: "2026-08-04T08:30:00Z",
    stepStartedAt: "2026-08-04T08:30:00Z",
    slaHours: 48,
    currentStepIndex: 1,
    riskLevel: "Low",
    status: "Pending",
    isEscalated: false,
    escalationCount: 0,
    steps: [
      {
        id: "st-1",
        role: "Applicant",
        label: "Application & Fee Paid",
        status: "completed",
        actor: "Rajesh V. Verma",
        actorRole: "Alumni",
        timestamp: "2026-08-04 08:30 AM",
        notes: "Fee payment receipt #TXN-99812 verified.",
      },
      {
        id: "st-2",
        role: "Verification Officer",
        label: "Records & Registry Audit",
        flagRequired: "isRegistrar",
        status: "active",
        notes: "Comparing digital ledger with physical archives.",
        slaHours: 24,
      },
      {
        id: "st-3",
        role: "Registrar",
        label: "Registrar Seal & Dispatch",
        flagRequired: "isRegistrar",
        status: "pending",
        notes: "Secure digital signature & courier tracking generation.",
        slaHours: 24,
      },
    ],
    escalationHistory: [],
    auditLogs: [
      {
        id: "log-401",
        workflowId: "WF-STU-3320",
        workflowTitle: "Degree Verification & Duplicate Transcript Request",
        action: "Submitted",
        actor: "Rajesh V. Verma",
        role: "Alumni",
        timestamp: "2026-08-04 08:30 AM",
        ipAddress: "49.207.14.88",
        device: "Mobile Safari / iOS",
        riskLevel: "Low",
      },
    ],
  },
];

// Memory state holders for interactive session
let storedWorkflows: WorkflowItem[] = [...MOCK_WORKFLOWS];
let storedDelegations: DelegationRecord[] = [...MOCK_DELEGATIONS];
let storedTemplates: WorkflowTemplate[] = [...MOCK_TEMPLATES];

export function fetchWorkflows(): WorkflowItem[] {
  return storedWorkflows;
}

export function fetchDelegations(): DelegationRecord[] {
  return storedDelegations;
}

export function fetchTemplates(): WorkflowTemplate[] {
  return storedTemplates;
}

/**
 * Enterprise Access Control Rule:
 * Super Admin does NOT automatically approve standard operational steps.
 * Operational approval requires holding the explicit flagRequired OR having an active delegation.
 */
export function canUserApproveStep(
  step: WorkflowStep,
  userRole: string,
  userFlags: Record<string, boolean>,
  delegations: DelegationRecord[] = storedDelegations
): boolean {
  if (step.status !== "active") return false;
  // Super Admin has executive sign-off authority to approve/reject any active step directly
  if (userRole === "super-admin") return true;
  if (!step.flagRequired) return true;

  // 1. Direct privilege flag check
  if (userFlags[step.flagRequired]) return true;

  // 2. Active delegation check
  const now = new Date().toISOString().split("T")[0];
  const hasActiveDelegation = delegations.some(
    (del) =>
      del.status === "Active" &&
      del.validFrom <= now &&
      del.validUntil >= now &&
      (del.delegateeRole.toLowerCase() === userRole.toLowerCase() ||
        del.delegateeName.toLowerCase() === userRole.toLowerCase())
  );

  if (hasActiveDelegation) return true;

  // 3. Super Admin is NOT allowed default daily operational sign-off
  return false;
}

/**
 * Calculates SLA metrics (Green, Yellow, Red) based on elapsed time vs slaHours
 */
export function getSlaStatus(item: WorkflowItem): SlaInfo {
  const started = new Date(item.stepStartedAt || item.submittedAt).getTime();
  const now = new Date().getTime();
  const elapsedMs = now - started;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  const totalSla = item.slaHours || 24;
  const percentElapsed = Math.min(100, Math.round((elapsedHours / totalSla) * 100));
  const hoursRemaining = Math.max(0, Math.round((totalSla - elapsedHours) * 10) / 10);
  const isOverdue = elapsedHours > totalSla || item.isEscalated;

  let status: "Green" | "Yellow" | "Red" = "Green";
  if (isOverdue) {
    status = "Red";
  } else if (percentElapsed >= 75) {
    status = "Yellow";
  }

  let displayText = "";
  if (isOverdue) {
    displayText = `SLA BREACHED (${Math.round(elapsedHours - totalSla)}h overdue)`;
  } else {
    displayText = `${hoursRemaining}h remaining (${percentElapsed}% elapsed)`;
  }

  return {
    status,
    hoursRemaining,
    hoursElapsed: Math.round(elapsedHours * 10) / 10,
    percentElapsed,
    isOverdue,
    displayText,
  };
}

/**
 * Standard Step Processing (Operational Approvers only)
 */
export function processStandardStep(
  workflows: WorkflowItem[],
  id: string,
  action: "approve" | "reject",
  actorName: string,
  actorRole: string,
  notes?: string
): WorkflowItem[] {
  const updated = workflows.map((wf) => {
    if (wf.id !== id) return wf;

    const newSteps = [...wf.steps];
    const currentStep = newSteps[wf.currentStepIndex];
    const nowStr = new Date().toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const isApprove = action === "approve";

    currentStep.status = isApprove ? "completed" : "rejected";
    currentStep.actor = actorName;
    currentStep.actorRole = actorRole;
    currentStep.timestamp = nowStr;
    if (notes) currentStep.notes = notes;

    const newAuditLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      workflowId: wf.id,
      workflowTitle: wf.title,
      action: isApprove ? `${currentStep.role} Approved` : `${currentStep.role} Rejected`,
      actor: actorName,
      role: actorRole,
      timestamp: nowStr,
      ipAddress: "192.168.1.120",
      device: "Enterprise Web Portal",
      previousState: `Step ${wf.currentStepIndex + 1}: ${currentStep.label} (Active)`,
      currentState: isApprove
        ? `Step ${wf.currentStepIndex + 1}: Completed`
        : `Workflow Rejected at Step ${wf.currentStepIndex + 1}`,
      reason: notes || (isApprove ? "Approved standard criteria" : "Criteria not satisfied"),
      riskLevel: wf.riskLevel,
    };

    let nextIndex = wf.currentStepIndex;
    let nextStatus = wf.status;

    if (isApprove) {
      nextIndex = wf.currentStepIndex + 1;
      if (nextIndex < newSteps.length) {
        newSteps[nextIndex].status = "active";
      } else {
        nextStatus = "Completed";
      }
    } else {
      nextStatus = "Rejected";
    }

    return {
      ...wf,
      currentStepIndex: nextIndex,
      status: nextStatus,
      steps: newSteps,
      stepStartedAt: new Date().toISOString(),
      auditLogs: [newAuditLog, ...wf.auditLogs],
    };
  });

  storedWorkflows = updated;
  return updated;
}

/**
 * Dedicated Super Admin Emergency Override Action
 */
export function processEmergencyOverride(
  workflows: WorkflowItem[],
  id: string,
  overrideAction: "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow",
  reason: string,
  superAdminName: string = "Super Admin Authority",
  ipAddress: string = "10.0.0.1 (VPN Vault)",
  device: string = "Super Admin Executive Terminal"
): WorkflowItem[] {
  const updated = workflows.map((wf) => {
    if (wf.id !== id) return wf;

    const newSteps = [...wf.steps];
    const currentStep = newSteps[wf.currentStepIndex];
    const nowStr = new Date().toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const overrideRecord: EmergencyOverrideRecord = {
      overriddenBy: superAdminName,
      actorRole: "Super Admin",
      actionType: overrideAction,
      reason,
      timestamp: nowStr,
      ipAddress,
      device,
    };

    if (currentStep) {
      currentStep.status = overrideAction === "Emergency Approve" ? "completed" : "rejected";
      currentStep.actor = `${superAdminName} (OVERRIDE)`;
      currentStep.actorRole = "Super Admin";
      currentStep.timestamp = nowStr;
      currentStep.notes = `EMERGENCY OVERRIDE: ${reason}`;
    }

    let finalStatus: WorkflowItem["status"] = "Completed";
    if (overrideAction === "Force Reject") finalStatus = "Rejected";
    if (overrideAction === "Cancel Workflow") finalStatus = "Cancelled";
    if (overrideAction === "Force Reassign") finalStatus = "Escalated";

    const auditLog: AuditLogEntry = {
      id: `log-override-${Date.now()}`,
      workflowId: wf.id,
      workflowTitle: wf.title,
      action: `EMERGENCY OVERRIDE (${overrideAction})`,
      actor: superAdminName,
      role: "Super Admin Authority",
      timestamp: nowStr,
      ipAddress,
      device,
      reason,
      isOverride: true,
      riskLevel: wf.riskLevel,
      previousState: `Active Step: ${currentStep?.label || "Unknown"}`,
      currentState: `Override Executed -> ${finalStatus}`,
    };

    return {
      ...wf,
      status: finalStatus,
      currentStepIndex: overrideAction === "Emergency Approve" ? newSteps.length : wf.currentStepIndex,
      steps: newSteps,
      overrideDetails: overrideRecord,
      auditLogs: [auditLog, ...wf.auditLogs],
    };
  });

  storedWorkflows = updated;
  return updated;
}

/**
 * Escalate a Workflow step
 */
export function processEscalation(
  workflows: WorkflowItem[],
  id: string,
  reason: string,
  targetRole: string = "Dean / Principal"
): WorkflowItem[] {
  const updated = workflows.map((wf) => {
    if (wf.id !== id) return wf;

    const currentStep = wf.steps[wf.currentStepIndex];
    const nowStr = new Date().toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const newEscRecord = {
      id: `esc-${Date.now()}`,
      level: wf.escalationCount + 1,
      fromRole: currentStep?.role || "Pending Role",
      toRole: targetRole,
      reason,
      timestamp: nowStr,
      triggeredBy: "Manual Escalation Request",
    };

    if (currentStep) {
      currentStep.status = "escalated";
      currentStep.notes = `ESCALATED to ${targetRole}: ${reason}`;
    }

    const auditLog: AuditLogEntry = {
      id: `log-esc-${Date.now()}`,
      workflowId: wf.id,
      workflowTitle: wf.title,
      action: `Escalated to Level ${newEscRecord.level} (${targetRole})`,
      actor: "Escalation Manager",
      role: "Governance Engine",
      timestamp: nowStr,
      ipAddress: "127.0.0.1",
      device: "System Workflow Daemon",
      reason,
      escalationLevel: newEscRecord.level,
      riskLevel: wf.riskLevel,
    };

    return {
      ...wf,
      status: "Escalated" as const,
      isEscalated: true,
      escalationCount: wf.escalationCount + 1,
      escalationHistory: [newEscRecord, ...wf.escalationHistory],
      auditLogs: [auditLog, ...wf.auditLogs],
    };
  });

  storedWorkflows = updated;
  return updated;
}

export function createDelegation(newDel: Omit<DelegationRecord, "id" | "createdDate" | "status">): DelegationRecord[] {
  const record: DelegationRecord = {
    ...newDel,
    id: `DEL-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdDate: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
    status: "Active",
  };

  storedDelegations = [record, ...storedDelegations];
  return storedDelegations;
}

export function revokeDelegation(id: string): DelegationRecord[] {
  storedDelegations = storedDelegations.map((del) => (del.id === id ? { ...del, status: "Revoked" } : del));
  return storedDelegations;
}

export function saveWorkflowTemplate(template: WorkflowTemplate): WorkflowTemplate[] {
  const existingIdx = storedTemplates.findIndex((t) => t.id === template.id);
  if (existingIdx >= 0) {
    storedTemplates[existingIdx] = template;
  } else {
    storedTemplates = [template, ...storedTemplates];
  }
  return storedTemplates;
}
