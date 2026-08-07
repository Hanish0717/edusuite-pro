import type {
  ApprovalActivity,
  ApprovalFiltersState,
  ApprovalNotification,
  ApprovalReportCard,
  ApprovalRequest,
  RequestSort,
  RequestType,
} from "./types";

export const APPROVAL_REQUEST_TYPES: RequestType[] = [
  "Faculty Subject Assignment",
  "Course Allocation",
  "Department Creation",
  "Curriculum Revision",
  "Subject Creation",
  "Subject Modification",
  "Timetable Approval",
  "Attendance Correction",
  "Attendance Override",
  "Leave Approval Recommendation",
  "Exam Schedule Approval",
  "Hall Allocation Approval",
  "Invigilator Approval",
  "Result Approval",
  "Result Publication",
  "Student Promotion",
  "Academic Calendar Update",
  "Classroom Allocation",
  "Laboratory Allocation",
  "Regulation Update",
];

export const APPROVAL_DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Management Studies",
  "All Departments",
] as const;

export const APPROVAL_PROGRAMS = [
  "B.Tech CSE",
  "B.Tech IT",
  "B.Tech ECE",
  "B.Tech Mechanical",
  "B.Tech Civil",
  "MBA",
  "B.Sc AI & DS",
] as const;

export const ACADEMIC_YEAR_OPTIONS = ["2026-27", "2025-26", "2024-25"] as const;

export const REFERENCE_DATE = new Date("2026-08-04T12:00:00Z");

export const DEFAULT_APPROVAL_FILTERS: ApprovalFiltersState = {
  search: "",
  requestType: "All",
  department: "All",
  program: "All",
  requestedBy: "",
  priority: "All",
  status: "All",
  submissionDate: "All",
  academicYear: "All",
  sortBy: "Newest",
};

