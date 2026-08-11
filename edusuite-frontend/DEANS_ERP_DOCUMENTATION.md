# Executive Dean ERP System - Comprehensive Documentation & Workflow Guide

## Executive Overview
The **EduSuite Pro Executive Dean ERP System** is an enterprise-grade academic administration platform designed to empower institutional leadership across all critical governance domains. The system features a multi-portfolio selection hub, context-aware side navigation panels, real-time KPI analytics, dedicated workflow routes, interactive modal dialogs, notification dispatchers, and customizable administrative settings panels.

---

## 1. Executive Dean Selection Hub (`/staff`)
The **Dean Selection Hub** serves as the central entry point for institutional leaders and Super Administrators to access specific Dean portfolios.

- **URL Route**: `/staff`
- **Portfolios Available**:
  1. **Academic Dean** (`/staff/academic-dean`)
  2. **Student Affairs Dean** (`/staff/student-dean`)
  3. **IQAC Quality Dean** (`/staff/iqac`)
  4. **IMA Governance Dean** (`/staff/ima`)
  5. **Research & Development Dean** (`/staff/research-development`)
  6. **Finance Dean** (`/staff/finance-dean`)
  7. **Examination Dean** (`/staff/examination-dean`)
  8. **Placement Dean** (`/staff/placement-dean`)

---

## 2. Complete Side Navigation & Feature Breakdown by Dean

### 🎓 1. Academic Dean (`/staff/academic-dean`)
**Primary Scope**: Curriculum planning, department oversight, faculty workload distribution, academic calendar management, class monitoring, and Outcome-Based Education (OBE) compliance.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **Academic Dean** | Dashboard | `/staff/academic-dean` | `LayoutDashboard` |
| **Academic Management** | Departments | `/staff/academic-dean/departments` | `Building2` |
| | Faculty Management | `/staff/academic-dean/faculty-management` | `Users` |
| | Course Management | `/staff/academic-dean/course-management` | `BookOpen` |
| | Curriculum & Syllabus | `/staff/academic-dean/curriculum` | `FileSpreadsheet` |
| | Academic Calendar | `/staff/academic-dean/academic-calendar` | `Calendar` |
| **Student Academics** | Class Monitoring | `/staff/academic-dean/class-monitoring` | `Monitor` |
| | Attendance Monitoring | `/staff/academic-dean/attendance-monitoring` | `UserCheck` |
| | Academic Performance | `/staff/academic-dean/academic-performance` | `Award` |
| | Slow Learners | `/staff/academic-dean/slow-learners` | `AlertCircle` |
| | Top Performers | `/staff/academic-dean/top-performers` | `Trophy` |
| **Timetable Management** | Timetable | `/staff/academic-dean/timetable` | `CalendarRange` |
| | Faculty Timetable | `/staff/academic-dean/faculty-timetable` | `Clock` |
| | Classroom Allocation | `/staff/academic-dean/classroom-allocation` | `Building` |
| | Substitute Faculty | `/staff/academic-dean/substitute-faculty` | `UserPlus` |
| | Timetable History | `/staff/academic-dean/timetable-history` | `History` |
| **Faculty Workload** | Teaching Load | `/staff/academic-dean/teaching-load` | `Briefcase` |
| | Subject Allocation | `/staff/academic-dean/subject-allocation` | `Layers` |
| | Department Workload | `/staff/academic-dean/dept-workload` | `BarChart2` |
| | Faculty Performance | `/staff/academic-dean/faculty-performance` | `TrendingUp` |
| **Academic Quality** | OBE Management | `/staff/academic-dean/obe-management` | `Target` |
| | CO-PO Mapping | `/staff/academic-dean/copo-mapping` | `GitMerge` |
| | Course Outcomes | `/staff/academic-dean/course-outcomes` | `CheckSquare` |
| | Academic Audit | `/staff/academic-dean/academic-audit` | `ShieldCheck` |
| **Meetings & Approvals** | Academic Council | `/staff/academic-dean/academic-council` | `Users2` |
| | BOS Meetings | `/staff/academic-dean/bos-meetings` | `FileCheck2` |
| | Circulars | `/staff/academic-dean/circulars` | `BellRing` |
| | Approvals | `/staff/academic-dean/approvals` | `CheckCircle2` |
| **Reports** | Department Reports | `/staff/academic-dean/department-reports` | `BarChart3` |
| | Faculty Reports | `/staff/academic-dean/faculty-reports` | `BarChart3` |
| | Student Performance Reports | `/staff/academic-dean/student-reports` | `BarChart3` |
| | Attendance Reports | `/staff/academic-dean/attendance-reports` | `BarChart3` |
| | Timetable Reports | `/staff/academic-dean/timetable-reports` | `BarChart3` |
| **System** | Notifications | `/staff/academic-dean/notifications` | `Bell` |
| | Settings | `/staff/academic-dean/settings` | `Settings` |

