import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Define directories and image paths
const conversationId = 'aad8a9e5-ca7d-4430-8b2c-9453726dc39b';
const baseDir = `C:\\Users\\acer\\.gemini\\antigravity\\brain\\${conversationId}`;
const artifactsDir = `C:\\Users\\acer\\.gemini\\antigravity\\brain\\${conversationId}`; // Output to conversation folder as an artifact

const images = {
  faculty: path.join(baseDir, 'media__1785493877544.jpg'),
  academic: path.join(baseDir, 'media__1785493885816.jpg'),
  examination: path.join(baseDir, 'media__1785493944755.jpg'),
  studentWorkflow: path.join(baseDir, 'media__1785494149393.jpg'),
  accessControl: path.join(baseDir, 'media__1785494599702.jpg')
};

const pdfPath = path.resolve('public/edusuite_workflows.pdf');
console.log('Generating PDF at:', pdfPath);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 54, right: 54 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(pdfPath);
doc.pipe(writeStream);

// Helper styles & functions
const PRIMARY_COLOR = '#1d4ed8'; // Royal Electric Blue
const TEXT_DARK = '#0f172a'; // Slate 900
const TEXT_MUTED = '#475569'; // Slate 600
const LINE_COLOR = '#cbd5e1'; // Slate 300

function addHeader(title) {
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .fontSize(18)
     .text(title);
  
  // Underline
  const y = doc.y + 4;
  doc.strokeColor(PRIMARY_COLOR)
     .lineWidth(1.5)
     .moveTo(54, y)
     .lineTo(541, y)
     .stroke();
  
  doc.moveDown(1.5);
}

