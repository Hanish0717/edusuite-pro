export {
  getAcademicDeanDashboardData,
  getStudentDeanDashboardData,
  getIqacDashboardData,
  getImaDashboardData,
  getResearchDevelopmentDashboardData,
  getFinanceDeanDashboardData,
  getExaminationDeanDashboardData,
  getPlacementDeanDashboardData,
} from "@/lib/deansService";
export type {
  AcademicDeanDashboardData,
  StudentDeanDashboardData,
  IqacDashboardData,
  ImaDashboardData,
  ResearchDevelopmentDashboardData,
  FinanceDeanDashboardData,
  ExaminationDeanDashboardData,
  PlacementDeanDashboardData,
} from "@/lib/deansService";



export interface DeanCardInfo {
  id: string;
  title: string;
  shortTitle: string;
  route: string;
  iconName: string;
  badge: string;
  badgeTone: "success" | "info" | "warning" | "purple" | "rose";
  description: string;
  leadPerson: string;
  primaryMetric: { label: string; value: string };
  secondaryMetric: { label: string; value: string };
  tags: string[];
}

export const ALL_DEAN_PORTALS: DeanCardInfo[] = [
  {
    id: "academic-dean",
    title: "Academic Dean",
    shortTitle: "Academics",
    route: "/staff/academic-dean",
    iconName: "GraduationCap",
    badge: "Academics & OBE",
    badgeTone: "success",
    description: "Academic leadership, outcome-based education (OBE), course regulations, curriculum audits, and faculty performance.",
    leadPerson: "Prof. Anand Kumar",
    primaryMetric: { label: "Curriculum Readiness", value: "94.8%" },
    secondaryMetric: { label: "Audit Score", value: "4.85 / 5" },
    tags: ["Syllabus", "OBE Audit", "Regulations", "Course Catalog"],
  },
  {
    id: "student-dean",
    title: "Student Dean",
    shortTitle: "Student Affairs",
    route: "/staff/student-dean",
    iconName: "Users",
    badge: "Student Affairs",
    badgeTone: "info",
    description: "Student welfare, grievance redressal, discipline committees, cultural & technical clubs, and hostel mess monitoring.",
    leadPerson: "Dr. Sunita Sharma",
    primaryMetric: { label: "Grievances Resolved", value: "98.2%" },
    secondaryMetric: { label: "Active Student Clubs", value: "42 Clubs" },
    tags: ["Discipline", "Clubs", "Welfare", "Anti-Ragging"],
  },
  {
    id: "iqac",
    title: "IQAC Dean",
    shortTitle: "IQAC Quality",
    route: "/staff/iqac",
    iconName: "BadgeCheck",
    badge: "NAAC A++ Quality",
    badgeTone: "purple",
    description: "Internal Quality Assurance Cell (IQAC), NAAC/NBA accreditation filings, AQAR submission, and quality benchmarks.",
    leadPerson: "Dr. K. V. R. Prasad",
    primaryMetric: { label: "NAAC CGPA Target", value: "3.78 / 4" },
    secondaryMetric: { label: "AQAR Criteria Complete", value: "7 / 7" },
    tags: ["NAAC A++", "NBA Audit", "AQAR Filing", "SSR Metrics"],
  },
  {
    id: "ima",
    title: "IMA Dean",
    shortTitle: "IMA Admin",
    route: "/staff/ima",
    iconName: "Building2",
    badge: "Governance & Admin",
    badgeTone: "warning",
    description: "Institutional Management & Administration, infrastructure projects, policy directives, and governance compliance.",
    leadPerson: "Prof. Rajeshwar Rao",
    primaryMetric: { label: "Infrastructure Readiness", value: "96.5%" },
    secondaryMetric: { label: "Policy Compliance", value: "100%" },
    tags: ["Governance", "Infrastructure", "Regulatory", "Policies"],
  },
  {
    id: "research-development",
    title: "Research & Development Dean",
    shortTitle: "R&D Research",
    route: "/staff/research-development",
    iconName: "TrendingUp",
    badge: "R&D & Grants",
    badgeTone: "success",
    description: "Sponsored research projects, DST/SERB funding, SCI/Scopus journal papers, IPR/Patent filings, and research labs.",
    leadPerson: "Dr. Vikramaditya Reddy",
    primaryMetric: { label: "Total Research Grants", value: "₹4.85 Cr" },
    secondaryMetric: { label: "SCI Papers (2026)", value: "142 Published" },
    tags: ["SCI Papers", "Patents", "DST Funding", "IPR Cell"],
  },
  {
    id: "finance-dean",
    title: "Finance Dean",
    shortTitle: "Finance",
    route: "/staff/finance-dean",
    iconName: "Wallet",
    badge: "Budget & Accounts",
    badgeTone: "info",
    description: "Institutional financial planning, departmental budget allocation, research grant disbursements, and audit logs.",
    leadPerson: "CA Ramesh Agrawal",
    primaryMetric: { label: "Budget Utilization", value: "88.4%" },
    secondaryMetric: { label: "Audit Clearance", value: "Clean Pass" },
    tags: ["Budget", "Grant Audit", "CapEx", "Fee Allocations"],
  },
  {
    id: "examination-dean",
    title: "Examination Dean",
    shortTitle: "Examinations",
    route: "/staff/examination-dean",
    iconName: "FileSpreadsheet",
    badge: "Exam Controller",
    badgeTone: "rose",
    description: "Controller of Examinations operations, hall tickets dispatch, grade moderation, answer key audits, and result publishing.",
    leadPerson: "Dr. P. V. Ramana",
    primaryMetric: { label: "Result Publish SLA", value: "14 Days" },
    secondaryMetric: { label: "Hall Ticket Generation", value: "100%" },
    tags: ["Hall Tickets", "Moderation", "Revaluation", "Transcripts"],
  },
  {
    id: "placement-dean",
    title: "Placement Dean",
    shortTitle: "Placements",
    route: "/staff/placement-dean",
    iconName: "Briefcase",
    badge: "Corporate & TPO",
    badgeTone: "success",
    description: "Corporate relations, tier-1 recruiting partners, placement drives, salary packages, and industrial MoUs.",
    leadPerson: "Prof. Srikant Verma",
    primaryMetric: { label: "Placement Rate", value: "92.6%" },
    secondaryMetric: { label: "Highest CTC", value: "₹44.5 LPA" },
    tags: ["Recruitment", "Highest CTC", "Tier-1 MoUs", "Internships"],
  },
];