#### Key Features & Workflows
- **Live Class Monitoring Dashboard**: Track active lectures, substitute assignments, and room availability in real time.
- **CO-PO & OBE Compliance Engine**: Map Course Outcomes to Program Outcomes and evaluate attainment percentages across departments.
- **Workload Rebalancing Tool**: Analyze teaching loads and reallocate subjects to prevent faculty burnout.
- **Academic Circular Dispatch**: Create, approve, and push academic circulars directly to student and faculty portals.

---

### 👥 2. Student Affairs Dean (`/staff/student-dean`)
**Primary Scope**: Student welfare, discipline, grievance redressal, scholarship administration, campus clubs, hostel coordination, and student counseling.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **Student Dean** | Dashboard | `/staff/student-dean` | `LayoutDashboard` |
| **Student Management** | Students | `/staff/student-dean/students` | `Users` |
| | Student Profiles | `/staff/student-dean/student-profiles` | `User` |
| | Attendance | `/staff/student-dean/attendance` | `CalendarCheck` |
| | Attendance History | `/staff/student-dean/attendance-history` | `History` |
| | Grievances | `/staff/student-dean/grievances` | `ShieldAlert` |
| | Scholarships | `/staff/student-dean/scholarships` | `Award` |
| | Discipline | `/staff/student-dean/discipline` | `BookOpen` |
| | Counselling | `/staff/student-dean/counselling` | `MessageSquare` |
| **Campus Life** | Hostel Management | `/staff/student-dean/hostel` | `BedDouble` |
| | Clubs & Events | `/staff/student-dean/clubs-events` | `Calendar` |
| | Student Activities | `/staff/student-dean/student-activities` | `Activity` |
| **Academic Support** | Mentoring | `/staff/student-dean/mentoring` | `HeartHandshake` |
| | Student Requests | `/staff/student-dean/student-requests` | `FileCheck` |
| | Certificates | `/staff/student-dean/certificates` | `Award` |
| | Timetable | `/staff/student-dean/timetable` | `CalendarRange` |
| **Reports** | Student Reports | `/staff/student-dean/reports` | `BarChart3` |
| | Attendance Reports | `/staff/student-dean/attendance-reports` | `FileSpreadsheet` |
| | Scholarship Reports | `/staff/student-dean/scholarship-reports` | `Award` |
| **System** | Notifications | `/staff/student-dean/notifications` | `Bell` |
| | Settings | `/staff/student-dean/settings` | `Settings` |

#### Key Features & Workflows
- **Grievance Redressal Portal**: Priority-based grievance triage with SLA tracking, committee assignment, and status updates.
- **Scholarship Disbursement Pipeline**: Review, verify, and approve merit and means scholarships with automated finance notifications.
- **Disciplinary Action Committee**: Log incidents, issue formal notices, record hearings, and manage student probation status.
- **Counseling Session Tracker**: Confidential booking and session notes management for student wellness.

---

