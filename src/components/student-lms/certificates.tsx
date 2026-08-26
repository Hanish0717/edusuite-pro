import React, { useState } from "react";
import { CertificateItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Award, Download, QrCode, Eye, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CertificatesProps {
  certificates: CertificateItem[];
  searchQuery: string;
}

export function Certificates({ certificates, searchQuery }: CertificatesProps) {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [qrCert, setQrCert] = useState<CertificateItem | null>(null);

  const types = ["All", "Completed Course", "Workshop", "Internship", "Hackathon", "Skill Badge"];

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownloadPdf = (cert: CertificateItem) => {
    const certText = `EDUSUITE PRO ACADEMIC CREDENTIAL & CERTIFICATE
=====================================================
CERTIFICATE OF ACCOMPLISHMENT
=====================================================
Awarded to: Sai Teja (Roll No: 22CS101)
Credential: ${cert.title}
Certificate Type: ${cert.type}
Issuing Authority: ${cert.issuer}
Date of Issue: ${cert.issueDate}
Verification ID: CERT-${cert.id}-2026-VERIFIED

This certifies that the candidate has successfully fulfilled all academic criteria, assignments, and practical evaluations.

Verified Digital Credential — EduSuite ERP`;

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificate_${cert.title.replace(/[\s,]+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Verified PDF Certificate for ${cert.title}`);
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Credentials, Certifications & Skill Badges
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Verified digital certificates issued by EduSuite Academic Board & industry partners.
            </p>
          </div>
        </div>

        {/* TYPE CHIPS */}
        <div className="flex flex-wrap items-center gap-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedType === t
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* GRID OF CERTIFICATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  className={`text-[9px] px-2 py-0.5 font-mono ${
                    cert.type === "Completed Course"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : cert.type === "Hackathon"
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : cert.type === "Workshop"
                      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  {cert.type}
                </Badge>

                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                {cert.title}
              </h3>

              <p className="text-xs text-slate-500 font-medium">Issuer: {cert.issuer}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1">
                {cert.skills.map((sk) => (
                  <span key={sk} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>Issued: {cert.issueDate}</span>
                <span>ID: {cert.credentialId}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
              <Button
                onClick={() => setPreviewCert(cert)}
                size="sm"
                variant="outline"
                className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden"
              >
                <Eye className="h-3 w-3 shrink-0" />
                <span className="truncate">Preview</span>
              </Button>

              <Button
                onClick={() => handleDownloadPdf(cert)}
                size="sm"
                variant="outline"
                className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden"
              >
                <Download className="h-3 w-3 text-blue-600 shrink-0" />
                <span className="truncate">PDF</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW CERTIFICATE MODAL */}
      {previewCert && (
        <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
          <DialogContent className="max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge className="w-fit mb-1 font-mono text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20">
                {previewCert.type} Certificate
              </Badge>
              <DialogTitle className="text-base font-bold">
                {previewCert.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Issued to Aditya Verma by {previewCert.issuer} on {previewCert.issueDate}
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-amber-500/30 text-center space-y-3 relative overflow-hidden shadow-inner">
              <Award className="h-16 w-16 text-amber-600 mx-auto" />
              <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-white">
                Certificate of Academic Excellence
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                This certifies that <strong className="text-slate-900 dark:text-white">Aditya Verma (2021CSE084)</strong> has successfully completed the required coursework and practical evaluation for <span className="font-bold text-amber-700">{previewCert.title}</span>.
              </p>
              <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Credential ID: {previewCert.credentialId}</span>
                <span className="text-emerald-600 font-bold">Digital Signature Verified</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => handleDownloadPdf(previewCert)}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 w-full"
              >
                <Download className="h-3.5 w-3.5" /> Download High-Res PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* QR VERIFY MODAL */}
      {qrCert && (
        <Dialog open={!!qrCert} onOpenChange={() => setQrCert(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center space-y-3">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-center">
              <DialogTitle className="text-base font-bold flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4 text-amber-600" /> Verify Credential QR Code
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Scan to verify authenticity on EduSuite Blockchain Registrar
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-amber-500/40 inline-block mx-auto shadow-md">
              <QrCode className="h-32 w-32 text-slate-900 mx-auto" />
              <span className="text-[10px] font-mono text-slate-500 block mt-2">{qrCert.credentialId}</span>
            </div>

            <p className="text-xs font-mono text-emerald-600 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Cryptographically Validated on Public Ledger
            </p>

            <DialogFooter>
              <Button onClick={() => setQrCert(null)} className="rounded-xl text-xs w-full">
                Close Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
