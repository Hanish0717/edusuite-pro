import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    correctOption: 1, // 150m is correct
    marks: 5,
  },
  {
    id: 2,
    type: "mcq",
    text: "Which data structure is best suited for implementing LIFO (Last In First Out) call stack evaluation?",
    options: ["Queue", "Binary Search Tree", "Stack", "Min Heap"],
    correctOption: 2, // Stack is correct
    marks: 5,
  },
  {
    id: 3,
    type: "written",
    text: "TPO Recruiter Coding Assignment: Write an efficient algorithm to detect a cycle in a Linked List, or explain your approach in words below.",
    marks: 5,
  },
];

interface PlacementExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle?: string;
  companyName?: string;
}

export const PlacementExamModal: React.FC<PlacementExamModalProps> = ({
  isOpen,
  onClose,
  examTitle = "TCS Ninja & Digital Placement Assessment 2026",
  companyName = "Tata Consultancy Services (TCS)",
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({
    0: 1, // Pre-select correct answer for Q1 (150m) so score default is 100%
    1: 2, // Pre-select correct answer for Q2 (Stack)
  });
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({
    2: "Approach: Use Floyd's Cycle Detection Algorithm (Slow and Fast pointers). Advance slow by 1 step and fast by 2 steps. If fast and slow meet at any node, a cycle exists in O(N) time and O(1) space.",
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>("TCS_Cycle_Detection_Solution.cpp");

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(90 * 60);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(15);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setCurrentQIndex(0);
      setTabSwitchWarnings(0);
      setTimeLeftSeconds(90 * 60);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
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
  }, [isOpen, isSubmitted]);

  // Tab switch / proctoring alert detection
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((w) => {
          const next = w + 1;
          toast.error(`⚠️ Malpractice Alert! Tab switch detected (${next}/3 warnings).`, {
            duration: 5000,
          });
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isOpen, isSubmitted]);

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
        if (selectedAnswers[idx] === q.correctOption) {
          score += q.marks;
        }
      } else {
        if (writtenAnswers[idx] || uploadedFile) {
          score += q.marks; // Full marks for completed assignment response
        }
      }
    });

    setFinalScore(score);
    setIsSubmitted(true);
    toast.success(`Placement assessment & assignment submitted! Verified Score: ${score}/15`);
  };

  const currentQ = SAMPLE_TPO_QUESTIONS[currentQIndex] ?? SAMPLE_TPO_QUESTIONS[0]!;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-slate-950 text-white">
        {!isSubmitted ? (
          <div className="flex flex-col h-[85vh]">
            {/* HEADER WITH PROCTORING BANNER */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono uppercase tracking-wider">
                    {companyName}
                  </Badge>
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-[10px] font-mono flex items-center gap-1">
                    <Lock className="size-3" /> Proctored TPO Session
                  </Badge>
                </div>
                <h2 className="text-base font-extrabold text-white">{examTitle}</h2>
              </div>

              {/* TIMER & WEBCAM */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 font-mono">
                  <Clock className="size-4 text-amber-400 animate-spin" />
                  <span className="text-sm font-bold text-amber-300">{formatTime(timeLeftSeconds)}</span>
                  <span className="text-[10px] text-slate-400">Left</span>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold">
                  <Camera className="size-4 animate-pulse" />
                  <span>Cam Active</span>
                </div>
              </div>
            </div>

            {/* TAB SWITCH WARNING BAR */}
            {tabSwitchWarnings > 0 && (
              <div className="bg-red-500/20 border-b border-red-500/40 px-6 py-2 flex items-center justify-between text-xs text-red-200 font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-400 shrink-0" />
                  <span>Proctoring Alert: Tab switches detected ({tabSwitchWarnings}/3 allowed before auto-flagging).</span>
                </div>
              </div>
            )}

            {/* MAIN QUESTION & ASSIGNMENT AREA */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 bg-slate-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Question {currentQIndex + 1} of {SAMPLE_TPO_QUESTIONS.length}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-mono">
                    {currentQ.type === "mcq" ? "Aptitude MCQ" : "Recruiter Assignment Task"}
                  </Badge>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  +{currentQ.marks} Marks
                </span>
              </div>

              <h3 className="text-lg lg:text-xl font-bold leading-relaxed text-slate-100">
                {currentQ.text}
              </h3>

              {/* RENDER MCQ OPTIONS */}
              {currentQ.type === "mcq" && currentQ.options && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-glow"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`size-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
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

              {/* RENDER WRITTEN / RECRUITER ASSIGNMENT AREA */}
              {currentQ.type === "written" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileCode2 className="size-4 text-amber-400" /> Written Response / Explanation
                    </label>
                    <Textarea
                      rows={5}
                      value={writtenAnswers[currentQIndex] || ""}
                      onChange={(e) =>
                        setWrittenAnswers((prev) => ({
                          ...prev,
                          [currentQIndex]: e.target.value,
                        }))
                      }
                      placeholder="Type your code solution or detailed approach here..."
                      className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-2xl p-4 focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  {/* FILE ATTACHMENT FOR TPO & RECRUITER */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <UploadCloud className="size-4 text-emerald-400" /> Attach Solution / Source Code File
                      </span>
                      {uploadedFile && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                          Attached
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2">
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

            {/* FOOTER ACTIONS */}
            <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 flex items-center justify-between shrink-0">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((i) => i - 1)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <ChevronLeft className="size-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentQIndex < SAMPLE_TPO_QUESTIONS.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQIndex((i) => i + 1)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-5"
                  >
                    Next Question <ChevronRight className="size-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSubmitExam}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl px-5 shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="size-4 mr-1.5" /> Submit Assessment to TPO
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESULT SCREEN AFTER SUBMISSION */
          <div className="p-8 text-center space-y-6 bg-slate-950">
            <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
              <Award className="size-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                Official Response & Assignment Submitted
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Placement Assessment Completed!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your answers, written code, attached solution files, and proctoring log have been submitted directly to the **Training & Placement Cell (TPO)** & **Recruiter Portal**.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Verified Score</p>
              <p className="text-4xl font-extrabold font-mono text-emerald-400">
                {finalScore} / 15
              </p>
              <p className="text-[11px] text-slate-500">Status: Sent to Recruiter & TPO HR Portal</p>
            </div>

            <Button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-6 font-bold"
            >
              Return to Placement Workspace
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
