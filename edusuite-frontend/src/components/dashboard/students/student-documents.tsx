import { FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";

interface StudentDocumentsProps {
  documents: {
    name: string;
    fileName: string;
    size: string;
  }[];
}

export function StudentDocuments({ documents }: StudentDocumentsProps) {
  const handleDownload = (title: string) => {
    toast.success(`Downloading Student Document: ${title}`, {
      description: "Secure certificate copy downloaded.",
    });
  };

  const handlePreview = (title: string) => {
    toast.info(`Opening file preview for: ${title}`);
  };

  return (
    <Panel
      title="Student Verification Documents"
      description="Certificates and officially submitted leave/bonafide letters"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <h6 className="font-bold truncate leading-snug">{doc.name}</h6>
                <p className="text-[0.6rem] text-muted-foreground mt-0.5">{doc.size}</p>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button
                onClick={() => handlePreview(doc.name)}
                variant="outline"
                className="rounded-xl cursor-pointer hover:bg-muted text-[0.65rem] h-8 px-3 flex items-center gap-1 font-semibold"
              >
                <Eye className="size-3.5" /> View
              </Button>
              <Button
                onClick={() => handleDownload(doc.name)}
                variant="outline"
                className="rounded-xl cursor-pointer hover:bg-muted text-[0.65rem] h-8 px-3 flex items-center gap-1 font-semibold"
              >
                <Download className="size-3.5" /> Get
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
