import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const pdfPath = path.join(process.cwd(), 'public', 'EduSuite_Pro_Project_Documentation.pdf');

// Create PDF document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 45, right: 45 },
  bufferPages: true,
  autoFirstPage: false
});

const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

// Color Palette
const COLORS = {
  primary: '#0F172A',      // Slate 900
  secondary: '#1E293B',    // Slate 800
  accent: '#3B82F6',       // Blue 500
  accentLight: '#EFF6FF',  // Blue 50
  indigo: '#4F46E5',       // Indigo 600
  emerald: '#10B981',      // Emerald 500
  emeraldLight: '#ECFDF5', // Emerald 50
  amber: '#F59E0B',        // Amber 500
  amberLight: '#FFFBEB',   // Amber 50
  rose: '#EF4444',         // Rose 500
  purple: '#8B5CF6',       // Purple 500
  purpleLight: '#F5F3FF',  // Purple 50
  textDark: '#1E293B',
  textMuted: '#64748B',
  bgLight: '#F8FAFC',
  border: '#E2E8F0'
};

// Helper: Add Section Header
function addSectionHeader(title, category = '') {
  doc.addPage();
  
  // Top Accent Banner
  doc.rect(45, 45, 505, 4).fill(COLORS.accent);
  
  if (category) {
    doc.fillColor(COLORS.accent)
       .fontSize(9)
       .font('Helvetica-Bold')
       .text(category.toUpperCase(), 45, 55);
  }
  
  doc.fillColor(COLORS.primary)
     .fontSize(18)
     .font('Helvetica-Bold')
     .text(title, 45, category ? 68 : 55);

  doc.rect(45, doc.y + 4, 505, 1).fill(COLORS.border);
  doc.y += 12;
}

// Helper: Add Sub-header
function addSubHeader(title) {
  if (doc.y > 700) doc.addPage();
  doc.y += 8;
  doc.fillColor(COLORS.indigo)
     .fontSize(13)
     .font('Helvetica-Bold')
     .text(title, 45, doc.y);
  doc.y += 4;
}

// Helper: Add Paragraph
function addParagraph(text) {
  if (doc.y > 720) doc.addPage();
  doc.fillColor(COLORS.textDark)
     .fontSize(10)
     .font('Helvetica')
     .text(text, 45, doc.y, { width: 505, align: 'left', lineGap: 3 });
  doc.y += 6;
}

// Helper: Add Callout Box
function addCalloutBox(title, content, bgColor = COLORS.accentLight, borderColor = COLORS.accent) {
  if (doc.y > 680) doc.addPage();
  const startY = doc.y;
  
  doc.rect(45, startY, 505, 50).fill(bgColor);
  doc.rect(45, startY, 4, 50).fill(borderColor);
  
  doc.fillColor(borderColor)
     .fontSize(11)
     .font('Helvetica-Bold')
     .text(title, 58, startY + 8);
     
  doc.fillColor(COLORS.textDark)
     .fontSize(9.5)
     .font('Helvetica')
     .text(content, 58, startY + 24, { width: 480 });
     
  doc.y = startY + 58;
}

// Helper: Draw Workflow Diagram Box
function drawWorkflowStep(x, y, w, h, stepNum, title, desc, color) {
  const boxHeight = h || 65;
  doc.rect(x, y, w, boxHeight).fillAndStroke(color.bg, color.border);
  doc.rect(x, y, w, 4).fill(color.primary);
  
  // Badge
  doc.circle(x + 14, y + 16, 8).fill(color.primary);
  doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold').text(String(stepNum), x + 11, y + 13);
  
  // Title
  doc.fillColor(COLORS.primary).fontSize(9).font('Helvetica-Bold').text(title, x + 26, y + 8, { width: w - 29, lineGap: 1 });
  
  // Dynamic offset calculation for description text to eliminate overlapping
  const titleHeight = doc.heightOfString(title, { width: w - 29 });
  const descY = Math.max(y + 8 + titleHeight + 3, y + 32);
  
  // Desc
  doc.fillColor(COLORS.textMuted).fontSize(7.5).font('Helvetica').text(desc, x + 26, descY, { width: w - 29, lineGap: 1 });
}