// --- Mock Stats for Each Dean ---

export interface AcademicDeanMetrics {
  stats: {
    curriculumReadiness: string;
    obeAttainment: string;
    activeCourses: number;
    auditScore: string;
  };
  syllabusCoverage: { dept: string; coverage: number; status: string }[];
  pendingApprovals: { id: string; title: string; category: string; submittedBy: string }[];
}

export interface StudentDeanMetrics {
  stats: {
    activeGrievances: number;
    resolvedRate: string;
    activeClubs: number;
    hostelOccupancy: string;
  };
  studentClubs: { name: string; category: string; members: number; lead: string }[];
  recentGrievances: { id: string; category: string; student: string; priority: string; status: string }[];
}

export interface IqacMetrics {
  stats: {
    naacScore: string;
    nbaAccreditedDepts: string;
    aqarStatus: string;
    facultyQualityIndex: string;
  };
  naacCriteria: { id: string; criterion: string; weightage: number; currentScore: number; status: string }[];
}

export interface ImaMetrics {
  stats: {
    activeProjects: number;
    complianceScore: string;
    policyDirectives: number;
    infraBudgetUsed: string;
  };
  campusProjects: { name: string; budget: string; progress: number; targetDate: string }[];
}

export interface ResearchDevelopmentMetrics {
  stats: {
    totalGrantFunds: string;
    publishedPapers: number;
    patentsFiled: number;
    activePhdScholars: number;
  };
  topGrants: { title: string; agency: string; amount: string; status: string }[];
}

export interface FinanceDeanMetrics {
  stats: {
    totalBudget: string;
    disbursedFunds: string;
    pendingFeeDues: string;
    auditPassStatus: string;
  };
  deptBudgets: { dept: string; allocated: string; spent: string; percentage: number }[];
}

export interface ExaminationDeanMetrics {
  stats: {
    examsScheduled: number;
    hallTicketsIssued: number;
    revaluationRequests: number;
    avgResultDays: number;
  };
  examSchedules: { code: string; subject: string; date: string; session: string; students: number }[];
}

export interface PlacementDeanMetrics {
  stats: {
    placementRate: string;
    highestPackage: string;
    averagePackage: string;
    drivesCompleted: number;
  };
  topRecruiters: { company: string; offers: number; package: string; tier: string }[];
}