### 🛡️ 3. IQAC Quality Dean (`/staff/iqac`)
**Primary Scope**: NAAC/NBA accreditation readiness, Annual Quality Assurance Report (AQAR) generation, institutional KPI benchmarking, stakeholder feedback processing, and academic audits.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **IQAC Dean** | Dashboard | `/staff/iqac` | `LayoutDashboard` |
| **Quality Assurance** | NAAC Accreditation | `/staff/iqac/naac` | `BadgeCheck` |
| | NBA Accreditation | `/staff/iqac/nba` | `ShieldCheck` |
| | AQAR Management | `/staff/iqac/aqar` | `FileText` |
| | SSR Management | `/staff/iqac/ssr` | `Database` |
| | Academic Audit | `/staff/iqac/academic-audit` | `ClipboardCheck` |
| | Internal Quality Audit | `/staff/iqac/internal-quality-audit` | `Activity` |
| | Department Quality Metrics | `/staff/iqac/dept-quality-metrics` | `Award` |
| | Quality Improvement Plans | `/staff/iqac/quality-improvement` | `TrendingUp` |
| **Feedback Management** | Student Feedback | `/staff/iqac/student-feedback` | `Users` |
| | Faculty Feedback | `/staff/iqac/faculty-feedback` | `GraduationCap` |
| | Alumni Feedback | `/staff/iqac/alumni-feedback` | `Users` |
| | Employer Feedback | `/staff/iqac/employer-feedback` | `Briefcase` |
| | Feedback Analytics | `/staff/iqac/feedback-analytics` | `PieChart` |
| **Compliance** | Compliance Tracker | `/staff/iqac/compliance-tracker` | `CheckSquare` |
| | Criteria Documentation | `/staff/iqac/criteria-docs` | `FolderKanban` |
| | Document Repository | `/staff/iqac/document-repo` | `FolderGit2` |
| | Evidence Uploads | `/staff/iqac/evidence-uploads` | `Upload` |
| **Institution Analytics** | KPI Dashboard | `/staff/iqac/kpi-dashboard` | `LineChart` |
| | Quality Metrics | `/staff/iqac/quality-metrics` | `Award` |
| | Benchmarking | `/staff/iqac/benchmarking` | `Target` |
| | Performance Analysis | `/staff/iqac/performance-analysis` | `BarChart3` |
| **Meetings & Activities** | IQAC Meetings | `/staff/iqac/meetings` | `Calendar` |
| | Action Taken Reports (ATR) | `/staff/iqac/atr` | `FileCheck` |
| | Workshops & FDPs | `/staff/iqac/workshops` | `BookOpen` |
| | Best Practices | `/staff/iqac/best-practices` | `Sparkles` |
| | Institutional Events | `/staff/iqac/events` | `PartyPopper` |
| **Reports** | NAAC Reports | `/staff/iqac/naac-reports` | `BarChart3` |
| | AQAR Reports | `/staff/iqac/aqar-reports` | `FileText` |
| | Audit Reports | `/staff/iqac/audit-reports` | `ClipboardCheck` |
| | Feedback Reports | `/staff/iqac/feedback-reports` | `MessageSquare` |
| | KPI Reports | `/staff/iqac/kpi-reports` | `LineChart` |
| **Timetable & Schedule** | Timetable & Class Schedule | `/staff/iqac/timetable` | `CalendarRange` |
| **System** | Notifications | `/staff/iqac/notifications` | `Bell` |
| | Settings | `/staff/iqac/settings` | `Settings` |

#### Key Features & Workflows
- **NAAC/NBA Criteria Matrix**: 7-criteria breakdown with weighted score calculation, proof attachment, and Gap Analysis.
- **360° Feedback Analytics**: Multi-stakeholder analytics with automated sentiment scores and actionable recommendations.
- **Action Taken Report (ATR) Generator**: Track decisions from IQAC meetings through implementation and verification.

---

