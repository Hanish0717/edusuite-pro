import { writeInteractivePage } from './upgrade_all_deans_interactivity.js';

console.log("Upgrading subpages for remaining 7 executive Deans (Student, IQAC, IMA, R&D, Finance, Exam, Placement)...");

// ==========================================
// 2. STUDENT DEAN SUBPAGES
// ==========================================
writeInteractivePage("staff.student-dean.discipline.tsx", "/staff/student-dean/discipline", "Student Dean", "Discipline Management", "Campus student discipline records, disciplinary committee hearings, and warnings.", "STUDENT WELFARE", [{ label: "Discipline Cases", val: "12 Cases" }, { label: "Hearings Conducted", val: "10 Hearings" }, { label: "Resolved", val: "100%" }, { label: "Status", val: "Active" }], ["Case Ref", "Student Name", "Roll Number", "Department", "Incident Type", "Committee Action", "Status"], `[
  { ref: "DISC-2026-01", name: "R. Dinesh", roll: "22ME114", dept: "Mechanical", type: "Campus Dress Code Violation", action: "Official Warning Letter", status: "Resolved" }
]`);

writeInteractivePage("staff.student-dean.counselling.tsx", "/staff/student-dean/counselling", "Student Dean", "Counselling Services", "Student psychological & academic counselling sessions led by campus counsellors.", "STUDENT WELFARE", [{ label: "Counselling Sessions", val: "48 Sessions" }, { label: "Students Counselled", val: "36 Students" }, { label: "Satisfaction", val: "4.9 / 5.0" }, { label: "Status", val: "Active" }], ["Session ID", "Student Name", "Department", "Counsellor Name", "Session Scope", "Follow-up Date", "Status"], `[
  { id: "CNS-2026-09", name: "Sai Kiran", dept: "Mechanical", counsellor: "Dr. Lakshmi Devi (Student Counsellor)", scope: "Academic Stress Management", follow: "2026-08-20", status: "Completed" }
]`);

writeInteractivePage("staff.student-dean.clubs-events.tsx", "/staff/student-dean/clubs-events", "Student Dean", "Clubs & Events", "Student clubs, campus cultural fests, hackathons, and extracurricular event logs.", "CLUBS & ACTIVITIES", [{ label: "Registered Clubs", val: "24 Clubs" }, { label: "Events Organized", val: "42 Events" }, { label: "Budget Approved", val: "₹18.5 Lacs" }, { label: "Status", val: "Active" }], ["Club Name", "Event Title", "Faculty Coordinator", "Event Date", "Venue / Campus", "Budget Sanctioned", "Status"], `[
  { club: "Coding Club & ACM", title: "Hackathon 2026", coord: "Dr. Srinivas Rao", date: "2026-08-25", venue: "Main Auditorium", budget: "₹2.5 Lacs", status: "Approved" }
]`);

writeInteractivePage("staff.student-dean.student-activities.tsx", "/staff/student-dean/student-activities", "Student Dean", "Student Activities", "Sports events, NCC/NSS camps, social service drives, and intra-college tournaments.", "CLUBS & ACTIVITIES", [{ label: "Active Activities", val: "18 Drives" }, { label: "Participants", val: "1,240 Students" }, { label: "NSS Hours Logged", val: "2,400 Hours" }, { label: "Status", val: "Active" }], ["Activity Title", "Category", "Student Lead", "Event Date", "Participants Count", "Status"], `[
  { title: "Annual Blood Donation & Health Camp", cat: "NSS & Community Service", lead: "Akhila Devi (22CS109)", date: "2026-08-10", count: "480 Donors", status: "Active" }
]`);

writeInteractivePage("staff.student-dean.mentoring.tsx", "/staff/student-dean/mentoring", "Student Dean", "Student Mentoring", "Faculty-student mentoring system, mentor allocation rosters, and monthly mentor logs.", "STUDENT WELFARE", [{ label: "Faculty Mentors", val: "245 Mentors" }, { label: "Mentee Ratio", val: "1:15 Mentees" }, { label: "Monthly Reviews", val: "98.5%" }, { label: "Status", val: "Active" }], ["Mentor Faculty Name", "Department", "Assigned Mentees Count", "Last Review Date", "Mentoring Progress", "Status"], `[
  { name: "Dr. Ravi Kumar", dept: "AI & DS", count: "15 Mentees (22CS101-115)", date: "2026-08-01", prog: "100% Monthly Reviews Completed", status: "Active" }
]`);

