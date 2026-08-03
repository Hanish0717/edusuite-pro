import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Calendar, Users, Layers, Clock, Building, BookOpen } from "lucide-react";
import type { AssessmentItem } from "./types";
import { StatusBadge, TypeBadge } from "./assessment-badges";
import { GradeDistribution, PerformanceAnalytics } from "./grade-distribution";
import { WorkflowTimeline, AssessmentTimeline } from "./workflow-timeline";
import { MarksEntryTable } from "./marks-entry-table";
import { useState } from "react";

interface AssessmentDetailsDrawerProps {
  assessment: AssessmentItem | null;
  open: boolean;
  onClose: () => void;
}

export function AssessmentDetailsDrawer({ assessment, open, onClose }: AssessmentDetailsDrawerProps) {
  const [showMarks, setShowMarks] = useState(false);

  if (!assessment) return null;

  const infoRows: [React.ElementType, string, string][] = [
    [BookOpen, "Subject",        assessment.subject],
    [Layers,   "Code",           assessment.code],
    [Users,    "Section",        assessment.section],
    [Building, "Semester",       assessment.semester],
    [Layers,   "Academic Year",  assessment.academicYear],
    [Calendar, "Date",           assessment.date],
    [Clock,    "Duration",       assessment.duration],
    [Layers,   "Max Marks",      `${assessment.maxMarks}`],
    [Layers,   "Weightage",      assessment.weightage],
    [Layers,   "Submission",     assessment.submissionMethod],
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 gap-0">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border/50 sticky top-0 bg-background z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold line-clamp-2 leading-tight">{assessment.name}</SheetTitle>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StatusBadge status={assessment.status} />
                  <TypeBadge type={assessment.type} />
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted/50 transition-colors shrink-0 mt-0.5">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          </SheetHeader>

          <div className="px-6 py-5 space-y-8">
            {/* General Info */}
            <section>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">General Information</h4>
              <div className="rounded-xl border border-border/40 overflow-hidden divide-y divide-border/30">
                {infoRows.map(([Icon, label, value]) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                    <Icon className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="w-28 text-xs font-semibold text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions */}
            {assessment.instructions && (
              <section>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Instructions</h4>
                <div className="rounded-xl border border-border/40 bg-muted/10 px-4 py-3 text-sm text-foreground leading-relaxed">
                  {assessment.instructions}
                </div>
              </section>
            )}

            {/* Student Marks quick access */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Student Marks</h4>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => setShowMarks(true)}>
                  <Users className="size-3.5" /> Open Full Table
                </Button>
              </div>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border/30">
                      <th className="px-3 py-2 text-left text-[0.65rem] font-bold text-muted-foreground uppercase">Roll No</th>
                      <th className="px-3 py-2 text-left text-[0.65rem] font-bold text-muted-foreground uppercase">Student</th>
                      <th className="px-3 py-2 text-right text-[0.65rem] font-bold text-muted-foreground uppercase">Marks</th>
                      <th className="px-3 py-2 text-right text-[0.65rem] font-bold text-muted-foreground uppercase">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {assessment.marks.slice(0, 4).map((m) => (
                      <tr key={m.rollNumber} className="hover:bg-muted/10 transition-colors">
                        <td className="px-3 py-2 text-xs font-mono text-muted-foreground">{m.rollNumber}</td>
                        <td className="px-3 py-2 text-xs font-medium">{m.studentName}</td>
                        <td className="px-3 py-2 text-right text-xs font-bold">{m.marksObtained}/{assessment.maxMarks}</td>
                        <td className="px-3 py-2 text-right">
                          <span className={`text-[0.65rem] font-bold ${m.result === "Pass" ? "text-emerald-600" : "text-rose-600"}`}>{m.result}</span>
                        </td>
                      </tr>
                    ))}
                    {assessment.marks.length > 4 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-center text-xs text-muted-foreground">
                          + {assessment.marks.length - 4} more — <button className="text-primary font-semibold hover:underline" onClick={() => setShowMarks(true)}>View All</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Grade Distribution */}
            <section>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Grade Distribution</h4>
              <GradeDistribution
                distribution={assessment.gradeDistribution}
                performance={assessment.performance}
                maxMarks={assessment.maxMarks}
              />
            </section>

            {/* Performance Analytics */}
            <section>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Performance Analytics</h4>
              <PerformanceAnalytics performance={assessment.performance} maxMarks={assessment.maxMarks} />
            </section>

            {/* Workflow */}
            <section>
              <WorkflowTimeline workflow={assessment.workflow} />
            </section>

            {/* Timeline */}
            <section>
              <AssessmentTimeline timeline={assessment.timeline} />
            </section>
          </div>
        </SheetContent>
      </Sheet>

      {/* Marks entry table (nested sheet) */}
      <MarksEntryTable assessment={assessment} open={showMarks} onClose={() => setShowMarks(false)} />
    </>
  );
}