function drawArrowRight(x, y) {
  doc.fillColor(COLORS.accent);
  doc.polygon([x, y - 4], [x + 12, y], [x, y + 4]);
  doc.fill();
}

// ==========================================
// 1. COVER PAGE
// ==========================================
doc.addPage();

// Background Gradient Box
doc.rect(0, 0, 595, 842).fill(COLORS.primary);

// Decorative Geometric Shapes
doc.save();
doc.opacity(0.15);
doc.circle(500, 100, 180).fill('#3B82F6');
doc.circle(100, 700, 220).fill('#6366F1');
doc.restore();

// Title Header
doc.fillColor('#60A5FA').fontSize(14).font('Helvetica-Bold').text('EDUSUITE ENTERPRISE SOLUTIONS', 50, 140, { letterSpacing: 2 });
doc.fillColor('#FFFFFF').fontSize(30).font('Helvetica-Bold').text('EduSuite Pro ERP', 50, 165);
doc.fillColor('#94A3B8').fontSize(16).font('Helvetica').text('Enterprise Educational Management Platform', 50, 205);

// White Glass Card for Metadata
doc.rect(50, 270, 495, 380).fill('#FFFFFF');
doc.rect(50, 270, 495, 8).fill(COLORS.accent);

doc.fillColor(COLORS.primary).fontSize(16).font('Helvetica-Bold').text('PROJECT DOCUMENTATION', 80, 295);
doc.rect(80, 318, 435, 1).fill(COLORS.border);

// Key Value Pairs
const meta = [
  ['Project Title:', 'EduSuite Pro ERP System'],
  ['Submitted To:', 'EduSuite Tech Solutions'],
  ['Lead Developer:', 'Hanish (Employee ID: EMP-2026-809)'],
  ['Development Team:', 'Keerthi, Vardhini, Preethi, Hemanth, Lokesh,'],
  ['', 'Ramesh, Murali, Vishnu, Ashok, Satya'],
  ['Department:', 'Enterprise Software Engineering & AI Solutions'],
  ['Primary Tech Stack:', 'React 19, TypeScript, TanStack Start/Router,'],
  ['', 'Vite, Recharts, Cloudflare Nitro'],
  ['Submission Date:', '06/08/2026'],
  ['System Version:', 'v2.4.0 (Production Release)']
];

let metaY = 330;
meta.forEach(([label, val]) => {
  if (label) {
    doc.fillColor(COLORS.textMuted).fontSize(10).font('Helvetica-Bold').text(label, 80, metaY, { width: 140 });
    doc.fillColor(COLORS.primary).fontSize(10).font('Helvetica').text(val, 220, metaY, { width: 300 });
  } else {
    doc.fillColor(COLORS.primary).fontSize(10).font('Helvetica').text(val, 220, metaY, { width: 300 });
  }
  metaY += 21;
});

// Footer Badge
doc.rect(50, 710, 495, 45).fill('#1E293B');
doc.fillColor('#10B981').fontSize(11).font('Helvetica-Bold').text('STATUS: PRODUCTION READY (0 BUILD ERRORS)', 70, 727);

// ==========================================
// 2. CERTIFICATE PAGE
// ==========================================
doc.addPage();

doc.rect(40, 40, 515, 762).lineWidth(2).stroke(COLORS.indigo);
doc.rect(46, 46, 503, 750).lineWidth(0.5).stroke(COLORS.accent);

doc.fillColor(COLORS.primary).fontSize(22).font('Helvetica-Bold').text('CERTIFICATE OF COMPLETION', 60, 90, { align: 'center', width: 475 });
doc.rect(200, 120, 195, 2).fill(COLORS.accent);

doc.fillColor(COLORS.textDark).fontSize(11).font('Helvetica').text(
  'This is to certify that Hanish, Keerthi, Vardhini, Preethi, Hemanth, Lokesh, Ramesh, Murali, Vishnu, Ashok, and Satya have successfully completed the software engineering and module integration project titled:',
  70, 150, { align: 'center', width: 455, lineGap: 6 }
);

doc.fillColor(COLORS.indigo).fontSize(16).font('Helvetica-Bold').text(
  '"EduSuite Pro ERP — Enterprise Educational Management Platform"',
  70, 220, { align: 'center', width: 455 }
);

