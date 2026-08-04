import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Check, Paperclip, ClipboardList, RefreshCw, Send, Save } from "lucide-react";

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uniqueSubjects: string[];
  uniqueSections: string[];
  onAddAssignment: (asg: { title: string; subject: string; code: string; section: string; dueDate: string; maxMarks: number; description: string; status: "Active" | "Draft" }) => void;
}

export function CreateAssignmentModal({
  open,
  onOpenChange,
  uniqueSubjects,
  uniqueSections,
  onAddAssignment,
}: CreateAssignmentModalProps) {
  const [step, setStep] = useState(1);
  
  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [dueDate, setDueDate] = useState("2026-08-15");
  const [submissionType, setSubmissionType] = useState("PDF/ZIP");
  const [attachmentName, setAttachmentName] = useState("");

  const handleNext = () => {
    if (step === 1 && (!title || !subject || !section)) {
      toast.error("Please fill in basic details.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleUploadSimulate = () => {
    toast.success("Uploading Attachment...", {
      description: "Uploading syllabus_reference.pdf (124 KB).",
    });
    setAttachmentName("syllabus_reference.pdf (124 KB)");
  };

  const handlePublish = (status: "Active" | "Draft") => {
    onAddAssignment({
      title,
      subject,
      code: "CS301",
      section,
      dueDate,
      maxMarks: parseInt(maxMarks) || 100,
      description,
      status,
    });

    toast.success(status === "Active" ? "Assignment Published!" : "Draft Saved Successfully!", {
      description: `Roster notifications dispatched.`,
    });

    // Reset states
    setTitle("");
    setSubject("");
    setSection("");
    setDescription("");
    setMaxMarks("100");
    setDueDate("2026-08-15");
    setSubmissionType("PDF/ZIP");
    setAttachmentName("");
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" /> Create New Assignment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[0.7rem]">
            Step {step} of 4: Roster configuration wizard
          </DialogDescription>
        </DialogHeader>

        {/* STEPPER METRICS INDICATOR */}
        <div className="flex items-center justify-between py-2 border-b border-border/40 mb-4 font-bold text-muted-foreground text-[0.6rem] uppercase tracking-wider">
          <span className={step === 1 ? "text-primary font-black" : ""}>1. Basic Info</span>
          <span>&middot;</span>
          <span className={step === 2 ? "text-primary font-black" : ""}>2. Academic</span>
          <span>&middot;</span>
          <span className={step === 3 ? "text-primary font-black" : ""}>3. Attach</span>
          <span>&middot;</span>
          <span className={step === 4 ? "text-primary font-black" : ""}>4. Review</span>
        </div>

        {/* FORM STEPS CONTENT */}
        <div className="space-y-4 py-2">
          {step === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Assignment Title</label>
                <Input
                  placeholder="e.g. Operating Systems Lab Work 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Subject</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSubjects.filter(s => s !== "ALL").map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Section</label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSections.filter(s => s !== "ALL").map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Description & Guidance Notes</label>
                <Textarea
                  placeholder="Provide guidance outline notes for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl min-h-[80px] text-xs"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Maximum Marks</label>
                  <Input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Allowed Submission format</label>
                <Select value={submissionType} onValueChange={setSubmissionType}>
                  <SelectTrigger className="rounded-xl h-10 text-xs">
                    <SelectValue placeholder="SelectFormat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF/ZIP">PDF / ZIP Files Only</SelectItem>
                    <SelectItem value="DOC/PPT">DOC / PPT Presentations</SelectItem>
                    <SelectItem value="IMAGES">Images & Photos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="border border-dashed rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 bg-muted/20">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Paperclip className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-foreground">Attach reference guides</p>
                  <p className="text-[0.62rem] text-muted-foreground mt-0.5">Upload PDFs, ZIP worksheets, or rubrics documents</p>
                </div>
                <Button onClick={handleUploadSimulate} variant="outline" className="rounded-xl text-[0.62rem] h-8 font-semibold">
                  Choose Worksheets
                </Button>
              </div>

              {attachmentName && (
                <div className="p-3 border rounded-xl bg-muted/40 text-left flex items-center justify-between font-mono text-[0.6rem] font-bold">
                  <span>{attachmentName}</span>
                  <span className="text-emerald-600">Attached</span>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3.5 p-3.5 border rounded-2xl bg-muted/20">
              <h5 className="font-extrabold text-[0.72rem] text-foreground leading-snug">Review details before publishing</h5>
              <div className="space-y-2 text-[0.68rem] text-muted-foreground font-medium">
                <p className="flex justify-between"><span>Title:</span> <span className="text-foreground truncate max-w-[200px]">{title}</span></p>
                <p className="flex justify-between"><span>Subject / Section:</span> <span className="text-foreground">{subject} ({section})</span></p>
                <p className="flex justify-between"><span>Maximum Score:</span> <span className="text-foreground">{maxMarks} Marks</span></p>
                <p className="flex justify-between"><span>Due Date:</span> <span className="text-foreground">{dueDate}</span></p>
                {attachmentName && <p className="flex justify-between"><span>Attachment:</span> <span className="text-foreground">{attachmentName.split(" ")[0]}</span></p>}
              </div>
            </div>
          )}
        </div>

        {/* STEPPER WIZARD FOOTER ACTIONS */}
        <div className="flex justify-between pt-4 border-t border-border/40 gap-3 mt-4">
          <Button
            onClick={step === 1 ? () => onOpenChange(false) : handleBack}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9 px-4 font-semibold"
          >
            {step === 1 ? "Close" : "Previous"}
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-5 font-bold"
            >
              Continue
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => handlePublish("Draft")}
                variant="outline"
                className="rounded-xl border border-border/70 cursor-pointer text-xs h-9 px-3.5 font-bold text-muted-foreground"
              >
                <Save className="size-3.5 mr-1" /> Save Draft
              </Button>
              <Button
                onClick={() => handlePublish("Active")}
                className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-4 font-bold"
              >
                <Send className="size-3.5 mr-1" /> Publish Sheet
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
