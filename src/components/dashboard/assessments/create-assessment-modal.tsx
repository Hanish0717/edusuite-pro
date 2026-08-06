import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, CheckCircle2, X } from "lucide-react";
import type { AssessmentItem, AssessmentType } from "./types";

const TYPES: AssessmentType[] = [
  "Internal 1", "Internal 2", "Quiz", "Assignment",
  "Lab Assessment", "Viva", "Seminar", "Project Evaluation",
];

const STEPS = ["Basic Info", "Details", "Instructions", "Review"] as const;

interface Form {
  name: string; type: AssessmentType; subject: string; section: string;
  maxMarks: string; date: string; duration: string; weightage: string;
  instructions: string; submissionMethod: string; remarks: string;
}

const EMPTY: Form = {
  name: "", type: "Internal 1", subject: "", section: "",
  maxMarks: "100", date: "", duration: "2 Hours", weightage: "25%",
  instructions: "", submissionMethod: "Written Booklet", remarks: "",
};

interface CreateAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  subjects: string[];
  sections: string[];
  assessmentToEdit?: AssessmentItem | null;
  onSave?: (assessmentData: Form, isEdit: boolean, publish: boolean) => void;
}

export function CreateAssessmentModal({
  open,
  onClose,
  subjects,
  sections,
  assessmentToEdit,
  onSave,
}: CreateAssessmentModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ ...EMPTY });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (assessmentToEdit && open) {
      setForm({
        name: assessmentToEdit.name,
        type: assessmentToEdit.type,
        subject: assessmentToEdit.subject,
        section: assessmentToEdit.section,
        maxMarks: String(assessmentToEdit.maxMarks),
        date: assessmentToEdit.date,
        duration: assessmentToEdit.duration || "2 Hours",
        weightage: assessmentToEdit.weightage || "25%",
        instructions: assessmentToEdit.instructions || "",
        submissionMethod: assessmentToEdit.submissionMethod || "Written Booklet",
        remarks: "",
      });
    } else if (open) {
      setForm({ ...EMPTY });
    }
  }, [assessmentToEdit, open]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (publish: boolean) => {
    setSaved(true);
    if (onSave) {
      onSave(form, !!assessmentToEdit, publish);
    }
    setTimeout(() => {
      setSaved(false);
      setStep(0);
      setForm({ ...EMPTY });
      onClose();
    }, 1000);
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const titleText = assessmentToEdit ? "Edit Assessment" : "Create Assessment";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setStep(0); setForm({ ...EMPTY }); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">{titleText}</DialogTitle>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted/50 transition-colors">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`flex items-center justify-center size-7 rounded-full text-xs font-bold border-2 transition-all ${
                  i < step ? "bg-primary border-primary text-primary-foreground" :
                  i === step ? "border-primary text-primary bg-primary/10" :
                  "border-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </div>
                <span className={`text-[0.6rem] font-semibold hidden sm:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border/50 mx-1" />}
              </div>
            ))}
          </div>

          <div className="h-1 rounded-full bg-muted/40 mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </DialogHeader>

        <div className="px-6 py-5 min-h-[280px]">
          {saved ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <CheckCircle2 className="size-12 text-emerald-500" />
              <p className="text-lg font-bold text-emerald-600">
                {assessmentToEdit ? "Assessment Updated!" : "Assessment Saved!"}
              </p>
            </div>
          ) : (
            <>
              {step === 0 && (
                <Step1 form={form} set={set} types={TYPES} subjects={subjects} sections={sections} />
              )}
              {step === 1 && <Step2 form={form} set={set} />}
              {step === 2 && <Step3 form={form} set={set} />}
              {step === 3 && <ReviewStep form={form} />}
            </>
          )}
        </div>

        {!saved && (
          <div className="px-6 pb-6 flex items-center justify-between border-t border-border/40 pt-4">
            <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="gap-1.5">
              <ChevronLeft className="size-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              {step === 3 ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleSave(false)}>Save Draft</Button>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80" onClick={() => handleSave(true)}>Publish</Button>
                </>
              ) : (
                <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary to-primary/80" onClick={() => setStep((s) => s + 1)}>
                  Next <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Step sub-components ──────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">{children}</label>;
}

function Step1({ form, set, types, subjects, sections }: {
  form: Form; set: (k: keyof Form) => any; types: AssessmentType[]; subjects: string[]; sections: string[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Assessment Name</FieldLabel>
        <Input placeholder="e.g. Operating Systems — Internal I" value={form.name} onChange={set("name")} className="text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Assessment Type</FieldLabel>
          <select className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.type} onChange={set("type")}>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Subject</FieldLabel>
          <select className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.subject} onChange={set("subject")}>
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Section</FieldLabel>
          <select className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.section} onChange={set("section")}>
            <option value="">Select Section</option>
            {sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, set }: { form: Form; set: (k: keyof Form) => any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Maximum Marks</FieldLabel>
          <Input type="number" value={form.maxMarks} onChange={set("maxMarks")} className="text-sm" />
        </div>
        <div>
          <FieldLabel>Assessment Date</FieldLabel>
          <Input type="date" value={form.date} onChange={set("date")} className="text-sm" />
        </div>
        <div>
          <FieldLabel>Duration</FieldLabel>
          <Input placeholder="e.g. 2 Hours" value={form.duration} onChange={set("duration")} className="text-sm" />
        </div>
        <div>
          <FieldLabel>Weightage</FieldLabel>
          <Input placeholder="e.g. 25%" value={form.weightage} onChange={set("weightage")} className="text-sm" />
        </div>
      </div>
    </div>
  );
}

function Step3({ form, set }: { form: Form; set: (k: keyof Form) => any }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>General Instructions</FieldLabel>
        <Textarea rows={3} placeholder="Exam rules, allowed resources, etc." value={form.instructions} onChange={set("instructions")} className="text-sm resize-none" />
      </div>
      <div>
        <FieldLabel>Submission Method</FieldLabel>
        <Input placeholder="e.g. Written Booklet / Online Portal" value={form.submissionMethod} onChange={set("submissionMethod")} className="text-sm" />
      </div>
      <div>
        <FieldLabel>Remarks (optional)</FieldLabel>
        <Textarea rows={2} placeholder="Any additional notes..." value={form.remarks} onChange={set("remarks")} className="text-sm resize-none" />
      </div>
    </div>
  );
}

function ReviewStep({ form }: { form: Form }) {
  const rows: [string, string][] = [
    ["Name", form.name || "—"], ["Type", form.type], ["Subject", form.subject || "—"],
    ["Section", form.section || "—"], ["Max Marks", form.maxMarks], ["Date", form.date || "—"],
    ["Duration", form.duration], ["Weightage", form.weightage],
    ["Submission", form.submissionMethod],
  ];
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground mb-3">Review your assessment before saving:</p>
      <div className="rounded-xl border border-border/50 overflow-hidden divide-y divide-border/30">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center px-4 py-2.5">
            <span className="w-32 text-xs font-bold text-muted-foreground uppercase tracking-wide">{k}</span>
            <span className="text-sm text-foreground font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
