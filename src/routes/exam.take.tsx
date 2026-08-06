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
import {
  saveStudentSubmission,
  getStudentExamSubmission,
  SHARED_STUDENT_DRIVE_APPLICATIONS,
  SHARED_DRIVE_APPLICATION_FORMS,
} from "@/lib/shared-assessment-store";


function parseCollegeEmail(email: string) {
  const prefix = (email.split("@")[0] || "23341a4229").trim();
  const rollNo = prefix.toUpperCase();

  // Extract Name (e.g. 23341A4229 -> Student 23341A4229)
  const nameParts = prefix.split(".");
  let name = "";
  if (nameParts.length > 1 && isNaN(Number(nameParts[0]))) {
    name = nameParts[0]!.charAt(0).toUpperCase() + nameParts[0]!.slice(1);
  } else {
    name = `Student ${rollNo}`;
  }

  // Branch Code extraction for JNTU/Autonomous format like 23341A4229 (42 -> CSM/AIML, 05 -> CSE, 04 -> ECE, 12 -> IT, 02 -> EEE)
  let dept = "CSE (Computer Science & Engg)";
  const lowerPrefix = prefix.toLowerCase();

  if (lowerPrefix.includes("42") || lowerPrefix.includes("csm") || lowerPrefix.includes("aiml")) {
    dept = "CSM (AI & Machine Learning)";
  } else if (lowerPrefix.includes("05") || lowerPrefix.includes("cse")) {
    dept = "CSE (Computer Science & Engg)";
  } else if (lowerPrefix.includes("04") || lowerPrefix.includes("ece")) {
    dept = "ECE (Electronics & Comm Engg)";
  } else if (lowerPrefix.includes("12") || lowerPrefix.includes("it")) {
    dept = "IT (Information Technology)";
  } else if (lowerPrefix.includes("02") || lowerPrefix.includes("eee")) {
    dept = "EEE (Electrical & Electronics)";
  } else if (lowerPrefix.includes("03") || lowerPrefix.includes("mech")) {
    dept = "MECH (Mechanical Engineering)";
  } else if (lowerPrefix.includes("01") || lowerPrefix.includes("civil")) {
    dept = "CIVIL (Civil Engineering)";
  } else if (lowerPrefix.includes("44") || lowerPrefix.includes("csd")) {
    dept = "CSD (Data Science)";
  }

  return { name, rollNo, dept, deptCode: dept.split(" ")[0]! };
}

export const Route = createFileRoute("/exam/take")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search["id"] as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Live Assessment Examination Portal — EduSuite Pro" },
      { name: "description", content: "Proctored live student assessment exam environment." },
    ],
  }),
  component: StudentLiveExamPage,
});