writeInteractivePage("staff.student-dean.student-requests.tsx", "/staff/student-dean/student-requests", "Student Dean", "Student Requests", "Student Bonafide certificate requests, bus pass NOCs, and leave permission requests.", "SERVICES & NOC", [{ label: "Requests Mtd", val: "240 Requests" }, { label: "Approved SLA", val: "99.0%" }, { label: "Pending Review", val: "4 Requests" }, { label: "Status", val: "Active" }], ["Req Ref", "Student Name", "Roll Number", "Request Type", "Submission Date", "Approval Status", "Status"], `[
  { ref: "REQ-2026-801", name: "Rahul Sharma", roll: "22CS101", type: "Bonafide Certificate for Passport", date: "2026-08-04", app: "Approved by Dean", status: "Approved" }
]`);

writeInteractivePage("staff.student-dean.certificates.tsx", "/staff/student-dean/certificates", "Student Dean", "Certificates", "Issuance of Conduct, Transfer, Study & Character certificates for graduating batches.", "SERVICES & NOC", [{ label: "Certificates Issued", val: "1,240 Certificates" }, { label: "Digital Hologram", val: "Embedded" }, { label: "SLA Clearance", val: "100%" }, { label: "Status", val: "Active" }], ["Certificate ID", "Student Name", "Roll Number", "Certificate Category", "Issue Date", "Status"], `[
  { id: "CERT-TC-2026-01", name: "Rahul Sharma", roll: "22CS101", cat: "Conduct & Character Certificate", date: "2026-08-04", status: "Issued" }
]`);

writeInteractivePage("staff.student-dean.attendance-history.tsx", "/staff/student-dean/attendance-history", "Student Dean", "Attendance History", "Historical student attendance archives, monthly percentage trends, and condonation lists.", "REPORTS & HISTORY", [{ label: "Historical Terms", val: "8 Terms" }, { label: "Attendance Pass Rate", val: "96.5%" }, { label: "Audit Clearance", val: "Passed" }, { label: "Status", val: "Archived" }], ["Academic Term", "Department", "Total Students Mapped", "Condonation Count", "Average Attendance %", "Status"], `[
  { term: "Autumn 2025", dept: "CSE", total: "1,240 Students", cond: "18 Students", avg: "92.4% Average", status: "Verified" }
]`);

