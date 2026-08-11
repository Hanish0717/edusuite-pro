import React from "react";
import { FileText, CheckCircle2, XCircle, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StudentDocument } from "../../types";

interface StudentDocumentsProps {
  documents: StudentDocument[];
  onVerify: (id: string, status: "Verified" | "Rejected") => void;
}

export function StudentDocuments({ documents, onVerify }: StudentDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        No documents uploaded for verification.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-4 rounded-xl border border-border/80 bg-card/50 flex items-start gap-3 justify-between"
        >
          <div className="flex gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary self-start">
              <FileText className="size-4" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-foreground">{doc.name}</h4>
              <p className="text-[0.68rem] text-muted-foreground">{doc.type}</p>
              <p className="text-[0.62rem] text-muted-foreground font-mono mt-1">
                Uploaded: {doc.uploadedAt}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              className={
                doc.status === "Verified"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem]"
                  : doc.status === "Rejected"
                  ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem]"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem]"
              }
            >
              {doc.status === "Verified" && <CheckCircle2 className="size-3 mr-1" />}
              {doc.status === "Rejected" && <XCircle className="size-3 mr-1" />}
              {doc.status === "Pending" && <Clock className="size-3 mr-1" />}
              {doc.status}
            </Badge>

            {doc.status === "Pending" && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onVerify(doc.id, "Verified")}
                  className="size-7 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                  title="Approve Document"
                >
                  <Check className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onVerify(doc.id, "Rejected")}
                  className="size-7 text-red-600 hover:bg-red-50 border-red-200"
                  title="Reject Document"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