export function fetchAcademicDeanData(): AcademicDeanMetrics {
  return {
    stats: {
      curriculumReadiness: "94.8%",
      obeAttainment: "89.2%",
      activeCourses: 284,
      auditScore: "4.85 / 5.0",
    },
    syllabusCoverage: [
      { dept: "Computer Science (CSE)", coverage: 96, status: "On Schedule" },
      { dept: "Electronics & Comm (ECE)", coverage: 92, status: "On Schedule" },
      { dept: "Electrical Eng (EEE)", coverage: 88, status: "Review Needed" },
      { dept: "Mechanical Eng (ME)", coverage: 94, status: "On Schedule" },
      { dept: "Civil Engineering (CE)", coverage: 90, status: "On Schedule" },
    ],
    pendingApprovals: [
      { id: "AP-2026-081", title: "R24 Curriculum OBE Framework Revision", category: "Curriculum", submittedBy: "Dr. S. K. Gupta (HOD CSE)" },
      { id: "AP-2026-082", title: "New M.Tech AI & Data Science Specialization", category: "New Course", submittedBy: "Dr. R. K. Sharma (Academic Council)" },
      { id: "AP-2026-083", title: "Credit Transfer Equivalence for Foreign Exchange", category: "Credit Transfer", submittedBy: "International Office" },
    ],
  };
}

export function fetchStudentDeanData(): StudentDeanMetrics {
  return {
    stats: {
      activeGrievances: 4,
      resolvedRate: "98.2%",
      activeClubs: 42,
      hostelOccupancy: "94.5%",
    },
    studentClubs: [
      { name: "Coding & Hackathon Club", category: "Technical", members: 340, lead: "Ananya Roy (CSE)" },
      { name: "Robotics & Automation Guild", category: "Technical", members: 210, lead: "K. Sai Teja (ECE)" },
      { name: "Literary & Debate Society", category: "Cultural", members: 185, lead: "Rohan Varma (ME)" },
      { name: "NSS & Community Service", category: "Social Welfare", members: 450, lead: "Priya Sundaram (EEE)" },
    ],
    recentGrievances: [
      { id: "GRV-901", category: "Hostel Wi-Fi Speed", student: "K. Sai Teja (22CS101)", priority: "Medium", status: "In Progress" },
      { id: "GRV-902", category: "Cafeteria Hygiene Audit", student: "Student Council", priority: "High", status: "Resolved" },
      { id: "GRV-903", category: "Library Extended Hours Request", student: "Research Scholars", priority: "Low", status: "Approved" },
    ],
  };
}

export function fetchIqacData(): IqacMetrics {
  return {
    stats: {
      naacScore: "3.78 / 4.0 (Grade A++)",
      nbaAccreditedDepts: "6 / 7 Depts",
      aqarStatus: "Submitted (2025-26)",
      facultyQualityIndex: "94.2%",
    },
    naacCriteria: [
      { id: "C1", criterion: "Curricular Aspects", weightage: 150, currentScore: 142, status: "Excellent" },
      { id: "C2", criterion: "Teaching-Learning and Evaluation", weightage: 350, currentScore: 338, status: "Excellent" },
      { id: "C3", criterion: "Research, Innovations and Extension", weightage: 150, currentScore: 139, status: "Very Good" },
      { id: "C4", criterion: "Infrastructure and Learning Resources", weightage: 100, currentScore: 96, status: "Excellent" },
      { id: "C5", criterion: "Student Support and Progression", weightage: 100, currentScore: 94, status: "Excellent" },
      { id: "C6", criterion: "Governance, Leadership and Management", weightage: 100, currentScore: 95, status: "Excellent" },
      { id: "C7", criterion: "Institutional Values and Best Practices", weightage: 50, currentScore: 48, status: "Excellent" },
    ],
  };
}

export function fetchImaData(): ImaMetrics {
  return {
    stats: {
      activeProjects: 8,
      complianceScore: "100%",
      policyDirectives: 24,
      infraBudgetUsed: "₹12.4 Cr",
    },
    campusProjects: [
      { name: "New Advanced AI & Supercomputing Lab Building", budget: "₹6.5 Cr", progress: 82, targetDate: "Oct 2026" },
      { name: "Solar Rooftop 500kW Green Energy Transition", budget: "₹2.2 Cr", progress: 95, targetDate: "Aug 2026" },
      { name: "Central Auditorium Acoustics & AV Upgrade", budget: "₹1.8 Cr", progress: 60, targetDate: "Nov 2026" },
      { name: "Student Innovation Incubator Center Extension", budget: "₹1.9 Cr", progress: 40, targetDate: "Dec 2026" },
    ],
  };
}

