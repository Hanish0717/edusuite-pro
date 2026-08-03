import { useState } from "react";
import { Plus, Upload, Download, Eye, FileText, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import type { QuestionPaper } from "./types";
import { PaperStatusBadge } from "./exam-badges";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface QuestionPaperPanelProps {
  papers: QuestionPaper[];
}

export function QuestionPaperPanel({ papers }: QuestionPaperPanelProps) {
  const [list, setList] = useState<QuestionPaper[]>(papers);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);

  const handleCreateDraft = () => {
    const newPaper: QuestionPaper = {
      id: `qp-new-${Date.now()}`,
      subject: "Selected Subject",
      code: "SUB000",
      type: "Semester End",
      status: "Draft"
    };
    setList((prev) => [newPaper, ...prev]);
    toast.success("Question Paper Draft Created", {
      description: "A new question paper template has been added to drafts."
    });
  };

  const handleUploadClick = () => {
    toast.info("Upload Dialog", {
      description: "Mock file upload initiated. Drag and drop file to upload."
    });
  };

  const handleDownload = (paper: QuestionPaper) => {
    toast.success("Downloading Template", {
      description: `Downloading question paper blueprint for ${paper.subject} (${paper.code}).`
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-sm text-foreground">Question Paper Roster</h3>
          <p className="text-xs text-muted-foreground">Upload and manage question papers for active exams.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold" onClick={handleUploadClick}>
            <Upload className="size-3.5" /> Upload File
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs font-bold bg-brand-gradient text-white" onClick={handleCreateDraft}>
            <Plus className="size-3.5" /> Create Draft
          </Button>
        </div>
      </div>

      {/* Grid of papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((paper) => (
          <div
            key={paper.id}
            className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
          >
            {/* Upper details */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="size-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <FileText className="size-4.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <PaperStatusBadge status={paper.status} />
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground leading-tight">{paper.subject}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{paper.code} · {paper.type}</p>
              </div>

              {/* Log messages */}
              <div className="text-[11px] space-y-1 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/30">
                {paper.submittedDate && (
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3" /> Submitted: <strong>{paper.submittedDate}</strong>
                  </p>
                )}
                {paper.approvedDate && (
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3 text-emerald-500" /> Approved: <strong>{paper.approvedDate}</strong>
                  </p>
                )}
                {paper.comments && (
                  <p className="flex items-start gap-1.5 leading-relaxed text-[10px] mt-1 border-t border-border/40 pt-1">
                    <MessageSquare className="size-3 mt-0.5 shrink-0" />
                    <span>HOD Comment: <em className="text-foreground">"{paper.comments}"</em></span>
                  </p>
                )}
                {!paper.submittedDate && (
                  <p className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                    <AlertCircle className="size-3 shrink-0" /> Awaiting submission.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-1.5 pt-4 border-t border-border/30 mt-4">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs flex-1 gap-1 font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedPaper(paper)}
              >
                <Eye className="size-3.5" /> Preview
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs flex-1 gap-1 font-bold text-muted-foreground hover:text-foreground"
                onClick={() => handleDownload(paper)}
              >
                <Download className="size-3.5" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={selectedPaper !== null} onOpenChange={(v) => !v && setSelectedPaper(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Question Paper Blueprint Preview</DialogTitle>
          </DialogHeader>
          {selectedPaper && (
            <div className="space-y-4 pt-3 text-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div>
                  <h4 className="font-bold text-foreground">{selectedPaper.subject}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Code: {selectedPaper.code} · Type: {selectedPaper.type}</p>
                </div>
                <PaperStatusBadge status={selectedPaper.status} />
              </div>

              {/* simulated preview structure */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4 font-mono text-[11px] leading-relaxed select-none">
                <div className="text-center font-bold border-b border-border/40 pb-2 uppercase tracking-wide">
                  Department Examination Board
                  <br />
                  Semester Evaluation Test
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span>Duration: 3 Hours</span>
                  <span>Max Marks: 100</span>
                </div>
                <div className="space-y-2">
                  <p className="font-bold">PART A (5 x 4 = 20 Marks) — Answer any 5 questions</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                    <li>Define the basic architectural components and goals.</li>
                    <li>Explain state storage allocations limits.</li>
                    <li>What is the difference between concurrency control structures?</li>
                    <li>Draw the block level structural relationships diagram.</li>
                  </ol>
                  <p className="font-bold pt-2">PART B (5 x 16 = 80 Marks) — Answer all questions</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                    <li>Detail the execution loop cycles with timing analysis logs.</li>
                    <li>Design a responsive, fault-tolerant network flow layout.</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold" onClick={() => setSelectedPaper(null)}>Close</Button>
                <Button size="sm" className="h-8 text-xs font-bold bg-brand-gradient text-white" onClick={() => handleDownload(selectedPaper)}>Download PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