### 🏬 4. IMA Governance Dean (`/staff/ima`)
**Primary Scope**: Industry partnerships, Memorandum of Understanding (MoU) lifecycle, corporate guest lectures, laboratory infrastructure, equipment maintenance, asset tracking, and procurement.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **IMA Dean** | Dashboard | `/staff/ima` | `LayoutDashboard` |
| **Laboratory Management** | Laboratories | `/staff/ima/laboratories` | `FlaskConical` |
| | Lab Details | `/staff/ima/lab-details` | `Info` |
| | Lab Timetable | `/staff/ima/lab-timetable` | `CalendarRange` |
| | Lab Booking | `/staff/ima/lab-booking` | `CalendarCheck` |
| **Equipment Management** | Equipment Inventory | `/staff/ima/equipment-inventory` | `Cpu` |
| | Equipment History | `/staff/ima/equipment-history` | `History` |
| | Equipment Allocation | `/staff/ima/equipment-allocation` | `GitMerge` |
| | Equipment Requests | `/staff/ima/equipment-requests` | `FileQuestion` |
| **Maintenance** | Maintenance Requests | `/staff/ima/maintenance-requests` | `Wrench` |
| | Maintenance Schedule | `/staff/ima/maintenance-schedule` | `Calendar` |
| | AMC & Warranty | `/staff/ima/amc-warranty` | `ShieldAlert` |
| | Vendors | `/staff/ima/vendors` | `Truck` |
| **Asset Management** | Asset Register | `/staff/ima/asset-register` | `Box` |
| | Department Assets | `/staff/ima/department-assets` | `Building2` |
| | Asset Transfer | `/staff/ima/asset-transfer` | `ArrowLeftRight` |
| | Asset Disposal | `/staff/ima/asset-disposal` | `Trash2` |
| **Purchases** | Purchase Requests | `/staff/ima/purchase-requests` | `ShoppingCart` |
| | Purchase Orders | `/staff/ima/purchase-orders` | `FileSpreadsheet` |
| | Approved Purchases | `/staff/ima/approved-purchases` | `CheckCircle2` |
| | Vendors | `/staff/ima/purchase-vendors` | `Truck` |
| **Reports** | Laboratory Reports | `/staff/ima/laboratory-reports` | `BarChart3` |
| | Equipment Reports | `/staff/ima/equipment-reports` | `BarChart3` |
| | Inventory Reports | `/staff/ima/inventory-reports` | `BarChart3` |
| | Maintenance Reports | `/staff/ima/maintenance-reports` | `BarChart3` |
| | Purchase Reports | `/staff/ima/purchase-reports` | `BarChart3` |
| **Timetable & Schedule** | Timetable & Class Schedule | `/staff/ima/timetable` | `CalendarRange` |
| **System** | Notifications | `/staff/ima/notifications` | `Bell` |
| | Settings | `/staff/ima/settings` | `Settings` |

#### Key Features & Workflows
- **MoU & Partner Portal**: Track active MoUs, expiration dates, collaborative activities, and renewal notifications.
- **Lab & Equipment Asset Register**: Real-time asset lifecycle tracking, maintenance history, AMC renewals, and lab slot bookings.
- **Purchase Order Workflow**: Requisition creation, multi-level approval, purchase order generation, and vendor performance scoring.

---

### 🔬 5. Research & Development Dean (`/staff/research-development`)
**Primary Scope**: Sponsored research projects, consultancy, journal/conference publications, patent filings, research grants, PhD scholar progress, and incubation startups.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **R&D Dean** | Dashboard | `/staff/research-development` | `LayoutDashboard` |
| **Research Projects** | Ongoing Projects | `/staff/research-development/ongoing-projects` | `FolderGit2` |
| | Completed Projects | `/staff/research-development/completed-projects` | `CheckCircle2` |
| | Sponsored Projects | `/staff/research-development/sponsored-projects` | `Building2` |
| | Consultancy Projects | `/staff/research-development/consultancy-projects` | `Briefcase` |
| **Research Publications** | Journal Publications | `/staff/research-development/journal-publications` | `BookOpen` |
| | Conference Publications | `/staff/research-development/conference-publications` | `FileText` |
| | Book Chapters | `/staff/research-development/book-chapters` | `Bookmark` |
| | Publications Repository | `/staff/research-development/publications-repo` | `Database` |
| **Patents & Innovation** | Patents | `/staff/research-development/patents` | `Award` |
| | Copyrights | `/staff/research-development/copyrights` | `ShieldCheck` |
| | Innovations | `/staff/research-development/innovations` | `Sparkles` |
| | Startups & Incubation | `/staff/research-development/incubation` | `Rocket` |
| **Research Grants** | Government Grants | `/staff/research-development/govt-grants` | `Landmark` |
| | Industry Grants | `/staff/research-development/industry-grants` | `Building` |
| | Funding Agencies | `/staff/research-development/funding-agencies` | `DollarSign` |
| | Grant Utilization | `/staff/research-development/grant-utilization` | `TrendingUp` |
| **Research Scholars** | PhD Scholars | `/staff/research-development/phd-scholars` | `GraduationCap` |
| | Research Guides | `/staff/research-development/research-guides` | `UserCheck` |
| | Scholar Progress | `/staff/research-development/scholar-progress` | `Activity` |
| | Thesis Repository | `/staff/research-development/thesis-repo` | `FileCheck` |
| **Research Laboratories** | Research Labs | `/staff/research-development/research-labs` | `FlaskConical` |
| | Lab Equipment | `/staff/research-development/lab-equipment` | `Cpu` |
| | Lab Booking | `/staff/research-development/lab-booking` | `CalendarCheck` |
| | Lab Utilization | `/staff/research-development/lab-utilization` | `LineChart` |
| **Research Events** | Conferences | `/staff/research-development/conferences` | `Calendar` |
| | FDPs | `/staff/research-development/fdps` | `BookMarked` |
| | Workshops | `/staff/research-development/workshops` | `Presentation` |
| | Seminars | `/staff/research-development/seminars` | `Video` |
| **Reports** | Research Reports | `/staff/research-development/research-reports` | `BarChart3` |
| | Publication Reports | `/staff/research-development/publication-reports` | `BarChart3` |
| | Patent Reports | `/staff/research-development/patent-reports` | `BarChart3` |
| | Grant Reports | `/staff/research-development/grant-reports` | `BarChart3` |
| | Scholar Reports | `/staff/research-development/scholar-reports` | `BarChart3` |
| **Timetable & Schedule** | Timetable & Class Schedule | `/staff/research-development/timetable` | `CalendarRange` |
| **System** | Notifications | `/staff/research-development/notifications` | `Bell` |
| | Settings | `/staff/research-development/settings` | `Settings` |

