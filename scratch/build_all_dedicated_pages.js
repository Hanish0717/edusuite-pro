import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeCustomPage(filename, routePath, title, subTitle, badgeCategory, serviceFunc, kpiList, tableHeaders, dataArrayJS) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Bell,
  Clock,
  Activity,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ${serviceFunc} } from "@/lib/deansService";

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${title} — EduSuite Pro" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const data = useMemo(() => ${serviceFunc}(), []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawItems = useMemo(() => {
    return ${dataArrayJS};
  }, [data]);

  const filteredItems = useMemo(() => {
    return rawItems.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchStatus =
        statusFilter === "all" ||
        (item.status && String(item.status).toLowerCase().includes(statusFilter.toLowerCase()));
      return matchSearch && matchStatus;
    });
  }, [rawItems, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  return (
    <div className="space-y-6">
      {/* PAGE TITLE BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ${badgeCategory}
            </Badge>
            <span className="text-xs text-muted-foreground">• Dedicated Module Page</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export CSV
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Printer className="size-3.5" /> Print
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
            <Plus className="size-3.5" /> Add New Record
          </Button>
        </div>
      </div>

      {/* DOMAIN SPECIFIC KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpiList[0].label}" value="${kpiList[0].val}" icon={Building2} tone="info" />
        <KpiCard label="${kpiList[1].label}" value="${kpiList[1].val}" icon={Users} tone="success" />
        <KpiCard label="${kpiList[2].label}" value="${kpiList[2].val}" icon={ShieldCheck} tone="purple" />
        <KpiCard label="${kpiList[3].label}" value="${kpiList[3].val}" icon={CheckCircle2} tone="warning" />
      </div>

      {/* FILTERABLE MAIN TABLE */}
      <Panel title="${title} Ledger" description="Official domain records & ERP status.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="active">Active / Verified</SelectItem>
                  <SelectItem value="pending">Pending / Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  ${tableHeaders.map(th => `<th className="p-3">${th}</th>`).join('')}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={${tableHeaders.length}} className="p-8 text-center text-muted-foreground text-xs">
                      No matching records found in this view.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item: Record<string, any>, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      {Object.values(item).map((val: any, cIdx: number) => (
                        <td key={cIdx} className="p-3 font-mono text-foreground">
                          {String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("resolved") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("published") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("excellent") ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                          ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("in progress") || String(val).toLowerCase().includes("open") || String(val).toLowerCase().includes("under review") ? (
                            <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs font-mono cursor-pointer"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      {/* SECONDARY CONTENT PANEL */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Domain Updates" description="Live synchronization activity.">
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-emerald-500" />
                <span className="font-bold">Module Audit Clearance</span>
              </div>
              <span className="text-muted-foreground font-mono">10 mins ago</span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span className="font-bold">ERP Synchronization Log</span>
              </div>
              <span className="text-muted-foreground font-mono">1 hour ago</span>
            </div>
          </div>
        </Panel>

        <Panel title="Module Notifications" description="System notifications and alerts.">
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-amber-500" />
                <span className="font-bold">Pending Approval Deadline</span>
              </div>
              <Badge variant="outline" className="font-mono text-[0.65rem]">High Priority</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span className="font-bold">Compliance Status Valid</span>
              </div>
              <Badge variant="outline" className="font-mono text-[0.65rem]">Verified</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, 'utf8');
  console.log(`Generated: ${filename}`);
}

// ----------------------------------------------------
// 1. IQAC PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.iqac.naac.tsx", "/staff/iqac/naac", "NAAC Accreditation Scorecard",
  "NAAC Seven Criteria scores, weights and audit readiness.", "IQAC", "getIqacDashboardData",
  [{ label: "NAAC Target", val: "3.78 A++" }, { label: "Criteria Count", val: "7 Criteria" }, { label: "Weightage Total", val: "1,000 Pts" }, { label: "Audit Pass", val: "100%" }],
  ["Criterion ID", "Criterion Description", "Weightage", "Scored Points", "Audit Level", "Status"],
  "data.naacCriteria.map(c => ({ id: c.id, criterion: c.criterion, weightage: c.weightage + ' Pts', score: c.score + ' Pts', level: 'Grade A++', status: c.status }))"
);

writeCustomPage(
  "staff.iqac.nba.tsx", "/staff/iqac/nba", "NBA Department Accreditation",
  "Tier-1 department NBA status and SAR dossiers.", "IQAC", "getIqacDashboardData",
  [{ label: "Accredited Depts", val: "12 / 15" }, { label: "SAR Dossiers", val: "Complete" }, { label: "OBE Attainment", val: "94.2%" }, { label: "Status", val: "Active" }],
  ["Dept Code", "Department Name", "Accreditation Status", "SAR Filing Date", "Validity", "Tier"],
  "[ { dept: 'CSE', name: 'Computer Science Engg', status: 'Accredited Tier-1', sarDate: '2026-03-15', validity: '6 Years', tier: 'Tier-1' }, { dept: 'ECE', name: 'Electronics & Comm', status: 'Accredited Tier-1', sarDate: '2026-04-10', validity: '6 Years', tier: 'Tier-1' }, { dept: 'ME', name: 'Mechanical Engg', status: 'Accredited Tier-1', sarDate: '2026-05-20', validity: '3 Years', tier: 'Tier-1' } ]"
);

writeCustomPage(
  "staff.iqac.aqar.tsx", "/staff/iqac/aqar", "AQAR Annual Filings",
  "Annual Quality Assurance Report submissions and desk approvals.", "IQAC", "getIqacDashboardData",
  [{ label: "AQAR Status", val: "Submitted" }, { label: "Academic Year", val: "2025-26" }, { label: "NAAC Clearance", val: "Verified" }, { label: "Audit Score", val: "4.85 / 5" }],
  ["Filing ID", "Filing Year", "Report Title", "Submission Date", "Desk Approval", "Status"],
  "[ { id: 'AQAR-2026', year: '2025-26', title: 'Institutional AQAR Dossier', date: '2026-07-01', approval: 'NAAC Approved', status: 'Verified' }, { id: 'AQAR-2025', year: '2024-25', title: 'Institutional AQAR Dossier', date: '2025-07-01', approval: 'NAAC Approved', status: 'Verified' } ]"
);

writeCustomPage(
  "staff.iqac.quality-audits.tsx", "/staff/iqac/quality-audits", "Internal Quality Audits",
  "Academic & Administrative Audit (AAA) logs and lab inspection scores.", "IQAC", "getIqacDashboardData",
  [{ label: "Total Audits", val: "24 Completed" }, { label: "Avg Audit Score", val: "4.78 / 5" }, { label: "Audit Compliance", val: "98.5%" }, { label: "Status", val: "Verified" }],
  ["Audit ID", "Department", "Audit Type", "Audit Score", "Lead Auditor", "Date"],
  "data.qualityAudits.map(q => ({ id: q.id, dept: q.dept, type: q.type, score: q.score, auditor: 'Dr. External Auditor', date: q.date }))"
);

writeCustomPage(
  "staff.iqac.feedback.tsx", "/staff/iqac/feedback", "Stakeholder Feedback Analysis",
  "Student, Alumni, Employer, and Parent feedback metrics.", "IQAC", "getIqacDashboardData",
  [{ label: "Student Feedback", val: "94.2%" }, { label: "Alumni Rating", val: "4.8 / 5" }, { label: "Employer Rating", val: "4.7 / 5" }, { label: "Status", val: "Verified" }],
  ["Stakeholder Group", "Total Respondents", "Satisfaction Rate", "Target Benchmark", "Review Status"],
  "[ { group: 'Students (UG)', count: '4,850', rate: '94.2%', target: '90.0%', status: 'Exceeds Target' }, { group: 'Alumni (2025)', count: '640', rate: '96.5%', target: '90.0%', status: 'Exceeds Target' }, { group: 'Employers (Tier 1)', count: '78', rate: '92.0%', target: '88.0%', status: 'Exceeds Target' } ]"
);

writeCustomPage(
  "staff.iqac.ssr.tsx", "/staff/iqac/ssr", "Self Study Report (SSR) Metrics",
  "Quantitative metrics and targets for institutional assessment.", "IQAC", "getIqacDashboardData",
  [{ label: "SSR Metrics", val: "115 Indicators" }, { label: "Target Compliance", val: "96.4%" }, { label: "Audit Standard", val: "NAAC Grade A++" }, { label: "Status", val: "Verified" }],
  ["Metric Code", "Indicator Description", "Target Standard", "Current Score", "Status"],
  "data.ssrMetrics.map(s => ({ code: s.code, metric: s.metricName, target: s.target, current: s.current, status: s.status }))"
);

writeCustomPage(
  "staff.iqac.reports.tsx", "/staff/iqac/reports", "IQAC Quality Reports",
  "Official quality assurance dossiers and audit publications.", "IQAC", "getIqacDashboardData",
  [{ label: "Total Reports", val: "18 Dossiers" }, { label: "NAAC Certified", val: "Yes" }, { label: "AQAR Ledger", val: "Clean Pass" }, { label: "Status", val: "Active" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.iqac.notifications.tsx", "/staff/iqac/notifications", "IQAC Notifications & Alerts",
  "Quality audit schedules, AQAR reminders, and compliance notifications.", "IQAC", "getIqacDashboardData",
  [{ label: "Active Alerts", val: "3 Reminders" }, { label: "Next Audit", val: "15 Aug 2026" }, { label: "SLA Status", val: "On Track" }, { label: "Status", val: "Active" }],
  ["Notification Title", "Message Brief", "Alert Priority", "Time"],
  "[ { title: 'NAAC Peer Team Mock Visit Scheduled', message: 'Mock audit set for August 18', priority: 'High', time: '2 hours ago' }, { title: 'AQAR 2025-26 Final Sign-off', message: 'AQAR dossier ready for Chairman sign-off', priority: 'Medium', time: '5 hours ago' } ]"
);

writeCustomPage(
  "staff.iqac.settings.tsx", "/staff/iqac/settings", "IQAC Portal Settings",
  "IQAC Cell committee composition and scoring thresholds.", "IQAC", "getIqacDashboardData",
  [{ label: "Committee Members", val: "15 Roster" }, { label: "Director IQAC", val: "Dr. Anand Kumar" }, { label: "System Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Setting Parameter", "Configured Value", "Last Modified", "Status"],
  "[ { name: 'IQAC Director Name', val: 'Prof. Anand Kumar', date: '2026-01-10', status: 'Active' }, { name: 'NAAC Audit Threshold', val: '3.50 CGPA', date: '2026-01-10', status: 'Active' } ]"
);

// ----------------------------------------------------
// 2. IMA PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.ima.campus-projects.tsx", "/staff/ima/campus-projects", "Campus Capital Projects",
  "Supercomputing lab, solar rooftop, and campus infrastructure tracker.", "IMA", "getImaDashboardData",
  [{ label: "Active Projects", val: "8 Projects" }, { label: "Total Capital", val: "₹12.4 Cr" }, { label: "Avg Progress", val: "72.5%" }, { label: "Status", val: "On Track" }],
  ["Project Name", "Allocated Budget", "Progress %", "Target Date", "Status"],
  "data.campusProjects.map(p => ({ name: p.name, budget: p.budget, progress: p.progress + '%', date: p.targetDate, status: p.progress > 80 ? 'Near Completion' : 'In Progress' }))"
);

writeCustomPage(
  "staff.ima.infrastructure.tsx", "/staff/ima/infrastructure", "Campus Infrastructure Assets",
  "Building inventory, lab floor space, and facility management.", "IMA", "getImaDashboardData",
  [{ label: "Total Buildings", val: "14 Blocks" }, { label: "Lab Floor Area", val: "120,000 sq.ft" }, { label: "Occupancy Rate", val: "94.5%" }, { label: "Status", val: "Active" }],
  ["Asset Name", "Category", "Floor Area", "Space Utilization", "Status"],
  "[ { name: 'Advanced Supercomputing Building', category: 'Academic Lab', area: '25,000 sq.ft', util: '92%', status: 'Active' }, { name: 'Central Engineering Auditorium', category: 'Auditorium', area: '18,000 sq.ft', util: '88%', status: 'Active' } ]"
);

writeCustomPage(
  "staff.ima.policy-directives.tsx", "/staff/ima/policy-directives", "Institutional Policy Directives",
  "IT security, green campus directives, and governance rules.", "IMA", "getImaDashboardData",
  [{ label: "Active Policies", val: "24 Directives" }, { label: "IT Policy", val: "Enforced" }, { label: "Green Campus", val: "Net Zero" }, { label: "Status", val: "Active" }],
  ["Directive ID", "Directive Title", "Category", "Enforcement Status"],
  "data.policyDirectives.map(pd => ({ id: pd.id, title: pd.title, category: pd.category, status: pd.status }))"
);

writeCustomPage(
  "staff.ima.compliance.tsx", "/staff/ima/compliance", "Regulatory & Safety Compliance",
  "Fire safety, PCB environmental norms, and substation certificates.", "IMA", "getImaDashboardData",
  [{ label: "Compliance Score", val: "100%" }, { label: "Fire Safety", val: "NFPA Certified" }, { label: "PCB Norms", val: "Compliant" }, { label: "Status", val: "Verified" }],
  ["Audit Area", "Regulatory Standard", "Compliance Level", "Status"],
  "data.complianceAudits.map(c => ({ area: c.area, standard: c.standard, compliance: c.compliance, status: c.status }))"
);

writeCustomPage(
  "staff.ima.asset-audit.tsx", "/staff/ima/asset-audit", "Capital Asset Audit",
  "Asset tag inventory and annual physical verification audit.", "IMA", "getImaDashboardData",
  [{ label: "Asset Pass Rate", val: "99.2%" }, { label: "Total Assets Tagged", val: "14,250" }, { label: "Valuation", val: "₹48.5 Cr" }, { label: "Status", val: "Verified" }],
  ["Asset Tag", "Asset Description", "Department", "Valuation", "Audit Status"],
  "[ { tag: 'AST-2026-001', desc: 'NVIDIA H100 GPU Supercomputing Server', dept: 'CSE AI Lab', val: '₹45 Lakhs', status: 'Verified' }, { tag: 'AST-2026-002', desc: 'Solar Inverter Unit 100kW', dept: 'Green Energy Cell', val: '₹12 Lakhs', status: 'Verified' } ]"
);

writeCustomPage(
  "staff.ima.reports.tsx", "/staff/ima/reports", "IMA Governance Reports",
  "Infrastructure masterplan progress and compliance ledgers.", "IMA", "getImaDashboardData",
  [{ label: "Total Reports", val: "12 Reports" }, { label: "Masterplan", val: "2026-2030" }, { label: "Audits", val: "100% Pass" }, { label: "Status", val: "Active" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.ima.notifications.tsx", "/staff/ima/notifications", "IMA Notifications & Notices",
  "Campus construction notices and IT maintenance alerts.", "IMA", "getImaDashboardData",
  [{ label: "Active Notices", val: "2 Alerts" }, { label: "Infra SLA", val: "99.9%" }, { label: "Security", val: "Normal" }, { label: "Status", val: "Active" }],
  ["Notice Title", "Scope", "Priority", "Date"],
  "[ { title: 'Solar Roof Grid Interconnection Test', scope: 'Campus Grid', priority: 'Medium', date: '2026-08-04' } ]"
);

writeCustomPage(
  "staff.ima.settings.tsx", "/staff/ima/settings", "IMA Portal Settings",
  "Institutional administration contacts and asset rules.", "IMA", "getImaDashboardData",
  [{ label: "IMA Dean", val: "Prof. IMA Dean" }, { label: "Asset Threshold", val: "₹50,000" }, { label: "Portal Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Parameter Name", "Configured Value", "Last Updated", "Status"],
  "[ { name: 'Campus Safety Officer', val: 'Col. R. S. Rathore', date: '2026-01-10', status: 'Active' } ]"
);

// ----------------------------------------------------
// 3. RESEARCH & DEVELOPMENT PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.research-development.research-grants.tsx", "/staff/research-development/research-grants", "Sponsored Research Grants",
  "DST, SERB, ISRO, and MeitY research grant projects ledger.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Total Grant Funds", val: "₹4.85 Cr" }, { label: "Active Grants", val: "14 Grants" }, { label: "DST Funding", val: "₹1.85 Cr" }, { label: "Status", val: "Active" }],
  ["Project Title", "Funding Agency", "Sanctioned Amount", "Status"],
  "data.topGrants.map(g => ({ title: g.title, agency: g.agency, amount: g.amount, status: g.status }))"
);

writeCustomPage(
  "staff.research-development.publications.tsx", "/staff/research-development/publications", "Journal Publications",
  "SCI and Scopus indexed research papers with impact factors.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Published Papers", val: "142 Papers" }, { label: "Avg Impact Factor", val: "9.8" }, { label: "H-Index Rating", val: "42" }, { label: "Status", val: "Verified" }],
  ["Paper Title", "Journal Name", "Impact Factor", "Authors"],
  "data.publications.map(p => ({ title: p.title, journal: p.journal, impact: p.impactFactor, authors: p.authors }))"
);

writeCustomPage(
  "staff.research-development.patents.tsx", "/staff/research-development/patents", "Patents & IPR Filings",
  "Patent registrations, published patents, and grant status.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Patents Filed", val: "18 Patents" }, { label: "Published", val: "12 Patents" }, { label: "Granted", val: "4 Patents" }, { label: "Status", val: "Active" }],
  ["Patent Title", "Patent Application No", "Filing Date", "Status"],
  "data.patents.map(pt => ({ title: pt.title, no: pt.patentNo, date: pt.filingDate, status: pt.status }))"
);

writeCustomPage(
  "staff.research-development.phd-scholars.tsx", "/staff/research-development/phd-scholars", "PhD Research Scholars",
  "Registered doctoral candidates, guides, and progress tracking.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Active Scholars", val: "86 PhD Scholars" }, { label: "Doctoral Guides", val: "34 Guides" }, { label: "Fellowships", val: "JRF / SRF" }, { label: "Status", val: "Active" }],
  ["Scholar Name", "Department", "Research Guide", "Thesis Topic", "Year"],
  "data.phdScholars.map(s => ({ name: s.name, dept: s.dept, guide: s.guide, topic: s.topic, year: s.year }))"
);