export const MOCK_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "APR-2026-001",
    requestType: "Faculty Subject Assignment",
    department: "Computer Science",
    program: "B.Tech CSE",
    requestedBy: "Dr. S. K. Gupta",
    submittedDate: "2026-08-04",
    priority: "Critical",
    status: "Pending",
    description: "Assign two core AI faculty members to the fifth semester subject load before timetable freeze.",
    academicYear: "2026-27",
    supportingInformation: ["Workload report attached", "Faculty consent captured", "Subject matrix attached"],
    attachments: [
      { id: "att-1", name: "faculty-load-sheet.pdf", type: "PDF", size: "1.8 MB" },
      { id: "att-2", name: "subject-matrix.xlsx", type: "XLSX", size: "420 KB" },
    ],
    comments: [
      { id: "c-1", author: "Dr. S. K. Gupta", role: "HOD", message: "Need approval before final roster publish.", timestamp: "Today 09:10" },
      { id: "c-2", author: "Academic Office", role: "Reviewer", message: "Confirm if faculty overload limits are respected.", timestamp: "Today 10:20" },
    ],
    history: [
      { id: "h-1", stage: "Submitted", status: "Submitted", timestamp: "Today 08:45", actor: "Dr. S. K. Gupta", note: "Submitted from department portal." },
      { id: "h-2", stage: "Department Review", status: "Under Review", timestamp: "Today 09:30", actor: "Department Office", note: "Verified faculty availability." },
      { id: "h-3", stage: "Academic Management Review", status: "Pending", timestamp: "Pending", actor: "Academic Manager", note: "Awaiting final decision." },
    ],
    pendingSince: "2026-08-04T06:45:00Z",
    dueDate: "2026-08-04T16:00:00Z",
  },
  {
    id: "APR-2026-002",
    requestType: "Timetable Approval",
    department: "Mechanical Engineering",
    program: "B.Tech Mechanical",
    requestedBy: "Prof. Rajesh Kumar",
    submittedDate: "2026-08-03",
    priority: "High",
    status: "Under Review",
    description: "Finalize semester V timetable with lab blocks and shared classroom constraints.",
    academicYear: "2026-27",
    supportingInformation: ["Room allocation map", "Lab slots already blocked", "Faculty overlaps flagged"],
    attachments: [{ id: "att-3", name: "timetable-grid.pdf", type: "PDF", size: "1.1 MB" }],
    comments: [
      { id: "c-3", author: "Prof. Rajesh Kumar", role: "HOD", message: "Lab synchronization has been completed.", timestamp: "Yesterday 15:12" },
      { id: "c-4", author: "Academic Manager", role: "Reviewer", message: "Verify all practical sessions are reserved.", timestamp: "Yesterday 18:05" },
    ],
    history: [
      { id: "h-4", stage: "Submitted", status: "Submitted", timestamp: "Yesterday 11:15", actor: "Prof. Rajesh Kumar", note: "Submitted for approval." },
      { id: "h-5", stage: "Department Review", status: "Under Review", timestamp: "Yesterday 16:05", actor: "Department Office", note: "Time slots validated." },
    ],
    pendingSince: "2026-08-03T11:15:00Z",
    dueDate: "2026-08-05T12:00:00Z",
  },
  {
    id: "APR-2026-003",
    requestType: "Curriculum Revision",
    department: "Information Technology",
    program: "B.Tech IT",
    requestedBy: "Dr. P. V. Ramana",
    submittedDate: "2026-08-02",
    priority: "High",
    status: "Returned",
    description: "Update the AI elective sequence and add optional cloud modules to the sixth semester.",
    academicYear: "2026-27",
    supportingInformation: ["BoS minutes attached", "Outcome mapping included", "Industry advisor notes attached"],
    attachments: [{ id: "att-4", name: "curriculum-draft.docx", type: "DOCX", size: "780 KB" }],
    comments: [
      { id: "c-5", author: "Academic Manager", role: "Reviewer", message: "Please clarify credit distribution for the elective cluster.", timestamp: "Today 07:20" },
      { id: "c-6", author: "Dr. P. V. Ramana", role: "Department Lead", message: "Will share the revised BoS summary by afternoon.", timestamp: "Today 08:00" },
    ],
    history: [
      { id: "h-6", stage: "Submitted", status: "Submitted", timestamp: "2026-08-02 09:10", actor: "Dr. P. V. Ramana", note: "Curriculum revision logged." },
      { id: "h-7", stage: "Department Review", status: "Under Review", timestamp: "2026-08-02 16:00", actor: "Department Office", note: "Reviewed by BoS secretary." },
      { id: "h-8", stage: "Academic Management Review", status: "Returned", timestamp: "2026-08-04 07:20", actor: "Academic Manager", note: "Returned for clarification on credits." },
    ],
    pendingSince: "2026-08-02T09:10:00Z",
    dueDate: "2026-08-04T10:00:00Z",
    resolvedOn: "2026-08-04",
  },
  {
    id: "APR-2026-004",
    requestType: "Result Approval",
    department: "All Departments",
    program: "B.Tech CSE",
    requestedBy: "Controller of Examinations",
    submittedDate: "2026-08-01",
    priority: "Critical",
    status: "Pending",
    description: "Institution-wide semester result approval ahead of publication window.",
    academicYear: "2025-26",
    supportingInformation: ["Result scrutiny report attached", "Grace marks register attached", "Misprint reconciliation done"],
    attachments: [{ id: "att-5", name: "semester-results.xlsx", type: "XLSX", size: "2.4 MB" }],
    comments: [
      { id: "c-7", author: "Controller of Examinations", role: "Exam Cell", message: "Result sheets are ready for final sign-off.", timestamp: "Today 09:40" },
    ],
    history: [
      { id: "h-9", stage: "Submitted", status: "Submitted", timestamp: "2026-08-01 14:10", actor: "Exam Cell", note: "Final result compilation submitted." },
      { id: "h-10", stage: "Department Review", status: "Under Review", timestamp: "2026-08-03 13:05", actor: "Department Heads", note: "Department-wise verification completed." },
    ],
    pendingSince: "2026-08-01T14:10:00Z",
    dueDate: "2026-08-04T15:30:00Z",
  },
  {
    id: "APR-2026-005",
    requestType: "Attendance Correction",
    department: "Civil Engineering",
    program: "B.Tech Civil",
    requestedBy: "Prof. Meera Nair",
    submittedDate: "2026-07-31",
    priority: "Medium",
    status: "Approved",
    description: "Correct attendance anomalies for lab batch C after network outage during entry.",
    academicYear: "2026-27",
    supportingInformation: ["Network incident report attached", "Faculty sign-off included", "Student acknowledgement included"],
    attachments: [{ id: "att-6", name: "attendance-correction.pdf", type: "PDF", size: "640 KB" }],
    comments: [
      { id: "c-8", author: "Academic Manager", role: "Reviewer", message: "Approved after cross-check with lab register.", timestamp: "Today 11:00" },
    ],
    history: [
      { id: "h-11", stage: "Submitted", status: "Submitted", timestamp: "2026-07-31 10:20", actor: "Prof. Meera Nair", note: "Correction request submitted." },
      { id: "h-12", stage: "Department Review", status: "Under Review", timestamp: "2026-08-01 09:30", actor: "Department Office", note: "Attendance logs validated." },
      { id: "h-13", stage: "Academic Management Review", status: "Approved", timestamp: "2026-08-04 11:00", actor: "Academic Manager", note: "Approved for register update." },
    ],
    pendingSince: "2026-07-31T10:20:00Z",
    resolvedOn: "2026-08-04",
  },
  {
    id: "APR-2026-006",
    requestType: "Hall Allocation Approval",
    department: "Management Studies",
    program: "MBA",
    requestedBy: "Dr. Asha Menon",
    submittedDate: "2026-08-03",
    priority: "Medium",
    status: "Rejected",
    description: "Allocate two seminar halls for the MBA orientation and alumni interaction session.",
    academicYear: "2026-27",
    supportingInformation: ["Event schedule attached", "Expected attendance included"],
    attachments: [{ id: "att-7", name: "hall-request.docx", type: "DOCX", size: "210 KB" }],
    comments: [
      { id: "c-9", author: "Academic Manager", role: "Reviewer", message: "Rejected because the requested halls are reserved for exam scripts.", timestamp: "Today 12:15" },
    ],
    history: [
      { id: "h-14", stage: "Submitted", status: "Submitted", timestamp: "2026-08-03 09:00", actor: "Dr. Asha Menon", note: "Hall request submitted." },
      { id: "h-15", stage: "Academic Management Review", status: "Rejected", timestamp: "2026-08-04 12:15", actor: "Academic Manager", note: "Denied due to exam storage lock period." },
    ],
    pendingSince: "2026-08-03T09:00:00Z",
    resolvedOn: "2026-08-04",
  },
  {
    id: "APR-2026-007",
    requestType: "Laboratory Allocation",
    department: "Electrical Engineering",
    program: "B.Tech EEE",
    requestedBy: "Prof. Karthik Iyer",
    submittedDate: "2026-08-02",
    priority: "High",
    status: "Pending",
    description: "Reserve automation laboratory for the power systems integration workshop.",
    academicYear: "2026-27",
    supportingInformation: ["Safety checklist attached", "Lab assistant roster attached"],
    attachments: [{ id: "att-8", name: "lab-plan.pdf", type: "PDF", size: "900 KB" }],
    comments: [
      { id: "c-10", author: "Prof. Karthik Iyer", role: "Coordinator", message: "Need approval before workshop announcement.", timestamp: "Yesterday 18:20" },
    ],
    history: [
      { id: "h-16", stage: "Submitted", status: "Submitted", timestamp: "2026-08-02 13:50", actor: "Prof. Karthik Iyer", note: "Lab allocation request submitted." },
      { id: "h-17", stage: "Department Review", status: "Under Review", timestamp: "2026-08-03 10:20", actor: "Department Office", note: "Lab calendar checked." },
    ],
    pendingSince: "2026-08-02T13:50:00Z",
    dueDate: "2026-08-04T14:30:00Z",
  },
  {
    id: "APR-2026-008",
    requestType: "Academic Calendar Update",
    department: "All Departments",
    program: "B.Tech IT",
    requestedBy: "Academic Planning Cell",
    submittedDate: "2026-08-01",
    priority: "High",
    status: "Approved",
    description: "Publish the revised academic calendar with holiday, exam, and project review dates.",
    academicYear: "2026-27",
    supportingInformation: ["Holiday list integrated", "Exam phase mapped", "Stakeholder sign-off attached"],
    attachments: [{ id: "att-9", name: "calendar-revision.pdf", type: "PDF", size: "1.4 MB" }],
    comments: [
      { id: "c-11", author: "Academic Manager", role: "Reviewer", message: "Approved for publication after synchronization with exam cell.", timestamp: "Today 09:55" },
    ],
    history: [
      { id: "h-18", stage: "Submitted", status: "Submitted", timestamp: "2026-08-01 10:15", actor: "Academic Planning Cell", note: "Calendar update submitted." },
      { id: "h-19", stage: "Department Review", status: "Under Review", timestamp: "2026-08-03 17:40", actor: "Planning Committee", note: "Reviewed for clashes." },
      { id: "h-20", stage: "Academic Management Review", status: "Approved", timestamp: "2026-08-04 09:55", actor: "Academic Manager", note: "Approved for institutional publication." },
    ],
    pendingSince: "2026-08-01T10:15:00Z",
    resolvedOn: "2026-08-04",
  },
  {
    id: "APR-2026-009",
    requestType: "Student Promotion",
    department: "Computer Science",
    program: "B.Tech CSE",
    requestedBy: "Department Promotion Committee",
    submittedDate: "2026-07-30",
    priority: "Medium",
    status: "Returned",
    description: "Promote seven students from semester VI to VII after backlog review completion.",
    academicYear: "2025-26",
    supportingInformation: ["Backlog clearance report", "Attendance threshold summary"],
    attachments: [{ id: "att-10", name: "promotion-list.xlsx", type: "XLSX", size: "260 KB" }],
    comments: [
      { id: "c-12", author: "Academic Manager", role: "Reviewer", message: "Please include the revised backlog clearance remarks before approval.", timestamp: "Today 08:35" },
    ],
    history: [
      { id: "h-21", stage: "Submitted", status: "Submitted", timestamp: "2026-07-30 15:20", actor: "Committee", note: "Promotion list submitted." },
      { id: "h-22", stage: "Department Review", status: "Returned", timestamp: "2026-08-04 08:35", actor: "Academic Manager", note: "Returned for additional clearance note." },
    ],
    pendingSince: "2026-07-30T15:20:00Z",
    dueDate: "2026-08-04T09:00:00Z",
    resolvedOn: "2026-08-04",
  },
  {
    id: "APR-2026-010",
    requestType: "Regulation Update",
    department: "Information Technology",
    program: "B.Sc AI & DS",
    requestedBy: "Board of Studies",
    submittedDate: "2026-08-04",
    priority: "Critical",
    status: "Under Review",
    description: "Approve regulation wording for the new interdisciplinary honors track.",
    academicYear: "2026-27",
    supportingInformation: ["Draft regulation document", "Legal review note", "Faculty senate summary"],
    attachments: [{ id: "att-11", name: "regulation-draft.pdf", type: "PDF", size: "2.1 MB" }],
    comments: [
      { id: "c-13", author: "Board of Studies", role: "Secretary", message: "Awaiting final sign-off for the new honors rule set.", timestamp: "Today 10:45" },
    ],
    history: [
      { id: "h-23", stage: "Submitted", status: "Submitted", timestamp: "Today 10:05", actor: "Board of Studies", note: "Regulation update submitted." },
      { id: "h-24", stage: "Department Review", status: "Under Review", timestamp: "Today 11:10", actor: "Academic Office", note: "Policy review in progress." },
    ],
    pendingSince: "2026-08-04T10:05:00Z",
    dueDate: "2026-08-04T17:00:00Z",
  },
  {
    id: "APR-2026-011",
    requestType: "Result Publication",
    department: "Management Studies",
    program: "MBA",
    requestedBy: "Exam Cell",
    submittedDate: "2026-08-03",
    priority: "High",
    status: "Approved",
    description: "Publish the MBA semester IV results after final moderation and grade lock.",
    academicYear: "2025-26",
    supportingInformation: ["Moderation sheet attached", "Grade lock confirmation attached"],
    attachments: [{ id: "att-12", name: "mba-results.pdf", type: "PDF", size: "1.0 MB" }],
    comments: [
      { id: "c-14", author: "Academic Manager", role: "Reviewer", message: "Cleared for publication after audit verification.", timestamp: "Today 13:10" },
    ],
    history: [
      { id: "h-25", stage: "Submitted", status: "Submitted", timestamp: "2026-08-03 12:00", actor: "Exam Cell", note: "Publication request submitted." },
      { id: "h-26", stage: "Academic Management Review", status: "Approved", timestamp: "2026-08-04 13:10", actor: "Academic Manager", note: "Approved for publish trigger." },
    ],
    pendingSince: "2026-08-03T12:00:00Z",
    resolvedOn: "2026-08-04",
  },
];