#### Key Features & Workflows
- **Grant Utilization Tracker**: Monitor fund disbursement, head-wise expenditure, and balance certificates for government/industry grants.
- **Intellectual Property Pipeline**: Track patent lifecycle from disclosure, examination, publication to grant status.
- **PhD Scholar Milestone Monitor**: Track doctoral progress, RAC meetings, synopsis submissions, and thesis evaluation pipeline.

---

### 💳 6. Finance Dean (`/staff/finance-dean`)
**Primary Scope**: Institutional budget allocation, fee collection, daily & department expenses, faculty/staff payroll, purchase order clearances, and financial audit compliance.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **Finance Dean** | Dashboard | `/staff/finance-dean` | `LayoutDashboard` |
| **Budget Management** | Annual Budget | `/staff/finance-dean/annual-budget` | `Wallet` |
| | Department Budgets | `/staff/finance-dean/dept-budgets` | `Building2` |
| | Budget Allocation | `/staff/finance-dean/budget-allocation` | `PieChart` |
| | Budget Utilization | `/staff/finance-dean/budget-utilization` | `TrendingUp` |
| **Fee Management** | Fee Collection | `/staff/finance-dean/fee-collection` | `CreditCard` |
| | Pending Fees | `/staff/finance-dean/pending-fees` | `Clock` |
| | Scholarships & Concessions | `/staff/finance-dean/scholarships-concessions` | `Award` |
| | Refund Management | `/staff/finance-dean/refund-management` | `RefreshCw` |
| **Expenditure Management** | Daily Expenses | `/staff/finance-dean/daily-expenses` | `DollarSign` |
| | Department Expenses | `/staff/finance-dean/dept-expenses` | `Receipt` |
| | Purchase Payments | `/staff/finance-dean/purchase-payments` | `ShoppingCart` |
| | Vendor Payments | `/staff/finance-dean/vendor-payments` | `Truck` |
| **Payroll** | Faculty Payroll | `/staff/finance-dean/faculty-payroll` | `UserCheck` |
| | Staff Payroll | `/staff/finance-dean/staff-payroll` | `Users` |
| | Salary History | `/staff/finance-dean/salary-history` | `History` |
| | Allowances & Deductions | `/staff/finance-dean/allowances-deductions` | `Calculator` |
| **Purchases & Vendors** | Purchase Requests | `/staff/finance-dean/purchase-requests` | `FileCheck2` |
| | Purchase Orders | `/staff/finance-dean/purchase-orders` | `Package` |
| | Vendor Management | `/staff/finance-dean/vendor-management` | `Truck` |
| | Invoice Management | `/staff/finance-dean/invoice-management` | `Receipt` |
| **Financial Audit** | Internal Audit | `/staff/finance-dean/internal-audit` | `ShieldCheck` |
| | External Audit | `/staff/finance-dean/external-audit` | `FileText` |
| | Audit Compliance | `/staff/finance-dean/audit-compliance` | `ShieldCheck` |
| | Audit History | `/staff/finance-dean/audit-history` | `History` |
| **Timetable & Schedule** | Timetable & Schedule | `/staff/finance-dean/timetable` | `CalendarRange` |
| **Reports** | Financial Reports | `/staff/finance-dean/financial-reports` | `BarChart3` |
| | Budget Reports | `/staff/finance-dean/budget-reports` | `BarChart3` |
| | Fee Reports | `/staff/finance-dean/fee-reports` | `BarChart3` |
| | Payroll Reports | `/staff/finance-dean/payroll-reports` | `BarChart3` |
| | Audit Reports | `/staff/finance-dean/audit-reports` | `BarChart3` |
| **System** | Notifications | `/staff/finance-dean/notifications` | `Bell` |
| | Settings | `/staff/finance-dean/settings` | `Settings` |