writeCustomPage(
  "staff.research-development.incubator.tsx", "/staff/research-development/incubator", "Innovation Incubator & Startups",
  "Student innovation startup incubation center and seed funding.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Incubated Startups", val: "12 Startups" }, { label: "Seed Funding", val: "₹85.0 Lakhs" }, { label: "Patents Generated", val: "6 Patents" }, { label: "Status", val: "Active" }],
  ["Startup Venture Name", "Founders / Student", "Technology Domain", "Seed Fund Sanctioned", "Status"],
  "[ { name: 'AeroDrone Robotics Pvt Ltd', lead: 'Praveen Kumar (CSE)', domain: 'Autonomous UAV Sensors', fund: '₹15.0 Lakhs', status: 'Incubated' }, { name: 'BioHealth Diagnostic AI', lead: 'Sneha Reddy (ECE)', domain: 'Non-Invasive Glucose AI', fund: '₹20.0 Lakhs', status: 'Incubated' } ]"
);

writeCustomPage(
  "staff.research-development.labs.tsx", "/staff/research-development/labs", "Advanced Research Laboratories",
  "Specialized research lab infrastructure and high-end equipment.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Research Labs", val: "8 Advanced Labs" }, { label: "Equipment Value", val: "₹18.5 Cr" }, { label: "User Access", val: "24/7 Scholars" }, { label: "Status", val: "Active" }],
  ["Lab Facility Name", "Department", "Key Equipment", "Lab Incharge", "Status"],
  "[ { name: 'AI & Quantum Computing Research Center', dept: 'CSE', equip: 'NVIDIA DGX H100 Supercluster', incharge: 'Dr. S. K. Gupta', status: 'Active' }, { name: 'Microelectronics & VLSI Fab Lab', dept: 'ECE', equip: 'Cleanroom ISO Class 5 & Wafer Prober', incharge: 'Dr. Meera Rao', status: 'Active' } ]"
);