writeInteractivePage("staff.student-dean.student-reports.tsx", "/staff/student-dean/student-reports", "Student Dean", "Student Reports", "Student welfare statistics, grievance resolution metrics, and hostel occupancy reports.", "REPORTS & HISTORY", [{ label: "Reports Archived", val: "16 Reports" }, { label: "Audit Clearance", val: "100%" }, { label: "Compliance Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Student Welfare & Campus Amenities Audit Report 2025-26", scope: "Entire Campus", date: "2026-08-01", status: "Verified" }
]`);

writeInteractivePage("staff.student-dean.attendance-reports.tsx", "/staff/student-dean/attendance-reports", "Student Dean", "Attendance Reports", "Student condonation fee collection and attendance shortage reports.", "REPORTS & HISTORY", [{ label: "Attendance Pass", val: "96.2%" }, { label: "Condonation Collected", val: "₹1.45 Lacs" }, { label: "Shortage Rate", val: "3.8%" }, { label: "Status", val: "Verified" }], ["Report Title", "Average Attendance", "Condonation Cases", "Status"], `[
  { title: "Semester Student Attendance Deficit & Condonation Fee Audit Report", avg: "91.2% Attendance", cond: "24 Condonation Cases", status: "Verified" }
]`);

writeInteractivePage("staff.student-dean.scholarship-reports.tsx", "/staff/student-dean/scholarship-reports", "Student Dean", "Scholarship Reports", "State Post-Matric & Central merit scholarship disbursement reports.", "REPORTS & HISTORY", [{ label: "Scholarships Disbursed", val: "₹3.80 Cr" }, { label: "Beneficiaries", val: "1,240 Students" }, { label: "Reimbursement Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Total Beneficiaries", "Disbursed Amount", "Status"], `[
  { title: "Annual State & Central Merit Scholarship Disbursement Audit Report", count: "1,240 Students", amt: "₹3.80 Cr", status: "Verified" }
]`);

// ==========================================
// 3. FINANCE DEAN SUBPAGES
// ==========================================
writeInteractivePage("staff.finance-dean.annual-budget.tsx", "/staff/finance-dean/annual-budget", "Finance Dean", "Annual Budget", "Master institutional annual budget allocation, sanctioned funds, and financial year ledgers.", "BUDGET MANAGEMENT", [{ label: "Total Budget", val: "₹48.5 Cr" }, { label: "Sanctioned FY", val: "FY 2025-26" }, { label: "Allocated", val: "₹42.0 Cr" }, { label: "Status", val: "Approved" }], ["Budget ID", "Department / Wing", "Allocated Budget", "Used Budget", "Remaining Balance", "Financial Year", "Status"], `[
  { id: "BGT-2025-01", dept: "Computer Science Engineering", alloc: "₹8.50 Cr", used: "₹7.20 Cr", rem: "₹1.30 Cr", fy: "2025-26", status: "Approved" },
  { id: "BGT-2025-02", dept: "Electronics & Communication", alloc: "₹6.80 Cr", used: "₹5.40 Cr", rem: "₹1.40 Cr", fy: "2025-26", status: "Approved" }
]`, "GroupedBarChart");

writeInteractivePage("staff.finance-dean.fee-collection.tsx", "/staff/finance-dean/fee-collection", "Finance Dean", "Fee Collection", "Student tuition fee, hostel fee, and exam fee collection ledgers.", "FEE MANAGEMENT", [{ label: "Fee Collected Mtd", val: "₹23.1 Cr" }, { label: "Collected Today", val: "₹42.5 Lacs" }, { label: "Collection %", val: "96.2%" }, { label: "Status", val: "Active" }], ["Receipt No", "Student Name", "Roll Number", "Department", "Fee Type", "Paid Amount", "Payment Mode", "Status"], `[
  { rcpt: "RCPT-2026-901", name: "Rahul Sharma", roll: "22CS101", dept: "CSE", type: "Autumn Semester Tuition Fee", amt: "₹75,000", mode: "Online UPI / NetBanking", status: "Paid" }
]`, "GroupedBarChart");

writeInteractivePage("staff.finance-dean.faculty-payroll.tsx", "/staff/finance-dean/faculty-payroll", "Finance Dean", "Faculty Payroll", "Monthly faculty salary processing, basic pay, DA, HRA, and net salary disbursements.", "PAYROLL", [{ label: "Faculty Payroll", val: "₹1.85 Cr / Mo" }, { label: "Faculty Members", val: "245 Faculty" }, { label: "Disbursement SLA", val: "1st of Month" }, { label: "Status", val: "Paid" }], ["Emp ID", "Faculty Name", "Department", "Basic Salary", "Allowances (HRA/DA)", "Deductions (PF/TDS)", "Net Salary", "Status"], `[
  { id: "FAC-101", name: "Dr. Ravi Kumar", dept: "CSE", basic: "₹1,20,000", allow: "₹48,000", ded: "₹18,000", net: "₹1,50,000", status: "Paid" }
]`, "GroupedBarChart");

// ==========================================
// 4. EXAMINATION DEAN SUBPAGES
// ==========================================
writeInteractivePage("staff.examination-dean.exam-schedule.tsx", "/staff/examination-dean/exam-schedule", "Examination Dean", "Exam Schedule", "Master examination timetable, session slots, and subject codes.", "EXAM PLANNING", [{ label: "Total Exams", val: "184 Exams" }, { label: "Session Slots", val: "Morning / Afternoon" }, { label: "Schedules Released", val: "100%" }, { label: "Status", val: "Active" }], ["Course Code", "Subject Name", "Department", "Semester", "Exam Date", "Session Time", "Exam Hall", "Status"], `[
  { code: "CS501", subject: "Advanced Software Engineering", dept: "CSE", sem: "Semester 5", date: "2026-08-18", time: "Morning (09:30 AM)", hall: "Block A - Hall 101", status: "Scheduled" }
]`, "GroupedBarChart");

writeInteractivePage("staff.examination-dean.generate-hall-tickets.tsx", "/staff/examination-dean/generate-hall-tickets", "Examination Dean", "Generate Hall Tickets", "Batch hall ticket generation, fee clearance check, and barcode embedding.", "HALL TICKETS", [{ label: "Appearing Students", val: "5,420 Students" }, { label: "Generated", val: "4,850 Tickets" }, { label: "Fee Cleared", val: "96.2%" }, { label: "Status", val: "Generated" }], ["Batch Code", "Department", "Semester", "Eligible Students", "Generated Count", "Generation Date", "Status"], `[
  { code: "GEN-CSE-SEM5", dept: "CSE", sem: "Semester 5", elig: "420 Students", gen: "420 Tickets", date: "2026-08-04", status: "Generated" }
]`, "GroupedBarChart");

writeInteractivePage("staff.examination-dean.marks-entry.tsx", "/staff/examination-dean/marks-entry", "Examination Dean", "Marks Entry", "Faculty marks entry portal, OMR scan import, and double entry verification.", "EVALUATION", [{ label: "Marks Entries", val: "21,950 Entries" }, { label: "Double Verification", val: "100% Verified" }, { label: "Anomalies Checked", val: "Zero" }, { label: "Status", val: "Verified" }], ["Roll Number", "Student Name", "Subject Code", "Internal (40)", "External (60)", "Total (100)", "Grade", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", code: "CS501", int: "36", ext: "54", tot: "90", grade: "O Grade", status: "Verified" }
]`);