#### Key Features & Workflows
- **Real-time Fee Collection Monitor**: Breakdown of collection vs pending fees by program, batch, and category with payment gateway status.
- **Department Budget Allocator**: Allocate capital and operational budgets with real-time utilization variance alerts.
- **Payroll Disbursement Approval**: Review salary sheets, deductions, tax compliance, and push direct bank transfer instructions.

---

### 📝 7. Examination Dean (`/staff/examination-dean`)
**Primary Scope**: End-to-end examination schedule, hall ticket generation, question paper confidential storage, invigilation allocation, evaluation, result processing, grade sheets, revaluation, and malpractice handling.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **Examination Dean** | Dashboard | `/staff/examination-dean` | `LayoutDashboard` |
| **Exam Planning** | Academic Calendar | `/staff/examination-dean/academic-calendar` | `Calendar` |
| | Exam Schedule | `/staff/examination-dean/exam-schedule` | `CalendarRange` |
| | Timetable Generation | `/staff/examination-dean/timetable-generation` | `Clock` |
| | Hall Allocation | `/staff/examination-dean/hall-allocation` | `Building2` |
| | Invigilator Allocation | `/staff/examination-dean/invigilator-allocation` | `UserCheck` |
| **Hall Tickets** | Generate Hall Tickets | `/staff/examination-dean/generate-hall-tickets` | `Ticket` |
| | Hall Ticket Status | `/staff/examination-dean/hall-ticket-status` | `CheckCircle2` |
| | Download History | `/staff/examination-dean/download-history` | `History` |
| **Question Paper Management** | Question Paper Upload | `/staff/examination-dean/question-paper-upload` | `Upload` |
| | Question Paper Approval | `/staff/examination-dean/question-paper-approval` | `FileCheck2` |
| | Confidential Storage | `/staff/examination-dean/confidential-storage` | `Lock` |
| | Paper Distribution | `/staff/examination-dean/paper-distribution` | `Send` |
| **Examinations** | Internal Exams | `/staff/examination-dean/internal-exams` | `BookOpen` |
| | Mid Exams | `/staff/examination-dean/mid-exams` | `FileText` |
| | Semester Exams | `/staff/examination-dean/semester-exams` | `GraduationCap` |
| | Supplementary Exams | `/staff/examination-dean/supplementary-exams` | `Sparkles` |
| | Practical Exams | `/staff/examination-dean/practical-exams` | `FlaskConical` |
| **Evaluation** | Answer Script Allocation | `/staff/examination-dean/answer-script-allocation` | `FileSpreadsheet` |
| | Valuation Status | `/staff/examination-dean/valuation-status` | `CheckSquare` |
| | Marks Entry | `/staff/examination-dean/marks-entry` | `PenTool` |
| | Marks Verification | `/staff/examination-dean/marks-verification` | `ShieldCheck` |
| **Results** | Result Processing | `/staff/examination-dean/result-processing` | `Activity` |
| | Result Publication | `/staff/examination-dean/result-publication` | `Award` |
| | Grade Sheets | `/staff/examination-dean/grade-sheets` | `FileCheck` |
| | CGPA Calculation | `/staff/examination-dean/cgpa-calculation` | `Calculator` |
| | Rank List | `/staff/examination-dean/rank-list` | `Trophy` |
| **Revaluation** | Revaluation Requests | `/staff/examination-dean/revaluation-requests` | `RefreshCw` |
| | Revaluation Status | `/staff/examination-dean/revaluation-status` | `CheckCircle2` |
| | Recounting | `/staff/examination-dean/recounting` | `Search` |
| | Updated Results | `/staff/examination-dean/updated-results` | `Award` |
| **Malpractice** | Malpractice Cases | `/staff/examination-dean/malpractice-cases` | `AlertTriangle` |
| | Committee Reports | `/staff/examination-dean/committee-reports` | `FileSearch` |
| | Punishment History | `/staff/examination-dean/punishment-history` | `ShieldAlert` |
| **Timetable & Schedule** | Timetable & Schedule | `/staff/examination-dean/timetable` | `CalendarRange` |
| **Reports** | Exam Reports | `/staff/examination-dean/exam-reports` | `BarChart3` |
| | Result Reports | `/staff/examination-dean/result-reports` | `BarChart3` |
| | Hall Ticket Reports | `/staff/examination-dean/hall-ticket-reports` | `BarChart3` |
| | Invigilator Reports | `/staff/examination-dean/invigilator-reports` | `BarChart3` |
| | Malpractice Reports | `/staff/examination-dean/malpractice-reports` | `BarChart3` |
| **System** | Notifications | `/staff/examination-dean/notifications` | `Bell` |
| | Settings | `/staff/examination-dean/settings` | `Settings` |