writeCustomPage(
  "staff.research-development.reports.tsx", "/staff/research-development/reports", "R&D Research Reports",
  "Annual research compendiums and grant audit ledgers.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Total Reports", val: "16 Compendiums" }, { label: "SCI Papers", val: "142 Papers" }, { label: "Grants Ledger", val: "Audited" }, { label: "Status", val: "Verified" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.research-development.notifications.tsx", "/staff/research-development/notifications", "R&D Call for Proposals & Alerts",
  "DST SERB call-for-proposals and grant application reminders.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "Active Calls", val: "4 Call-for-Proposals" }, { label: "SERB Deadline", val: "25 Aug 2026" }, { label: "Grant SLA", val: "On Track" }, { label: "Status", val: "Active" }],
  ["Call Title", "Funding Body", "Grant Limit", "Deadline"],
  "[ { title: 'DST SERB POWER Research Grant Call 2026', agency: 'DST SERB', limit: '₹60 Lakhs', date: '2026-08-30' } ]"
);

writeCustomPage(
  "staff.research-development.settings.tsx", "/staff/research-development/settings", "R&D Portal Settings",
  "Research incentive rules and paper publication reward policies.", "R&D", "getResearchDevelopmentDashboardData",
  [{ label: "R&D Dean", val: "Prof. Research Dean" }, { label: "SCI Paper Bonus", val: "₹50,000 / Paper" }, { label: "Portal Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Policy Setting", "Reward / Value", "Effective Date", "Status"],
  "[ { name: 'SCI Journal Publication Incentive', val: '₹50,000 / Paper', date: '2026-01-01', status: 'Active' } ]"
);

// ----------------------------------------------------
// 4. FINANCE DEAN PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.finance-dean.department-budgets.tsx", "/staff/finance-dean/department-budgets", "Department Budget Allocations",
  "Departmental budget allocation vs actual expenditure ledger.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Total Budget", val: "₹48.5 Cr" }, { label: "Spent Amount", val: "₹36.2 Cr" }, { label: "Avg Utilization", val: "86.4%" }, { label: "Status", val: "Active" }],
  ["Department", "Allocated Budget", "Spent Amount", "Utilization %"],
  "data.deptBudgets.map(b => ({ dept: b.dept, allocated: b.allocated, spent: b.spent, percentage: b.percentage + '%' }))"
);

