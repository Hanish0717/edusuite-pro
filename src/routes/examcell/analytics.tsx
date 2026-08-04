import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GroupedBarChart } from "@/components/dashboard/charts";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examcell/analytics")({
  head: () => ({
    meta: [{ title: "Exam Cell Analytics — EduSuite Pro" }],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { department } = useRole();
  const activeBranch = department || "CSE";

  // Branch specific analytics data (X-axis breaks down by semesters instead of showing all branches)
  const semesterChartData = [
    { term: "Sem 1", "Pass %": 92.4, "Fail %": 7.6 },
    { term: "Sem 2", "Pass %": 94.1, "Fail %": 5.9 },
    { term: "Sem 3", "Pass %": 93.6, "Fail %": 6.4 },
    { term: "Sem 4", "Pass %": 95.2, "Fail %": 4.8 },
    { term: "Sem 5", "Pass %": activeBranch === "CSE" ? 96.8 : 95.4, "Fail %": activeBranch === "CSE" ? 3.2 : 4.6 },
    { term: "Sem 6", "Pass %": 96.1, "Fail %": 3.9 },
    { term: "Sem 7", "Pass %": 97.5, "Fail %": 2.5 },
    { term: "Sem 8", "Pass %": 98.2, "Fail %": 1.8 }
  ];

  // Branch specific stats
  const statsMap: Record<string, { passRate: string; candidates: string; distinctions: string; evaluators: string }> = {
    CSE: { passRate: "95.5%", candidates: "850", distinctions: "86", evaluators: "28" },
    AIML: { passRate: "94.2%", candidates: "450", distinctions: "42", evaluators: "16" },
    AIDS: { passRate: "94.6%", candidates: "400", distinctions: "38", evaluators: "14" },
    EEE: { passRate: "90.2%", candidates: "320", distinctions: "22", evaluators: "12" },
    ECE: { passRate: "92.1%", candidates: "580", distinctions: "54", evaluators: "20" },
  };

  const activeStats = statsMap[activeBranch] || statsMap["CSE"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            {activeBranch} Examination Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Academic pass ratios, candidate distributions, and evaluation progress for the {activeBranch} Department.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={`${activeBranch} Pass Percentage`} value={activeStats.passRate} icon={TrendingUp} tone="success" />
        <KpiCard label="Branch Candidates" value={activeStats.candidates} icon={Users} tone="info" />
        <KpiCard label="Distinctions Mapped" value={activeStats.distinctions} icon={Award} tone="default" />
        <KpiCard label="Active Evaluators" value={activeStats.evaluators} icon={BarChart3} tone="warning" />
      </div>

      {/* Semester Wise Pass & Fail Ratio Analytics Graph */}
      <Panel title={`${activeBranch} Semester-Wise Performance Analysis`} icon={BarChart3}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Display (2/3 width) */}
          <div className="lg:col-span-2 bg-card border border-border/40 rounded-2xl p-4">
            <h4 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-wider">
              {activeBranch} Semester vs. Pass & Fail Ratios (%)
            </h4>
            <div className="h-[280px]">
              <GroupedBarChart
                data={semesterChartData}
                xKey="term"
                series={[
                  { key: "Pass %", label: "Pass Percentage" },
                  { key: "Fail %", label: "Fail Percentage" }
                ]}
                height={260}
              />
            </div>
          </div>

          {/* Text Roster Breakdown (1/3 width) */}
          <div className="flex flex-col justify-center space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-border pb-2">
              Semester Summary
            </h4>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {semesterChartData.map((d) => (
                <div key={d.term} className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100/50">
                  <span className="text-muted-foreground">{activeBranch} {d.term}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {d["Pass %"]}% Pass
                    </span>
                    <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px]">
                      {d["Fail %"]}% Fail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