export const MOCK_APPROVAL_ACTIVITIES: ApprovalActivity[] = [
  { id: "act-1", title: "Timetable Approved", detail: "Mechanical Engineering semester V timetable signed off.", actor: "Academic Manager", timestamp: "12 mins ago", tone: "success" },
  { id: "act-2", title: "Subject Returned", detail: "Curriculum revision sent back for clarifications.", actor: "Academic Manager", timestamp: "28 mins ago", tone: "warning" },
  { id: "act-3", title: "Curriculum Approved", detail: "Academic calendar update moved to publication stage.", actor: "Academic Manager", timestamp: "1 hour ago", tone: "success" },
  { id: "act-4", title: "Result Published", detail: "MBA semester IV results released for student access.", actor: "Exam Cell", timestamp: "2 hours ago", tone: "info" },
  { id: "act-5", title: "Exam Schedule Approved", detail: "Hall and invigilator allocations confirmed for mid-semester exams.", actor: "Academic Office", timestamp: "Yesterday", tone: "success" },
  { id: "act-6", title: "Attendance Correction Rejected", detail: "Duplicate attendance update rejected pending evidence.", actor: "Academic Manager", timestamp: "Yesterday", tone: "muted" },
];

export const MOCK_APPROVAL_NOTIFICATIONS: ApprovalNotification[] = [
  { id: "note-1", title: "New approval request received.", detail: "Result publication submitted by Exam Cell.", priority: "high", timestamp: "3 mins ago", unread: true },
  { id: "note-2", title: "Critical request pending.", detail: "Faculty subject assignment needs decision before schedule lock.", priority: "high", timestamp: "18 mins ago", unread: true },
  { id: "note-3", title: "Result approval deadline approaching.", detail: "Publication deadline closes at 5:30 PM.", priority: "medium", timestamp: "40 mins ago", unread: false },
  { id: "note-4", title: "Curriculum revision submitted.", detail: "IT curriculum revision arrived with supporting BoS notes.", priority: "medium", timestamp: "2 hours ago", unread: false },
  { id: "note-5", title: "Timetable awaiting approval.", detail: "Mechanical engineering timetable is ready for final sign-off.", priority: "low", timestamp: "Today", unread: false },
];

