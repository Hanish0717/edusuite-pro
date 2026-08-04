import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Percent, 
  Users 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";

export const Route = createFileRoute("/examcell/correction-analysis")({
  head: () => ({
    meta: [{ title: "Correction Analysis — EduSuite Pro" }],
  }),
  component: CorrectionAnalysisPage,
});

interface CourseCorrectionSummary {
  subjectCode: string;
  subjectName: string;
  assignedFaculty: string;
  totalCopies: number;
  correctedCopies: number;
  pendingCopies: number;
  averageScore: number;
}

interface CopyDetail {
  blindCode: string;
  subjectName: string;
  assignedFaculty: string;
  status: string;
  score: number;
}

function CorrectionAnalysisPage() {
  const [courseSummaries, setCourseSummaries] = useState<CourseCorrectionSummary[]>([]);
  const [copyDetails, setCopyDetails] = useState<CopyDetail[]>([]);

  useEffect(() => {
    // Read from localStorage to compute live counts
    const rosterSaved = localStorage.getItem("mock_answer_copy_roster_v3");
    const roster = rosterSaved ? JSON.parse(rosterSaved) : [];

    // Let's summarize evaluations status
    // Default mock data summary
    const summaries: CourseCorrectionSummary[] = [
      {
        subjectCode: "CS302",
        subjectName: "Computer Networks",
        assignedFaculty: "Kanneganti Suresh",
        totalCopies: 2,
        correctedCopies: roster.filter((r: any) => r.status === 'Corrected / Evaluated').length,
        pendingCopies: roster.filter((r: any) => r.status !== 'Corrected / Evaluated').length,
        averageScore: roster.length > 0 
          ? Number((roster.reduce((sum: number, r: any) => sum + r.score, 0) / roster.length).toFixed(2))
          : 0
      },
      {
        subjectCode: "ML03301",
        subjectName: "Probability and Statistics",
        assignedFaculty: "Dr. K. Jyothi",
        totalCopies: 3,
        correctedCopies: 0,
        pendingCopies: 3,
        averageScore: 0
      },
      {
        subjectCode: "EC401",
        subjectName: "Microprocessors & Microcontrollers",
        assignedFaculty: "Dr. Clara Oswald",
        totalCopies: 1,
        correctedCopies: 0,
        pendingCopies: 1,
        averageScore: 0
      }
    ];

    setCourseSummaries(summaries);

    // Mapped Copy Details
    const details = roster.map((r: any) => ({
      blindCode: r.blindCode,
      subjectName: r.subjectName !== "-- Sem" ? r.subjectName : "Computer Networks",
      assignedFaculty: "Kanneganti Suresh",
      status: r.status,
      score: r.score
    }));
    setCopyDetails(details);
  }, []);

  // Compute total valuation stats
  const totalAllocated = courseSummaries.reduce((sum, c) => sum + c.totalCopies, 0);
  const totalCorrected = courseSummaries.reduce((sum, c) => sum + c.correctedCopies, 0);
  const totalPending = totalAllocated - totalCorrected;
  const overallCompletionRate = totalAllocated > 0 ? Math.round((totalCorrected / totalAllocated) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Correction Analysis & Valuation Progress
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Monitor the correction progress of scanned student answer booklets across all taught courses and faculty evaluators.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Allocated booklets" value={String(totalAllocated)} icon={FileText} tone="primary" />
        <KpiCard label="Papers Corrected" value={String(totalCorrected)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Correction" value={String(totalPending)} icon={Clock} tone="warning" />
        <KpiCard label="Valuation Rate" value={`${overallCompletionRate}%`} icon={Percent} tone="info" />
      </div>

      {/* Roster Table per Course */}
      <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <BookOpen className="size-4 text-indigo-600" />
            Evaluation Progress by Course
          </h3>
          <Badge className="bg-indigo-50 border-indigo-150 text-indigo-800 font-extrabold text-[9px] uppercase tracking-wide px-2 py-0.5">
            End Sem Theory Exams
          </Badge>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-55 text-slate-650 font-black uppercase text-[9px] tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Course Code</th>
                <th className="px-6 py-3 text-left">Course Name</th>
                <th className="px-6 py-3 text-left">Assigned Faculty</th>
                <th className="px-6 py-3 text-center">Total Copies</th>
                <th className="px-6 py-3 text-center">Corrected</th>
                <th className="px-6 py-3 text-center">Pending</th>
                <th className="px-6 py-3 text-center">Progress</th>
                <th className="px-6 py-3 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
              {courseSummaries.map((summary) => {
                const completion = Math.round((summary.correctedCopies / summary.totalCopies) * 100);
                
                return (
                  <tr key={summary.subjectCode} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-850">{summary.subjectCode}</td>
                    <td className="px-6 py-3.5 text-slate-800 font-bold">{summary.subjectName}</td>
                    <td className="px-6 py-3.5 text-slate-600 font-bold">{summary.assignedFaculty}</td>
                    <td className="px-6 py-3.5 text-center font-mono">{summary.totalCopies}</td>
                    <td className="px-6 py-3.5 text-center font-mono text-emerald-700">{summary.correctedCopies}</td>
                    <td className="px-6 py-3.5 text-center font-mono text-amber-700">{summary.pendingCopies}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              completion === 100 ? 'bg-emerald-500' : completion > 0 ? 'bg-indigo-500' : 'bg-slate-200'
                            }`}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-700">{completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-black text-slate-900">
                      {summary.correctedCopies > 0 ? `${summary.averageScore}.00` : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roster Details */}
      <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Users className="size-4 text-indigo-600" />
            Anonymized Roster Details & Evaluated Scores
          </h3>
          <span className="text-[10px] text-muted-foreground font-semibold">Shows specific answer copy correction updates.</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {copyDetails.map((detail, idx) => (
            <Card key={idx} className="p-4 border border-slate-150 shadow-2xs hover:shadow-xs transition duration-200 space-y-3.5 rounded-xl bg-slate-50/20">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-indigo-150 text-indigo-750 font-black bg-indigo-50/20">
                  {detail.blindCode}
                </Badge>
                <Badge className={
                  detail.status === 'Corrected / Evaluated' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-150 font-extrabold'
                    : 'bg-amber-50 text-amber-800 border-amber-150 font-extrabold'
                }>
                  {detail.status === 'Corrected / Evaluated' ? 'Corrected' : 'Awaiting Grading'}
                </Badge>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-800">{detail.subjectName}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-bold">Evaluator: {detail.assignedFaculty}</p>
              </div>

              <div className="border-t border-slate-200/80 pt-2.5 flex justify-between items-center text-[10px] font-bold text-slate-550">
                <span>Awarded Score:</span>
                <span className="font-black text-indigo-700 text-xs">
                  {detail.status === 'Corrected / Evaluated' ? `${detail.score}.00 / 70` : "Pending"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
