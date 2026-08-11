import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  Percent, 
  Users,
  ChevronRight,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";

export const Route = createFileRoute("/examcell/correction-analysis")({
  head: () => ({
    meta: [{ title: "Correction Analysis — EduSuite Pro" }],
  }),
  component: CorrectionAnalysisPage,
});

// Faculty department mapping helper
const FACULTY_DEPT_MAP: Record<string, string> = {
  "Kanneganti Suresh": "CSE",
  "Dr. K. Jyothi": "AIML",
  "Dr. Suresh Babu": "CSE",
  "Dr. Clara Oswald": "ECE",
  "Dr. John Smith": "AIDS"
};

// Seed default roster items if localStorage is empty
const DEFAULT_ROSTER = [
  {
    id: "r1",
    studentName: "N/A",
    studentRoll: "CSE26001",
    blindCode: "COPY-848113",
    examName: "End Semester Exam",
    subjectName: "Computer Networks",
    assignedFaculty: "Kanneganti Suresh",
    status: 'Corrected / Evaluated',
    score: 63
  },
  {
    id: "r2",
    studentName: "N/A",
    studentRoll: "CSE26002",
    blindCode: "COPY-378474",
    examName: "End Semester Exam",
    subjectName: "Computer Networks",
    assignedFaculty: "Kanneganti Suresh",
    status: 'Corrected / Evaluated',
    score: 62
  }
];