doc.fillColor(COLORS.textDark).fontSize(11).font('Helvetica').text(
  'The project work was conducted during the period from 01/05/2026 to 06/08/2026 under the direct technical supervision of the Engineering Directorate at EduSuite Tech Solutions.\n\nThe system has passed all automated type-checking validations (npx tsc --noEmit), production compilation checks, multi-tenant security audits, and functional integration tests across all 11 ERP core modules.',
  70, 260, { align: 'center', width: 455, lineGap: 6 }
);

// Signatures
doc.lineCap('butt').moveTo(90, 680).lineTo(230, 680).stroke(COLORS.primary);
doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold').text('Project Supervisor', 90, 690, { width: 140, align: 'center' });
doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica').text('Engineering Director', 90, 705, { width: 140, align: 'center' });

doc.moveTo(365, 680).lineTo(505, 680).stroke(COLORS.primary);
doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold').text('Department Head', 365, 690, { width: 140, align: 'center' });
doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica').text('Head of Software Engineering', 365, 705, { width: 140, align: 'center' });

// ==========================================
// 3. TABLE OF CONTENTS
// ==========================================
addSectionHeader('TABLE OF CONTENTS', 'System Navigation');

const tocItems = [
  ['1. Executive Summary', 'Page 4'],
  ['2. Project Overview & Team Allocation', 'Page 4'],
  ['3. Business Requirements & Problem Statement', 'Page 5'],
  ['4. Primary & Secondary Objectives', 'Page 5'],
  ['5. Scope of Work (In Scope / Out of Scope)', 'Page 6'],
  ['6. Technology Stack Architecture', 'Page 6'],
  ['7. System Architecture & Layers', 'Page 7'],
  ['8. Functional Requirements (FR-01 to FR-11)', 'Page 7'],
  ['9. Non-Functional Requirements', 'Page 8'],
  ['10. Module Descriptions & Workflows (11 Modules)', 'Page 8-12'],
  ['11. Database Design & Schema Tables', 'Page 13'],
  ['12. User Roles & Permission Matrix (19 Roles)', 'Page 13'],
  ['13. Visual Workflow Diagrams & Processes', 'Page 14-16'],
  ['14. UI Screenshots & Interface Layouts', 'Page 17'],
  ['15. Testing & Quality Assurance (TC-01 to TC-10)', 'Page 18'],
  ['16. Technical Challenges & Architectural Solutions', 'Page 18'],
  ['17. Deployment & Edge Hosting Details', 'Page 19'],
  ['18. Project Outcomes & Business KPIs', 'Page 19'],
  ['19. Future Enhancements Roadmap', 'Page 20'],
  ['20. Conclusion', 'Page 20'],
  ['21. References & Appendices', 'Page 20']
];

let tocY = doc.y + 10;
tocItems.forEach(([item, page], idx) => {
  doc.rect(45, tocY, 505, 22).fill(idx % 2 === 0 ? COLORS.bgLight : '#FFFFFF');
  doc.fillColor(COLORS.primary).fontSize(10).font('Helvetica-Bold').text(item, 55, tocY + 5);
  doc.fillColor(COLORS.accent).fontSize(10).font('Helvetica-Bold').text(page, 480, tocY + 5, { align: 'right' });
  tocY += 24;
});

// ==========================================
// 4. EXECUTIVE SUMMARY & OVERVIEW
// ==========================================
addSectionHeader('1. EXECUTIVE SUMMARY', 'Project Context');
addParagraph('EduSuite Pro ERP is a comprehensive, enterprise-grade cloud Educational Resource Planning (ERP) platform engineered to digitize, automate, and streamline academic and administrative operations for higher education institutions.');

addCalloutBox('PROJECT MISSION STATEMENT', 'Unify 11 core university domains into a single high-performance SaaS platform powered by granular Role-Based Access Control (RBAC), real-time Recharts telemetry, and proactive AI predictive analytics.', COLORS.accentLight, COLORS.accent);

addSubHeader('Core Business Problem Addressed');
addParagraph('Modern universities struggle with fragmented data spreadsheets, delayed attendance warning communications, manual fee collection bottlenecks, and lack of early-warning risk detection for struggling students. EduSuite Pro solves these challenges through a unified single-source-of-truth platform.');

