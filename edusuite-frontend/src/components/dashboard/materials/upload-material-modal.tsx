import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Paperclip, ClipboardList, RefreshCw, Send, Save, ArrowRight } from "lucide-react";

interface UploadMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uniqueSubjects: string[];
  uniqueSections: string[];
  onUploadMaterial: (mat: { title: string; subject: string; code: string; section: string; fileSize: string; fileType: "PDF" | "PPT" | "Video" | "DOC" | "ZIP"; unit: string; topic: string; visibility: "Visible" | "Faculty Only" | "Scheduled"; description: string }) => void;
}

export function UploadMaterialModal({
  open,
  onOpenChange,
  uniqueSubjects,
  uniqueSections,
  onUploadMaterial,
}: UploadMaterialModalProps) {
  const [step, setStep] = useState(1);
  
  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState<"PDF" | "PPT" | "Video" | "DOC" | "ZIP">("PDF");
  const [unit, setUnit] = useState("Unit I");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [visibility, setVisibility] = useState<"Visible" | "Faculty Only" | "Scheduled">("Visible");
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
    toast.success("Uploading Study Worksheet...", {
      description: "Uploading lecture_notes_cpu.pdf (2.4 MB).",
    });
    setAttachmentName("lecture_notes_cpu.pdf (2.4 MB)");
  };

  const handlePublish = (status: "Visible" | "Faculty Only") => {
    onUploadMaterial({
      title,
      subject,
      code: "CS301",
      section,
      fileSize: attachmentName && attachmentName.includes(" (") ? attachmentName.split(" (")[1]?.replace(")", "") || "1.8 MB" : "1.8 MB",
      fileType,
      unit,
      topic,
      visibility: status,
      description,
    });

    toast.success(status === "Visible" ? "Study Material Shared!" : "Draft Material Saved!", {
      description: `Roster directories updated.`,
    });

    // Reset states
    setTitle("");
    setSubject("");
    setSection("");
    setDescription("");
    setFileType("PDF");
    setUnit("Unit I");
    setTopic("");
    setKeywords("");
    setVisibility("Visible");
    setAttachmentName("");
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
            <Upload className="size-5 text-primary" /> Upload Study Material
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[0.7rem]">
            Step {step} of 5: Document upload configurations
          </DialogDescription>
        </DialogHeader>

        {/* STEPPER WIZARD INDICATOR */}
        <div className="flex items-center justify-between py-2 border-b border-border/40 mb-4 font-bold text-muted-foreground text-[0.55rem] uppercase tracking-wider">
          <span className={step === 1 ? "text-primary font-black" : ""}>1. Info</span>
          <span>&middot;</span>
          <span className={step === 2 ? "text-primary font-black" : ""}>2. Topic</span>
          <span>&middot;</span>
          <span className={step === 3 ? "text-primary font-black" : ""}>3. Upload</span>
          <span>&middot;</span>
          <span className={step === 4 ? "text-primary font-black" : ""}>4. Access</span>
          <span>&middot;</span>
          <span className={step === 5 ? "text-primary font-black" : ""}>5. Check</span>
        </div>

        {/* STEPS CONTENT */}
        <div className="space-y-4 py-2">
          {step === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Material Title</label>
                <Input
                  placeholder="e.g. CPU Scheduling Lecture Notes"
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
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Description</label>
                <Textarea
                  placeholder="Provide reference details for students..."
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
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Material Type</label>
                  <Select value={fileType} onValueChange={(val: any) => setFileType(val)}>
                    <SelectTrigger className="rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF Document</SelectItem>
                      <SelectItem value="PPT">PowerPoint</SelectItem>
                      <SelectItem value="Video">Video Clip</SelectItem>
                      <SelectItem value="DOC">DOC Sheet</SelectItem>
                      <SelectItem value="ZIP">ZIP Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Academic Unit</label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unit I">Unit I</SelectItem>
                      <SelectItem value="Unit II">Unit II</SelectItem>
                      <SelectItem value="Unit III">Unit III</SelectItem>
                      <SelectItem value="Unit IV">Unit IV</SelectItem>
                      <SelectItem value="Unit V">Unit V</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Topic Name</label>
                <Input
                  placeholder="e.g. Round Robin Scheduling"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Search Keywords (Comma separated)</label>
                <Input
                  placeholder="e.g. CPU, scheduling, round robin"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="border border-dashed rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 bg-muted/20">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary animate-bounce">
                  <Upload className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-foreground">Drag & drop files here</p>
                  <p className="text-[0.62rem] text-muted-foreground mt-0.5">Maximum file upload size allowed: 50MB</p>
                </div>
                <Button onClick={handleUploadSimulate} variant="outline" className="rounded-xl text-[0.62rem] h-8 font-semibold">
                  Browse Files
                </Button>
              </div>

              {attachmentName && (
                <div className="p-3 border rounded-xl bg-muted/40 text-left flex items-center justify-between font-mono text-[0.6rem] font-bold">
                  <span>{attachmentName}</span>
                  <span className="text-emerald-600">Selected</span>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <label className="font-extrabold text-muted-foreground uppercase text-[0.6rem] tracking-wider">Visibility & Release rules</label>
              <div className="space-y-2">
                <div
                  onClick={() => setVisibility("Visible")}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 ${visibility === "Visible" ? "border-primary bg-primary/5" : "bg-muted/10"}`}
                >
                  <Input type="radio" checked={visibility === "Visible"} onChange={() => {}} className="size-4 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">Visible to Students</p>
                    <p className="text-[0.6rem] text-muted-foreground mt-0.5">Directly publish and share with student dashboard timelines.</p>
                  </div>
                </div>

                <div
                  onClick={() => setVisibility("Faculty Only")}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 ${visibility === "Faculty Only" ? "border-primary bg-primary/5" : "bg-muted/10"}`}
                >
                  <Input type="radio" checked={visibility === "Faculty Only"} onChange={() => {}} className="size-4 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">Faculty Private Only</p>
                    <p className="text-[0.6rem] text-muted-foreground mt-0.5">Retain in private drafts folder. Exclude students access.</p>
                  </div>
                </div>

                <div
                  onClick={() => setVisibility("Scheduled")}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 ${visibility === "Scheduled" ? "border-primary bg-primary/5" : "bg-muted/10"}`}
                >
                  <Input type="radio" checked={visibility === "Scheduled"} onChange={() => {}} className="size-4 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">Scheduled Release</p>
                    <p className="text-[0.6rem] text-muted-foreground mt-0.5">Lock files. Release automatically on a target calendar date.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3.5 p-3.5 border rounded-2xl bg-muted/20">
              <h5 className="font-extrabold text-[0.72rem] text-foreground leading-snug">Review details before publishing</h5>
              <div className="space-y-2 text-[0.68rem] text-muted-foreground font-medium">
                <p className="flex justify-between"><span>Title:</span> <span className="text-foreground truncate max-w-[200px]">{title}</span></p>
                <p className="flex justify-between"><span>Subject / Section:</span> <span className="text-foreground">{subject} ({section})</span></p>
                <p className="flex justify-between"><span>Topic:</span> <span className="text-foreground">{unit} - {topic || "Introduction"}</span></p>
                <p className="flex justify-between"><span>Format:</span> <span className="text-foreground">{fileType}</span></p>
                <p className="flex justify-between"><span>Visibility:</span> <span className="text-foreground">{visibility}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* WIZARD ACTIONS */}
        <div className="flex justify-between pt-4 border-t border-border/40 gap-3 mt-4">
          <Button
            onClick={step === 1 ? () => onOpenChange(false) : handleBack}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9 px-4 font-semibold"
          >
            {step === 1 ? "Close" : "Previous"}
          </Button>

          {step < 5 ? (
            <Button
              onClick={handleNext}
              className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-5 font-bold flex items-center gap-1"
            >
              Continue <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => handlePublish("Faculty Only")}
                variant="outline"
                className="rounded-xl border border-border/70 cursor-pointer text-xs h-9 px-3.5 font-bold text-muted-foreground"
              >
                <Save className="size-3.5 mr-1" /> Save Draft
              </Button>
              <Button
                onClick={() => handlePublish("Visible")}
                className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-4 font-bold"
              >
                <Send className="size-3.5 mr-1" /> Share Material
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
