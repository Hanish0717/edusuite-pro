export interface WorkflowStep {
  role: string;
  label: string;
  flagRequired?: string | undefined;
  status: "completed" | "active" | "pending" | "rejected";
  actor?: string | undefined;
  timestamp?: string | undefined;
  notes?: string | undefined;
}

export interface WorkflowDocument {
  name: string;
  size: string;
  type: string;
}

export interface WorkflowHistory {
  step: string;
  actor: string;
  action: string;
  timestamp: string;
  comments: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  category: string;
  diagram: string;
  description: string;
  requestor: string;
  department: string;
  dateSubmitted: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "In Review" | "Approved" | "Rejected" | "Escalated" | "Completed";
  currentApprover: string;
  slaRemaining: string;
  currentStepIndex: number;
  steps: WorkflowStep[];
  documents: WorkflowDocument[];
  history: WorkflowHistory[];
}

export const MOCK_WORKFLOWS: WorkflowItem[] = [
  {
    id: "WF-ATT-1029",
    title: "Attendance Override Request (Medical Leave)",
    category: "Attendance Override",
    diagram: "Faculty -> HOD -> Dean (Opt.) -> Locked",
    description: "Request to override 4 days attendance for student Roll #22CS104 due to hospitalization at Apollo Hospital.",
    requestor: "Dr. Ravi Kumar (Faculty)",
    department: "CSE",
    dateSubmitted: "2026-08-01 09:30 AM",
    priority: "Critical",
    status: "In Review",
    currentApprover: "Dr. M. N. Rao (HOD)",
    slaRemaining: "14h 30m remaining",
    currentStepIndex: 1,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Dr. Ravi Kumar",
        timestamp: "2026-08-01 09:30 AM",
        notes: "Medical certificate and discharge summary verified.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "active",
        notes: "Awaiting HOD approval or override signature.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "pending",
        notes: "Required for absences exceeding 3 days.",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Executive final sign-off.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "Biometric attendance database update upon final lock.",
      },
    ],
    documents: [
      { name: "Apollo_Hospital_Discharge_Summary.pdf", size: "1.4 MB", type: "PDF Document" },
      { name: "Medical_Attendance_Exemption_Form.pdf", size: "480 KB", type: "PDF Form" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Dr. Ravi Kumar (Faculty)",
        action: "Submitted Request",
        timestamp: "2026-08-01 09:30 AM",
        comments: "Application submitted with medical evidence attached.",
      },
    ],
  },
  {
    id: "WF-LEV-8821",
    title: "Faculty Casual & Conference Leave Approval",
    category: "Leave Approval",
    diagram: "Faculty -> HOD -> HR -> Payroll",
    description: "3 days leave application for IEEE International Conference presentation on Neural Networks in Tokyo.",
    requestor: "Prof. Ananya Sharma (Faculty)",
    department: "ECE",
    dateSubmitted: "2026-07-31 02:15 PM",
    priority: "Medium",
    status: "In Review",
    currentApprover: "Mrs. S. Pillai (HR Manager)",
    slaRemaining: "26h 10m remaining",
    currentStepIndex: 2,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Prof. Ananya Sharma",
        timestamp: "2026-07-31 02:15 PM",
        notes: "IEEE Conference acceptance paper letter attached.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. M. N. Rao",
        timestamp: "2026-07-31 04:00 PM",
        notes: "Substitute arrangement verified for all 4 lectures.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "active",
        notes: "Verifying research travel grant entitlement.",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Sanction letter release.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "HR & Payroll leave balance updated.",
      },
    ],
    documents: [
      { name: "IEEE_Paper_Acceptance_Letter.pdf", size: "850 KB", type: "PDF Document" },
      { name: "Substitute_Teaching_Schedule.xlsx", size: "210 KB", type: "Excel Spreadsheet" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Prof. Ananya Sharma",
        action: "Submitted Request",
        timestamp: "2026-07-31 02:15 PM",
        comments: "Leave application submitted for IEEE Conference.",
      },
      {
        step: "Step 2",
        actor: "Dr. M. N. Rao (HOD ECE)",
        action: "HOD Approved",
        timestamp: "2026-07-31 04:00 PM",
        comments: "Approved. Classes rescheduled with Prof. Gupta.",
      },
    ],
  },
  {
    id: "WF-RES-4412",
    title: "Semester Result Moderation & Gazette Declaration",
    category: "Result Declaration",
    diagram: "Exam Cell -> Evaluation Board -> Principal -> Published",
    description: "Final moderation approval for B.Tech Sem 6 Supplementary Examination Results Gazette.",
    requestor: "Exam Controller Office",
    department: "Exam Cell",
    dateSubmitted: "2026-07-30 11:00 AM",
    priority: "High",
    status: "In Review",
    currentApprover: "Dr. V. K. Murthy (Principal)",
    slaRemaining: "5h 45m remaining",
    currentStepIndex: 2,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Valuation Desk Chief",
        timestamp: "2026-07-30 11:00 AM",
        notes: "Double valuation completed for 620 scripts.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isExamController",
        status: "completed",
        actor: "Dr. P. V. Ramana",
        timestamp: "2026-07-30 05:00 PM",
        notes: "Grace marks applied per Regulation R22.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "completed",
        actor: "Dr. S. K. Gupta",
        timestamp: "2026-07-31 10:00 AM",
        notes: "Academic committee audit passed.",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "active",
        notes: "Awaiting final executive seal & digital signature.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "Gazette auto-publishes to student portal upon approval.",
      },
    ],
    documents: [
      { name: "Sem6_Result_Gazette_Draft_2026.pdf", size: "3.2 MB", type: "PDF Document" },
      { name: "Moderation_Committee_Minutes.pdf", size: "620 KB", type: "PDF Document" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Valuation Desk Chief",
        action: "Submitted Request",
        timestamp: "2026-07-30 11:00 AM",
        comments: "Evaluation complete.",
      },
      {
        step: "Step 2",
        actor: "Dr. P. V. Ramana (Exam Controller)",
        action: "Approved Step 2",
        timestamp: "2026-07-30 05:00 PM",
        comments: "Moderation rules applied.",
      },
      {
        step: "Step 3",
        actor: "Dr. S. K. Gupta (Academic Dean)",
        action: "Dean Approved",
        timestamp: "2026-07-31 10:00 AM",
        comments: "Verified grade distribution.",
      },
    ],
  },
  {
    id: "WF-PRC-3091",
    title: "High-Performance GPU AI Compute Server Purchase",
    category: "Purchase Request",
    diagram: "Lab Admin -> HOD -> Dean -> Finance -> Principal",
    description: "Requisition for 2x NVIDIA H100 GPU Nodes for Advanced AI Research & Deep Learning Lab.",
    requestor: "Dr. K. Sai Teja (AI Lab Incharge)",
    department: "CSE",
    dateSubmitted: "2026-08-02 08:30 AM",
    priority: "Critical",
    status: "In Review",
    currentApprover: "Dr. S. K. Gupta (Academic Dean)",
    slaRemaining: "8h 15m remaining",
    currentStepIndex: 2,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Dr. K. Sai Teja",
        timestamp: "2026-08-02 08:30 AM",
        notes: "Quotations from 3 authorized vendors attached.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. A. V. Rao",
        timestamp: "2026-08-02 11:45 AM",
        notes: "Approved under DST AI Center of Excellence grant.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "active",
        notes: "Awaiting Dean endorsement for capital expenditure.",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Executive purchase order sanction.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "Procurement purchase order dispatch.",
      },
    ],
    documents: [
      { name: "NVIDIA_H100_Vendor_Quotations.pdf", size: "2.8 MB", type: "PDF Document" },
      { name: "DST_Research_Grant_Sanction_Letter.pdf", size: "1.1 MB", type: "PDF Document" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Dr. K. Sai Teja",
        action: "Submitted Purchase Requisition",
        timestamp: "2026-08-02 08:30 AM",
        comments: "Submitted under AI Grant.",
      },
      {
        step: "Step 2",
        actor: "Dr. A. V. Rao (HOD)",
        action: "HOD Approved",
        timestamp: "2026-08-02 11:45 AM",
        comments: "Recommended for lab upgrade.",
      },
    ],
  },
  {
    id: "WF-PRM-5502",
    title: "Assistant Professor Seniority Promotion Dossier",
    category: "Faculty Promotion",
    diagram: "Faculty -> HOD -> HR -> Dean -> Principal",
    description: "Career Advancement Scheme (CAS) promotion for Dr. Meera Reddy from Stage-2 to Stage-3.",
    requestor: "Dr. Meera Reddy (Asst Prof)",
    department: "Mechanical",
    dateSubmitted: "2026-07-28 04:00 PM",
    priority: "High",
    status: "Escalated",
    currentApprover: "Dr. V. K. Murthy (Principal)",
    slaRemaining: "Overdue (36h)",
    currentStepIndex: 3,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Dr. Meera Reddy",
        timestamp: "2026-07-28 04:00 PM",
        notes: "API Score & Scopus publication portfolio attached.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. R. S. Mehta",
        timestamp: "2026-07-29 10:00 AM",
        notes: "Peer review & student feedback > 92%.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "completed",
        actor: "Dr. S. K. Gupta",
        timestamp: "2026-07-30 02:00 PM",
        notes: "API score verified (184 / 200).",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "active",
        notes: "Escalated to Executive Principal Office.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "Governing body promotion order issue.",
      },
    ],
    documents: [
      { name: "UGC_CAS_API_Scorecard_Validated.pdf", size: "4.5 MB", type: "PDF Document" },
      { name: "Scopus_Journal_Publications_Dossier.pdf", size: "6.1 MB", type: "PDF Document" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Dr. Meera Reddy",
        action: "Submitted CAS Dossier",
        timestamp: "2026-07-28 04:00 PM",
        comments: "Application submitted.",
      },
      {
        step: "Step 2",
        actor: "Dr. R. S. Mehta (HOD)",
        action: "HOD Approved",
        timestamp: "2026-07-29 10:00 AM",
        comments: "Recommended for promotion.",
      },
      {
        step: "Step 3",
        actor: "Dr. S. K. Gupta (Dean)",
        action: "Dean Approved",
        timestamp: "2026-07-30 02:00 PM",
        comments: "Verified API score.",
      },
      {
        step: "Step 4",
        actor: "System Automated",
        action: "Escalated to Principal",
        timestamp: "2026-08-01 09:00 AM",
        comments: "Escalated due to SLA threshold breach (>48h).",
      },
    ],
  },
  {
    id: "WF-NPT-1204",
    title: "NPTEL Swayam Course Credit Equivalency Authorization",
    category: "NPTEL Verification",
    diagram: "Student -> Mentor -> HOD -> Dean",
    description: "Credit transfer for 42 final year CSE students who passed NPTEL 12-week Cloud Computing course.",
    requestor: "Prof. P. V. Sharma (NPTEL Coordinator)",
    department: "CSE",
    dateSubmitted: "2026-08-03 10:15 AM",
    priority: "Low",
    status: "Pending",
    currentApprover: "Dr. A. V. Rao (HOD CSE)",
    slaRemaining: "42h 00m remaining",
    currentStepIndex: 1,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Submitted",
        status: "completed",
        actor: "Prof. P. V. Sharma",
        timestamp: "2026-08-03 10:15 AM",
        notes: "NPTEL certificate scorecards attached.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "active",
        notes: "Verifying 3-credit course equivalence.",
      },
      {
        role: "Dean",
        label: "Dean Approved",
        flagRequired: "isDean",
        status: "pending",
        notes: "Academic council ratification.",
      },
      {
        role: "Principal",
        label: "Principal Pending",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Final transcript credit posting.",
      },
      {
        role: "System",
        label: "Completed",
        status: "pending",
        notes: "Automated student gradebook update.",
      },
    ],
    documents: [
      { name: "NPTEL_Swayam_Scorecards_Batch42.pdf", size: "5.2 MB", type: "PDF Document" },
      { name: "Course_Equivalence_Mapping_Matrix.xlsx", size: "180 KB", type: "Excel Spreadsheet" },
    ],
    history: [
      {
        step: "Step 1",
        actor: "Prof. P. V. Sharma",
        action: "Submitted NPTEL Batch",
        timestamp: "2026-08-03 10:15 AM",
        comments: "Submitted batch of 42 student certificates.",
      },
    ],
  },
];