writeCustomPage(
  "staff.finance-dean.fee-collections.tsx", "/staff/finance-dean/fee-collections", "Fee Collections Ledger",
  "Tuition, hostel, and transport fee collection targets vs actuals.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Expected Fees", val: "₹32.7 Cr" }, { label: "Collected Fees", val: "₹31.3 Cr" }, { label: "Pending Dues", val: "₹1.4 Cr" }, { label: "Status", val: "Active" }],
  ["Category Name", "Expected Revenue", "Collected Amount", "Pending Dues"],
  "data.feeCollections.map(fc => ({ category: fc.category, expected: fc.expected, collected: fc.collected, pending: fc.pending }))"
);

writeCustomPage(
  "staff.finance-dean.expenses.tsx", "/staff/finance-dean/expenses", "Institutional Expense Ledger",
  "Faculty payroll, CapEx infrastructure upgrades, and vendor payments.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Monthly Expenses", val: "₹3.30 Cr" }, { label: "Faculty Payroll", val: "₹2.85 Cr" }, { label: "CapEx Upgrade", val: "₹45.0 Lakhs" }, { label: "Status", val: "Paid" }],
  ["Expense Voucher ID", "Expense Category", "Amount Paid", "Payment Date", "Status"],
  "data.expenseLedger.map(e => ({ id: e.id, category: e.category, amount: e.amount, date: e.date, status: e.status }))"
);