function addSubSection(title) {
  doc.fillColor(TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(title, { paragraphGap: 6 });
}

function addBody(text, options = {}) {
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica')
     .fontSize(9.5)
     .text(text, { lineGap: 3, paragraphGap: 10, ...options });
}

function addBullet(boldText, normalText) {
  doc.fillColor(TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text('  • ' + boldText + ': ', { lineGap: 3, continued: true });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica')
     .text(normalText, { lineGap: 3, paragraphGap: 4 });
}

// ----------------------------------------------------
// PAGE 1: COVER PAGE
// ----------------------------------------------------
doc.rect(0, 0, 595, 842).fill('#f8fafc'); // Light background

// Top Decorative Banner
doc.rect(0, 0, 595, 25).fill(PRIMARY_COLOR);

// Logo Mark Drawing
doc.save();
doc.translate(297, 180);
doc.fillColor(PRIMARY_COLOR);
doc.moveTo(0, -30)   // top point
   .lineTo(50, -10)  // right point
   .lineTo(0, 10)    // bottom point
   .lineTo(-50, -10) // left point
   .closePath()
   .fill();
doc.moveTo(-35, -4)
   .lineTo(-35, 15)
   .quadraticCurveTo(0, 30, 35, 15)
   .lineTo(35, -4)
   .quadraticCurveTo(0, 10, -35, -4)
   .closePath()
   .fill();
doc.restore();

// Text content
doc.fillColor(PRIMARY_COLOR)
   .font('Helvetica-Bold')
   .fontSize(32)
   .text('EduSuite Pro', 54, 250, { align: 'center' });

doc.fillColor(TEXT_DARK)
   .font('Helvetica-Bold')
   .fontSize(18)
   .text('System Workflows & Lifecycle Architecture', 54, 300, { align: 'center' });

doc.fillColor(TEXT_MUTED)
   .font('Helvetica')
   .fontSize(11)
   .text('A comprehensive blueprint documenting the core operations, student lifecycles, examination procedures, and administrative workflows.', 80, 340, { align: 'center', width: 435, lineGap: 4 });

// Center line
doc.strokeColor(PRIMARY_COLOR)
   .lineWidth(2)
   .moveTo(250, 410)
   .lineTo(345, 410)
   .stroke();

// Metadata Block
doc.fillColor(TEXT_DARK)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('DOCUMENT SCOPE:', 54, 520);
doc.fillColor(TEXT_MUTED)
   .font('Helvetica')
   .text('• Academic Management Lifecycle\n• Faculty Operations & HR Workflow\n• Examination & Results Processing\n• Student Management & Lifecycle Workflow\n• Access Control & Admin/Super-Admin Architecture\n• Training & Placement Cell Processes\n• Library Operations & Member Management', 54, 535, { lineGap: 4 });

doc.fillColor(TEXT_DARK)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('METADATA:', 350, 520);
doc.fillColor(TEXT_MUTED)
   .font('Helvetica')
   .text('Status: Approved Blueprint\nVersion: 2.0.0 (Enterprise)\nDate: July 31, 2026\nTarget: Dev & QA Teams', 350, 535, { lineGap: 4 });

// Bottom Banner
doc.rect(0, 817, 595, 25).fill(PRIMARY_COLOR);

// ----------------------------------------------------
// PAGE 2: TABLE OF CONTENTS
// ----------------------------------------------------
doc.addPage();
addHeader('Table of Contents');

const tocItems = [
  { s: '1', title: 'Academic Management Workflow', page: 3 },
  { s: '2', title: 'Faculty Operations & Management Workflow', page: 4 },
  { s: '3', title: 'Examination & Results Processing Engine', page: 5 },
  { s: '4', title: 'Student Management & Complete Lifecycle', page: 6 },
  { s: '5', title: 'Access Control & Admin/Super-Admin Architecture', page: 8 },
  { s: '6', title: 'Training & Placement (T&P) Cell Workflow', page: 10 },
  { s: '7', title: 'Library Administration & Operations Workflow', page: 12 }
];

doc.moveDown(1);
tocItems.forEach((item) => {
  doc.fillColor(TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(item.s + '.  ' + item.title, { continued: true });
  
  // Dots leader
  doc.fillColor(LINE_COLOR)
     .font('Helvetica')
     .text(' ' + '.'.repeat(60 - item.title.length * 1.1) + ' ', { continued: true });
  
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .text(item.page.toString());
  
  doc.moveDown(1.5);
});

// ----------------------------------------------------
// PAGE 3: ACADEMIC MANAGEMENT WORKFLOW
// ----------------------------------------------------
doc.addPage();
addHeader('1. Academic Management Workflow');
addBody('The Academic Management module drives the curriculum planning, program coordination, and academic scheduling of the institution. It bridges the core rules with operational entities like section mapping, timetable generation, and attendance validation before exams.');

if (fs.existsSync(images.academic)) {
  doc.image(images.academic, 54, 180, { width: 487 });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Figure 1.1: Academic Management Lifecycle & Module Connections', 54, 680, { align: 'center' });
} else {
  doc.rect(54, 180, 487, 300).strokeColor(LINE_COLOR).stroke();
  doc.text('Academic Workflow Diagram (Image missing)', 54, 320, { align: 'center' });
}

// ----------------------------------------------------
// PAGE 4: FACULTY MANAGEMENT WORKFLOW
// ----------------------------------------------------
doc.addPage();
addHeader('2. Faculty Operations & Management');
addBody('The Faculty Management Workflow defines the onboarding, performance monitoring, class assignment, research tracker, and payroll updates for teaching staff. This module enables automated attendance capture, leave workflow approvals, and promotion reviews.');

if (fs.existsSync(images.faculty)) {
  doc.image(images.faculty, 54, 180, { width: 487 });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Figure 2.1: Complete Faculty Lifecycle and Operational Output Systems', 54, 680, { align: 'center' });
} else {
  doc.rect(54, 180, 487, 300).strokeColor(LINE_COLOR).stroke();
  doc.text('Faculty Workflow Diagram (Image missing)', 54, 320, { align: 'center' });
}

// ----------------------------------------------------
// PAGE 5: EXAMINATION & RESULTS PROCESSING ENGINE
// ----------------------------------------------------
doc.addPage();
addHeader('3. Examination & Results Processing');
addBody('The Examination & Results Processing workflow guides the creation of exam schedules, hall ticket approvals, secure internal/external mark entry by faculty members, combined marks aggregation, and final results publication on the student and parent portals.');

if (fs.existsSync(images.examination)) {
  doc.image(images.examination, 54, 180, { width: 487 });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Figure 3.1: Examination Scheduling, Marks Entry and Aggregation Stages', 54, 680, { align: 'center' });
} else {
  doc.rect(54, 180, 487, 300).strokeColor(LINE_COLOR).stroke();
  doc.text('Examination Workflow Diagram (Image missing)', 54, 320, { align: 'center' });
}

// ----------------------------------------------------
// PAGE 6: STUDENT LIFE-CYCLE & MANAGEMENT
// ----------------------------------------------------
doc.addPage();
addHeader('4. Student Management & Lifecycle');
addBody('The student lifecycle forms the core database structure of the ERP, mapping a student from pre-admission prospects to alumni archives.');

addSubSection('Complete Student Lifecycle Flow');
doc.moveDown(0.2);
const stages = [
  'Admission Desk (Pre-Admission / Seat Allocation / Admission)',
  'Student Created & Official ID/Credentials Generated',
  'Master Student Record Linked to Core Modules (Profile, Attendance, Fees, Exams, Services)',
  'Semester Promotion / Branch & Section Transfers',
  'Final Year Completion & Graduating Clearance Checks',
  'Alumni Registry Auto-Onboarding & Directory Archival'
];
stages.forEach((stage, idx) => {
  doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').text(`Stage ${idx + 1}: `, { continued: true });
  doc.fillColor(TEXT_MUTED).font('Helvetica').text(stage);
  doc.moveDown(0.4);
});

doc.moveDown(0.8);
addSubSection('Student Management Module Structure');
doc.moveDown(0.2);
addBullet('Admission Desk', 'Pre-admission screening, Seat Allocation, Document Verification, and ID generation.');
addBullet('Student Profile', 'Personal, parent, and medical details, doc repository, and history records.');
addBullet('Attendance Tracker', 'Daily check-ins, monthly compliance sheets, and leave approvals.');
addBullet('Examination Portal', 'Internal schedules, backlog sheets, hall tickets, and grade cards.');
addBullet('Fees & Finance', 'Scholarship matching (JVD support), fee templates, online dues, and receipts.');
addBullet('Campus Services', 'Library memberships, Hostel allotments, and Transport/bus route mappings.');
addBullet('Certificates Desk', 'Automated generation of Study, Bonafide, Conduct, and Transfer Certificates.');

// ----------------------------------------------------
// PAGE 7: STUDENT MANAGEMENT SYSTEM DIAGRAM
// ----------------------------------------------------
doc.addPage();
addHeader('4.1 Student Management Complete Workflow');
addBody('This diagram details the comprehensive, end-to-end student lifecycle, illustrating the stages from initial Admission Desk registrations to final Alumni and Archive mappings.');

if (fs.existsSync(images.studentWorkflow)) {
  doc.image(images.studentWorkflow, 54, 180, { width: 487 });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Figure 4.1: End-to-End Student Lifecycle Workflow and Core Module Integrations', 54, 530, { align: 'center' });
} else {
  doc.rect(54, 180, 487, 300).strokeColor(LINE_COLOR).stroke();
  doc.text('Student Management Complete Workflow Diagram (Image missing)', 54, 320, { align: 'center' });
}

// ----------------------------------------------------
// PAGE 8: ACCESS CONTROL & ADMIN/SUPER-ADMIN ARCHITECTURE
// ----------------------------------------------------
doc.addPage();
addHeader('5. Access Control & Admin/Super-Admin Architecture');
addBody('EduSuite Pro enforces enterprise-grade security and module control, utilizing Role-Based Access Control (RBAC), responsibility override flags, dynamic feature-flag licensing, and configurable multi-step approval workflows.');

addSubSection('Permission Evaluation Formula');
addBody('Granular permissions are evaluated dynamically in real-time using the following central evaluation equation:');
doc.fillColor(PRIMARY_COLOR)
   .font('Helvetica-Bold')
   .fontSize(10.5)
   .text('Permission = Base Role + Responsibility Flags + Module License + Action + Scope', { align: 'center', paragraphGap: 10 });

addSubSection('Reorganized Responsibility Flags (Staff Overrides)');
addBody('Staff privileges are expanded dynamically using categorized Responsibility Flags rather than hardcoded sub-roles:');

doc.fillColor(TEXT_DARK).font('Helvetica-Bold').text('System Privileges: ', { continued: true });
doc.fillColor(TEXT_MUTED).font('Helvetica').text('isSystemAdmin (Global Bypass), isSecurityAdmin, isAuditAdmin, isUserManager.');
doc.moveDown(0.2);

doc.fillColor(TEXT_DARK).font('Helvetica-Bold').text('Academic Privileges: ', { continued: true });
doc.fillColor(TEXT_MUTED).font('Helvetica').text('isPrincipal, isVicePrincipal, isDean, isHod (Departmental Head), isExamController, isClassAdvisor, isMentor.');
doc.moveDown(0.2);

doc.fillColor(TEXT_DARK).font('Helvetica-Bold').text('Student Services: ', { continued: true });
doc.fillColor(TEXT_MUTED).font('Helvetica').text('isAdmissionsOfficer, isHostelWarden, isTransportOfficer, isPlacementOfficer.');
doc.moveDown(0.2);

doc.fillColor(TEXT_DARK).font('Helvetica-Bold').text('Operations: ', { continued: true });
doc.fillColor(TEXT_MUTED).font('Helvetica').text('isFinanceOfficer, isHRManager, isInventoryManager, isLibraryAdmin, isIQACCoordinator.');
doc.moveDown(0.8);

addSubSection('Configurable Approval Engine');
addBody('Administrative tasks requiring multi-step authorizations (e.g. Leave approvals, purchases, marks publication) use a sequential approval chain configured in settings. Administrators build step timelines by linking approval checkpoints (e.g., Faculty Advisor -> HOD -> Dean -> Principal).');

addSubSection('SaaS Feature-Flagging Engine');
addBody('SaaS module licensing is tied directly to feature flags. If a license is toggled off: (1) sidebar navigation filters the module, (2) hasPermission blocks backend/frontend routing, and (3) dependent integrations (like the AI Copilot assistant) are disabled.');

// ----------------------------------------------------
// PAGE 9: ROLE-BASED ACCESS CONTROL DIAGRAM
// ----------------------------------------------------
doc.addPage();
addHeader('5.1 Role-Based Access Control Architecture');
addBody('This diagram details the core 5 login roles, staff privilege override flags, department scopes, module access matrices, and dynamic approval chains.');

if (fs.existsSync(images.accessControl)) {
  doc.image(images.accessControl, 54, 180, { width: 487 });
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Figure 5.1: College ERP 2.0 Access Control Architecture & Responsibility Matrix', 54, 530, { align: 'center' });
} else {
  doc.rect(54, 180, 487, 300).strokeColor(LINE_COLOR).stroke();
  doc.text('Role-Based Access Control Diagram (Image missing)', 54, 320, { align: 'center' });
}

// ----------------------------------------------------
// PAGE 10: TRAINING & PLACEMENT WORKFLOW (PART 1)
// ----------------------------------------------------
doc.addPage();
addHeader('6. Training & Placement Cell Workflow');
addBody('The Training and Placement (T&P) Cell module handles drive setups, auto-filtering students based on eligibility, assessment creation with dynamic IDEs, and offer letter policies.');

addSubSection('Phase 1: Pre-Placement Preparation');
addBody('• Career Declaration: Students select paths (Placement / Higher Studies / Startup).\n• Profile Verification: T&P cell inspects resumes and eligibility credentials.\n• Academic Validation: Automatic checks on CGPA, active backlogs, and attendance.\n• Policies Setup: Configure "One Student One Job" and "Dream Offer Upgrade" conditions.');

addSubSection('Phase 2: Company & Recruiter Onboarding');
addBody('• Registration & Verification: Recruiter sign-up and security verification.\n• Access Approvals: Create secure recruiter portals.\n• Classification: Segment companies into Mass Recruiter, Core, Dream, and Super Dream tiers.');

addSubSection('Phase 3: Drive Management');
addBody('• Create Drive: Publish role details, salary packages, locations, and schedules.\n• Auto-Filtering: System identifies eligible cohorts and triggers sign-up notifications.\n• Application Reviews: Recruiter dashboard list checks.');

addSubSection('Phase 4: Assessment Creation & Approvals');
addBody('• Assessment Builder: Recruiter constructs tests containing MCQs, Coding IDE (C/C++, Java, Python), or SQL IDE environments.\n• Review Queue: Placements Officer inspects, requests revisions, or approves the test for publication.');

addSubSection('Phase 5: Assessment Operations');
addBody('• Setup Test: Schedule date and send access links.\n• Test Environment: Dynamic full-screen Assessment Player with auto-save, code compilers, timers, and resume support.');

// ----------------------------------------------------
// PAGE 11: TRAINING & PLACEMENT WORKFLOW (PART 2)
// ----------------------------------------------------
doc.addPage();
addHeader('T&P Cell Workflow (Continued)');

addSubSection('Phase 6: Auto Evaluation Engine');
addBody('• Immediate MCQ Scoring: Results saved on submission.\n• Code Compiler Execution: Runs student code against pre-configured test cases (correctness, time complexity).\n• SQL Query Tester: Validates student queries against database schemas and returns output scores.');

addSubSection('Phase 7: Result Moderation');
addBody('• Verification: Placement Officer audits logs and flags.\n• Publication: Releases candidate shortlists to recruiters.');

addSubSection('Phase 8: Interview Management');
addBody('• Coordination: Schedule online/offline Technical and HR rounds.\n• Feedback Tracking: Recruiter inputs feedback for each round.');

addSubSection('Phase 9: Offer Management');
addBody('• Upload Offers: Recruiters upload scanned/digital offer letters.\n• Policy Check: System checks against student-job rules (Dream upgrades vs. blocking duplicate offers).\n• Release: Verified offers released to student portals for final acceptance.');

addSubSection('Phase 10: Analytics & Reporting Dashboard');
addBody('• KPIs: Placement percentage, average package, highest package trends.\n• Metrics: Grouped by Department, Companies, MCQ performance, and Interview shortlists.\n• AI Insights: Predictive suggestions on cohort performance and recruitment success rates.');

addSubSection('Phase 11: Alumni Transition');
addBody('• Graduating: Auto-converts placed candidates to active Alumni status.\n• Network: Integrates student profiles with referral networks and placement drives.');

// ----------------------------------------------------
// PAGE 12: LIBRARY WORKFLOW (PART 1)
// ----------------------------------------------------
doc.addPage();
addHeader('7. Library Admin & Operations Workflow');
addBody('The Library Management module automates item inventories, physical space mapping (racks/shelves), ID barcode generations, book loans, returns, and digital library resources.');

addSubSection('Phase 1: Library Setup & Policies');
addBody('• Configuration: Define loan limits (e.g., max 3 books), overdue fine rates, and academic calendars.\n• Directory Mapping: Create subjects, authors, and classification hierarchies.\n• Rack & Shelf Mapping: Catalog physical locations (e.g., Rack B, Shelf 4) to enable search.');

addSubSection('Phase 2: Inventory Cataloging');
addBody('• Book Intake: Input details (ISBN, title, author, edition).\n• Barcoding: Auto-generate barcodes/QR codes to label book spines.');

addSubSection('Phase 3: Member Registration');
addBody('• Verification: Auto-fetch student/faculty status from master DB.\n• ID Printing: Print library cards containing barcodes for fast scanner checkouts.');

addSubSection('Phase 4: Book Issue Workflow');
addBody('• Scanner Checkout: Scan student card, check limits/fines, scan book barcode.\n• Transaction Log: Record transaction and compute custom due date.\n• Notifications: Trigger instant issue SMS/Email receipts.');

addSubSection('Phase 5: Book Return Workflow');
addBody('• Intake: Scan book barcode.\n• Audit: Calculate overdue days and assess book condition (Good, Damaged, Lost).\n• Finalize: Update inventory stock counts and clear borrow count logs.');

// ----------------------------------------------------
// PAGE 13: LIBRARY WORKFLOW (PART 2)
// ----------------------------------------------------
doc.addPage();
addHeader('Library Operations (Continued)');

addSubSection('Phase 6: Fine Management');
addBody('• Tracking: System registers overdue charges.\n• POS Checkout: Support fee payment via cash or integrated UPI.\n• Receipts: Instant print and ledger synchronization.');

addSubSection('Phase 7: Digital Library Hub');
addBody('• Upload: Store PDFs, lecture notes, academic journals.\n• Permissions: Match resources by department or semester rules.');

addSubSection('Phase 8: Automated Notifications');
addBody('• CRON Scheduler: Runs nightly checkups.\n• Reminders: Auto-sends emails/notifications for books due tomorrow or overdue warnings.');

addSubSection('Phase 9: Analytics & Reporting');
addBody('• Operations Audit: Export reports on transaction history, catalog additions, and fine collection.\n• Formats: Downloadable as PDF, Excel, and CSV.');

addSubSection('Phase 10: Library Administration');
addBody('• Management: Oversee librarian permissions and access controls.\n• Insights: Real-time dashboards showing book utilization rates and peak hours.');

addSubSection('Phase 11: Archives & Annual Audit');
addBody('• Stock Verification: Run audits to crosscheck physical books against DB records.\n• Archival: Write historic circulation logs to archives.');

// ----------------------------------------------------
// FINAL PASS: HEADER, FOOTER & PAGE NUMBERING
// ----------------------------------------------------
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  
  // Skip Header/Footer on Cover Page (Page 1)
  if (i === 0) continue;
  
  // Header
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica')
     .fontSize(8)
     .text('EDUSUITE PRO ERP  •  SYSTEM WORKFLOW DOCUMENTATION', 54, 30, { align: 'left' });
  
  doc.strokeColor(LINE_COLOR)
     .lineWidth(0.5)
     .moveTo(54, 42)
     .lineTo(541, 42)
     .stroke();
  
  // Footer
  doc.strokeColor(LINE_COLOR)
     .lineWidth(0.5)
     .moveTo(54, 792)
     .lineTo(541, 792)
     .stroke();
     
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica')
     .fontSize(8)
     .text(`Page ${i + 1} of ${range.count}`, 54, 802, { align: 'right' });
     
  doc.text('© 2026 EduSuite Pro. Confidential and Proprietary.', 54, 802, { align: 'left' });
}

doc.end();
writeStream.on('finish', () => {
  console.log('PDF successfully generated at:', pdfPath);
});
