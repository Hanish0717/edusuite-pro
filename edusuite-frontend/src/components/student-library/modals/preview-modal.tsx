import React from "react";
import { DigitalResourceItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PreviewModalProps {
  resource: DigitalResourceItem | null;
  onClose: () => void;
}

export function ResourcePreviewModal({ resource, onClose }: PreviewModalProps) {
  if (!resource) return null;

  return (
    <Dialog open={!!resource} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] font-mono text-purple-600 border-purple-200">
              {resource.category}
            </Badge>
            <span className="text-[11px] font-mono text-slate-400">
              {resource.fileFormat} • {resource.fileSize}
            </span>
          </div>
          <DialogTitle className="text-base font-black text-slate-900 dark:text-white pt-1">
            {resource.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            Published by {resource.authorOrProvider} ({resource.year})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Department</span>
                <strong className="text-slate-800 dark:text-slate-200">{resource.department}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Subject</span>
                <strong className="text-slate-800 dark:text-slate-200">{resource.subject}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Downloads</span>
                <strong className="text-emerald-600">{resource.downloadsCount} times</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-bold block text-[11px] mb-1">Resource Overview</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {resource.description}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-center space-y-2">
            <FileText className="h-8 w-8 text-purple-600 mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white text-xs">Interactive PDF / Video Stream Preview</p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              You are accessing the verified digital repository of EduSuite Pro Central Library. Full document viewer is active.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800 flex-wrap sm:flex-nowrap">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs">
            Close
          </Button>
          <Button
            onClick={() => toast.success(`Bookmarked "${resource.title}"`)}
            variant="outline"
            className="rounded-xl text-xs gap-1.5"
          >
            <Bookmark className="h-4 w-4 text-purple-600" /> Bookmark
          </Button>
          <Button
            onClick={() => {
              window.open(resource.url, "_blank");
              toast.info("Opening resource in secure reader tab...");
            }}
            className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5"
          >
            <ExternalLink className="h-4 w-4" /> Open Full Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
