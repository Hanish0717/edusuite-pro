import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  Building2,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  BarChart3,
  GitBranch,
  Search,
  Filter,
  Users,
  Check,
  X,
  FileText,
} from "lucide-react";

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

import {
  fetchPrincipalStats,
  fetchDepartmentScorecards,
  fetchFacultyOverview,
  fetchExecutiveApprovals,
  fetchInstitutionalReports,
  type ExecutiveApprovalTicket,
} from "@/lib/principalService";

export function PrincipalDashboard() {
  // State for search and filter controls
  const [deptSearch, setDeptSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [facultyDept, setFacultyDept] = useState("All Departments");

  // Reusable Mock Service Data
  const stats = useMemo(() => fetchPrincipalStats(), []);
  const reports = useMemo(() => fetchInstitutionalReports(), []);

  // Stateful Executive Approvals
  const [approvals, setApprovals] = useState<ExecutiveApprovalTicket[]>(() =>
    fetchExecutiveApprovals(),
  );

  // Dynamic Department Scorecards
  const departments = useMemo(() => {
    return fetchDepartmentScorecards(deptSearch);
  }, [deptSearch]);

  // Dynamic Faculty Roster
  const facultyMembers = useMemo(() => {
    return fetchFacultyOverview(facultySearch, facultyDept);
  }, [facultySearch, facultyDept]);

  // Executive Approval Handler
  const handleApprovalAction = (id: string, action: "Approved" | "Rejected") => {
    setApprovals((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: action } : ticket,
      ),
    );

    const ticket = approvals.find((t) => t.id === id);
    if (action === "Approved") {
      toast.success(`Executive Sign-off granted: "${ticket?.title}"`);
    } else {
      toast.error(`Executive Ticket rejected: "${ticket?.title}"`);
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Principal Executive Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Executive Oversight, Institutional Analytics, Dept Performance & Final Approvals.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          PRINCIPAL
        </Badge>
      </div>

      {/* DYNAMIC KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="NAAC Audit Score" value={stats.naacScore} icon={Award} tone="success" />
        <KpiCard label="Overall Pass %" value={stats.overallPassPercentage} icon={TrendingUp} />
        <KpiCard
          label="Pending Executive Approvals"
          value={`${pendingApprovalsCount} Tickets`}
          icon={GitBranch}
          tone="warning"
        />
        <KpiCard label="Faculty Strength" value={stats.facultyStrength} icon={Building2} tone="info" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* DYNAMIC DEPARTMENTAL PERFORMANCE SCORECARDS */}
          <Panel
            title="Departmental Performance Scorecards"
            description="Institutional overview of pass percentage, attendance compliance, and research output."
          >
            <div className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter departments by name or code..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="space-y-3">
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="p-4 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <h4 className="font-display text-sm font-bold">{dept.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Attendance: <span className="font-semibold text-foreground">{dept.attendanceRate}</span> | Pass Rate:{" "}
                          <span className="font-semibold text-foreground">{dept.passRate}</span> | Research:{" "}
                          <span className="font-semibold text-foreground">{dept.researchPapers} Papers</span>
                        </p>
                      </div>
                      <Badge
                        className={
                          dept.budgetStatus === "On Track"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono w-fit"
                            : dept.budgetStatus === "Under Review"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-mono w-fit"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs font-mono w-fit"
                        }
                      >
                        {dept.budgetStatus}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No departments match search query.
                  </p>
                )}
              </div>
            </div>
          </Panel>

          {/* DYNAMIC FACULTY DIRECTORY PANEL */}
          <Panel
            title="Institutional Faculty Overview"
            description="Active senior faculty members, academic ratings, and department leadership."
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty by name or designation..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Select value={facultyDept} onValueChange={setFacultyDept}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
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

              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Faculty Member</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {facultyMembers.map((f) => (
                      <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-foreground">{f.name}</p>
                          <p className="text-[0.68rem] text-muted-foreground">{f.designation}</p>
                        </td>
                        <td className="p-3 font-semibold">{f.department}</td>
                        <td className="p-3 font-mono font-bold text-amber-600">{f.rating}</td>
                        <td className="p-3 text-right">
                          <Badge variant={f.status === "Active" ? "outline" : "secondary"}>
                            {f.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </div>

        {/* SIDE PANELS: APPROVALS & REPORTS */}
        <div className="space-y-6">
          {/* STATEFUL EXECUTIVE APPROVALS */}
          <Panel
            title="Executive Sign-offs"
            description="Pending financial, academic, and institutional approvals."
          >
            <div className="space-y-3">
              {approvals.map((ticket) => (
                <div key={ticket.id} className="p-3.5 rounded-xl border border-border/70 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-[0.65rem] font-mono font-bold ${ticket.categoryColor}`}>
                      {ticket.category}
                    </Badge>
                    <span className="text-[0.65rem] font-mono text-muted-foreground">{ticket.id}</span>
                  </div>

                  <h5 className="text-sm font-semibold text-foreground leading-snug">{ticket.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ticket.description}</p>
                  <p className="text-[0.68rem] font-mono text-primary/80">Submitted by: {ticket.submittedBy}</p>

                  {ticket.status === "Pending" ? (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleApprovalAction(ticket.id, "Approved")}
                        className="flex-1 bg-brand-gradient text-xs cursor-pointer h-8"
                      >
                        <Check className="size-3.5 mr-1" /> {ticket.actionLabel}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprovalAction(ticket.id, "Rejected")}
                        className="text-xs cursor-pointer h-8 px-2.5"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <Badge
                        className={
                          ticket.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 w-full justify-center py-1 font-mono text-xs"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 w-full justify-center py-1 font-mono text-xs"
                        }
                      >
                        Status: {ticket.status}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* MOCK INSTITUTIONAL REPORTS */}
          <Panel title="Institutional Compliance Reports">
            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold leading-snug">{rep.name}</p>
                      <p className="text-[0.68rem] text-muted-foreground">{rep.category} • {rep.generatedDate}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[0.65rem] font-mono">
                    {rep.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