#### Key Features & Workflows
- **Confidential Question Paper Storage**: Vault-protected upload, multi-key decryption approval, and secure printing allocation.
- **Automated Hall Ticket Generator**: Eligibility verification (attendance % + fee clearance) before issuing digital hall tickets with QR codes.
- **Result Processing Engine**: SGPA/CGPA computation, moderation application, grade sheet publishing, and revaluation tracking.

---

### 💼 8. Placement & Corporate Relations Dean (`/staff/placement-dean`)
**Primary Scope**: Corporate recruiter onboarding, placement drive scheduling, eligible student shortlisting, interview management, offer letter tracking, package analytics, and skill training programs.

#### Side Navigation Panel Structure
| Category | Menu Item Title | URL Route | Icon |
| :--- | :--- | :--- | :--- |
| **Placement Dean** | Dashboard | `/staff/placement-dean` | `LayoutDashboard` |
| **Company Management** | Companies | `/staff/placement-dean/companies` | `Building2` |
| | Company Profiles | `/staff/placement-dean/company-profiles` | `UserCheck` |
| | Recruitment Partners | `/staff/placement-dean/recruitment-partners` | `Building` |
| | Company Visits | `/staff/placement-dean/company-visits` | `CalendarCheck` |
| **Placement Drives** | Upcoming Drives | `/staff/placement-dean/upcoming-drives` | `Briefcase` |
| | Ongoing Drives | `/staff/placement-dean/ongoing-drives` | `Clock` |
| | Completed Drives | `/staff/placement-dean/completed-drives` | `CheckCircle2` |
| | Off-Campus Drives | `/staff/placement-dean/off-campus-drives` | `Globe` |
| **Student Placement** | Eligible Students | `/staff/placement-dean/eligible-students` | `Users` |
| | Registered Students | `/staff/placement-dean/registered-students` | `UserPlus` |
| | Shortlisted Students | `/staff/placement-dean/shortlisted-students` | `FileCheck2` |
| | Selected Students | `/staff/placement-dean/selected-students` | `Award` |
| | Offer Letters | `/staff/placement-dean/offer-letters` | `FileText` |
| **Internships** | Internship Opportunities | `/staff/placement-dean/internship-opportunities` | `Rocket` |
| | Internship Tracking | `/staff/placement-dean/internship-tracking` | `Activity` |
| | Internship Reports | `/staff/placement-dean/internship-reports` | `LineChart` |
| **Training & Development** | Aptitude Training | `/staff/placement-dean/aptitude-training` | `BookOpen` |
| | Coding Training | `/staff/placement-dean/coding-training` | `Code` |
| | Soft Skills | `/staff/placement-dean/soft-skills` | `MessageSquare` |
| | Mock Interviews | `/staff/placement-dean/mock-interviews` | `Video` |
| | Resume Reviews | `/staff/placement-dean/resume-reviews` | `FileCheck` |
| **Placement Analytics** | Placement Statistics | `/staff/placement-dean/placement-statistics` | `PieChart` |
| | Department-wise Placements | `/staff/placement-dean/dept-placements` | `BarChart3` |
| | Package Analysis | `/staff/placement-dean/package-analysis` | `TrendingUp` |
| | Company-wise Hiring | `/staff/placement-dean/company-hiring` | `Building` |
| **Timetable & Schedule** | Timetable & Schedule | `/staff/placement-dean/timetable` | `CalendarRange` |
| **Reports** | Placement Reports | `/staff/placement-dean/placement-reports` | `BarChart3` |
| | Internship Reports | `/staff/placement-dean/internship-reports-list` | `BarChart3` |
| | Company Reports | `/staff/placement-dean/company-reports` | `BarChart3` |
| | Student Reports | `/staff/placement-dean/student-reports` | `BarChart3` |
| | Training Reports | `/staff/placement-dean/training-reports` | `BarChart3` |
| **System** | Notifications | `/staff/placement-dean/notifications` | `Bell` |
| | Settings | `/staff/placement-dean/settings` | `Settings` |

