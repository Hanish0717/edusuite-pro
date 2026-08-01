import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Percent,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/accreditation")({
  head: () => ({
    meta: [{ title: "Accreditation & IQAC — EduSuite Pro" }],
  }),
  component: AccreditationPage,
});

const naacCriteria = [
  { id: "C1", name: "Curricular Aspects", score: "3.75 / 4.0", weightage: "15%", readiness: 95 },
  { id: "C2", name: "Teaching-Learning and Evaluation", score: "3.60 / 4.0", weightage: "30%", readiness: 90 },
  { id: "C3", name: "Research, Innovations and Extension", score: "3.45 / 4.0", weightage: "15%", readiness: 86 },
  { id: "C4", name: "Infrastructure and Learning Resources", score: "3.80 / 4.0", weightage: "10%", readiness: 95 },
  { id: "C5", name: "Student Support and Progression", score: "3.70 / 4.0", weightage: "10%", readiness: 92 },
  { id: "C6", name: "Governance, Leadership and Management", score: "3.65 / 4.0", weightage: "10%", readiness: 91 },
  { id: "C7", name: "Institutional Values and Best Practices", score: "3.90 / 4.0", weightage: "10%", readiness: 98 },
];

export function AccreditationPage() {
  const { hasFlag, role } = useRole();

  const isCoordinator =
    role === "super-admin" ||
    hasFlag("isNAACCoordinator") ||
    hasFlag("isIQACCoordinator") ||
    hasFlag("isNBACoordinator");

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Target NAAC Grade" value="A++ (CGPA > 3.6)" icon={Award} tone="success" />
          <KpiCard label="NBA Accredited Depts" value="5 / 6" icon={ShieldCheck} tone="info" />
          <KpiCard label="Overall SSR Readiness" value="92.4%" icon={Percent} tone="warning" />
          <KpiCard label="Verified Evidences" value="4,120 Files" icon={CheckCircle2} />
        </div>

        <Tabs defaultValue="naac" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="naac">NAAC 7 Criteria Matrix</TabsTrigger>
            <TabsTrigger value="nba">NBA Tier-1 / Tier-2 OBE</TabsTrigger>
            <TabsTrigger value="iqac">IQAC Quarterly Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="naac">
            <Panel
              title="NAAC Self-Study Report (SSR) Scorecard"
              description="7 Criteria weighted metrics monitored live across all academic and administrative departments."
              action={
                <Button
                  onClick={() => toast.success("Generating NAAC SSR Executive Summary PDF...")}
                  className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer text-xs"
                >
                  <Download className="size-4" /> Export SSR Report
                </Button>
              }
            >
              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Criteria Code</TableHead>
                      <TableHead>Criteria Name</TableHead>
                      <TableHead>Weightage</TableHead>
                      <TableHead>Simulated Score</TableHead>
                      <TableHead>Audit Readiness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {naacCriteria.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs font-bold">{c.id}</TableCell>
                        <TableCell className="font-semibold text-sm">{c.name}</TableCell>
                        <TableCell className="text-xs font-mono">{c.weightage}</TableCell>
                        <TableCell className="font-bold text-sm text-emerald-600">{c.score}</TableCell>
                        <TableCell className="w-[200px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span>{c.readiness}%</span>
                            </div>
                            <Progress value={c.readiness} className="h-2" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="nba">
            <Panel title="NBA Program Outcomes (POs & PSOs)" description="Outcome-based education (OBE) course outcome attainment mapping.">
              <p className="text-sm text-muted-foreground">
                Attainment metrics computed automatically from internal examinations & semester results.
              </p>
            </Panel>
          </TabsContent>

          <TabsContent value="iqac">
            <Panel title="Internal Quality Assurance Cell (IQAC)" description="Quarterly meetings, action taken reports (ATR), and quality initiatives.">
              <p className="text-sm text-muted-foreground">
                Annual Quality Assurance Report (AQAR) automated data collector active.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
