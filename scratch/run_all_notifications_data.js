import { writeNotificationPage } from './build_all_dean_notifications.js';

console.log("Generating 20-30 Received & Sent notification records for ALL 8 Executive Deans...");

// ==========================================
// 1. ACADEMIC DEAN NOTIFICATIONS DATA
// ==========================================
const academicReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Academic Council Standing Committee Resolution Approval",
    "Board of Studies (BOS) R24 Curriculum Revisions Approved",
    "Annual NBA Accreditation Audit Schedule Release",
    "UGC / AICTE Teaching Load & STR Compliance Review",
    "Semester Mid-Term Question Paper Moderation Directive",
    "Slow Learners Remedial Batch Allocation Confirmation",
    "Dean's Honor Roll & Merit Scholarship Awardees List",
    "Outcome-Based Education (OBE) CO-PO Mapping Audit Passed"
  ][i % 8] + ` (Ref #${100 + i})`,
  message: `Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.`,
  sender: [
    "University Registrar Office",
    "BOS Chair Committee",
    "IQAC Executive Director",
    "Controller of Examinations",
    "Dr. Srinivas Rao (HOD CSE)",
    "Dr. Priya Sharma (HOD ECE)",
    "Dr. Ravi Kumar (HOD AI & DS)",
    "Principal Academic Office"
  ][i % 8],
  receiver: "Academic Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 10:30 AM`,
  priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Academic Governance", "Curriculum", "Accreditation", "Exam Moderation", "Student Performance"][i % 5],
  attachment: i % 2 === 0 ? `Academic_Directive_${i + 1}.pdf` : undefined
}));

const academicSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Faculty Circular: Mid-Term Exam Syllabus Coverage & Attendance Deficit",
    "Academic Calendar Released for Autumn Semester 2026",
    "Timetable Revision & Classroom Allocation Master Schedule",
    "Departmental Workload & Substitute Allocation Sanction",
    "Instructional Days & Attendance Shortage Alert Directive",
    "Course File Verification & OBE Bloom's Audit Notice",
    "Elective Course Equivalence Approval Release",
    "Annual Department Performance & API Index Submission Notice"
  ][i % 8] + ` (Circular #${200 + i})`,
  message: `Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.`,
  sender: "Academic Dean Office",
  receiver: [
    "All Department HODs & Faculty",
    "All Enrolled Engineering Students",
    "Department Timetable Coordinators",
    "BOS Executive Members",
    "Dr. Srinivas Rao (HOD CSE)",
    "Dr. Priya Sharma (HOD ECE)",
    "Dr. Ravi Kumar (HOD AI & DS)",
    "All Academic Staff"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 02:15 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Circular", "Academic Calendar", "Timetable", "Workload", "Compliance"][i % 5],
  attachment: `Circular_Doc_${i + 1}.pdf`
}));

writeNotificationPage("staff.academic-dean.notifications.tsx", "/staff/academic-dean/notifications", "Academic Dean", "ACADEMIC COMMUNICATION", academicReceived, academicSent);

// ==========================================
// 2. STUDENT DEAN NOTIFICATIONS DATA
// ==========================================
const studentReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Student Grievance Hearing Decision Submission",
    "Post-Matric Merit Scholarship Disbursement Clearance",
    "Hostel Mess Committee Infrastructure Upgrade Request",
    "Disciplinary Committee Inquiry Report Submission",
    "Annual Campus Hackathon & Cultural Fest Clearance Request",
    "Student Psychological Counselling Monthly Activity Summary",
    "Bonafide Certificate & Passport NOC Application Batch",
    "NSS Community Service Drive Permission Sanction"
  ][i % 8] + ` (Ref #${300 + i})`,
  message: `Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.`,
  sender: [
    "Student Grievance Cell",
    "State Welfare Department",
    "Hostel Chief Warden",
    "Disciplinary Committee Chair",
    "Campus Cultural Club President",
    "Dr. Lakshmi Devi (Student Counsellor)",
    "NSS Student Lead",
    "Principal Office"
  ][i % 8],
  receiver: "Student Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 11:00 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Student Welfare", "Scholarship", "Hostel", "Discipline", "Events"][i % 5],
  attachment: i % 2 === 0 ? `Student_Notice_${i + 1}.pdf` : undefined
}));

const studentSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Attendance Deficit & Condonation Shortage Warning Release",
    "Campus Dress Code & Code of Conduct Executive Circular",
    "Hostel Room Allotment & Mess Fee Payment Notification",
    "Merit Scholarship Disbursement Clearance Announcement",
    "Club Event Budget Sanction & Venue Allocation Release",
    "Student Mentoring Monthly Review Compliance Notice",
    "Bonafide & Transfer Certificate Issuance Release",
    "Sports Tournament & Inter-College Championship Advisory"
  ][i % 8] + ` (Notice #${400 + i})`,
  message: `Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.`,
  sender: "Student Dean Office",
  receiver: [
    "All Enrolled Students (5,820)",
    "Hostel Resident Students",
    "All Faculty Mentors",
    "Department HODs",
    "Student Club Presidents",
    "Grievance Committee",
    "Canteen & Hostel Staff",
    "Sports Council"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 04:30 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Condonation Alert", "Discipline", "Hostel Notice", "Events", "Scholarship"][i % 5],
  attachment: `Notice_Doc_${i + 1}.pdf`
}));

writeNotificationPage("staff.student-dean.notifications.tsx", "/staff/student-dean/notifications", "Student Dean", "STUDENT COMMUNICATION", studentReceived, studentSent);

// ==========================================
// 3. IQAC DEAN NOTIFICATIONS DATA
// ==========================================
const iqacReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "NAAC Grade A++ Peer Team Visit Audit Confirmation",
    "AQAR Annual Quality Assurance Report Data Submission",
    "NBA Accreditation Tier-1 Criteria Compliance Report",
    "Department Quality Metrics (DQM) Monthly Scorecard",
    "Internal Quality Audit Non-Conformance Closure Report",
    "Student Feedback Analytic & Action Taken Report (ATR)",
    "Quality Improvement Plan (QIP) Faculty Workshop Sanction",
    "Green Campus & Energy Audit Compliance Certificate"
  ][i % 8] + ` (Ref #${500 + i})`,
  message: `Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.`,
  sender: [
    "NAAC Steering Committee",
    "NBA National Board Secretariat",
    "Internal Audit Panel",
    "Dr. Srinivas Rao (HOD CSE)",
    "Dr. Priya Sharma (HOD ECE)",
    "Dr. Mahesh Gupta (HOD ME)",
    "Department Quality Committee",
    "Vice Chancellor Office"
  ][i % 8],
  receiver: "IQAC Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 09:45 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["NAAC Audit", "AQAR", "NBA Accreditation", "Quality Metrics", "Internal Audit"][i % 5],
  attachment: i % 2 === 0 ? `IQAC_Audit_Doc_${i + 1}.pdf` : undefined
}));

const iqacSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "IQAC Directive: AQAR Data Submission Deadline Reminder",
    "NAAC SSR Metric Documentation Final Verification Circular",
    "NBA Accreditation Mock Peer Visit Schedule Release",
    "Internal Quality Audit Action Plan & Closure Directive",
    "Department Quality Metrics Benchmark Release Q3",
    "Stakeholder Feedback Collection Circular for Autumn Term",
    "Quality Assurance Workshop for Academic & Administrative Heads",
    "Institutional Academic & Administrative Audit (AAA) Call"
  ][i % 8] + ` (Circular #${600 + i})`,
  message: `Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.`,
  sender: "IQAC Dean Office",
  receiver: [
    "All Department HODs & Accreditation Leads",
    "Academic Dean",
    "Examination Dean",
    "Finance Office",
    "Library Director",
    "Placement Office",
    "Campus Administrator",
    "Internal Quality Auditors"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 03:20 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["AQAR Directive", "NAAC Circular", "NBA Notice", "Quality Audit", "Feedback"][i % 5],
  attachment: `IQAC_Circular_${i + 1}.pdf`
}));

writeNotificationPage("staff.iqac.notifications.tsx", "/staff/iqac/notifications", "IQAC Dean", "QUALITY ASSURANCE", iqacReceived, iqacSent);

// ==========================================
// 4. IMA DEAN NOTIFICATIONS DATA
// ==========================================
const imaReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Laboratory Equipment Annual Maintenance Request",
    "Computer Science Lab 4 Server Maintenance Completion",
    "Asset Purchase Requisition Approval Submission",
    "HVAC & Electrical Substation Preventative Inspection Report",
    "Laboratory Safety & Chemical Fire Audit Certification",
    "Infrastructure Classroom Modernization Work Completion",
    "Inventory Consumables Reorder Sanction Request",
    "Vendor Maintenance SLA Compliance Evaluation"
  ][i % 8] + ` (Ref #${700 + i})`,
  message: `Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.`,
  sender: [
    "Central Computer Center Lab Incharge",
    "Mechanical Workshop Superintendent",
    "Campus Estate Officer",
    "Electrical Engineering Head",
    "Civil Infrastructure Manager",
    "Dr. Mahesh Gupta (HOD ME)",
    "Safety Inspection Officer",
    "Vendor Procurement Cell"
  ][i % 8],
  receiver: "IMA Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 10:15 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Equipment Maintenance", "Lab Inspection", "Asset Purchase", "Infrastructure", "Inventory"][i % 5],
  attachment: i % 2 === 0 ? `IMA_Asset_Report_${i + 1}.pdf` : undefined
}));

const imaSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Annual Equipment Calibration & Preventive Maintenance Schedule",
    "Lab Booking Master Schedule & Capacity Utilization Release",
    "Asset Requisition Approval Sanction Notice",
    "Infrastructure Maintenance Downtime Advisory for Block B",
    "Safety Protocol & Fire Extinguisher Inspection Directive",
    "Vendor AMC Renewal & Payment Clearance Release",
    "Laboratory Inventory Disposal & E-Waste Clearance Notice",
    "Campus Power Generator & UPS Backup Maintenance Schedule"
  ][i % 8] + ` (Notice #${800 + i})`,
  message: `Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.`,
  sender: "IMA Dean Office",
  receiver: [
    "All Department Lab Incharges",
    "Campus Estate Engineer",
    "Department HODs",
    "Finance Dean Office",
    "Vendor Technical Leads",
    "Safety Officers",
    "Central Stores Manager",
    "Academic Block Administrators"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 05:00 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Maintenance Directive", "Lab Allocation", "Asset Approval", "Downtime Advisory", "AMC Release"][i % 5],
  attachment: `IMA_Notice_${i + 1}.pdf`
}));

writeNotificationPage("staff.ima.notifications.tsx", "/staff/ima/notifications", "IMA Dean", "INFRASTRUCTURE & ASSETS", imaReceived, imaSent);

// ==========================================
// 5. RESEARCH & DEVELOPMENT DEAN NOTIFICATIONS DATA
// ==========================================
const rdReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "DST-SERB Sponsored Research Grant Sanction (₹45.0 Lacs)",
    "Scopus Indexed Journal Publication Acceptance Notice",
    "Indian Patent Granted: AI-Driven Smart Grid Controller",
    "PhD Scholar Bi-Annual Progress Review Committee Report",
    "Consultancy Project Sanction by Larsen & Toubro",
    "Startup Incubation Seed Capital Grant Approval",
    "International Conference Research Paper Presentation Clearance",
    "Research Ethics & Integrity Committee Review Passed"
  ][i % 8] + ` (Ref #${900 + i})`,
  message: `Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.`,
  sender: [
    "DST-SERB Government Project Officer",
    "Dr. Ravi Kumar (Principal Investigator)",
    "Dr. Priya Sharma (Patent Author)",
    "Indian Patent Office Secretariat",
    "Research Advisory Board",
    "Incubation Center Director",
    "Dr. Srinivas Rao (PhD Supervisor)",
    "Dean Graduate Studies"
  ][i % 8],
  receiver: "R&D Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 11:30 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Research Grant", "Publication", "Patent Granted", "PhD Review", "Incubation"][i % 5],
  attachment: i % 2 === 0 ? `RD_Sanction_Letter_${i + 1}.pdf` : undefined
}));

const rdSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Call for Sponsored Research Project Proposals (DST / SERB / AICTE)",
    "Research Incentive & Publication Reward Disbursement Clearance",
    "Patent Filing Assistance & IPR Cell Guidance Advisory",
    "PhD Viva-Voce Examination & Defense Schedule Release",
    "Institutional Seed Money Grant Awardees Announcement",
    "Scopus Repository Updating & H-Index Audit Circular",
    "Consultancy Revenue Sharing & Overhead Account Notice",
    "Annual R&D Conclave & Innovation Expo Announcement"
  ][i % 8] + ` (Circular #${1000 + i})`,
  message: `Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.`,
  sender: "R&D Dean Office",
  receiver: [
    "All PhD Supervisors & Research Faculty",
    "All Registered PhD Scholars",
    "IPR Cell Members",
    "Incubation Center Startups",
    "Department HODs",
    "Finance Dean Office",
    "Research Advisory Committee",
    "Dean Office Staff"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 02:45 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Call for Proposals", "Incentive Release", "IPR Advisory", "PhD Schedule", "Seed Grant"][i % 5],
  attachment: `RD_Circular_${i + 1}.pdf`
}));

writeNotificationPage("staff.research-development.notifications.tsx", "/staff/research-development/notifications", "Research & Development Dean", "RESEARCH & INNOVATION", rdReceived, rdSent);