writeCustomPage(
  "staff.finance-dean.grants.tsx", "/staff/finance-dean/grants", "Grant Disbursements & Audit",
  "Research grant funding disbursements and DST seed fund audits.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Disbursed Grants", val: "₹4.85 Cr" }, { label: "Audit Clearance", val: "100% Pass" }, { label: "Utilization SLA", val: "On Track" }, { label: "Status", val: "Verified" }],
  ["Grant Ref", "Project Recipient", "Sanctioned Amount", "Disbursed Amount", "Status"],
  "[ { ref: 'GRT-DST-2026', project: 'DST SERB Edge AI Research', sanctioned: '₹85.0 Lakhs', disbursed: '₹85.0 Lakhs', status: 'Disbursed' } ]"
);

writeCustomPage(
  "staff.finance-dean.audits.tsx", "/staff/finance-dean/audits", "Statutory Financial Audits",
  "Annual statutory audit reports and balance sheet clearance.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Audit Opinion", val: "Unqualified (Clean)" }, { label: "Financial Year", val: "FY 2025-26" }, { label: "Tax Compliance", val: "100%" }, { label: "Status", val: "Verified" }],
  ["Audit Year", "External Auditor", "Audit Scope", "Audit Opinion", "Status"],
  "[ { year: 'FY 2025-26', auditor: 'Deloitte Haskins & Sells LLP', scope: 'Full Statutory Balance Sheet', opinion: 'Clean Unqualified Pass', status: 'Verified' } ]"
);

