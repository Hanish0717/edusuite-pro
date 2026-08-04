import { useState } from "react";
import { Plus, Trash2, Upload, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface UploadResearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: (newPub: any) => void;
}

export function UploadResearchModal({ open, onOpenChange, onUploadSuccess }: UploadResearchModalProps) {
  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState("");
  const [pubType, setPubType] = useState("Journal");
  const [indexing, setIndexing] = useState("Scopus");
  const [journal, setJournal] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [doi, setDoi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [fileAttached, setFileAttached] = useState(false);

  const handleAddAuthor = () => {
    setAuthors((prev) => [...prev, ""]);
  };

  const handleAuthorChange = (idx: number, val: string) => {
    setAuthors((prev) => prev.map((a, i) => (i === idx ? val : a)));
  };

  const handleRemoveAuthor = (idx: number) => {
    if (authors.length > 1) {
      setAuthors((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleNext = () => {
    if (step < 5) setStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: "Research draft has been stored in your session workspace."
    });
    onOpenChange(false);
    resetForm();
  };

  const handleSubmit = () => {
    const newRecord = {
      id: `pub-new-${Date.now()}`,
      title: title || "Untitled Research Paper",
      authors: authors.filter((a) => a !== "").join(", ") || "Self",
      journalOrConference: journal || "Unknown Venue",
      publisher: publisher || "Unknown Publisher",
      year: Number(year) || 2026,
      doi: doi || undefined,
      issnOrIsbn: isbn || undefined,
      indexing: indexing as any,
      status: "Published" as const,
      type: pubType as any,
      documentUrl: fileAttached ? "#" : undefined
    };

    if (onUploadSuccess) {
      onUploadSuccess(newRecord);
    }

    toast.success("Research submitted successfully", {
      description: "Paper uploaded and sent for Department review board approval."
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setPubType("Journal");
    setIndexing("Scopus");
    setJournal("");
    setPublisher("");
    setYear(new Date().getFullYear().toString());
    setDoi("");
    setIsbn("");
    setAuthors([""]);
    setFileAttached(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Research & Publication</DialogTitle>
          <DialogDescription>Add journals, conference proceedings, patents, or textbooks to your profile.</DialogDescription>
        </DialogHeader>

        {/* Wizard step dots */}
        <div className="flex items-center gap-1.5 justify-center py-2 border-b border-border/40">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-8 bg-primary"
                  : step > s
                  ? "w-2 bg-emerald-500"
                  : "w-2 bg-muted-foreground/35"
              }`}
            />
          ))}
        </div>

        {/* Step details content */}
        <div className="space-y-4 py-3 min-h-[220px]">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wide">Step 1: General Details</h4>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Publication Title / Patent Title</label>
                <Input
                  placeholder="Enter full research paper title or description..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-9 bg-muted/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Publication Type</label>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded-lg border border-border bg-background"
                  >
                    <option value="Journal">Journal Article</option>
                    <option value="Conference">Conference Paper</option>
                    <option value="Book">Textbook Contribution</option>
                    <option value="Patent">Patent filing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Indexing</label>
                  <select
                    value={indexing}
                    onChange={(e) => setIndexing(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded-lg border border-border bg-background"
                  >
                    <option value="Scopus">Scopus</option>
                    <option value="SCI">SCI (Science Citation Index)</option>
                    <option value="SCIE">SCIE</option>
                    <option value="Google Scholar">Google Scholar</option>
                    <option value="Other">Other Indexing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Publication Details */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wide">Step 2: Publication Details</h4>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Journal Name / Conference Event</label>
                <Input
                  placeholder="e.g. IEEE Journal of Edge Computing"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="text-xs h-9 bg-muted/10"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-foreground">Publisher</label>
                  <Input
                    placeholder="e.g. Elsevier / Springer"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="text-xs h-9 bg-muted/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Year</label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="text-xs h-9 bg-muted/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">DOI (Optional)</label>
                  <Input
                    placeholder="e.g. 10.1109/..."
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="text-xs h-9 bg-muted/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">ISSN / ISBN (Optional)</label>
                  <Input
                    placeholder="e.g. 1234-5678"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="text-xs h-9 bg-muted/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Authors */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wide">Step 3: Co-Authors</h4>
              <p className="text-[11px] text-muted-foreground">List all contributing researchers. Add authors in order of contribution.</p>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {authors.map((author, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder={`Author ${idx + 1} Name`}
                      value={author}
                      onChange={(e) => handleAuthorChange(idx, e.target.value)}
                      className="text-xs h-9 bg-muted/10"
                    />
                    {authors.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => handleRemoveAuthor(idx)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold w-full" onClick={handleAddAuthor}>
                <Plus className="size-3.5" /> Add Author
              </Button>
            </div>
          )}

          {/* Step 4: Supporting Documents */}
          {step === 4 && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wide">Step 4: Attach Files</h4>
              <div
                onClick={() => setFileAttached(true)}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  fileAttached
                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-600"
                    : "border-border/60 hover:border-primary/50 hover:bg-muted/10 text-muted-foreground"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className={`size-8 ${fileAttached ? "text-emerald-500" : "text-muted-foreground/50"}`} />
                  {fileAttached ? (
                    <div>
                      <p className="text-xs font-bold">Manuscript_Fulltext.pdf attached</p>
                      <p className="text-[10px] opacity-75 mt-0.5">Click to replace file.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold">Drag and drop file, or click to upload</p>
                      <p className="text-[10px] opacity-75 mt-0.5">Supports PDF, DOC, ZIP up to 10MB.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wide">Step 5: Review Sheet</h4>
              <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5 space-y-2 text-xs">
                <p className="line-clamp-2"><span className="text-muted-foreground font-medium">Title:</span> <strong className="text-foreground">{title || "Untitled Paper"}</strong></p>
                <div className="grid grid-cols-2 gap-2 border-t border-border/30 pt-2 mt-2">
                  <p><span className="text-muted-foreground font-medium">Type:</span> <strong className="text-foreground">{pubType}</strong></p>
                  <p><span className="text-muted-foreground font-medium">Indexing:</span> <strong className="text-foreground">{indexing}</strong></p>
                  <p className="col-span-2"><span className="text-muted-foreground font-medium">Journal/Conf:</span> <strong className="text-foreground">{journal || "—"}</strong></p>
                  <p className="col-span-2"><span className="text-muted-foreground font-medium">Authors:</span> <strong className="text-foreground">{authors.filter(a => a !== "").join(", ") || "—"}</strong></p>
                  <p><span className="text-muted-foreground font-medium">File:</span> <strong className="text-foreground">{fileAttached ? "Attached" : "Not Attached"}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Row Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
          <Button size="sm" variant="ghost" className="h-8 text-xs font-bold" onClick={handleSaveDraft}>
            Save Draft
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button size="sm" variant="outline" className="h-8 gap-1 text-xs font-bold" onClick={handlePrev}>
                <ChevronLeft className="size-3.5" /> Back
              </Button>
            )}
            {step < 5 ? (
              <Button size="sm" className="h-8 gap-1 bg-brand-gradient text-white text-xs font-bold" onClick={handleNext}>
                Next <ChevronRight className="size-3.5" />
              </Button>
            ) : (
              <Button size="sm" className="h-8 gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold" onClick={handleSubmit}>
                <CheckCircle className="size-3.5" /> Submit Research
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