// ==========================================
// 6. FINANCE DEAN NOTIFICATIONS DATA
// ==========================================
const financeReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Annual Institutional Budget Sanction Approval (₹48.5 Cr)",
    "Monthly Faculty & Staff Payroll Processing Completion",
    "Vendor Equipment Purchase Invoice Payment Approval Request",
    "Internal Financial Audit Report & Expenditure Summary",
    "Tuition Fee Collection & Default Recovery Status",
    "State Government Scholarship Fund Credit Confirmation",
    "Department Contingency Budget Requisition Approval Request",
    "Tax Deduction (TDS/PF) Statutory Compliance Certificate"
  ][i % 8] + ` (Ref #${1100 + i})`,
  message: `Official Finance Dean notification regarding annual budget allocations, payroll disbursements, vendor payments, and internal financial audits.`,
  sender: [
    "Governing Council Finance Committee",
    "Payroll Accounts Lead",
    "Internal Auditor Office",
    "Central Bank Manager",
    "Dr. Srinivas Rao (HOD CSE)",
    "State Treasury Officer",
    "Purchase & Procurement Section",
    "Tax Compliance Consultant"
  ][i % 8],
  receiver: "Finance Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 10:00 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Budget Sanction", "Payroll Processed", "Vendor Payment", "Financial Audit", "Fee Collection"][i % 5],
  attachment: i % 2 === 0 ? `Fin_Voucher_${i + 1}.pdf` : undefined
}));

const financeSent = Array.from({ length: 25 }, Tokens => ({
  id: `MSG-S${String(Tokens + 1).padStart(2, "0")}`,
  subject: [
    "Departmental Budget Allocation Release Notice FY 2025-26",
    "Monthly Faculty Salary Disbursement Confirmation",
    "Tuition Fee Payment Due Reminder for Autumn Semester",
    "Vendor Bill Submission & SLA Clearance Circular",
    "Reimbursement Claim Clearance & Travel Allowance Disbursement",
    "Financial Audit Inspection Notice for Department Accounts",
    "Student Fee Concession & Scholarship Fund Disbursement Notice",
    "End-of-Year Financial Expenditure Closure Guidelines"
  ][Tokens % 8] + ` (Notice #${1200 + Tokens})`,
  message: `Official Finance Dean broadcast notification issued to all department HODs, accounts officers, vendors, and student fee section.`,
  sender: "Finance Dean Office",
  receiver: [
    "All Department HODs & Budget Heads",
    "All Full-Time Faculty & Staff",
    "Student Fee Section",
    "Empanelled Vendors & Suppliers",
    "Internal Audit Panel",
    "Registrar Office",
    "Bank Disbursement Section",
    "Academic Dean Office"
  ][Tokens % 8],
  date: `2026-08-${String(Math.max(1, 6 - (Tokens % 6))).padStart(2, "0")} 04:00 PM`,
  priority: Tokens % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Budget Release", "Salary Notice", "Fee Due Alert", "Vendor Circular", "Audit Directive"][Tokens % 5],
  attachment: `Finance_Circular_${Tokens + 1}.pdf`
}));

writeNotificationPage("staff.finance-dean.notifications.tsx", "/staff/finance-dean/notifications", "Finance Dean", "FINANCIAL GOVERNANCE", financeReceived, financeSent);

// ==========================================
// 7. EXAMINATION DEAN NOTIFICATIONS DATA
// ==========================================
const examReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Mid-Term Examination Answer Script Valuation Completion",
    "Hall Ticket Barcode Verification Audit Passed",
    "Confidential Question Paper Submission by HOD CSE",
    "Invigilator Allocation & Hall Duty Acceptance Summary",
    "Student Revaluation & Photo-Copy Request Submissions",
    "Examination Malpractice (MPC) Hearing Committee Summary",
    "End-Semester SGPA / CGPA Result Processing Verification",
    "Degree Certificate Hologram & Gold Medalist Approval"
  ][i % 8] + ` (Ref #${1300 + i})`,
  message: `Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.`,
  sender: [
    "Chief Superintendent of Exams",
    "Dr. Srinivas Rao (HOD CSE)",
    "Dr. Priya Sharma (HOD ECE)",
    "Valuation Center Coordinator",
    "Malpractice Inquiry Committee",
    "Tabulation Officer",
    "University Exam Cell",
    "Academic Audit Lead"
  ][i % 8],
  receiver: "Examination Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 08:30 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Exam Schedule", "Hall Tickets", "Marks Submitted", "Result Published", "Revaluation"][i % 5],
  attachment: i % 2 === 0 ? `Exam_Ledger_${i + 1}.pdf` : undefined
}));

const examSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Autumn Semester Main Examination Timetable Released",
    "Hall Ticket Download Portal Activation for Eligible Students",
    "Faculty Invigilation Duty Master Allocation Notice",
    "Confidential Question Paper Upload & Moderation Directive",
    "Faculty Marks Entry & Internal Assessment Upload Deadline",
    "End-Semester Examination Result Publication Announcement",
    "Student Revaluation & Challenge Valuation Notification",
    "Exam Hall Seating Arrangement & Flying Squad Audit Notice"
  ][i % 8] + ` (Circular #${1400 + i})`,
  message: `Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.`,
  sender: "Examination Dean Office",
  receiver: [
    "All Department Exam Coordinators",
    "All Appearing Students (5,420)",
    "Faculty Invigilators",
    "Question Paper Moderators",
    "Valuation Panel",
    "Academic Dean",
    "Registrar Office",
    "Flying Squad Officers"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 01:30 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Exam Timetable", "Hall Ticket Release", "Invigilation Notice", "Result Announcement", "Revaluation Notice"][i % 5],
  attachment: `Exam_Circular_${i + 1}.pdf`
}));

writeNotificationPage("staff.examination-dean.notifications.tsx", "/staff/examination-dean/notifications", "Examination Dean", "EXAMINATION CELL", examReceived, examSent);

// ==========================================
// 8. PLACEMENT DEAN NOTIFICATIONS DATA
// ==========================================
const placementReceived = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-R${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Microsoft India On-Campus Drive Confirmation (52 LPA)",
    "Deloitte India Shortlisted Students List (14.5 LPA)",
    "TCS Ninja & Digital National Qualifier Test (NQT) Schedule",
    "Signed Corporate Offer Letters Uploaded by HR",
    "Amazon AWS Winter Internship Opportunity Clearance",
    "Recruitment Partner MoU Renewal Confirmation by Infosys",
    "Pre-Placement Talk (PPT) Venue Booking Sanction",
    "Placement Eligibility & CGPA Shortlist Verification Report"
  ][i % 8] + ` (Ref #${1500 + i})`,
  message: `Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.`,
  sender: [
    "Microsoft University Relations Lead",
    "Deloitte Talent Acquisition Team",
    "TCS Campus Recruitment Office",
    "Amazon AWS India HR",
    "Infosys Campus Lead",
    "Dr. Ananya Rao (Placement Officer)",
    "Student Placement Committee",
    "Corporate Relations Manager"
  ][i % 8],
  receiver: "Placement Dean Office",
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 11:45 AM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: i % 4 === 0 ? "Unread" : "Read",
  category: ["Corporate Drive", "Shortlist Announced", "Offer Letter", "Internship", "MoU Signed"][i % 5],
  attachment: i % 2 === 0 ? `Placement_Shortlist_${i + 1}.pdf` : undefined
}));

const placementSent = Array.from({ length: 25 }, (_, i) => ({
  id: `MSG-S${String(i + 1).padStart(2, "0")}`,
  subject: [
    "Microsoft India Placement Drive Registration Open for 2026 Batch",
    "Deloitte India Technical Round & Interview Schedule Released",
    "TCS National Qualifier Drive Instructions & Hall Ticket Release",
    "Selected Students Announcement & Offer Letter Distribution Notice",
    "Amazon AWS Internship Application Directive for B.Tech 3rd Years",
    "Pre-Placement Mock Technical Interview Schedule for CSE & ECE",
    "Corporate Resume Verification & Portfolio Upload Reminder",
    "Off-Campus Placement Opportunity Alert for Graduating Batch"
  ][i % 8] + ` (Notice #${1600 + i})`,
  message: `Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.`,
  sender: "Placement Dean Office",
  receiver: [
    "All Eligible Final Year Students (1,640)",
    "Pre-Final Year Engineering Students",
    "Department Placement Coordinators",
    "Corporate HR Partners",
    "Academic Dean Office",
    "Student Dean Office",
    "Campus Training Cell",
    "Placement Student Volunteers"
  ][i % 8],
  date: `2026-08-${String(Math.max(1, 6 - (i % 6))).padStart(2, "0")} 06:15 PM`,
  priority: i % 3 === 0 ? "High" : "Medium",
  status: "Delivered",
  category: ["Drive Registration", "Interview Schedule", "Offer Notice", "Internship Alert", "Mock Interview"][i % 5],
  attachment: `Placement_Circular_${i + 1}.pdf`
}));

writeNotificationPage("staff.placement-dean.notifications.tsx", "/staff/placement-dean/notifications", "Placement Dean", "PLACEMENT CELL", placementReceived, placementSent);

console.log("Successfully populated 20-30 Received & Sent notification records for ALL 8 Executive Deans!");