#### Key Features & Workflows
- **Recruitment Funnel & Shortlist Pipeline**: Multi-stage tracking (Applied ➔ Assessment ➔ Interview ➔ Offered).
- **Highest & Average Package Analytics**: Salary package distributions (LPA), top recruiters, and department placement percentages.
- **Offer Letter Verification & Acceptance**: Verifies digital offer letters, single-offer compliance policy enforcement, and student acceptance confirmation.

---

## 3. Dedicated Custom Settings & Configuration Module
Each Executive Dean features a specialized **Dean Settings View** (`DeanSettingsView.tsx`) accessible via their respective `/settings` route (e.g., `/staff/academic-dean/settings`).

### ⚙️ Settings View Capabilities (`DeanSettingsView.tsx`)
1. **Dean Profile & Designation Config**: Full name, employee ID, official email, phone, cabin location, and office consultation hours.
2. **Operational Delegation Matrix**: Assign acting Deans or deputy coordinators with custom start/end dates and specific module permission scopes.
3. **Approval Thresholds & Auto-Routing**: Set monetary expenditure limits, attendance override thresholds, and auto-approval rules.
4. **Push & Broadcast Notification Preferences**: Configure email, SMS, and in-app alerts for high-priority events, urgent approvals, and emergency circulars.
5. **Security, Session & Immutable Audit Logs**: Real-time session monitoring, active IP logs, MFA enforcement, and access history.

---

## 4. Technical Architecture & Data Flow ("Workflow of My Work")

### 🔄 1. Context-Aware Navigation Resolver (`navigation.ts`)
The navigation engine inspects both the current URL path and user permission flags:
```ts
if (currentPath.startsWith("/staff/academic-dean")) return ACADEMIC_DEAN_NAVIGATION;
if (currentPath.startsWith("/staff/student-dean")) return STUDENT_DEAN_NAVIGATION;
if (currentPath.startsWith("/staff/iqac")) return IQAC_NAVIGATION;
if (currentPath.startsWith("/staff/ima")) return IMA_NAVIGATION;
if (currentPath.startsWith("/staff/research-development")) return RESEARCH_NAVIGATION;
if (currentPath.startsWith("/staff/finance-dean")) return FINANCE_NAVIGATION;
if (currentPath.startsWith("/staff/examination-dean")) return EXAMINATION_NAVIGATION;
if (currentPath.startsWith("/staff/placement-dean")) return PLACEMENT_NAVIGATION;
```
This guarantees that when navigating inside any Dean portfolio, **only that specific Dean's side navigation panel** is rendered in the UI.

### 🔐 2. Login & Designation Switcher (`staff-designation-dropdown.tsx`)
- The login modal allows staff members to expand and select specific Dean portfolios.
- Setting the active persona updates the `UserPermissionContext`, ensuring seamless transition into the chosen Dean view.

### ⚡ 3. Implementation Workflow History
1. **Service Layer Implementation**: Created unified mock service repositories for all Dean portfolios containing interactive data structures, KPIs, and notification items (`add_all_deans_services.js`, `enrich_student_dean_service.js`).
2. **Dedicated Route Generation**: Scripted and generated 200+ dedicated route endpoints across all 8 Deans (`generate_13_dedicated_dean_pages.js`, `build_all_dedicated_pages.js`).
3. **Interactive Sub-Pages & Components**: Built interactive views for timetables, reports, notifications, attendance logs, and circulars for each Dean.
4. **Custom Settings Integration**: Replaced generic settings routes with the unified `DeanSettingsView` component across all 8 Dean settings files (`staff.*.settings.tsx`).
5. **UI & Navigation Polish**: Updated `app-sidebar.tsx`, added responsive sidebar layouts, hid default scrollbars, and styled active highlight states with modern glassmorphism and HSL themes.
6. **Git Branching & Subbranch Management**:
   - Created subbranch `feature/dean-erp-updates` from `origin/main`.
   - Pushed all Dean ERP modules, custom settings, and navigation changes cleanly to GitHub remote.
