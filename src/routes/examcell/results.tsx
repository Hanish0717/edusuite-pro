import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Printer,
  ShieldAlert
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getMockExams, 
  saveMockExams, 
  getMockStudents, 
  saveMockStudents, 
  MockExamSchedule,
  MockStudent
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/results")({
  head: () => ({
    meta: [{ title: "Results Consolidation & Publishing — EduSuite Pro" }],
  }),
  component: ResultsConsolidationPage,
});

function ResultsConsolidationPage() {
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  const [students, setStudents] = useState<MockStudent[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [isConsolidating, setIsConsolidating] = useState(false);

  useEffect(() => {
    setExams(getMockExams());
    setStudents(getMockStudents());
  }, []);

  const handleConsolidate = () => {
    if (!selectedExamId) {
      toast.error("Please select an examination first.");
      return;
    }

    const targetExam = exams.find(e => e.id === selectedExamId);
    if (!targetExam) return;

    setIsConsolidating(true);

    setTimeout(() => {
      // 1. Process and compute marks for all students in target department/year/semester
      const updatedStudents = students.map(s => {
        if (s.department === targetExam.department && s.year === targetExam.year && s.semester === targetExam.semester) {
          // If not registered for course, skip
          if (!s.is_registered) return s;

          // Mock external marks (out of 70) if not present
          const external = s.external_marks !== undefined ? s.external_marks : Math.floor(Math.random() * 40) + 30; // Random 30-70 score
          
          // Get internal score (mid term marks max 20 + assignment marks max 10)
          const mid = s.mid1_marks || 0;
          const ass = s.assignment_marks || 0;
          const internal = mid + ass;
          
          const total = Math.min(100, internal + external);

          // Calculate Grade
          let grade = 'F';
          if (total >= 90) grade = 'S';
          else if (total >= 80) grade = 'A';
          else if (total >= 70) grade = 'B';
          else if (total >= 60) grade = 'C';
          else if (total >= 50) grade = 'D';
          else if (total >= 40) grade = 'E';

          return {
            ...s,
            external_marks: external,
            grade,
            status: 'Consolidated'
          };
        }
        return s;
      });

      // 2. Save students database
      setStudents(updatedStudents);
      saveMockStudents(updatedStudents);

      // 3. Mark exam as Completed
      const updatedExams = exams.map(e => e.id === selectedExamId ? { ...e, status: 'Completed' as const } : e);
      setExams(updatedExams);
      saveMockExams(updatedExams);

      setIsConsolidating(false);
      toast.success("Results published successfully!");
    }, 1500);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examStudents = selectedExam 
    ? students.filter(s => s.department === selectedExam.department && s.year === selectedExam.year && s.semester === selectedExam.semester)
    : [];

  const registeredStudents = examStudents.filter(s => s.is_registered);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Results Consolidation & Publishing
          </h2>
          <p className="text-sm text-muted-foreground">
            Aggregate student mid marks, assignments, and external scores to generate letter grades and publish result sheets.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Consolidation Console */}
        <div className="lg:col-span-1 space-y-6">
          <Panel title="Select Examination" icon={Award}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Active Examination Session
                </label>
                <select
                  value={selectedExamId}
                  onChange={e => setSelectedExamId(e.target.value)}
                  className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="">-- Select Exam --</option>
                  {exams.filter(e => e.status !== 'Pending Approval').map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.status})</option>
                  ))}
                </select>
              </div>

              {selectedExam && (
                <div className="rounded-xl bg-muted/40 p-4 border border-border/50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Status</span>
                    <Badge variant={selectedExam.status === 'Completed' ? "default" : "secondary"} className="text-[10px] font-extrabold">
                      {selectedExam.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Target Cohort</span>
                    <span className="text-xs font-semibold">{selectedExam.department} Year {selectedExam.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Total Cohort</span>
                    <span className="text-xs font-semibold">{examStudents.length} Students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Registered</span>
                    <span className="text-xs font-semibold text-emerald-600">{registeredStudents.length} Students</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleConsolidate}
                disabled={isConsolidating || !selectedExamId || selectedExam?.status === 'Completed'}
                className="w-full bg-brand-gradient text-white rounded-xl h-10 font-bold shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConsolidating ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Publish Results
                  </>
                )}
              </Button>
            </div>
          </Panel>
        </div>

        {/* Student Marks Preview */}
        <div className="lg:col-span-2">
          <Panel title="Roster Marks Aggregation Preview">
            {!selectedExamId ? (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center gap-2">
                <AlertCircle className="size-8 text-muted-foreground/60" />
                <p className="text-sm font-semibold">Please select an active examination from the left panel to preview the student grades list.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-bold border-b border-border uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll No.</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3 text-center">Reg. Status</th>
                      <th className="px-4 py-3 text-center">Total (100M)</th>
                      <th className="px-4 py-3 text-center">Grade Letter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-semibold">
                    {examStudents.map(s => {
                      const totalInternal = (s.mid1_marks || 0) + (s.assignment_marks || 0);
                      const totalCombined = s.external_marks !== undefined ? totalInternal + s.external_marks : null;

                      return (
                        <tr key={s.id} className="hover:bg-muted/10 transition">
                          <td className="px-4 py-3 font-mono font-bold text-primary">{s.roll_number}</td>
                          <td className="px-4 py-3 text-foreground">{s.full_name}</td>
                          <td className="px-4 py-3 text-center">
                            {s.is_registered ? (
                              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[9px] font-black">Registered</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-[9px] font-black">Not Enrolled</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-black text-sm text-indigo-900 bg-indigo-50/10">
                            {s.is_registered && totalCombined !== null ? `${totalCombined}M` : '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {s.is_registered && s.grade ? (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                                s.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {s.grade}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
