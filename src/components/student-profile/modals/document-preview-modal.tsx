import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle2, History, Eye } from "lucide-react";

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    title: string;
    category: string;
    fileName: string;
    fileSize: string;
    uploadDate: string;
    status: string;
    version: string;
  } | null;
}

export function DocumentPreviewModal({ open, onOpenChange, document: doc }: DocumentPreviewModalProps) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> {doc.title}
            </DialogTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              {doc.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Category: {doc.category} &middot; Version: {doc.version} &middot; Size: {doc.fileSize}
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-3">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <FileText className="h-9 w-9" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{doc.fileName}</h4>
            <p className="text-xs text-slate-500">Uploaded on {doc.uploadDate} by Student Portal</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Digitally Verified by Academic Registrar
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl space-y-1 text-xs">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <History className="h-3.5 w-3.5 text-blue-500" /> Version Control Log
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>{doc.version} (Current)</span>
            <span>Uploaded {doc.uploadDate}</span>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
            Close Preview
          </Button>
          <Button
            onClick={() => alert(`Downloading ${doc.fileName}...`)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