export const MOCK_APPROVAL_REPORTS: ApprovalReportCard[] = [
  { id: "rep-1", title: "Pending Requests Report", description: "Live queue snapshot for unresolved academic approvals.", metric: "18 items", delta: "+4 today" },
  { id: "rep-2", title: "Approval History", description: "Institution-level decision log across all request types.", metric: "126 records", delta: "+9 this week" },
  { id: "rep-3", title: "Department Approval Report", description: "Breakdown of approvals by department and reviewer.", metric: "8 departments", delta: "Updated hourly" },
  { id: "rep-4", title: "Monthly Approval Report", description: "Trend summary for monthly intake and decisions.", metric: "Aug 2026", delta: "13% faster" },
  { id: "rep-5", title: "Rejected Requests", description: "Returned and rejected items with reason summaries.", metric: "6 items", delta: "2 escalations" },
  { id: "rep-6", title: "Processing Time Report", description: "Average decision time across priorities and workflow stages.", metric: "14.2 hrs", delta: "-1.4 hrs" },
];

export function cloneApprovalRequests(source: ApprovalRequest[] = MOCK_APPROVAL_REQUESTS): ApprovalRequest[] {
  return source.map((request) => ({
    ...request,
    supportingInformation: [...request.supportingInformation],
    attachments: request.attachments.map((attachment) => ({ ...attachment })),
    comments: request.comments.map((comment) => ({ ...comment })),
    history: request.history.map((historyItem) => ({ ...historyItem })),
  }));
}

export function createDefaultApprovalFilters(): ApprovalFiltersState {
  return { ...DEFAULT_APPROVAL_FILTERS };
}

export function sortRequestsComparator(sortBy: RequestSort) {
  return (left: ApprovalRequest, right: ApprovalRequest) => {
    if (sortBy === "Newest") {
      return new Date(right.submittedDate).getTime() - new Date(left.submittedDate).getTime();
    }

    if (sortBy === "Oldest") {
      return new Date(left.submittedDate).getTime() - new Date(right.submittedDate).getTime();
    }

    if (sortBy === "Priority") {
      const priorityRank: Record<ApprovalRequest["priority"], number> = {
        Critical: 0,
        High: 1,
        Medium: 2,
        Low: 3,
      };
      return priorityRank[left.priority] - priorityRank[right.priority];
    }

    if (sortBy === "Department") {
      return left.department.localeCompare(right.department);
    }

    return left.status.localeCompare(right.status);
  };
}