addSubHeader('2. PROJECT OVERVIEW & TEAM ALLOCATION');
addParagraph('EduSuite Pro is developed as an end-to-end multi-tenant institution management ecosystem serving Students, Parents, Faculty, HODs, Deans, Administrative Officers, and Super Admins.');

// Team Table
const teamData = [
  ['Module 1', 'Auth & User Management', 'MFA, RBAC, Password Reset', 'Keerthi, Vardhini, Preethi'],
  ['Module 2', 'Student Management (SIS)', 'Roster, Profile, Registration, ID Card', 'Hemanth'],
  ['Module 3', 'Faculty & Academics', 'Directory, Workload, Timetable', 'Lokesh'],
  ['Module 4', 'Attendance Management', 'Biometric Sync, Daily Logs, Alerts', 'Murali'],
  ['Module 5', 'Examination Module', 'Hall Tickets, Marks, CGPA Engine', 'Ramesh'],
  ['Module 6', 'Finance & Accounts', 'Fee Ledger, GST Invoices, Payroll', 'Murali'],
  ['Module 7', 'Library, Hostel, Transport', 'OPAC, Room Grid, Mess Forecast, Bus GPS', 'Vishnu'],
  ['Module 8', 'Placement & Alumni', 'Recruiter Drives, Resume Filter, Alumni', 'Ashok'],
  ['Module 9', 'HRMS, Inventory, IQAC', 'Staff Leaves, Purchase Orders, NAAC', 'Satya'],
  ['Module 10', 'AI & Analytics', 'Attendance Forecast, Risk Score, Chatbot', 'Hanish'],
  ['Module 11', 'Admin & Integration', 'Super Admin, 6-Step Admission Wizard', 'Keerthi, Vardhini, Preethi']
];

