export interface WorkflowStep {
  role: string;
  label: string;
  flagRequired?: string | undefined;
  status: "completed" | "active" | "pending" | "rejected";
  actor?: string | undefined;
  timestamp?: string | undefined;
  notes?: string | undefined;
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
  currentStepIndex: number;
  steps: WorkflowStep[];
}

export const MOCK_WORKFLOWS: WorkflowItem[] = [
  {
    id: "WF-ATT-1029",
    title: "Attendance Override Request (Medical Leave)",
    category: "Attendance Override",
    diagram: "Faculty -> HOD -> Dean (Opt.) -> Locked",
    description: "Request to override 4 days attendance for student Roll #22CS104 due to hospitalization.",
    requestor: "Dr. Ravi Kumar (Faculty)",
    department: "CSE",
    dateSubmitted: "2026-08-01 09:30 AM",
    currentStepIndex: 1,
    steps: [
      {
        role: "Faculty",
        label: "Faculty (Initiated)",
        status: "completed",
        actor: "Dr. Ravi Kumar",
        timestamp: "09:30 AM",
        notes: "Medical certificate verified and attached.",
      },
      {
        role: "HOD",
        label: "HOD (Dept. Head Review)",
        flagRequired: "isHod",
        status: "active",
        notes: "Awaiting HOD approval or override signature.",
      },
      {
        role: "Dean",
        label: "Dean (Optional Approval)",
        flagRequired: "isDean",
        status: "pending",
        notes: "Required for absences > 3 days.",
      },
      {
        role: "System",
        label: "Attendance Record Locked",
        status: "pending",
        notes: "Biometric database will update upon final lock.",
      },
    ],
  },
  {
    id: "WF-LEV-8821",
    title: "Faculty Casual & Conference Leave Approval",
    category: "Leave Approval",
    diagram: "Faculty -> HOD -> HR -> Payroll",
    description: "3 days leave application for IEEE International Conference presentation.",
    requestor: "Prof. Ananya Sharma (Faculty)",
    department: "ECE",
    dateSubmitted: "2026-07-31 02:15 PM",
    currentStepIndex: 2,
    steps: [
      {
        role: "Faculty",
        label: "Faculty (Applied)",
        status: "completed",
        actor: "Prof. Ananya Sharma",
        timestamp: "2026-07-31 02:15 PM",
        notes: "Conference invitation letter attached.",
      },
      {
        role: "HOD",
        label: "HOD Approved",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. M. N. Rao",
        timestamp: "2026-07-31 04:00 PM",
        notes: "Class substitute arrangement verified.",
      },
      {
        role: "HR",
        label: "HR Manager Sign-off",
        flagRequired: "isHRManager",
        status: "active",
        notes: "Verifying leave balance.",
      },
      {
        role: "Payroll",
        label: "Payroll Adjusted",
        flagRequired: "isFinanceOfficer",
        status: "pending",
        notes: "Paid duty leave code DL-04.",
      },
    ],
  },
  {
    id: "WF-RES-4412",
    title: "Semester Result Moderation & Gazette Declaration",
    category: "Result Declaration",
    diagram: "Exam Cell -> Evaluation Board -> Principal -> Published",
    description: "Final moderation approval for B.Tech Sem 6 Supplementary Results.",
    requestor: "Exam Controller Office",
    department: "Exam Cell",
    dateSubmitted: "2026-07-30 11:00 AM",
    currentStepIndex: 2,
    steps: [
      {
        role: "Exam Cell",
        label: "Internal Valuation Done",
        status: "completed",
        actor: "Exam Valuation Desk",
        timestamp: "2026-07-30 11:00 AM",
        notes: "Double valuation complete for 620 answer scripts.",
      },
      {
        role: "Board",
        label: "Moderation Board Approved",
        flagRequired: "isExamController",
        status: "completed",
        actor: "Dr. P. V. Ramana",
        timestamp: "2026-07-30 05:00 PM",
        notes: "Grace marks applied as per Regulation R22.",
      },
      {
        role: "Principal",
        label: "Principal Authorization",
        flagRequired: "isPrincipal",
        status: "active",
        notes: "Awaiting final executive seal & digital signature.",
      },
      {
        role: "Public",
        label: "Gazette Published to Student Portal",
        status: "pending",
        notes: "Results will reflect instantly in student transcripts.",
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
  action: "approve" | "reject",
  actorName: string,
): WorkflowItem[] {
  return workflows.map((wf) => {
    if (wf.id !== id) return wf;

    const newSteps = [...wf.steps];
    const currentStep = newSteps[wf.currentStepIndex];

    if (action === "approve") {
      currentStep.status = "completed";
      currentStep.actor = actorName;
      currentStep.timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const nextIndex = wf.currentStepIndex + 1;
      if (nextIndex < newSteps.length) {
        newSteps[nextIndex].status = "active";
      }

      return {
        ...wf,
        currentStepIndex: nextIndex,
        steps: newSteps,
      };
    } else {
      currentStep.status = "rejected";
      currentStep.actor = actorName;
      currentStep.timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        ...wf,
        steps: newSteps,
      };
    }
  });
}
