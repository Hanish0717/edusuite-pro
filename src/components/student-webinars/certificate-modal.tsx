import React from "react";
import { CertificateItem } from "./types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Download, Printer, ShieldCheck, Sparkles, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface CertificateModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  if (!certificate) return null;

  const handleDownload = () => {
    toast.success(`Downloading verified certificate ${certificate.certificateCode}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 rounded-[24px] border border-amber-500/30 bg-slate-950 text-white shadow-2xl overflow-hidden">
        {/* Certificate Frame Container */}
        <div className="p-8 sm:p-12 relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-center space-y-6">
          {/* Border Graphic Ornaments */}
          <div className="absolute inset-4 border-2 border-amber-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-6 border border-amber-500/15 rounded-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="size-4" />
          </button>

          {/* Top Emblem */}
          <div className="inline-flex p-4 rounded-full bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/40 shadow-xl mx-auto">
            <Award className="size-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              EduSuite Pro Technical Academy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-400">This credential is proudly awarded to</p>
          </div>

          {/* Student Name */}
          <div className="py-2 border-b border-amber-500/20 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-400">
              Alexander Vance
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Roll No: CS-2023-8891 • Computer Science & Engineering</p>
          </div>

          {/* Webinar & Course Details */}
          <div className="max-w-lg mx-auto space-y-2 text-xs text-slate-300">
            <p>
              for successfully attending and completing the interactive masterclass:
            </p>
            <p className="text-sm font-bold text-amber-300 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              "{certificate.webinarTitle}"
            </p>
            <p className="text-[11px] text-slate-400">
              Issued on <span className="text-white font-semibold">{certificate.issueDate}</span> by {certificate.issuerName}
            </p>
          </div>

          {/* Code & Verification Signature Row */}
          <div className="grid grid-cols-2 gap-4 pt-6 max-w-md mx-auto text-left border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Credential ID</span>
              <span className="font-mono text-amber-400 font-bold">{certificate.certificateCode}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Verification Status</span>
              <span className="inline-flex items-center text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="size-3.5 mr-1" /> Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-10 rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
          >
            <Printer className="size-4 mr-2" /> Print Certificate
          </Button>

          <Button
            onClick={handleDownload}
            className="h-10 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg"
          >
            <Download className="size-4 mr-2" /> Download Official PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