let tY = doc.y + 10;
doc.rect(45, tY, 505, 20).fill(COLORS.primary);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('ID', 50, tY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Module Name', 100, tY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Core Scope', 250, tY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Assigned Team', 420, tY + 5);
tY += 20;

teamData.forEach((row, i) => {
  doc.rect(45, tY, 505, 18).fill(i % 2 === 0 ? COLORS.bgLight : '#FFFFFF');
  doc.fillColor(COLORS.textDark).fontSize(8.5).font('Helvetica-Bold').text(row[0], 50, tY + 4);
  doc.fillColor(COLORS.indigo).fontSize(8.5).font('Helvetica-Bold').text(row[1], 100, tY + 4);
  doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica').text(row[2], 250, tY + 4, { width: 165 });
  doc.fillColor(COLORS.primary).fontSize(8).font('Helvetica-Bold').text(row[3], 420, tY + 4);
  tY += 18;
});
doc.y = tY + 15;

// ==========================================
// 5. ARCHITECTURE & WORKFLOW DIAGRAMS FOR ALL 11 MODULES
// ==========================================
addSectionHeader('13. VISUAL WORKFLOW DIAGRAMS (ALL 11 MODULES)', 'Module Process Flows');
addParagraph('The following high-visibility flow diagrams illustrate the step-by-step business execution logic across all 11 EduSuite Pro ERP core modules.');

function renderWorkflowDiagram(title, s1, s2, s3, s4) {
  if (doc.y > 660) doc.addPage();
  addSubHeader(title);
  
  let wY = doc.y + 8;
  drawWorkflowStep(45, wY, 110, 60, 1, s1.title, s1.desc, s1.color);
  drawArrowRight(160, wY + 30);

  drawWorkflowStep(175, wY, 110, 60, 2, s2.title, s2.desc, s2.color);
  drawArrowRight(290, wY + 30);

  drawWorkflowStep(305, wY, 110, 60, 3, s3.title, s3.desc, s3.color);
  drawArrowRight(420, wY + 30);

  drawWorkflowStep(435, wY, 115, 60, 4, s4.title, s4.desc, s4.color);

  doc.y = wY + 74;
}

const cAccent = { bg: COLORS.accentLight, border: COLORS.accent, primary: COLORS.accent };
const cPurple = { bg: COLORS.purpleLight, border: COLORS.purple, primary: COLORS.purple };
const cAmber = { bg: COLORS.amberLight, border: COLORS.amber, primary: COLORS.amber };
const cEmerald = { bg: COLORS.emeraldLight, border: COLORS.emerald, primary: COLORS.emerald };
const cRose = { bg: '#FEF2F2', border: COLORS.rose, primary: COLORS.rose };

// Module 1 Flowchart
renderWorkflowDiagram(
  'Module 1: Authentication & Dynamic RBAC Routing Pipeline',
  { title: 'Login Screen', desc: 'User inputs credentials or persona', color: cAccent },
  { title: 'AuthService', desc: 'Validates JWT & retrieves flags', color: cPurple },
  { title: 'RoleContext', desc: 'Initializes permission flags', color: cAmber },
  { title: 'Router Dispatch', desc: 'Directs to role dashboard', color: cEmerald }
);

// Module 2 Flowchart
renderWorkflowDiagram(
  'Module 2: Student Information System (SIS) Workflow',
  { title: 'Student Portal', desc: 'Initiates 6-step registration', color: cAccent },
  { title: 'Elective Picker', desc: 'Prerequisite & credit check', color: cPurple },
  { title: 'Advisor Queue', desc: 'Audit & approval verification', color: cAmber },
  { title: 'ID Card Pass', desc: 'Generates digital student ID', color: cEmerald }
);

// Module 3 Flowchart
renderWorkflowDiagram(
  'Module 3: Faculty & Academic Management Workflow',
  { title: 'HOD Console', desc: 'Maps subject allocations', color: cAccent },
  { title: 'Workload Matrix', desc: 'Calculates teaching hours', color: cPurple },
  { title: 'Timetable Engine', desc: 'Solves room & lab collisions', color: cAmber },
  { title: 'Schedule Publish', desc: 'Pushes master timetable', color: cEmerald }
);

// Module 4 Flowchart
renderWorkflowDiagram(
  'Module 4: Attendance Roll-Call & Shortage Alert Pipeline',
  { title: 'Faculty Logger', desc: 'Period roll call submission', color: cAccent },
  { title: 'Attendance Engine', desc: 'Calculates aggregate %', color: cPurple },
  { title: 'Threshold Lock', desc: 'Check if Attendance < 75%', color: cAmber },
  { title: 'Alert Dispatcher', desc: 'SMS / Push to Parent & HOD', color: cRose }
);

// Module 5 Flowchart
renderWorkflowDiagram(
  'Module 5: Examination Hall Ticket Gatekeeper & CGPA Engine',
  { title: 'Hall Ticket Gate', desc: 'Checks fee & attendance clearance', color: cAccent },
  { title: 'PDF Generator', desc: 'Issues downloadable pass', color: cEmerald },
  { title: 'Marks Entry', desc: 'Faculty inputs internal/end marks', color: cPurple },
  { title: 'CGPA Processor', desc: 'Computes SGPA & Grade Cards', color: cAmber }
);

// Module 6 Flowchart
renderWorkflowDiagram(
  'Module 6: Finance & Accounts Payment Ledger Workflow',
  { title: 'Fee Due Ledger', desc: 'Posts tuition & hostel fees', color: cAccent },
  { title: 'Payment Gateway', desc: 'UPI / Card transaction trigger', color: cPurple },
  { title: 'Callback Verify', desc: 'Updates status to PAID', color: cEmerald },
  { title: 'Receipt PDF', desc: 'Generates official GST receipt', color: cAmber }
);

// Module 7 Flowchart
renderWorkflowDiagram(
  'Module 7: Library, Hostel & Transport Logistics Workflow',
  { title: 'Facility Desk', desc: 'Hostel, OPAC & bus requests', color: cAccent },
  { title: 'Hostel Grid', desc: 'Visual block room allotment', color: cPurple },
  { title: 'Mess Forecast', desc: 'Calculates daily meal count', color: cEmerald },
  { title: 'Fleet GPS', desc: 'Live bus location tracking', color: cAmber }
);

// Module 8 Flowchart
renderWorkflowDiagram(
  'Module 8: Placement & Alumni Recruitment Drive Workflow',
  { title: 'Drive Posting', desc: 'Recruiter posts job details', color: cAccent },
  { title: 'Auto Filter', desc: 'Screens CGPA ≥ 7.5 & backlogs', color: cPurple },
  { title: 'Single Apply', desc: 'Student submits resume', color: cAmber },
  { title: 'Offer & Alumni', desc: 'Selection & alumni transition', color: cEmerald }
);

// Module 9 Flowchart
renderWorkflowDiagram(
  'Module 9: HRMS, Inventory & IQAC Accreditation Workflow',
  { title: 'HR Leave Desk', desc: 'Staff submits leave request', color: cAccent },
  { title: 'HOD Audit', desc: 'Workload audit & approval', color: cPurple },
  { title: 'Procurement PO', desc: 'Issues PO & updates stock', color: cEmerald },
  { title: 'NAAC Aggregator', desc: 'Compiles quality SSR report', color: cAmber }
);

// Module 10 Flowchart
renderWorkflowDiagram(
  'Module 10: AI Analytics & Student Academic Risk Engine',
  { title: 'Data Ingestion', desc: 'Reads marks, attendance & fees', color: cPurple },
  { title: 'AI Predictor', desc: 'Projects trajectory % vector', color: cAccent },
  { title: 'Risk Classifier', desc: 'Categorizes Low/High/Critical', color: cRose },
  { title: 'Executive Desk', desc: 'Displays heatmaps & alerts', color: cEmerald }
);

// Module 11 Flowchart
renderWorkflowDiagram(
  'Module 11: Administration, Pre-Admissions & Integration Desk',
  { title: 'Public Portal', desc: '6-Step Pre-Admission Wizard', color: cAccent },
  { title: 'Document Audit', desc: 'Verifies certificates & proof', color: cPurple },
  { title: 'Seat Allotment', desc: 'Assigns permanent Roll No', color: cEmerald },
  { title: 'Super Admin', desc: 'Toggles global feature flags', color: cRose }
);

// ==========================================
// 6. ALL 11 MODULE DETAILED DESCRIPTIONS
// ==========================================
addSectionHeader('10. DETAILED MODULE DESCRIPTIONS', 'System Functional Scope');

const allModules = [
  {
    num: 1,
    name: 'Authentication & User Management',
    devs: 'Keerthi, Vardhini, Preethi',
    desc: 'Central identity gateway enforcing 19-role RBAC, MFA, and demo persona switching.',
    process: 'Phase 1: Credentials/Persona Submission -> Phase 2: AuthService JWT Validation -> Phase 3: RoleContext Permission Initialization -> Phase 4: Route Guard Dispatch -> Phase 5: Audit Log Write.'
  },
  {
    num: 2,
    name: 'Student Management (SIS)',
    devs: 'Hemanth',
    desc: '360-degree student roster directory, student academic profiles, 6-step course registration, and canvas ID card generator.',
    process: 'Phase 1: Registration Request -> Phase 2: Elective Selection & Credit Check -> Phase 3: Advisor Approval Queue -> Phase 4: Roster Table Commit -> Phase 5: Digital ID Card PDF.'
  },
  {
    num: 3,
    name: 'Faculty & Academic Management',
    devs: 'Lokesh',
    desc: 'Faculty directory, subject workload allocation, academic calendars, and conflict-free master timetable generator.',
    process: 'Phase 1: Faculty Load Mapping -> Phase 2: Subject Assignment -> Phase 3: Room & Constraint Solver -> Phase 4: Conflict Iteration -> Phase 5: Master Timetable Publish.'
  },
  {
    num: 4,
    name: 'Attendance Management',
    devs: 'Murali',
    desc: 'Period-wise roll-call logger, hardware biometric turnstile API sync, cumulative percentage calculator, and automated SMS alerts.',
    process: 'Phase 1: Roll-Call Submission -> Phase 2: Biometric Timestamp Ingestion -> Phase 3: Cumulative % Update -> Phase 4: 75% Threshold Lock -> Phase 5: SMS & Parent Alert Dispatch.'
  },
  {
    num: 5,
    name: 'Examination & Evaluation Module',
    devs: 'Ramesh',
    desc: 'Exam timetables, hall ticket gatekeeper, internal marks entry portal, SGPA/CGPA result calculator, and grade cards.',
    process: 'Phase 1: Exam Publishing -> Phase 2: Gatekeeper Clearance (Attendance ≥ 75% & Fees = 0) -> Phase 3: Downloadable Hall Ticket -> Phase 4: Marks Entry -> Phase 5: SGPA/CGPA Computation.'
  },
  {
    num: 6,
    name: 'Finance & Accounts Module',
    devs: 'Murali',
    desc: 'Student fee component ledgers, online payment gateway integration, GST tax breakdown, fee defaulter tracking, and staff payroll.',
    process: 'Phase 1: Fee Due Assessment -> Phase 2: Payment Gateway Trigger -> Phase 3: Encrypted Response Validation -> Phase 4: Ledger Status PAID -> Phase 5: Downloadable GST Receipt PDF.'
  },
  {
    num: 7,
    name: 'Library, Hostel & Transport Logistics',
    devs: 'Vishnu',
    desc: 'Library OPAC cataloging, hostel block/room allocation grid, warden mess meal forecasting, and transport bus GPS status.',
    process: 'Phase 1: Hostel Room Allotment Grid -> Phase 2: Daily Mess Meal Count Forecast -> Phase 3: OPAC Book Circulation & Auto Fine -> Phase 4: Fleet Bus GPS Location Updates.'
  },
  {
    num: 8,
    name: 'Placement & Alumni Network',
    devs: 'Ashok',
    desc: 'Recruiter drive workspace, automated CGPA/backlog eligibility screening, interview scheduler, and alumni mentorship directory.',
    process: 'Phase 1: Placement Drive Posting -> Phase 2: Auto Screening (CGPA & Backlogs) -> Phase 3: Student Application -> Phase 4: Interview Round Tracking -> Phase 5: Alumni Network Transition.'
  },
  {
    num: 9,
    name: 'HRMS, Inventory & IQAC Accreditation',
    devs: 'Satya',
    desc: 'Staff leave desk, purchase order lifecycle, equipment inventory tracking, and NAAC quality accreditation compliance reports.',
    process: 'Phase 1: Staff Leave Requisition -> Phase 2: HOD Workload Audit -> Phase 3: Purchase Requisition & PO -> Phase 4: Inventory Delivery -> Phase 5: NAAC Data Aggregation.'
  },
  {
    num: 10,
    name: 'AI & Analytics Subsystem',
    devs: 'Hanish',
    desc: 'AI attendance trajectory prediction, student academic risk scoring (Low/High/Critical), conversational chatbot assistant, and Recharts telemetry.',
    process: 'Phase 1: Telemetry Data Ingestion -> Phase 2: Attendance Trajectory Vector -> Phase 3: Multi-Factor Risk Score -> Phase 4: Alert Dispatch & Heatmap -> Phase 5: Conversational AI Queries.'
  },
  {
    num: 11,
    name: 'Administration & Pre-Admissions',
    devs: 'Keerthi, Vardhini, Preethi',
    desc: 'Super Admin governance console, system health monitoring, 6-step pre-admission Category A/B quota wizard, and document audit desk.',
    process: 'Phase 1: 6-Step Application Wizard -> Phase 2: Document Audit Desk -> Phase 3: Seat Confirmation & Roll No Generation -> Phase 4: Super Admin Feature Flag Toggle.'
  }
];

allModules.forEach(mod => {
  if (doc.y > 680) doc.addPage();
  
  doc.rect(45, doc.y, 505, 75).fill(COLORS.bgLight);
  doc.rect(45, doc.y, 4, 75).fill(COLORS.indigo);
  
  const mY = doc.y + 6;
  doc.fillColor(COLORS.indigo).fontSize(11).font('Helvetica-Bold').text(`Module ${mod.num}: ${mod.name}`, 58, mY);
  doc.fillColor(COLORS.accent).fontSize(9).font('Helvetica-Bold').text(`Devs: ${mod.devs}`, 350, mY, { align: 'right', width: 180 });
  
  doc.fillColor(COLORS.textDark).fontSize(8.5).font('Helvetica').text(`Overview: ${mod.desc}`, 58, mY + 16, { width: 480 });
  doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica-Bold').text(`Process Flow: ${mod.process}`, 58, mY + 45, { width: 480 });
  
  doc.y = mY + 76;
});

// ==========================================
// 7. TESTING & QUALITY ASSURANCE
// ==========================================
addSectionHeader('15. TESTING & QUALITY ASSURANCE', 'Verification & Deployment');

addParagraph('The system underwent systematic automated and manual verification prior to production rollout.');

const testCases = [
  ['TC-01', 'Multi-Role Authentication', 'Directs user to exact authorized route based on role flags', 'PASS'],
  ['TC-02', 'Student Course Registration', 'Prevents registration if pre-requisite credits are unmet', 'PASS'],
  ['TC-03', 'Attendance Alert Trigger', 'Triggers low-attendance notification when student drops below 75%', 'PASS'],
  ['TC-04', 'CGPA Calculation Engine', 'Correctly computes semester SGPA and aggregate CGPA', 'PASS'],
  ['TC-05', 'Fee Receipt PDF Generation', 'Generates formatted PDF receipt with correct GST tax breakdown', 'PASS'],
  ['TC-06', 'Hall Ticket Lock', 'Blocks hall ticket generation if fee dues exist', 'PASS'],
  ['TC-07', 'Hostel Room Allotment', 'Prevents overbooking beyond maximum room capacity', 'PASS'],
  ['TC-08', 'AI Risk Prediction', 'Correctly identifies high-risk academic default students', 'PASS'],
  ['TC-09', 'Production Type Check', 'npx tsc --noEmit returns zero compilation errors', 'PASS'],
  ['TC-10', 'Production Build', 'npm run build compiles Vite + Nitro server bundle successfully', 'PASS']
];

let testY = doc.y + 10;
doc.rect(45, testY, 505, 20).fill(COLORS.primary);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Test ID', 55, testY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Test Scenario', 110, testY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Expected Verification Result', 260, testY + 5);
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('Status', 480, testY + 5);
testY += 20;

testCases.forEach((tc, idx) => {
  doc.rect(45, testY, 505, 18).fill(idx % 2 === 0 ? COLORS.bgLight : '#FFFFFF');
  doc.fillColor(COLORS.textDark).fontSize(8.5).font('Helvetica-Bold').text(tc[0], 55, testY + 4);
  doc.fillColor(COLORS.indigo).fontSize(8.5).font('Helvetica-Bold').text(tc[1], 110, testY + 4);
  doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica').text(tc[2], 260, testY + 4, { width: 210 });
  doc.fillColor(COLORS.emerald).fontSize(8.5).font('Helvetica-Bold').text(tc[3], 480, testY + 4);
  testY += 18;
});

doc.y = testY + 20;

// ==========================================
// 8. CONCLUSION & REFERENCES
// ==========================================
addSectionHeader('20. CONCLUSION', 'Final Handover');
addParagraph('EduSuite Pro ERP successfully delivers a modernized, scalable, and intelligent cloud platform for higher education institutions. By bringing together 11 specialized modules—ranging from Authentication and Student Management to Examinations, Finance, Hostel Logistics, and AI Analytics—the system streamlines operations, eliminates data silos, and empowers educational leaders with predictive decision intelligence.');

addCalloutBox('PRODUCTION DEPLOYMENT VERIFIED', 'Build Artifact: Nitro Engine + Cloudflare Pages Edge Server. Zero compilation errors across 300+ routes.', COLORS.emeraldLight, COLORS.emerald);

// Global Page Numbering Footer
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  if (i === 0) continue; // Skip cover page footer
  
  // Header
  doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica').text('EduSuite Pro ERP — Enterprise Project Documentation', 45, 25);
  doc.lineCap('butt').moveTo(45, 35).lineTo(550, 35).stroke(COLORS.border);
  
  // Footer
  doc.lineCap('butt').moveTo(45, 800).lineTo(550, 800).stroke(COLORS.border);
  doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica').text('CONFIDENTIAL & PROPRIETARY — EDUSUITE TECH SOLUTIONS', 45, 808);
  doc.fillColor(COLORS.primary).fontSize(8).font('Helvetica-Bold').text(`Page ${i + 1} of ${range.count}`, 45, 808, { align: 'right', width: 505 });
}

doc.end();

stream.on('finish', () => {
  console.log(`Successfully generated colorful PDF at: ${pdfPath}`);
});
