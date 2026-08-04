import React from "react";
import { CertificateItem } from "./types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Download, Printer, ShieldCheck, X, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";

interface CertificateModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (cert: CertificateItem) => void;
  isDownloading: boolean;
}

export function CertificateModal({
  certificate,
  isOpen,
  onClose,
  onDownload,
  isDownloading,
}: CertificateModalProps) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentName = "K. Sai Teja";
  const studentId = "22CS101";
  const department = "Computer Science & Engineering";

  const speakerName = certificate.webinarId === "web-106" 
    ? "Dr. Priya Sharma" 
    : certificate.webinarId === "web-107"
    ? "Mr. Arjun Reddy"
    : "Dr. Raghav Menon";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 rounded-[24px] border border-amber-500/30 bg-slate-950 text-white shadow-2xl overflow-hidden">
        <style>{`
          @media print {
            @page {
              size: landscape;
            }
            body * {
              visibility: hidden !important;
            }
            #certificate-preview-container, #certificate-preview-container * {
              visibility: visible !important;
            }
            #certificate-preview-container {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 297mm !important;
              height: 210mm !important;
              border: none !important;
              box-shadow: none !important;
              background: #020617 !important;
              color: white !important;
              padding: 2.5rem !important;
              box-sizing: border-box !important;
            }
          }
        `}</style>

        {/* Certificate Frame Container */}
        <div 
          id="certificate-preview-container"
          className="p-8 sm:p-12 relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-center space-y-6"
        >
          {/* Border Graphic Ornaments */}
          <div className="absolute inset-4 border-2 border-amber-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-6 border border-amber-500/15 rounded-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white print:hidden"
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
              {studentName}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Student ID: {studentId} • {department}
            </p>
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
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto text-left border-t border-amber-500/20 items-end text-xs">
            {/* Left: QR Code & ID */}
            <div className="space-y-2">
              <div className="p-1 bg-white rounded-md inline-block">
                <QRCode
                  value={`EDUSUITE-CERT-${certificate.certificateCode}`}
                  size={50}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">Credential ID</span>
                <span className="font-mono text-amber-400 font-bold text-[10px]">{certificate.certificateCode}</span>
              </div>
            </div>

            {/* Center: Gold Seal and Status */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center size-14 rounded-full border-2 border-amber-400 bg-amber-500/10 text-amber-400 font-serif font-bold text-[10px] shadow-lg shadow-amber-500/15">
                SEAL
              </div>
              <div>
                <span className="inline-flex items-center text-emerald-400 font-bold text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="size-3 mr-1" /> Verified
                </span>
              </div>
            </div>

            {/* Right: Speaker & Authorized Signature */}
            <div className="text-right space-y-4">
              <div className="space-y-1">
                <span className="font-serif italic text-amber-300 text-sm block tracking-wide">Priya Sharma</span>
                <div className="h-[1px] bg-slate-700 w-28 ml-auto" />
                <span className="text-[9px] text-slate-500 block">Authorized Signature</span>
              </div>
              <div className="text-slate-300">
                <span className="text-[9px] text-slate-500 block">Speaker</span>
                <span className="font-bold text-[10px]">{speakerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between print:hidden">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-10 rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
          >
            <Printer className="size-4 mr-2" /> Print Certificate
          </Button>

          <Button
            onClick={() => onDownload(certificate)}
            className="h-10 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg"
          >
            {isDownloading && <Loader2 className="size-4 mr-2 animate-spin" />}
            <Download className="size-4 mr-2" /> Download Official PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
