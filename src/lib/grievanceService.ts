export interface TimelineEvent {
  step: string;
  date: string;
  description: string;
  actor: string;
}

export interface GrievanceTicket {
  id: string;
  category: string;
  subject: string;
  raisedBy: string;
  date: string;
  committee: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Pending" | "Under Review" | "Committee Assigned" | "Resolved";
  sla: string;
  timeline: TimelineEvent[];
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  department: string;
  assignedCases: number;
}

export interface AntiRaggingSquadMember {
  id: string;
  name: string;
  zone: string;
  contact: string;
  status: "On Duty" | "Standby";
}

export interface GrievanceKpiStats {
  totalTickets: string;
  resolvedSlaRate: string;
  pendingReviewCount: number;
  avgResolutionTime: string;
}

export const MOCK_GRIEVANCE_TICKETS: GrievanceTicket[] = [
  {
    id: "GRV-2026-081",
    category: "Academic / Internal Evaluation",
    subject: "Revaluation Request delay for Mathematics III",
    raisedBy: "Student (Roll 22CS089)",
    date: "2026-07-28",
    committee: "Academic Appeals Committee",
    priority: "High",
    status: "Under Review",
    sla: "48 Hours",
    timeline: [
      {
        step: "Ticket Raised",
        date: "2026-07-28 10:30 AM",
        description: "Grievance submitted by Student 22CS089 via Portal.",
        actor: "Student 22CS089",
      },
      {
        step: "Committee Assigned",
        date: "2026-07-28 02:15 PM",
        description: "Assigned to Academic Appeals Committee for paper re-scrutiny.",
        actor: "Academic Dean",
      },
      {
        step: "Under Active Review",
        date: "2026-07-29 09:00 AM",
        description: "Evaluator comments requested from Mathematics Dept.",
        actor: "Dr. S. K. Gupta",
      },
    ],
  },
  {
    id: "GRV-2026-082",
    category: "Hostel & Facilities",
    subject: "Wi-Fi connectivity issues in Block B 3rd Floor",
    raisedBy: "Student (Anonymous)",
    date: "2026-07-30",
    committee: "Hostel Oversight Committee",
    priority: "Medium",
    status: "Resolved",
    sla: "Closed",
    timeline: [
      {
        step: "Ticket Raised",
        date: "2026-07-30 08:00 AM",
        description: "Anonymous complaint lodged for Wi-Fi router breakdown.",
        actor: "Anonymous Student",
      },
      {
        step: "Work Order Issued",
        date: "2026-07-30 10:00 AM",
        description: "IT Infra vendor dispatched replacement Access Point.",
        actor: "Hostel Warden",
      },
      {
        step: "Resolved & Closed",
        date: "2026-07-30 04:30 PM",
        description: "Access Point replaced and speed tested (100 Mbps).",
        actor: "IT Admin",
      },
    ],
  },
  {
    id: "GRV-2026-083",
    category: "Disciplinary / Anti-Ragging",
    subject: "Lab equipment damage incident report",
    raisedBy: "Faculty (CSE Lab Incharge)",
    date: "2026-07-31",
    committee: "Disciplinary Committee",
    priority: "Urgent",
    status: "Committee Assigned",
    sla: "24 Hours",
    timeline: [
      {
        step: "Incident Reported",
        date: "2026-07-31 04:00 PM",
        description: "Lab Incharge reported broken oscilloscope unit in Hardware Lab.",
        actor: "Prof. Rajesh Sharma",
      },
      {
        step: "Escalated to Disciplinary Board",
        date: "2026-07-31 05:30 PM",
        description: "Formal hearing notice issued to batch representatives.",
        actor: "Disciplinary Chair",
      },
    ],
  },
  {
    id: "GRV-2026-084",
    category: "Transport & Mess",
    subject: "Bus Route 14 timing delay at KPHB stop",
    raisedBy: "Student (Roll 23EC041)",
    date: "2026-08-01",
    committee: "Transport Committee",
    priority: "Low",
    status: "Pending",
    sla: "72 Hours",
    timeline: [
      {
        step: "Ticket Raised",
        date: "2026-08-01 08:30 AM",
        description: "Complaint submitted regarding 20 min morning delay.",
        actor: "Student 23EC041",
      },
    ],
  },
];

export const MOCK_COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    id: "COM-01",
    name: "Dr. V. K. Murthy",
    role: "Chairperson - Disciplinary Board",
    department: "Mechanical Eng",
    assignedCases: 3,
  },
  {
    id: "COM-02",
    name: "Dr. S. K. Gupta",
    role: "Member - Academic Appeals",
    department: "Computer Science",
    assignedCases: 2,
  },
  {
    id: "COM-03",
    name: "Prof. Anand Kumar",
    role: "Member - Student Welfare",
    department: "Electronics & Comm",
    assignedCases: 1,
  },
];

export const MOCK_ANTI_RAGGING_SQUAD: AntiRaggingSquadMember[] = [
  {
    id: "SQD-01",
    name: "Prof. Ramesh Chandra",
    zone: "Boys Hostel Block A & B",
    contact: "+91 98765 43210",
    status: "On Duty",
  },
  {
    id: "SQD-02",
    name: "Dr. Meenakshi S.",
    zone: "Girls Hostel Block C",
    contact: "+91 98765 43211",
    status: "On Duty",
  },
  {
    id: "SQD-03",
    name: "Prof. K. V. Rao",
    zone: "Campus Canteen & Sports Complex",
    contact: "+91 98765 43212",
    status: "Standby",
  },
];

export function fetchGrievanceTickets(
  searchQuery: string = "",
  statusFilter: string = "All Statuses",
  priorityFilter: string = "All Priorities",
): GrievanceTicket[] {
  return MOCK_GRIEVANCE_TICKETS.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.raisedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All Statuses" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "All Priorities" || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

export function fetchCommitteeMembers(): CommitteeMember[] {
  return MOCK_COMMITTEE_MEMBERS;
}

export function fetchAntiRaggingSquad(): AntiRaggingSquadMember[] {
  return MOCK_ANTI_RAGGING_SQUAD;
}

export function calculateGrievanceStats(): GrievanceKpiStats {
  const tickets = MOCK_GRIEVANCE_TICKETS;
  const pendingCount = tickets.filter((t) => t.status !== "Resolved").length;

  return {
    totalTickets: "142",
    resolvedSlaRate: "96.2%",
    pendingReviewCount: pendingCount,
    avgResolutionTime: "34 Hours",
  };
}
