import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvailableCourseItem } from "../types";
import { AlertCircle, CheckCircle2, FileText, Trash2, Eye, Upload, HelpCircle } from "lucide-react";
import { toast } from "sonner";

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
  }>;
  onConfirm: (declarations: Record<string, {
    fileName: string;
    fileSize: string;
    comments: string;
    pdfUrl: string;
    isNptel: boolean;
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
        };
      });
      setDeclarations(initial);
      setErrors({});
    }
  }, [open, selectedNptelCourses, savedDeclarations]);

  const handleFileUpload = (courseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (only PDF)
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Invalid file format. Only PDF files are accepted.");
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit.");
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

    toast.success(`PDF "${file.name}" uploaded successfully!`);
  };

  const handleRemoveFile = (courseId: string) => {
    setDeclarations((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { comments: "", isNptel: true }),
        fileName: "",
        fileSize: "",
        pdfUrl: "",
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

  const handleViewPdf = (fileName: string) => {
    setPreviewPdfName(fileName);
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    let hasError = false;

    selectedNptelCourses.forEach((course) => {
      const decl = declarations[course.id];
      const courseErrors: { pdf?: string; comments?: string } = {};

      if (!decl || !decl.fileName) {
        courseErrors.pdf = "PDF enrollment certificate is required.";
        hasError = true;
      }

      if (!decl || !decl.comments || !decl.comments.trim()) {
        courseErrors.comments = "Comments/Remarks are required.";
        hasError = true;
      }

      if (courseErrors.pdf || courseErrors.comments) {
        newErrors[course.id] = courseErrors;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      toast.error("Please resolve all NPTEL validation errors before submitting.");
      return;
    }

    onConfirm(declarations);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-amber-500" /> NPTEL Course Declaration
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Please declare enrollment status and upload documents for all selected NPTEL courses.
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
              };
              const courseError = errors[course.id];

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
                  </div>

                  {/* Warning / Notice */}
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      This course is identified as an NPTEL course. Please upload the NPTEL enrollment/completion PDF and provide comments before continuing.
                    </p>
                  </div>

                  {/* Upload Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Enrollment Certificate / Document (PDF, Max 10MB) <span className="text-rose-500">*</span>
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
                            onClick={() => handleViewPdf(decl.fileName)}
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
                              Click to upload NPTEL PDF
                            </p>
                            <p className="text-[10px] text-slate-400">PDF up to 10MB</p>
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

                  {/* Comments Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Comments / Remarks <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                      value={decl.comments}
                      onChange={(e) => handleCommentsChange(course.id, e.target.value)}
                      placeholder="Enter remarks or NPTEL enrollment details..."
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
              Submit Declaration & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Mock Viewer Dialog */}
      <Dialog open={!!previewPdfName} onOpenChange={(open) => !open && setPreviewPdfName(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl text-center">
          <DialogHeader className="text-center space-y-2">
            <FileText className="h-10 w-10 text-blue-600 mx-auto" />
            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
              PDF Mock Viewer
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {previewPdfName}
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2">
            <div className="w-16 h-1 bg-blue-500 rounded mx-auto mb-3" />
            <p className="font-bold text-slate-800 dark:text-slate-200">NPTEL Enrollment Certificate</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              This is a simulated PDF preview of your uploaded NPTEL declaration document. In production, this renders the embedded PDF viewer.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setPreviewPdfName(null)}
            className="w-full rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white text-xs h-9"
          >
            Close Preview
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