function CorrectionAnalysisPage() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [kpis, setKpis] = useState({ allocated: 0, corrected: 0, pending: 0, rate: 0 });
  
  // Aggregate stats states
  const [branchSummaries, setBranchSummaries] = useState<Record<string, { allocated: number; corrected: number }>>({});
  const [facultyBreakdowns, setFacultyBreakdowns] = useState<Record<string, Array<{ name: string; allocated: number; corrected: number; scoreSum: number }>>>({});

  useEffect(() => {
    // Read live evaluations data from localStorage
    const saved = localStorage.getItem("mock_answer_copy_roster_v3");
    const roster = saved ? JSON.parse(saved) : DEFAULT_ROSTER;

    // Aggregate statistics
    const branchAccumulator: Record<string, { allocated: number; corrected: number }> = {
      CSE: { allocated: 0, corrected: 0 },
      AIML: { allocated: 3, corrected: 0 }, // Seeded ML03301 stats
      ECE: { allocated: 1, corrected: 0 },  // Seeded EC401 stats
      AIDS: { allocated: 0, corrected: 0 }
    };

    const facultyAccumulator: Record<string, Record<string, { allocated: number; corrected: number; scoreSum: number }>> = {
      CSE: {
        "Kanneganti Suresh": { allocated: 0, corrected: 0, scoreSum: 0 },
        "Dr. Suresh Babu": { allocated: 0, corrected: 0, scoreSum: 0 }
      },
      AIML: {
        "Dr. K. Jyothi": { allocated: 3, corrected: 0, scoreSum: 0 }
      },
      ECE: {
        "Dr. Clara Oswald": { allocated: 1, corrected: 0, scoreSum: 0 }
      },
      AIDS: {
        "Dr. John Smith": { allocated: 0, corrected: 0, scoreSum: 0 }
      }
    };

    // Process roster items
    roster.forEach((r: any) => {
      const faculty = r.assignedFaculty || "Kanneganti Suresh";
      const dept = FACULTY_DEPT_MAP[faculty] || "CSE";
      const isCorrected = r.status === 'Corrected / Evaluated';
      const score = Number(r.score || 0);

      // Branch aggregate
      if (!branchAccumulator[dept]) {
        branchAccumulator[dept] = { allocated: 0, corrected: 0 };
      }
      branchAccumulator[dept].allocated += 1;
      if (isCorrected) {
        branchAccumulator[dept].corrected += 1;
      }

      // Faculty aggregate
      if (!facultyAccumulator[dept]) {
        facultyAccumulator[dept] = {};
      }
      if (!facultyAccumulator[dept][faculty]) {
        facultyAccumulator[dept][faculty] = { allocated: 0, corrected: 0, scoreSum: 0 };
      }
      
      facultyAccumulator[dept][faculty].allocated += 1;
      if (isCorrected) {
        facultyAccumulator[dept][faculty].corrected += 1;
        facultyAccumulator[dept][faculty].scoreSum += score;
      }
    });

    setBranchSummaries(branchAccumulator);

    // Convert faculty breakdowns to arrays
    const formattedBreakdown: Record<string, Array<{ name: string; allocated: number; corrected: number; scoreSum: number }>> = {};
    Object.keys(facultyAccumulator).forEach(dept => {
      formattedBreakdown[dept] = Object.keys(facultyAccumulator[dept]).map(name => ({
        name,
        allocated: facultyAccumulator[dept][name].allocated,
        corrected: facultyAccumulator[dept][name].corrected,
        scoreSum: facultyAccumulator[dept][name].scoreSum
      }));
    });
    setFacultyBreakdowns(formattedBreakdown);

    // Compute Overall KPIs
    let totalAlloc = 0;
    let totalCorr = 0;
    Object.values(branchAccumulator).forEach(b => {
      totalAlloc += b.allocated;
      totalCorr += b.corrected;
    });

    setKpis({
      allocated: totalAlloc,
      corrected: totalCorr,
      pending: totalAlloc - totalCorr,
      rate: totalAlloc > 0 ? Math.round((totalCorr / totalAlloc) * 100) : 100
    });
  }, []);

  const activeFacultyList = selectedBranch 
    ? facultyBreakdowns[selectedBranch] || [] 
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Correction Analysis & Valuation Progress
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Monitor valuation progress across departments and drill down into faculty evaluators' corrected vs pending rosters.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Allocated booklets" value={String(kpis.allocated)} icon={FileText} tone="purple" />
        <KpiCard label="Papers Corrected" value={String(kpis.corrected)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Correction" value={String(kpis.pending)} icon={Clock} tone="warning" />
        <KpiCard label="Valuation Rate" value={`${kpis.rate}%`} icon={Percent} tone="info" />
      </div>


      {/* Branch Wise Analysis Cards */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <BookOpen className="size-4 text-indigo-655" />
          Branch-Wise Evaluation Progress
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(branchSummaries).map(([branch, summary]) => {
            const completion = summary.allocated > 0 
              ? Math.round((summary.corrected / summary.allocated) * 100) 
              : 100;
            const isActive = selectedBranch === branch;

            return (
              <Card 
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3.5 rounded-2xl select-none ${
                  isActive 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-md bg-white' 
                    : 'border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-slate-900">{branch} Department</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 font-bold">End Sem Theory Roster</span>
                  </div>
                  <Badge className={
                    isActive 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black' 
                      : 'bg-indigo-50 border-indigo-150 text-indigo-800 text-[9px] font-black'
                  }>
                    {completion}%
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        completion === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                    <span>{summary.corrected} / {summary.allocated} Corrected</span>
                    <span className="flex items-center text-indigo-600">
                      View details <ArrowRight className="size-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Faculty-Wise Breakdown Table */}
      {selectedBranch && (
        <Panel title={`Faculty Valuation Breakdown — ${selectedBranch} Department`}>

          {activeFacultyList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs font-semibold">
              No active faculty correction allocations registered for this department.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-55 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Faculty Name</th>
                    <th className="px-6 py-3 text-center">Allocated Copies</th>
                    <th className="px-6 py-3 text-center">Corrected</th>
                    <th className="px-6 py-3 text-center">Pending Correction</th>
                    <th className="px-6 py-3 text-center">Progress</th>
                    <th className="px-6 py-3 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                  {activeFacultyList.map((fac) => {
                    const completion = fac.allocated > 0 
                      ? Math.round((fac.corrected / fac.allocated) * 100) 
                      : 100;
                    const avg = fac.corrected > 0 
                      ? (fac.scoreSum / fac.corrected).toFixed(2) 
                      : "--";

                    return (
                      <tr key={fac.name} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-3.5 text-slate-900 font-extrabold flex items-center gap-1.5">
                          <Users className="size-4 text-indigo-500 shrink-0" />
                          {fac.name}
                        </td>
                        <td className="px-6 py-3.5 text-center font-mono font-bold">{fac.allocated}</td>
                        <td className="px-6 py-3.5 text-center font-mono text-emerald-700 font-bold">{fac.corrected}</td>
                        <td className="px-6 py-3.5 text-center font-mono text-amber-700 font-bold">{fac.allocated - fac.corrected}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  completion === 100 ? 'bg-emerald-500' : 'bg-indigo-550'
                                }`}
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-700">{completion}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono font-black text-slate-900">{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
