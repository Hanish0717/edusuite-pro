# EduSuite Pro — AI-Powered College ERP SaaS Platform

**EduSuite Pro** is a modern, enterprise-grade cloud platform designed to digitize, automate, and streamline campus operations for higher education institutions. Built on a multi-tenant SaaS architecture, it connects administrators, deans, faculty, students, parents, corporate recruiters, and alumni within a unified digital ecosystem.

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+), `bun` (v1+), or `pnpm`
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd edusuite-pro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or using bun
   bun install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or using bun
   bun run dev
   ```
   The local dev server will launch at:
   - `http://localhost:3000` (or `http://localhost:5173` depending on port availability)

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

6. **Linting & Code Formatting**
   ```bash
   npm run lint       # Run ESLint checks
   npm run format     # Format code with Prettier
   ```

---

## 🛠 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router) / [Vite](https://vitejs.dev/) / React 19
- **Routing**: `@tanstack/react-router` (File-based routing)
- **Styling**: Tailwind CSS v4, Vanilla CSS design tokens, Radix UI primitive components
- **Icons**: `lucide-react`
- **State & Query**: `@tanstack/react-query`, Context API (`role-context.tsx`)
- **Charts & Data Viz**: `recharts`
- **Form & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Target Runtime / Deploy**: Cloudflare Workers / Nitro via Wrangler

---

## 📌 Featured Specialized Modules

---

### 1. 💼 Recruiter Module

The **Recruiter Module** provides an external portal workspace for corporate recruiters, talent acquisition teams, and industry partners to collaborate directly with campus placement cells.

#### Key Workflows & Features:
* **Recruiter Portal Workspace** ([recruiter-portal-workspace.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/recruiter-portal-workspace.tsx)):
  * Customized dashboard displaying active job postings, application metrics, upcoming assessment sessions, and scheduled interview tracks.
* **Company & Recruiter Profile** ([recruiter-management.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/recruiter-management.tsx), [company-management.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/company-management.tsx)):
  * Manage organization branding, company bio, office locations, domain specializations, HR contacts, and verified accreditation status.
* **Job & Internship Drive Posting**:
  * Post full-time roles, internships, and PPO (Pre-Placement Offer) opportunities with custom CTC packages, stipend details, job locations, and eligibility criteria (CGPA thresholds, branch restrictions, backlog limits).
* **Assessment & Test Requests** ([assessment-requests-approval-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/assessment-requests-approval-page.tsx), [assessment-session-management-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/assessment-session-management-page.tsx)):
  * Submit online assessment slot requests (Aptitude, Technical, Coding challenges) directly to the Placement Dean for schedule approval, venue allocation, and proctoring setup.
* **Applicant Review & Shortlisting**:
  * Filter candidate applications by branch, CGPA, technical skills, and resume score. Move applicants across hiring funnel stages (Applied $\rightarrow$ Shortlisted $\rightarrow$ Assessment Passed $\rightarrow$ Interview $\rightarrow$ Offered).
* **Interview Scheduling** ([placement-interviews-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-interviews-page.tsx)):
  * Schedule technical, managerial, and HR interview rounds with panelist assignments, time slot allocation, virtual meeting links, and candidate feedback scorecards.
* **Offer Letter Management** ([placement-offers-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-offers-page.tsx)):
  * Issue official digital offer letters with detailed compensation breakdown (fixed pay, joining bonus, performance incentives) and track candidate acceptance/rejection status in real time.

---

### 2. 🎓 Placement Officer (Placement Dean) Module

The **Placement Officer Module** empowers Placement Deans, TPO officers, and placement coordinators to manage campus recruitment drives, student eligibility, training programs, and recruiter relationships.

