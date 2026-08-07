import { useState, useRef } from "react";
import { ScholarshipItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Plus, Upload, CheckCircle2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ScholarshipsProps {
  scholarships: ScholarshipItem[];
  onOpenScholarshipModal: () => void;
}

interface UploadedDoc {
  scholarshipId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  dataUrl?: string;
}

const STORAGE_KEY = "EDUSUITE_SCHOLARSHIP_DOCS";

function loadDocs(): UploadedDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDocs(docs: UploadedDoc[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error("Failed to save docs to localStorage", e);
  }
}

export function Scholarships({ scholarships, onOpenScholarshipModal }: ScholarshipsProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipItem | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(() => loadDocs());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalApproved = scholarships
    .filter((s) => s.status === "Approved")
    .reduce((sum, s) => sum + s.approvedAmount, 0);

  const openUploadModal = (sch: ScholarshipItem) => {
    setSelectedScholarship(sch);
    setUploadModalOpen(true);
  };

  const getDocForScholarship = (id: string) =>
    uploadedDocs.find((d) => d.scholarshipId === id);

  const handleFileSelect = (file: File) => {
    if (!selectedScholarship) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, PNG, or DOCX files are allowed.");
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must not exceed 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newDoc: UploadedDoc = {
        scholarshipId: selectedScholarship.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toLocaleString("en-IN"),
        dataUrl: e.target?.result as string,
      };
      const updated = [
        ...uploadedDocs.filter((d) => d.scholarshipId !== selectedScholarship.id),
        newDoc,
      ];
      setUploadedDocs(updated);
      saveDocs(updated);
      toast.success(`Document "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDeleteDoc = (scholarshipId: string) => {
    const updated = uploadedDocs.filter((d) => d.scholarshipId !== scholarshipId);
    setUploadedDocs(updated);
    saveDocs(updated);
    toast.info("Document removed.");
  };

  const handlePreviewDoc = (doc: UploadedDoc) => {
    if (!doc.dataUrl) return;
    if (doc.fileType === "application/pdf" || doc.fileType.startsWith("image/")) {
      const win = window.open();
      if (win) {
        win.document.write(`<html><body style="margin:0"><iframe src="${doc.dataUrl}" width="100%" height="100%" style="border:none;"></iframe></body></html>`);
        win.document.close();
      }
    } else {
      toast.info("Preview available for PDF and image files only.");
    }
  };

  const formatFileSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const currentDoc = selectedScholarship ? getDocForScholarship(selectedScholarship.id) : null;

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS (6 SCHOLARSHIP METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-purple-600 block">Total Approved Grant</span>
          <div className="text-lg font-bold font-display text-purple-600 font-mono">₹{totalApproved.toLocaleString()}</div>
          <span className="text-[9px] text-purple-600 font-semibold">2 Grants Active</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Pending Verification</span>
          <div className="text-lg font-bold font-display text-amber-600 font-mono">1 Fellowship</div>
          <span className="text-[9px] text-slate-400">Under Review</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Government Schemes</span>
          <div className="text-lg font-bold font-display text-blue-600 font-mono">₹50,000</div>
          <span className="text-[9px] text-slate-400">State Merit</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Institutional Scholarship</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white font-mono">₹30,000</div>
          <span className="text-[9px] text-slate-400">STEM Fellowship</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Merit Scholarship</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">₹25,000</div>
          <span className="text-[9px] text-emerald-600 font-semibold">Excellence Award</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Renewal Schedule</span>
          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-1">Aug 15, 2025</div>
          <span className="text-[9px] text-slate-400 font-semibold">Sem VI Verification</span>
        </div>
      </div>

      {/* 2. TABLE & APPLY TOOLBAR */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" /> Scholarships & Financial Grants Ledger
            </h3>
            <p className="text-xs text-slate-500">Government schemes, institutional waivers and merit rewards</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onOpenScholarshipModal} size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Apply New Scholarship
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Scholarship Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Approved Amount (₹)</th>
                <th className="p-3">Disbursed Amount</th>
                <th className="p-3">Approval Stage</th>
                <th className="p-3">Renewal Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scholarships.map((sch) => {
                const doc = getDocForScholarship(sch.id);
                return (
                  <tr key={sch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{sch.name}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200">{sch.category}</Badge>
                    </td>
                    <td className="p-3 font-bold font-mono text-purple-600 text-xs">₹{sch.approvedAmount.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">₹{sch.disbursedAmount.toLocaleString()}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{sch.approvalStage}</td>
                    <td className="p-3 font-mono text-slate-500">{sch.renewalDate}</td>
                    <td className="p-3">
                      <Badge className={sch.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {sch.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-blue-600 p-1 gap-1"
                          onClick={() => openUploadModal(sch)}
                        >
                          <Upload className="h-3 w-3" />
                          {doc ? "Replace" : "Upload Docs"}
                        </Button>
                        {doc && (
                          <span
                            className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
                            onClick={() => handlePreviewDoc(doc)}
                            title="Preview document"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Uploaded
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" /> Upload Supporting Documents
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedScholarship?.name} — Upload your supporting certificates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            {/* Existing doc info */}
            {currentDoc && (
              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{currentDoc.fileName}</span>
                    <span className="text-slate-500">{formatFileSize(currentDoc.fileSize)} · Uploaded {currentDoc.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] text-blue-600 p-1"
                    onClick={() => handlePreviewDoc(currentDoc)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] text-red-500 p-1"
                    onClick={() => {
                      if (selectedScholarship) handleDeleteDoc(selectedScholarship.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-xl border-2 border-dashed text-center space-y-2 cursor-pointer transition-colors ${
                dragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Upload className="h-5 w-5 mx-auto text-blue-600" />
              <span className="text-slate-600 dark:text-slate-300 font-semibold block">
                {currentDoc ? "Click or drag to replace document" : "Click or drag to upload document"}
              </span>
              <span className="text-[10px] text-slate-400">
                Accepted: PDF, JPG, PNG, DOCX · Max size: 10 MB
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)} className="rounded-xl text-xs">
              Close
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> Browse File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
