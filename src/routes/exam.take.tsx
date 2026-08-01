import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  FileCheck2,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Code2,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Maximize2,
  Lock,
  Copy,
  Terminal,
  Play,
  RotateCcw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SAMPLE_20_MCQS, SAMPLE_2_CODING_CHALLENGES } from "@/components/dashboard/role/recruiter-portal-workspace";

export const Route = createFileRoute("/exam/take")({
  head: () => ({
    meta: [
      { title: "Live Assessment Examination Portal — EduSuite Pro" },
      { name: "description", content: "Proctored live student assessment exam environment." },
    ],
  }),
  component: StudentLiveExamPage,
});

function StudentLiveExamPage() {
  const [activeSection, setActiveSection] = useState<"mcq" | "coding">("mcq");
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  // Coding states
  const [selectedCompilerLangs, setSelectedCompilerLangs] = useState<Record<string, string>>({
    "CODING-01": "Java 17",
    "CODING-02": "Python 3.11",
  });
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [testOutput, setTestOutput] = useState<Record<string, string>>({});
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Security / Proctoring states
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 mins
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit("Timer Expired — Exam auto-submitted.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamStarted, isExamSubmitted]);

  // Fullscreen & Proctoring Restrictions
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    // Fullscreen status monitor
    const checkFullscreen = () => {
      setIsFullscreenActive(!!document.fullscreenElement);
    };

    // 1. Disable Right-Click
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right-click is strictly disabled during the exam.");
    };

    // 2. Disable Copy & Paste
    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copying text is disabled during the exam.");
    };
    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Pasting text is disabled during the exam.");
    };

    // 3. Block F5, F12, Ctrl+R, Ctrl+Shift+I
    const blockKeys = (e: KeyboardEvent) => {
      const blocked =
        e.key === "F5" ||
        e.key === "F12" ||
        (e.ctrlKey && (e.key === "r" || e.key === "R")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U"));
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Keyboard shortcut disabled during exam.");
      }
    };

    // 4. Warn before closing / refreshing
    const blockUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Exam is in progress. Are you sure you want to leave?";
    };

    // 5. Detect Tab switching / Focus loss (Max 3 attempts)
    const handleVisibilityChange = () => {
      if (document.hidden && !isExamSubmitted) {
        setTabViolations((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            handleAutoSubmit("Exceeded 3 tab-switch proctoring violations.");
          } else {
            toast.error(`⚠️ Tab switch detected! Violation ${next}/3. Exam will auto-submit at 3 violations.`, {
              duration: 5000,
            });
          }
          return next;
        });
      }
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("paste", blockPaste);
    document.addEventListener("keydown", blockKeys);
    window.addEventListener("beforeunload", blockUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("paste", blockPaste);
      document.removeEventListener("keydown", blockKeys);
      window.removeEventListener("beforeunload", blockUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isExamSubmitted]);

  const requestFullscreenMode = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => setIsFullscreenActive(true)).catch(() => {});
    }
  };

  const handleAutoSubmit = (reason: string) => {
    setIsAutoSubmitted(true);
    setIsExamSubmitted(true);
    toast.error(`🚨 EXAM AUTO-SUBMITTED: ${reason}`, { duration: 8000 });
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    toast.success("🎉 Exam Submitted Successfully!");
  };

  // Score Calculation
  const answeredMcqCount = Object.keys(userAnswers).length;
  let correctMcqCount = 0;
  SAMPLE_20_MCQS.forEach((mcq: any, idx: number) => {
    if (userAnswers[idx] === mcq.correct) {
      correctMcqCount++;
    }
  });
  const mcqScore = correctMcqCount * 1; // 1 mark each
  const totalScore = mcqScore + 45; // Simulated coding marks
  const passStatus = totalScore >= 50;

  // Format Timer
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timerFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const currentMcq = SAMPLE_20_MCQS[currentMcqIdx]!;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* 1. INITIAL ENTRY GATE MODAL (Before Start) */}
      {!isExamStarted && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl animate-fade-up">
            <div className="size-20 rounded-full bg-blue-600/15 border-2 border-blue-500/40 grid place-items-center mx-auto text-blue-400">
              <Shield className="size-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-blue-600 text-white font-mono">MANDATORY PROCTORED ENVIRONMENT</Badge>
              <h2 className="text-2xl font-extrabold font-sans text-white">
                Proctored Assessment Security Agreement
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Google Cloud Systems &amp; Coding Assessment 2026 • 90 Minutes
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs font-mono space-y-2 text-slate-300">
              <p className="font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="size-4" /> Strictly Enforced Security Rules:
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> <strong>Fullscreen Mode:</strong> Automatically enabled upon starting.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-rose-400">❌</span> <strong>Copy &amp; Paste:</strong> Completely disabled in all questions &amp; code editors.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-rose-400">❌</span> <strong>Right-Click &amp; Shortcuts:</strong> Blocked (F5, Ctrl+R, F12 disabled).
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-400">⚠️</span> <strong>Tab-Switch Violations:</strong> Maximum 3 allowed. Exceeding 3 auto-submits exam.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => {
                requestFullscreenMode();
                setIsExamStarted(true);
                toast.success("Security restrictions active. Good luck!");
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl h-12 gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
            >
              <Play className="size-5" /> Start Exam &amp; Enter Fullscreen Mode
            </Button>
          </div>
        </div>
      )}

      {/* 2. FULLSCREEN ENFORCEMENT OVERLAY GUARD (If student exits fullscreen during test) */}
      {isExamStarted && !isFullscreenActive && !isExamSubmitted && (
        <div className="fixed inset-0 z-[90] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-3xl p-8 space-y-5 text-center shadow-2xl animate-pulse">
            <div className="size-20 rounded-full bg-rose-500/20 border-2 border-rose-500/50 grid place-items-center mx-auto text-rose-500">
              <AlertTriangle className="size-10" />
            </div>

            <div className="space-y-1.5">
              <Badge className="bg-rose-600 text-white font-mono">PROCTORING ALERT</Badge>
              <h3 className="text-xl font-extrabold font-sans text-rose-500">
                Fullscreen Mode Required!
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                You exited fullscreen mode. You must return to fullscreen mode immediately to continue your assessment.
              </p>
            </div>

            <Button
              size="lg"
              onClick={requestFullscreenMode}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl h-11 gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <Maximize2 className="size-4" /> Re-enter Fullscreen Mode
            </Button>
          </div>
        </div>
      )}

      {/* EXAM TOP NAVIGATION HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-blue-600 grid place-items-center text-white font-bold shadow-lg shadow-blue-500/20">
            <FileCheck2 className="size-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm font-sans tracking-wide text-white">
              Google Cloud Systems &amp; Coding Assessment 2026
            </h1>
            <p className="text-[0.68rem] font-mono text-slate-400">
              Exam ID: AST-GGL-2026-01 • Version v1.2 • Google Cloud India
            </p>
          </div>
        </div>

        {/* TIMER & PROCTORING CONTROLS */}
        <div className="flex items-center gap-4">
          {!isFullscreenActive && !isExamSubmitted && (
            <Button
              size="sm"
              onClick={requestFullscreenMode}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl h-8 gap-1.5 animate-bounce"
            >
              <Maximize2 className="size-3.5" /> Enable Fullscreen Mode
            </Button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 font-mono text-xs">
            <Clock className="size-4 text-amber-400 animate-pulse" />
            <span className="text-slate-400">Time Remaining:</span>
            <span className="font-extrabold text-amber-400 text-sm tracking-wider">{timerFormatted}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              tabViolations > 0
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
            }`}
          >
            <Shield className="size-4" />
            <span>Violations: {tabViolations}/3</span>
          </div>

          {!isExamSubmitted && (
            <Button
              size="sm"
              onClick={handleSubmitExam}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Send className="size-3.5" /> Submit Exam
            </Button>
          )}
        </div>
      </header>

      {/* EXAM SUBMITTED SCORECARD RESULT OVERLAY */}
      {isExamSubmitted ? (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
            <div
              className={`size-24 rounded-full mx-auto grid place-items-center border-2 ${
                isAutoSubmitted
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-500"
                  : passStatus
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-400"
              }`}
            >
              {isAutoSubmitted ? (
                <AlertTriangle className="size-12" />
              ) : (
                <CheckCircle className="size-12" />
              )}
            </div>

            <div className="space-y-2">
              <Badge
                className={
                  isAutoSubmitted
                    ? "bg-rose-600 text-white"
                    : passStatus
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }
              >
                {isAutoSubmitted ? "AUTO-SUBMITTED (PROCTORING VIOLATION)" : passStatus ? "PASSED CUTOFF" : "COMPLETED"}
              </Badge>
              <h2 className="text-2xl font-extrabold font-sans text-white">
                {isAutoSubmitted
                  ? "Exam Terminated & Submitted"
                  : "Assessment Submitted Successfully!"}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {isAutoSubmitted
                  ? "Exceeded maximum allowed 3 tab-switch proctoring violations."
                  : "Your response has been recorded and submitted to Google Cloud India recruitment team."}
              </p>
            </div>

            {/* SCORE SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[0.65rem]">MCQ Score</span>
                <p className="text-xl font-extrabold text-white">{correctMcqCount} / 20</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[0.65rem]">Coding Marks</span>
                <p className="text-xl font-extrabold text-purple-400">45 / 50</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-slate-400 text-[0.65rem]">Total Percentage</span>
                <p className="text-xl font-extrabold text-emerald-400">
                  {Math.round((totalScore / 70) * 100)}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-left text-xs font-mono space-y-1.5 text-slate-300">
              <p className="font-bold text-white mb-2">📋 Assessment Submission Summary:</p>
              <p>• MCQ Questions Attempted: <strong>{answeredMcqCount} / 20</strong></p>
              <p>• Correct MCQ Answers: <strong>{correctMcqCount}</strong></p>
              <p>• Coding Problems Submitted: <strong>2 / 2 (All test cases passed)</strong></p>
              <p>• Proctoring Violations Logged: <strong>{tabViolations} / 3</strong></p>
            </div>

            <Button
              onClick={() => (window.location.href = "/student/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-500 font-bold rounded-xl h-10 text-xs"
            >
              Back to Student Portal
            </Button>
          </div>
        </main>
      ) : (
        /* LIVE EXAMINATION ENVIRONMENT WORKSPACE */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">
          {/* MAIN QUESTION WORKSPACE (3 COLS) */}
          <main className="lg:col-span-3 flex flex-col border-r border-slate-800 overflow-y-auto">
            {/* SECTION TAB SELECTOR */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activeSection === "mcq" ? "default" : "outline"}
                  onClick={() => setActiveSection("mcq")}
                  className={`rounded-xl text-xs font-bold ${
                    activeSection === "mcq"
                      ? "bg-blue-600 text-white"
                      : "border-slate-700 text-slate-300"
                  }`}
                >
                  Section 1: Technical MCQs (20 Questions)
                </Button>
                <Button
                  size="sm"
                  variant={activeSection === "coding" ? "default" : "outline"}
                  onClick={() => setActiveSection("coding")}
                  className={`rounded-xl text-xs font-bold ${
                    activeSection === "coding"
                      ? "bg-purple-600 text-white"
                      : "border-slate-700 text-slate-300"
                  }`}
                >
                  <Code2 className="size-3.5 mr-1" /> Section 2: Coding Challenges (2 Problems)
                </Button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {activeSection === "mcq"
                  ? `Question ${currentMcqIdx + 1} of 20`
                  : "2 Coding Challenges (50 Marks)"}
              </span>
            </div>

            {/* SECTION 1: MCQ WORKSPACE */}
            {activeSection === "mcq" && (
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* QUESTION CARD */}
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono">
                        Q{currentMcqIdx + 1} • 1 Mark
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          setMarkedForReview((prev) => ({
                            ...prev,
                            [currentMcqIdx]: !prev[currentMcqIdx],
                          }))
                        }
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border transition-all ${
                          markedForReview[currentMcqIdx]
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {markedForReview[currentMcqIdx] ? "★ Marked for Review" : "☆ Mark for Review"}
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-white leading-relaxed">
                      {currentMcq.question}
                    </h3>
                  </div>

                  {/* OPTIONS GRID */}
                  <div className="grid gap-3">
                    {currentMcq.options.map((opt: string, oIdx: number) => {
                      const isSelected = userAnswers[currentMcqIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setUserAnswers((prev) => ({ ...prev, [currentMcqIdx]: oIdx }))
                          }
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs font-medium cursor-pointer ${
                            isSelected
                              ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`size-6 rounded-lg grid place-items-center text-[0.7rem] font-bold ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle className="size-4 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM PREV / NEXT NAVIGATION */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentMcqIdx === 0}
                    onClick={() => setCurrentMcqIdx((prev) => Math.max(0, prev - 1))}
                    className="border-slate-700 text-slate-300 text-xs rounded-xl h-9 gap-1"
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {userAnswers[currentMcqIdx] !== undefined && (
                      <button
                        type="button"
                        onClick={() =>
                          setUserAnswers((prev) => {
                            const next = { ...prev };
                            delete next[currentMcqIdx];
                            return next;
                          })
                        }
                        className="text-xs font-mono text-slate-400 hover:text-rose-400 underline mr-2"
                      >
                        Clear Selection
                      </button>
                    )}

                    <Button
                      size="sm"
                      onClick={() =>
                        currentMcqIdx < 19
                          ? setCurrentMcqIdx((prev) => prev + 1)
                          : setActiveSection("coding")
                      }
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl h-9 gap-1"
                    >
                      {currentMcqIdx < 19 ? "Save & Next" : "Proceed to Coding Section"}{" "}
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: CODING WORKSPACE */}
            {activeSection === "coding" && (
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {SAMPLE_2_CODING_CHALLENGES.map((prob: any) => {
                  const activeCompilerLang =
                    selectedCompilerLangs[prob.id] ?? prob.compilers[0]!.name;
                  const activeCompilerObj =
                    prob.compilers.find((c: any) => c.name === activeCompilerLang) ?? prob.compilers[0]!;
                  const codeVal = userCode[prob.id] ?? activeCompilerObj.code;

                  return (
                    <div
                      key={prob.id}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h4 className="text-base font-extrabold text-white flex items-center gap-2 font-sans">
                            <Code2 className="size-5 text-purple-400" /> {prob.title}
                          </h4>
                          <p className="text-xs font-mono text-slate-400">
                            Time Limit: {prob.timeLimit} • Memory Limit: {prob.memoryLimit}
                          </p>
                        </div>
                        <Badge className="bg-purple-600 text-white text-xs">{prob.marks} Marks</Badge>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{prob.statement}</p>

                      {/* COMPILER SELECTION TABS */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-purple-400 font-bold block">
                          Select Programming Language &amp; Compiler:
                        </label>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {prob.compilers.map((c: any) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setSelectedCompilerLangs((prev) => ({
                                  ...prev,
                                  [prob.id]: c.name,
                                }));
                                setUserCode((prev) => ({ ...prev, [prob.id]: c.code }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                                activeCompilerLang === c.name
                                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CODE EDITOR TEXTAREA */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <span>Editor Workspace ({activeCompilerLang})</span>
                          <button
                            type="button"
                            onClick={() =>
                              setUserCode((prev) => ({ ...prev, [prob.id]: activeCompilerObj.code }))
                            }
                            className="text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="size-3" /> Reset Template
                          </button>
                        </div>
                        <textarea
                          value={codeVal}
                          onChange={(e) =>
                            setUserCode((prev) => ({ ...prev, [prob.id]: e.target.value }))
                          }
                          rows={10}
                          className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          spellCheck={false}
                        />
                      </div>

                      {/* RUN TEST CASES BUTTON & OUTPUT PANEL */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setIsRunningCode(true);
                            setTimeout(() => {
                              setIsRunningCode(false);
                              setTestOutput((prev) => ({
                                ...prev,
                                [prob.id]: `✓ Compilation Successful (${activeCompilerLang})\n[Test Case 1/4] Passed (0.012s)\n[Test Case 2/4] Passed (0.018s)\n[Test Case 3/4] Passed (0.015s)\n[Test Case 4/4] Passed (0.021s)\nResult: ALL 4 TEST CASES PASSED (100% Score)`,
                              }));
                              toast.success(`Passed all test cases for ${prob.title}!`);
                            }, 1200);
                          }}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl h-9 gap-1.5"
                        >
                          <Play className="size-3.5" /> Compile &amp; Run Test Cases
                        </Button>

                        <span className="text-[0.68rem] font-mono text-slate-400">
                          Auto-Saved Code • Ready for Submission
                        </span>
                      </div>

                      {testOutput[prob.id] && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs space-y-1">
                          <p className="font-bold flex items-center gap-1 text-emerald-300">
                            <Terminal className="size-4" /> Output Console:
                          </p>
                          <pre className="whitespace-pre-wrap">{testOutput[prob.id]}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* SIDEBAR: QUESTION PALETTE & SUMMARY (1 COL) */}
          <aside className="p-5 bg-slate-900/60 border-l border-slate-800 space-y-6 overflow-y-auto">
            {/* PROCTORING SECURITY STATUS CARD */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-slate-400 text-[0.68rem] font-bold uppercase tracking-wider">
                Proctoring Security Rules
              </span>
              <div className="space-y-1 text-[0.68rem] text-slate-300">
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Webcam AI Monitoring: Active
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Copy &amp; Paste: Disabled
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Right-Click: Disabled
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-rose-400">⚠️</span> Tab Violations: {tabViolations} / 3
                </p>
              </div>
            </div>

            {/* QUESTION PALETTE GRID */}
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Section 1 Palette</span>
                <span className="text-slate-400 text-[0.65rem]">{answeredMcqCount} / 20 Answered</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SAMPLE_20_MCQS.map((_: any, idx: number) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const isCurrent = currentMcqIdx === idx && activeSection === "mcq";

                  let btnClass = "bg-slate-800 text-slate-400 border-slate-700";
                  if (isCurrent) btnClass = "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50";
                  else if (isMarked) btnClass = "bg-amber-500/20 text-amber-300 border-amber-500/50";
                  else if (isAnswered) btnClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveSection("mcq");
                        setCurrentMcqIdx(idx);
                      }}
                      className={`h-8 rounded-xl border font-mono text-xs font-bold transition-all ${btnClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PALETTE LEGEND */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[0.65rem] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-emerald-500/30 border border-emerald-500/60" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-amber-500/30 border border-amber-500/60" /> Marked for Review
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-slate-800 border border-slate-700" /> Not Attempted
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
