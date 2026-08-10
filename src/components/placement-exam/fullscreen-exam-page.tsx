import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Clock,
  ShieldAlert,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Award,
  Send,
  Lock,
  UploadCloud,
  FileCode2,
  Maximize,
  Minimize,
  X,
  Building2,
  FileCheck,
} from "lucide-react";

interface Question {
  id: number;
  type: "mcq" | "written";
  text: string;
  options?: string[];
  correctOption?: number;
  marks: number;
}

const SAMPLE_TPO_QUESTIONS: Question[] = [
  {
    id: 1,
    type: "mcq",
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "150 meters", "180 meters", "324 meters"],
    correctOption: 1, // 150m
    marks: 5,
  },
  {
    id: 2,
    type: "mcq",
    text: "Which data structure is best suited for implementing LIFO (Last In First Out) call stack evaluation?",
    options: ["Queue", "Binary Search Tree", "Stack", "Min Heap"],
    correctOption: 2, // Stack
    marks: 5,
  },
  {
    id: 3,
    type: "written",
    text: "TPO Recruiter Coding Assignment: Write an efficient algorithm to detect a cycle in a Linked List, or explain your approach in words below.",
    marks: 5,
  },
];

export function FullscreenExamPage() {
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({
    0: 1,
    1: 2,
  });
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({
    2: "Approach: Use Floyd's Cycle Detection Algorithm (Slow and Fast pointers). Advance slow by 1 step and fast by 2 steps. If fast and slow meet at any node, a cycle exists in O(N) time and O(1) space.",
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>("TCS_Cycle_Detection_Solution.cpp");

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(90 * 60);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(15);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Attempt browser fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Tab switch detection
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((w) => {
          const next = w + 1;
          toast.error(`⚠️ Proctoring Alert! Tab switch detected (${next}/3 warnings).`, {
            duration: 5000,
          });
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isSubmitted]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      toast.success(`Uploaded assignment file: ${file.name}`);
    }
  };

  const handleSubmitExam = () => {
    let score = 0;
    SAMPLE_TPO_QUESTIONS.forEach((q, idx) => {
      if (q.type === "mcq") {
        if (selectedAnswers[idx] === q.correctOption) score += q.marks;
      } else {
        if (writtenAnswers[idx] || uploadedFile) score += q.marks;
      }
    });

    setFinalScore(score);
    setIsSubmitted(true);
    toast.success(`Exam & Assignment submitted to TPO! Verified Score: ${score}/15`);
  };

  const currentQ = SAMPLE_TPO_QUESTIONS[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white w-screen h-screen overflow-hidden flex flex-col font-sans select-none">
      {!isSubmitted ? (
        <div className="flex flex-col h-full w-full">
          {/* PROCTORING TOPBAR */}
          <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 grid place-items-center font-bold text-lg">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono uppercase">
                    Tata Consultancy Services (TCS)
                  </Badge>

                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-[10px] font-mono flex items-center gap-1">
                    <Lock className="size-3" /> Fullscreen Proctored TPO Session
                  </Badge>
                </div>
                <h1 className="text-sm sm:text-base font-extrabold text-white">
                  TCS Ninja & Digital Placement Assessment 2026
                </h1>
              </div>
            </div>

            {/* LIVE PROCTORING CONTROLS */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 font-mono">
                <Clock className="size-4 text-amber-400 animate-spin" />
                <span className="text-sm sm:text-base font-bold text-amber-300">
                  {formatTime(timeLeftSeconds)}
                </span>
                <span className="text-xs text-slate-400">Remaining</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-400 font-semibold">
                <Camera className="size-4 animate-pulse" />
                <span>AI WebCam Active</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs gap-1.5 rounded-xl hidden sm:inline-flex"
              >
                {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/student/lms" })}
                className="text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </Button>
            </div>
          </header>

          {/* TAB WARNING STRIP */}
          {tabSwitchWarnings > 0 && (
            <div className="bg-red-500/20 border-b border-red-500/40 px-6 py-2 flex items-center justify-between text-xs text-red-200 font-medium shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-400 shrink-0" />
                <span>Proctoring Alert: Tab switches detected ({tabSwitchWarnings}/3 allowed before auto-flagging).</span>
              </div>
            </div>
          )}

          {/* MAIN EXAM BODY (GRID LAYOUT: LEFT NAV + RIGHT WORKSPACE) */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT QUESTION PALETTE */}
            <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex shrink-0">
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  Question Palette ({SAMPLE_TPO_QUESTIONS.length})
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  {SAMPLE_TPO_QUESTIONS.map((q, idx) => {
                    const isCurrent = idx === currentQIndex;
                    const isAnswered =
                      q.type === "mcq"
                        ? selectedAnswers[idx] !== undefined
                        : !!writtenAnswers[idx] || !!uploadedFile;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`h-11 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center ${
                          isCurrent
                            ? "bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-glow"
                            : isAnswered
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PALETTE LEGEND */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="size-2.5 rounded-full bg-emerald-500" /> Answered & Saved
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="size-2.5 rounded-full bg-amber-500" /> Currently Viewing
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="size-2.5 rounded-full bg-slate-700" /> Unanswered
                </div>
              </div>
            </aside>

            {/* MAIN QUESTION WORKSPACE */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-6 bg-slate-950">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Question {currentQIndex + 1} of {SAMPLE_TPO_QUESTIONS.length}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-mono">
                      {currentQ.type === "mcq" ? "Aptitude MCQ" : "Recruiter Coding Task"}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    +{currentQ.marks} Marks
                  </span>
                </div>

                <h2 className="text-xl lg:text-2xl font-bold leading-relaxed text-slate-100">
                  {currentQ.text}
                </h2>

                {/* MCQ OPTIONS */}
                {currentQ.type === "mcq" && currentQ.options && (
                  <div className="grid grid-cols-1 gap-3.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-glow"
                              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`size-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                                isSelected
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm font-semibold">{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="size-5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* WRITTEN CODE / RECRUITER ASSIGNMENT */}
                {currentQ.type === "written" && (
                  <div className="space-y-5 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileCode2 className="size-4 text-amber-400" /> Written Response / Algorithm Code
                      </label>
                      <Textarea
                        rows={6}
                        value={writtenAnswers[currentQIndex] || ""}
                        onChange={(e) =>
                          setWrittenAnswers((prev) => ({
                            ...prev,
                            [currentQIndex]: e.target.value,
                          }))
                        }
                        placeholder="Type your code solution or detailed approach here..."
                        className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-2xl p-5 focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    {/* FILE UPLOAD DROPZONE FOR TPO & RECRUITER */}
                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <UploadCloud className="size-4 text-emerald-400" /> Attach Solution File for Recruiter Review
                        </span>
                        {uploadedFile && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                            Attached
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2">
                          <UploadCloud className="size-4" /> Choose File
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.cpp,.java,.py,.zip"
                          />
                        </label>
                        <span className="text-xs font-mono text-slate-400 truncate">
                          {uploadedFile || "No file uploaded yet (.cpp, .py, .pdf, .zip)"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* FOOTER ACTIONS */}
          <footer className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
            <Button
              variant="outline"
              size="sm"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((i) => i - 1)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
            >
              <ChevronLeft className="size-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentQIndex < SAMPLE_TPO_QUESTIONS.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentQIndex((i) => i + 1)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-6"
                >
                  Next Question <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmitExam}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl px-6 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="size-4 mr-2" /> Submit Assessment to TPO
                </Button>
              )}
            </div>
          </footer>
        </div>
      ) : (
        /* RESULT SCREEN AFTER SUBMISSION */
        <div className="flex-1 grid place-items-center p-8 text-center bg-slate-950">
          <div className="max-w-md space-y-6">
            <div className="size-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
              <Award className="size-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                Official Response & Assignment Submitted
              </Badge>
              <h2 className="text-3xl font-extrabold text-white">Placement Assessment Completed!</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your examination answers, written code, uploaded solution file, and proctoring log have been submitted directly to the **Training & Placement Cell (TPO)** & **Recruiter HR Portal**.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Verified Score</p>
              <p className="text-5xl font-extrabold font-mono text-emerald-400">
                {finalScore} / 15
              </p>
              <p className="text-xs text-slate-500 font-mono">Status: Sent to TPO & Recruiter Portal</p>
            </div>

            <Button
              onClick={() => navigate({ to: "/student/lms" })}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl px-8 py-3 font-bold text-sm"
            >
              Return to Student Workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