writeCustomPage(
  "staff.finance-dean.reports.tsx", "/staff/finance-dean/reports", "Financial Reports & Balance Sheets",
  "Institutional annual balance sheets and expenditure audit reports.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Total Reports", val: "14 Balance Sheets" }, { label: "Statutory Audit", val: "Clean Pass" }, { label: "Budget Utilization", val: "88.4%" }, { label: "Status", val: "Active" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.finance-dean.notifications.tsx", "/staff/finance-dean/notifications", "Finance Notifications & Alerts",
  "Budget threshold warnings and monthly payroll disbursement alerts.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Active Alerts", val: "2 Warnings" }, { label: "Payroll SLA", val: "Disbursed" }, { label: "Fee Reminder", val: "Sent" }, { label: "Status", val: "Active" }],
  ["Alert Title", "Message Brief", "Priority", "Date"],
  "[ { title: 'August Faculty Payroll Disbursed', message: 'Monthly payroll of ₹2.85 Cr transferred to accounts', priority: 'Medium', date: '2026-08-01' } ]"
);

writeCustomPage(
  "staff.finance-dean.settings.tsx", "/staff/finance-dean/settings", "Finance Dean Portal Settings",
  "Financial approval authority limits and banking configurations.", "Finance", "getFinanceDeanDashboardData",
  [{ label: "Finance Dean", val: "Prof. Finance Dean" }, { label: "Approval Threshold", val: "₹10.0 Lakhs" }, { label: "Portal Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Parameter Name", "Configured Value", "Last Modified", "Status"],
  "[ { name: 'Financial Approval Limit', val: '₹10,00,000 / Voucher', date: '2026-01-10', status: 'Active' } ]"
);

// ----------------------------------------------------
// 5. EXAMINATION DEAN PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.examination-dean.exam-schedules.tsx", "/staff/examination-dean/exam-schedules", "End-Semester Examination Schedules",
  "Controller of Examinations master exam timetable.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Scheduled Exams", val: "184 Papers" }, { label: "Registered Students", val: "4,850" }, { label: "Exam Halls", val: "Halls 1-12" }, { label: "Status", val: "Active" }],
  ["Course Code", "Subject Name", "Exam Date", "Session Slot", "Enrolled Students"],
  "data.examSchedules.map(s => ({ code: s.code, subject: s.subject, date: s.date, session: s.session, students: s.students }))"
);

writeCustomPage(
  "staff.examination-dean.hall-tickets.tsx", "/staff/examination-dean/hall-tickets", "Hall Ticket Generation & Dispatch",
  "Hall ticket eligibility verification and digital distribution.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Hall Tickets Dispatched", val: "4,850 Issued" }, { label: "Shortage Blocked", val: "142 Students" }, { label: "Generation SLA", val: "100%" }, { label: "Status", val: "Active" }],
  ["Batch / Sem", "Total Eligible", "Tickets Generated", "Blocked (Shortage)", "Status"],
  "[ { batch: 'B.Tech CSE Sem 5', eligible: '480', generated: '468', blocked: '12 Shortage', status: 'Dispatched' }, { batch: 'B.Tech ECE Sem 5', eligible: '360', generated: '352', blocked: '8 Shortage', status: 'Dispatched' } ]"
);

writeCustomPage(
  "staff.examination-dean.grade-moderation.tsx", "/staff/examination-dean/grade-moderation", "Grade Moderation Committee",
  "Semester exam marks evaluation and grade moderation reviews.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Evaluated Papers", val: "4,850 Papers" }, { label: "Pass Percentage", val: "92.6%" }, { label: "Moderation Status", val: "Complete" }, { label: "Status", val: "Verified" }],
  ["Course Code", "Faculty Evaluator", "Class Average", "Grade Moderation Delta", "Review Status"],
  "[ { code: 'CS401', evaluator: 'Dr. S. K. Gupta', avg: '76.4%', delta: '+2.0 Marks (Standardized)', status: 'Approved' }, { code: 'EC304', evaluator: 'Dr. Meera Rao', avg: '74.2%', delta: '+1.5 Marks (Standardized)', status: 'Approved' } ]"
);

writeCustomPage(
  "staff.examination-dean.revaluation.tsx", "/staff/examination-dean/revaluation", "Revaluation & Recounting Requests",
  "Student answer script revaluation requests and grade updates.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Revaluation Requests", val: "14 Requests" }, { label: "Under Review", val: "4 Cases" }, { label: "Grades Updated", val: "10 Cases" }, { label: "Status", val: "Active" }],
  ["Request Ref ID", "Student Name", "Subject", "Current Grade", "Status"],
  "data.revaluations.map(r => ({ id: r.id, student: r.student, subject: r.subject, grade: r.currentGrade, status: r.status }))"
);

