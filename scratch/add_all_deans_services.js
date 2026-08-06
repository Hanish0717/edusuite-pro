import fs from 'fs';
import path from 'path';

const fileContent = `// Centralized Dean Data Service for All 8 Executive Dean Portals

import { getAcademicDeanDashboardData } from "./deansService.js";

// Re-export Academic Dean Service
export { getAcademicDeanDashboardData };
export type {
  AcademicKpiData,
  DepartmentRecord,
  ProgramRecord,
  FacultyRecord,
  CourseAllocationRecord,
  TimetablePeriodSlot,
  AcademicCalendarEvent,
  AcademicReportRecord,
  AcademicNotification,
  AcademicActivity,
  AcademicDeanDashboardData,
} from "./deansService.js";

// ----------------------------------------------------------------------
// 1. STUDENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface StudentRecord {
  rollNo: string;
  name: string;
  department: string;
  year: string;
  attendance: number;
  cgpa: number;
  status: "Active" | "Detained" | "Graduated";
}

export interface GrievanceRecord {
  id: string;
  student: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
}

export interface StudentDeanDashboardData {
  kpis: {
    totalStudents: number;
    avgAttendance: string;
    activeGrievances: number;
    resolvedGrievancesPct: string;
    activeClubs: number;
    hostelOccupancyPct: string;
    scholarshipsDisbursed: string;
  };
  students: StudentRecord[];
  grievances: GrievanceRecord[];
  clubs: { name: string; category: string; members: number; lead: string }[];
  hostelRooms: { block: string; totalRooms: number; occupied: number; status: string }[];
  scholarships: { name: string; amount: string; recipients: number; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getStudentDeanDashboardData(): StudentDeanDashboardData {
  return {
    kpis: {
      totalStudents: 5420,
      avgAttendance: "92.4%",
      activeGrievances: 4,
      resolvedGrievancesPct: "98.2%",
      activeClubs: 42,
      hostelOccupancyPct: "94.5%",
      scholarshipsDisbursed: "₹1.85 Cr",
    },
    students: Array.from({ length: 20 }).map((_, i) => ({
      rollNo: \`22CS\${101 + i}\`,
      name: \`Student Name \${i + 1}\`,
      department: ["CSE", "ECE", "ME", "EEE", "AI & DS"][i % 5],
      year: \`Year \${(i % 4) + 1}\`,
      attendance: 85 + (i % 14),
      cgpa: +(7.5 + (i % 25) * 0.1).toFixed(2),
      status: i % 12 === 0 ? "Detained" : "Active",
    })),
    grievances: [
      { id: "GRV-901", student: "K. Sai Teja (22CS101)", category: "Hostel Wi-Fi Bandwidth", priority: "Medium", status: "In Progress", date: "2026-08-01" },
      { id: "GRV-902", student: "Student Council", category: "Cafeteria Hygiene Audit", priority: "High", status: "Resolved", date: "2026-08-02" },
      { id: "GRV-903", student: "Research Scholars", category: "Library Night Facility", priority: "Low", status: "Resolved", date: "2026-08-03" },
      { id: "GRV-904", student: "Ananya Roy (23EC204)", category: "Sports Ground Lighting", priority: "Medium", status: "Open", date: "2026-08-04" },
    ],
    clubs: [
      { name: "Coding & Hackathon Club", category: "Technical", members: 340, lead: "Ananya Roy (CSE)" },
      { name: "Robotics & Automation Guild", category: "Technical", members: 210, lead: "K. Sai Teja (ECE)" },
      { name: "Literary & Debate Society", category: "Cultural", members: 185, lead: "Rohan Varma (ME)" },
      { name: "NSS & Community Service", category: "Social Welfare", members: 450, lead: "Priya Sundaram (EEE)" },
    ],
    hostelRooms: [
      { block: "A Block (Boys)", totalRooms: 200, occupied: 192, status: "96% Occupied" },
      { block: "B Block (Boys)", totalRooms: 180, occupied: 170, status: "94% Occupied" },
      { block: "C Block (Girls)", totalRooms: 220, occupied: 210, status: "95% Occupied" },
      { block: "D Block (Girls)", totalRooms: 150, occupied: 135, status: "90% Occupied" },
    ],
    scholarships: [
      { name: "Merit-cum-Means National Scholarship", amount: "₹50,000 / Student", recipients: 120, status: "Disbursed" },
      { name: "State Government Fee Reimbursement", amount: "₹35,000 / Student", recipients: 340, status: "Verified" },
      { name: "Alumni Endowment Excellence Fund", amount: "₹25,000 / Student", recipients: 45, status: "Approved" },
    ],
    reports: [
      { title: "Monthly Student Attendance & Shortage Report", metric: "92.4% Overall Avg", date: "2026-08-01" },
      { title: "Hostel Welfare & Discipline Audit Report", metric: "Zero Ragging Incidents", date: "2026-08-02" },
      { title: "Grievance Redressal Committee Annual Ledger", metric: "98.2% Resolution SLA", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 2. IQAC DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface IqacDashboardData {
  kpis: {
    naacScore: string;
    nbaAccreditedDepts: string;
    aqarStatus: string;
    facultyQualityIndex: string;
    auditCompletionPct: string;
  };
  naacCriteria: { id: string; criterion: string; weightage: number; score: number; status: string }[];
  qualityAudits: { id: string; dept: string; type: string; score: string; date: string }[];
  ssrMetrics: { code: string; metricName: string; target: string; current: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getIqacDashboardData(): IqacDashboardData {
  return {
    kpis: {
      naacScore: "3.78 / 4.0 (Grade A++)",
      nbaAccreditedDepts: "12 / 15 Depts",
      aqarStatus: "Submitted (2025-26)",
      facultyQualityIndex: "94.2%",
      auditCompletionPct: "98.5%",
    },
    naacCriteria: [
      { id: "C1", criterion: "Curricular Aspects", weightage: 150, score: 142, status: "Excellent" },
      { id: "C2", criterion: "Teaching-Learning and Evaluation", weightage: 350, score: 338, status: "Excellent" },
      { id: "C3", criterion: "Research, Innovations and Extension", weightage: 150, score: 139, status: "Very Good" },
      { id: "C4", criterion: "Infrastructure and Learning Resources", weightage: 100, score: 96, status: "Excellent" },
      { id: "C5", criterion: "Student Support and Progression", weightage: 100, score: 94, status: "Excellent" },
      { id: "C6", criterion: "Governance, Leadership and Management", weightage: 100, score: 95, status: "Excellent" },
      { id: "C7", criterion: "Institutional Values and Best Practices", weightage: 50, score: 48, status: "Excellent" },
    ],
    qualityAudits: [
      { id: "AUD-2026-01", dept: "CSE", type: "Academic & Administrative Audit", score: "4.85 / 5.0", date: "2026-07-15" },
      { id: "AUD-2026-02", dept: "ECE", type: "NBA Outcome Assessment Audit", score: "4.78 / 5.0", date: "2026-07-20" },
      { id: "AUD-2026-03", dept: "ME", type: "Laboratory & Safety Audit", score: "4.65 / 5.0", date: "2026-07-28" },
    ],
    ssrMetrics: [
      { code: "1.1.1", metricName: "Curriculum Design & OBE Alignment", target: "100%", current: "96.4%", status: "Achieved" },
      { code: "2.4.1", metricName: "Full-Time Faculty with Ph.D Degree", target: "80%", current: "84.2%", status: "Exceeds Target" },
      { code: "3.4.2", metricName: "SCI/Scopus Publications per Faculty", target: "2.0 / Year", current: "2.3 / Year", status: "Exceeds Target" },
    ],
    reports: [
      { title: "Annual Quality Assurance Report (AQAR 2025-26)", metric: "Clean NAAC Audit Pass", date: "2026-08-01" },
      { title: "Institutional Self Study Report (SSR Dossier)", metric: "Grade A++ Standard", date: "2026-08-03" },
    ],
  };
}

// ----------------------------------------------------------------------
// 3. IMA DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ImaDashboardData {
  kpis: {
    activeProjects: number;
    complianceScore: string;
    policyDirectives: number;
    infraBudgetUsed: string;
    assetAuditPassPct: string;
  };
  campusProjects: { name: string; budget: string; progress: number; targetDate: string }[];
  policyDirectives: { id: string; title: string; category: string; status: string }[];
  complianceAudits: { area: string; standard: string; compliance: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getImaDashboardData(): ImaDashboardData {
  return {
    kpis: {
      activeProjects: 8,
      complianceScore: "100%",
      policyDirectives: 24,
      infraBudgetUsed: "₹12.4 Cr",
      assetAuditPassPct: "99.2%",
    },
    campusProjects: [
      { name: "New Advanced AI & Supercomputing Lab Building", budget: "₹6.5 Cr", progress: 82, targetDate: "Oct 2026" },
      { name: "Solar Rooftop 500kW Green Energy Transition", budget: "₹2.2 Cr", progress: 95, targetDate: "Aug 2026" },
      { name: "Central Auditorium Acoustics & AV Upgrade", budget: "₹1.8 Cr", progress: 60, targetDate: "Nov 2026" },
      { name: "Student Innovation Incubator Center Extension", budget: "₹1.9 Cr", progress: 40, targetDate: "Dec 2026" },
    ],
    policyDirectives: [
      { id: "POL-2026-01", title: "Institutional IT Security & Cloud Governance", category: "IT Policy", status: "Active" },
      { id: "POL-2026-02", title: "Green Campus Net Zero Carbon Neutral Directive", category: "Environment", status: "Active" },
      { id: "POL-2026-03", title: "Campus Procurement & Asset Inventory Guideline", category: "Administration", status: "Under Review" },
    ],
    complianceAudits: [
      { area: "Fire & Campus Safety", standard: "NFPA Compliance", compliance: "100%", status: "Certified" },
      { area: "Electrical & Substation", standard: "IEEE Safety Standard", compliance: "100%", status: "Certified" },
      { area: "Waste & Sewage Treatment", standard: "State PCB Norms", compliance: "98.5%", status: "Compliant" },
    ],
    reports: [
      { title: "Master Infrastructure Masterplan Progress Report", metric: "8 Active Projects", date: "2026-08-01" },
      { title: "Institutional Compliance & Governance Ledger", metric: "100% Compliance Pass", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 4. RESEARCH & DEVELOPMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ResearchDevelopmentDashboardData {
  kpis: {
    totalGrantFunds: string;
    publishedPapers: number;
    patentsFiled: number;
    activePhdScholars: number;
    incubationStartups: number;
  };
  topGrants: { title: string; agency: string; amount: string; status: string }[];
  publications: { title: string; journal: string; impactFactor: string; authors: string }[];
  patents: { title: string; patentNo: string; filingDate: string; status: string }[];
  phdScholars: { name: string; dept: string; guide: string; topic: string; year: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getResearchDevelopmentDashboardData(): ResearchDevelopmentDashboardData {
  return {
    kpis: {
      totalGrantFunds: "₹4.85 Cr",
      publishedPapers: 142,
      patentsFiled: 18,
      activePhdScholars: 86,
      incubationStartups: 12,
    },
    topGrants: [
      { title: "DST SERB: Quantum Machine Learning for Edge Devices", agency: "DST SERB", amount: "₹85.0 Lakhs", status: "Active" },
      { title: "ISRO RESPOND: Satellite Image Segmentation with Deep Learning", agency: "ISRO", amount: "₹62.5 Lakhs", status: "Active" },
      { title: "AICTE IDEA Lab Industry Collaboration Grant", agency: "AICTE", amount: "₹50.0 Lakhs", status: "Approved" },
      { title: "MeitY Microelectronics Fabrication Research Project", agency: "MeitY", amount: "₹1.2 Cr", status: "Under Review" },
    ],
    publications: [
      { title: "Deep Transformer Networks for Medical Image Diagnostics", journal: "IEEE Transactions on Medical Imaging", impactFactor: "10.6", authors: "Dr. S. K. Gupta et al." },
      { title: "Smart Grid Load Forecasting via Hybrid LSTM Networks", journal: "Elsevier Energy Conversion", impactFactor: "8.9", authors: "Dr. R. Karthik et al." },
      { title: "Graphene Nanocomposites for Aerospace Structural Components", journal: "Nature Materials Today", impactFactor: "12.4", authors: "Dr. Rajeshwar Rao et al." },
    ],
    patents: [
      { title: "AI-Powered Non-Invasive Blood Glucose Sensor Device", patentNo: "IN-2026110948", filingDate: "2026-03-12", status: "Published" },
      { title: "Self-Healing Solar Panel Coating Material", patentNo: "IN-2026110982", filingDate: "2026-05-18", status: "Under Examination" },
    ],
    phdScholars: [
      { name: "Praveen Kumar", dept: "CSE", guide: "Dr. S. K. Gupta", topic: "Federated Learning Privacy Models", year: "Year 3" },
      { name: "Sneha Reddy", dept: "ECE", guide: "Dr. Meera Rao", topic: "5G mmWave Beamforming Algorithms", year: "Year 2" },
    ],
    reports: [
      { title: "Annual Institutional Research & Journal Publication Compendium", metric: "142 SCI/Scopus Papers", date: "2026-08-01" },
      { title: "Sponsored Research Grants & DST Funding Audit Ledger", metric: "₹4.85 Cr Total Grants", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 5. FINANCE DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface FinanceDeanDashboardData {
  kpis: {
    totalBudget: string;
    disbursedFunds: string;
    pendingFeeDues: string;
    auditPassStatus: string;
    payrollDisbursedPct: string;
  };
  deptBudgets: { dept: string; allocated: string; spent: string; percentage: number }[];
  feeCollections: { category: string; expected: string; collected: string; pending: string }[];
  expenseLedger: { id: string; category: string; amount: string; date: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getFinanceDeanDashboardData(): FinanceDeanDashboardData {
  return {
    kpis: {
      totalBudget: "₹48.5 Cr",
      disbursedFunds: "₹36.2 Cr",
      pendingFeeDues: "₹1.4 Cr",
      auditPassStatus: "Clean Audit Pass (FY26)",
      payrollDisbursedPct: "100%",
    },
    deptBudgets: [
      { dept: "CSE & AI Labs", allocated: "₹8.5 Cr", spent: "₹7.2 Cr", percentage: 84.7 },
      { dept: "ECE Robotics & VLSI", allocated: "₹6.8 Cr", spent: "₹5.9 Cr", percentage: 86.7 },
      { dept: "Mechanical & CAD Labs", allocated: "₹5.2 Cr", spent: "₹4.5 Cr", percentage: 86.5 },
      { dept: "Library Digital Resources", allocated: "₹3.0 Cr", spent: "₹2.8 Cr", percentage: 93.3 },
      { dept: "R&D Seed Grants", allocated: "₹2.5 Cr", spent: "₹2.1 Cr", percentage: 84.0 },
    ],
    feeCollections: [
      { category: "Tuition Fee Autumn 2026", expected: "₹24.0 Cr", collected: "₹23.1 Cr", pending: "₹90 Lakhs" },
      { category: "Hostel & Mess Fee", expected: "₹6.5 Cr", collected: "₹6.1 Cr", pending: "₹40 Lakhs" },
      { category: "Transport & Bus Fee", expected: "₹2.2 Cr", collected: "₹2.1 Cr", pending: "₹10 Lakhs" },
    ],
    expenseLedger: [
      { id: "EXP-2026-901", category: "Faculty Monthly Payroll (July 2026)", amount: "₹2.85 Cr", date: "2026-08-01", status: "Paid" },
      { id: "EXP-2026-902", category: "Supercomputing Server Hardware Upgrade", amount: "₹45.0 Lakhs", date: "2026-08-02", status: "Approved" },
    ],
    reports: [
      { title: "Institutional Annual Financial Budget & Balance Sheet 2026", metric: "Clean Statutory Audit", date: "2026-08-01" },
      { title: "Department Budget Utilization & Expenditure Audit", metric: "88.4% Average Utilization", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 6. EXAMINATION DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface ExaminationDeanDashboardData {
  kpis: {
    examsScheduled: number;
    hallTicketsIssued: number;
    revaluationRequests: number;
    avgResultDays: number;
    passPercentage: string;
  };
  examSchedules: { code: string; subject: string; date: string; session: string; students: number }[];
  revaluations: { id: string; student: string; subject: string; currentGrade: string; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getExaminationDeanDashboardData(): ExaminationDeanDashboardData {
  return {
    kpis: {
      examsScheduled: 184,
      hallTicketsIssued: 4850,
      revaluationRequests: 14,
      avgResultDays: 14,
      passPercentage: "92.6%",
    },
    examSchedules: [
      { code: "CS401", subject: "Deep Learning & Neural Networks", date: "2026-08-18", session: "Morning (09:30 AM)", students: 420 },
      { code: "EC304", subject: "VLSI Design & Embedded Systems", date: "2026-08-19", session: "Afternoon (02:00 PM)", students: 380 },
      { code: "EE202", subject: "Power Electronics & Smart Grids", date: "2026-08-20", session: "Morning (09:30 AM)", students: 260 },
      { code: "ME305", subject: "Finite Element Analysis", date: "2026-08-21", session: "Afternoon (02:00 PM)", students: 310 },
    ],
    revaluations: [
      { id: "REV-2026-01", student: "K. Sai Teja (22CS101)", subject: "CS401 Deep Learning", currentGrade: "B+", status: "Under Review" },
      { id: "REV-2026-02", student: "Ananya Roy (22EC104)", subject: "EC304 VLSI Design", currentGrade: "A", status: "Grade Updated" },
    ],
    reports: [
      { title: "Controller of Examinations Annual Result Analysis Report", metric: "92.6% Pass Rate", date: "2026-08-01" },
      { title: "Hall Ticket Dispatch & Attendance SLA Audit", metric: "100% On-Time Generation", date: "2026-08-04" },
    ],
  };
}

// ----------------------------------------------------------------------
// 7. PLACEMENT DEAN DATA TYPES & PROVIDER
// ----------------------------------------------------------------------
export interface PlacementDeanDashboardData {
  kpis: {
    placementRate: string;
    highestPackage: string;
    averagePackage: string;
    drivesCompleted: number;
    activeMoUs: number;
  };
  topRecruiters: { company: string; offers: number; package: string; tier: string }[];
  placementDrives: { company: string; driveDate: string; eligibleStudents: number; status: string }[];
  reports: { title: string; metric: string; date: string }[];
}

export function getPlacementDeanDashboardData(): PlacementDeanDashboardData {
  return {
    kpis: {
      placementRate: "92.6%",
      highestPackage: "₹44.5 LPA",
      averagePackage: "₹11.8 LPA",
      drivesCompleted: 78,
      activeMoUs: 42,
    },
    topRecruiters: [
      { company: "Google Cloud India", offers: 18, package: "₹44.5 LPA", tier: "Dream Tier 1" },
      { company: "Microsoft R&D", offers: 24, package: "₹38.0 LPA", tier: "Dream Tier 1" },
      { company: "Qualcomm India", offers: 32, package: "₹26.5 LPA", tier: "Tier 1" },
      { company: "Amazon AWS", offers: 28, package: "₹32.0 LPA", tier: "Dream Tier 1" },
      { company: "Deloitte Digital", offers: 64, package: "₹14.0 LPA", tier: "Mass Recruiter" },
    ],
    placementDrives: [
      { company: "Google Cloud India Drive", driveDate: "2026-08-12", eligibleStudents: 240, status: "Scheduled" },
      { company: "Microsoft Campus Recruitment", driveDate: "2026-08-20", eligibleStudents: 310, status: "Registration Open" },
      { company: "Qualcomm VLSI Placement Drive", driveDate: "2026-08-25", eligibleStudents: 180, status: "Shortlisting" },
    ],
    reports: [
      { title: "Executive Placement & Corporate Recruiting Statistics 2026", metric: "92.6% Placement Rate", date: "2026-08-01" },
      { title: "Tier-1 Corporate MoU & Industry Cell Report", metric: "42 Active Corporate MoUs", date: "2026-08-04" },
    ],
  };
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/lib/deansService.ts'), fileContent, 'utf8');
console.log('src/lib/deansService.ts updated with data for all 8 Deans');