#### Key Workflows & Features:
* **Placement Command Center** ([placement-dashboard.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-dashboard.tsx), [PlacementDeanView.tsx](file:///d:/college/edusuite-pro/src/modules/deans/PlacementDeanView.tsx)):
  * Real-time KPIs tracking overall placement percentage, average CTC, highest package, unplaced student count, active drives, and upcoming company visits.
* **Drive Management** ([drive-management.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/drive-management.tsx), [placement.drives.tsx](file:///d:/college/edusuite-pro/src/routes/placement.drives.tsx)):
  * Orchestrate end-to-end on-campus, pool, and off-campus recruitment drives. Define drive timelines, register participating companies, set eligibility criteria, and publish drive circulars to eligible students.
* **Student Registry & Eligibility Gatekeeper** ([placement-students-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-students-page.tsx), [staff.placement-dean.eligible-students.tsx](file:///d:/college/edusuite-pro/src/routes/staff.placement-dean.eligible-students.tsx)):
  * Monitor batch eligibility, aggregate student academic records (CGPA, active backlogs, attendance), manage placement policy exemptions, and approve registered candidate lists.
* **Assessment & Infrastructure Approvals**:
  * Review and approve test slot requests submitted by corporate recruiters, assign lab computer facilities, setup online exam keys ([shared-assessment-store.ts](file:///d:/college/edusuite-pro/src/lib/shared-assessment-store.ts)), and deploy invigilator staff.
* **Skill Development & Mock Training** ([staff.placement-dean.aptitude-training.tsx](file:///d:/college/edusuite-pro/src/routes/staff.placement-dean.aptitude-training.tsx), [staff.placement-dean.coding-training.tsx](file:///d:/college/edusuite-pro/src/routes/staff.placement-dean.coding-training.tsx)):
  * Organize aptitude classes, technical bootcamp sessions, soft skill workshops, and AI/peer mock interview sessions for candidates.
* **Placement Analytics & Reports** ([placement-analytics-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-analytics-page.tsx), [placement-reports-page.tsx](file:///d:/college/edusuite-pro/src/components/dashboard/role/placement-reports-page.tsx)):
  * Generate branch-wise placement breakdown graphs, sector-wise hiring trends (IT, Core, Finance, Consulting), salary distribution bands, and NIRF / NAAC compliant accreditation reports.
* **Corporate Partnerships & MoUs** ([staff.placement-dean.mous.tsx](file:///d:/college/edusuite-pro/src/routes/staff.placement-dean.mous.tsx)):
  * Track active Memorandum of Understanding (MoU) contracts, industry guest speaker engagements, and long-term hiring partnerships.

---

### 3. 🌐 Alumni Module

The **Alumni Module** bridges the gap between institutional alumni, current students, faculty, and campus placement cells. It serves as a full-featured network for career advancement, mentorship, fundraising, and alumni verification.

#### Key Workflows & Features:
* **Alumni Portal Workspace** ([alumni.tsx](file:///d:/college/edusuite-pro/src/routes/alumni.tsx)):
  * Unified portal supporting dual perspectives for alumni members and institutional Alumni Relations Coordinators.
* **Directory & Verification Queue** ([AlumniDirectoryView](file:///d:/college/edusuite-pro/src/pages/alumni/Directory/AlumniDirectoryView.tsx), [AlumniVerificationQueueView](file:///d:/college/edusuite-pro/src/pages/alumni/VerificationQueue/AlumniVerificationQueueView.tsx)):
  * Searchable alumni database with filters by graduation year, department, current company, role, and geographic location. Includes a multi-stage admin verification queue for identity confirmation before granting directory access.
* **Job Referral & Opportunity Hub** ([AlumniCareerView](file:///d:/college/edusuite-pro/src/pages/alumni/Career/AlumniCareerView.tsx), [PostJobForm](file:///d:/college/edusuite-pro/src/components/alumni/forms/PostJobForm.tsx)):
  * Enables alumni to post internal job referrals, lateral openings, and internship roles directly for current students and recent graduates.
* **Alumni-Student Mentorship Program** ([AlumniMentorshipView](file:///d:/college/edusuite-pro/src/pages/alumni/Mentorship/AlumniMentorshipView.tsx)):
  * Mentorship matching system based on domain expertise (Software, Hardware, Finance, Higher Studies). Enables students to request 1-on-1 career guidance sessions and resume reviews.
* **Alumni Placement Collaboration** ([AlumniPlacementCollaborationView](file:///d:/college/edusuite-pro/src/pages/alumni/PlacementCollaboration/AlumniPlacementCollaborationView.tsx)):
  * Facilitates alumni-driven recruitment drives where alumni refer their current employers for campus placement drives and campus interviews.
* **Events, Reunions & Guest Lectures** ([AlumniEventsView](file:///d:/college/edusuite-pro/src/pages/alumni/Events/AlumniEventsView.tsx), [AlumniGuestLecturesView](file:///d:/college/edusuite-pro/src/pages/alumni/GuestLectures/AlumniGuestLecturesView.tsx)):
  * Organize alumni reunions, technical webinars, panel discussions, and guest lecture sessions.
* **Donations & Institutional Campaigns** ([AlumniDonationsView](file:///d:/college/edusuite-pro/src/pages/alumni/Donations/AlumniDonationsView.tsx)):
  * Secure fundraising platform for campus infrastructure, student scholarships, research grants, and lab modernization. Displays real-time progress bars and top contributor leaderboards.
* **Batchmate Invitations & Networking** ([InviteBatchmateModal](file:///d:/college/edusuite-pro/src/components/alumni/dialogs/InviteBatchmateModal.tsx), [AlumniStudentNetworkingView](file:///d:/college/edusuite-pro/src/pages/alumni/StudentNetworking/AlumniStudentNetworkingView.tsx)):
  * Send email invitations to batchmates and engage in Q&A discussion forums with active students.

---

## 📊 Summary of What Has Been Completed Up To Now

EduSuite Pro has evolved into a comprehensive college ERP ecosystem. Below is an overview of the core architectural foundations and functional modules built so far:

> 💡 **Featured Workflow Documentation:** Detailed technical specifications and workflows for the **Hostel**, **Library**, and **Transport** modules developed in the **Super Admin Module** can be found in [README_SUPER_ADMIN_MODULES.md](file:///c:/Users/netaj/OneDrive/Desktop/EDU/edusuite-pro/README_SUPER_ADMIN_MODULES.md).

Below is the complete Product Requirements Document (PRD) and platform specification.

Product Requirements Document (PRD)

Project Name

EduSuite Pro – AI Powered College ERP SaaS Platform

Product Overview

EduSuite Pro is a modern cloud-based College ERP platform designed to digitize and automate every academic and administrative process of educational institutions.

The platform provides a unified ecosystem where administrators, faculty, students, parents, and external users access role-specific dashboards through a single authentication system.

The application follows a Software-as-a-Service (SaaS) architecture with support for multiple institutions, multiple campuses, departments, and scalable user management.

Vision

Build the most intelligent, secure, scalable, and user-friendly College ERP platform powered by AI.

Product Goals

Digitize complete campus operations

Reduce paperwork

Automate approvals

Improve communication

Centralize institutional data

Provide AI-powered insights

Enable real-time reporting

Support multiple colleges from one platform

Target Users

Super Admin

Platform owner.

Staff

Faculty and all employees.

Student

Registered students.

Parent

Parents or guardians.

External Users

Applicants, recruiters, alumni, vendors.

Core Login Roles

Only five login roles exist:

Super Admin

Staff

Student

Parent

External User

Additional responsibilities are assigned using privilege flags.

Examples:

Principal

Vice Principal

Dean

HOD

Exam Controller

Placement Officer

Finance Officer

HR Manager

Hostel Warden

Library Admin

Transport Officer

Mentor

Academic Coordinator

Non-Teaching Staff

Product Modules

Authentication

Login

Logout

Forgot Password

Reset Password

MFA Ready

Session Management

Dashboard

Different dashboard for each role.

Widgets include:

KPIs

Charts

Notifications

Pending Tasks

Calendar

AI Insights

Admissions

Applications

Document Verification

Admission Approval

Student Registration

Fee Collection

Enrollment

Student Information System

Student Profile

Academic History

Personal Details

Guardian Details

Documents

Attendance Summary

Fee Summary

Academic Management

Departments

Courses

Subjects

Semester

Curriculum

Academic Calendar

Faculty ERP

Faculty Profile

Workload

Attendance

Leave

Payroll

Performance

Attendance

Daily Attendance

Subject Attendance

Lab Attendance

AI Attendance Prediction

Attendance Reports

Parent Notifications

Timetable

Faculty Timetable

Student Timetable

Classroom Allocation

Lab Allocation

LMS

Notes

Videos

Assignments

Quizzes

Course Materials

Discussions

Examination

Exam Creation

Hall Tickets

Seating Plan

Internal Marks

External Marks

Result Processing

Grade Book

Finance

Fee Collection

Scholarships

Receipts

Accounting

Vendor Payments

HRMS

Employee Records

Leave

Payroll

Recruitment

Performance Review

Library

Books

Issue

Return

Fine

Digital Library

Hostel

Room Allocation

Mess

Complaints

Visitors

Attendance

Transport

Bus Routes

Vehicles

Drivers

Student Bus Passes

GPS Tracking

Placement

Companies

Drives

Applications

Offers

Placement Statistics

Inventory

Assets

Stock

Purchase

Vendors

Communication

Email

SMS

Push Notifications

Announcements

Circulars

Grievance

Complaint Registration

Tracking

Resolution

Feedback

Alumni

Alumni Directory

Events

Donations

Networking

Reports

Student Reports

Attendance Reports

Financial Reports

Placement Reports

Academic Reports

AI Assistant

The AI Assistant should help users by:

Answering ERP questions

Predicting attendance shortages

Identifying at-risk students

Summarizing reports

Searching records

Providing smart recommendations

Dashboard Requirements

Super Admin

Institution Overview

User Management

Revenue

Departments

AI Analytics

System Health

Audit Logs

Staff

Timetable

Attendance

Tasks

Student List

Leave

Notifications

Student

Attendance

Courses

Assignments

Exams

Fees

Placement

AI Study Assistant

Parent

Child Attendance

Fee Status

Results

Notifications

Transport

User Management

Admin should manage:

Users

Departments

Courses

Roles

Privilege Flags

Permissions

Permission Model

Permissions are determined by:

Login Role

Department

Privilege Flags

Module Permissions

Record Ownership

Non-Functional Requirements

Responsive Design

Mobile Friendly

Accessibility (WCAG AA)

Fast Performance (<2s page load)

Secure Authentication

Audit Logging

Scalable SaaS Architecture

High Availability (99.9%)

Design Requirements

Modern SaaS Dashboard

Glassmorphism + Soft Shadows

Responsive Layout

Dark/Light Theme

Clean Typography

Professional Color Palette

Interactive Charts

Minimal Navigation

Consistent Components

Success Metrics

99.9% uptime

<2 second average response time

90% user adoption

95% paperless operations

High user satisfaction

AI prediction accuracy >90%

Future Enhancements

Mobile Apps (Android/iOS)

Video Conferencing Integration

Biometric Attendance

RFID Integration

Multi-language Support

White-label Branding

Advanced AI Copilot

Predictive Analytics

API Marketplace

Expected Outcome

The final product should be an enterprise-grade, SaaS-ready College ERP platform with:

Role-based dashboards

AI-powered automation

Multi-campus support

Secure authentication and authorization

Modular architecture

Responsive UI

Scalable backend

Professional user experience comparable to leading ERP solutions like Oracle Campus Solutions, Ellucian Banner, and modern SaaS platforms.

Yes. These are exactly the kind of assets that should be embedded into the PRD. A professional PRD for Lovable should reference them as design references, not just attach them at the end.

I recommend structuring the beginning of the PRD like this.

EduSuite Pro – Product Requirements Document (PRD)

Version: 1.0

Product: EduSuite Pro

Platform: AI Powered College ERP SaaS

Technology Stack

React + Vite

Node.js

PostgreSQL

Docker

REST API

JWT Authentication

AI Assistant

Multi-Tenant SaaS

Design References

This project follows the design language shown in the following approved references.

Reference 1 – Official Brand Identity

(Insert EduSuite Pro Logo)

Purpose

Official product logo

Brand identity

Primary blue gradient color palette

Typography reference

Application icon

Splash screen logo

Authentication pages

Reference 2 – Role Based Dashboard Architecture

(Insert College ERP Dashboard Image)

This image defines the dashboard philosophy.

The application shall include

Super Admin Dashboard

Staff Dashboard

Student Dashboard

Parent Dashboard

HOD Dashboard

Every dashboard should

Follow the same card design

Same sidebar

Same spacing

Same chart style

Same widget style

Same navbar

Same color palette

Same component system

This image becomes the single design source for dashboard development.

Reference 3 – Landing Page Design

(Insert Landing Page Image)

This landing page establishes

Hero Section

Navigation

CTA Buttons

Feature Cards

Responsive Layout

Footer

Card Shadows

White Space

Modern SaaS Feel

The EduSuite Pro landing page should follow the same structure while replacing NoteFlow branding with EduSuite Pro branding.

Reference 4 – Access Control Architecture

(Insert RBAC Architecture Image)

This diagram is the official RBAC specification.

The system shall implement

Five Login Roles

Department Scope

Privilege Flags

Module Access Matrix

Approval Workflow

Data Visibility Rules

Permission Engine

This image acts as the functional RBAC reference during development.

Brand Guidelines

Primary Color

Deep Blue

Secondary Blue

Accent Blue

White Background

Soft Gray

Cards should have

Rounded Corners

Soft Shadows

Clean Borders

Spacious Padding

Typography

Headings

Bold

Modern Sans Serif

Body

Readable

Medium Weight

Icons

Rounded

Outlined

Blue Gradient

UI Principles

The application should feel like

Linear

Notion

Microsoft 365

Atlassian

HubSpot

Salesforce

combined into a modern educational platform.

The UI must be

Premium

Minimal

Professional

Enterprise Ready

Responsive

Accessible

Fast

UX Principles

Every page should contain

Breadcrumb

Search

Notifications

User Profile

Page Title

Quick Actions

Filters

Export

AI Assistant

Responsive Tables

Sidebar Guidelines

Persistent left sidebar

Sections

Dashboard

Academic

Students

Faculty

Attendance

LMS

Examinations

Finance

Library

Hostel

Transport

Placement

Communication

Reports

AI Assistant

Administration

Settings

Sidebar must collapse on desktop and become a drawer on mobile.

Dashboard Standards

Each dashboard contains

KPI Cards

Students

Faculty

Revenue

Attendance

Performance

Fees

Approvals

Charts

Bar Charts

Pie Charts

Area Charts

Line Charts

Donut Charts

Widgets

Calendar

Tasks

Notifications

Announcements

Recent Activities

AI Insights

Quick Actions

Pending Approvals

Component Standards

Buttons

Cards

Inputs

Selects

Tables

Badges

Status Chips

Pagination

Dialogs

Drawers

Charts

Toasts

Skeleton Loaders

All components must use one unified design system.

Responsive Breakpoints

Desktop

1440px+

Laptop

1024px+

Tablet

768px+

Mobile

320px+

Layouts should adapt without changing functionality.

Animation Standards

Use subtle animations only

Fade In

Slide Up

Card Hover

Button Hover

Loading Skeleton

Smooth Page Transition

Avoid excessive motion.

Accessibility

WCAG AA Compliance

Keyboard Navigation

Screen Reader Support

High Contrast

Focus States

Semantic HTML

AI Assistant

Persistent floating AI assistant available on every authenticated page.

Capabilities

Search records

Answer ERP questions

Explain attendance

Generate reports

Summarize data

Smart recommendations

Overall Product Vision

EduSuite Pro should not resemble a traditional academic ERP. It should look and feel like a modern SaaS platform with enterprise-grade usability, combining the visual polish of your Landing Page, the consistent Dashboard Design, the structured Role-Based Access Architecture, and the official EduSuite Pro branding into a single cohesive experience.

💡 Recommendation for Lovable

Since you're using Lovable, don't just upload these images. Add them to the PRD under a dedicated "Design References (Mandatory)" section with instructions such as:

These four images are the official design references for the project. They define the visual language, dashboard layout, navigation structure, branding, RBAC architecture, and user experience. The generated application should closely follow these references while maintaining consistency across all pages. Do not change the established design system unless explicitly requested.

This gives Lovable much stronger context and significantly improves the consistency of the generated application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a848bbc-22e8-47d8-9f97-45b63bd51a89).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
                          ┌─────────────────────────────────────────┐
                          │             EDUSUITE PRO ERP            │
                          └────────────────────┬────────────────────┘
                                               │
     ┌───────────────────┬─────────────────────┼─────────────────────┬───────────────────┐
     │                   │                     │                     │                   │
┌────┴────────┐   ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐     ┌─────┴───────┐
│ Core & Auth │   │  Deans ERP  │       │  Placements │       │ Alumni Hub  │     │ Student ERP │
└─────────────┘   └─────────────┘       └─────────────┘       └─────────────┘     └─────────────┘
  • Multi-Role      • Academic Dean       • Placement Dean      • Directory         • Online Exams
  • Auth Service    • Exam Dean           • Recruiter Portal    • Mentorship        • LMS / Courses
  • RBAC & Gates    • Finance Dean        • Drive Mgmt          • Job Referrals     • Digital ID
  • Topbar & Nav    • Student Dean        • Assessments         • Verification      • Fee Tracking
                    • IQAC / IMA / R&D    • Offers & Analytics  • Donations         • Grievance
```

### 1. Architectural Foundation & Core Infrastructure
- **Role-Based Access Control (RBAC)**: Support for 5 core login roles (`super-admin`, `staff`, `student`, `parent`, `external-user`) plus granular privilege flags for specialized executive positions.
- **TanStack Start Router Architecture**: 600+ clean, type-safe file-based route definitions with sub-route dispatching, layout boundaries, and error catching.
- **Repository Pattern & State**: Decoupled service layer (`authService.ts`, `adminService.ts`, `registrationService.ts`, `shared-assessment-store.ts`).

### 2. Executive Leadership & Dean Dashboards
- **Academic Dean**: Course allocation, curriculum management, OBE/CO-PO mapping, timetable generation, faculty workload tracking, substitute faculty assignment.
- **Examination Dean**: Exam scheduling, hall ticket generation, invigilator allocation, marks entry verification, result processing, revaluation, malpractice handling.
- **Finance Dean**: Fee collection tracking, annual budget allocation, department expense approvals, payroll processing, vendor payments, audit compliance.
- **Student Affairs Dean**: Student discipline tracking, grievance redressal center, club activities, scholarships, hostel outing approvals, counseling records.
- **IQAC & Accreditation**: NAAC / NBA criteria documentation, AQAR report generation, academic quality audits, employer/alumni feedback analytics.
- **IMA & Research Deans**: Infrastructure & equipment register, lab booking schedule, AMC warranties, patents, publications, PhD scholar tracking.

### 3. Student & Parent Portal
- **Exam Taking Engine** ([exam.take.tsx](file:///d:/college/edusuite-pro/src/routes/exam.take.tsx)): Complete online assessment platform with live timer, question palette, section navigation, automatic scoring, and proctoring warnings.
- **Placement Exam Module** ([placement-exam.tsx](file:///d:/college/edusuite-pro/src/routes/placement-exam.tsx)): Online placement mock tests and company screening assessments.
- **Academics & LMS**: Digital course content, assignment submissions, lesson plans, class timetables, attendance tracking.
- **Student Profile & Digital ID Card**: Document verification status, digital ID generation with barcode/QR code, academic history.
- **Grievance Redressal System** ([grievance.tsx](file:///d:/college/edusuite-pro/src/routes/grievance.tsx)): Interactive ticket submission, escalation tracking, and status resolution drawer.

### 4. Staff & Administrative Systems
- **Faculty ERP**: Attendance marking, internal marks upload, assignment grading, syllabus tracker, leave application, research publication log.
- **Librarian ERP**: Book cataloging, circulation (issue/return), digital library management, overdue fines collection, reading hall booking.
- **Hostel ERP**: Room allocation, mess fee tracking, complaints log, gate pass outing approvals, visitor register.
- **Transport ERP**: Bus route management, passenger allocation, transport fee collection, vehicle maintenance.
- **HR & Payroll**: Employee onboarding, salary structure configuration, payslip generation, leave management.

---

## 📁 Repository Structure Overview

```text
edusuite-pro/
├── src/
│   ├── components/              # Modular UI components
│   │   ├── alumni/              # Alumni dialogs, forms, cards, tables
│   │   ├── dashboard/           # Role-specific dashboard views & topbar
│   │   │   └── role/            # Recruiter, Placement, Dean & Admin dashboards
│   │   ├── notice-board/        # Institutional announcements
│   │   ├── student-profile/     # Digital ID cards, document preview modals
│   │   └── ui/                  # Radix-UI primitive component library
│   ├── config/                  # Navigation configs, role permissions
│   ├── context/                 # Global state providers (role-context.tsx)
│   ├── data/                    # Mock data repositories & initial seeds
│   ├── lib/                     # Auth, admin, registration & assessment stores
│   ├── modules/                 # Domain-specific module definitions
│   ├── pages/                   # Page view components (Alumni sub-views)
│   ├── routes/                  # TanStack Start file-based routes
│   ├── types/                   # TypeScript interface declarations
│   ├── index.css                # Design tokens, Tailwind CSS directives
│   └── routeTree.gen.ts         # Generated route tree manifest
├── package.json                 # Project dependencies and script commands
├── vite.config.ts               # Vite configuration & TanStack plugin integration
└── README.md                    # Project documentation
```

---

## 📄 License & Attribution

**EduSuite Pro** is developed for educational institution management and enterprise campus automation. All rights reserved.