export function fetchWorkflows(): WorkflowItem[] {
  return MOCK_WORKFLOWS;
}

export function processWorkflowStep(
  workflows: WorkflowItem[],
  id: string,
  action: "approve" | "reject" | "forward" | "escalate",
  actorName: string,
  extraComments?: string
): WorkflowItem[] {
  return workflows.map((wf) => {
    if (wf.id !== id) return wf;

    const newSteps = [...wf.steps];
    const currentStep = newSteps[wf.currentStepIndex];
    const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (action === "approve") {
      currentStep.status = "completed";
      currentStep.actor = actorName;
      currentStep.timestamp = timestampStr;

      const nextIndex = wf.currentStepIndex + 1;
      const isFinalStep = nextIndex >= newSteps.length;

      if (!isFinalStep) {
        newSteps[nextIndex].status = "active";
      }

      return {
        ...wf,
        currentStepIndex: nextIndex,
        status: isFinalStep ? "Completed" : "In Review",
        steps: newSteps,
        history: [
          ...wf.history,
          {
            step: `Step ${wf.currentStepIndex + 1}`,
            actor: actorName,
            action: "Approved Step",
            timestamp: timestampStr,
            comments: extraComments || `Approved step ${wf.currentStepIndex + 1} (${currentStep.label})`,
          },
        ],
      };
    } else if (action === "reject") {
      currentStep.status = "rejected";
      currentStep.actor = actorName;
      currentStep.timestamp = timestampStr;

      return {
        ...wf,
        status: "Rejected",
        steps: newSteps,
        history: [
          ...wf.history,
          {
            step: `Step ${wf.currentStepIndex + 1}`,
            actor: actorName,
            action: "Rejected Step",
            timestamp: timestampStr,
            comments: extraComments || `Rejected step ${wf.currentStepIndex + 1}`,
          },
        ],
      };
    } else if (action === "escalate") {
      return {
        ...wf,
        priority: "Critical",
        status: "Escalated",
        slaRemaining: "Escalated (Urgent)",
        history: [
          ...wf.history,
          {
            step: `Step ${wf.currentStepIndex + 1}`,
            actor: actorName,
            action: "Escalated Priority",
            timestamp: timestampStr,
            comments: extraComments || "Escalated to Executive Principal Office for fast-track clearance.",
          },
        ],
      };
    } else {
      // Forward / Delegate
      return {
        ...wf,
        currentApprover: extraComments || "Delegated Officer",
        history: [
          ...wf.history,
          {
            step: `Step ${wf.currentStepIndex + 1}`,
            actor: actorName,
            action: "Forwarded Request",
            timestamp: timestampStr,
            comments: `Forwarded to ${extraComments || "Delegated Officer"} for evaluation.`,
          },
        ],
      };
    }
  });
}
