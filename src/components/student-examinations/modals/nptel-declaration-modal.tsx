import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvailableCourseItem } from "../types";
import { AlertCircle, CheckCircle2, FileText, Trash2, Eye, Upload, ShieldCheck, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { uploadNptelCertificate, verifyNptelCertificate } from "../nptel-service";

interface NptelDeclarationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNptelCourses: AvailableCourseItem[];
  savedDeclarations: Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
    verificationStatus?: "Submitted" | "Verified" | "Rejected";
  }>;
  onConfirm: (declarations: Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
    verificationStatus?: "Submitted" | "Verified" | "Rejected";
  }>) => void;
}

export function NptelDeclarationModal({
  open,
  onOpenChange,
  selectedNptelCourses,
  savedDeclarations,
  onConfirm,
}: NptelDeclarationModalProps) {
  const [declarations, setDeclarations] = useState<Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
    verificationStatus?: "Submitted" | "Verified" | "Rejected";
  }>>({});

  const [errors, setErrors] = useState<Record<string, { pdf?: string; comments?: string }>>({});
  const [previewPdfName, setPreviewPdfName] = useState<string | null>(null);

  // Initialize local declarations with saved ones when modal opens
  useEffect(() => {
    if (open) {
      const initial: typeof declarations = {};
      selectedNptelCourses.forEach((course) => {
        initial[course.id] = savedDeclarations[course.id] || {
          fileName: "",
          fileSize: "",
          comments: "",
          pdfUrl: "",
          isNptel: true,
          verificationStatus: "Submitted",
        };
      });
      setDeclarations(initial);
      setErrors({});
    }
  }, [open, selectedNptelCourses, savedDeclarations]);

  const handleFileUpload = (courseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file format (PDF only)
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Invalid file format! Only PDF files are accepted.");
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit! Please upload a smaller PDF.");
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const fakeUrl = URL.createObjectURL(file);

    setDeclarations((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { comments: "", isNptel: true }),
        fileName: file.name,
        fileSize: fileSizeStr,
        pdfUrl: fakeUrl,
        verificationStatus: "Submitted",
      },
    }));

    // Clear error
    setErrors((prev) => {
      const copy = { ...prev };
      if (copy[courseId]) {
        const { pdf, ...rest } = copy[courseId];
        copy[courseId] = rest;
      }
      return copy;
    });

    toast.success(`NPTEL Certificate "${file.name}" uploaded successfully!`);
  };

  const handleRemoveFile = (courseId: string) => {
    setDeclarations((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { comments: "", isNptel: true }),
        fileName: "",
        fileSize: "",
        pdfUrl: "",
        verificationStatus: undefined,
      },
    }));
  };

  const handleCommentsChange = (courseId: string, comments: string) => {
    setDeclarations((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { fileName: "", fileSize: "", pdfUrl: "", isNptel: true }),
        comments,
      },
    }));

    if (comments.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        if (copy[courseId]) {
          const { comments, ...rest } = copy[courseId];
          copy[courseId] = rest;
        }
        return copy;
      });
    }
  };

  const handleVerifyToggle = (courseId: string, courseCode: string, courseName: string) => {
    const currentDecl = declarations[courseId];
    const nextStatus = currentDecl?.verificationStatus === "Verified" ? "Submitted" : "Verified";

    verifyNptelCertificate(courseId, nextStatus as any);

    setDeclarations((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        verificationStatus: nextStatus,
      },
    }));

    toast.success(
      nextStatus === "Verified"
        ? `NPTEL Certificate for ${courseCode} verified by Faculty!`
        : `Verification status reset for ${courseCode}.`
    );
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    let hasError = false;

    selectedNptelCourses.forEach((course) => {
      const decl = declarations[course.id];
      const courseErrors: { pdf?: string; comments?: string } = {};

      if (!decl || !decl.fileName) {
        courseErrors.pdf = "PDF certificate upload is required for NPTEL course completion.";
        hasError = true;
      }

      if (!decl || !decl.comments || !decl.comments.trim()) {
        courseErrors.comments = "Comments / remarks are required.";
        hasError = true;
      }

      if (courseErrors.pdf || courseErrors.comments) {
        newErrors[course.id] = courseErrors;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      toast.error("Please upload PDF certificate and fill comments for all NPTEL courses.");
      return;
    }

    // Save each NPTEL certificate into database service
    selectedNptelCourses.forEach((course) => {
      const decl = declarations[course.id];
      if (decl && decl.fileName) {
        uploadNptelCertificate({
          studentId: "STU-2024-0542",
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          fileName: decl.fileName,
          fileSize: decl.fileSize,
          pdfUrl: decl.pdfUrl,
          comments: decl.comments,
        });
      }
    });

    onConfirm(declarations);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white font-display">
              <FileText className="h-5 w-5 text-amber-500" /> NPTEL Course Certificate Submission
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Upload PDF certificates for completed NPTEL courses to exclude them from written exams, hall tickets, and results processing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-4">
            {selectedNptelCourses.map((course) => {
              const decl = declarations[course.id] || {
                fileName: "",
                fileSize: "",
                comments: "",
                pdfUrl: "",
                isNptel: true,
                verificationStatus: "Submitted",
              };
              const courseError = errors[course.id];
              const isVerified = decl.verificationStatus === "Verified";

              return (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
                >
                  {/* Course Details Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {course.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Credits: {course.credits} &bull; Mentor: {course.faculty}</p>
                    </div>

                    {/* Admin Verification Action */}
                    {decl.fileName && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyToggle(course.id, course.code, course.name)}
                        className={`text-[10px] h-7 font-bold rounded-lg border gap-1 ${
                          isVerified
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{isVerified ? "Verified by Faculty ✓" : "Verify Certificate (Faculty)"}</span>
                      </Button>
                    )}
                  </div>

                  {/* Warning / Exemption Notice */}
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      Submitting a valid NPTEL completion certificate automatically transfers course credits and excludes this course from regular written exams and hall tickets.
                    </p>
                  </div>

                  {/* Upload Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Upload NPTEL Certificate (PDF only, Max 10MB) <span className="text-rose-500">*</span>
                    </label>

                    {decl.fileName ? (
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 min-w-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold truncate">{decl.fileName}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">({decl.fileSize})</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setPreviewPdfName(decl.fileName)}
                            className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFile(course.id)}
                            className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete PDF"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all p-4">
                          <div className="flex flex-col items-center justify-center text-center space-y-1">
                            <Upload className="h-5 w-5 text-slate-400" />
                            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                              Click to upload NPTEL Certificate PDF
                            </p>
                            <p className="text-[10px] text-slate-400">PDF files up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(course.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                    {courseError?.pdf && (
                      <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {courseError.pdf}
                      </span>
                    )}
                  </div>

                  {/* Comments / Remarks Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Comments / Completion Remarks <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                      value={decl.comments}
                      onChange={(e) => handleCommentsChange(course.id, e.target.value)}
                      placeholder="Enter score, certificate roll number, or completion remarks..."
                      className="text-xs min-h-[70px] rounded-lg border-slate-200 dark:border-slate-800 focus-visible:ring-[#0b193c]"
                    />
                    {courseError?.comments && (
                      <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {courseError.comments}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="pt-2 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 font-bold"
            >
              Submit NPTEL Certificate & Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!previewPdfName} onOpenChange={(open) => !open && setPreviewPdfName(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl text-center">
          <DialogHeader className="text-center space-y-2">
            <FileCheck className="h-10 w-10 text-emerald-600 mx-auto" />
            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
              NPTEL Certificate Document
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {previewPdfName}
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2">
            <div className="w-16 h-1 bg-emerald-500 rounded mx-auto mb-3" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Verified NPTEL Completion Certificate</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Certificate verified by NPTEL Academic Coordinator. Course credits transferred successfully.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setPreviewPdfName(null)}
            className="w-full rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white text-xs h-9 font-bold"
          >
            Close Viewer
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