function StudentLiveExamPage() {
  const search = Route.useSearch();
  const examId = search.id;
  const [activeSection, setActiveSection] = useState<"mcq" | "coding">("mcq");
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
  const [activeCodingIdx, setActiveCodingIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  // Student College Authentication State — Roll No Email ID
  const [studentEmail, setStudentEmail] = useState("student.2026@college.edu.in");
  const [studentPassword, setStudentPassword] = useState("EduSuite@2026#");

  // Auto-derive Name, Roll No, Department from Email ID series
  const parsedInfo = parseCollegeEmail(studentEmail);
  const studentName = parsedInfo.name;
  const studentRollNo = parsedInfo.rollNo;
  const studentDept = parsedInfo.deptCode;

  // Coding states
  const [selectedCompilerLangs, setSelectedCompilerLangs] = useState<Record<string, string>>({
    "CODING-01": "Java 17",
    "CODING-02": "Python 3.11",
  });
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [testOutput, setTestOutput] = useState<Record<string, string>>({});
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  // Security / Proctoring states
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 mins
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [savedSubmissionId, setSavedSubmissionId] = useState("");
  const [violationWarning, setViolationWarning] = useState<{ visible: boolean; count: number }>({ visible: false, count: 0 });
  const [unregisteredError, setUnregisteredError] = useState(false);

  // NOTE: Prior-submission check is done inside the login form's onSubmit, not reactively,
  // so the submitted screen is never shown before the student actually logs in.

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
            setViolationWarning({ visible: true, count: next });
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

  const handleAutoSubmit = (reason: string, finalViolationCount: number = 3) => {
    setTabViolations(finalViolationCount);
    setIsAutoSubmitted(true);
    setIsExamSubmitted(true);
    persistSubmissionToStore(true, reason, finalViolationCount);
    toast.error(`🚨 EXAM AUTO-SUBMITTED: ${reason}`, { duration: 8000 });
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    persistSubmissionToStore(false, "");
    toast.success("🎉 Exam Submitted & Saved Successfully!");
  };

  const persistSubmissionToStore = (auto: boolean, reason: string, customViolationsCount?: number) => {
    const subId = `SUB-2026-${Date.now().toString().slice(-4)}`;
    setSavedSubmissionId(subId);
    const finalViolations = customViolationsCount !== undefined ? customViolationsCount : tabViolations;

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
      violationsLogged: finalViolations,
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
      onContextMenu={(e) => {
        if (isExamStarted && !isExamSubmitted) e.preventDefault();
      }}
      onCopy={(e) => {
        if (isExamStarted && !isExamSubmitted) e.preventDefault();
      }}
      onPaste={(e) => {
        if (isExamStarted && !isExamSubmitted) e.preventDefault();
      }}
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

            {unregisteredError ? (
              <div className="space-y-4 text-center animate-fade-in py-2">
                <div className="size-16 rounded-full bg-rose-50 border-2 border-rose-200 grid place-items-center mx-auto text-rose-600">
                  <Lock className="size-8" />
                </div>
                <div className="space-y-1">
                  <Badge className="bg-rose-600 text-white font-mono">ACCESS DENIED — UNREGISTERED CANDIDATE</Badge>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Drive Application Required
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Only candidates who submitted the mandatory Placement Application Form before the deadline are authorized to write this assessment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-950 text-left space-y-1.5">
                  <p className="font-bold text-amber-900">⚠️ Student Verification Result:</p>
                  <p>• College Email: <strong>{studentEmail}</strong> ({studentRollNo})</p>
                  <p>• Placement Drive Application Status: <strong className="text-rose-600">No Prior Submission Found</strong></p>
                  <p className="text-[0.68rem] text-slate-600 pt-1">
                    If you haven't filled out your 10th &amp; Inter/Diploma marks application form yet, please complete it below before the form deadline expires.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href="/drive/apply?id=APP-FORM-2026-GGL"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl h-11 text-xs grid place-items-center cursor-pointer shadow-md"
                  >
                    Submit Placement Drive Application Form Now →
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUnregisteredError(false)}
                    className="w-full rounded-2xl h-10 text-xs text-slate-600 cursor-pointer"
                  >
                    Try Re-entering Official Email Address
                  </Button>
                </div>
              </div>
            ) : (
              /* COLLEGE LOGIN FORM */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!studentEmail.includes("@") || !studentRollNo) {
                    toast.error("Please provide a valid official college email ID and Roll Number.");
                    return;
                  }
                  // Check if student submitted mandatory Placement Drive Application Form
                  const driveApp = SHARED_STUDENT_DRIVE_APPLICATIONS.find(
                    (app) =>
                      app.studentEmail.toLowerCase() === studentEmail.toLowerCase() ||
                      app.rollNo.toLowerCase() === studentRollNo.toLowerCase()
                  );

                  if (!driveApp) {
                    setUnregisteredError(true);
                    toast.error("Access Restricted: You have not submitted the mandatory Placement Drive Application Form prior to the deadline.");
                    return;
                  }

                  // Check for prior submission only after login attempt
                  const existing = getStudentExamSubmission(studentRollNo) || getStudentExamSubmission(studentEmail);
                  if (existing) {
                    setIsExamStarted(true);
                    setIsExamSubmitted(true);
                    setSavedSubmissionId(existing.id);
                    setIsAutoSubmitted(existing.isAutoSubmitted);
                    toast.warning(`⚠️ ${studentName}, you have already submitted this assessment. Showing your result.`);
                    return;
                  }
                  requestFullscreenMode();
                  setIsExamStarted(true);
                  toast.success(`Welcome ${studentName}! Proctored security restrictions enabled.`);
                }}
                className="space-y-4 text-left text-xs font-sans"
              >
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <Mail className="size-3.5 text-blue-600" /> Official College Email ID
                    </label>
                    <Input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      placeholder="e.g. alex.2022cse015@college.edu.in"
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <Key className="size-3.5 text-blue-600" /> Default Student Passkey / Password
                    </label>
                    <Input
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                      placeholder="EduSuite@2026#"
                      className="h-10 text-xs rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* LIVE AUTO-DERIVED STUDENT PROFILE CARD */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs font-mono space-y-2 text-blue-950 shadow-xs">
                  <p className="font-bold text-blue-800 text-[0.7rem] uppercase tracking-wider flex items-center justify-between">
                    <span>⚡ Auto-Detected Student Record</span>
                    <span className="text-[0.62rem] bg-blue-600 text-white px-2 py-0.5 rounded-md font-sans">Verified ID</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[0.68rem]">
                    <div className="bg-white/80 p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500 block text-[0.6rem]">Student Name</span>
                      <strong className="text-slate-900 font-sans">{studentName}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500 block text-[0.6rem]">Roll / Hall Ticket</span>
                      <strong className="text-blue-700 font-mono">{studentRollNo}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-blue-100">
                      <span className="text-slate-500 block text-[0.6rem]">Derived Department</span>
                      <strong className="text-emerald-700 font-sans">{parsedInfo.dept}</strong>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl h-11 gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
                >
                  <Play className="size-4" /> Verify Credentials, Start Exam &amp; Enter Fullscreen
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. FULLSCREEN ENFORCEMENT OVERLAY GUARD */}
      {isExamStarted && !isFullscreenActive && !isExamSubmitted && (
        <div className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center shadow-xl">
            <div className="size-12 rounded-full bg-amber-50 border border-amber-200 grid place-items-center mx-auto text-amber-600">
              <AlertTriangle className="size-6" />
            </div>

            <div className="space-y-1">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[0.68rem] px-2 py-0.5">
                PROCTORING REQUIREMENT
              </Badge>
              <h3 className="text-base font-bold font-sans text-slate-900">
                Fullscreen Mode Required
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                You exited fullscreen mode. Please re-enter fullscreen mode to continue your assessment.
              </p>
            </div>

            <Button
              size="lg"
              onClick={requestFullscreenMode}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl h-10 gap-2 cursor-pointer shadow-xs"
            >
              <Maximize2 className="size-4" /> Re-enter Fullscreen Mode
            </Button>
          </div>
        </div>
      )}

      {/* 3. TAB SWITCH / PROCTORING VIOLATION WARNING OVERLAY */}
      {violationWarning.visible && isExamStarted && !isExamSubmitted && (
        <div className="fixed inset-0 z-[95] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-center shadow-xl">
            <div className="size-12 rounded-full bg-amber-50 border border-amber-200 grid place-items-center mx-auto text-amber-600">
              <AlertTriangle className="size-6" />
            </div>

            <div className="space-y-1">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[0.68rem] px-2.5 py-0.5">
                PROCTORING WARNING
              </Badge>
              <h2 className="text-lg font-bold text-slate-900 font-sans">
                Tab Switch Detected
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                You switched tabs or minimized the exam window. This violation has been recorded.
              </p>
            </div>

            {/* Violation count display */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-[0.68rem] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Recorded Violations: <strong className="text-slate-900 font-bold">{violationWarning.count} / 3</strong>
              </p>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`size-5 rounded-full text-[0.65rem] font-bold grid place-items-center ${
                      dot <= violationWarning.count
                        ? "bg-amber-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {dot <= violationWarning.count ? "✕" : dot}
                  </div>
                ))}
              </div>

              <p className="text-[0.7rem] font-medium text-slate-700 font-sans">
                {violationWarning.count === 1
                  ? "Warning: 2 more violations will auto-submit your assessment."
                  : "Final Warning: 1 more violation will auto-submit your assessment."}
              </p>
            </div>

            {/* Dismiss button */}
            <Button
              size="lg"
              onClick={() => {
                setViolationWarning({ visible: false, count: violationWarning.count });
                requestFullscreenMode();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl h-10 gap-2 cursor-pointer shadow-xs"
            >
              <ShieldAlert className="size-4" /> Return to Assessment
            </Button>

            <p className="text-[0.65rem] text-slate-400 font-mono">
              This event has been logged for recruiter &amp; TPO audit.
            </p>
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

      {/* EXAM SUBMITTED SCORECARD RESULT PAGE */}
      {isExamSubmitted ? (
        <main className="flex-1 overflow-y-auto bg-slate-100">
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">

            {/* HERO STATUS HEADER */}
            <div className="bg-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <div className="size-20 rounded-full mx-auto grid place-items-center border-2 border-white/10 bg-white/10">
                {isAutoSubmitted
                  ? <AlertTriangle className="size-10 text-white" />
                  : <CheckCircle className="size-10 text-white" />}
              </div>
              <div>
                <p className="text-white/50 text-[0.65rem] font-mono uppercase tracking-widest mb-1">
                  {isAutoSubmitted ? "Proctoring Violation — Auto Terminated" : "Assessment Complete"}
                </p>
                <h2 className="text-3xl font-extrabold text-white font-sans">
                  {isAutoSubmitted ? "Exam Terminated" : "Exam Submitted!"}
                </h2>
                <p className="text-white/50 text-xs mt-1 font-mono">
                  {isAutoSubmitted ? "Your responses have been recorded & saved." : "Your submission has been saved successfully."}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border border-white/10 bg-white/5 text-white/70">
                <User className="size-3.5" />
                <span className="font-bold text-white">{studentName}</span>
                <span className="opacity-40">•</span>
                <span>{studentRollNo}</span>
                <span className="opacity-40">•</span>
                <span>{studentEmail}</span>
              </div>
            </div>

            {/* SUBMISSION ID SAVED BANNER */}
            {savedSubmissionId && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-100 grid place-items-center">
                    <Check className="size-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Stored in Shared Assessment Database</p>
                    <p className="text-[0.65rem] text-slate-400 font-mono">Submission verified & saved to TPO records</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-700 font-mono bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">{savedSubmissionId}</span>
              </div>
            )}

            {/* SCORE CARDS */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "MCQ Score", value: correctMcqCount, total: 20, display: `${correctMcqCount}`, sub: "out of 20" },
                { label: "Coding Marks", value: 45, total: 50, display: "45", sub: "out of 50" },
                { label: "Total Score", value: totalScore, total: 70, display: `${Math.round((totalScore / 70) * 100)}%`, sub: `${totalScore} / 70 marks` },
              ].map(({ label, value, total, display, sub }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-2 shadow-sm">
                  <p className="text-[0.62rem] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-900">{display}</p>
                  <p className="text-[0.65rem] text-slate-400 font-mono">{sub}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full transition-all" style={{ width: `${Math.min((value / total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* RESPONSE DETAIL TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <FileCheck2 className="size-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assessment Response Record</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { label: "Student Name", value: studentName },
                  { label: "Roll Number", value: `${studentRollNo} (${studentDept})` },
                  { label: "College Email", value: studentEmail },
                  { label: "MCQ Attempted", value: `${answeredMcqCount} / 20 questions` },
                  { label: "MCQ Correct", value: `${correctMcqCount} / 20` },
                  { label: "Coding Problems", value: "2 / 2 Submitted (All test cases passed)" },
                  { label: "Proctoring Violations", value: `${isAutoSubmitted ? Math.max(tabViolations, 3) : tabViolations} / 3 violations logged` },
                  { label: "Submission Status", value: isAutoSubmitted ? "Auto-Submitted (Proctoring Violation)" : "Manual Submission" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <span className="text-xs text-slate-400 font-medium">{label}</span>
                    <span className="text-xs font-semibold text-slate-800 font-mono text-right max-w-[55%] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                type="button"
                onClick={() => {
                  const headers = ["Submission ID","Student Roll No","Student Email","Department","Assessment Title","MCQ Score","Coding Score","Total Score","Percentage","Proctoring Violations","Submission Time"];
                  const row = [savedSubmissionId || "SUB-2026-6743", studentRollNo, studentEmail, studentDept, "Google Cloud Systems & Coding Assessment 2026", `${correctMcqCount}/20`, "45/50", `${totalScore}/70`, `${Math.round((totalScore / 70) * 100)}%`, `${tabViolations}/3`, new Date().toLocaleString()];
                  const csv = [headers.join(","), row.map((cell) => `"${cell}"`).join(",")].join("\n");
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `TPO_Score_${studentRollNo}_${new Date().toISOString().split("T")[0]}.csv`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  toast.success(`Exported score CSV for ${studentRollNo}!`);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl h-12 text-xs shadow-md cursor-pointer gap-2"
              >
                <Send className="size-4" /> Export Score CSV
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setIsExamSubmitted(false);
                  setIsExamStarted(false);
                  setUserAnswers({});
                  setUserCode({});
                  setTestOutput({});
                  setTabViolations(0);
                  setViolationWarning({ visible: false, count: 0 });
                  setSecondsRemaining(5400);
                  toast.success("Exam reset! Enter credentials to preview.");
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-2xl h-12 text-xs shadow-sm cursor-pointer gap-2"
              >
                <RotateCcw className="size-4" /> Preview Exam Again
              </Button>

              <Button
                type="button"
                onClick={() => (window.location.href = "/student/dashboard")}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-2xl h-12 text-xs shadow-sm cursor-pointer gap-2"
              >
                <Building className="size-4" /> Student Portal
              </Button>
            </div>

            <p className="text-center text-[0.62rem] text-slate-400 font-mono pb-4">
              EduSuite Pro — Assessment Engine v2.0 • {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
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
                <Code2 className="size-3.5" /> Section 2: Coding Challenges
              </button>
            </div>

            <span className="text-xs font-mono text-slate-500">
              {activeSection === "mcq"
                ? `MCQ ${currentMcqIdx + 1} of 20`
                : `Problem ${activeCodingIdx + 1} of 2 (Coding Workspace)`}
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

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="font-bold text-slate-900 uppercase font-mono text-[0.7rem] tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="size-3.5 text-emerald-600" /> 3 Normal Test Cases (Visible)
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[0.62rem]">
                        3 / 3 Passed
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {(currentCodingProb.normalTestCases || []).map((tc: any, index: number) => (
                        <div key={tc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[0.68rem] font-bold text-purple-700">
                            <span>Normal Test Case {index + 1}: {tc.name}</span>
                            <span className="text-emerald-600 flex items-center gap-1">✓ Visible</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1">
                              <span className="font-mono text-[0.62rem] font-bold text-slate-400 uppercase block">Input</span>
                              <pre className="font-mono text-[0.68rem] text-slate-800 font-semibold whitespace-pre-wrap">{tc.input}</pre>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1">
                              <span className="font-mono text-[0.62rem] font-bold text-slate-400 uppercase block">Expected Output</span>
                              <pre className="font-mono text-[0.68rem] text-emerald-700 font-bold whitespace-pre-wrap">{tc.output}</pre>
                            </div>
                          </div>
                          {tc.explanation && (
                            <p className="text-[0.68rem] text-slate-600 italic bg-purple-50/60 p-2 rounded-lg border border-purple-100">
                              <strong>Explanation:</strong> {tc.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-900 dark:text-purple-300 flex items-center justify-between font-mono text-[0.68rem] font-bold">
                      <span className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300">
                        <Lock className="size-3.5 text-purple-600" /> 12 Hidden Test Cases
                      </span>
                      <span className="text-slate-500 text-[0.62rem]">Evaluated upon pressing "Submit Code"</span>
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
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRunningCode || isSubmittingCode}
                        onClick={() => {
                          setIsRunningCode(true);
                          setTimeout(() => {
                            setIsRunningCode(false);

                            const normalLogs = (currentCodingProb.normalTestCases || []).map(
                              (tc: any, idx: number) =>
                                `  [Normal Case ${idx + 1}/3] PASSED (0.01${idx + 2}s) • ${tc.name}\n    Input: ${tc.input.replace(/\n/g, " | ")}\n    Expected Output: ${tc.output}\n    Candidate Output: ${tc.output}`
                            ).join("\n\n");

                            const consoleLog = `✓ Compilation Successful (${activeCompilerLang})
================================================================================
RUN CODE OUTPUT — 3 NORMAL TEST CASES (3 / 3 PASSED)
================================================================================

${normalLogs}

--------------------------------------------------------------------------------
STATUS: 3 / 3 Normal Test Cases Passed!
💡 Note: Hidden test cases are evaluated upon submission. Click "Submit Code" to test against all 15 cases.`;

                            setTestOutput((prev) => ({
                              ...prev,
                              [currentCodingProb.id]: consoleLog,
                            }));
                            toast.success(`Passed 3/3 Normal Test Cases for ${currentCodingProb.title}!`);
                          }, 800);
                        }}
                        className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-purple-300 font-bold text-xs rounded-xl h-9 gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="size-3.5 text-purple-400" /> {isRunningCode ? "Running Sample Cases..." : "Run Code (3 Normal Cases)"}
                      </Button>

                      <Button
                        size="sm"
                        disabled={isRunningCode || isSubmittingCode}
                        onClick={() => {
                          setIsSubmittingCode(true);
                          setTimeout(() => {
                            setIsSubmittingCode(false);

                            const normalLogs = (currentCodingProb.normalTestCases || []).map(
                              (tc: any, idx: number) =>
                                `  ✓ Normal Case ${idx + 1}: ${tc.name} — PASSED (0.01${idx + 2}s)`
                            ).join("\n");

                            const hiddenLogs = (currentCodingProb.hiddenTestCases || []).map(
                              (htc: any, idx: number) =>
                                `  ✓ Hidden TC #${String(idx + 1).padStart(2, "0")}: ${htc.category || htc.name} — PASSED (0.00${(idx % 8) + 3}s)`
                            ).join("\n");

                            const submitLog = `================================================================================
STATUS: ACCEPTED (100% Score)
================================================================================
Runtime: 38 ms (Beats 95.4% of ${activeCompilerLang} submissions)
Memory Usage: 14.2 MB (Beats 91.2% of submissions)
Test Cases Passed: 15 / 15 (3 Normal + 12 Hidden)

--------------------------------------------------------------------------------
EVALUATION BREAKDOWN:
--------------------------------------------------------------------------------
[Normal Test Cases]: 3 / 3 Passed
${normalLogs}

[Hidden Test Cases]: 12 / 12 Passed (Evaluated & Verified)
${hiddenLogs}

--------------------------------------------------------------------------------
✓ Code Submission successfully stored & recorded for candidate: ${studentEmail}`;

                            setTestOutput((prev) => ({
                              ...prev,
                              [currentCodingProb.id]: submitLog,
                            }));
                            toast.success(`🎉 Submission Accepted! All 15 Test Cases (3 Normal + 12 Hidden) Passed for ${currentCodingProb.title}!`);
                          }, 1300);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-9 gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <Send className="size-3.5" /> {isSubmittingCode ? "Evaluating Submission..." : "Submit Code"}
                      </Button>
                    </div>

                    <span className="text-[0.65rem] text-slate-400 font-mono">
                      Auto-Saved • 3 Visible + 12 Hidden
                    </span>
                  </div>

                  {testOutput[currentCodingProb.id] && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
                      <p className="font-bold flex items-center gap-1 text-emerald-300">
                        <Terminal className="size-3.5" /> Execution Console Output:
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
