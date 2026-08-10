import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, QrCode, ShieldCheck, Library, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface LibraryCardModalProps {
  open: boolean;
  onClose: () => void;
}

export function LibraryCardModal({ open, onClose }: LibraryCardModalProps) {
  const handleDownload = () => {
    toast.success("Digital Library Smart ID Card downloaded successfully!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="h-5 w-5 text-purple-600" /> Digital Library Pass & RFID Card
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Official EduSuite Pro OPAC digital pass for book issues & gate access.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          {/* Card Preview Container */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl border border-purple-800/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Library className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-wide">EDUSUITE PRO</h4>
                  <p className="text-[9px] text-purple-300 uppercase tracking-widest font-mono">Central Library Pass</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-xl bg-purple-900/50 border border-purple-400/30 flex items-center justify-center shrink-0">
                <UserCheck className="h-8 w-8 text-purple-300" />
              </div>

              <div className="space-y-0.5 text-xs">
                <h5 className="font-bold text-sm">Sai Teja</h5>
                <p className="text-[11px] text-purple-200 font-mono">Roll No: 22CS101</p>
                <p className="text-[10px] text-slate-400">Dept: Computer Science & Engg</p>
                <p className="text-[10px] text-slate-400">Borrow Limit: 6 Books (Max)</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-800/50 text-[10px] font-mono">
              <div>
                <span className="text-slate-400 block text-[9px]">RFID BARCODE</span>
                <span className="text-purple-300">LIB-RFID-2026-9011</span>
              </div>
              <div className="p-1 rounded bg-white shrink-0">
                <QrCode className="h-9 w-9 text-slate-950" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs">
            Close
          </Button>
          <Button
            onClick={handleDownload}
            className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5"
          >
            <Download className="h-4 w-4" /> Download PDF Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
