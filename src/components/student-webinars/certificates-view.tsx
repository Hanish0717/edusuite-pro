import React from "react";
import { CertificateItem } from "./types";
import { Award, Download, Eye, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificatesViewProps {
  certificates: CertificateItem[];
  onDownload: (cert: CertificateItem) => void;
  onView: (cert: CertificateItem) => void;
}

export function CertificatesView({ certificates, onDownload, onView }: CertificatesViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="size-5 text-amber-500" /> My Certificates ({certificates.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="size-5" />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="size-3" /> VERIFIED
              </span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {cert.certificateName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {cert.webinarTitle}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-amber-500" /> Issued: {cert.issueDate}
              </span>
              <span className="font-mono text-[10px]">{cert.certificateCode}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => onView(cert)}
                className="h-8 text-xs font-semibold rounded-xl"
              >
                <Eye className="size-3 mr-1" /> View
              </Button>
              <Button
                onClick={() => onDownload(cert)}
                className="h-8 text-xs font-bold rounded-xl bg-[#091024] hover:bg-[#152248] text-white"
              >
                <Download className="size-3 mr-1" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
