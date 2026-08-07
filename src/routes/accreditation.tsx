import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Percent,
  FileText,
  Search,
  Check,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/role-context";
import {
  fetchNaacCriteria,
  fetchNbaPrograms,
  fetchIqacReports,
  calculateNaacSummaryStats,
} from "@/lib/naacService";

export const Route = createFileRoute("/accreditation")({
  head: () => ({
    meta: [{ title: "Accreditation & IQAC — EduSuite Pro" }],
  }),
  component: AccreditationPage,
});

function AccreditationPage() {
  const { hasFlag, role } = useRole();
  const [criteriaSearch, setCriteriaSearch] = useState("");

  const isCoordinator =
    role === "super-admin" ||
    hasFlag("isNAACCoordinator") ||
    hasFlag("isIQACCoordinator") ||
    hasFlag("isNBACoordinator");

  // Dynamic Datasets
  const stats = useMemo(() => calculateNaacSummaryStats(), []);
  const criteriaList = useMemo(() => fetchNaacCriteria(), []);
  const nbaPrograms = useMemo(() => fetchNbaPrograms(), []);
  const iqacReports = useMemo(() => fetchIqacReports(), []);

  // Filtered NAAC Criteria List
  const filteredCriteria = useMemo(() => {
    return criteriaList.filter(
      (c) =>
        c.id.toLowerCase().includes(criteriaSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(criteriaSearch.toLowerCase()),
    );
  }, [criteriaList, criteriaSearch]);

  const handleExportSsrReport = () => {
    const headers = [
      "Criteria Code",
      "Criteria Name",
      "Weightage",
      "Simulated Score",
      "Evidences Count",
      "Audit Readiness %",
    ];
    const rows = criteriaList.map((c) => [
      c.id,
      `"${c.name}"`,
      c.weightage,
      c.score,
      c.evidencesCount,
      `${c.readiness}%`,
    ]);

    const summaryHeader = ["", "", "", "", "", ""];
    const summaryRow = [
      "SUMMARY",
      "Simulated NAAC CGPA",
      "1000",
      stats.simulatedCgpa,
      stats.verifiedEvidencesCount,
      stats.overallReadinessPercentage,
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
        summaryHeader.join(","),
        summaryRow.join(","),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NAAC_SSR_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported NAAC SSR Report (Simulated CGPA: ${stats.simulatedCgpa}) to CSV!`);
  };

  const handleDownloadIqacReport = (rep: any) => {
    const content = `================================================
EDUSUITE PRO - IQAC QUARTERLY QUALITY REPORT
================================================
Report Title  : ${rep.title}
Quarter       : ${rep.quarter}
Generated Date: ${rep.generatedDate}
Status        : ${rep.status}
File Size     : ${rep.fileSize}
================================================
Summary:
Internal Quality Assurance Cell audit report capturing academic performance,
curriculum feedback, research publications, and NAAC/NBA compliance metrics.
================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${rep.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${rep.title}!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER BANNER */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <Award className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Accreditation & IQAC Module
              </h1>
              <p className="text-sm text-muted-foreground">
                NAAC 7 Criteria audit readiness, NBA outcome-based education (OBE) metrics, and SSR generation.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono">
            {isCoordinator ? "Accreditation Coordinator" : "Read Only View"}
          </Badge>
        </header>

        {/* DYNAMIC COMPUTED KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Target NAAC Grade" value={stats.targetGrade} icon={Award} tone="success" />
          <KpiCard label="NBA Accredited Depts" value={stats.nbaAccreditedRatio} icon={ShieldCheck} tone="info" />
          <KpiCard label="Overall SSR Readiness" value={stats.overallReadinessPercentage} icon={Percent} tone="warning" />
          <KpiCard label="Verified Evidences" value={stats.verifiedEvidencesCount} icon={CheckCircle2} />
        </div>

        {/* TABS CONTAINER */}
        <Tabs defaultValue="naac" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="naac">NAAC 7 Criteria Matrix</TabsTrigger>
            <TabsTrigger value="nba">NBA Tier-1 / Tier-2 OBE</TabsTrigger>
            <TabsTrigger value="iqac">IQAC Quarterly Reports</TabsTrigger>
          </TabsList>

          {/* NAAC TAB */}
          <TabsContent value="naac">
            <Panel
              title="NAAC Self-Study Report (SSR) Scorecard"
              description="7 Criteria weighted metrics monitored live across all academic and administrative departments."
              action={
                <Button
                  onClick={handleExportSsrReport}
                  className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer text-xs font-semibold text-white"
                >
                  <Download className="size-4" /> Export SSR Report
                </Button>
              }
            >
              <div className="space-y-4">
                <div className="relative max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search criteria code or name..."
                    value={criteriaSearch}
                    onChange={(e) => setCriteriaSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>Criteria Code</TableHead>
                        <TableHead>Criteria Name</TableHead>
                        <TableHead>Weightage</TableHead>
                        <TableHead>Simulated Score</TableHead>
                        <TableHead>Evidences Count</TableHead>
                        <TableHead>Audit Readiness</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCriteria.length > 0 ? (
                        filteredCriteria.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-mono text-xs font-bold">{c.id}</TableCell>
                            <TableCell className="font-semibold text-sm">{c.name}</TableCell>
                            <TableCell className="text-xs font-mono">{c.weightage}</TableCell>
                            <TableCell className="font-bold text-sm text-emerald-600">{c.score}</TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">
                              {c.evidencesCount} Files
                            </TableCell>
                            <TableCell className="w-[200px]">
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span>{c.readiness}%</span>
                                </div>
                                <Progress value={c.readiness} className="h-2" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No NAAC criteria match your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* NBA TAB */}
          <TabsContent value="nba">
            <Panel title="NBA Program Outcomes (POs & PSOs)" description="Outcome-based education (OBE) course outcome attainment mapping.">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Attainment metrics computed automatically from internal examinations & semester results.
                </p>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>Dept Code</TableHead>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Accreditation Tier</TableHead>
                        <TableHead>Valid Till</TableHead>
                        <TableHead>OBE Attainment Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nbaPrograms.map((p) => (
                        <TableRow key={p.code}>
                          <TableCell className="font-mono text-xs font-bold">{p.code}</TableCell>
                          <TableCell className="font-semibold text-sm">{p.departmentName}</TableCell>
                          <TableCell>
                            <Badge variant={p.status.includes("Tier-1") ? "default" : "secondary"}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{p.validTill}</TableCell>
                          <TableCell className="w-[180px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span>{p.attainmentPercentage}%</span>
                              </div>
                              <Progress value={p.attainmentPercentage} className="h-2" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* IQAC TAB */}
          <TabsContent value="iqac">
            <Panel title="Internal Quality Assurance Cell (IQAC)" description="Quarterly meetings, action taken reports (ATR), and quality initiatives.">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Annual Quality Assurance Report (AQAR) automated data collector active.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {iqacReports.map((rep) => (
                    <div key={rep.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <FileText className="size-5 text-primary" />
                        <Badge variant="outline" className="text-[0.65rem] font-mono">
                          {rep.status}
                        </Badge>
                      </div>
                      <h4 className="font-display text-sm font-bold leading-snug">{rep.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {rep.quarter} • {rep.generatedDate} ({rep.fileSize})
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadIqacReport(rep)}
                        className="w-full text-xs cursor-pointer gap-1.5 mt-1"
                      >
                        <Download className="size-3.5" /> Download Report
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
