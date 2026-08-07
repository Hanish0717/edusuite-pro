import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function makeFile(filePath, code) {
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created ${path.basename(filePath)}`);
}

function generateStandardPage(routePath, pageTitle, description, serviceFunc, dataMappingCode) {
  return `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, CheckCircle2, Building2, Users } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ${serviceFunc} } from "@/lib/deansService";

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${pageTitle} — EduSuite Pro" }],
  }),
  component: PageComponent,
});

function PageComponent() {
  const data = useMemo(() => ${serviceFunc}(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${pageTitle}</h1>
        <p className="text-sm text-muted-foreground">${description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Module Records" value="Verified" icon={Building2} tone="info" />
        <KpiCard label="Compliance Status" value="100% Valid" icon={ShieldCheck} tone="success" />
        <KpiCard label="Active Audit" value="2026-27" icon={CheckCircle2} tone="purple" />
        <KpiCard label="Status" value="Active" icon={Users} tone="warning" />
      </div>

      <Panel title="${pageTitle} Register" description="Real-time management ledger.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          ${dataMappingCode}
        </div>
      </Panel>
    </div>
  );
}
`;
}

// Map of Deans and their specific sub-routes
const deansMap = [
  {
    prefix: "staff.student-dean",
    routePrefix: "/staff/student-dean",
    service: "getStudentDeanDashboardData",
    subRoutes: [
      { name: "students", title: "Students Register", desc: "Enrolled student directory and attendance status." },
      { name: "student-profiles", title: "Student Profiles", desc: "Comprehensive student academic dossiers." },
      { name: "attendance", title: "Student Attendance", desc: "Attendance shortages and monthly metrics." },
      { name: "grievances", title: "Grievances Redressal", desc: "Student complaints, priorities and resolutions." },
      { name: "scholarships", title: "Scholarships & Freeships", desc: "Government and merit scholarship disbursements." },
      { name: "discipline", title: "Discipline & Anti-Ragging", desc: "Disciplinary committee cases and conduct logs." },
      { name: "counselling", title: "Student Counselling", desc: "Mental wellness and career guidance sessions." },
      { name: "hostel", title: "Hostels & Mess Management", desc: "Hostel block occupancy and room allotments." },
      { name: "clubs-events", title: "Clubs & Events", desc: "Student cultural, technical and NSS clubs." },
      { name: "reports", title: "Student Affairs Reports", desc: "Official student welfare and attendance reports." },
      { name: "notifications", title: "Student Dean Notifications", desc: "Student Affairs alerts and announcements." },
      { name: "settings", title: "Student Dean Settings", desc: "Portal preferences and committee contacts." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for Student Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.iqac",
    routePrefix: "/staff/iqac",
    service: "getIqacDashboardData",
    subRoutes: [
      { name: "naac", title: "NAAC A++ Accreditation", desc: "NAAC Criteria 1-7 scores and documentation." },
      { name: "nba", title: "NBA Department Accreditation", desc: "NBA Tier-1 department status and SAR dossiers." },
      { name: "aqar", title: "AQAR Filings", desc: "Annual Quality Assurance Report submissions." },
      { name: "quality-audits", title: "Internal Quality Audits", desc: "Academic and administrative quality audit logs." },
      { name: "feedback", title: "Feedback Analysis", desc: "Student, alumni and employer feedback metrics." },
      { name: "ssr", title: "SSR Metrics", desc: "Self Study Report data and targets." },
      { name: "reports", title: "IQAC Reports", desc: "Official quality assurance reports." },
      { name: "notifications", title: "IQAC Notifications", desc: "Quality audit alerts and reminders." },
      { name: "settings", title: "IQAC Settings", desc: "IQAC portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for IQAC Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.ima",
    routePrefix: "/staff/ima",
    service: "getImaDashboardData",
    subRoutes: [
      { name: "campus-projects", title: "Campus Capital Projects", desc: "Supercomputing lab, solar rooftop & infra expansion." },
      { name: "infrastructure", title: "Campus Infrastructure", desc: "Building assets and space utilization." },
      { name: "policy-directives", title: "Policy Directives", desc: "Institutional governance and IT policies." },
      { name: "compliance", title: "Regulatory Compliance", desc: "Fire safety, PCB, and electrical certificates." },
      { name: "asset-audit", title: "Capital Asset Audit", desc: "Asset inventory and audit logs." },
      { name: "reports", title: "IMA Reports", desc: "Infrastructure and governance progress reports." },
      { name: "notifications", title: "IMA Notifications", desc: "Administrative alerts and notices." },
      { name: "settings", title: "IMA Settings", desc: "IMA portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for IMA Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.research-development",
    routePrefix: "/staff/research-development",
    service: "getResearchDevelopmentDashboardData",
    subRoutes: [
      { name: "research-grants", title: "Sponsored Research Grants", desc: "DST, SERB, ISRO and MeitY research projects." },
      { name: "publications", title: "Journal Publications", desc: "SCI/Scopus research papers with impact factors." },
      { name: "patents", title: "Patents & IPR Filings", desc: "Intellectual property filings and patent grants." },
      { name: "phd-scholars", title: "PhD Research Scholars", desc: "Registered doctoral scholars, guides, and progress." },
      { name: "incubator", title: "Innovation Incubator", desc: "Startup incubation center and seed grants." },
      { name: "labs", title: "Advanced Research Labs", desc: "Specialized research laboratory facilities." },
      { name: "reports", title: "R&D Research Reports", desc: "Research publication compendiums and grant audits." },
      { name: "notifications", title: "R&D Notifications", desc: "Call-for-proposals and grant alerts." },
      { name: "settings", title: "R&D Settings", desc: "R&D portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for R&D Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.finance-dean",
    routePrefix: "/staff/finance-dean",
    service: "getFinanceDeanDashboardData",
    subRoutes: [
      { name: "department-budgets", title: "Department Budgets", desc: "Departmental budget allocations and expenditures." },
      { name: "fee-collections", title: "Fee Collections", desc: "Tuition, hostel, and transport fee ledgers." },
      { name: "expenses", title: "Institutional Expenses", desc: "Payroll, CapEx, and operational expense logs." },
      { name: "grants", title: "Grant Disbursements", desc: "Research grant disbursements and audit trails." },
      { name: "audits", title: "Financial Audits", desc: "Statutory audit clearance certificates." },
      { name: "reports", title: "Finance Reports", desc: "Annual financial balance sheets and budget reports." },
      { name: "notifications", title: "Finance Notifications", desc: "Budget threshold warnings and fee alerts." },
      { name: "settings", title: "Finance Settings", desc: "Finance Dean portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for Finance Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.examination-dean",
    routePrefix: "/staff/examination-dean",
    service: "getExaminationDeanDashboardData",
    subRoutes: [
      { name: "exam-schedules", title: "Examination Schedules", desc: "End-semester exam timetables." },
      { name: "hall-tickets", title: "Hall Ticket Generation", desc: "Hall tickets dispatch and eligibility verification." },
      { name: "grade-moderation", title: "Grade Moderation", desc: "Grade moderation committee reviews." },
      { name: "revaluation", title: "Revaluation Requests", desc: "Answer script revaluation requests and updates." },
      { name: "results", title: "Result Publishing", desc: "Result publishing SLAs and SGPA distribution." },
      { name: "transcripts", title: "Transcripts & Certificates", desc: "Official academic transcript generation." },
      { name: "reports", title: "Examination Reports", desc: "Result analysis reports and exam statistics." },
      { name: "notifications", title: "Examination Notifications", desc: "Exam cell alerts and invigilation notices." },
      { name: "settings", title: "Examination Settings", desc: "Examination Dean portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for Examination Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  },
  {
    prefix: "staff.placement-dean",
    routePrefix: "/staff/placement-dean",
    service: "getPlacementDeanDashboardData",
    subRoutes: [
      { name: "companies", title: "Recruiting Partners", desc: "Tier-1 corporate recruiter directory." },
      { name: "drives", title: "Placement Drives", desc: "Recruitment drive schedules and eligibility." },
      { name: "placed-students", title: "Placed Students Ledger", desc: "Student offer letters, CTC packages and companies." },
      { name: "packages", title: "Salary CTC Analytics", desc: "Highest, average, and median package CTC metrics." },
      { name: "mous", title: "Corporate MoUs", desc: "Tier-1 corporate MoUs and industry cell agreements." },
      { name: "internships", title: "Internship Drives", desc: "Corporate internship opportunities and stipends." },
      { name: "reports", title: "Placement Reports", desc: "Official placement statistics and recruiter feedback." },
      { name: "notifications", title: "Placement Notifications", desc: "TPO drive alerts and shortlist notices." },
      { name: "settings", title: "Placement Settings", desc: "Placement Dean portal preferences." },
      { name: "my-timetable", title: "My Timetable", desc: "Teaching schedule for Placement Dean." },
      { name: "my-classes", title: "My Classes", desc: "Today's scheduled teaching sessions." },
      { name: "faculty-timetables", title: "Faculty Timetables", desc: "Department faculty timetable inspector." },
      { name: "assign-substitute", title: "Assign Substitute Faculty", desc: "Reassign class slots to substitute faculty." },
      { name: "substitution-history", title: "Substitution History", desc: "Audit log of past faculty substitutions." },
    ]
  }
];

const sampleDataMapping = `
          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <h4 className="font-bold text-sm text-foreground">Verified Module Register</h4>
            <p className="text-xs text-muted-foreground">All records for this module are active and synchronized with the ERP backend.</p>
            <div className="flex gap-2 font-mono text-xs">
              <Badge className="bg-emerald-500/10 text-emerald-600">Active Status</Badge>
              <Badge variant="outline">ERP Synchronized</Badge>
            </div>
          </div>
`;

deansMap.forEach((dean) => {
  dean.subRoutes.forEach((sr) => {
    const fullRoutePath = `${dean.routePrefix}/${sr.name}`;
    const filename = `${dean.prefix}.${sr.name}.tsx`;
    const filePath = path.join(routesDir, filename);

    const code = generateStandardPage(
      fullRoutePath,
      sr.title,
      sr.desc,
      dean.service,
      sampleDataMapping
    );

    makeFile(filePath, code);
  });
});

console.log("All subroutes created successfully");
