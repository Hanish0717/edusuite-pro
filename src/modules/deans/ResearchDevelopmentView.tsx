import { useMemo } from "react";
import { FolderGit2, BookOpen, Award, Landmark, GraduationCap, FlaskConical, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function ResearchDevelopmentView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="research-development"
        title="Research & Development Dean Cockpit"
        subtitle="Sponsored Research Projects, DST/SERB/DRDO Funding Grants, SCI/Scopus Publications, Patents & PhD Scholars."
        badge="R&D DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Research Projects" value="48 Projects" icon={FolderGit2} tone="purple" />
        <KpiCard label="Active Projects" value="28 Active" icon={CheckCircle2} tone="success" />
        <KpiCard label="Completed Projects" value="20 Projects" icon={CheckCircle2} tone="info" />
        <KpiCard label="Sponsored Projects" value="18 Grants" icon={Landmark} tone="warning" />
        <KpiCard label="Consultancy Projects" value="10 Projects" icon={TrendingUp} tone="purple" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Journal Publications" value="342 Papers" icon={BookOpen} tone="info" />
        <KpiCard label="Patents Filed / Granted" value="42 Filed / 18 Granted" icon={Award} tone="purple" />
        <KpiCard label="Grant Amount Received" value="₹8.45 Cr" icon={Landmark} tone="success" />
        <KpiCard label="Active PhD Scholars" value="145 Scholars" icon={GraduationCap} tone="warning" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Research Projects & Publications" description="Active sponsored research projects vs SCI/Scopus journal papers.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", projects: 16, publications: 142 },
              { dept: "ECE Dept", projects: 12, publications: 98 },
              { dept: "ME Dept", projects: 8, publications: 45 },
              { dept: "EEE Dept", projects: 7, publications: 38 },
              { dept: "Civil Dept", projects: 5, publications: 19 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "projects", label: "Research Projects" },
              { key: "publications", label: "Publications Count" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Patent Portfolio & Technology Domain" description="Patent breakdown by technological discipline.">
          <DonutChart
            data={[
              { category: "Artificial Intelligence & ML", percentage: 42.5 },
              { category: "IoT & Embedded Systems", percentage: 28.0 },
              { category: "Renewable Energy Grid", percentage: 18.5 },
              { category: "Advanced Materials & CAD", percentage: 11.0 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* RECENT SPONSORED PROJECTS LEDGER */}
      <Panel title="Major Sponsored Research Projects Ledger" description="Active research grants sanctioned by DST, SERB, AICTE, and DRDO.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Project Title</th>
                <th className="p-3">Principal Investigator</th>
                <th className="p-3">Funding Agency</th>
                <th className="p-3 font-mono">Sanctioned Budget</th>
                <th className="p-3">Duration</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">AI-Based Smart Healthcare & Diagnostic Intelligence</td>
                <td className="p-3 font-mono">Dr. Ravi Kumar</td>
                <td className="p-3 font-bold text-primary">DST SERB</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹45.0 Lacs</td>
                <td className="p-3 font-mono">2024 - 2027</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Active</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">IoT Smart Agriculture & Soil Health Monitoring</td>
                <td className="p-3 font-mono">Dr. Priya Sharma</td>
                <td className="p-3 font-bold text-primary">MeitY Govt of India</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹32.5 Lacs</td>
                <td className="p-3 font-mono">2025 - 2028</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Active</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">Cyber Threat Detection using AI & Behavioral Biometrics</td>
                <td className="p-3 font-mono">Dr. Srinivas Rao</td>
                <td className="p-3 font-bold text-primary">DRDO CARS</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹58.0 Lacs</td>
                <td className="p-3 font-mono">2024 - 2026</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Active</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
