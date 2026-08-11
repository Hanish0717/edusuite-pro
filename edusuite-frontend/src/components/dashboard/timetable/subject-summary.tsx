import { BookOpen, Layers, Award, Clock } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { SubjectSummaryItem } from "@/data/faculty-mock-data";

interface SubjectSummaryProps {
  subjects: SubjectSummaryItem[];
}

export function SubjectSummary({ subjects }: SubjectSummaryProps) {
  return (
    <Panel
      title="Assigned Subjects Summary"
      description="Overview of syllabus courses assigned for the term"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2 text-xs">
        {subjects.map((sub, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border bg-muted/20 hover:shadow-sm transition-all duration-300 space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h5 className="font-bold text-sm leading-snug">{sub.name}</h5>
                <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-bold font-mono">
                  {sub.code} &middot; {sub.semester}
                </p>
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[0.6rem] font-bold py-0.5 px-2 rounded-xl shrink-0">
                Active
              </Badge>
            </div>

            <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-2 text-center text-[0.65rem] text-muted-foreground font-medium">
              <div className="space-y-0.5">
                <span className="flex items-center justify-center gap-0.5 text-foreground"><Award className="size-3 text-primary/60" /> {sub.credits}</span>
                <span className="text-[0.55rem] uppercase tracking-wider block text-muted-foreground/80">Credits</span>
              </div>
              <div className="space-y-0.5">
                <span className="flex items-center justify-center gap-0.5 text-foreground"><Clock className="size-3 text-primary/60" /> {sub.weeklyHours}</span>
                <span className="text-[0.55rem] uppercase tracking-wider block text-muted-foreground/80">L-T-P Hrs</span>
              </div>
              <div className="space-y-0.5">
                <span className="flex items-center justify-center gap-0.5 text-foreground"><Layers className="size-3 text-primary/60" /> {sub.sections.join(", ")}</span>
                <span className="text-[0.55rem] uppercase tracking-wider block text-muted-foreground/80">Sections</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
