import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeIqacPage(filename, routePath, title, subTitle, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  BadgeCheck,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  Inbox,
  Bell,
  Save,
  Lock,
  Globe,
  Shield,
  User,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
${chartType ? `import { ${chartType} } from "@/components/dashboard/charts";` : ""}

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${title} — IQAC Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawData = useMemo(() => {
    return ${rowsJS};
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item.status && String(item.status).toLowerCase().includes(filter.toLowerCase()));
      return matchSearch && matchFilter;
    });
  }, [rawData, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ${badgeText}
            </Badge>
            <span className="text-xs text-muted-foreground">• IQAC Quality Module</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export Report
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Quality Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={BadgeCheck} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={ShieldCheck} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={FileText} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={CheckCircle2} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${title} Performance Chart" description="Quantitative quality benchmarks and criteria progress.">
        <GroupedBarChart
          data={[
            { category: "Criterion 1", score: 95 },
            { category: "Criterion 2", score: 96 },
            { category: "Criterion 3", score: 94 },
            { category: "Criterion 4", score: 92 },
            { category: "Criterion 5", score: 93 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "score", label: "Quality Score %" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${title} Ledger" description="Official NAAC, NBA & Institutional Quality Records.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quality records..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={filter} onValueChange={(val) => { setFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[150px] text-xs">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified / Active</SelectItem>
                <SelectItem value="pending">Pending / Open</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  ${headers.map((h) => `<th className="p-3">${h}</th>`).join("")}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("accredited") || String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("achieved") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("under review") || String(val).toLowerCase().includes("in progress") ? (
                          <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs font-mono cursor-pointer" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, "utf8");
  console.log(`Saved IQAC subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL IQAC SUBPAGES
// ----------------------------------------------------

// Quality Assurance Pages
writeIqacPage("staff.iqac.naac.tsx", "/staff/iqac/naac", "NAAC Accreditation", "NAAC Criteria 1-7 scores, evidence files, and peer visit timeline.", "QUALITY ASSURANCE", [{ label: "NAAC Target", val: "3.78 A++" }, { label: "Criteria", val: "7 Criteria" }, { label: "Weightage", val: "1,000 Pts" }, { label: "Compliance", val: "100%" }], ["Criterion Code", "Criterion Name", "Weightage", "Scored Points", "Evidence Status", "Status"], `[
  { code: "C1", name: "Curricular Aspects", weight: "150 Pts", score: "142 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C2", name: "Teaching-Learning and Evaluation", weight: "350 Pts", score: "338 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C3", name: "Research, Innovations and Extension", weight: "150 Pts", score: "140 Pts", evidence: "98% Uploaded", status: "Verified" },
  { code: "C4", name: "Infrastructure and Learning Resources", weight: "100 Pts", score: "95 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C5", name: "Student Support and Progression", weight: "100 Pts", score: "92 Pts", evidence: "96% Uploaded", status: "Verified" },
  { code: "C6", name: "Governance, Leadership and Management", weight: "100 Pts", score: "96 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C7", name: "Institutional Values & Best Practices", weight: "50 Pts", score: "48 Pts", evidence: "100% Uploaded", status: "Verified" }
]`, "GroupedBarChart");

writeIqacPage("staff.iqac.nba.tsx", "/staff/iqac/nba", "NBA Accreditation", "Department-wise NBA status, program outcomes, and SAR dossiers.", "QUALITY ASSURANCE", [{ label: "Accredited Depts", val: "12 / 15" }, { label: "SAR Dossiers", val: "Submitted" }, { label: "OBE Attainment", val: "94.2%" }, { label: "Tier", val: "Tier-1" }], ["Dept Code", "Department Name", "SAR Filing Date", "Validity Period", "Accreditation Tier", "Status"], `[
  { code: "CSE", name: "Computer Science Engineering", date: "2026-03-15", validity: "6 Years", tier: "Tier-1", status: "Accredited" },
  { code: "ECE", name: "Electronics & Communication Engg", date: "2026-04-10", validity: "6 Years", tier: "Tier-1", status: "Accredited" },
  { code: "ME", name: "Mechanical Engineering", date: "2026-05-20", validity: "3 Years", tier: "Tier-1", status: "Accredited" }
]`);

writeIqacPage("staff.iqac.aqar.tsx", "/staff/iqac/aqar", "AQAR Management", "Annual Quality Assurance Report filings, pending sections, and desk approvals.", "QUALITY ASSURANCE", [{ label: "AQAR Status", val: "Submitted" }, { label: "Academic Year", val: "2025-26" }, { label: "NAAC Approval", val: "Clean Pass" }, { label: "Score", val: "4.85 / 5" }], ["Filing ID", "Filing Year", "Report Title", "Submission Date", "Desk Approval", "Status"], `[
  { id: "AQAR-2026", year: "2025-26", title: "Institutional AQAR Dossier", date: "2026-07-01", approval: "NAAC Desk Approved", status: "Verified" },
  { id: "AQAR-2025", year: "2024-25", title: "Institutional AQAR Dossier", date: "2025-07-01", approval: "NAAC Desk Approved", status: "Verified" }
]`);

writeIqacPage("staff.iqac.ssr.tsx", "/staff/iqac/ssr", "SSR Management", "Self Study Report (SSR) Criterion quantitative metrics & targets.", "QUALITY ASSURANCE", [{ label: "SSR Indicators", val: "115 Metrics" }, { label: "Compliance", val: "96.4%" }, { label: "Standard", val: "Grade A++" }, { label: "Status", val: "Verified" }], ["Metric Code", "Indicator Description", "Target Standard", "Current Score", "Variance %", "Status"], `[
  { code: "1.1.1", desc: "Curriculum Design & OBE Alignment", target: "100%", score: "96.4%", var: "+3.6%", status: "Achieved" },
  { code: "2.4.1", desc: "Full-Time Ph.D. Faculty Ratio", target: "85%", score: "92.0%", var: "+7.0%", status: "Achieved" }
]`);

writeIqacPage("staff.iqac.academic-audit.tsx", "/staff/iqac/academic-audit", "Academic Audit", "Audit schedule, findings, recommendations, and department scores.", "QUALITY ASSURANCE", [{ label: "Total Audits", val: "24 Audits" }, { label: "Avg Score", val: "4.82 / 5" }, { label: "Recommendations", val: "38 Implemented" }, { label: "Status", val: "Verified" }], ["Audit Ref", "Department", "Audit Type", "Audit Score", "Lead Auditor", "Status"], `[
  { ref: "AAA-2026-01", dept: "CSE", type: "Academic Audit", score: "4.85 / 5.0", auditor: "Dr. External Auditor", status: "Verified" },
  { ref: "AAA-2026-02", dept: "ECE", type: "Academic Audit", score: "4.78 / 5.0", auditor: "Dr. External Auditor", status: "Verified" }
]`);

writeIqacPage("staff.iqac.internal-quality-audit.tsx", "/staff/iqac/internal-quality-audit", "Internal Quality Audit", "Internal quality cell inspections and lab compliance scoring.", "QUALITY ASSURANCE", [{ label: "Internal Audits", val: "12 Inspections" }, { label: "Lab Score", val: "98.2%" }, { label: "Compliance Rate", val: "100%" }, { label: "Status", val: "Verified" }], ["Inspection ID", "Department / Lab", "Inspector Name", "Score", "Audit Date", "Status"], `[
  { id: "IQA-901", dept: "CSE Advanced AI Lab", inspector: "Prof. Anand Kumar", score: "98.5%", date: "2026-07-28", status: "Verified" }
]`);

writeIqacPage("staff.iqac.dept-quality-metrics.tsx", "/staff/iqac/dept-quality-metrics", "Department Quality Metrics", "Department-wise performance metrics and quality index rankings.", "QUALITY ASSURANCE", [{ label: "Dept Rank #1", val: "CSE Dept" }, { label: "Quality Index", val: "94.8%" }, { label: "OBE Attainment", val: "95.2%" }, { label: "Status", val: "Active" }], ["Rank", "Department Name", "Faculty Index", "Publication Metric", "Overall Score", "Status"], `[
  { rank: "#1", dept: "Computer Science Engg", faculty: "96.2%", pub: "142 Papers", score: "94.8%", status: "Verified" },
  { rank: "#2", dept: "Electronics & Comm", faculty: "94.1%", pub: "98 Papers", score: "92.5%", status: "Verified" }
]`);

writeIqacPage("staff.iqac.quality-improvement.tsx", "/staff/iqac/quality-improvement", "Quality Improvement Plans", "Strategic quality improvement plans (QIP) and action items.", "QUALITY ASSURANCE", [{ label: "Active QIPs", val: "8 Plans" }, { label: "Implemented", val: "6 Plans" }, { label: "Under Review", val: "2 Plans" }, { label: "Status", val: "Active" }], ["Plan ID", "Improvement Initiative", "Target Dept", "Target Date", "Status"], `[
  { id: "QIP-2026-01", init: "Blended Learning & Smart Classroom Upgrade", dept: "All Depts", date: "2026-10-30", status: "In Progress" }
]`);

// Feedback Management Pages
writeIqacPage("staff.iqac.student-feedback.tsx", "/staff/iqac/student-feedback", "Student Feedback", "Semester student feedback survey statistics, response rate & rating.", "FEEDBACK MANAGEMENT", [{ label: "Response Rate", val: "94.2%" }, { label: "Avg Rating", val: "4.78 / 5" }, { label: "Respondents", val: "4,850 Students" }, { label: "Status", val: "Verified" }], ["Semester", "Department", "Total Students", "Response Rate", "Avg Rating", "Status"], `[
  { sem: "Sem 5 Autumn", dept: "CSE", count: "480", rate: "96.2%", rating: "4.85 / 5", status: "Verified" },
  { sem: "Sem 5 Autumn", dept: "ECE", count: "360", rate: "94.1%", rating: "4.72 / 5", status: "Verified" }
]`);

writeIqacPage("staff.iqac.faculty-feedback.tsx", "/staff/iqac/faculty-feedback", "Faculty Feedback", "Faculty institutional governance & facility feedback analysis.", "FEEDBACK MANAGEMENT", [{ label: "Faculty Rate", val: "98.0%" }, { label: "Avg Score", val: "4.82 / 5" }, { label: "Total Roster", val: "245 Faculty" }, { label: "Status", val: "Verified" }], ["Department", "Faculty Count", "Survey Response", "Facility Score", "Status"], `[
  { dept: "CSE", count: "38", response: "100%", score: "4.90 / 5", status: "Verified" }
]`);

writeIqacPage("staff.iqac.alumni-feedback.tsx", "/staff/iqac/alumni-feedback", "Alumni Feedback", "Alumni curriculum relevance & career progression feedback.", "FEEDBACK MANAGEMENT", [{ label: "Alumni Rating", val: "4.85 / 5" }, { label: "Curriculum Score", val: "95.2%" }, { label: "Respondents", val: "640 Alumni" }, { label: "Status", val: "Verified" }], ["Graduation Batch", "Total Alumni", "Response Count", "Curriculum Rating", "Status"], `[
  { batch: "Batch 2025", total: "1,200", count: "640", rating: "4.85 / 5.0", status: "Verified" }
]`);

writeIqacPage("staff.iqac.employer-feedback.tsx", "/staff/iqac/employer-feedback", "Employer Feedback", "Corporate recruiter & employer graduate skill feedback.", "FEEDBACK MANAGEMENT", [{ label: "Employer Score", val: "4.72 / 5" }, { label: "Recruiters", val: "78 Companies" }, { label: "Skill Rating", val: "92.0%" }, { label: "Status", val: "Verified" }], ["Recruiter Company", "Tier", "Hired Graduates", "Skill Rating", "Status"], `[
  { company: "Google Cloud India", tier: "Tier-1", hired: "18", rating: "4.90 / 5.0", status: "Verified" }
]`);

writeIqacPage("staff.iqac.feedback-analytics.tsx", "/staff/iqac/feedback-analytics", "Feedback Analytics", "Multi-stakeholder feedback sentiment & comparative charts.", "FEEDBACK MANAGEMENT", [{ label: "Overall Sentiment", val: "94.5% Positive" }, { label: "Target Score", val: "4.50 Benchmark" }, { label: "Satisfaction", val: "Exceeds Target" }, { label: "Status", val: "Verified" }], ["Stakeholder Group", "Sample Count", "Satisfaction Rate", "Benchmark Target", "Status"], `[
  { group: "Undergraduate Students", count: "4,850", rate: "94.2%", target: "90.0%", status: "Achieved" },
  { group: "Corporate Employers", count: "78", rate: "92.0%", target: "88.0%", status: "Achieved" }
]`);

// Compliance Pages
writeIqacPage("staff.iqac.compliance-tracker.tsx", "/staff/iqac/compliance-tracker", "Compliance Tracker", "Institutional regulatory compliance items, due dates, & officers.", "COMPLIANCE", [{ label: "Compliance Rate", val: "100%" }, { label: "Mandatory Items", val: "24 Items" }, { label: "Due Dates SLA", val: "On Track" }, { label: "Status", val: "Verified" }], ["Item Code", "Compliance Title", "Authority", "Due Date", "Responsible Officer", "Status"], `[
  { code: "CMP-01", title: "UGC Mandatory Disclosure 2026", authority: "UGC", date: "2026-08-30", officer: "Director IQAC", status: "Verified" }
]`);

writeIqacPage("staff.iqac.criteria-docs.tsx", "/staff/iqac/criteria-docs", "Criteria Documentation", "NAAC Criteria 1-7 documentation checklist & proof files.", "COMPLIANCE", [{ label: "Proof Files", val: "1,240 Files" }, { label: "Criteria Mapped", val: "7 Criteria" }, { label: "Verification", val: "100% Valid" }, { label: "Status", val: "Verified" }], ["Doc Ref", "NAAC Criteria Mapped", "Document Title", "File Format", "Status"], `[
  { ref: "DOC-C1-01", criteria: "Criterion 1 (Curricular)", title: "Syllabus Revision Board Minutes", format: "PDF (Signed)", status: "Verified" }
]`);

writeIqacPage("staff.iqac.document-repo.tsx", "/staff/iqac/document-repo", "Document Repository", "Central repository for quality policy documents & versions.", "COMPLIANCE", [{ label: "Total Documents", val: "480 Files" }, { label: "Categories", val: "12 Categories" }, { label: "Version Control", val: "v2026.2" }, { label: "Status", val: "Active" }], ["Category", "Document Name", "Upload Date", "Version", "Status"], `[
  { cat: "Quality Policy", name: "Institutional IQAC Quality Handbook 2026", date: "2026-01-10", ver: "v3.2", status: "Active" }
]`);

writeIqacPage("staff.iqac.evidence-uploads.tsx", "/staff/iqac/evidence-uploads", "Evidence Uploads", "Upload portal for departmental quality evidence files.", "COMPLIANCE", [{ label: "Uploaded Files", val: "2,450 Evidences" }, { label: "Dept Approvals", val: "100% Cleared" }, { label: "Audit Pass", val: "Verified" }, { label: "Status", val: "Active" }], ["Evidence Tag", "Evidence Title", "Department", "Uploaded Date", "Approval Status", "Status"], `[
  { tag: "EVD-2026-901", title: "CSE AI Lab Equipment Invoices", dept: "CSE", date: "2026-07-25", approval: "Approved", status: "Verified" }
]`);

// Institution Analytics Pages
writeIqacPage("staff.iqac.kpi-dashboard.tsx", "/staff/iqac/kpi-dashboard", "KPI Dashboard", "Institutional key performance indicators, targets & achievements.", "INSTITUTION ANALYTICS", [{ label: "Institutional KPIs", val: "34 Indicators" }, { label: "Target Met", val: "94.2%" }, { label: "Academic Rank", val: "#1 Institute" }, { label: "Status", val: "Active" }], ["KPI Code", "Indicator Description", "Target Standard", "Current Score", "Achievement %", "Status"], `[
  { code: "KPI-01", desc: "SCI Journal Papers / Faculty / Yr", target: "2.0 Papers", score: "2.4 Papers", pct: "120%", status: "Exceeds Target" }
]`);

writeIqacPage("staff.iqac.quality-metrics.tsx", "/staff/iqac/quality-metrics", "Quality Metrics", "Comprehensive institutional quality indexes & scoring.", "INSTITUTION ANALYTICS", [{ label: "Overall Score", val: "94.8 / 100" }, { label: "Teaching Index", val: "96.2%" }, { label: "Research Index", val: "93.4%" }, { label: "Status", val: "Verified" }], ["Metric Name", "Standard Norm", "Current Achievement", "Status"], `[
  { name: "Student-Faculty Ratio (SFR)", norm: "1:15 Ratio", current: "1:14 Ratio", status: "Achieved" }
]`);

writeIqacPage("staff.iqac.benchmarking.tsx", "/staff/iqac/benchmarking", "Benchmarking", "NIRF & Tier-1 global institutional benchmarking.", "INSTITUTION ANALYTICS", [{ label: "NIRF Target", val: "Top 20 Rank" }, { label: "Global Peer Score", val: "92.4%" }, { label: "Benchmark Met", val: "Exceeds" }, { label: "Status", val: "Active" }], ["Metric Area", "National Benchmark", "EduSuite Achievement", "Status"], `[
  { area: "Faculty Ph.D. Qualification Ratio", bench: "80%", achievement: "92.0%", status: "Exceeds Benchmark" }
]`);

writeIqacPage("staff.iqac.performance-analysis.tsx", "/staff/iqac/performance-analysis", "Performance Analysis", "Multi-year quality trend analysis & performance breakdown.", "INSTITUTION ANALYTICS", [{ label: "5-Year Growth", val: "+18.4%" }, { label: "Academic SLA", val: "99.2%" }, { label: "Quality Rating", val: "Grade A++" }, { label: "Status", val: "Verified" }], ["Academic Year", "NAAC Score Trend", "AQAR Score", "Overall Performance", "Status"], `[
  { year: "2025-26", naac: "3.78 A++", aqar: "4.85 / 5.0", perf: "Outstanding", status: "Verified" }
]`);

// Meetings & Activities Pages
writeIqacPage("staff.iqac.meetings.tsx", "/staff/iqac/meetings", "IQAC Meetings", "Meeting calendar, agendas, minutes of meeting (MoM) & action items.", "MEETINGS & ACTIVITIES", [{ label: "Meetings Conducted", val: "4 Meetings / Yr" }, { label: "Attendance Rate", val: "98.0%" }, { label: "Minutes Signed", val: "100%" }, { label: "Status", val: "Verified" }], ["Meeting Ref", "Meeting Title", "Date", "Venue", "MoM Document", "Status"], `[
  { ref: "IQAC-M-2026-03", title: "3rd Quarterly Quality Review Meeting", date: "2026-07-15", venue: "Senate Boardroom", mom: "MoM Signed & Circulated", status: "Verified" }
]`);

writeIqacPage("staff.iqac.atr.tsx", "/staff/iqac/atr", "Action Taken Reports (ATR)", "Action Taken Reports on previous meeting resolutions.", "MEETINGS & ACTIVITIES", [{ label: "Total ATR Items", val: "28 Resolutions" }, { label: "Completed Action", val: "26 Implemented" }, { label: "Pending", val: "2 In Progress" }, { label: "Status", val: "Verified" }], ["Resolution Ref", "Resolution Item", "Responsible Officer", "Action Taken", "Status"], `[
  { ref: "ATR-01", item: "Smart Classroom Audio Systems Upgrade", officer: "Director IMA", action: "Installed in 24 Classrooms", status: "Completed" }
]`);

writeIqacPage("staff.iqac.workshops.tsx", "/staff/iqac/workshops", "Workshops & FDPs", "Quality improvement workshops, FDPs & webinars organized.", "MEETINGS & ACTIVITIES", [{ label: "FDPs Organized", val: "14 Workshops" }, { label: "Faculty Participants", val: "245 Faculty" }, { label: "Outcome Score", val: "4.88 / 5" }, { label: "Status", val: "Active" }], ["Program Title", "Category", "Date", "Participants", "Status"], `[
  { title: "National FDP on Outcome Based Education (OBE) & NAAC Accreditation", cat: "Faculty Development", date: "2026-07-10", count: "245 Faculty", status: "Completed" }
]`);

writeIqacPage("staff.iqac.best-practices.tsx", "/staff/iqac/best-practices", "Best Practices", "Institutional best practices & distinctiveness dossiers.", "MEETINGS & ACTIVITIES", [{ label: "NAAC Best Practices", val: "2 Distinctive Practices" }, { label: "Impact Metric", val: "100% Student Reach" }, { label: "Review Status", val: "Verified" }, { label: "Status", val: "Active" }], ["Practice ID", "Title of Best Practice", "Focus Area", "Impact Metric", "Status"], `[
  { id: "BP-01", title: "Industry-Moulded Skill Certification Curriculum", focus: "Employability", metric: "92.6% Placement Rate", status: "Verified" },
  { id: "BP-02", title: "Net-Zero Solar Powered Green Campus Initiative", focus: "Sustainability", metric: "100% Renewable Solar Grid", status: "Verified" }
]`);

writeIqacPage("staff.iqac.events.tsx", "/staff/iqac/events", "Institutional Events", "Quality cell events calendar & accreditation visits.", "MEETINGS & ACTIVITIES", [{ label: "Quality Events", val: "8 Events" }, { label: "Participants", val: "1,200+" }, { label: "Next Visit", val: "18 Aug 2026" }, { label: "Status", val: "Active" }], ["Event Title", "Event Category", "Scheduled Date", "Venue", "Status"], `[
  { title: "NAAC Mock Peer Team Visit & Audit Day", cat: "Accreditation Event", date: "2026-08-18", venue: "Main Auditorium", status: "Scheduled" }
]`);

// Reports Pages
writeIqacPage("staff.iqac.naac-reports.tsx", "/staff/iqac/naac-reports", "NAAC Reports", "NAAC self-study dossiers & peer team evaluation reports.", "REPORTS", [{ label: "Total Reports", val: "12 Reports" }, { label: "NAAC Grade", val: "3.78 A++" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Metric Highlight", "Generated Date", "Status"], `[
  { title: "NAAC Peer Team Assessment & Evaluation Dossier", metric: "Grade A++ (3.78 CGPA)", date: "2026-08-01", status: "Verified" }
]`);

writeIqacPage("staff.iqac.aqar-reports.tsx", "/staff/iqac/aqar-reports", "AQAR Reports", "Annual Quality Assurance Reports compendiums.", "REPORTS", [{ label: "AQAR Filings", val: "5 Years" }, { label: "NAAC Clearance", val: "Approved" }, { label: "Filing Status", val: "Verified" }, { label: "Status", val: "Active" }], ["Report Title", "Filing Period", "Submission Date", "Status"], `[
  { title: "Institutional AQAR Master Compendium 2025-26", period: "2025-26", date: "2026-07-01", status: "Verified" }
]`);

writeIqacPage("staff.iqac.audit-reports.tsx", "/staff/iqac/audit-reports", "Audit Reports", "Academic, administrative & financial audit dossiers.", "REPORTS", [{ label: "Audit Reports", val: "18 Reports" }, { label: "Score Avg", val: "4.82 / 5" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Department Scope", "Audit Score", "Status"], `[
  { title: "Annual Academic & Administrative Audit (AAA) Report", scope: "All 15 Depts", score: "4.82 / 5.0", status: "Verified" }
]`);

writeIqacPage("staff.iqac.feedback-reports.tsx", "/staff/iqac/feedback-reports", "Feedback Reports", "Stakeholder feedback analysis reports.", "REPORTS", [{ label: "Feedback Reports", val: "8 Reports" }, { label: "Satisfaction", val: "94.5%" }, { label: "Survey Rate", val: "98%" }, { label: "Status", val: "Verified" }], ["Report Title", "Stakeholder Mapped", "Satisfaction Metric", "Status"], `[
  { title: "Multi-Stakeholder Feedback Analysis Report 2026", scope: "Students, Alumni, Employers", metric: "94.5% Positive", status: "Verified" }
]`);

writeIqacPage("staff.iqac.kpi-reports.tsx", "/staff/iqac/kpi-reports", "KPI Reports", "Institutional key performance indicator reports.", "REPORTS", [{ label: "KPI Reports", val: "10 Reports" }, { label: "Targets Met", val: "94.2%" }, { label: "Benchmark", val: "Top 20" }, { label: "Status", val: "Verified" }], ["Report Title", "KPI Scope", "Generated Date", "Status"], `[
  { title: "Institutional Key Performance Indicators (KPI) Audit Report", scope: "34 Indicators", date: "2026-08-01", status: "Verified" }
]`);

// Notifications & Settings Pages
writeIqacPage("staff.iqac.notifications.tsx", "/staff/iqac/notifications", "Notifications", "IQAC broadcast alerts, audit schedules, and reminders.", "SYSTEM", [{ label: "Received Alerts", val: "4 Alerts" }, { label: "Sent Notices", val: "8 Notices" }, { label: "Next Audit", val: "18 Aug 2026" }, { label: "Status", val: "Active" }], ["Notification Title", "Scope", "Priority", "Date", "Status"], `[
  { title: "NAAC Mock Peer Visit Scheduled", scope: "All HODs", priority: "High", date: "2026-08-04", status: "Sent" }
]`);

writeIqacPage("staff.iqac.settings.tsx", "/staff/iqac/settings", "Settings", "IQAC Cell committee composition & portal preferences.", "SYSTEM", [{ label: "Director IQAC", val: "Prof. Anand Kumar" }, { label: "Committee Roster", val: "15 Members" }, { label: "NAAC Benchmark", val: "3.50 CGPA" }, { label: "Status", val: "Active" }], ["Setting Parameter", "Configured Value", "Last Modified", "Status"], `[
  { param: "IQAC Director Name", val: "Prof. Anand Kumar", date: "2026-01-10", status: "Active" },
  { param: "NAAC Grade Threshold", val: "3.50 CGPA (Grade A++)", date: "2026-01-10", status: "Active" }
]`);

console.log("All 33 IQAC dedicated pages generated successfully.");
