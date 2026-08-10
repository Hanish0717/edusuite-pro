import { useState } from "react";
import { MessageSquare, Calendar, Sparkles, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface CounsellingPanelProps {
  student: StudentDetails;
}

export function CounsellingPanel({ student }: CounsellingPanelProps) {
  const [history, setHistory] = useState(student.counsellingHistory);

  const handleStartCounselling = () => {
    toast.success("Drafting Counselling Note...", {
      description: `Target: ${student.name}`,
    });
    // Add a mock draft log to history locally
    const newSession = {
      date: "2026-08-01",
      issue: "Active counseling session draft in progress",
      notes: "ERP review initiated by mentor faculty.",
      improvementPlan: "Schedule follow-up evaluation next Monday.",
    };
    setHistory([newSession, ...history]);
  };

  if (!student.isMentee) {
    return (
      <Panel
        title="Mentorship & Counselling Log"
        description="Chronological record of student guidance sessions"
        className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground space-y-3">
          <div className="grid size-10 place-items-center rounded-xl bg-muted">
            <MessageSquare className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h5 className="font-extrabold text-[0.72rem] text-foreground">Advisor Group Scope</h5>
            <p className="text-[0.62rem] max-w-[280px] leading-relaxed mt-0.5">
              This student is assigned to another designated mentor ({student.mentorName}). Mentorship logs are restricted.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Mentorship & Counselling Log"
      description="Chronological record of student guidance sessions and academic advisory"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs animate-fade-in"
    >
      <div className="space-y-4">
        {/* Actions bar */}
        <div className="flex justify-between items-center bg-muted/30 p-2.5 rounded-2xl border">
          <span className="font-bold text-[0.68rem] text-muted-foreground">Mentee Group Status: Safe</span>
          <Button
            onClick={handleStartCounselling}
            className="rounded-xl bg-brand-gradient shadow-glow text-[0.65rem] h-8 px-3 font-bold flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="size-3.5" /> Start Session
          </Button>
        </div>

        {/* History timelines list */}
        <div className="relative border-l border-border/80 pl-4 ml-2.5 space-y-4 py-1">
          {history.map((item, idx) => (
            <div key={idx} className="relative group space-y-1.5">
              <div className="absolute -left-[21px] top-0.5 size-2.5 rounded-full border-2 border-white bg-primary group-hover:scale-110 transition-transform shadow-sm" />
              
              <div className="flex justify-between items-center text-[0.62rem] text-muted-foreground font-semibold">
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {item.date}</span>
                <span className="text-primary font-bold">Mentorship Record</span>
              </div>
              
              <div className="p-3 border rounded-2xl bg-muted/20 space-y-2">
                <div>
                  <p className="font-extrabold text-[0.72rem] text-foreground leading-snug">{item.issue}</p>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5 leading-normal">{item.notes}</p>
                </div>
                <div className="pt-2 border-t border-border/40 text-[0.65rem] text-primary flex items-start gap-1 font-semibold">
                  <Sparkles className="size-3.5 shrink-0 mt-0.5" />
                  <span>Plan: {item.improvementPlan}</span>
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No counseling history logged yet.</p>
          )}
        </div>
      </div>
    </Panel>
  );
}
