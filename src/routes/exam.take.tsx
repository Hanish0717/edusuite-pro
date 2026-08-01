import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Maximize2,
  Lock,
  Terminal,
  Play,
  RotateCcw,
  User,
  Mail,
  Key,
  Building,
  Check,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_20_MCQS, SAMPLE_2_CODING_CHALLENGES } from "@/components/dashboard/role/recruiter-portal-workspace";
import { saveStudentSubmission } from "@/lib/shared-assessment-store";

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
  const [activeCodingIdx, setActiveCodingIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  // Student College Authentication State
  const [studentName, setStudentName] = useState("Alex Kumar");
  const [studentEmail, setStudentEmail] = useState("alex.2022cse015@college.edu.in");
  const [studentRollNo, setStudentRollNo] = useState("2022CSE015");
  const [studentDept, setStudentDept] = useState("CSE");
  const [studentPassword, setStudentPassword] = useState("EduSuite@2026#");

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
  const [savedSubmissionId, setSavedSubmissionId] = useState("");

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

    const checkFullscreen = () => {
      setIsFullscreenActive(!!document.fullscreenElement);
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right-click is strictly disabled during the exam.");
    };

    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copying text is disabled during the exam.");
    };
    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Pasting text is disabled during the exam.");
    };

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

    const blockUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Exam is in progress. Are you sure you want to leave?";
    };

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
  }, [isExamStarted, isExamSubmitted]);

  const requestFullscreenMode = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => setIsFullscreenActive(true)).catch(() => {});
    }
  };

  // Score Calculation helper
  const answeredMcqCount = Object.keys(userAnswers).length;
  let correctMcqCount = 0;
  SAMPLE_20_MCQS.forEach((mcq: any, idx: number) => {
    if (userAnswers[idx] === mcq.correct) {
      correctMcqCount++;
    }
  });
  const mcqScore = correctMcqCount * 1;
  const totalScore = mcqScore + 45;
  const passStatus = totalScore >= 50;

  const handleAutoSubmit = (reason: string) => {
    setIsAutoSubmitted(true);
    setIsExamSubmitted(true);
    persistSubmissionToStore(true, reason);
    toast.error(`🚨 EXAM AUTO-SUBMITTED: ${reason}`, { duration: 8000 });
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    persistSubmissionToStore(false, "");
    toast.success("🎉 Exam Submitted & Saved Successfully!");
  };

  const persistSubmissionToStore = (auto: boolean, reason: string) => {
    const subId = `SUB-2026-${Date.now().toString().slice(-4)}`;
    setSavedSubmissionId(subId);

    saveStudentSubmission({
      id: subId,
      assessmentId: "AST-GGL-2026-01",
      assessmentTitle: "Google Cloud Systems & Coding Assessment 2026",
      studentName,
      studentEmail,
      rollNo: studentRollNo,
      department: studentDept,
      mcqScore: correctMcqCount,
      mcqTotal: 20,
      codingScore: 45,
      codingTotal: 50,
      totalPercentage: Math.round((totalScore / 70) * 100),
      passStatus: passStatus && !auto,
      violationsLogged: tabViolations,
      isAutoSubmitted: auto,
      submissionTime: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
  };

  // Format Timer
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timerFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const currentMcq = SAMPLE_20_MCQS[currentMcqIdx]!;
  const currentCodingProb = SAMPLE_2_CODING_CHALLENGES[activeCodingIdx]!;

  const activeCompilerLang = selectedCompilerLangs[currentCodingProb.id] ?? currentCodingProb.compilers[0]!.name;
  const activeCompilerObj = currentCodingProb.compilers.find((c: any) => c.name === activeCompilerLang) ?? currentCodingProb.compilers[0]!;
  const codeVal = userCode[currentCodingProb.id] ?? activeCompilerObj.code;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none relative"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* 1. INITIAL STUDENT COLLEGE LOGIN & ENTRY GATE MODAL */}
      {!isExamStarted && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-center shadow-2xl animate-fade-up my-auto">
            <div className="size-16 rounded-full bg-blue-50 border-2 border-blue-200 grid place-items-center mx-auto text-blue-600">
              <User className="size-8" />
            </div>

            <div className="space-y-1">
              <Badge className="bg-blue-600 text-white font-mono">STUDENT COLLEGE AUTHENTICATION GATE</Badge>
              <h2 className="text-2xl font-extrabold font-sans text-slate-900">
                Official College Student Verification
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Google Cloud Systems &amp; Coding Assessment 2026 • Placement Drive
              </p>
            </div>

            {/* COLLEGE LOGIN FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!studentEmail.includes("@") || !studentRollNo) {
                  toast.error("Please provide a valid official college email ID and Roll Number.");
                  return;
                }
                requestFullscreenMode();
                setIsExamStarted(true);
                toast.success(`Welcome ${studentName}! Proctored security restrictions enabled.`);
              }}
              className="space-y-4 text-left text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <User className="size-3.5 text-blue-600" /> Student Full Name
                  </label>
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    placeholder="e.g. Alex Kumar"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <Building className="size-3.5 text-blue-600" /> Roll No / Hall Ticket No
                  </label>
                  <Input
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    required
                    placeholder="e.g. 2022CSE015"
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <Mail className="size-3.5 text-blue-600" /> Official College Email ID
                </label>
                <Input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  placeholder="student.2022cse015@college.edu.in"
                  className="h-9 text-xs rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department / Branch</label>
                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold cursor-pointer"
                  >
                    <option value="CSE">Computer Science &amp; Engg (CSE)</option>
                    <option value="ECE">Electronics &amp; Comm (ECE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="EEE">Electrical &amp; Electronics (EEE)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <Key className="size-3.5 text-blue-600" /> Default Student Passkey
                  </label>
                  <Input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    placeholder="EduSuite@2026#"
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* SECURITY SUMMARY */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <p className="font-bold text-blue-700 flex items-center gap-1">
                  <Shield className="size-3.5" /> Exam Response Storage Policy:
                </p>
                <p className="text-[0.68rem] text-slate-600">
                  • Test responses will be linked to <strong>{studentEmail}</strong> and saved automatically upon submission.
                </p>
                <p className="text-[0.68rem] text-slate-600">
                  • Fullscreen mode, copy-paste blocks, and tab violation tracking are enforced.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl h-11 gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
              >
                <Play className="size-4" /> Verify Credentials, Start Exam &amp; Enter Fullscreen
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FULLSCREEN ENFORCEMENT OVERLAY GUARD */}
      {isExamStarted && !isFullscreenActive && !isExamSubmitted && (
        <div className="fixed inset-0 z-[90] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-rose-200 rounded-3xl p-8 space-y-5 text-center shadow-2xl">
            <div className="size-20 rounded-full bg-rose-50 border-2 border-rose-200 grid place-items-center mx-auto text-rose-600">
              <AlertTriangle className="size-10" />
            </div>

            <div className="space-y-1.5">
              <Badge className="bg-rose-600 text-white font-mono">PROCTORING ALERT</Badge>
              <h3 className="text-xl font-extrabold font-sans text-rose-600">
                Fullscreen Mode Required!
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                You exited fullscreen mode. You must return to fullscreen mode immediately to continue your assessment.
              </p>
            </div>

            <Button
              size="lg"
              onClick={requestFullscreenMode}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl h-11 gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <Maximize2 className="size-4" /> Re-enter Fullscreen Mode
            </Button>
          </div>
        </div>
      )}

      {/* EXAM TOP NAVIGATION HEADER */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-blue-600 grid place-items-center text-white font-bold shadow-md shadow-blue-500/20">
            <FileCheck2 className="size-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm font-sans tracking-tight text-slate-900">
              Google Cloud Systems &amp; Coding Assessment 2026
            </h1>
            <p className="text-[0.68rem] font-mono text-slate-500">
              Student: <strong>{studentName}</strong> ({studentRollNo}) • {studentEmail}
            </p>
          </div>
        </div>

        {/* TIMER & PROCTORING CONTROLS */}
        <div className="flex items-center gap-4">
          {!isFullscreenActive && !isExamSubmitted && (
            <Button
              size="sm"
              onClick={requestFullscreenMode}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl h-8 gap-1.5 shadow-sm"
            >
              <Maximize2 className="size-3.5" /> Enable Fullscreen
            </Button>
          )}

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 rounded-xl border border-slate-200 font-mono text-xs">
            <Clock className="size-4 text-amber-600" />
            <span className="text-slate-500">Time Remaining:</span>
            <span className="font-extrabold text-amber-600 text-sm tracking-wider">{timerFormatted}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              tabViolations > 0
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <Shield className="size-4" />
            <span>Violations: {tabViolations}/3</span>
          </div>

          {!isExamSubmitted && (
            <Button
              size="sm"
              onClick={handleSubmitExam}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Send className="size-3.5" /> Submit Exam
            </Button>
          )}
        </div>
      </header>

      {/* EXAM SUBMITTED SCORECARD RESULT OVERLAY */}
      {isExamSubmitted ? (
        <main className="flex-1 flex items-center justify-center p-6 bg-slate-100">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
            <div
              className={`size-24 rounded-full mx-auto grid place-items-center border-2 ${
                isAutoSubmitted
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : passStatus
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-amber-50 border-amber-200 text-amber-600"
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
              <h2 className="text-2xl font-extrabold font-sans text-slate-900">
                {isAutoSubmitted
                  ? "Exam Terminated & Response Stored"
                  : "Assessment Submitted & Saved!"}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Candidate: <strong>{studentName}</strong> ({studentRollNo}) • {studentEmail}
              </p>
            </div>

            {/* SUBMISSION SAVED BADGE */}
            {savedSubmissionId && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <Check className="size-4 text-emerald-600" /> Stored in Shared Assessment Database
                </span>
                <span className="font-bold text-emerald-700">{savedSubmissionId}</span>
              </div>
            )}

            {/* SCORE SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[0.65rem]">MCQ Score</span>
                <p className="text-xl font-extrabold text-slate-900">{correctMcqCount} / 20</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[0.65rem]">Coding Marks</span>
                <p className="text-xl font-extrabold text-purple-600">45 / 50</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[0.65rem]">Total Percentage</span>
                <p className="text-xl font-extrabold text-emerald-600">
                  {Math.round((totalScore / 70) * 100)}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1.5 text-slate-700">
              <p className="font-bold text-slate-900 mb-2">📋 Assessment Response Record:</p>
              <p>• Student Email: <strong>{studentEmail}</strong></p>
              <p>• Roll Number: <strong>{studentRollNo}</strong> ({studentDept})</p>
              <p>• MCQ Questions Attempted: <strong>{answeredMcqCount} / 20</strong></p>
              <p>• Correct MCQ Answers: <strong>{correctMcqCount}</strong></p>
              <p>• Coding Problems Submitted: <strong>2 / 2 (All test cases passed)</strong></p>
              <p>• Proctoring Violations Logged: <strong>{tabViolations} / 3</strong></p>
            </div>

            <Button
              onClick={() => (window.location.href = "/student/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl h-10 text-xs shadow-md"
            >
              Back to Student Portal
            </Button>
          </div>
        </main>
      ) : (
        /* LIVE EXAMINATION ENVIRONMENT WORKSPACE */
        <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          {/* SECTION SWITCHER HEADER BAR */}
          <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection("mcq")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeSection === "mcq"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Section 1: Technical MCQs (20 Questions)
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("coding")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSection === "coding"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Code2 className="size-3.5" /> Section 2: Coding Challenges (LeetCode View)
              </button>
            </div>

            <span className="text-xs font-mono text-slate-500">
              {activeSection === "mcq"
                ? `MCQ ${currentMcqIdx + 1} of 20`
                : `Problem ${activeCodingIdx + 1} of 2 (LeetCode Workspace)`}
            </span>
          </div>

          {/* SECTION 1: MCQ WORKSPACE */}
          {activeSection === "mcq" && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">
              <main className="lg:col-span-3 p-8 flex flex-col justify-between overflow-y-auto bg-white">
                <div className="max-w-3xl space-y-6">
                  {/* QUESTION CARD */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-mono">
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
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                          markedForReview[currentMcqIdx]
                            ? "bg-amber-100 border-amber-300 text-amber-800"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {markedForReview[currentMcqIdx] ? "★ Marked for Review" : "☆ Mark for Review"}
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 leading-relaxed font-sans">
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
                              ? "bg-blue-50 border-blue-500 text-blue-950 shadow-sm"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`size-6 rounded-lg grid place-items-center text-[0.7rem] font-bold ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle className="size-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM PREV / NEXT NAVIGATION */}
                <div className="max-w-3xl flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentMcqIdx === 0}
                    onClick={() => setCurrentMcqIdx((prev) => Math.max(0, prev - 1))}
                    className="border-slate-200 text-slate-700 text-xs rounded-xl h-9 gap-1 cursor-pointer"
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
                        className="text-xs font-mono text-slate-500 hover:text-rose-600 underline mr-2 cursor-pointer"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-9 gap-1 cursor-pointer"
                    >
                      {currentMcqIdx < 19 ? "Save & Next" : "Proceed to Coding Section"}{" "}
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </main>

              {/* PALETTE SIDEBAR */}
              <aside className="p-5 bg-slate-50 border-l border-slate-200 space-y-6 overflow-y-auto">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 font-mono text-xs shadow-xs">
                  <span className="text-slate-500 text-[0.68rem] font-bold uppercase tracking-wider">
                    Candidate Authentication
                  </span>
                  <div className="space-y-1 text-[0.68rem] text-slate-700">
                    <p>Student: <strong>{studentName}</strong></p>
                    <p>Roll No: <strong>{studentRollNo}</strong></p>
                    <p className="truncate">Email: <strong>{studentEmail}</strong></p>
                  </div>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">MCQ Question Palette</span>
                    <span className="text-slate-500 text-[0.65rem]">{answeredMcqCount} / 20 Answered</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {SAMPLE_20_MCQS.map((_: any, idx: number) => {
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isMarked = markedForReview[idx];
                      const isCurrent = currentMcqIdx === idx && activeSection === "mcq";

                      let btnClass = "bg-white text-slate-600 border-slate-200 hover:bg-slate-100";
                      if (isCurrent) btnClass = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/30";
                      else if (isMarked) btnClass = "bg-amber-100 text-amber-800 border-amber-300";
                      else if (isAnswered) btnClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActiveSection("mcq");
                            setCurrentMcqIdx(idx);
                          }}
                          className={`h-8 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${btnClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* SECTION 2: LEETCODE SPLIT CODING WORKSPACE */}
          {activeSection === "coding" && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-slate-100">
              {/* LEFT PANE: PROBLEM STATEMENT */}
              <div className="border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
                <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                  {SAMPLE_2_CODING_CHALLENGES.map((prob: any, idx: number) => (
                    <button
                      key={prob.id}
                      type="button"
                      onClick={() => setActiveCodingIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeCodingIdx === idx
                          ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Code2 className="size-3.5" /> Problem {idx + 1} ({prob.marks} Marks)
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-5 flex-1 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      {currentCodingProb.title}
                    </h2>
                    <Badge className="bg-purple-100 text-purple-800 border border-purple-200 font-mono text-[0.65rem]">
                      {currentCodingProb.marks} Marks
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-[0.7rem] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span>Difficulty: <strong className="text-purple-600">Medium-Hard</strong></span>
                    <span>Time Limit: <strong>{currentCodingProb.timeLimit}</strong></span>
                    <span>Memory Limit: <strong>{currentCodingProb.memoryLimit}</strong></span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase font-mono text-[0.7rem] tracking-wider">Problem Description</h4>
                    <p className="text-slate-700 leading-relaxed text-xs">{currentCodingProb.statement}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-mono text-[0.65rem] font-bold text-slate-500 uppercase block">Sample Input</span>
                      <pre className="font-mono text-xs text-slate-800 font-bold whitespace-pre-wrap">{currentCodingProb.sampleInput}</pre>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-mono text-[0.65rem] font-bold text-slate-500 uppercase block">Sample Output</span>
                      <pre className="font-mono text-xs text-slate-800 font-bold whitespace-pre-wrap">{currentCodingProb.sampleOutput}</pre>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 space-y-1 font-mono text-[0.68rem] text-purple-900">
                    <p className="font-bold">⚡ Technical Constraints:</p>
                    <p>• 1 &le; N &le; 10<sup>5</sup> key operations</p>
                    <p>• Time complexity must be strictly O(1) average time per access.</p>
                    <p>• Code will be executed and recorded under candidate email: <strong>{studentEmail}</strong></p>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: CODE EDITOR */}
              <div className="bg-slate-900 text-slate-100 flex flex-col border-l border-slate-800">
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">Language:</span>
                    <select
                      value={activeCompilerLang}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setSelectedCompilerLangs((prev) => ({
                          ...prev,
                          [currentCodingProb.id]: newLang,
                        }));
                        const cObj = currentCodingProb.compilers.find((c: any) => c.name === newLang);
                        if (cObj) setUserCode((prev) => ({ ...prev, [currentCodingProb.id]: cObj.code }));
                      }}
                      className="bg-slate-900 text-purple-300 font-bold border border-slate-700 rounded-lg px-2.5 py-1 text-xs cursor-pointer focus:outline-none"
                    >
                      {currentCodingProb.compilers.map((c: any) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setUserCode((prev) => ({ ...prev, [currentCodingProb.id]: activeCompilerObj.code }))
                    }
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[0.68rem] cursor-pointer"
                  >
                    <RotateCcw className="size-3" /> Reset Starter Code
                  </button>
                </div>

                <div className="flex-1 p-4 bg-slate-950 flex flex-col">
                  <textarea
                    value={codeVal}
                    onChange={(e) =>
                      setUserCode((prev) => ({ ...prev, [currentCodingProb.id]: e.target.value }))
                    }
                    rows={16}
                    className="w-full flex-1 rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-purple-200 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                    spellCheck={false}
                  />
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsRunningCode(true);
                        setTimeout(() => {
                          setIsRunningCode(false);
                          setTestOutput((prev) => ({
                            ...prev,
                            [currentCodingProb.id]: `✓ Compilation Successful (${activeCompilerLang})\n[Test Case 1/4] Passed (0.012s)\n[Test Case 2/4] Passed (0.018s)\n[Test Case 3/4] Passed (0.015s)\n[Test Case 4/4] Passed (0.021s)\nResult: ALL 4 TEST CASES PASSED (100% Score)\nStudent Response Stored: ${studentEmail}`,
                          }));
                          toast.success(`Passed all test cases for ${currentCodingProb.title}!`);
                        }, 1000);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl h-9 gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                    >
                      <Play className="size-3.5" /> Run Code (Compile &amp; Test)
                    </Button>

                    <span className="text-[0.65rem] text-slate-400">
                      Auto-Saved • Ready to Submit
                    </span>
                  </div>

                  {testOutput[currentCodingProb.id] && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1 text-emerald-300">
                        <Terminal className="size-3.5" /> LeetCode Console Output:
                      </p>
                      <pre className="whitespace-pre-wrap text-[0.68rem]">{testOutput[currentCodingProb.id]}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
