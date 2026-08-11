import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Award, Compass, Save, Send, Sparkles, FileText } from "lucide-react";
import type { StudentSubmission } from "@/data/faculty-mock-data";

interface EvaluationWorkspaceProps {
  submission: StudentSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveEvaluation: (roll: string, marks: number, feedback: string, status: "Evaluated" | "Draft") => void;
}

export function EvaluationWorkspace({
  submission,
  open,
  onOpenChange,
  onSaveEvaluation,
}: EvaluationWorkspaceProps) {
  if (!submission) return null;

  const [marks, setMarks] = useState(submission.marks?.toString() || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");

  // Simulated Rubric splits
  const [rubricAccuracy, setRubricAccuracy] = useState(85);
  const [rubricStructure, setRubricStructure] = useState(90);

  // Sync state with selected student
  useEffect(() => {
    setMarks(submission.marks?.toString() || "");
    setFeedback(submission.feedback || "");
  }, [submission]);

  const handleSave = (status: "Evaluated" | "Draft") => {
    const numMarks = parseInt(marks) || 0;
    if (numMarks < 0 || numMarks > 100) {
      toast.error("Marks must be between 0 and 100.");
      return;
    }

    onSaveEvaluation(submission.rollNumber, numMarks, feedback, status);

    toast.success(status === "Evaluated" ? "Evaluation Published!" : "Evaluation Draft Saved!", {
      description: `Roster grades synchronized for ${submission.studentName}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono font-bold text-[0.62rem] uppercase">
            <span>Roll: {submission.rollNumber}</span>
          </div>
          <DialogTitle className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
            <Award className="size-5 text-primary" /> Evaluation Workspace
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[0.7rem]">
            Grading student worksheet submission: {submission.studentName}
          </DialogDescription>
        </DialogHeader>

        {/* WORKSPACE FORM */}
        <div className="space-y-4 py-2">
          {/* Assignment preview mockup */}
          <div className="p-3 border rounded-2xl bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>
              <div>
                <p className="font-bold text-foreground">Attached Submission</p>
                <p className="text-[0.6rem] text-muted-foreground mt-0.5">{submission.fileName || "No File Uploaded"}</p>
              </div>
            </div>
            {submission.fileIndicator && (
              <span className="text-[0.6rem] text-primary font-bold bg-primary/5 border border-primary/10 py-0.5 px-2 rounded">
                Verified
              </span>
            )}
          </div>

          {/* Rubric sliders */}
          <div className="space-y-3 p-3.5 border rounded-2xl bg-muted/20">
            <h5 className="font-extrabold text-[0.72rem] text-foreground flex items-center gap-1"><Compass className="size-4 text-primary" /> Rubrics Weights</h5>
            <div className="space-y-2.5 pt-1 border-t border-border/40 text-[0.65rem] text-muted-foreground font-semibold">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Accuracy & Logic</span>
                  <span>{rubricAccuracy}% Weight</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rubricAccuracy}
                  onChange={(e) => setRubricAccuracy(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Structure & References</span>
                  <span>{rubricStructure}% Weight</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rubricStructure}
                  onChange={(e) => setRubricStructure(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-2 space-y-1">
              <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Score Marks (0 - 100)</label>
              <Input
                type="number"
                placeholder="Marks score"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="rounded-xl h-10 text-xs"
              />
            </div>
            <div className="col-span-1 p-2 bg-muted/40 border rounded-xl h-10 flex flex-col items-center justify-center font-bold font-mono">
              <span className="text-[0.55rem] text-muted-foreground">Percentage</span>
              <span className="text-[0.72rem] text-foreground">{marks || 0}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Evaluation Feedback Comments</label>
            <Textarea
              placeholder="Provide grading comments and areas of improvement..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="rounded-xl min-h-[70px] text-xs"
            />
          </div>
        </div>

        {/* WORKSPACE ACTIONS */}
        <div className="flex justify-between pt-4 border-t border-border/40 gap-3 mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9 px-4 font-semibold"
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave("Draft")}
              variant="outline"
              className="rounded-xl border border-border/70 cursor-pointer text-xs h-9 px-3.5 font-bold text-muted-foreground"
            >
              <Save className="size-3.5 mr-1" /> Save Draft
            </Button>
            <Button
              onClick={() => handleSave("Evaluated")}
              className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-4 font-bold"
            >
              <Send className="size-3.5 mr-1" /> Publish Grades
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
