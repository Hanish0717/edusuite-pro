import { FileText, Eye, Download } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import type { DocumentItem } from "@/data/faculty-mock-data";

interface DocumentsGridProps {
  documents: DocumentItem[];
}

export function DocumentsGrid({ documents }: DocumentsGridProps) {
  const handlePreview = (name: string) => {
    toast.success(`Previewing document: ${name}`, {
      description: "Frontend preview modal simulation active.",
    });
  };

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading file: ${fileName}`, {
      description: "Secure folder download initiated.",
    });
  };

  return (
    <Panel
      title="Uploaded Documents"
      description="Official certificates and identity proofs verified by HR"
      className="h-full border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3.5 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-all duration-300"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-foreground leading-normal truncate">{doc.name}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-medium truncate">
                {doc.uploadedDate} &middot; {doc.size}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handlePreview(doc.name)}
                  variant="link"
                  className="h-auto p-0 text-[0.65rem] font-bold text-primary flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="size-3" /> Preview
                </Button>
                <Button
                  onClick={() => handleDownload(doc.fileName)}
                  variant="link"
                  className="h-auto p-0 text-[0.65rem] font-bold text-primary flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3" /> Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
