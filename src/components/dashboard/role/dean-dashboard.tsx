import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  BookOpen,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Download,
} from "lucide-react";

import { TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  fetchDeanStats,
  fetchDepartmentComparison,
  fetchFacultyPerformance,
  fetchAcademicAnalyticsTrend,
  fetchCurriculumStatus,
  fetchPendingAcademicApprovals,
  fetchDeanReports,
  type PendingAcademicApproval,
} from "@/lib/deanService";

export function DeanDashboard() {
  // Search & Filter States
  const [currSearch, setCurrSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [facSearch, setFacSearch] = useState("");
  const [facDept, setFacDept] = useState("All Departments");

  // Reusable Mock Service Data
  const stats = useMemo(() => fetchDeanStats(), []);
  const analyticsTrend = useMemo(() => fetchAcademicAnalyticsTrend(), []);
  const reports = useMemo(() => fetchDeanReports(), []);

  // Stateful Pending Approvals
  const [approvals, setApprovals] = useState<PendingAcademicApproval[]>(() =>
    fetchPendingAcademicApprovals(),
  );

  // Dynamic Query Data
  const curriculumItems = useMemo(() => fetchCurriculumStatus(currSearch), [currSearch]);
  const departments = useMemo(() => fetchDepartmentComparison(deptSearch), [deptSearch]);
  const facultyMembers = useMemo(() => fetchFacultyPerformance(facSearch, facDept), [facSearch, facDept]);

  const handleApprovalAction = (id: string, action: "Approved" | "Rejected") => {
    setApprovals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: action } : t)),
    );

    const ticket = approvals.find((t) => t.id === id);
    if (action === "Approved") {
      toast.success(`Academic Sign-off granted: "${ticket?.title}"`);
    } else {
      toast.error(`Academic Approval rejected: "${ticket?.title}"`);
    }
  };

  const pendingCount = approvals.filter((a) => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Academic Dean Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Academic Leadership, Curriculum Oversight, R&D Publications, Department Audits.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ACADEMIC DEAN
        </Badge>
      </div>

      {/* DYNAMIC KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="R&D Publications (2026)" value={stats.rdPublications} icon={Award} tone="success" />
        <KpiCard label="Curriculum Readiness" value={stats.curriculumReadiness} icon={BookOpen} />
        <KpiCard label="Department Audit Score" value={stats.departmentAuditScore} icon={CheckCircle2} tone="info" />
        <KpiCard label="Faculty Research Grants" value={stats.facultyResearchGrants} icon={TrendingUp} tone="warning" />
      </div>

      {/* DYNAMIC ACADEMIC ANALYTICS CHART */}
      <Panel
        title="Academic Analytics & R&D Performance Trend"
        description="Monthly research publication output, student attendance, and OBE attainment levels."
      >
        <TrendLineChart
          data={analyticsTrend as unknown as Record<string, unknown>[]}
          xKey="month"
          series={[
            { key: "researchOutput", label: "R&D Papers" },
            { key: "attendanceRate", label: "Attendance %" },
            { key: "obeAttainment", label: "OBE Attainment %" },
          ]}
          height={260}
        />
      </Panel>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="bg-background/50 border border-border p-1">
          <TabsTrigger value="curriculum">Curriculum Audit Status</TabsTrigger>
          <TabsTrigger value="departments">Department Comparison</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Performance & R&D</TabsTrigger>
          <TabsTrigger value="approvals">Pending Academic Approvals ({pendingCount})</TabsTrigger>
          <TabsTrigger value="reports">Academic Reports</TabsTrigger>
        </TabsList>

        {/* CURRICULUM AUDIT TAB */}
        <TabsContent value="curriculum">
          <Panel
            title="Curriculum & Academic Audit Progress"
            description="Outcome-based education (OBE) course regulation revisions and audit status."
          >
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search course or specialization..."
                  value={currSearch}
                  onChange={(e) => setCurrSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="space-y-3">
                {curriculumItems.length > 0 ? (
                  curriculumItems.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <h4 className="font-display text-sm font-bold">{c.course}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.revision} • OBE Attainment: <span className="font-semibold text-foreground">{c.attainment}%</span>
                        </p>
                      </div>
                      <Badge
                        className={
                          c.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono w-fit"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-mono w-fit"
                        }
                      >
                        {c.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No curriculum items match search query.
                  </p>
                )}
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* DEPARTMENT COMPARISON TAB */}
        <TabsContent value="departments">
          <Panel
            title="Institutional Department Comparison"
            description="Comparative audit scores, pass rates, and research output across departments."
          >
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter departments by name or code..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {departments.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary">{d.code}</span>
                      <Badge variant="outline" className="font-mono text-[0.65rem]">
                        Audit: {d.auditScore}
                      </Badge>
                    </div>
                    <h4 className="font-display text-sm font-bold">{d.name}</h4>
                    <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
                      <p>Pass Rate: <span className="font-semibold text-foreground">{d.passRate}</span></p>
                      <p>Attendance: <span className="font-semibold text-foreground">{d.attendanceRate}</span></p>
                      <p>R&D Papers: <span className="font-semibold text-foreground">{d.researchPapers} Published</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* FACULTY PERFORMANCE TAB */}
        <TabsContent value="faculty">
          <Panel
            title="Faculty Performance & Research Directory"
            description="Senior faculty R&D publications, research grants, and student ratings."
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty name or department..."
                    value={facSearch}
                    onChange={(e) => setFacSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Select value={facDept} onValueChange={setFacDept}>
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Faculty Member</th>
                      <th className="p-3">Dept</th>
                      <th className="p-3">Publications</th>
                      <th className="p-3">Grant Value</th>
                      <th className="p-3 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {facultyMembers.map((f) => (
                      <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{f.name}</td>
                        <td className="p-3 font-mono">{f.department}</td>
                        <td className="p-3 font-mono">{f.publications} Papers</td>
                        <td className="p-3 font-mono font-semibold text-emerald-600">{f.grantValue}</td>
                        <td className="p-3 text-right font-mono font-bold text-amber-600">{f.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* PENDING APPROVALS TAB */}
        <TabsContent value="approvals">
          <Panel
            title="Dean Academic Sign-offs"
            description="Pending academic approvals requiring Dean sanction."
          >
            <div className="space-y-3">
              {approvals.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[0.65rem] font-mono">
                      {ticket.category}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                  </div>

                  <h4 className="font-display text-sm font-bold">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground">Submitted by: {ticket.submittedBy}</p>

                  {ticket.status === "Pending" ? (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprovalAction(ticket.id, "Approved")}
                        className="bg-brand-gradient text-xs cursor-pointer gap-1"
                      >
                        <Check className="size-3.5" /> Approve Request
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprovalAction(ticket.id, "Rejected")}
                        className="text-xs cursor-pointer gap-1"
                      >
                        <X className="size-3.5" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      className={
                        ticket.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs font-mono"
                      }
                    >
                      Status: {ticket.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports">
          <Panel title="Dean Academic Reports" description="Configurable executive academic reports.">
            <div className="grid gap-3 sm:grid-cols-2">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <FileText className="size-5 text-primary" />
                    <Badge variant="outline" className="font-mono text-[0.65rem]">
                      {rep.status}
                    </Badge>
                  </div>
                  <h4 className="font-display text-sm font-bold">{rep.title}</h4>
                  <p className="text-xs text-muted-foreground">{rep.category} • {rep.dateGenerated}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Downloading ${rep.title}...`)}
                    className="w-full text-xs cursor-pointer gap-1.5 mt-1"
                  >
                    <Download className="size-3.5" /> Download Report
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