export function fetchResearchDevelopmentData(): ResearchDevelopmentMetrics {
  return {
    stats: {
      totalGrantFunds: "₹4.85 Cr",
      publishedPapers: 142,
      patentsFiled: 18,
      activePhdScholars: 86,
    },
    topGrants: [
      { title: "DST SERB: Quantum Machine Learning for Edge Devices", agency: "DST SERB", amount: "₹85.0 Lakhs", status: "Active" },
      { title: "ISRO RESPOND: Satellite Image Segmentation with Deep Learning", agency: "ISRO", amount: "₹62.5 Lakhs", status: "Active" },
      { title: "AICTE IDEA Lab Industry Collaboration Grant", agency: "AICTE", amount: "₹50.0 Lakhs", status: "Approved" },
      { title: "MeitY Microelectronics Fabrication Research Project", agency: "MeitY", amount: "₹1.2 Cr", status: "Under Review" },
    ],
  };
}

export function fetchFinanceDeanData(): FinanceDeanMetrics {
  return {
    stats: {
      totalBudget: "₹48.5 Cr",
      disbursedFunds: "₹36.2 Cr",
      pendingFeeDues: "₹1.4 Cr",
      auditPassStatus: "Clean Pass (FY 2025-26)",
    },
    deptBudgets: [
      { dept: "CSE & AI Labs", allocated: "₹8.5 Cr", spent: "₹7.2 Cr", percentage: 84.7 },
      { dept: "ECE Robotics & VLSI", allocated: "₹6.8 Cr", spent: "₹5.9 Cr", percentage: 86.7 },
      { dept: "Mechanical & CAD Labs", allocated: "₹5.2 Cr", spent: "₹4.5 Cr", percentage: 86.5 },
      { dept: "Library Digital Resources", allocated: "₹3.0 Cr", spent: "₹2.8 Cr", percentage: 93.3 },
      { dept: "R&D Seed Grants", allocated: "₹2.5 Cr", spent: "₹2.1 Cr", percentage: 84.0 },
    ],
  };
}

export function fetchExaminationDeanData(): ExaminationDeanMetrics {
  return {
    stats: {
      examsScheduled: 184,
      hallTicketsIssued: 4850,
      revaluationRequests: 14,
      avgResultDays: 14,
    },
    examSchedules: [
      { code: "CS401", subject: "Deep Learning & Neural Networks", date: "2026-08-18", session: "Morning (09:30 AM)", students: 420 },
      { code: "EC304", subject: "VLSI Design & Embedded Systems", date: "2026-08-19", session: "Afternoon (02:00 PM)", students: 380 },
      { code: "EE202", subject: "Power Electronics & Smart Grids", date: "2026-08-20", session: "Morning (09:30 AM)", students: 260 },
      { code: "ME305", subject: "Finite Element Analysis", date: "2026-08-21", session: "Afternoon (02:00 PM)", students: 310 },
    ],
  };
}

export function fetchPlacementDeanData(): PlacementDeanMetrics {
  return {
    stats: {
      placementRate: "92.6%",
      highestPackage: "₹44.5 LPA",
      averagePackage: "₹11.8 LPA",
      drivesCompleted: 78,
    },
    topRecruiters: [
      { company: "Google Cloud India", offers: 18, package: "₹44.5 LPA", tier: "Dream Tier 1" },
      { company: "Microsoft R&D", offers: 24, package: "₹38.0 LPA", tier: "Dream Tier 1" },
      { company: "Qualcomm India", offers: 32, package: "₹26.5 LPA", tier: "Tier 1" },
      { company: "Amazon AWS", offers: 28, package: "₹32.0 LPA", tier: "Dream Tier 1" },
      { company: "Deloitte Digital", offers: 64, package: "₹14.0 LPA", tier: "Mass Recruiter" },
    ],
  };
}

export const getAcademicDeanData = fetchAcademicDeanData;
export const getStudentDeanData = fetchStudentDeanData;
export const getIQACData = fetchIqacData;
export const getIMAData = fetchImaData;
export const getResearchDeanData = fetchResearchDevelopmentData;
export const getFinanceDeanData = fetchFinanceDeanData;
export const getExaminationDeanData = fetchExaminationDeanData;
export const getPlacementDeanData = fetchPlacementDeanData;
