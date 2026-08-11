import React, { useState } from "react";
import { NoticeItem } from "./types";
import {
  FileText,
  Paperclip,
  Bookmark,
  Share2,
  Download,
  Printer,
  Calendar,
  Building2,
  User,
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


import { getStudentExamSubmission } from "@/lib/shared-assessment-store";


interface NoticeDetailDrawerProps {
  notice: NoticeItem | null;
  onClose: () => void;
  onToggleBookmark?: (id: string) => void;
  onLaunchPlacementExam?: () => void;
}

export const NoticeDetailDrawer: React.FC<NoticeDetailDrawerProps> = ({
  notice,
  onClose,
  onToggleBookmark,
  onLaunchPlacementExam,
}) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Check if student has already completed and submitted this assessment
  const existingSubmission = getStudentExamSubmission("23341A4229") || getStudentExamSubmission("23341a4229@college.edu.in");

  React.useEffect(() => {
    if (notice) {
      setIsBookmarked(!!notice.bookmarked);
    }
  }, [notice]);

  if (!notice) return null;

  const handleShare = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`https://edusuite.edu.in/notice/${notice.id}`);
      setCopied(true);
      toast.success("Notice URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.info(`Notice Link: https://edusuite.edu.in/notice/${notice.id}`);
    }
  };

  const handlePrint = () => {
    toast.info("Preparing notice print layout...");
    window.print();
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (onToggleBookmark) {
      onToggleBookmark(notice.id);
    }
    toast.success(nextState ? `Bookmarked "${notice.title}"` : `Bookmark removed for "${notice.title}"`);
  };

  const handleDownloadAttachment = (filename: string) => {
    const content = `EduSuite Pro Official Notice Attachment\n\nFile: ${filename}\nNotice Title: ${notice.title}\nIssued By: ${notice.issuedBy}\nDepartment: ${notice.department}\nDate: ${notice.publishedDate}\n\nNotice Body:\n${notice.fullNotice}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const handleDownloadPdf = () => {
    const pdfContent = `OFFICIAL CAMPUS NOTICE\n=========================================\nTitle: ${notice.title}\nCategory: ${notice.category}\nPriority: ${notice.priority}\nIssued By: ${notice.issuedBy}\nDepartment: ${notice.department}\nDate: ${notice.publishedDate}\nExpiry: ${notice.expiryDate}\n=========================================\n\n${notice.fullNotice}\n\n=========================================\nVerified Official Document — EduSuite ERP`;
    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `Notice_${notice.id}_${notice.publishedDate}.pdf`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Notice PDF: ${filename}`);
  };

  // Render Full-Screen NPTEL / TCS iON Style Exam Briefing Page for Placement Notices
  if (notice.category === "Placements" || notice.department.includes("Placement")) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-screen h-screen overflow-hidden font-sans select-none animate-in fade-in duration-200">
        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 grid place-items-center font-bold text-xl shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[10px] font-mono uppercase font-bold">
                  Training & Placement Cell (TPO)
                </Badge>
                {existingSubmission ? (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-mono flex items-center gap-1 font-bold">
                    <CheckCircle2 className="size-3 text-emerald-600" /> ASSESSMENT COMPLETED &amp; SUBMITTED
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[10px] font-mono flex items-center gap-1 font-bold">
                    <ShieldCheck className="size-3" /> Official TPO Assessment Format
                  </Badge>
                )}

              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                {notice.title}
              </h1>
            </div>
          </div>

          {/* CANDIDATE PROFILE & CLOSE */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 p-2 px-3 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs">
              <div className="size-7 rounded-lg bg-blue-600 text-white font-bold grid place-items-center">
                ST
              </div>
              <div className="text-left leading-tight">
                <p className="font-bold text-slate-900">K. Sai Teja (23341A4229)</p>
                <p className="text-[10px] text-slate-500">23341a4229@college.edu.in</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full cursor-pointer"
            >
              <X className="size-6" />
            </Button>
          </div>
        </header>

        {/* MAIN FULL-SCREEN INSTRUCTIONS CONTAINER */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-50 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* IF ALREADY SUBMITTED: SHOW COMPLETED BANNER */}
            {existingSubmission && (
              <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 space-y-3 shadow-md animate-fade-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                    <span>Assessment Completed &amp; Response Stored to TPO Database!</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono font-bold text-xs">
                    {existingSubmission.id}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 font-mono leading-relaxed">
                  Candidate <strong>K. Sai Teja (23341A4229)</strong> submitted this placement assessment on <strong>{existingSubmission.submissionTime}</strong>. Re-attempts are restricted by TPO rules.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block uppercase">MCQ Marks</span>
                    <strong className="text-slate-900 text-sm font-bold">{existingSubmission.mcqScore} / {existingSubmission.mcqTotal}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Coding Marks</span>
                    <strong className="text-purple-700 text-sm font-bold">{existingSubmission.codingScore} / {existingSubmission.codingTotal}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Total Percentage</span>
                    <strong className="text-emerald-700 text-sm font-bold">{existingSubmission.totalPercentage}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Violations</span>
                    <strong className="text-amber-700 text-sm font-bold">{existingSubmission.violationsLogged} / 3</strong>
                  </div>
                </div>
              </div>
            )}

            {/* EXAM OVERVIEW SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Duration</span>
                <span className="text-lg font-extrabold text-amber-600 font-mono flex items-center gap-1.5">
                  <Clock className="size-4" /> 90 Minutes
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Total Marks</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">70 Marks</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Sections</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">2 Sections</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Proctoring</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono flex items-center gap-1">
                  <ShieldCheck className="size-4" /> AI Webcam
                </span>
              </div>
            </div>

            {/* WHAT & WHY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 shadow-xs">
                <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <span>📌</span> What is this Exam?
                </h3>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Official proctored campus screening assessment for the <strong>TCS Ninja / Digital</strong> & <strong>Google Cloud</strong> Placement Drive 2026, authorized by the Training & Placement Officer (TPO).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 shadow-xs">
                <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <span>🎯</span> Why is it Conducted?
                </h3>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Shortlists eligible final-year candidates for <strong>SDE-1</strong>, <strong>Cloud Systems Engineer</strong>, and <strong>Digital Software</strong> engineering roles across corporate recruiters.
                </p>
              </div>
            </div>

            {/* SECTION COVERAGE */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>📚</span> Exam Structure & Pattern
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-amber-700 font-bold">Section 1: Technical & Aptitude MCQs</span>
                  <p className="text-slate-600 text-[11px]">20 Multiple Choice Questions • 20 Marks • Negative Marking: None</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-purple-700 font-bold">Section 2: Coding Challenges</span>
                  <p className="text-slate-600 text-[11px]">2 Live Programming Problems • 50 Marks • Supports Java, Python & C++</p>
                </div>
              </div>
            </div>

            {/* GENERAL INSTRUCTIONS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-rose-700 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>⚠️</span> Official TPO Examination Instructions & Rules
              </h3>

              <ol className="text-slate-800 text-xs space-y-3 list-decimal pl-5 leading-relaxed font-sans font-medium">
                <li>
                  <strong>Server Timer:</strong> The countdown timer at the top right of your screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself.
                </li>
                <li>
                  <strong>Verification Gate:</strong> You must verify your official college email ID (<code className="font-mono text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-bold">23341a4229@college.edu.in</code>) and roll number before starting.
                </li>
                <li>
                  <strong>Proctoring & Camera:</strong> AI WebCam monitoring is active. Ensure your face is clearly visible throughout the exam session.
                </li>
                <li>
                  <strong>Zero Malpractice Policy:</strong> Switching tabs, opening external windows, or minimizing the browser will trigger warnings. <strong>3 warnings will auto-submit your test.</strong>
                </li>
                <li>
                  <strong>Submission:</strong> Click the green <strong>Submit Exam</strong> button after completing all sections to submit your responses directly to the TPO HR portal.
                </li>
              </ol>
            </div>

            {/* DECLARATION CHECKBOX */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 shadow-xs">
              <input
                type="checkbox"
                id="tpo-exam-decl"
                defaultChecked
                className="size-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="tpo-exam-decl" className="text-xs text-slate-900 font-bold cursor-pointer">
                I have read and understood all instructions. I confirm that I am K. Sai Teja (Roll: 23341A4229) and will follow all examination rules.
              </label>
            </div>

          </div>
        </main>

        {/* BOTTOM FIXED ACTION FOOTER BAR */}
        <footer className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-lg">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel & Close
          </Button>

          {existingSubmission ? (
            <Button
              onClick={() => {
                window.location.href = "/exam/take?id=AST-GGL-01";
              }}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl px-8 shadow-lg shadow-blue-600/20 cursor-pointer gap-2"
            >
              ✅ Exam Completed — View Submitted Score Receipt (/exam/take)
            </Button>
          ) : (
            <Button
              onClick={() => {
                window.location.href = "/exam/take?id=AST-GGL-01";
              }}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl px-8 shadow-lg shadow-emerald-600/20 cursor-pointer gap-2"
            >
              🚀 I Am Ready — Start Live Assessment Exam Now (/exam/take)
            </Button>
          )}

        </footer>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end transition-all">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                {notice.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {notice.priority} Priority
              </span>
              {notice.pinned && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Pinned Notice
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {notice.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Issued Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Department
              </span>
              <p className="font-semibold text-foreground">{notice.department}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Issued By
              </span>
              <p className="font-semibold text-foreground">{notice.issuedBy}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Issue Date
              </span>
              <p className="font-medium text-foreground">{notice.publishedDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Expiry Date
              </span>
              <p className="font-medium text-foreground">{notice.expiryDate}</p>
            </div>
          </div>

          {/* Full Notice Content */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Notice Details
            </h3>
            <div className="p-4 rounded-xl border border-border bg-card text-foreground text-sm leading-relaxed space-y-3 whitespace-pre-line">
              {notice.fullNotice}
            </div>
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-primary" /> Official Attachments ({notice.attachments.length})
              </h3>
              <div className="space-y-2">
                {notice.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{att.name}</p>
                        <p className="text-xs text-muted-foreground">{att.size || "PDF Document"}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadAttachment(att.name)}
                      className="h-8 gap-1 text-xs"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Links */}
          {notice.relatedLinks && notice.relatedLinks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Related Resources
              </h3>
              <div className="space-y-2">
                {notice.relatedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url === "#" ? "javascript:void(0)" : link.url}
                    onClick={(e) => {
                      if (link.url === "#") {
                        e.preventDefault();
                        toast.info(`Opening ${link.title}...`);
                      }
                    }}
                    target={link.url === "#" ? "_self" : "_blank"}
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-sm text-primary transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              className={`gap-1.5 text-xs ${
                isBookmarked ? "text-amber-500 border-amber-500/30" : ""
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Copied Link
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" /> Share
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPdf}
              className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