// ==========================================
// 5. PLACEMENT DEAN SUBPAGES
// ==========================================
writeInteractivePage("staff.placement-dean.companies.tsx", "/staff/placement-dean/companies", "Placement Dean", "Companies", "Master directory of empanelled recruiters, industry partners, and annual CTC bands.", "COMPANY MANAGEMENT", [{ label: "Total Companies", val: "142 Partners" }, { label: "Tier 1 Corporate", val: "48 Companies" }, { label: "MoUs Signed", val: "36 Active" }, { label: "Status", val: "Active" }], ["Company Name", "Industry Domain", "HQ Location", "HR Contact", "Package Offered", "Eligible Branches", "Status"], `[
  { name: "Microsoft India", ind: "Software & Cloud", loc: "Hyderabad / Bengaluru", hr: "Dr. Ananya Rao", pkg: "₹52.0 LPA", branches: "CSE, ECE, AI & DS", status: "Active" },
  { name: "Deloitte India", ind: "Management Consulting", loc: "Hyderabad / Gurugram", hr: "Ms. Sneha Reddy", pkg: "₹14.5 LPA", branches: "CSE, ECE, MBA", status: "Active" }
]`, "GroupedBarChart");

writeInteractivePage("staff.placement-dean.selected-students.tsx", "/staff/placement-dean/selected-students", "Placement Dean", "Selected Students", "Placed students master ledger, company selections, and salary package CTCs.", "STUDENT PLACEMENT", [{ label: "Placed Students", val: "1,640 Placed" }, { label: "Placement Rate", val: "89.6%" }, { label: "Highest Package", val: "₹52.0 LPA" }, { label: "Status", val: "Placed" }], ["Student Name", "Roll Number", "Department", "CGPA", "Placed Company", "Salary CTC Package", "Status"], `[
  { name: "Rahul Sharma", roll: "22CS101", dept: "CSE", cgpa: "9.28", comp: "Microsoft India", pkg: "₹52.0 LPA", status: "Placed" }
]`);

console.log("Successfully upgraded all remaining subpages across executive Deans!");