writeCustomPage(
  "staff.examination-dean.results.tsx", "/staff/examination-dean/results", "Semester Result Publishing",
  "Controller of Examinations official result publishing SLAs.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Overall Pass Rate", val: "92.6%" }, { label: "Publish SLA", val: "14 Days" }, { label: "Top SGPA", val: "9.84 SGPA" }, { label: "Status", val: "Published" }],
  ["Program Name", "Semester", "Appeared Students", "Pass Rate %", "Publishing Status"],
  "[ { prog: 'B.Tech CSE', sem: 'Sem 6 Autumn', appeared: '480', passRate: '94.2%', status: 'Published' }, { prog: 'B.Tech ECE', sem: 'Sem 6 Autumn', appeared: '360', passRate: '91.8%', status: 'Published' } ]"
);

writeCustomPage(
  "staff.examination-dean.transcripts.tsx", "/staff/examination-dean/transcripts", "Official Transcripts & Degree Audit",
  "Official grade transcripts and degree certificate generation.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Transcripts Issued", val: "640 Issued" }, { label: "Degree Audits", val: "Complete" }, { label: "Digital Verification", val: "100%" }, { label: "Status", val: "Verified" }],
  ["Transcript ID", "Student Name", "Roll Number", "Final CGPA", "Status"],
  "[ { id: 'TRN-2026-901', student: 'K. Sai Teja', roll: '22CS101', cgpa: '9.42 CGPA', status: 'Issued' }, { id: 'TRN-2026-902', student: 'Ananya Roy', roll: '22EC104', cgpa: '9.18 CGPA', status: 'Issued' } ]"
);

writeCustomPage(
  "staff.examination-dean.reports.tsx", "/staff/examination-dean/reports", "Examination Reports & Analysis",
  "Result analysis reports and SGPA distribution statistics.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Total Reports", val: "14 Reports" }, { label: "Pass Rate", val: "92.6%" }, { label: "SLA Compliance", val: "100%" }, { label: "Status", val: "Active" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.examination-dean.notifications.tsx", "/staff/examination-dean/notifications", "Examination Notifications & Notices",
  "Invigilation duty rosters, hall ticket alerts, and exam cell notices.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Active Alerts", val: "3 Notices" }, { label: "Invigilators Assigned", val: "120 Faculty" }, { label: "Hall Ticket SLA", val: "Dispatched" }, { label: "Status", val: "Active" }],
  ["Notice Title", "Scope", "Priority", "Date"],
  "[ { title: 'End-Sem Invigilation Roster Released', scope: 'Faculty Members', priority: 'High', date: '2026-08-02' } ]"
);

writeCustomPage(
  "staff.examination-dean.settings.tsx", "/staff/examination-dean/settings", "Examination Dean Portal Settings",
  "Controller of Examinations grading scale rules and moderation limits.", "Examination", "getExaminationDeanDashboardData",
  [{ label: "Controller of Exams", val: "Dr. P. V. Ramana" }, { label: "Grading System", val: "10-Point Relative" }, { label: "Portal Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Grading Parameter", "Configured Value", "Last Modified", "Status"],
  "[ { name: 'Relative Grading Threshold', val: '10-Point Relative CGPA', date: '2026-01-10', status: 'Active' } ]"
);

// ----------------------------------------------------
// 6. PLACEMENT DEAN PAGES
// ----------------------------------------------------
writeCustomPage(
  "staff.placement-dean.companies.tsx", "/staff/placement-dean/companies", "Recruiting Corporate Partners",
  "Tier-1 corporate recruiting directory and MoU status.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Recruiting Partners", val: "78 Companies" }, { label: "Dream Tier 1", val: "24 Companies" }, { label: "Highest Package", val: "₹44.5 LPA" }, { label: "Status", val: "Active" }],
  ["Recruiting Company", "Recruiter Tier", "Package Offered", "Job Offers Dispatched"],
  "data.topRecruiters.map(r => ({ company: r.company, tier: r.tier, package: r.package, offers: r.offers + ' Offers' }))"
);

writeCustomPage(
  "staff.placement-dean.drives.tsx", "/staff/placement-dean/drives", "Placement Drives Schedule",
  "Campus placement drives timetable and student eligibility.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Drives Completed", val: "78 Drives" }, { label: "Upcoming Drives", val: "12 Drives" }, { label: "Eligible Students", val: "840 Students" }, { label: "Status", val: "Active" }],
  ["Recruiter Company", "Drive Date", "Eligible Students", "Status"],
  "data.placementDrives.map(d => ({ company: d.company, date: d.driveDate, count: d.eligibleStudents + ' Students', status: d.status }))"
);

writeCustomPage(
  "staff.placement-dean.placed-students.tsx", "/staff/placement-dean/placed-students", "Placed Students Master Ledger",
  "Official record of student job offers, companies, and CTC packages.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Placement Rate", val: "92.6%" }, { label: "Total Students Placed", val: "780 Students" }, { label: "Avg Package CTC", val: "₹11.8 LPA" }, { label: "Status", val: "Verified" }],
  ["Student Name", "Roll Number", "Department", "Recruiter Company", "Package CTC", "Status"],
  "[ { name: 'K. Sai Teja', roll: '22CS101', dept: 'CSE', company: 'Google Cloud India', ctc: '₹44.5 LPA', status: 'Offer Dispatched' }, { name: 'Ananya Roy', roll: '22EC104', dept: 'ECE', company: 'Microsoft R&D', ctc: '₹38.0 LPA', status: 'Offer Dispatched' } ]"
);

writeCustomPage(
  "staff.placement-dean.packages.tsx", "/staff/placement-dean/packages", "Salary CTC Analytics & Tiers",
  "Highest, average, and median package CTC analytics.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Highest Package", val: "₹44.5 LPA" }, { label: "Average Package", val: "₹11.8 LPA" }, { label: "Median Package", val: "₹9.5 LPA" }, { label: "Status", val: "Active" }],
  ["Package CTC Range", "Recruiter Tier", "Offers Count", "Percentage Share"],
  "[ { range: '₹30 LPA - ₹45 LPA', tier: 'Dream Tier 1', count: '42 Offers', share: '5.4%' }, { range: '₹15 LPA - ₹30 LPA', tier: 'Tier 1', count: '185 Offers', share: '23.7%' }, { range: '₹8 LPA - ₹15 LPA', tier: 'Tier 2', count: '420 Offers', share: '53.8%' } ]"
);

writeCustomPage(
  "staff.placement-dean.mous.tsx", "/staff/placement-dean/mous", "Corporate MoUs & Partnerships",
  "Industry cell MoUs and corporate collaboration agreements.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Active MoUs", val: "42 Corporate MoUs" }, { label: "Tier 1 Partners", val: "28 Partners" }, { label: "Validity", val: "3-5 Years" }, { label: "Status", val: "Verified" }],
  ["Corporate Partner", "Agreement Scope", "Signing Date", "Validity", "Status"],
  "[ { partner: 'Google Cloud India', scope: 'Cloud Center of Excellence & Placements', date: '2025-06-15', validity: '5 Years', status: 'Active' }, { partner: 'Microsoft R&D', scope: 'AI Lab Support & Campus Hiring', date: '2025-07-20', validity: '5 Years', status: 'Active' } ]"
);

writeCustomPage(
  "staff.placement-dean.internships.tsx", "/staff/placement-dean/internships", "Corporate Internship Drives",
  "Corporate summer/winter internship drives and stipend data.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Internships Offered", val: "340 Offers" }, { label: "Highest Stipend", val: "₹1.2 Lakh / Mo" }, { label: "Avg Stipend", val: "₹45,000 / Mo" }, { label: "Status", val: "Active" }],
  ["Company Name", "Internship Role", "Monthly Stipend", "Selected Students", "Status"],
  "[ { company: 'Google India', role: 'Software Engineering Intern', stipend: '₹1,20,000 / Mo', count: '14 Interns', status: 'Selected' }, { company: 'Qualcomm India', role: 'VLSI Engineering Intern', stipend: '₹85,000 / Mo', count: '22 Interns', status: 'Selected' } ]"
);

writeCustomPage(
  "staff.placement-dean.reports.tsx", "/staff/placement-dean/reports", "Placement Statistics & Reports",
  "Executive placement statistics and recruiter feedback reports.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Total Reports", val: "15 Statistics Reports" }, { label: "Placement Rate", val: "92.6%" }, { label: "Recruiter Rating", val: "4.8 / 5" }, { label: "Status", val: "Active" }],
  ["Report Title", "Metric Highlight", "Generated Date", "Status"],
  "data.reports.map(r => ({ title: r.title, metric: r.metric, date: r.date, status: 'Verified' }))"
);

writeCustomPage(
  "staff.placement-dean.notifications.tsx", "/staff/placement-dean/notifications", "TPO Placement Alerts & Notices",
  "TPO placement drive alerts, student shortlists, and interview schedules.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Active Alerts", val: "4 Drive Notices" }, { label: "Next Drive", val: "Google (12 Aug)" }, { label: "Shortlists", val: "Published" }, { label: "Status", val: "Active" }],
  ["Notice Title", "Recruiter Company", "Priority", "Date"],
  "[ { title: 'Google Cloud India Interview Shortlist Out', company: 'Google Cloud', priority: 'High', date: '2026-08-04' } ]"
);

writeCustomPage(
  "staff.placement-dean.settings.tsx", "/staff/placement-dean/settings", "Placement Dean Portal Settings",
  "TPO Cell portal preferences, eligibility criteria, and corporate contacts.", "Placement", "getPlacementDeanDashboardData",
  [{ label: "Placement Dean", val: "Prof. Placement Dean" }, { label: "Eligibility Criteria", val: "7.0 CGPA & No Backlogs" }, { label: "Portal Version", val: "v2026.2" }, { label: "Status", val: "Active" }],
  ["Setting Parameter", "Configured Value", "Last Modified", "Status"],
  "[ { name: 'Default Placement Eligibility CGPA', val: '7.00 CGPA & 0 Active Backlogs', date: '2026-01-10', status: 'Active' } ]"
);

console.log("All dedicated subpages written successfully");
